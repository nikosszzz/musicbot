const
    { MessageEmbed } = require('discord.js'),
    guildModel = require('../../assets/database/guild');

module.exports = {
    config: {
        name: 'guildsettings',
        aliases: ['gs', 'settings'],
        description: 'Displays settings for the guild the command is ran in.',
    },
    execute: async (message, args) => {
        let guildPrefs = await guildModel.findOne({ GuildID: message.guild.id }).catch(err => console.log(err));
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const type = args[0];

            switch (type) {
                case "prefix":
                    {
                        const prefix = args[1];

                        if (!prefix) {
                            return message.channel.send(`You didn't specify a prefix.`);
                        };

                        await guildModel.findOneAndUpdate({ GuildID: message.guild.id, }, { Prefix: prefix }, { upsert: true, useFindAndModify: false })
                        message.channel.send(`Successfully set this server's prefix to **__${prefix}__**.`);
                    };
                default:
                    {
                        if (args[1]) {
                            return;
                        }
                        let serversettings = new MessageEmbed()
                            .setColor('#000000')
                            .setTitle('Server | Settings')
                            .setDescription(`Prefix: ${guildPrefs.Prefix}\nGuild ID: ${guildPrefs.GuildID}`)
                            .setFooter(`You can change each setting with the following arguments: prefix.`)

                        return message.channel.send(serversettings);
                    };
            };
        } else {
            let missingperms = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Fun | Information`)
                .setDescription(`You do not have permission to use the settings command.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            message.channel.send(missingperms);
            return;
        };
    },
};