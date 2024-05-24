import type { Command } from "@common";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Displays information about the latest Music Bot update."),
    async execute(interaction) {

        const bugfixes = `- handlers(command): Fix crash when replying to a already replied and/or deferred interaction
        - lyrics: Fix possible crash`;

        const whatsnew = `- bot: Updated and upgraded
        - playlist: Removed unnecessary similar code for the playlist message
        - music(internals): Added one check in the inactivity leave`;

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
