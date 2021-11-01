const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "pause",
        category: 'music',
        description: "Pauses the queue.",
    },
    execute: async function (message) {
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

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause();
            queue.connection.dispatcher.resume();

            let pauseEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Track Player`)
                .setDescription(`${message.author} paused the queue.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return queue.textChannel.send(pauseEmbed);
        };
    },
};