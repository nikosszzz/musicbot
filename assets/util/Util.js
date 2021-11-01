const
    { MessageEmbed } = require("discord.js"),
    { STAY_TIME, SOUNDCLOUD_CLIENT_ID, PRUNING } = require("../handlers/config"),
    ytdl = require("ytdl-core-discord"),
    scdl = require("soundcloud-downloader").default;

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);

        if (!song) {
            setTimeout(function () {
                if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
                queue.channel.leave();
                let inactivityLeave = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`Track Player`)
                    .setDescription(`Leaving voice channel after 20 seconds of inactivity.`)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                !PRUNING && queue.textChannel.send(inactivityLeave);
            }, STAY_TIME * 1000);
            return message.client.queue.delete(message.guild.id);
        };

        let stream = null;
        let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
        let seekTime = 0;
        let encoderArgstoset;

        try {
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url, {
                    filter: "audioonly",
                    opusEncoded: true,
                    encoderArgs: encoderArgstoset,
                    bitrate: 320,
                    seek: seekTime,
                    quality: "highestaudio",
                    liveBuffer: 40000,
                    highWaterMark: 1 << 25,
                });
            } else if (song.url.includes("soundcloud.com")) {
                try {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
                } catch (error) {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
                    streamType = "unknown";
                }
            }
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }
            console.error(error);
            return message.channel.send(`Error: ${error.message ? error.message : error}`);
        }

        queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on("finish", () => {

                queue.connection.removeAllListeners("disconnect");

                if (queue.loop) {
                    // if loop is on, push the song back at the end of the queue
                    let lastSong = queue.songs.shift();
                    queue.songs.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                } else {
                    // Recursively play the next song
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                };
            })
            .on("error", (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        let playingEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle(`Track Player`)
            .setURL(song.url)
            .setDescription(`Started playing: **${song.title}**.`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        var playingMessage = await queue.textChannel.send(playingEmbed);

        if (PRUNING && playingMessage && !playingMessage.deleted) {
            playingMessage.delete({ timeout: 30000 }).catch(console.error);
        }
    },
};