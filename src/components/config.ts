import { Config } from "@common";

export const config: Config = {
    TOKEN: process.env.TOKEN || "",
    DEVTOKEN: process.env.DEVTOKEN || "",
    CLIENT_ID: process.env.CLIENT_ID || "",
    CLIENT_ID_DEV: process.env.CLIENT_ID_DEV || "",
    SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID || "",
    MAX_PLAYLIST_SIZE: Number(process.env.MAX_PLAYLIST_SIZE) || Number(20),
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
    SPOTIFY_SECRET_ID: process.env.SPOTIFY_SECRET_ID || "",
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || "",
    STAY_TIME: Number(process.env.STAY_TIME) || Number(30),
    DEFAULT_VOLUME: Number(process.env.DEFAULT_VOLUME) || Number(50),
};

