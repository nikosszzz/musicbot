import { Playlist as youtubePlaylist, Thumbnail, Video, YouTube as youtube } from "youtube-sr";
import { config } from "@components/config";
import { Song } from "@components/Song";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import SpotifyUrlInfo, { Tracks } from "spotify-url-info";
import { fetch } from "undici";
import play, { SoundCloudPlaylist } from "play-dl";

export class Playlist {
    public readonly data: youtubePlaylist;
    public readonly videos: Song[];

    public constructor({ playlist, interaction }: { playlist: youtubePlaylist; interaction: CommandInteraction | ChatInputCommandInteraction; }) {
        this.data = playlist;

        this.videos = this.data.videos
            .filter((video: Video) => video.title != "Private video" && video.title != "Deleted video")
            .slice(0, config.MAX_PLAYLIST_SIZE)
            .map((video: Video): Song => new Song({
                title: video?.title as string,
                url: video.url,
                duration: video.duration / 1000,
                thumbnail: (video.thumbnail as Thumbnail).url as string,
                req: interaction.user.tag
            }));
    }

    public static async from({ url = "", search = "", interaction }: { url: string; search: string; interaction: CommandInteraction | ChatInputCommandInteraction; }): Promise<Playlist> {
        const isYoutubeUrl = play.yt_validate(url) === "playlist";
        const isSpotifyUrl = play.sp_validate(url) === "playlist" || play.sp_validate(url) === "album";
        const isSoundCloudUrl = await play.so_validate(url) === "playlist";

        let playlist: youtubePlaylist;
        if (isSpotifyUrl) {
            const playlistTrack = await SpotifyUrlInfo(fetch).getTracks(url);
            if (playlistTrack.length > config.MAX_PLAYLIST_SIZE) {
                playlistTrack.length = config.MAX_PLAYLIST_SIZE;
            }

            const spotifyPl = Promise.all(playlistTrack.map(async (track: Tracks): Promise<Video> => {
                return await youtube.searchOne(`${track.name} - ${track.artists ? track.artists[0].name : ""}`, "video");
            }));
            playlist = new youtubePlaylist({ videos: await Promise.all((await spotifyPl).filter((song: Video): boolean => song.title != undefined || song.duration != undefined)) });
        } else if (isYoutubeUrl) {
            playlist = await youtube.getPlaylist(url);
        } else if (isSoundCloudUrl) {
            const scPl = await play.soundcloud(url) as SoundCloudPlaylist;

            const scPlTracks = (await scPl.all_tracks()).map((track) => {
                return ({
                    title: track.name,
                    url: track.permalink,
                    duration: track.durationInSec,
                    thumbnail: {
                        url: track.thumbnail
                    },
                    req: interaction.user.tag
                });
            });

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
