import { EmbedBuilder, type GuildMember, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a track from the queue.")
        .addNumberOption(options =>
            options
                .setName("track_number")
                .setDescription("The number of the track that you want to remove.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);
        const removeArgs = interaction.options.getNumber("tracks", true);

        const nothingToRemove = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing in the queue to remove.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return await interaction.reply({ embeds: [nothingToRemove], ephemeral: true });

        const song = queue.songs.splice(removeArgs - 1, 1);
        const removeEmbed1 = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} removed **${song[0].title}** from the queue.`);

        return await interaction.reply({ embeds: [removeEmbed1] });
    }
} as Command;
