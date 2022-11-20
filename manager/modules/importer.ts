import { Client, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { config } from "@components/config";
import { join } from "node:path";
import { bot } from "@bot";
import { REST } from "@discordjs/rest";
import { Logger } from "@components/Logger";

let auth: { TOKEN: string, CLIENT_ID: string };

export async function importer({ client }: { client: Client; }): Promise<void> {
    const dir = join(__dirname, "../../commands/");
    const commands: string[] = [];

    const commandCategories = readdirSync(dir);
    commandCategories.forEach(async (cat): Promise<void> => {
        const commandFiles = readdirSync(join(dir, cat)).filter(files => files.endsWith(".ts"));

        commandFiles.forEach(async (file): Promise<void> => {
            const command = await import(join(dir, cat, file));
            bot.commands.set(command.default.data.name, command.default);
            commands.push(command.default.data.toJSON());
            if (bot.debug === true) Logger.log({ type: "IMPORTER", msg: `${command.default.data.name} has been loaded.` });
        });
    });
    client.on("ready", async (): Promise<void> => {
        if (bot.debug) {
            auth = {
                TOKEN: config.DEVTOKEN,
                CLIENT_ID: config.DEVID
            };
        } else {
            auth = {
                TOKEN: config.TOKEN,
                CLIENT_ID: config.CLIENT_ID
            };
        }
        const rest = new REST().setToken(auth.TOKEN);

        await rest.put(Routes.applicationCommands(auth.CLIENT_ID), { body: commands })
            .catch((err: any) => Logger.log({ type: "SLASHCMDS/REST", msg: err }))
            .then(() => Logger.log({ type: "SLASHCMDS", msg: `Successfully registered ${commands.length} commands on Discord.` }));
    });
}
