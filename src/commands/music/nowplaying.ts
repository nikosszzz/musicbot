import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { splitBar } from "string-progressbar";
import { Logger } from "@components/Logger";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the current playing song."),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        if (!queue) return await interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        const song = queue.songs[0];
        const seek = queue.resource.playbackDuration / 1000;
        const left = song.duration - seek

        try {
            const nowPlaying = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setAuthor({ name: "Track Player | Current playing track" })
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.title}](${song.url})`)
                .setURL(song.url);

            if (song.duration > 0) {
                nowPlaying.addFields(
                    {
                        name: "\u200b",
                        value: new Date(seek * 1000).toISOString().substring(11, 8) +
                            "** **[" +
                            splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                            "]** **" +
                            (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substring(11, 8)),
                        inline: false
                    });

                nowPlaying.setFooter({ text: "Time Remaining: " + new Date(left * 1000).toISOString().substring(11, 8) });
            }

            return await interaction.reply({ embeds: [nowPlaying] });
        } catch (err: any | Error) {
            interaction.reply("An error has occured. Error has been reported.");
            return Logger.error({ type: "MUSICCMDS", err: err });
        }
    },
} as Command;
