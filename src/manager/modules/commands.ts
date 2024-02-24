import { Logger } from "@components/Logger";
import type { Bot } from "@components/Bot";
import { InteractionType, type CommandInteraction } from "discord.js";

export async function commands(client: Bot): Promise<void> {
    client.on("interactionCreate", async (interaction) => {
        if (!isCommandInteraction(interaction)) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (err: any | Error) {
            Logger.error({ type: "INTERNALS/CMDHANDLER", err: err.stack });
            await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true });
        }
    });
}

function isCommandInteraction(interaction: any): interaction is CommandInteraction {
    return (
        interaction.type === InteractionType.ApplicationCommand &&
        !interaction.user.bot &&
        interaction.guild &&
        interaction.channel?.type !== "DM"
    );
}
