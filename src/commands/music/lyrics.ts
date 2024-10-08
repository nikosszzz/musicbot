import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import lyrics from "@joehoel/lyric-finder";
import { Logger } from "@components/Logger";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Fetch lyrics for the currently playing song."),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        if (!queue || !queue.songs || !queue.songs.length) return await interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        let lyricsSearch = null;
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
            lyricsSearch = await lyrics.default(title);
            if (!lyricsSearch?.lyrics) return await interaction.editReply({ embeds: [lyricsNotFound] });

            const lyricsEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setTitle(`${queue.songs[0].title} - Lyrics`)
                .setDescription(lyricsSearch.lyrics);

            if ((lyricsEmbed.data.description?.length as number) >= 2048)
                lyricsEmbed.data.description = lyricsEmbed.data.description?.substring(0, 2045) + "...";
            return await interaction.editReply({ embeds: [lyricsEmbed] });
        } catch (err: any) {
            Logger.error({ type: "MUSICCMDS", err: err });
            return await interaction.editReply({ embeds: [lyricsNotFound] });
        }
    },
} as Command;
