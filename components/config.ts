import { Config } from "@common/types";
import { Logger } from "@components/Logger";

let config: Config;

try {
    config = require("../config.json");
} catch (err: any) {
    Logger.error({ type: "INTERNAL:CONFIG", err: err });
    config = {
        MONGODB_URI: process.env.MONGODB_URI || "",
        TOKEN: process.env.TOKEN || "",
        DEVTOKEN: process.env.DEVTOKEN || "",
        DEVID: process.env.DEVID || "",
        SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID || "",
        MAX_PLAYLIST_SIZE: Number(process.env.MAX_PLAYLIST_SIZE) || Number(20),
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
        SPOTIFY_SECRET_ID: process.env.SPOTIFY_SECRET_ID || "",
        SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || "",
        CLIENT_ID: process.env.CLIENT_ID || "",
        PRUNING: process.env.PRUNING === "true" ? true : false,
        STAY_TIME: Number(process.env.STAY_TIME) || Number(30),
        DEFAULT_VOLUME: Number(process.env.DEFAULT_VOLUME) || Number(50),
    };
}

export { config };
