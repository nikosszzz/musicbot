const
    { MessageEmbed } = require('discord.js'),
    DiscordJSversion = require('discord.js').version;

module.exports = {
    config: {
        name: 'info',
        description: 'Displays information about Music Bot.',
    },
    execute: (message) => {
        let infoEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Music Bot`)
            .addFields({
                name: "**About/Purpose**",
                value: `Music Bot is a general purpose music bot.`
            }, {
                name: 'Developer',
                value: `! nikos#4922`,
                inline: true
            }, {
                name: 'Version',
                value: `${message.client.botversion} running on Discord.JS v${DiscordJSversion}`,
                inline: true
            })
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return message.channel.send(infoEmbed).catch(console.error);
    },
};