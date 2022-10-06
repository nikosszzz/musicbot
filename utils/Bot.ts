import { Client, Collection, Snowflake } from "discord.js";
import { Command } from "@interface/Command";
import { config } from "@utils/config";
import { Manager } from "@manager";
import { MusicQueue } from "@utils/MusicQueue";

export class Bot {
    public commands: Collection<string, Command> = new Collection<Snowflake, Command>();
    public queues: Collection<string, MusicQueue> = new Collection<Snowflake, MusicQueue>();
    public readonly devtoken: string = config.DEVTOKEN;
    public readonly token: string = config.TOKEN;
    public readonly debug = new Boolean;
    public readonly version: string = "2.0.0";
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

        /* Bot Manager */
        new Manager({ client });
    }
}
