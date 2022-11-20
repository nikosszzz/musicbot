import { ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { VoiceConnection } from "@discordjs/voice";

declare module "discord.js" {
    interface BaseGuild {
        audit: string;
        AutoRole: string[];
        welcomeChannel: string;
        welcomeMessage: string;
    }
}

export type Config = {
    TOKEN: string;
    DEVTOKEN: string;
    DEVID: string;
    CLIENT_ID: string;
    MAX_PLAYLIST_SIZE: number;
    MONGODB_URI: string;
    SOUNDCLOUD_CLIENT_ID: string;
    SPOTIFY_SECRET_ID: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REFRESH_TOKEN: string;
    PRUNING: boolean;
    STAY_TIME: number;
    DEFAULT_VOLUME: number;
}

export type Command = {
    data: SlashCommandSubcommandsOnlyBuilder | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder;
    execute(...args: any): any;
}

export type QueueOptions = {
    connection: VoiceConnection;
    interaction: CommandInteraction | ChatInputCommandInteraction;
}


export { };
