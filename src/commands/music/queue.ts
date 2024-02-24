import { EmbedBuilder, type CommandInteraction, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle, type CollectedInteraction } from "discord.js";
import { Logger } from "@components/Logger";
import type { Song } from "@components/Song";
import type { Command } from "@common/types";

let currentPage: number = 0 as number;

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the bot queue and what is currently playing."),
    async execute(interaction: CommandInteraction, client) {
        const queue = client.queues.get(interaction.guild?.id as string);

        const nothingPlaying = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setDescription("There is nothing playing in the queue currently.");
        if (!queue || !queue.songs || !queue.songs.length ) return interaction.reply({ embeds: [nothingPlaying], ephemeral: true });


        const embeds = generateQueueEmbed(interaction, queue.songs);
        const queueButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel("⬅️")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("stop")
                    .setLabel("⏹")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("➡️")
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({
            content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]], components: embeds.length > 1 ? [queueButtons] : []
        });
        if (embeds.length > 1) {
            const collector = interaction.channel?.createMessageComponentCollector({ time: 60000 });

            collector?.on("collect", async (i: CollectedInteraction): Promise<void> => {
                try {
                    if (i.customId === "next") {
                        await i.deferUpdate();
                        if (currentPage < embeds.length - 1) {
                            currentPage++;
                            await interaction.editReply({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]] });
                        }
                    } else if (i.customId === "previous") {
                        await i.deferUpdate();
                        if (currentPage !== 0) {
                            --currentPage;
                            await interaction.editReply({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]] });
                        }
                    } else if (i.customId === "stop") {
                        await i.deferUpdate();
                        collector.stop();
                        await interaction.editReply({
                            content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                            embeds: [embeds[currentPage]], components: []
                        });
                    }
                } catch (err: any | Error) {
                    return Logger.error({ type: "MUSICCMDS", err: err });
                }
            });
        }
    },
} as Command;

function generateQueueEmbed(interaction: CommandInteraction, songs: Song[]): EmbedBuilder[] {
    const embeds = [];
    let k = 10;

    for (let i = 0; i < songs.length; i += 10) {
        const current = songs.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map(track => `${++j} - [${track.title}](${track.url}) - Requested by ${track.req}`).join("\n");

        const queueEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setAuthor({ name: "Track Queue" })
            .setTitle(`Current Song - ${songs[0].title}`)
            .setURL(songs[0].url)
            .setThumbnail(interaction.guild?.iconURL() as string)
            .setDescription(`**Displaying the queue list below:**\n\n${info}`)
            .setFooter({ text: `${songs.length} tracks.` });

        embeds.push(queueEmbed);
    }
    return embeds;
}