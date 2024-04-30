import { type GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the currently playing song."),
    execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild?.id as string);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: (interaction.member as GuildMember) })) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        queue.player.stop(true);

        const skipEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} skipped the track.`);

        interaction.reply({ embeds: [skipEmbed] });
    },
} as Command;
