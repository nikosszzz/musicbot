import { type AudioResource, createAudioResource } from "@discordjs/voice";
import { yt_validate, sp_validate, so_validate, video_basic_info, stream, spotify, soundcloud, search as playSearch, type SoundCloud, type SoundCloudTrack, type Spotify, type SpotifyTrack, YouTubeVideo, is_expired, refreshToken } from "play-dl";
import { type ChatInputCommandInteraction, EmbedBuilder, type CacheType, type MessagePayload, type MessageCreateOptions } from "discord.js";

export type SongData = {
    url: string;
    title: string;
    duration: number;
    durationRaw: string | undefined;
    thumbnail: string;
    req: string;
}

export class Song {
    public readonly url: string;
    public readonly title: string;
    public readonly duration: number;
    public readonly durationRaw: string | undefined;
    public readonly thumbnail: string;
    public readonly req: string;

    public constructor({ url, title, duration, durationRaw, thumbnail, req }: SongData) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.durationRaw = durationRaw
        this.thumbnail = thumbnail;
        this.req = req;
    }

    public static async from({ search, interaction }: { search: string; interaction: ChatInputCommandInteraction<CacheType>; }): Promise<Song> {
        const isYoutubeUrl = yt_validate(search) === "video";
        const isSpotifyUrl = sp_validate(search) === "track";
        const isSoundCloudUrl = await so_validate(search) === "track";

        let songInfo: YouTubeVideo | SoundCloud | Spotify;
        if (isSpotifyUrl) {
            if (is_expired()) await refreshToken();
            const spotifyInfo = await spotify(search) as SpotifyTrack;

            const spotifyresult = await playSearch(`${spotifyInfo.artists[0].name} - ${spotifyInfo.name}`, { limit: 1 });
            songInfo = (await video_basic_info(spotifyresult[0].url)).video_details;

            return new this({
                title: songInfo.title!,
                url: songInfo.url,
                duration: songInfo.durationInSec,
                durationRaw: songInfo.durationRaw,
                thumbnail: songInfo.thumbnails[0].url,
                req: interaction.user.tag
            });
        } else if (isSoundCloudUrl) {
            const scSong = await soundcloud(search) as SoundCloudTrack;
            return new this({
                title: scSong.name,
                url: scSong.permalink,
                duration: scSong.durationInSec,
                durationRaw: undefined,
                thumbnail: scSong.thumbnail,
                req: interaction.user.tag
            });
        } else if (isYoutubeUrl) {
            songInfo = (await video_basic_info(search)).video_details;
            return new this({
                title: songInfo.title!,
                url: songInfo.url,
                duration: songInfo.durationInSec,
                durationRaw: songInfo.durationRaw,
                thumbnail: songInfo.thumbnails[0].url,
                req: interaction.user.tag
            });
        } else {
            songInfo = (await video_basic_info((await playSearch(search, { limit: 1 }))[0].url)).video_details;
            return new this({
                url: songInfo.url,
                title: songInfo.title!,
                duration: songInfo.durationInSec,
                durationRaw: songInfo.durationRaw,
                thumbnail: songInfo.thumbnails[0].url,
                req: interaction.user.tag
            });
        }
    }

    public async makeResource(): Promise<AudioResource<Song> | void> {
        const playStream = await stream(this.url);

        if (!playStream) return;

        return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
    }

    public startMessage(): MessagePayload | MessageCreateOptions {
        const playingEmbed = new EmbedBuilder()
            .setColor("NotQuiteBlack")
            .setTitle("Track Player")
            .setURL(this.url)
            .setThumbnail(this.thumbnail || null)
            .setDescription(`Started playing: **${this.title}**.`);

        return { content: "** **", embeds: [playingEmbed] };
    }
}