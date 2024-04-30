import type { Command } from "@common/types";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Displays the number of members in the guild."),
    execute(interaction) {
        const guild = interaction.guild!
        const countEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Info | Member Count")
            .addFields({
                name: `${guild.name} Members`, value: `**${guild.memberCount}**`
            });
        return interaction.reply({ embeds: [countEmbed] });
    },
} as Command;