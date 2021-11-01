const
    { MessageEmbed } = require("discord.js"),
    fs = require("fs");

let config;

try {
    config = require("../../config.json");
} catch (error) {
    config = null;
}

module.exports = {
    config: {
        name: "pruning",
        category: 'music',
        description: "Toggles pruning of bot messages.",
    },
    execute: (message) => {
        if (!config) return;
        config.PRUNING = !config.PRUNING;

        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.log(err);
                return message.channel.send("There was an error writing to the file.");
            }

            let pruneEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Track Player`)
                .setDescription(`Message pruning ${config.PRUNING ? "**enabled**." : "**disabled**."}`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            return message.channel.send(pruneEmbed);
        });
    },
};