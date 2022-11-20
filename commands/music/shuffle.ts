import { EmbedBuilder, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/QueueUtils";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue."),
    execute(interaction: CommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

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

        const songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            const j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;

        const shuffleEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} started queue shuffle.`);

        interaction.reply({ embeds: [shuffleEmbed] });
    },
};
