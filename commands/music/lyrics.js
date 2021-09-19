const
    { MessageEmbed } = require("discord.js"),
    lyricsFinder = require("lyrics-finder");

module.exports = {
    config: {
        name: "lyrics",
        aliases: ["ly"],
        description: "Fetch lyrics for the currently playing song.",
    },
    execute: async (message) => {
        const queue = message.client.queue.get(message.guild.id);

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!queue) return message.channel.send(nothingPlaying);

        let lyrics = null;
        message.channel.send("⌛ Fetching lyrics...");

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = (`No lyrics found for **${queue.songs[0].title}**.`);
        } catch (error) {
            lyrics = (`No lyrics were found for **${queue.songs[0].title}**.`);
        };

        let lyricsEmbed = new MessageEmbed()
            .setTitle(`${queue.songs[0].title} - Lyrics`)
            .setDescription(lyrics)
            .setColor("#000000")
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed);
    },
};