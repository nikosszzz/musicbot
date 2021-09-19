const fs = require('fs');

module.exports = {
    config: {
        name: 'debug02',
        description: 'Reloads a command.',
    },
    execute(message, args) {
        if (!message.author.id !== '878225051684585482') return;
        const commandName = args[0];
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.config.aliases && cmd.config.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        }

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.config.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.config.name}.js`);
            message.client.commands.set(newCommand.config.name, newCommand);
            message.channel.send(`Command reloaded successfully.`);

        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\`.`);
        }
    },
};