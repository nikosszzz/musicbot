const
    { MessageEmbed } = require("discord.js"),
    { canModifyQueue } = require("../../assets/handlers/modifyqueue");

module.exports = {
    config: {
        name: "leave",
        aliases: ['l'],
        description: "Makes the bot leave the voice channel its in.",
    },
    execute: async (message) => {
        const { channel } = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);

        let joinVCF = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!canModifyQueue(message.member)) return message.channel.send(joinVCF);

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
            // Printing the error message if the bot fails to leave the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        };
    },
};