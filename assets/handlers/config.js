const {
    TOKEN,
    SOUNDCLOUD_CLIENT_ID,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_SECRET_ID,
    DEFAULTPREFIX,
    MAX_PLAYLIST_SIZE,
    MONGODB_URI,
    PRUNING,
    STAY_TIME,
    DEFAULT_VOLUME,
} = process.env;

let config;

try {
    config = require("../../config.json");
} catch (error) {
    config = null;
}


exports.MONGODB_URI = config?.MONGODB_URI ?? MONGODB_URI;
exports.TOKEN = config?.TOKEN ?? TOKEN;
exports.SOUNDCLOUD_CLIENT_ID = config?.SOUNDCLOUD_CLIENT_ID ?? SOUNDCLOUD_CLIENT_ID;
exports.MAX_PLAYLIST_SIZE = (config?.MAX_PLAYLIST_SIZE ?? parseInt(MAX_PLAYLIST_SIZE)) || 20;
exports.SPOTIFY_CLIENT_ID = config?.SPOTIFY_CLIENT_ID ?? SPOTIFY_CLIENT_ID;
exports.SPOTIFY_SECRET_ID = config?.SPOTIFY_SECRET_ID ?? SPOTIFY_SECRET_ID;
exports.PRUNING = config?.PRUNING ?? PRUNING === "true";
exports.STAY_TIME = (config?.STAY_TIME ?? parseInt(STAY_TIME)) || 30;
exports.DEFAULTPREFIX = (config?.DEFAULTPREFIX ?? DEFAULTPREFIX) || "r!";
exports.DEFAULT_VOLUME = (config?.DEFAULT_VOLUME ?? parseInt(DEFAULT_VOLUME)) || 50