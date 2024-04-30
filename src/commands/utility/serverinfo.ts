import { ChannelType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Logger } from "@components/Logger";
import type { Command } from "@common/types";

export default {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Displays information about the guild."),
    async execute(interaction) {
        const guild = interaction.guild!;
        const owner = await guild.fetchOwner();
        const verificationLevels = {
            0: "No level set.",
            1: "Low.",
            2: "Medium.",
            3: "High.",
            4: "Highest."
        };

        const infoEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined })
            .setThumbnail(guild.iconURL())
            .addFields(
                {
                    name: "Owner", value: owner.user.tag, inline: true
                },
                {
                    name: "Member Count", value: `${guild.memberCount} members.`, inline: true
                },
                {
                    name: "Emoji Count", value: `${guild.emojis.cache.size} emojis.`, inline: true
                },
                {
                    name: "Roles Count", value: `${guild.roles.cache.size} roles.`, inline: true
                },
                {
                    name: "Categories Count", value: `${guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size} categories.`, inline: true
                },
                {
                    name: "Voice Channels Count", value: `${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size} channels.`, inline: true
                },
                {
                    name: "Text Channels Count", value: `${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size} channels.`, inline: true
                },
                {
                    name: "Boosts Count", value: `${guild.premiumSubscriptionCount} Boosts.`, inline: true
                },
                {
                    name: "Boosts Level", value: `Level ${guild.premiumTier}.`, inline: true
                },
                {
                    name: "Verification Level", value: verificationLevels[guild.verificationLevel], inline: true
                },
                {
                    name: "Features", value: `${guild.features.join(", ")}`
                })
            .setFooter({ text: "ID: " + guild.id + " | Created at " + guild.createdAt.toLocaleString() });

        return await interaction.reply({ embeds: [infoEmbed] }).catch(err => Logger.error({ type: "UTILITYCMDS", err: err }));
    }
} as Command;