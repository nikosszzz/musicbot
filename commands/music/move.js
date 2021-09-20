const
    { MessageEmbed } = require('discord.js'),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue"),
    move = require('array-move');

module.exports = {
    config: {
        name: "move",
        aliases: ["mv"],
        description: "Move tracks to a different position in the queue.",
    },
    execute: (message, args) => {
        const queue = message.client.queue.get(message.guild.id);

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let usagevc1 = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Queue Number>`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let joinVCF = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(joinVCF);    
        if (!queue) return message.channel.send(nothingPlaying);
        if (!args.length || isNaN(args[0]) || args[0] <= 1) return message.channel.send(usagevc1);

        let song = queue.songs[args[0] - 1];
        queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);

        let movedEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`${message.author} moved **${song.title}** to ${args[1] == 1 ? 1 : args[1]} in the queue.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        queue.textChannel.send(movedEmbed);
    },
};