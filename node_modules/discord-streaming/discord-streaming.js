/*
Streaming Highligh Module for DiscordJS
Author: Flisher (andre@jmle.net)
Version 2.3.1

##History:
2.3.1 Fixed a possible error on line 100 when roles was not accessible, bumped depedencies version
2.2.4 Fixing error on missing .cache
2.2.0 Improved error logging  
2.0.0 Initial push to GitHub, and Initial Discord.js v12 verion  
1.4.1 Last Discord.JS V11 version, you can install it by using "npm i discord-streaming@discord.js-v11"
1.0.0 Initial publish  


// Todo: 
	Add randomness in the minutes for the cron task
	Add a limit of actions per minutes
	Add muti roles capability per server
*/

module.exports = async (bot, options) => {
	const cron = require('node-cron');

	const description = {
		name: `discord-Streaming`,
		filename: `discord-streaming.js`,
		version: `2.3.1`
	}

	console.log(`Module: ${description.name} | Loaded - version ${description.version} from ("${description.filename}")`)
	const DiscordJSversion = require("discord.js").version
	if (DiscordJSversion.substring(0, 2) !== "12") console.error("This version of discord-lobby only run on DiscordJS V12 and up, please run \"npm i discord-streaming@discord.js-v11\" to install an older version")
	if (DiscordJSversion.substring(0, 2) !== "12") return

	if (!options) {
		options = {};
	}

	let Ready = false

	// Add check on startup and intialize the Ready Value
	if (options.AlreadyReady === true) {
		onReady()
		delete options.AlreadyReady
	} else {
		bot.on("ready", () => {
			onReady()
		});
	}

	async function onReady() {
		Ready = true;
		console.log(`Module: ${description.name} | Ready`)
	}

	// Add a Cron job every minutes
	let jobStreamingCheck = new cron.schedule('*/3 * * * * *', function () { // check 10 seeconds
		if (!Ready) return;
		Check(bot, options);
	});

	async function Check(bot, options) {
		if (!Ready) return;
		Ready = false

		if (options && options.live) {
			// Single Server Config, will default to first guild found in the bot
			let guild = bot.guilds.cache.first();
			await StreamingLive(guild, options)
			await StreamingNotLive(guild, options)
		} else {
			// Multi-Servers Config
			for (let key in options) {
				// check that guild is loaded			
				let guild = bot.guilds.cache.get(key);
				if (guild) {
					await StreamingLive(guild, options[key])
					await StreamingNotLive(guild, options[key])
				} else {
					console.log(`${description.name} -> Check - Bot isn't connected to Guild "${key}"`)
				}
			}
		}
		Ready = true
	}

	function gotRequiredRole(member, requiredRole) {
		let returnValue = false
		try {
			if (typeof requiredRole !== "undefined" && member && member.roles && member.roles.cache) {
				returnValue = (typeof (member.roles.cache.find(val => val.name === requiredRole || val.id === requiredRole)) !== "undefined")
			} else {
				returnValue = true
			}
		} catch (e) {
			console.error(`${description.name} -> StreamingLive - Bot failed the gotRequiredRole function for ${member} of guild ${member.guild} / ${member.guild.id} )`);
			console.error(e)
		}
		return returnValue
	}

	async function addRole(member, role) {
		let actionTaken = false
		try {
			if (!member.roles.cache.find(val => val.name === role || val.id === role)) {
				let resolvableRole = member.guild.roles.cache.find(val => val.name === role || val.id === role)
				await member.roles.add(resolvableRole)
				actionTaken = true
			} else {
				// Do Nothing
			}
		} catch (e) {
			console.error(`${description.name} -> StreamingLive - Bot could not assign role to ${member} of guild ${member.guild} / ${member.guild.id} )`);
			console.error(e)
		}
		return actionTaken
	}


	async function removeRole(member, role) {
		let actionTaken = false
		try {
			if (member.roles.cache.find(val => val.name === role || val.id === role)) {
				let resolvableRole = member.guild.roles.cache.find(val => val.name === role || val.id === role)
				await member.roles.remove(resolvableRole)
				actionTaken = true
			} else {
				// Do Nothing
			}
		} catch (e) {
			console.error(`${description.name} -> StreamingLive - Bot could not remove role to ${member} of guild ${member.guild} / ${member.guild.id} )`);
			console.error(e)
		}
		return actionTaken
	}



	async function StreamingLive(guild, options) {
		// Check if the bot can manage Roles for this guild
		if (guild.me.hasPermission("MANAGE_ROLES")) {
			// Loop trough presence to find streamers (type 1)
			let presences = guild.presences;
			let actionAlreadyTaken = false
			if (presences) {
				// presences.cache.forEach(async function (element, key) {	
				for (let [key, element] of presences.cache) {
					if (!actionAlreadyTaken) { // This check will skip the elements if an action was already taken, it's to prevent API spam when too many status need to be updated
						// Loop trought presence within the cache
						if (typeof element.activities !== undefined) { // element.activities will be set only if there is 1 or more activities active
							// The activities list is an array, needing to parse trought it
							for (let activityKey in element.activities) {
								let activity = element.activities[activityKey]
								if (activity && activity.type === "STREAMING") {
									let member = element.guild.members.cache.get(key)
									if (gotRequiredRole(member, options.required)) {
										actionAlreadyTaken = await addRole(member, options.live)
									}
								}
							}
						}
					}
				}
			}
		} else {
			console.error(`${description.name} -> StreamingLive - Bot doesn't have "MANAGE_ROLES" permission on Guild "${guild.name}" (${guild.id})`);
		}
	}

	async function StreamingNotLive(guild, options) {
		// Check if the bot can manage Roles for this guild
		if (guild.me.hasPermission("MANAGE_ROLES")) {
			// Loop trough presence to find streamers (type 1)
			let StreamingMembers = guild.roles.cache.find(val => val.name === options.live).members
			let actionAlreadyTaken = false // This check will skip the elements if an action was already taken, it's to prevent API spam when too many status need to be updated
			for (let [memberid, member] of StreamingMembers) {
				if (!actionAlreadyTaken) {
					let isStreamingLive = false
					if (member.presence && typeof member.presence.activities !== undefined && Object.keys(member.presence.activities).length > 0) {
						// Need to iterate activities
						for (let activityKey in member.presence.activities) {
							let activity = member.presence.activities[activityKey]
							if (activity && activity.type === "STREAMING") {
								isStreamingLive = true
							}
						}
					} else {
						// No activity, the member isn't streaming anymore
					}
					if (!isStreamingLive) actionAlreadyTaken = await removeRole(member, options.live)
				}
			}
		} else {
			console.error(`${description.name} -> StreamingLive - Bot doesn't have "MANAGE_ROLES" permission on Guild "${guild.name}" (${guild.id})`);
		}
	}
}