import type { Command } from "@common/types";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Displays information about the latest Music Bot update."),
    async execute(interaction) {

        const bugfixes = `- queue: Fix double \`Queue ended.\` message from the /stop command
        - queue: Fix an issue where the \`Loading...\` message was not edited to the Now Playing embed.`;

        const whatsnew = `- bot: Updated and upgraded`;

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
