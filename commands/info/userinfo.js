const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "userinfo",
        aliases: [`user`, `whois`],
        description: "Displays information about provider user.",
    },
    execute: async (message, args) => {
        var permissions = [];
        var acknowledgements = 'None.';
        let member;

        if (!args.length) {
            member = message.guild.member(message.author);
        } else {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.channel.send(`Could not fetch a user with the ID: **${args[0]}**.`);
            };
        };

        if (member.hasPermission("KICK_MEMBERS")) {
            permissions.push("Kick Members");
        }

        if (member.hasPermission("BAN_MEMBERS")) {
            permissions.push("Ban Members");
        }

        if (member.hasPermission("ADMINISTRATOR")) {
            permissions.push("Administrator");
        }

        if (member.hasPermission("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
        }

        if (member.hasPermission("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
        }

        if (member.hasPermission("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
        }

        if (member.hasPermission("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
        }

        if (member.hasPermission("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
        }

        if (member.hasPermission("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
        }

        if (member.hasPermission("MANAGE_EMOJIS")) {
            permissions.push("Manage Emojis");
        }

        if (permissions.length == 0) {
            permissions.push("No Key Permissions Found.");
        }

        if (member.user.id == message.guild.ownerID) {
            acknowledgements = 'Server Owner';
        }

        if (message.member.roles.cache.some(r => ["Founders"].includes(r.name))) {
            acknowledgements = 'Server Owner';
        }

        if (message.member.roles.cache.some(r => ["Administrator", "Head Administrator", "Manager", "Owners", "𝐸𝓍𝑜𝓉𝒾𝒸𝒵𝒵"].includes(r.name))) {
            acknowledgements = 'Server Admin';
        }

        if (message.member.roles.cache.some(r => ["Discord Trainee", "Discord Moderator"].includes(r.name))) {
            acknowledgements = 'Server Moderator';
        }

        let rolemap = member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id}>`).join(", ");

        if (rolemap.length > 1024) rolemap = "Too many roles to display.";
        if (!rolemap) rolemap = "No roles.";

        if (member.user.bot === true) {
            bot = "Yes";
        } else {
            bot = "No";
        };

        if (member.presence.status === 'dnd')
            status = 'Do Not Disturb';
        if (member.presence.status === 'idle')
            status = 'Idle';
        if (member.presence.status === 'online')
            status = 'Online';
        if (member.presence.status === 'offline')
            status = 'Offline';

        let registered = new Date(member.user.createdTimestamp).toDateString();
        let joined = `${member.joinedAt.toDateString()} at ${member.joinedAt.toTimeString()}`;
        let userpermissions = permissions.join(", ");

        let infoEmbed = new MessageEmbed()
            .setColor(000000)
            .setTitle(`Info | ${member.user.tag}`)
            .setThumbnail(member.user.avatarURL())
            .addField(`Joined ${message.guild.name}`, joined)
            .addField(`Registered on Discord`, registered)
            .addField(`Status`, status)
            .addField(`Bot User`, bot)
            .addField(`User Permissions`, userpermissions)
            .addField(`User Roles`, rolemap)
            .addField(`Acknowledgmenets`, acknowledgements)
            .setTimestamp()
            .setFooter(`Member ID: ${member.id}`)

        return message.channel.send(infoEmbed).catch(console.error);
    },
};