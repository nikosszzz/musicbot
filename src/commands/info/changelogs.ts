import type { Command } from "@common";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Displays information about the latest Music Bot update."),
    async execute(interaction) {

        const bugfixes = `- None`;

        const whatsnew = `- bot: Updated and upgraded
        - codebase: Update to ESM format
        - lyrics: New package used for lyrics`;

        const UpdateEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Changelogs")
            .setDescription("Check out what's new and fixes implemented in the latest Music Bot update!")
            .addFields(
                {
                    name: "Version", value: interaction.client.version
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
