const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'changelogs',
        aliases: ['changelog', 'whatsnew'],
        description: 'Displays information about the latest bot update.',
    },
    execute: async (message) => {

        let bugfixes = `** Bug Fixes**\n** ** 
        - Pattern fixes in search.js.`;

        let whatsnew = `**What's new**\n** **
        - Dynamic global version & branch declare.
        - Keyless YouTube API implementation using youtube-sr has been built.
        - Updates to the config handler.
        - Cleaned up the core.
        - Music optimizations.`;

        let UpdateEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Info | Update Changelogs`)
            .setDescription(`Version ${message.client.botversion}`)
            .addField(`** **`, bugfixes)
            .addField(`** **`, whatsnew)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await message.channel.send(UpdateEmbed).catch(console.error);
    },
};