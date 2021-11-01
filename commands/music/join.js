const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "join",
        category: 'music',
        aliases: ['j'],
        description: "Summons the bot onto a voice channel.",
    },
    execute: async (message) => {
        const { channel } = message.member.voice;
        const voiceChannel = message.member.voice.channel;

        let joinVCF = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join a voice channel first.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        if (!voiceChannel) return message.channel.send(joinVCF);

        const permissions = channel.permissionsFor(message.client.user);
        let missingperms = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`I am missing permissions to join your channel or speak in your voice channel.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        if (!permissions.has(["CONNECT", "SPEAK"])) return message.channel.send(missingperms);

        let joinEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Joined the following channel: **${channel.name}**.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await channel.join();
        await message.guild.me.voice.setSelfDeaf(true);
        return message.channel.send(joinEmbed);
    },
};