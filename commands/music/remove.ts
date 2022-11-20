import { EmbedBuilder, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/QueueUtils";
import { MusicQueue } from "@components/MusicQueue";

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
    execute(interaction: ChatInputCommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
        const removeArgs: number = interaction.options.getNumber("tracks") as number;

        const nothingToRemove = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("There is nothing in the queue to remove.");

        const notInBotChannel = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("You need to join the voice channel the bot is in.");

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return interaction.reply({ embeds: [notInBotChannel], ephemeral: true });
        if (!queue) return interaction.reply({ embeds: [nothingToRemove], ephemeral: true });

        const song = queue.songs.splice(removeArgs - 1, 1);
        const removeEmbed1 = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`${interaction.user} removed **${song[0].title}** from the queue.`);

        interaction.reply({ embeds: [removeEmbed1] });
    }
};
