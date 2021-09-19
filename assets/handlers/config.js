let config;

try {
    config = require("../../config.json");
} catch (error) {
    config = null;
}


exports.MONGODB_URI = config ? config.MONGODB_URI : process.env.MONGODB_URI;
exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;
exports.MAX_PLAYLIST_SIZE = (config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE) || 20;
exports.SPOTIFY_CLIENT_ID = config ? config.SPOTIFY_CLIENT_ID : process.env.SPOTIFY_CLIENT_ID;
exports.SPOTIFY_SECRET_ID = config ? config.SPOTIFY_SECRET_ID : process.env.SPOTIFY_SECRET_ID;
exports.PRUNING = (config ? config.PRUNING : process.env.PRUNING) || true;
exports.STAY_TIME = (config ? config.STAY_TIME : process.env.STAY_TIME) || 30;
exports.DEFAULTPREFIX = (config ? config.PREFIX : process.env.PREFIX) || "!";
exports.DEFAULT_VOLUME = (config ? config.DEFAULT_VOLUME : process.env.DEFAULT_VOLUME) || 50;