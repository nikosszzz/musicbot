import { ActivityType, REST, Routes } from "discord.js";
import { Logger } from "@components/Logger";
import type { Bot } from "@components/Bot";
import { commands as musicCmds } from "commands/music";
import { commands as infoCmds } from "commands/info";
import { commands as utilCmds } from "commands/utility";
import { config } from "@components/config";
import { AuthTypes } from "@common/types";

let auth: AuthTypes;
export const commands = [...musicCmds, ...infoCmds, ...utilCmds];

export async function ready(client: Bot): Promise<void> {
    client.once("ready", async (): Promise<void> => {
        Logger.log({ type: "STARTUP", msg: "Music Bot has initialized." });

        auth = {
            TOKEN: client.debug ? config.DEVTOKEN : config.TOKEN,
            CLIENT_ID: client.debug ? config.DEVID : config.CLIENT_ID,
        };

        const rest = new REST().setToken(auth.TOKEN);

        await registerCommands(rest);
        setupAutomaticPresence(client);
    });

    async function registerCommands(rest: REST): Promise<void> {
        try {
            // Add commands to Bot's commands collection
            for (let i = 0; i < commands.length; i++) {
                client.commands.set(commands[i].data.name, commands[i]);
                if (client.debug) Logger.log({ type: "IMPORTER", msg: `${commands[i].data.name} has been loaded.` });
            };

            // Register on the Discord API
            await rest.put(Routes.applicationCommands(auth.CLIENT_ID), {
                body: commands.map((cmd) => cmd.data.toJSON())
            });
            Logger.log({ type: "SLASHCMDS", msg: `Successfully registered ${commands.length} commands on Discord.` });
        } catch (err: any | Error) {
            Logger.error({ type: "SLASHCMDS/REST", err });
        }
    }

    function setupAutomaticPresence(client: Bot): void {
        let state = 0;

        setInterval(async () => {
            const presences: [{ type: ActivityType, message: string }] = [
                { type: ActivityType.Listening, message: `to music.` },
            ];

            state = (state + 1) % presences.length;
            const presence = presences[state];

            client.user?.setActivity(presence.message, { type: presence.type });
        }, 10000);
    }
}
