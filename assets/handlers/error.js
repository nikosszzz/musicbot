module.exports = {
    disconnect: () => {
        console.warn('Disconnected.');
    },
    reconnecting: () => {
        console.log("Bot reconnecting.");
    },
    warn: (err) => {
        console.warn(`Warning:`, err);
    },
    error: (err) => {
        console.error(`Error:`, err.message);
    },
    DiscordAPIError: (err) => {
        console.log('An API error has occured:', err);
    },
    uncaughtException: (err) => {
        console.error(`Unhandled exception:`, err.stack);
        process.exit(1);
    },
    unhandledRejection: (err, promise) => {
        console.log('Unhandled promise rejection:', `${err.stack} ${promise}`);
    },
    shardingError: (err) => {
        console.log(`A websocket connection encountered an error:`, err);
    },
};