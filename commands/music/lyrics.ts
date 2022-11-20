import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, CommandInteraction } from "discord.js";
import { bot } from "@bot";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { Logger } from "@components/Logger";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Fetch lyrics for the currently playing song."),
    async execute(interaction: CommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

        let lyrics = null;
        const title = queue.songs[0].title;

        /* Embeds for music */
        const lyricsFetch = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("Fetching lyrics...");

        const lyricsNotFound = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`No lyrics found for **${title}**.`);

        const nothingPlaying = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        if (!queue.songs || !queue.songs.length) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });
        await interaction.reply({ embeds: [lyricsFetch], ephemeral: true });

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) return interaction.editReply({ embeds: [lyricsNotFound] });
        } catch (err: any) {
            Logger.error({ type: "MUSICCMDS", err });
            return interaction.editReply({ embeds: [lyricsNotFound] });
        }

        const lyricsEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle(`${queue.songs[0].title} - Lyrics`)
            .setDescription(lyrics);

        if ((lyricsEmbed.data.description?.length as number) >= 2048)
            lyricsEmbed.data.description = lyricsEmbed.data.description?.substr(0, 2045) + "..." as string;
        return interaction.editReply({ embeds: [lyricsEmbed] });
    },
};
