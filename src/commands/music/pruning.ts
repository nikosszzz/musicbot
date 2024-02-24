import { EmbedBuilder, type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "@common/types";
import { config } from "@components/config";

export default {
    data: new SlashCommandBuilder()
        .setName("pruning")
        .setDescription("Toggles pruning of bot messages."),
    async execute(interaction: CommandInteraction) {
        config.PRUNING = !config.PRUNING;

        const pruneEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`Message pruning ${config?.PRUNING ? "**enabled**." : "**disabled**."}`);

        return interaction.reply({ embeds: [pruneEmbed] });
    },
} as Command;
