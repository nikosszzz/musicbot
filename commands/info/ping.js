const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'ping',
        description: 'Checks the Bot API latency/Ping.',
    },
    execute: (message) => {
        let botlatency = Date.now() - message.createdTimestamp;
        let apilatency = Math.round(message.client.ws.ping);

        let pingEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Latency`)
            .setAuthor(`Measures the bot's ping and API latency.`)
            .addField(`Bot Latency`, `${botlatency}ms`, true)
            .addField(`API Latency`, `${apilatency}ms`, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return message.channel.send(pingEmbed).catch(console.error);
    },
};