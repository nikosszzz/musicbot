const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "skip",
        category: 'music',
        aliases: ["s"],
        description: "Skips the currently playing song.",
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

        queue.playing = true;
        queue.connection.dispatcher.end();

        let skipEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`${message.author} skipped the track.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        queue.textChannel.send(skipEmbed);
    },
};