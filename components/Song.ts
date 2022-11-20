import { AudioResource, createAudioResource } from "@discordjs/voice";
import play, { video_basic_info, stream, InfoData as videoInfo, SoundCloud, SoundCloudTrack, Spotify, SpotifyTrack } from "play-dl";
import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder } from "discord.js";

export interface SongData {
    url: string;
    title: string;
    duration: number;
    thumbnail: string;
    req: string;
}

export class Song {
    public readonly url: string;
    public readonly title: string;
    public readonly duration: number;
    public readonly thumbnail: string;
    public readonly req: string;

    public constructor({ url, title, duration, thumbnail, req }: SongData) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.req = req;
    }

    public static async from({ url = "", search = "", interaction }: { url: string; search: string; interaction: CommandInteraction | ChatInputCommandInteraction; }): Promise<Song> {
        const isYoutubeUrl = play.yt_validate(url) === "video";
        const isSpotifyUrl = play.sp_validate(url) === "track";
        const isSoundCloudUrl = await play.so_validate(url) === "track";

        let songInfo: videoInfo | SoundCloud | Spotify;
        let spotifyTitle: string, spotifyArtist: string;
        if (isSpotifyUrl) {
            const spotifyInfo = await play.spotify(url) as SpotifyTrack;
            spotifyTitle = spotifyInfo.name;
            spotifyArtist = spotifyInfo.artists[0].name;

            const spotifyresult = await play.search(`${spotifyArtist} - ${spotifyTitle}`, { limit: 1 });
            songInfo = await video_basic_info(spotifyresult[0].url);

            return new this({
                title: songInfo.video_details.title as string,
                url: songInfo.video_details.url,
                duration: songInfo.video_details.durationInSec,
                thumbnail: songInfo.video_details.thumbnails[0].url,
                req: interaction.user.tag
            });
        } else if (isSoundCloudUrl) {
            const scSong = await play.soundcloud(url) as SoundCloudTrack;
            return new this({
                title: scSong.name as string,
                url: scSong.permalink,
                duration: scSong.durationInSec,
                thumbnail: scSong.thumbnail,
                req: interaction.user.tag
            });
        } else if (isYoutubeUrl) {
            songInfo = await video_basic_info(url);

            return new this({
                url: songInfo.video_details.url,
                title: songInfo.video_details.title as string,
                duration: songInfo.video_details.durationInSec,
                thumbnail: songInfo.video_details.thumbnails[0].url,
                req: interaction.user.tag
            });
        } else {
            const result = await play.search(search, { limit: 1 });
            songInfo = await video_basic_info(result[0].url);

            return new this({
                url: songInfo.video_details.url,
                title: songInfo.video_details.title as string,
                duration: songInfo.video_details.durationInSec,
                thumbnail: songInfo.video_details.thumbnails[0].url,
                req: interaction.user.tag
            });
        }
    }

    public async makeResource(): Promise<AudioResource<Song> | void> {
        const playStream = await stream(this.url);

        if (!playStream) return;

        return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
    }

    public startMessage(): { embeds: EmbedBuilder[]; } {
        const playingEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setURL(this.url)
            .setThumbnail(this.thumbnail as string ? this.thumbnail as string : null)
            .setDescription(`Started playing: **${this.title}**.`);

        return { embeds: [playingEmbed] };
    }
}
