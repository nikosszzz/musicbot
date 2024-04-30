import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { Logger } from "@components/Logger";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Fetch lyrics for the currently playing song."),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild?.id as string);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        if (!queue || !queue.songs || !queue.songs.length) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        let lyrics = null;
        const title = queue.songs[0].title;

        /* Embeds for music */
        const lyricsFetch = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("Fetching lyrics...");

        const lyricsNotFound = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`No lyrics found for **${title}**.`);


        await interaction.reply({ embeds: [lyricsFetch], ephemeral: true });

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) return interaction.editReply({ embeds: [lyricsNotFound] });
        } catch (err: any) {
            Logger.error({ type: "MUSICCMDS", err });
            return interaction.editReply({ embeds: [lyricsNotFound] });
        }

        const lyricsEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle(`${queue.songs[0].title} - Lyrics`)
            .setDescription(lyrics);

        if ((lyricsEmbed.data.description?.length as number) >= 2048)
            lyricsEmbed.data.description = lyricsEmbed.data.description?.substr(0, 2045) + "..." as string;
        return interaction.editReply({ embeds: [lyricsEmbed] });
    },
} as Command;
