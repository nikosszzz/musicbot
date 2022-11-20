import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, GuildMember, User, Role } from "discord.js";
import { Logger } from "@components/Logger";

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
        const permissions: string[] = [];
        let presence = "Offline";
        let bot;
        let acknowledgements = "None.";
        let member: GuildMember;

        const user: User = interaction.options.getUser("user") as User;

        if (!user) {
            member = interaction.member as GuildMember;
        } else {
            member = interaction.guild?.members.resolve(user) as GuildMember;
            if (!member) {
                return interaction.reply("Could not resolve provided user.");
            }
        }

        /* Permission checks */
        if (member.permissions.has(PermissionFlagsBits.KickMembers)) {
            permissions.push("Kick Members");
        }
        if (member.permissions.has(PermissionFlagsBits.BanMembers)) {
            permissions.push("Ban Members");
        }
        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            permissions.push("Administrator");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            permissions.push("Manage Messages");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            permissions.push("Manage Server");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            permissions.push("Manage Channels");
        }
        if (member.permissions.has(PermissionFlagsBits.MentionEveryone)) {
            permissions.push("Mention Everyone");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            permissions.push("Manage Nicknames");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            permissions.push("Manage Roles");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
            permissions.push("Manage Webhooks");
        }
        if (member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
            permissions.push("Manage Emojis & Stickers");
        }
        if (permissions.length == 0) {
            permissions.push("No Key Permissions found.");
        }

        /* Acknowledgments checks */
        if (member.user.id == interaction.guild?.ownerId) {
            acknowledgements = "Server Owner";
        } else if (member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            acknowledgements = "Server Manager";
        } else if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            acknowledgements = "Server Admin";
        } else if (member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            acknowledgements = "Server Moderator";
        }

        /* Role checks */
        let rolemap = member.roles.cache.map((roles: Role) => `<@&${roles.id}>`).join(", ");

        if (rolemap.length > 1024) rolemap = "Too many roles to display.";
        if (!rolemap) rolemap = "No roles.";

        /* Bot User checks */
        if (member.user.bot === true) {
            bot = "Yes";
        } else {
            bot = "No";
        }

        /* Presence checks */
        if (member?.presence?.status === "dnd") {
            presence = "Do Not Disturb";
        } else if (member?.presence?.status === "idle") {
            presence = "Idle";
        } else if (member?.presence?.status === "online") {
            presence = "Online";
        } else if (!member.presence?.status) {
            presence = "Offline";
        }

        /* Extra information checks */
        const registered = member.user.createdAt.toLocaleString() as string;
        const joined = member.joinedAt?.toLocaleString() as string;
        const userpermissions = permissions.join(", ");

        const infoEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() as string })
            .setThumbnail(member?.user?.avatarURL())
            .addFields(
                {
                    name: "Joined " + interaction.guild?.name, value: joined, inline: true
                },
                {
                    name: "Registered on Discord", value: registered, inline: true
                },
                {
                    name: "Status", value: presence, inline: true
                },
                {
                    name: "Bot User", value: bot, inline: true
                },
                {
                    name: "User Permissions", value: userpermissions, inline: true
                },
                {
                    name: "User Roles", value: rolemap, inline: true
                },
                {
                    name: "Acknowledgments", value: acknowledgements, inline: true
                })
            .setFooter({ text: `Member ID: ${member.id}` });

        return await interaction.reply({ embeds: [infoEmbed] }).catch(err => Logger.error({ type: "UTILITYCMDS", err }));
    },
};
