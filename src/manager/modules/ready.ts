import { ActivityType, Routes } from "discord.js";
import type { Bot } from "@components/Bot";
import { config } from "@components/config";
import { Logger } from "@components/Logger";
import { commands as utilCmds } from "@commands/utility/index";
import { commands as infoCmds } from "@commands/info/index";
import { commands as musicCmds } from "@commands/music/index";
import { blueBright } from "yoctocolors";

export async function ready(client: Bot): Promise<void> {
    await new Promise<void>((resolve) => {
        const onReady = async () => {
            await registerCommands();
            setupAutomaticPresence();
            resolve();
        };

        client.isReady() ? onReady() : client.once("ready", onReady);
    });

    async function registerCommands(): Promise<void> {
        const allCommands = [...utilCmds, ...infoCmds, ...musicCmds];

        try {
            for (let i = 0; i < allCommands.length; i++) {
                client.commands.set(allCommands[i].data.name, allCommands[i]);
                Logger.debug({ type: "DEVELOPMENT READY/CMDS", msg: `${allCommands[i].data.name} has been loaded.` });
            };

            await client.rest.put(Routes.applicationCommands(config.DEBUG ? config.CLIENT_ID_DEV : config.CLIENT_ID), {
                body: allCommands.map(cmd => cmd.data.toJSON())
            });
            Logger.log({ type: "READY/CMDS", msg: `Registered ${blueBright(allCommands.length.toString())} commands on Discord.` });
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
