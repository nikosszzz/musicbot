const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "nowplaying",
        aliases: ['np'],
        description: "Shows the current playing song.",
    },
    execute: (message) => {
        const queue = message.client.queue.get(message.guild.id);

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!queue) return message.channel.send(nothingPlaying);

        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;

        try {
            let nowPlaying = new MessageEmbed()
                .setTitle("Track Player")
                .setAuthor(`Current playing track`)
                .setDescription(`${song.title}`)
                .setURL(`${song.url}`)
                .addField("Requested by", song.req.tag)
                .setColor("#000000")
                .setTimestamp()

            if (song.duration > 0) {
                nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8))
            }
            return message.channel.send(nowPlaying);
        } catch (error) {
            message.channel.send(`An error has occured. {ConsoleErrorLog}`);
            return console.log(error);
        }
    },
};