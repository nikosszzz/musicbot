const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "leave",
        category: 'music',
        aliases: ['l'],
        description: "Makes the bot leave the voice channel its in.",
    },
    execute: async (message) => {
        const { channel } = message.member.voice;

        let notInBotChannel = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        if (!canModifyQueue(message.member)) return message.channel.send(notInBotChannel);

        let leaveEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Left the voice channel.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        try {
            channel.leave();
            return message.channel.send(leaveEmbed);
        } catch (err) {
            message.client.queue.delete(message.guild.id);
            console.log(`BOT LOG: [TRACK PLAYER] Couldnt leave a channel in ${message.guild.name}. Error Output: ${error}`);
            return await channel.leave();
        };
    },
};