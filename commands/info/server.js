const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'server',
        aliases: ['serverinfo'],
        description: 'Displays info about the server the command is ran in.',
    },
    execute: async (message) => {
        var serverIcon = message.guild.iconURL();
        let shardinfo = message.guild.shardID;
        let owner = message.guild.owner.user.tag;

        /* Verification level checks */

        if (message.guild.verificationLevel === 'NONE')
            verification = 'No level set.';
        if (message.guild.verificationLevel === 'LOW')
            verification = 'Low';
        if (message.guild.verificationLevel === 'MEDIUM')
            verification = 'Medium';
        if (message.guild.verificationLevel === 'HIGH')
            verification = 'High';
        if (message.guild.verificationLevel === 'VERY_HIGH')
            verification = 'Highest';

        let serverEmbed = new MessageEmbed()
            .setColor(`#000000`)
            .setTitle(`Info | ${message.guild.name}`)
            .setThumbnail(serverIcon)
            .addField("Owner", owner, true)
            .addField("Member Count", `${message.guild.memberCount} members.`, true)
            .addField("Emoji Count", `${message.guild.emojis.cache.size} emojis.`, true)
            .addField("Roles Count", `${message.guild.roles.cache.size} roles.`, true)
            .addField("Verification Level", verification, true)
            .addField("On Shard", `Shard ${shardinfo}`, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        return await message.channel.send(serverEmbed).catch(console.error);
    }
}