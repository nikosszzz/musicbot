import { type GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the queue."),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return await interaction.reply({ embeds: [nothingPlaying], ephemeral: true });

        if (queue.player.pause()) {
            const pauseEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setTitle("Track Player")
                .setDescription(`${interaction.user.tag} paused the queue.`);

            interaction.reply({ embeds: [pauseEmbed] });
            return true;
        }

        const alreadyPaused = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`The queue is already paused.`);

        return await interaction.reply({ embeds: [alreadyPaused] });
    },
} as Command;
