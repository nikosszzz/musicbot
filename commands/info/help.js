const
    { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'help',
        description: 'Displays the bot help page.',
    },
    execute: async (message) => {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Help`)
            .setDescription(`Here are all the bot's commands.`)

            commands.forEach((cmd) => {
                helpEmbed.addField(
                  `**${message.client.prefix}${cmd.config.name} ${cmd.config.aliases ? `(${cmd.config.aliases})` : ""}**`,
                  `${cmd.config.description}`,
                  true
                );
              });

            helpEmbed.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            helpEmbed.setTimestamp()

        return await message.channel.send(helpEmbed).catch(console.error);
    },
};