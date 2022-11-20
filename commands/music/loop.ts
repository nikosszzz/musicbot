import { EmbedBuilder, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { canModifyQueue } from "@components/QueueUtils";
import { bot } from "@bot";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Toggles the bot queue loop."),
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

        queue.loop = !queue.loop;

        const loopEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`Loop ${queue.loop ? "**enabled**." : "**disabled**."}`);

        return interaction.reply({ embeds: [loopEmbed] });
    },
};
