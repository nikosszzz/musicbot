import { Channel, ChannelType, CommandInteraction, EmbedBuilder, GuildMember, GuildVerificationLevel, SlashCommandBuilder } from "discord.js";
import { Logger } from "@components/Logger";

export default {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Displays information about the server."),
    async execute(interaction: CommandInteraction) {
        let verification = "Unknown.";
        const owner: GuildMember = await interaction.guild?.fetchOwner() as GuildMember;

        /* Verification level checks */
        if (interaction.guild?.verificationLevel === GuildVerificationLevel.None)
            verification = "No level set.";
        if (interaction.guild?.verificationLevel === GuildVerificationLevel.Low)
            verification = "Low.";
        if (interaction.guild?.verificationLevel === GuildVerificationLevel.Medium)
            verification = "Medium.";
        if (interaction.guild?.verificationLevel === GuildVerificationLevel.High)
            verification = "High.";
        if (interaction.guild?.verificationLevel === GuildVerificationLevel.VeryHigh)
            verification = "Highest.";

        const serverEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({ name: interaction.guild?.name as string, iconURL: interaction.guild?.iconURL() as string })
            .setThumbnail(interaction.guild?.iconURL() as string)
            .addFields(
                {
                    name: "Owner", value: owner?.user.tag, inline: true
                },
                {
                    name: "Member Count", value: interaction.guild?.memberCount + " members.", inline: true
                },
                {
                    name: "Emoji Count", value: interaction.guild?.emojis.cache.size + " emojis.", inline: true
                },
                {
                    name: "Roles Count", value: interaction.guild?.roles.cache.size + " roles.", inline: true
                },
                {
                    name: "Categories Count", value: interaction.guild?.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildCategory).size + " categories.", inline: true
                },
                {
                    name: "Voice Channels Count", value: interaction.guild?.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildVoice).size + " channels.", inline: true
                },
                {
                    name: "Text Channels Count", value: interaction.guild?.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildText).size + " channels.", inline: true
                },
                {
                    name: "Boosts Count", value: interaction.guild?.premiumSubscriptionCount + " Boosts.", inline: true
                },
                {
                    name: "Boosts Level", value: "Level " + interaction.guild?.premiumTier + ".", inline: true
                },
                {
                    name: "Verification Level", value: verification, inline: true
                },
                {
                    name: "Features", value: `${interaction.guild?.features.join(", ")}`
                })
            .setFooter({ text: "ID: " + interaction.guild?.id + " | Created at " + interaction.guild?.createdAt.toLocaleString() });

        return await interaction.reply({ embeds: [serverEmbed] }).catch(err => Logger.error({ type: "UTILITYCMDS", err }));
    }
};
