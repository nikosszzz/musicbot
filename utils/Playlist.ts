import youtube, { Playlist as youtubePlaylist, Thumbnail, Video } from "youtube-sr";
import { config } from "@utils/config";
import { Song } from "@utils/Song";
import { playlistPattern, spotifyPlaylistPattern } from "@utils/patterns";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import SpotifyUrlInfo, { Tracks } from "spotify-url-info";
import { fetch } from "undici";

export class Playlist {
    public readonly data: youtubePlaylist;
    public readonly req: string;
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
        const isYoutubeUrl = playlistPattern.test(url);
        const isSpotifyUrl = spotifyPlaylistPattern.test(url);

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
        } else {
            const result = await youtube.searchOne(search, "playlist");
            playlist = await youtube.getPlaylist(result?.url as string);
        }

        return new this({ playlist, interaction });
    }
}
