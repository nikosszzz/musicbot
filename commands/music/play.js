const
    { MessageEmbed } = require("discord.js"),
    { play } = require('../../assets/util/Util'),
    { SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME, SPOTIFY_CLIENT_ID, SPOTIFY_SECRET_ID, DEFAULTPREFIX } = require("../../assets/handlers/config"),
    ytdl = require("ytdl-core"),
    YouTube = require("youtube-sr").default,
    scdl = require("soundcloud-downloader").default,
    https = require("https"),
    spotifyURI = require('spotify-uri'),
    Spotify = require('node-spotify-api'),

    spotify = new Spotify({
        id: SPOTIFY_CLIENT_ID,
        secret: SPOTIFY_SECRET_ID
    });

module.exports = {
    config: {
        name: "play",
        aliases: ["p"],
        description: "Plays audio from YouTube, Spotify or SoundCloud.",
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
            .setDescription(`Usage: ${message.client.prefix}${module.exports.config.name} <YouTube Video Name/URL, Spotify Link or Soundcloud URL>.`)
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
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
        const spotifyPattern = /^.*(https:\/\/open\.spotify\.com\/track)([^#\&\?]*).*/gi;
        const spotifyValid = spotifyPattern.test(args[0]);
        const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
        const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0]);
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get("playlist").execute(message, args);
        } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
            return message.client.commands.get("playlist").execute(message, args);
        } else if (spotifyPlaylistValid) {
            return message.client.commands.get("playlist").execute(message, args);
        };

        if (mobileScRegex.test(url)) {
            try {
                https.get(url, function (res) {
                    if (res.statusCode == "302") {
                        return message.client.commands.get("play").execute(message, [res.headers.location]);
                    } else {
                        return message.channel.send("No content could be found at that url.").catch(console.error);
                    };
                });
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            };
            return message.channel.send("Following url redirection...").catch(console.error);
        };

        const playQueue = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME,
            muted: false,
            playing: true,
        };

        let songInfo = null;
        let song = null;

        if (spotifyValid) {
            let spotifyTitle, spotifyArtist;
            const spotifyTrackID = spotifyURI.parse(url).id;
            const spotifyInfo = await spotify.request(`https://api.spotify.com/v1/tracks/${spotifyTrackID}`).catch(err => {
                return message.channel.send("There was a error with the Spotify feature: \`\`\`" + err + "\`\`\`");
            });
            spotifyTitle = spotifyInfo.name;
            spotifyArtist = spotifyInfo.artists[0].name;

            try {
                const spotifyresult = await YouTube.search(`${spotifyTitle} - ${spotifyArtist}`, { limit: 1 });
                songInfo = await ytdl.getInfo(spotifyresult[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    req: message.author,
                };
            } catch (err) {
                console.log(err);
                return message.channel.send("There was a error with the Spotify feature: \`\`\`" + err + "\`\`\`");
            };

        } else if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            };
        } else if (scRegex.test(url)) {
            try {
                const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
                song = {
                    title: trackInfo.title,
                    url: trackInfo.permalink_url,
                    duration: Math.ceil(trackInfo.duration / 1000),
                    req: message.author,
                    id: trackInfo.permalink
                };
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            };
        } else {
            try {
                const results = await YouTube.search(search, { limit: 1 });
                if (results.length <= 0) {
                    message.channel.send(`No video results.`).catch(console.error);
                    return;
                };
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    req: message.author,
                    views: String(songInfo.videoDetails.viewCount).padStart(10, " ")
                };
            } catch (error) {
                let errorembed = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Track Player`)
                    .setDescription(error.message)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                console.error(error);
                return message.channel.send(errorembed);
            };
        };

        if (serverQueue) {
            serverQueue.songs.push(song);

            let songaddqueue = new MessageEmbed()
                .setColor('#000000')
                .setTitle(`Track Player`)
                .setDescription(`**${song.title}** has been added to the queue by ${message.author}.`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            return serverQueue.textChannel.send(songaddqueue);
        }
        playQueue.songs.push(song);
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
    },
};