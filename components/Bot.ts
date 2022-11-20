import { Client, Collection, Snowflake } from "discord.js";
import { Command } from "@common/types";
import { config } from "@components/config";
import { Manager } from "@manager";
import { MusicQueue } from "@components/MusicQueue";
import play from "play-dl";

export class Bot {
    public commands: Collection<Snowflake, Command> = new Collection<Snowflake, Command>();
    public queues: Collection<Snowflake, MusicQueue> = new Collection<Snowflake, MusicQueue>();
    public readonly devtoken: string = config.DEVTOKEN;
    public readonly token: string = config.TOKEN;
    public readonly debug = new Boolean;
    public readonly version: string = "2.2.0";
    public readonly branch = new String;

    public constructor(private client: Client) {
        this.debug = false;

        if (this.debug === true) {
            this.client.login(this.devtoken);
            this.branch = "development";
        } else {
            this.client.login(this.token);
            this.branch = "stable";
        }
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
        new Manager({ client });
    }
}
