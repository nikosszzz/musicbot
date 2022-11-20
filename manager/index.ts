import { Client } from "discord.js";
import { presence } from "./modules/presence";
import { importer } from "./modules/importer";
import { commands } from "./modules/commands";
import { Logger } from "@components/Logger";

/**
 * 
 * @name Music Bot Manager
 * @description This is the Music Bot Manager.
 * 
 */
export class Manager {
    /**
     * @name Load method
     * @param client
     */
    private async load({ client }: { client: Client; }): Promise<void> {
        try {
            await importer({ client });
            await presence({ client });
            await commands({ client });
        } catch (e: any) {
            Logger.error({ type: "MANAGER", err: e });
        }
    }
    public constructor({ client }: { client: Client; }) {
        this.load({ client }).finally(() => Logger.log({ type: "MANAGER", msg: "All modules have been loaded." }));
    }
}
