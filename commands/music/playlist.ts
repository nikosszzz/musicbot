import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceState } from "discord.js";
import { bot } from "@bot";
import { Logger } from "@components/Logger";
import { MusicQueue } from "@components/MusicQueue";
import { Playlist } from "@components/Playlist";

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Play a playlist from YouTube or SoundCloud.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("The query to search for.")
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const { channel }: VoiceState = (interaction.member as GuildMember).voice;
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
        const url = interaction.options.getString("query") as string;

        /* Embeds for music */
        const notInVC = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("You need to join a voice channel first.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!channel) return interaction.reply({ embeds: [notInVC], ephemeral: true });
        if (queue && channel.id !== queue.connection.joinConfig.channelId) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });

        const permissions = channel.permissionsFor(interaction.client?.user);
        const botNoPermissions = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("I am missing permissions to join your channel or speak in your voice channel.");

        if (!permissions?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.reply({ embeds: [botNoPermissions], ephemeral: true });

        interaction.deferReply();
        let playlist!: Playlist;
        try {
            playlist = await Playlist.from({ url, search: url, interaction });
        } catch (err: any) {
            Logger.error({ type: "INTERNAL:PLAYLIST", err: err.stack });

            console.log(url);
            return interaction.editReply({ content: "Playlist not found." }).catch(console.error);
        }

        if (queue) {
            queue.songs.push(...playlist.videos);
        } else {
            const newQueue = await new MusicQueue({
                options: {
                    interaction,
                    connection: joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
                    })
                }
            });

            bot.queues.set(interaction.guild?.id as string, newQueue);
            newQueue.songs.push(...playlist.videos);

            await newQueue.enqueue({ songs: [playlist.videos[0]] });
        }

        const playlistEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("The following playlist has been added to the queue:")
            .addFields(
                {
                    name: playlist.data.title ? playlist.data.title : "Spotify Playlist", value: "** **"
                })
            .setURL(playlist.data.url as string);

        if ((playlistEmbed.data.description?.length as number) >= 2048)
            playlistEmbed.data.description =
                playlistEmbed.data.description?.substr(0, 2007) as string;

        return interaction.editReply({ embeds: [playlistEmbed] }).catch((err: any) => Logger.error({ type: "MUSICCMDS", err }));
    },
};
