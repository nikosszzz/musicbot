import { ready } from "./modules/ready.js";
import { commands } from "./modules/commands.js";
import { Logger } from "@components/Logger";
import type { Bot } from "@components/Bot";

/**
 * 
 * @name Music Bot Manager
 * @description This is the Music Bot Manager.
 * 
 */
export class Manager {
    private async loadModules(client: Bot): Promise<void> {
        Logger.log({ type: "MANAGER", msg: "Initializing modules." });

        const modules = [
            { fn: commands, name: "Commands Handler" },
            { fn: ready, name: "Ready" },
        ];

        for (const { fn, name } of modules) {
            try {
                Logger.log({ type: "MANAGER", msg: `${name} module is initializing.` });
                await fn(client);
                Logger.log({ type: "MANAGER", msg: `${name} module has been initialized.` });
            } catch (err: any) {
                Logger.error({ type: "MANAGER", err });
            }
        }

        Logger.log({ type: "MANAGER", msg: "All modules have been initialized." });
    }

    public constructor(client: Bot) {
        this.loadModules(client).finally(() => Logger.log({ type: "STARTUP", msg: "Music Bot has initialized." }));
    }
}