const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'changelogs',
        aliases: ['changelog', 'whatsnew'],
        description: 'Displays information about the latest bot update.',
    },
    execute: async (message) => {

        let bugfixes = `** Bug Fixes**\n** ** 
        - Initial Release.`;

        let whatsnew = `**What's new**\n** **
        - Initial Release.`;

        let botversion = `1.0.0`;

        let UpdateEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Update Changelogs`)
            .setDescription(`Version ${botversion}`)
            .addField(`** **`, bugfixes)
            .addField(`** **`, whatsnew)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await message.channel.send(UpdateEmbed).catch(console.error);
    },
};