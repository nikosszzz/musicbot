import { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, type GuildMember } from "discord.js";
import { Logger } from "@components/Logger";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Displays information about provided user.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a User from this Guild.")
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const member = user ? interaction.guild!.members.resolve(user) : interaction.member as GuildMember;

        if (!member) return await interaction.editReply("Could not resolve the provided user.");

        const desiredPermissions = [
            "KickMembers",
            "BanMembers",
            "Administrator",
            "ManageMessages",
            "ManageGuild",
            "ManageChannels",
            "MentionEveryone",
            "ManageNicknames",
            "ManageRoles",
            "ManageWebhooks",
            "ManageGuildExpressions",
        ];

        const permissions = member.permissions.toArray().filter(permission => desiredPermissions.includes(permission)).map(perm => perm);

        const acknowledgements = member.user.id === interaction.guild!.ownerId
            ? "Server Owner"
            : member.permissions.has(PermissionFlagsBits.ManageGuild)
                ? "Server Manager"
                : member.permissions.has(PermissionFlagsBits.Administrator)
                    ? "Server Admin"
                    : member.permissions.has(PermissionFlagsBits.ManageMessages)
                        ? "Server Moderator"
                        : "Unknown.";

        let rolemap = member.roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(", ");

        const infoEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() ?? undefined })
            .setThumbnail(member.user.avatarURL())
            .addFields(
                {
                    name: "Joined " + interaction.guild!.name,
                    value: member.joinedAt!.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Registered on Discord",
                    value: member.user.createdAt.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Bot User",
                    value: member.user.bot ? "Yes" : "No",
                    inline: true,
                },
                {
                    name: "User Permissions",
                    value: permissions.join(", "),
                    inline: true,
                },
                {
                    name: "User Roles",
                    value: rolemap.length > 1024 ? "Too many roles to display." : rolemap || "No roles.",
                    inline: true,
                },
                {
                    name: "Acknowledgments",
                    value: acknowledgements,
                    inline: true,
                }
            )
            .setFooter({ text: `Member ID: ${member.id}` });

        return await interaction.editReply({ embeds: [infoEmbed] }).catch(err => Logger.error({ type: "UTILITYCMDS", err: err }));
    }
} as Command;