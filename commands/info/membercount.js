const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'membercount',
        aliases: ['members', 'mc', 'mcount'],
        description: 'Displays total members of the server the command is ran in.',
    },
    execute: (message) => {
        let serverEmbed = new MessageEmbed()
            .setColor(`#000000`)
            .setTitle(`Info | Member Count`)
            .addField(`${message.guild.name} Members`, `**${message.guild.memberCount}**`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return message.channel.send(serverEmbed).catch(console.error);
    },
};