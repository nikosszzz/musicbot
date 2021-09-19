const
    { MessageEmbed } = require('discord.js'),
    joke = require("one-liner-joke").getRandomJoke;

module.exports = {
    config: {
        name: "randomjoke",
        description: "returns a random joke",
        aliases: ["joke", "rj"],
    },
    execute: (message) => {
        let jokeEmbed = new MessageEmbed()
            .setTitle("Fun | Random Joke")
            .addField(joke({ exclude_tags: ["dirty", "racist", "marriage", "sex", "death"] }).body, "** **")

        message.channel.send(jokeEmbed);
    },
};