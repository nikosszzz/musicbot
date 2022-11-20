import { EmbedBuilder, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/QueueUtils";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the currently non-playing track."),
    async execute(interaction: CommandInteraction) {
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

        if (queue.player.unpause()) {

            const resumeEmbed = new EmbedBuilder()
                .setColor("#000000")
                .setTitle("Track Player")
                .setDescription(`${interaction.user} resumed the queue.`);

            interaction.reply({ embeds: [resumeEmbed] });
            return true;
        }

        const notPaused = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("The queue is not paused.");

        interaction.reply({ embeds: [notPaused] });
        return false;
    },
};
