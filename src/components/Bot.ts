import { Client, type ClientOptions, Collection } from "discord.js";
import type { Command } from "@common";
import { config } from "@components/config";
import { Manager } from "@manager";
import type { MusicQueue } from "@components/MusicQueue";
import { getFreeClientID, setToken } from "play-dl";
import { Logger } from "@components/Logger";
import { hash } from "@utils";

export class Bot extends Client {
    public commands = new Collection<string, Command>();
    public queues = new Collection<string, MusicQueue>();
    public readonly version = `3.5.0 (${hash})`;
    public readonly branch: string = config.DEBUG ? "development" : "stable";

    constructor(options: ClientOptions) {
        try {
            super(options);

            if (config.DEBUG) Logger.info({ type: "DEVELOPMENT", msg: "⚠️ Debug mode is enabled. ⚠️" });

            Logger.log({ type: "STARTUP", msg: "Music Bot is initializing..." });

            /* Music Authentication */
            getFreeClientID().then(id =>
                setToken({
                    soundcloud: {
                        client_id: config.SOUNDCLOUD_CLIENT_ID.length ? config.SOUNDCLOUD_CLIENT_ID : id
                    },
                    /* Spotify auth is not needed, you can delete this. */
                    spotify: {
                        client_id: config.SPOTIFY_CLIENT_ID,
                        client_secret: config.SPOTIFY_SECRET_ID,
                        /* Put your country's region code. example: "gr", "us", "uk" */
                        market: "gr",
                        refresh_token: config.SPOTIFY_REFRESH_TOKEN
                    }
                }));
            
            this.login(config.DEBUG ? config.DEVTOKEN : config.TOKEN);
            
            new Manager(this);
        } catch (e: any) {
            Logger.error({ type: "STARTUP", err: e });
        }
    }
}
