import { ActivityType, Routes } from "discord.js";
import { Logger } from "@components/Logger";
import { commands as musicCmds } from "commands/music/index.js";
import { commands as infoCmds } from "commands/info/index.js";
import { commands as utilCmds } from "commands/utility/index.js";
import { config } from "@components/config";
import type { Bot } from "@components/Bot";

export async function ready(client: Bot): Promise<void> {
    client.once("ready", async (): Promise<void> => {
        Logger.log({ type: "STARTUP", msg: "Music Bot has initialized." });

        await registerCommands();
        setupAutomaticPresence();
    });

    async function registerCommands(): Promise<void> {
        const commands = [...musicCmds, ...infoCmds, ...utilCmds];
        const auth = {
            TOKEN: client.debug ? config.DEVTOKEN : config.TOKEN,
            CLIENT_ID: client.debug ? config.DEVID : config.CLIENT_ID,
        };

        try {
            // Add commands to Bot's commands collection
            for (let i = 0; i < commands.length; i++) {
                client.commands.set(commands[i].data.name, commands[i]);
                if (client.debug) Logger.log({ type: "IMPORTER", msg: `${commands[i].data.name} has been loaded.` });
            };

            // Register on the Discord API
            await client.rest.put(Routes.applicationCommands(auth.CLIENT_ID), {
                body: commands.map((cmd) => cmd.data.toJSON())
            });
            Logger.log({ type: "SLASHCMDS", msg: `Successfully registered ${commands.length} commands on Discord.` });
        } catch (err: any | Error) {
            Logger.error({ type: "SLASHCMDS/REST", err });
        }
    }

    function setupAutomaticPresence(): void {
        let state = 0;

        setInterval(() => {
            const presences: [{ type: ActivityType, message: string }] = [
                { type: ActivityType.Listening, message: `music.` },
            ];

            state = (state + 1) % presences.length;
            const presence = presences[state];

            client.user?.setActivity({ name: presence.message, type: presence.type });
        }, 10000);
    }
}
