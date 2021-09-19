const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'coinflip',
        aliases: ['cointoss', 'coin', 'flip'],
        description: 'Flips a coin.',
    },
    execute: async (message) => {
        const coins = ["Heads", "Tails"];

        const result = options[Math.floor(Math.random() * coins.length)];

        const flipResult = new MessageEmbed()
            .setTitle('Fun | Coinflip')
            .setDescription(`I flipped a coin for you, ${message.member}. It was **${result}**!`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(`#000000`);

        return message.channel.send(flipResult);
    },
};