import {
    AudioPlayer,
    AudioPlayerState,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    NoSubscriberBehavior,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionState,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { ChatInputCommandInteraction, CommandInteraction, Message, TextChannel } from "discord.js";
import { promisify } from "node:util";
import { bot } from "@bot";
import { QueueOptions } from "common/types";
import { config } from "@components/config";
import { Logger } from "@components/Logger";
import { Song } from "@components/Song";

const wait = promisify(setTimeout);

export class MusicQueue {
    public readonly interaction!: CommandInteraction | ChatInputCommandInteraction;
    public readonly connection!: VoiceConnection;
    public readonly player: AudioPlayer;
    public readonly textChannel: TextChannel;
    public readonly bot = bot;

    public resource!: AudioResource;
    public songs: Song[] = [];
    public volume = config.DEFAULT_VOLUME || 100;
    public loop = false;
    public muted = false;
    public waitTimeout!: NodeJS.Timeout;
    private queueLock = false;
    private readyLock = false;

    public constructor({ options }: { options: QueueOptions; }) {
        Object.assign(this, options);

        this.textChannel = options.interaction.channel as TextChannel;
        this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
        this.connection.subscribe(this.player);

        this.connection.on("stateChange", async (newState: VoiceConnectionState): Promise<void> => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        this.stop();
                    } catch (e: any) {
                        Logger.error({ type: "INTERNAL:MUSIC", err: e });
                        this.stop();
                    }
                } else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 5_000);
                    this.connection.rejoin();
                } else {
                    this.connection.destroy();
                    bot.queues.delete(this.interaction.guild?.id as string);
                }
            } else if (newState.status == VoiceConnectionStatus.Ready) {
                //Unsure why it reports Ready when it leaves the voice channel.
                bot.queues.delete(this.interaction.guild?.id as string);
            } else if (
                !this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.readyLock = true;
                try {
                    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                        try {
                            this.connection.destroy();
                        } catch (e: any) {
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
                    this.songs.push(this.songs.shift() as Song);
                } else {
                    this.songs.shift();
                }

                if (this.songs.length || this.resource) this.processQueue();
            } else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
                this.sendPlayingMessage({ newState });
            }
        });

        this.player.on("error", (error): void => {
            console.error(error);
            if (this.loop && this.songs.length) {
                this.songs.push(this.songs.shift() as Song);
            } else {
                this.songs.shift();
            }
            this.processQueue();
        });
    }

    public async enqueue({ songs = [] }: { songs?: Song[]; } = {}): Promise<void> {
        if (typeof this.waitTimeout !== undefined) clearTimeout(this.waitTimeout);
        this.songs = this.songs.concat(songs);
        await this.processQueue();
    }

    public stop(): void {
        this.loop = false;
        this.songs = [];
        this.player.stop();

        !config.PRUNING && this.textChannel.send("Queue ended.").catch(console.error);
        bot.queues.delete(this.interaction.guild?.id as string);

        this.waitTimeout = setTimeout((): void => {
            if (this.player.state.status === AudioPlayerStatus.Playing && this.songs.length > 0) return;

            if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                try {
                    this.connection.destroy();
                // eslint-disable-next-line no-empty
                } catch { }
            }

            this.textChannel.send("Left channel due to inactivity.");
        }, config.STAY_TIME * 1000);
    }

    public async processQueue(): Promise<void> {
        if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) {
            return;
        }

        if (!this.songs.length || this.interaction.guild?.members?.me?.voice.channel?.members.size == 1) {
            return this.stop();
        }

        this.queueLock = true;

        const next = this.songs[0];

        try {
            const resource = await next.makeResource();

            this.resource = resource as AudioResource<Song>;
            this.player.play(this.resource);
            this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
        } catch (err: any) {
            Logger.error({ type: "INTERNAL:MUSIC", err: err });

            return this.processQueue();
        } finally {
            this.queueLock = false;
        }
    }

    private async sendPlayingMessage({ newState }: { newState: any; }): Promise<void> {
        let playingMessage: Message<boolean>;

        try {
            playingMessage = await this.textChannel.send((newState.resource as AudioResource<Song>).metadata.startMessage());
        } catch (e: any) {
            Logger.error({ type: "INTERNAL:MUSIC", err: e });
        }

        if (config.PRUNING) {
            setTimeout((): void => {
                playingMessage.delete().catch();
            }, 3000);
        }
    }
}
