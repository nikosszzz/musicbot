import { type GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import type { Song } from "@components/Song";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to the selected queue number.")
        .addNumberOption(option =>
            option
                .setName("queue_number")
                .setDescription("The queue number to skip to.")
                .setRequired(true)
        ),
    execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild?.id as string);
        const skipNum: number = interaction.options.getNumber("queue_number") as number;

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        const queueLength = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`The queue is only ${queue?.songs.length} tracks long.`);

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });
        if (skipNum > queue.songs.length) return interaction.reply({ embeds: [queueLength], ephemeral: true });

        if (queue.loop) {
            for (let i = 0; i < skipNum - 2; i++) {
                queue.songs.push(queue.songs.shift() as Song);
            }
        } else {
            queue.songs = queue.songs.slice(skipNum - 2);
        }
        queue.player.stop();

        const skipEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} skipped ${skipNum - 1} tracks.`);

        return interaction.reply({ embeds: [skipEmbed] });
    },
} as Command;
