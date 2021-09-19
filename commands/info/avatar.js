const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "avatar",
        aliases: [`avi`, `av`],
        description: "Displays the avatar of provider user.",
    },
    execute: async (message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args.length) {
            member = message.guild.member(message.author);

            if (!member) {
                return message.channel.send(`I couldn't find a user with the ID \`${args[0]}\``).catch(console.error);
            };
        };

        let userEmbed = new MessageEmbed()
            .setColor(00000)
            .setTitle(`Info | ${member.user.tag}'s Avatar`)
            .setDescription(`Avatar`)
            .setImage(member.user.avatarURL())
            .setTimestamp()

        return message.channel.send(userEmbed).catch(console.error);
    },
};