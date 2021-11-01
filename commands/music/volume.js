const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "volume",
        category: 'music',
        aliases: ["v", "vol"],
        description: "Changes volume of currently playing music.",
    },
    execute: (message, args) => {
        const queue = message.client.queue.get(message.guild.id);

        let notInVC = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join a voice channel first.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(notInVC);
        if (!queue) return message.channel.send(nothingPlaying);

        let currentVolume = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`The current volume is: **${queue.volume}%**.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Integer (0-100)>`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let useNum0100 = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Please use a number between 0 - 100.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args[0]) return message.channel.send(currentVolume);
        if (isNaN(args[0])) return message.channel.send(cmdUsage);
        if (Number(args[0]) > 100 || Number(args[0]) < 0) return message.channel.send(useNum0100);

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        let volumeEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Volume set to: **${queue.volume}%**.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return queue.textChannel.send(volumeEmbed);
    },
};
