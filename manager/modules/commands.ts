import { ChannelType, Client, InteractionType } from "discord.js";
import { bot } from "@bot";

export async function commands({ client }: { client: Client; }): Promise<void> {
    client.on("interactionCreate", async (interaction): Promise<void> => {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (!interaction || interaction.user.bot || !interaction.guild || interaction.channel?.type === ChannelType.DM) return;

        const command = bot.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error: any) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command! The error has been reported.", ephemeral: true });
        }
    });
}
