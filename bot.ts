import { Client } from "discord.js";
import { Bot } from "@components/Bot";
import { Logger } from "@components/Logger";

Logger.log({ type: "STARTUP", msg: "Music Bot is initializing..." });

export const bot = new Bot(
    new Client({
        allowedMentions: { parse: ["roles", "users"] },
        intents: 47095
    })
);
