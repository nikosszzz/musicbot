const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "skipto",
        category: 'music',
        aliases: ["st"],
        description: "Skips to the selected queue number.",
    },
    execute: (message, args) => {
        const queue = message.client.queue.get(message.guild.id);

        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Queue Number>`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let queueLength = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`The queue is only ${queue.songs.length} tracks long.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInBotChannel = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args.length || isNaN(args[0])) return message.channel.send(cmdUsage);
        if (!canModifyQueue(message.member)) return message.channel.send(notInBotChannel);
        if (!queue) return message.channel.send(nothingPlaying);
        if (args[0] > queue.songs.length) return message.channel.send(queueLength);

        queue.playing = true;

        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }

        queue.connection.dispatcher.end();

        let skipEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`${message.author} skipped ${args[0] - 1} tracks.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return queue.textChannel.send(skipEmbed);
    },
};