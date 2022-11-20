import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Config } from "@common/types";
import { writeFile } from "node:fs";
import { Logger } from "@components/Logger";

export default {
    data: new SlashCommandBuilder()
        .setName("pruning")
        .setDescription("Toggles pruning of bot messages."),
    async execute(interaction: CommandInteraction) {
        let config: Config | undefined;

        try {
            config = require("../../config.json");
        } catch (err: any) {
            config = undefined;
            Logger.error({ type: "MUSICCMDS", err });
        }

        if (config) {
            config.PRUNING = !config.PRUNING;

            writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
                if (err) {
                    Logger.error({ type: "MUSICCMDS", err });
                    return interaction.reply({ content: "There was an error writing to the file.", ephemeral: true });
                }

                const pruneEmbed = new EmbedBuilder()
                    .setColor("#000000")
                    .setTitle("Track Player")
                    .setDescription(`Message pruning ${config?.PRUNING ? "**enabled**." : "**disabled**."}`);

                return interaction.reply({ embeds: [pruneEmbed] });
            });
        }
    },
};
