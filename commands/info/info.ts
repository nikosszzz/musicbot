import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder, version as djsVersion } from "discord.js";
import { bot } from "@bot";
import { Logger } from "@components/Logger";
import { timeConverter } from "@utils/timeConverter";
import { hash } from "@utils/hash";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about the bot."),
    async execute(interaction: CommandInteraction, client: Client) {
        const infoEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({ name: "Music Bot", iconURL: client.user?.avatarURL() as string })
            .addFields(
                {
                    name: "Version",
                    value: bot.version + "-" + bot.branch,
                    inline: true
                }, {
                    name: "Library",
                    value: `Discord.JS **${djsVersion}**`,
                    inline: true
                }, {
                    name: "Developer",
                    value: "nikoszz#1004",
                    inline: true
                }, {
                    name: "Servers",
                    value: `${client.guilds.cache.size}`,
                    inline: true
                }, {
                    name: "Users",
                    value: `${client.users.cache.size}`,
                    inline: true
                }, {
                    name: "Language",
                    value: "TypeScript",
                    inline: true
                })
            .setFooter({ text: "Uptime: " + timeConverter.formatSeconds(Math.floor(process.uptime())) + " | Git Hash: " + hash() });
        return interaction.reply({ embeds: [infoEmbed] }).catch((err: any) => Logger.error({ type: "INFOCMDS", err }));
    },
};
