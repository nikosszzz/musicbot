import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, type GuildMember, type User, type PresenceStatus } from "discord.js";
import { Logger } from "@components/Logger";
import type { Command } from "@common/types";

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
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const presences = {
            idle: "Idle",
            online: "Online",
            dnd: "Do Not Disturb",
            offline: "Offline",
            invisible: "Invisible"
        };

        const user = interaction.options.getUser("user") as User;
        const member = user ? (interaction.guild?.members.resolve(user) as GuildMember) : (interaction.member as GuildMember);

        if (!member) {
            return interaction.reply("Could not resolve the provided user.");
        }

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

        const permissions = member.permissions.toArray().filter(permission => desiredPermissions.includes(permission)).map(perm => PermissionFlagsBits[perm]);

        const acknowledgements = member.user.id === interaction.guild?.ownerId
            ? "Server Owner"
            : member.permissions.has(PermissionFlagsBits.ManageGuild)
                ? "Server Manager"
                : member.permissions.has(PermissionFlagsBits.Administrator)
                    ? "Server Admin"
                    : member.permissions.has(PermissionFlagsBits.ManageMessages)
                        ? "Server Moderator"
                        : "Unknown.";

        let rolemap = member.roles.cache.map(roles => `<@&${roles.id}>`).join(", ");
        rolemap = rolemap.length > 1024 ? "Too many roles to display." : rolemap || "No roles.";

        const infoEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() as string })
            .setThumbnail(member?.user?.avatarURL())
            .addFields(
                {
                    name: "Joined " + interaction.guild?.name,
                    value: member.joinedAt?.toLocaleString() as string,
                    inline: true,
                },
                {
                    name: "Registered on Discord",
                    value: member.user.createdAt.toLocaleString() as string,
                    inline: true,
                },
                {
                    name: "Status",
                    value: presences[member.presence?.status as PresenceStatus],
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
                    value: rolemap,
                    inline: true,
                },
                {
                    name: "Acknowledgments",
                    value: acknowledgements,
                    inline: true,
                }
            )
            .setFooter({ text: `Member ID: ${member.id}` });

        return await interaction.reply({ embeds: [infoEmbed] }).catch(err => Logger.error({ type: "UTILITYCMDS", err: err }));
    }
} as Command;