module.exports = (client) => {
    console.log(`BOT LOG: [STARTUP] Bot online and up on Discord.`)
    client.user.setActivity("Music.", {
        type: "LISTENING"
    });
};