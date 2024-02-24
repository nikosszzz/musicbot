import { Client, type ClientOptions, Collection } from "discord.js";
import type { Command } from "@common/types";
import { config } from "@components/config";
import { Manager } from "@manager";
import type { MusicQueue } from "@components/MusicQueue";
import play from "play-dl";
import { Logger } from "@components/Logger";

export class Bot extends Client {
    public commands: Collection<string, Command> = new Collection<string, Command>();
    public queues: Collection<string, MusicQueue> = new Collection<string, MusicQueue>();
    public readonly debug: boolean = true;
    public readonly version: string = "3.0.0";
    public readonly branch: string;
    

    constructor(options: ClientOptions) {
        super(options);
        Logger.log({ type: "STARTUP", msg: "Music Bot is initializing..." });

        this.branch = this.debug ? "development" : "stable";

        /* Music Authentication */
        play.setToken({
            soundcloud: {
                client_id: config.SOUNDCLOUD_CLIENT_ID
            },
            /* Spotify auth is not needed, you can delete this. */
            spotify: {
                client_id: config.SPOTIFY_CLIENT_ID,
                client_secret: config.SPOTIFY_SECRET_ID,
                /* Put your country's region code. example: "gr", "us", "uk" */
                market: "",
                refresh_token: config.SPOTIFY_REFRESH_TOKEN
            }
        });

        /* Bot Manager */
        this.login(this.debug ? config.DEVTOKEN : config.TOKEN).finally(() => new Manager(this));
    }
}
