import { Playlist as youtubePlaylist, type Thumbnail, type Video, YouTube as youtube } from "youtube-sr";
import { config } from "@components/config";
import { Song } from "@components/Song";
import type { CacheType, ChatInputCommandInteraction } from "discord.js";
//@ts-expect-error
import SpotifyUrlInfo, { Tracks } from "spotify-url-info";
import { fetch } from "undici";
import play, { type SoundCloudPlaylist } from "play-dl";

export class Playlist {
    public readonly data: youtubePlaylist;
    public readonly videos: Song[];

    public constructor({ playlist, interaction }: { playlist: youtubePlaylist; interaction: ChatInputCommandInteraction<CacheType>; }) {
        this.data = playlist;

        this.videos = this.data.videos
            .filter((video: Video) => !["Private video", "Deleted video"].includes(video.title!))
            .slice(0, config.MAX_PLAYLIST_SIZE)
            .map((video: Video): Song => new Song({
                title: video.title as string,
                url: video.url,
                duration: video.duration / 1000,
                thumbnail: (video.thumbnail as Thumbnail).url as string,
                req: interaction.user.tag
            }));
    }

    public static async from({ url = "", search = "", interaction }: { url: string; search: string; interaction: ChatInputCommandInteraction<CacheType> }): Promise<Playlist> {
        const isYoutubeUrl = play.yt_validate(url) === "playlist";
        const isSpotifyUrl = ["playlist", "album"].includes(play.sp_validate(url) as string);
        const isSoundCloudUrl = await play.so_validate(url) === "playlist";

        let playlist: youtubePlaylist;
        if (isSpotifyUrl) {
            const playlistTrack = await SpotifyUrlInfo(fetch).getTracks(url);
            const limitedPlaylistTrack = playlistTrack.slice(0, config.MAX_PLAYLIST_SIZE);
            const spotifyPl = Promise.all(limitedPlaylistTrack.map(async (track: Tracks): Promise<Video> => await youtube.searchOne(`${track.name} - ${track.artists ? track.artists[0].name : ""}`, "video")));
            playlist = new youtubePlaylist({ videos: (await spotifyPl).filter((song: Video) => song.title !== undefined || song.duration !== undefined) });
        } else if (isYoutubeUrl) {
            playlist = await youtube.getPlaylist(url);
        } else if (isSoundCloudUrl) {
            const scPl = await play.soundcloud(url) as SoundCloudPlaylist;
            const scPlTracks = (await scPl.all_tracks()).map((track) => ({
                title: track.name,
                url: track.permalink,
                duration: track.durationInSec,
                thumbnail: {
                    url: track.thumbnail
                },
                req: interaction.user.tag
            }));
            playlist = new youtubePlaylist({ videos: scPlTracks, title: scPl.name, url: scPl.url });
        } else {
            const result = await play.search(search, {
                source: {
                    youtube: "playlist"
                },
                limit: 1
            });
            playlist = await youtube.getPlaylist(result[0].url as string);
        }

        return new this({ playlist, interaction });
    }
}
