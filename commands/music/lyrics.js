const
    { MessageEmbed } = require("discord.js"),
    lyricsFinder = require("lyrics-finder");

module.exports = {
    config: {
        name: "lyrics",
        category: 'music',
        aliases: ["ly"],
        description: "Fetch lyrics for the currently playing song.",
    },
    execute: async (message) => {
        let lyrics = null;
        const queue = message.client.queue.get(message.guild.id);

        /* Embeds for music */
        let lyricsFetch = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Fetching lyrics...`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let lyricsNotFound = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`No lyrics found for **${queue.songs[0].title}**.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        if (!queue) return message.channel.send(nothingPlaying);

        var embedmsg = await message.channel.send(lyricsFetch);

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) return embedmsg.edit(lyricsNotFound);
        } catch (error) {
            return embedmsg.edit(lyricsNotFound);
        }

        let lyricsEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`${queue.songs[0].title} - Lyrics`)
            .setDescription(lyrics)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return embedmsg.edit(lyricsEmbed);
    },
};