import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Logger } from "@components/Logger";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the API and Bot latency."),
    execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Info | Latency")
            .setDescription("Music Bot's Latency and the Latency to the Discord API.")
            .addFields(
                {
                    name: "Bot Latency", value: `${new Date().getTime() - interaction.createdTimestamp}ms`, inline: true
                },
                {
                    name: "API Latency", value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true
                }
            );
        return interaction.reply({ embeds: [pingEmbed], ephemeral: true }).catch((err: Error) => Logger.error({ type: "INFOCMDS", err: err }));
    },
} as Command;