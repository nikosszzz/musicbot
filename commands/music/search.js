const
    { MessageEmbed } = require("discord.js"),
    { YOUTUBE_API_KEY } = require('../../assets/handlers/config'),
    { canModifyQueue } = require('../../assets/handlers/modifyqueue'),
    YouTubeAPI = require("simple-youtube-api"),

    youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
    config: {
        name: "search",
        description: "Search and select tracks to play.",
    },
    execute: async (message, args) => {
        let usagevc1 = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Video Name>`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let collectorActive = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`A message collector is already active in this channel.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let joinVCF = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(joinVCF); 
        if (!search) return message.channel.send(usagevc1);
        if (message.channel.activeCollector) return message.channel.send(collectorActive);
        if (!message.member.voice.channel) return message.channel.send(nothingPlaying);

        const search = args.join(" ");

        let resultsEmbed = new MessageEmbed()
            .setTitle(`**Reply with the song number you want to play.**`)
            .setDescription(`Results for: ${search}`)
            .setColor("#000000")
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        try {
            const results = await youtube.searchVideos(search, 10);
            results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

            let resultsMessage = await message.channel.send(resultsEmbed);

            function filter(msg) {
                const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
                return pattern.test(msg.content);
            };

            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
            const reply = response.first().content;

            if (reply.includes(",")) {
                let songs = reply.split(",").map((str) => str.trim());

                for (let song of songs) {
                    await message.client.commands.get("play").execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
                };
            } else {
                const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
                message.client.commands.get("play").execute(message, [choice]);
            };

            message.channel.activeCollector = false;
            resultsMessage.delete().catch(console.error);
            response.first().delete().catch(console.error);
        } catch (error) {
            console.log(`Catched a error! Logs below`);
            console.error(error);
            message.channel.activeCollector = false;
            message.channel.send(error.message).catch(console.error);
        };
    },
};