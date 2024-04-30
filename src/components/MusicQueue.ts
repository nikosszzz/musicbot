import {
    type AudioPlayer,
    type AudioPlayerState,
    AudioPlayerStatus,
    type AudioResource,
    createAudioPlayer,
    entersState,
    NoSubscriberBehavior,
    type VoiceConnection,
    VoiceConnectionDisconnectReason,
    type VoiceConnectionState,
    VoiceConnectionStatus,
    AudioPlayerPlayingState
} from "@discordjs/voice";
import type { ChatInputCommandInteraction, CommandInteraction, Message, TextChannel } from "discord.js";
import { promisify } from "node:util";
import type { QueueOptions } from "common";
import { config } from "@components/config";
import type { Song } from "@components/Song";
import type { Bot } from "@components/Bot";
import { Logger } from "@components/Logger"

const wait = promisify(setTimeout);

/**
 * @name Music Bot System
 * @description The Music Bot System 
 * 
 */
export class MusicQueue {
    public readonly interaction!: CommandInteraction | ChatInputCommandInteraction;
    public readonly connection!: VoiceConnection;
    public readonly player: AudioPlayer;
    public readonly textChannel: TextChannel;
    public readonly bot: Bot;

    public resource!: AudioResource;
    public songs: Song[] = [];
    public volume = config.DEFAULT_VOLUME || 100;
    public loop = false;
    public muted = false;
    public waitTimeout!: NodeJS.Timeout | null;
    private queueLock = false;
    private readyLock = false;

    public constructor({ options }: { options: QueueOptions; }) {
        Object.assign(this, options);

        this.bot = options.interaction.client;
        this.textChannel = options.interaction.channel as TextChannel;
        this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

        options.connection.subscribe(this.player);

        options.connection.on("stateChange", async (newState: VoiceConnectionState): Promise<void> => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        this.bot.queues.delete(options.interaction.guild!.id);
                    } catch (err: any | Error) {
                        Logger.error({ type: "INTERNAL:MUSIC", err });
                        this.stop();
                    }
                } else if (options.connection.rejoinAttempts < 5) {
                    await wait((options.connection.rejoinAttempts + 1) * 5_000);
                    options.connection.rejoin();
                } else {
                    options.connection.destroy();
                    this.bot.queues.delete(options.interaction.guild!.id);
                }
            } else if (newState.status === VoiceConnectionStatus.Ready) {
                this.bot.queues.delete(options.interaction.guild!.id);
            } else if (
                !this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.readyLock = true;
                try {
                    await entersState(options.connection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (options.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                        try {
                            options.connection.destroy();
                        } catch (e: any | Error) {
                            Logger.log({ type: "INTERNAL:MUSIC", msg: e });
                        }
                    }
                } finally {
                    this.readyLock = false;
                }
            }
        });

        this.player.on("stateChange", async (oldState: AudioPlayerState, newState: AudioPlayerState): Promise<void> => {
            if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
                if (this.loop && this.songs.length) {
                    this.songs.push(this.songs.shift()!);
                } else {
                    this.songs.shift();
                }

                this.songs.length || this.resource ? this.processQueue() : this.stop();
            } else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
                this.sendPlayingMessage({ newState });
            }
        });

        this.player.on("error", (err): void => {
            Logger.error({ type: "MUSICCMDS", err });
            if (this.loop && this.songs.length) {
                this.songs.push(this.songs.shift()!);
            } else {
                this.songs.shift();
            }
            this.processQueue();
        });
    }

    public async enqueue({ songs = [] }: { songs?: Song[] } = {}): Promise<void> {
        if (this.waitTimeout !== null) clearTimeout(this.waitTimeout);
        this.waitTimeout = null;
        this.songs = this.songs.concat(songs);
        await this.processQueue();
    }

    public stop(): void {
        this.songs = [];
        this.loop = false;
        this.player.stop();

        !config.PRUNING && this.textChannel.send("Queue ended.").catch((err) => Logger.error({ type: "MUSICCMDS", err: err }));

        if (this.waitTimeout !== null) return;

        this.waitTimeout = setTimeout((): void => {
            if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                try {
                    this.connection.destroy();
                } catch { }
            }

            this.bot.queues.delete(this.interaction.guild?.id as string);
            this.textChannel.send("Left channel due to inactivity.");
        }, config.STAY_TIME * 1000);
    }

    public async processQueue(): Promise<void> {
        if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) {
            return;
        }

        if (!this.songs.length || this.textChannel.guild!.members.me?.voice.channel?.members.size === 1) {
            return this.stop();
        }

        this.queueLock = true;

        const next = this.songs[0];

        try {
            const resource = await next.makeResource();

            this.resource = resource as AudioResource<Song>;
            this.player.play(this.resource);
            this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
        } catch (err: any | Error) {
            Logger.error({ type: "INTERNAL:MUSIC", err: err });

            return this.processQueue();
        } finally {
            this.queueLock = false;
        }
    }

    private async sendPlayingMessage({ newState }: { newState: AudioPlayerPlayingState; }): Promise<void> {
        let playingMessage: Message<boolean>;

        try {
            playingMessage = await this.textChannel.send((newState.resource as AudioResource<Song>).metadata.startMessage());
        } catch (err: any | Error) {
            Logger.error({ type: "INTERNAL:MUSIC", err: err });
        }

        if (config.PRUNING) setTimeout((): void => {
            playingMessage.delete().catch();
        }, 3000);
    }
}