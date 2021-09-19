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

        if (message.guild.region === 'europe')
            region = 'Europe';
        if (message.guild.region === 'brazil')
            region = 'Brazil';
        if (message.guild.region === 'india')
            region = 'India';
        if (message.guild.region === 'hongkong')
            region = 'Hong Kong';
        if (message.guild.region === 'japan')
            region = 'Japan';
        if (message.guild.region === 'russia')
            region = 'Russia';
        if (message.guild.region === 'singapore')
            region = 'Singapore';
        if (message.guild.region === 'southafrica')
            region = 'South Africa';
        if (message.guild.region === 'sydney')
            region = 'Sydney';
        if (message.guild.region === 'us-central')
            region = 'US Central';
        if (message.guild.region === 'us-east')
            region = 'US East';
        if (message.guild.region === 'us-south')
            region = 'US South';
        if (message.guild.region === 'us-west')
            region = 'US West';

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
            .addField("Owner", owner)
            .addField("Member Count", `${message.guild.memberCount} members.`)
            .addField("Emoji Count", `${message.guild.emojis.cache.size} emojis.`)
            .addField("Roles Count", `${message.guild.roles.cache.size} roles.`)
            .addField("Region", region)
            .addField("Verification Level", verification)
            .addField("On Shard", `Shard ${shardinfo}`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await message.channel.send(serverEmbed).catch(console.error);
    }
}