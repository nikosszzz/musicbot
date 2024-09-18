import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("pruning")
        .setDescription("Toggles pruning of bot messages."),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is no queue currently.");
        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        queue.pruning = !queue.pruning;
        const pruneEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`Message pruning ${queue.pruning ? "**enabled**." : "**disabled**."}`);

        return await interaction.reply({ embeds: [pruneEmbed] });
    },
} as Command;
