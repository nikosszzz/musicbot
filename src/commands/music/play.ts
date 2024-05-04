import { type DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { type GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { MusicQueue } from "@components/MusicQueue";
import { Song } from "@components/Song";
import { Logger } from "@components/Logger";
import play from "play-dl";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays audio from YouTube, Spotify or SoundCloud.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("The query to search for.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { channel } = (interaction.member as GuildMember).voice;
        const queue = interaction.client.queues.get(interaction.guild?.id as string);
        const url: string = interaction.options.getString("query") as string;

        const notInVC = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join a voice channel first.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`You must be in the same channel as ${interaction.client?.user}.`);

        if (!channel) return interaction.reply({ embeds: [notInVC], ephemeral: true });
        if (queue && channel.id !== queue.connection.joinConfig.channelId) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });

        const permissions = channel.permissionsFor(interaction.client?.user);
        const botNoPermissions = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("I am missing permissions to join your channel or speak in your voice channel.");

        if (!permissions?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.reply({ embeds: [botNoPermissions], ephemeral: true });

        if (play.yt_validate(url) === "playlist" || await play.so_validate(url) === "playlist" || play.sp_validate(url) === "album" || play.sp_validate(url) === "playlist") {
            return interaction.reply({ content: "Playlist was provided, please use the `playlist` command.", ephemeral: true });
        }

        await interaction.reply({ content: "⏳ Loading..." });

        let song: Song;
        try {
            song = await Song.from({ url, search: url, interaction });
        } catch (err: any | Error) {
            interaction.editReply({ content: "An error occured in the Music system! Song was not added." });
            return Logger.error({ type: "CMDS/PLAY", err: err });
        }

        if (queue) {
            if (!queue.songs.length) {
                return queue.enqueue({ songs: [song] });
            } else {
                queue.songs.push(song);
            }

            const songAdd = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setTitle("Track Player")
                .setDescription(`**${song.title}** has been added to the queue by ${interaction.user}.`)
                .setThumbnail(song.thumbnail);

            return await interaction.editReply({ content: " ", embeds: [songAdd] }).catch(err => Logger.error({ type: "MUSICCMDS", err }));
        } else {
            const newQueue = new MusicQueue({
                options: {
                    interaction,
                    connection: joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
                    })
                }
            });

            interaction.client.queues.set(interaction.guild?.id as string, newQueue);

            return await newQueue.enqueue({ songs: [song] });
        }
    }
} as Command;
