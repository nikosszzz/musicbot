<p align="center"><a href="https://nodei.co/npm/discord-streaming/"><img src="https://nodei.co/npm/discord-streaming.png"></a></p>

# discord-streaming
An extremely simple module that highligh Live Streamers by assigning them a temporary role 

## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.
Simply type the following command to install the module and it depedencies.
```
npm i discord-streaming
``` 
## Discord.js v11 compatibility
You can install the last version working with Discord.js v11 by using "npm install discord-streaming@discord.js-v11".
While this version should work, it's not maintainted anymore.

## Instructions


Once you've done this, setting the module will be very easy.
And you can follow the code  below to get started!

###Single-Server Usage (no server ID required in the configuration)
```js
const Streaming = require("discord-streaming");

Streaming(client, {
	live :  "STREAM LIVE"
	,required : "Streamers" // optional parameter, only use if you want to take action on people of a specific role
});
```
###Multi-Servers Usage 

```js
const Streaming = require("discord-streaming");

Streaming(client, {
	"serverid1" : {
		live :  "STREAM LIVE"
		,required : "Streamers" // optional parameter, only use if you want to take action on people of a specific role
	}, 
	"serverid12" : {
		live :  "STREAM LIVE"		
		//,required : "Streamers" // optional parameter, only use if you want to take action on people of a specific role
	}
});
```

##Caveat:
-If you take actions on roles that have duplicate name, the module might get confused 
-Multi-Servers configuration require to know Server ID

###English:
This module was initialy coded for the Bucherons.ca gamers community and the Star Citizen Organization "Gardiens du LYS".

###Français:
Ce module a initiallement été conçu pour la communauté de gamers Bucherons.ca, la communauté gaming pour adultes au Québec, et l'organisation des Gardiens du LYS dans Star Citizen.  
  
Liens:  https://www.bucherons.ca et https://www.gardiensdulys.com  

##Support:
You can reach me via my Discord Development Server at https://discord.gg/Tmtjkwz

###History:  
2.3.1 Fixed a possible error on line 100 when roles was not accessible, bumped depedencies version
2.2.4 Fixing error on missing .cache
2.2.0 Improved error logging  
2.0.0 Initial push to GitHub, and Initial Discord.js v12 verion  
1.4.1 Last Discord.JS V11 version, you can install it by using "npm i discord-streaming@discord.js-v11"  
1.0.0 Initial publish  