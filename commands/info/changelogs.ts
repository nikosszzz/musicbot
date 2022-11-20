import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { bot } from "@bot";

export default {
    data: new SlashCommandBuilder()
        .setName("changelogs")
        .setDescription("Displays information about the latest Music Bot update."),
    async execute(interaction: CommandInteraction) {

        const bugfixes = `- bot: General fixes
        `.replaceAll("    ", "");

        const whatsnew = `- Added SoundCloud support!
        - Music improvements!`.replaceAll("    ", "");

        const UpdateEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Update Changelogs")
            .setDescription("Changelogs for the latest Music Bot Stable update.")
            .addFields(
                {
                    name: "Version",
                    value: bot.version
                },
                {
                    name: "** Bug Fixes**", value: bugfixes
                },
                {
                    name: "**What's new**", value: whatsnew
                });

        return interaction.reply({ embeds: [UpdateEmbed] });
    },
};
