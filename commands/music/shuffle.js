const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "shuffle",
        category: 'music',
        aliases: ["sh"],
        description: "Shuffles the queue.",
    },
    execute: (message) => {
        const queue = message.client.queue.get(message.guild.id);

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInBotChannel = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(notInBotChannel);     
        if (!queue) return message.channel.send(nothingPlaying);

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);

        let shuffleEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`${message.author} started queue shuffle.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        queue.textChannel.send(shuffleEmbed);
    },
};