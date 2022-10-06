import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { getInfo } from "ytdl-core";
import { parse, Track } from "spotify-uri";
//@ts-ignore
import Spotify from "node-spotify-api";
import ytdl from "ytdl-core-discord";
import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder } from "discord.js";
import { videoPattern, spotifyPattern } from "@utils/patterns";
import { config } from "@utils/config";

const spotify = new Spotify({
    id: config.SPOTIFY_CLIENT_ID,
    secret: config.SPOTIFY_SECRET_ID
});
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
        const isYoutubeUrl = videoPattern.test(url);
        const isSpotifyUrl = spotifyPattern.test(url);

        let songInfo;
        let spotifyTitle: string, spotifyArtist: string;
        if (isSpotifyUrl) {
            const spotifyTrackID = (parse(url) as Track).id;
            const spotifyInfo = await spotify.request(`https://api.spotify.com/v1/tracks/${spotifyTrackID}`).catch((err: any) => {
                return interaction.reply("There was a error with the Spotify Stack: ```" + err + "```");
            });
            spotifyTitle = spotifyInfo.name;
            spotifyArtist = spotifyInfo.artists[0].name;

            const spotifyresult = await youtube.searchOne(`${spotifyArtist} - ${spotifyTitle}`);
            songInfo = await getInfo(spotifyresult.url);
            return new this({
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: parseInt(songInfo.videoDetails.lengthSeconds),
                thumbnail: songInfo.thumbnail_url,
                req: interaction.user.tag
            });
        } else if (isYoutubeUrl) {
            songInfo = await getInfo(url);

            return new this({
                url: songInfo.videoDetails.video_url,
                title: songInfo.videoDetails.title,
                duration: parseInt(songInfo.videoDetails.lengthSeconds),
                thumbnail: songInfo.thumbnail_url,
                req: interaction.user.tag
            });
        } else {
            const result = await youtube.searchOne(search);
            songInfo = await getInfo(result.url);

            return new this({
                url: songInfo.videoDetails.video_url,
                title: songInfo.videoDetails.title,
                duration: parseInt(songInfo.videoDetails.lengthSeconds),
                thumbnail: songInfo.thumbnail_url,
                req: interaction.user.tag
            });
        }
    }

    public async makeResource(): Promise<AudioResource<Song> | void> {
        let stream;

        const type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

        const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

        if (source === "youtube") {
            stream = await ytdl(this.url, { highWaterMark: 1 << 25, quality: "highestaudio" });
        }

        if (!stream) return;

        return createAudioResource(stream, { metadata: this, inputType: type, inlineVolume: true });
    }

    public startMessage(): { embeds: EmbedBuilder[]; } {
        const playingEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("Track Player")
            .setURL(this.url)
            .setThumbnail(this.thumbnail)
            .setDescription(`Started playing: **${this.title}**.`);

        return { embeds: [playingEmbed] };
    }
}
