import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Logger } from "@components/Logger";

export default {
    data: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Displays the number of members in the server."),
    execute(interaction: CommandInteraction) {
        const serverEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Info | Member Count")
            .addFields(
                {
                    name: `${interaction.guild?.name} Members`, value: `**${interaction.guild?.memberCount}**`
                });
        return interaction.reply({ embeds: [serverEmbed] }).catch(err => Logger.error({ type: "INFOCMDS", err }));
    },
};
