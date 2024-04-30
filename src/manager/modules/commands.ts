import { Logger } from "@components/Logger";
import type { Bot } from "@components/Bot";
import type { CacheType, ChatInputCommandInteraction, Interaction } from "discord.js";

export async function commands(client: Bot): Promise<void> {
    client.on("interactionCreate", async (interaction) => {
        if (!isCommandInteraction(interaction)) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err: any) {
            Logger.error({ type: "INTERNALS/CMDHANDLER", err: err.stack });
            await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true });
        }
    });
}

function isCommandInteraction(interaction: Interaction<CacheType>): interaction is ChatInputCommandInteraction {
    return (
        interaction.isChatInputCommand() &&
        !interaction.user.bot &&
        interaction.inGuild()
    );
}