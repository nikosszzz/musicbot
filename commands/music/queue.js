const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "queue",
        aliases: ["q"],
        description: "Shows the bot queue and what is currently playing.",
    },
    execute: async (message) => {
        const permissions = message.channel.permissionsFor(message.client.user);

        let missingperms = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`I am missing permissions to manage messages or add reactions.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return message.channel.send(missingperms);

        const queue = message.client.queue.get(message.guild.id);

        let nothingPlaying = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing playing in the queue currently.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!queue) return message.channel.send(nothingPlaying);

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const queueEmbed = await message.channel.send(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            embeds[currentPage]
        );

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message);
        };

        const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                };
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message);
            };
        });
    },
};

function generateQueueEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `${++j} - [${track.title}](${track.url} - Requested by ${track.req}`).join("\n");
        const { channel } = message.member.voice;

        const queueEmbed = new MessageEmbed()
            .setTitle("Track Queue")
            .setThumbnail(message.guild.iconURL())
            .setColor("#000000")
            .setDescription(`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
            .addField("Voice Channel", channel)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        embeds.push(queueEmbed);
    };
    return embeds;
};