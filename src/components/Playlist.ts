import { config } from "@components/config";
import { Song } from "@components/Song";
import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { sp_validate, so_validate, yt_validate, playlist_info, soundcloud, spotify, search as playSearch, type SoundCloudPlaylist, YouTubePlayList, YouTubeVideo, SpotifyPlaylist, SoundCloudTrack, video_basic_info, is_expired, refreshToken } from "play-dl";

type dataType = SpotifyPlaylist | YouTubePlayList | SoundCloudPlaylist;
type tracksType = YouTubeVideo[] | SoundCloudTrack[];

export class Playlist {
    public readonly data: SpotifyPlaylist | YouTubePlayList | SoundCloudPlaylist;
    public readonly videos: Song[];

    public constructor({ playlist, interaction }: { playlist: { data: dataType, tracks: tracksType }; interaction: ChatInputCommandInteraction<CacheType>; }) {
        this.data = playlist.data;

        this.videos = playlist.tracks
            .slice(0, config.MAX_PLAYLIST_SIZE)
            .map((video) => video instanceof YouTubeVideo ? new Song({
                title: video.title!,
                url: video.url,
                duration: video.durationInSec,
                durationRaw: video.durationRaw,
                thumbnail: video.thumbnails[0].url,
                req: interaction.user.tag
            }) : new Song({
                title: video.name,
                url: video.url,
                duration: video.durationInSec,
                durationRaw: undefined,
                thumbnail: video.thumbnail,
                req: interaction.user.tag
            }));
    };

    public static async from({ search, interaction }: { search: string; interaction: ChatInputCommandInteraction<CacheType> }): Promise<Playlist> {
        const isYoutubeUrl = yt_validate(search) === "playlist";
        const isSpotifyUrl = ["playlist", "album"].includes(sp_validate(search) as string);
        const isSoundCloudUrl = await so_validate(search) === "playlist";

        let pl: { data: dataType, tracks: tracksType }
        if (isSpotifyUrl) {
            if (is_expired()) await refreshToken();
            const playlist = await spotify(search) as SpotifyPlaylist

            const ytVideos = await Promise.all((await playlist.all_tracks()).map(async track => (await video_basic_info((await playSearch(`${track.artists[0].name} - ${track.name}`, { source: { youtube: "video" } }))[0].url)).video_details));

            pl = { data: playlist, tracks: ytVideos };
        } else if (isYoutubeUrl) {
            const playlist = await playlist_info(search, { incomplete: true });

            pl = { data: playlist, tracks: await playlist.all_videos() };
        } else if (isSoundCloudUrl) {
            const playlist = await soundcloud(search) as SoundCloudPlaylist;

            pl = { data: playlist, tracks: await playlist.all_tracks() };
        } else {
            const playlist = await playlist_info((await playSearch(search, { source: { youtube: "playlist" } }))[0].url!, { incomplete: true });

            pl = { data: playlist, tracks: await playlist.all_videos() };
        }

        return new this({ playlist: { data: pl.data, tracks: pl.tracks }, interaction });
    }
}
