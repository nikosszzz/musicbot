import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import { bot } from "@bot";
import move from "array-move";
import { MusicQueue } from "@components/MusicQueue";

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
    execute(interaction: ChatInputCommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
        const firstPos: number = interaction.options.getNumber("first_position") as number;
        const secondPos: number = interaction.options.getNumber("second_position") as number;

        const nothingPlaying = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });
        if (firstPos <= 1) return interaction.reply({ content: "Provide valid position numbers.", ephemeral: true });

        const song = queue.songs[firstPos - 1];
        queue.songs = move(queue.songs, firstPos - 1, secondPos == 1 ? 1 : secondPos - 1);

        const moveEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} moved **${song.title}** to ${secondPos} in the queue.`);

        interaction.reply({ embeds: [moveEmbed] });
    },
};
