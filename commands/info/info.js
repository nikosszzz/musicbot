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
            .setTitle(`Info | About the bot`)
            .addFields({
                name: "About",
                value: `Music Bot is a general purpose music bot.`
            }, {
                name: 'Developer',
                value: `𝕟𝕚𝕜𝕠𝕤𝕫𝕫#1275`
            }, {
                name: 'Version',
                value: `${message.client.botversion} running on Discord.JS v${DiscordJSversion}`
            })
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return message.channel.send(infoEmbed).catch(console.error);
    },
};