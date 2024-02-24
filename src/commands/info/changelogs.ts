import type { Command } from "@common/types";
import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Displays information about the latest Music Bot update."),
    async execute(interaction: CommandInteraction, client) {

        const bugfixes = `- bot: General fixes
        `;

        const whatsnew = `- bot: Updated and upgraded`;

        const UpdateEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Update Changelogs")
            .setDescription("Changelogs for the latest Music Bot update.")
            .addFields(
                {
                    name: "Version", value: client!.version
                },
                {
                    name: "**Bug Fixes**", value: bugfixes.replaceAll("  ", "")
                },
                {
                    name: "**What's new**", value: whatsnew.replaceAll("  ", "")
                }
            );

        return interaction.reply({ embeds: [UpdateEmbed] });
    },
} as Command;
