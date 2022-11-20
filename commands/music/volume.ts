import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/QueueUtils";
import { MusicQueue } from "@components/MusicQueue";

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Changes volume of currently playing music.")
        .addNumberOption(option =>
            option
                .setName("level")
                .setDescription("The volume level to set the music to.")
        ),
    execute(interaction: ChatInputCommandInteraction) {
        const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
        const volTarget: number = interaction.options.getNumber("level") as number;

        const notInVC = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("You need to join a voice channel first.");

        const nothingPlaying = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");

        const currentVolume = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`The current volume is: **${queue.volume}%**.`);

        if (!canModifyQueue({ member: interaction.member as GuildMember })) return interaction.reply({ embeds: [notInVC], ephemeral: true });
        if (!queue) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });
        if (!volTarget) return interaction.reply({ embeds: [currentVolume], ephemeral: true });

        const useNum0100 = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription("Please use a number between 0 - 100.");

        if (Number(volTarget) > 100 || Number(volTarget) < 0) return interaction.reply({ embeds: [useNum0100], ephemeral: true });

        queue.volume = volTarget;
        queue.resource.volume?.setVolumeLogarithmic(volTarget / 100);

        const volumeEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setDescription(`Volume set to: **${queue.volume}%**.`);

        return interaction.reply({ embeds: [volumeEmbed] });
    },
};
