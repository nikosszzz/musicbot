import type { ChatInputCommandInteraction, Collection, CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { VoiceConnection } from "@discordjs/voice";
import type { Bot } from "@components/Bot";
import type { MusicQueue } from "@components/MusicQueue";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        queues: Collection<string, MusicQueue>;
        debug: boolean;
        version: string;
        branch: string;
    }
}

export type AuthTypes = {
    TOKEN: string;
    CLIENT_ID: string;
};

export type Config = {
    TOKEN: string;
    DEVTOKEN: string;
    DEVID: string;
    CLIENT_ID: string;
    MAX_PLAYLIST_SIZE: number;
    SOUNDCLOUD_CLIENT_ID: string;
    SPOTIFY_SECRET_ID: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REFRESH_TOKEN: string;
    PRUNING: boolean;
    STAY_TIME: number;
    DEFAULT_VOLUME: number;
}

export type Command = {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder;
    execute(interaction: CommandInteraction | ChatInputCommandInteraction): Promise<any> | any;
    execute(interaction: CommandInteraction | ChatInputCommandInteraction, client: Bot): Promise<any> | any;
};

export type QueueOptions = {
    connection: VoiceConnection;
    interaction: CommandInteraction | ChatInputCommandInteraction;
}

export { };
