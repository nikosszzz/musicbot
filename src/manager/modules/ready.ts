import { ActivityType, Routes } from "discord.js";
import { Logger } from "@components/Logger";
import { commands as musicCmds } from "commands/music/index.js";
import { commands as infoCmds } from "commands/info/index.js";
import { commands as utilCmds } from "commands/utility/index.js";
import type { Bot } from "@components/Bot";
import chalk from "chalk";
import { config } from "@components/config";

export async function ready(client: Bot): Promise<void> {
    await new Promise<void>(async (resolve) => {
        if (client.isReady() || client.once("ready", (c) => c.isReady())) {
            await registerCommands();
            setupAutomaticPresence();

            resolve();
        };
    });

    async function registerCommands(): Promise<void> {
        const commands = [...musicCmds, ...infoCmds, ...utilCmds];

        try {
            for (let i = 0; i < commands.length; i++) {
                client.commands.set(commands[i].data.name, commands[i]);
                if (client.debug) Logger.info({ type: "DEVELOPMENT READY/CMDS", msg: `${commands[i].data.name} has been loaded.` });
            };

            await client.rest.put(Routes.applicationCommands(client.debug ? config.CLIENT_ID_DEV : config.CLIENT_ID), {
                body: commands.map(cmd => cmd.data.toJSON())
            });
            Logger.log({ type: "READY/CMDS", msg: `Registered ${chalk.blueBright(commands.length)} commands on Discord.` });
        } catch (err: any) {
            Logger.error({ type: "READY/CMDS", err });
        }
    }

    function setupAutomaticPresence(): void {
        try {
            let state = 0;

            setInterval(() => {
                const presences: { type: ActivityType, message: string }[] = [
                    { type: ActivityType.Listening, message: `music.` },
                ];

                state = (state + 1) % presences.length;
                const presence = presences[state];

                client.user?.setActivity({ name: presence.message, type: presence.type });
            }, 10000);
        } catch (e: any) {
            Logger.error({ type: "READY/PRESENCE", err: e });
        }
    }
}
