import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { splitBar } from "string-progressbar";
import { bot } from "@bot";
import { Logger } from "@components/Logger";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the current playing song."),
    execute(interaction: CommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

        const nothingPlaying = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        const song = queue.songs[0];
        const seek = queue.resource.playbackDuration / 1000;
        const left = song.duration - seek;

        try {
            const nowPlaying = new EmbedBuilder()
                .setColor("#000000")
                .setAuthor({ name: "Track Player | Current playing track" })
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.title}](${song.url})`)
                .setURL(song.url);

            if (song.duration > 0) {
                nowPlaying.addFields(
                    {
                        name: "\u200b",
                        value: new Date(seek * 1000).toISOString().substr(11, 8) +
                            "** **[" +
                            splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                            "]** **" +
                            (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
                        inline: false
                    });

                nowPlaying.setFooter({ text: "Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8) });
            }

            return interaction.reply({ embeds: [nowPlaying] });
        } catch (err: any) {
            interaction.reply("An error has occured. Error has been reported.");
            return Logger.error({ type: "MUSICCMDS", err });
        }
    },
};
