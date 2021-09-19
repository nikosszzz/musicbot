/* Core, startup */
const
    { Client, Collection } = require('discord.js'),
    { TOKEN, MONGODB_URI, DEFAULTPREFIX } = require('./assets/handlers/config'),
    { readdirSync } = require("fs"),
    { join } = require("path"),
    blacklistModel = require('./assets/database/blacklist'),
    guildModel = require('./assets/database/guild'),
    config = require("./config.json"),
    client = new Client({ fetchAllMembers: false, restTimeOffset: 0, restWsBridgetimeout: 100, disableMentions: 'everyone' }),
    mongoose = require('mongoose'),
    errorHandler = require('./assets/handlers/error'),
    fs = require("fs"),
    path = require("path"),
    events = (require("events").EventEmitter.defaultMaxListeners = 70),
    cooldowns = new Collection(),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.config = config;
client.commands = new Collection();
client.queue = new Map();

/* ---------- IMPORT ALL COMMANDS ---------- */
var walk = (dir, done) => {
    var results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

walk("./commands/", (err, results) => {
    if (err) throw err;
    for (const file of results) {
        const cmdFileName = require(`${file}`);
        client.commands.set(cmdFileName.config.name, cmdFileName);
        console.log(`BOT LOG: [COMMAND HANDLER] ${cmdFileName.config.name} has been loaded.`)
    }
});

/* IMPORT ALL EVENTS */
fs.readdir("./events/client/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./events/client/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

/* ---------- COMMAND HANDLER CONFIGURATION ---------- */
client.on("message", async (message) => {
    let guildPrefs = await guildModel.findOne({ GuildID: message.guild.id }).catch(err => console.log(err));

    if (!guildPrefs) {
        console.log(`BOT LOG: [DATA HANDLER] No guild data found for ${message.guild.id}. Making now.`)
        guildPrefs = new guildModel({
            GuildID: message.guild.id,
            Prefix: DEFAULTPREFIX,
        });

        await guildPrefs.save().catch(err => console.log(err));
        console.log(`BOT LOG: [DATA HANDLER] Done making data for ${message.guild.id}.`)
    };

    const PREFIX = guildPrefs.Prefix;

    if (message.author.bot || message.channel.type === "dm" || message.channel.type === "group") return;

    const blacklisted = await blacklistModel.find();

    let isBlacklisted;

    if (blacklisted) {
        isBlacklisted = blacklisted.find(u => u.id === message.author.id)
    };
    if (isBlacklisted) return;

    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.config.aliases && cmd.config.aliases.includes(commandName)
        );

    if (!command) return;

    if (!cooldowns.has(command.config.name)) {
        cooldowns.set(command.config.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.config.name);
    const cooldownAmount = (command.config.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before re-using the \`${command.name}\` command.`);
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (err) {
        console.log(err);
        const logger = client.channels.cache.get(`856944465808457770`);
        logger.send(`BOT LOG: [ERROR HANDLER: COMMANDS] \n** **\n${err}.`)
    };
});

/* Database */
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`BOT LOG: [STARTUP: DATABASE] Connected to database.`)).catch(err => console.log(`BOT LOG: [DATABASE] Oops, there was an error! ${err}`));

/* Error Handler */
client.on('disconnect', () => errorHandler.disconnect())
    .on("reconnecting", () => errorHandler.reconnecting())
    .on('warn', (err) => errorHandler.warn(err))
    .on('error', (err) => errorHandler.error(err))
    .on('DiscordAPIError', (err) => errorHandler.DiscordAPIError(err))
    .on('shardError', (err) => errorHandler.shardingError(err))
    .on("uncaughtException", (err) => errorHandler.uncaughtException(err))
    .on('unhandledRejection', (err, promise) => errorHandler.unhandledRejection(err, promise));

client.login(TOKEN);