import { Bot } from "@components/Bot";

new Bot({
    allowedMentions: { parse: ["roles", "users"] },
    intents: 47095,
});
