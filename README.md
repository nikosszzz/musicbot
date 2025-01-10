<h1 align="center"> Music Bot </h1>
<div align="center">🎵⚡ A fast and easy to use Discord.JS 14 music bot that supports YouTube, Spotify and SoundCloud sources to play music off! ⚡🎵</div>
<br>

<div align="center"> 
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/nikosszzz/musicbot?style=flat-square&label=🌟 Stars&labelColor=3c3836&color=1d2021">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/nikosszzz/musicbot?style=flat-square&label=🔗 Forks&labelColor=3c3836&color=1d2021">
    <img alt="GitHub Issues" src="https://img.shields.io/github/issues/nikosszzz/musicbot?style=flat-square&label=⚠️ Issues&labelColor=3c3836&color=1d2021">
    <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/t/nikosszzz/musicbot/main?style=flat-square&label=🧾 Commits&labelColor=3c3836&color=1d2021">
</div>

<hr>

## ✨ Music Bot Features

- Playback support for: YouTube, Spotify (with YT Search), SoundCloud
- Fast and optimized music system using play-dl
- Key-less YouTube support
- Slash Commands

## ❓ How to run

- Install latest Node.JS LTS and Git.
- Install the bot's dependencies (pnpm, npm or whatever you use).
- Modify the `Bot.ts`files  in `./src/components/` for your bot's configuration.
- Either make a `.env` file based off the config in `.env-example` or configure the `config.ts` in `./src/components/` for your bot.
- Run the `build` script.
- Run the `bundle.js` output file in the `dist` folder or the `start` script.

## ❓ Extra information

As of @discordjs/voice version 0.18.0, you must only install one of the following packages yourself if your system doesn't support AES-256-GCM (verify by running require `('node:crypto').getCiphers().includes('aes-256-gcm')`)

- sodium-native: ^3.3.0
- sodium: ^3.0.2
- @stablelib/xchacha20poly1305: ^2.0.0
- @noble/ciphers: ^1.0.0
- libsodium-wrappers: ^0.7.9

You will also need to install node-gypm and the requirements that they tell you for a C++ compiler for your operating system as `zlib-sync` uses C++.

## 🛠️ Contributions

If you think you can improve Music Bot, please submit a pull request that has well written and efficient code. Slow and poorly written code will be rejected or asked to be re-written properly.

## 🤝 Support

Submit an issue here in the repository, or join the Infinium Community (My own bot which Music Bot has been based off): https://discord.gg/QFvCUDydvV

## 🌟 Credits
 - [eritislami/evobot](https://github.com/eritislami/evobot) for their amazing music system which I adapted with some personal changes.