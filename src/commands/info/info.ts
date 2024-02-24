import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder, version as djsVersion } from "discord.js";
import { Logger } from "@components/Logger";
import { timeConverter } from "@utils/timeConverter";
import { hash } from "@utils/hash";
import type { Command } from "@common/types";
import { version } from "node:process";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about the bot."),
    async execute(interaction: CommandInteraction, client) {
        const infoEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: "Music Bot", iconURL: client.user?.avatarURL() as string })
            .addFields(
                {
                    name: "Version",
                    value: `${client.version} ${client.branch}`,
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
                    value: `${client?.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: "Users",
                    value: `${client?.users.cache.size}`,
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
