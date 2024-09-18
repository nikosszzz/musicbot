import { type GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import { arrayMoveImmutable } from "array-move";
import type { Command } from "@common";

export default {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Move tracks to a different position in the queue.")
        .addNumberOption(option =>
            option
                .setName("first_position")
                .setDescription("Position of the song you want to move.")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName("second_position")
                .setDescription("Position to move the song to.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild!.id);
        const firstPos = interaction.options.getNumber("first_position", true);
        const secondPos = interaction.options.getNumber("second_position", true);

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
        if (firstPos <= 1) return await interaction.reply({ content: "Provide valid position numbers.", ephemeral: true });

        const song = queue.songs[firstPos - 1];
        queue.songs = arrayMoveImmutable(queue.songs, firstPos - 1, secondPos == 1 ? 1 : secondPos - 1);

        const moveEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} moved **${song.title}** to ${secondPos} in the queue.`);

        return await interaction.reply({ embeds: [moveEmbed] });
    },
} as Command;
