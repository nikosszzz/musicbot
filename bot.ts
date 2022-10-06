import { Client } from "discord.js";
import { Bot } from "@utils/Bot";
import { Logger } from "@utils/Logger";

Logger.log({ type: "STARTUP", msg: "Music Bot is initializing..." });

export const bot = new Bot(
    new Client({
        allowedMentions: { parse: ["roles", "users"] },
        intents: 47095
    })
);
