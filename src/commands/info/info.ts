import { EmbedBuilder, SlashCommandBuilder, version as djsVersion } from "discord.js";
import { Logger } from "@components/Logger";
import { timeConverter, hash } from "@utils";
import type { Command } from "@common";
import { version } from "node:process";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about the bot."),
    async execute(interaction) {

        const infoEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: "Music Bot", iconURL: interaction.client.user.avatarURL() ?? undefined })
            .addFields(
                {
                    name: "Version",
                    value: `${interaction.client.version} ${interaction.client.branch}`,
                    inline: true
                },
                {
                    name: "Library",
                    value: `Discord.JS **${djsVersion}**`,
                    inline: true
                },
                {
                    name: "Developer",
                    value: "deoptimize",
                    inline: true
                },
                {
                    name: "Servers",
                    value: `${interaction.client.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: "Node.JS Version",
                    value: version,
                    inline: true
                },
                {
                    name: "Language",
                    // @ts-expect-error
                    value: `TypeScript ${__TYPESCRIPTVERSION__}`,
                    inline: true
                }
            )
            .setFooter({ text: `Uptime: ${timeConverter.formatSeconds(Math.floor(process.uptime()))} | Git Hash: ${hash}` });
        return interaction.reply({ embeds: [infoEmbed] }).catch((err: any) => Logger.error({ type: "INFOCMDS", err }));
    },
} as Command;
