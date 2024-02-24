import { ready } from "./modules/ready";
import { commands } from "./modules/commands";
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
            await moduleFn(client);
            Logger.log({ type: "MANAGER", msg: `${moduleName} module has been loaded.` });
        } catch (err: any | Error) {
            Logger.error({ type: "MANAGER", err });
        }
    }

    private async loadModules(client: Bot): Promise<void> {
        const modules = [
            { fn: commands, name: "Commands Handler" },
            { fn: ready, name: "Errors Handler" },
        ];

        const promises = modules.map(({ fn, name }) => this.loadModule(client, fn, name));

        await Promise.all(promises);
    }

    public constructor(client: Bot) {
        this.loadModules(client).then(() => Logger.log({ type: "MANAGER", msg: "All modules have been loaded." }));
    }
}
