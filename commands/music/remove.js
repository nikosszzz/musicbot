const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue"),
    pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

module.exports = {
    config: {
        name: "remove",
        category: 'music',
        aliases: ["rm"],
        description: "Removes a track from the queue.",
    },
    execute: (message, args) => {
        const queue = message.client.queue.get(message.guild.id);

        let nothingToRemove = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`There is nothing in the queue to remove.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <Queue Number>.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInBotChannel = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(notInBotChannel);    
        if (!queue) return message.channel.send(nothingToRemove);
        if (!args.length) return message.channel.send(cmdUsage);

        const argsong = args.join("");
        const songs = argsong.split(",").map((arg) => parseInt(arg));
        let removed = [];

        if (pattern.test(argsong)) {
            queue.songs = queue.songs.filter((item, index) => {
                if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
                else return true;
            });

            let removeEmbed1 = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Track Player`)
                .setDescription(`${message.author} removed **${removed.map((song) => song.title).join("\n")}** from the queue.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            queue.textChannel.send(removeEmbed1);
        } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
            let removeEmbed2 = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Track Player`)
                .setDescription(`${message.author} removed **${queue.songs.splice(args[0] - 1, 1)[0].title}** from the queue.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            return queue.textChannel.send(removeEmbed2);
        } else {
            return message.channel.send(usagevc1);
        }
    },
};