import { ActivityType, Client } from "discord.js";
import { bot } from "@bot";
import { Logger } from "@components/Logger";

export async function presence({ client }: { client: Client; }): Promise<void> {

    /* Automatic presence  */
    let state = Number(0);

    client.on("ready", async (): Promise<void> => {
        Logger.log({ type: "STARTUP", msg: "Music Bot is online." });
        setInterval(() => {
            const presences: [{ type: ActivityType.Watching, message: string }, { type: ActivityType.Playing, message: string }] = [
                { type: ActivityType.Watching, message: `over ${client.guilds.cache.size} guilds!` },
                { type: ActivityType.Playing, message: `Slash commands! | v${bot.version}` },
            ];

            state = (state + 1) % presences.length;
            const presence = presences[state];

            client.user?.setActivity(presence.message, { type: presence.type });
        }, 10000);
    });
}
