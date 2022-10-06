import youtube, { Playlist as youtubePlaylist, Thumbnail } from "youtube-sr";
import { config } from "@utils/config";
import { Song } from "@utils/Song";
import { playlistPattern } from "@utils/patterns";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

export class Playlist {
    public data: youtubePlaylist;
    public req: string;
    public videos: Song[];

    public constructor({ playlist, interaction }: { playlist: youtubePlaylist; interaction: CommandInteraction | ChatInputCommandInteraction; }) {
        this.data = playlist;

        this.videos = this.data.videos
            .filter((video) => video.title != "Private video" && video.title != "Deleted video")
            .slice(0, config.MAX_PLAYLIST_SIZE)
            .map((video): Song => new Song({
                title: video?.title as string,
                url: video.url,
                duration: video.duration / 1000,
                thumbnail: (video.thumbnail as Thumbnail).url as string,
                req: interaction.user.tag
            }));
    }

    public static async from({ url = "", search = "", interaction }: { url: string; search: string; interaction: CommandInteraction | ChatInputCommandInteraction; }): Promise<Playlist> {
        const isYoutubeUrl = playlistPattern.test(url);
        //const isSpotifyUrl = spotifyPlaylistPattern.test(url);

        let playlist: youtubePlaylist;

        if (isYoutubeUrl) {
            playlist = await youtube.getPlaylist(url);
        } else {
            const result = await youtube.searchOne(search, "playlist");
            playlist = await youtube.getPlaylist(result?.url as string);
        }

        return new this({ playlist, interaction });
    }
}
