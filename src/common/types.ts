import type { CacheType, ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { VoiceConnection } from "@discordjs/voice";
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

export type Config = {
    TOKEN: string;
    DEVTOKEN: string;
    MAX_PLAYLIST_SIZE: number;
    SOUNDCLOUD_CLIENT_ID: string;
    SPOTIFY_SECRET_ID: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REFRESH_TOKEN: string;
    STAY_TIME: number;
    DEFAULT_VOLUME: number;
}

export type Command = {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any>;
}

export type QueueOptions = {
    connection: VoiceConnection;
    interaction: ChatInputCommandInteraction<CacheType>;
}
