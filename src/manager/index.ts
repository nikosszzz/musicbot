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
    private async loadModule(client: Bot, moduleFn: (client: Bot) => Promise<void>, moduleName: string): Promise<void> {
        try {
            Logger.log({ type: "MANAGER", msg: `${moduleName} module is initializing.` });
            await moduleFn(client);
            Logger.log({ type: "MANAGER", msg: `${moduleName} module has been initialized.` });
        } catch (err: any) {
            Logger.error({ type: "MANAGER", err });
        }
    }

    private async loadModules(client: Bot): Promise<void> {
        Logger.log({ type: "MANAGER", msg: "Initializing modules."});

        const modules = [
            { fn: commands, name: "Commands Handler" },
            { fn: ready, name: "Ready" },
        ];

        for (const { fn, name } of modules) {
            await this.loadModule(client, fn, name);
        }

        Logger.log({ type: "MANAGER", msg: "All modules have been initialized." });
    }

    public constructor(client: Bot) {
        this.loadModules(client).finally(() => Logger.log({ type: "STARTUP", msg: "Music Bot has initialized." }));
    }
}