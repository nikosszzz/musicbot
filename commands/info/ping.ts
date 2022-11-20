import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Logger } from "@components/Logger";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the API and bot latency."),
    execute(interaction: CommandInteraction) {
        const botlatency: number = Date.now() - interaction.createdTimestamp;
        const apilatency: number = Math.round(interaction.client.ws.ping);

        const pingEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Info | Latency")
            .setDescription("Music Bot's Latency and the Latency to the Discord API.")
            .addFields(
                {
                    name: "Bot Latency", value: botlatency + "ms", inline: true
                },
                {
                    name: "API Latency", value: apilatency + "ms", inline: true
                });
        return interaction.reply({ embeds: [pingEmbed], ephemeral: true }).catch((err: any) => Logger.error({ type: "INFOCMDS", err }));
    },
};
