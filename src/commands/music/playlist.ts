import { type DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { type ChatInputCommandInteraction, type GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Logger } from "@components/Logger";
import { MusicQueue } from "@components/MusicQueue";
import { Playlist } from "@components/Playlist";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Play a playlist from YouTube or SoundCloud.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("The query to search for.")
        ),
    async execute(interaction: ChatInputCommandInteraction, client) {
        const { channel } = (interaction.member as GuildMember).voice;
        const queue = client.queues.get(interaction.guild?.id as string);
        const url = interaction.options.getString("query") as string;

        /* Embeds for music */
        const notInVC = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join a voice channel first.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!channel) return interaction.reply({ embeds: [notInVC], ephemeral: true });
        if (queue && channel.id !== queue.connection.joinConfig.channelId) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });

        const permissions = channel.permissionsFor(interaction.client?.user);
        const botNoPermissions = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("I am missing permissions to join your channel or speak in your voice channel.");

        if (!permissions?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.reply({ embeds: [botNoPermissions], ephemeral: true });

        if (!interaction.deferred) interaction.deferReply();
        let playlist!: Playlist;
        try {
            playlist = await Playlist.from({ url, search: url, interaction });
        } catch (err: any | Error) {
            Logger.error({ type: "INTERNAL:PLAYLIST", err: err });

            return interaction.editReply({ content: "Playlist not found." }).catch((err) => Logger.error({ type: "MUSICCMDS", err: err }));
        }

        if (queue) {
            if (!queue.songs.length) {
                queue.songs.push(...playlist.videos);
                const playlistEmbed = new EmbedBuilder()
                    .setColor("NotQuiteBlack")
                    .setTitle("Track Player")
                    .setDescription("The following playlist is now playing:")
                    .addFields(
                        {
                            name: playlist.data.title ? playlist.data.title : "Spotify Playlist", value: "** **"
                        })
                    .setURL(playlist.data.url as string);

                interaction.editReply({ embeds: [playlistEmbed] }).catch((err: Error) => Logger.error({ type: "MUSICCMDS", err }));
                return queue.enqueue({ songs: [playlist.videos[0]] });
            } else {
                queue.songs.push(...playlist.videos);

                const playlistEmbed = new EmbedBuilder()
                    .setColor("NotQuiteBlack")
                    .setTitle("Track Player")
                    .setDescription("The following playlist has been added to the queue:")
                    .addFields(
                        {
                            name: playlist.data.title ? playlist.data.title : "Spotify Playlist", value: "** **"
                        })
                    .setURL(playlist.data.url as string);

                return interaction.editReply({ embeds: [playlistEmbed] }).catch((err: Error) => Logger.error({ type: "MUSICCMDS", err }));
            }
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

            client.queues.set(interaction.guild?.id as string, newQueue);
            newQueue.songs.push(...playlist.videos);

            await newQueue.enqueue({ songs: [playlist.videos[0]] });
        }

        const playlistEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("The following playlist is now playing:")
            .addFields(
                {
                    name: playlist.data.title ? playlist.data.title : "Spotify Playlist", value: "** **"
                })
            .setURL(playlist.data.url as string);

        return interaction.editReply({ embeds: [playlistEmbed] }).catch((err: Error) => Logger.error({ type: "MUSICCMDS", err }));
    },
} as Command;
