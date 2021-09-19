const
    { MessageEmbed } = require("discord.js"),
    { play } = require('../../assets/util/Util'),
    { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE, DEFAULT_VOLUME, DEFAULTPREFIX } = require("../../assets/handlers/config"),
    { getTracks } = require('spotify-url-info'),
    YouTubeAPI = require("simple-youtube-api"),
    scdl = require("soundcloud-downloader").default,
    youtube = new YouTubeAPI(YOUTUBE_API_KEY),
    ytsr = require('ytsr');

module.exports = {
    config: {
        name: "playlist",
        aliases: ["pl"],
        description: "Play a playlist from YouTube or SoundCloud.",
    },
    execute: async (message, args) => {
        const { channel } = message.member.voice;
        const serverQueue = message.client.queue.get(message.guild.id);

        let joinVCF = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join a voice channel first.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let vcsc = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You must be in the same channel as ${message.client.user}.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let usagevc1 = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${DEFAULTPREFIX}${module.exports.config.name} <YouTube Playlist URL or Soundcloud Playlist URL>.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!channel) return message.channel.send(joinVCF);
        if (serverQueue && channel !== message.guild.me.voice.channel) return message.channel.send(vcsc);
        if (!args.length) return message.channel.send(usagevc1);

        const permissions = channel.permissionsFor(message.client.user);

        let missingperms = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`I am missing permissions to join your channel or speak in your voice channel.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!permissions.has(["CONNECT", "SPEAK"])) return message.channel.send(missingperms);

        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
        const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0]);
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const playQueue = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME,
            muted: false,
            playing: true
        };

        let newSongs = null;
        let playlist = null;
        let videos = [];
        let waitMessage = null;

        if (spotifyPlaylistValid) {
            try {
                waitMessage = await message.channel.send('Fetching playlist...');
                let playlistTrack = await getTracks(url);
                if (playlistTrack > MAX_PLAYLIST_SIZE) {
                    playlistTrack.length = MAX_PLAYLIST_SIZE
                };
                const spotifyPl = await Promise.all(playlistTrack.map(async (track) => {
                    let result;
                    const ytsrResult = await ytsr((`${track.name} - ${track.artists ? track.artists[0].name : ''}`), { limit: 1 });
                    result = ytsrResult.items[0];
                    return (song = {
                        title: result.title,
                        url: result.url,
                        duration: result.duration ? result.duration : undefined,
                        thumbnail: result.thumbnails ? result.thumbnails[0].url : undefined
                    });
                }));

                const result = await Promise.all(spotifyPl.filter((song) => song.title != undefined || song.duration != undefined));
                videos = result;
            } catch (err) {
                console.log(err);
                return message.channel.send(err ? err.message : 'There was an error!');
            };
        } else if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "id" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.channel.send("The playlist was not found.");
            };
        } else if (scdl.isValidUrl(args[0])) {
            if (args[0].includes("/sets/")) {
                message.channel.send("⌛ Fetching SoundCloud playlist...");
                playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
                videos = playlist.tracks.map((track) => ({
                    title: track.title,
                    url: track.permalink_url,
                    duration: track.duration / 1000,
                    req: message.author,
                }));
            };
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message);
            };
        };

        newSongs = videos
            .filter((video) => video.title != "Private video" && video.title != "Deleted video")
            .map((video) => {
                return (song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationSeconds,
                    req: message.author,
                });
            });

        serverQueue ? serverQueue.songs.push(...newSongs) : playQueue.songs.push(...newSongs);

        let playlistEmbed = new MessageEmbed()
            .setTitle(`Track Player`)
            .setDescription(`The following playlist has been added to the queue:`)
            .addField(playlist ? playlist.title : 'Spotify Playlist', `** **`)
            .setURL(playlist ? playlist.url : 'https://www.spotify.com/')
            .setColor("#000000")
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        waitMessage ? waitMessage.delete() : null;
        message.channel.send(playlistEmbed);

        if (!serverQueue) {
            message.client.queue.set(message.guild.id, playQueue);

            try {
                playQueue.connection = await channel.join();
                await playQueue.connection.voice.setSelfDeaf(true);
                play(playQueue.songs[0], message);
            } catch (error) {
                console.error(error);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                console.log(`BOT LOG: [TRACK PLAYER] Couldnt join a channel in ${message.guild.name}. Error Output: ${error}`);
                return message.channel.send(`An error has occured and it has automatically been reported.`);
            };
        };
    },
};