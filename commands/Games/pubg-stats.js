const auth = require("../../auth.json");
const Discord = require("discord.js");
const config = require("../../config.json");
const request = require('request-promise');

exports.run = (client, message, args) => {
	let season = "division.bro.official.pc-2018-02";

	if(!args[0]) {
		message.channel.send(message.author + " please provide a player name.");
		return;
	}

	let input = handleInput(message, args);
	//something was wrong with the input
	if(!input) return;

	let gamemode = input[0];
	let region = input[1];

	const options = {
		uri : `https://api.pubg.com/shards/${region}/players?filter[playerName]=${args[0]}`,
		headers: {
			Authorization: `Bearer ${auth.pubg_api_key}`,
		},
		json: true
	};


  	// Get a single player using their name
	request(options).then((player) => {
		if(player.title)
			return message.channel.send(message.author + " sorry something went wrong. Note that player names are case sensitive.");
		player = player.data[0].id;
		options.uri = `https://api.pubg.com/shards/${region}/players/${player}/seasons/${season}`;


		request(options).then((data) => {
			//console.log(data);
			data = data.data.attributes.gameModeStats[gamemode];
			let gamemodeTitle = gamemode.charAt(0).toUpperCase() + gamemode.slice(1);
			const embed = new Discord.RichEmbed()
				.setTitle(args[0] + "\'s **" + gamemodeTitle + "** Stats")
				//.setAuthor(client.user.username, client.user.avatarURL)
				.addField("Kills",data.kills,true)
				.addField("Deaths",data.losses,true)
				.addField("DBNOs",data.dBNOs,true)
				.addField("Assists",data.assists,true)
				.addField("Headshot Kills",data.headshotKills,true)
				.addField("Damage",data.damageDealt,true)
				.addField("Longest Kill",data.longestKill,true)
				.addField("Wins",data.wins,true)
				.addField("Road Kills",data.roadKills,true)
				.addField("Most Kills in Round",data.roundMostKills,true)
				.addField("Team Kills",data.teamKills,true)
				.addField("Top 10s",data.top10s,true)

				.setThumbnail("https://pubattlegroundstips.com/wp-content/uploads/2018/02/pubg-orange-square.png")
				.setColor(config.embed_color)
				.setFooter("Try adding a gamemode parameter to see stats for different gamemodes.")
				.setTimestamp()

				.setDescription((data.kills/data.losses).toString().substring(0,4) + " Kill/Death Ratio\n"
									+ (data.wins/data.roundsPlayed*100).toString().substring(0,4) + "% Winrate")

			message.channel.send({embed});
		})
		.catch((err) => {
			console.log("---Error in pubg lookup---");
			console.log(err);
			return message.channel.send(message.author + " sorry something went wrong. Try again in a bit.");
		});
	})
	.catch((err) => {
		console.log("---Error in pubg lookup---");
		console.log(err);
		return message.channel.send(message.author + " sorry something went wrong. Note that player names are case sensitive.");
	});
}



function handleInput(message, args) {
	let regions = ["as","eu","na","oc","krjp","jp","ru","kakao","sea","sa","tournament"];

	let gamemode = "squad"; let gmChanged = false;
	let platform = "pc"; let plChanged = false;
	let region = "na"; let rgChanged = false;

	let index = 1;
	let arg = args[index];
	while(arg && index < 5) {
		console.log(arg);
		arg = arg.toLowerCase();
		//first check if arg is gamemode
		//no array check because of the number of aliases
		if(arg.includes("solo") || arg.includes("duo") || arg.includes("squad")) {
			if(arg == "solo" || arg == "solotpp")
				gamemode = "solo";
			else if(arg == "solofpp")
				gamemode = "solo-fpp";
			else if(arg == "duo" || arg == "duotpp")
				gamemode = "duo";
			else if(arg == "duofpp")
				gamemode = "duo-fpp";
			else if(arg == "squad" || arg == "squadtpp")
				gamemode = "squad";
			else if(arg == "squadfpp")
				gamemode = "squad-fpp";
			else {
				message.channel.send(message.author + " please provide a valid gamemode (solo, soloFPP, squadFPP, etc)");
				return null;
			}
			gmChangd = true;
		}
		//check if arg is one of the two available platforms
		else if(arg == "pc" || arg == "xbox") {
			if(plChanged) {
			 	message.channel.send(message.author + " no duplicate arguments are allowed.");
				return null;
			}
			platform = arg;
			plChanged = true;
		}
		//check if arg is a region
		else if(regions.includes(arg)) {
			if(rgChanged) {
				message.channel.send(message.author + " no duplicate arguments are allowed.");
				return null;
			}
			region = arg;
			rgChanged = true;
		}
		//improper input
		else {
			message.channel.send(message.author + " invalid arguments. Try something like !!pubg-stats shroud soloFPP na pc");
			return null;
		}

		index++;
		arg = args[index];
	}

	//only 4 regions in xbox, check for this
	if(platform == "xbox") {
		if(region == "as" || region == "eu" || region == "na" || region == "oc") {
			message.channel.send(message.author + " invalid region. Note xbox only has as, eu, na, and oc regions.");
			return null;
		}
	}
	//format as expected by api
	region = platform + "-" + region;

	return [gamemode,region];
}

exports.help = {
	name: "pubg-stats",
	category: "Games",
	usage: "pubg-stats <username> [gamemode] [region] [pc|xbox]",//TODO region
	help: "Check the PUBG stats of a player",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "pubgstats", "pubg" ],
	perms: [  ]
};
