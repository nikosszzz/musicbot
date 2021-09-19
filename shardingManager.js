const
    { ShardingManager } = require('discord.js'),
    { TOKEN } = require("./assets/util/Util");

const shard = new ShardingManager('./bot.js', {
    execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
    autoSpawn: true,
    token: TOKEN,
});

shard.on('shardCreate', shard => {
    console.log(`BOT LOG: [SHARD MANAGER] Shard ${shard.id} launched.`);
});

shard.on('ready', shard => {
    console.log(`BOT LOG: [SHARD MANAGER] Shard ${shard.id} connected.`);
});

shard.on('reconnecting', shard => {
    console.log(`BOT LOG: [SHARD MANAGER] Shard ${shard.id} is trying to reconnect...`);
});

shard.on('death', shard => {
    console.log(`BOT LOG: [SHARD MANAGER] Shard ${shard.id} died.`);
});

shard.spawn(2);