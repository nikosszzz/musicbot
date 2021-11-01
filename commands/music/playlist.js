const
    { MessageEmbed } = require("discord.js"),
    { play } = require('../../assets/util/Util'),
    { SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE, DEFAULT_VOLUME } = require("../../assets/handlers/config"),
    { getTracks } = require('spotify-url-info'),
    YouTube = require("youtube-sr").default,
    scdl = require("soundcloud-downloader").default,
    ytsr = require('ytsr');

module.exports = {
    config: {
        name: "playlist",
        category: 'music',
        aliases: ["pl"],
        description: "Play a playlist from YouTube or SoundCloud.",
    },
    execute: async (message, args) => {
        const { channel } = message.member.voice;
        const serverQueue = message.client.queue.get(message.guild.id);

        /* Embeds for music */
        let playlistFetch = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Fetching playlist...`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let playlistNotFound = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`The playlist was not found.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInVC = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join a voice channel first.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let notInBotChannel = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`You need to join the voice channel the bot is in.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        let cmdUsage = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <YouTube Playlist URL or Soundcloud Playlist URL>.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!channel) return message.channel.send(notInVC);
        if (serverQueue && channel !== message.guild.me.voice.channel) return message.channel.send(notInBotChannel);
        if (!args.length) return message.channel.send(cmdUsage);

        const permissions = channel.permissionsFor(message.client.user);
        let botNoPermissions = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setDescription(`I am missing permissions to join your channel or speak in your voice channel.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        if (!permissions.has(["CONNECT", "SPEAK"])) return message.channel.send(botNoPermissions);

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
                waitMessage = await message.channel.send(playlistFetch);
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
                playlist = await YouTube.getPlaylist(url);
                videos = await playlist.fetch();
            } catch (error) {
                console.error(error);
                return message.channel.send(playlistNotFound);
            };
        } else if (scdl.isValidUrl(args[0])) {
            if (args[0].includes("/sets/")) {
                message.channel.send(playlistFetch);
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
                const results = await YouTube.getPlaylist(url);
                playlist = results[0];
                videos = await playlist.next();
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message);
            };
        };

        newSongs = videos.videos || videos
            .filter((video) => video.title != "Private video" && video.title != "Deleted video")
            .map((video) => {
                return (song = {
                    title: video.title,
                    url: video.url,
                    duration: video.duration,
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
                message.client.queue.delete(message.guild.id);
                console.log(`BOT LOG: [TRACK PLAYER] Couldnt join a channel in ${message.guild.name}. Error Output: ${error}`);
                return await channel.leave();
            };
        };
    },
};