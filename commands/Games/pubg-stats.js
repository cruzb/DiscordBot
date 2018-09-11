const pubg = require("pubg.js");
const auth = require("../../auth.json");
const Discord = require("discord.js");
const config = require("../../config.json");
const Client = new pubg.Client(auth.pubg_api_key, "pc-na");

exports.run = (client, message, args) => {
	if(!args[0]) {
		message.channel.send(message.author + " please provide a player name");
		return;
	}

	//handle args
	let gamemode = "squad";
	if(args[1]) {
		if(args[1].toLowerCase() == "solo" || args[1].toLowerCase() == "solotpp")
			gamemode = "solo";
		else if(args[1].toLowerCase() == "solofpp")
			gamemode = "soloFPP";
		else if(args[1].toLowerCase() == "duo" || args[1].toLowerCase() == "duotpp")
			gamemode = "duo";
		else if(args[1].toLowerCase() == "duofpp")
			gamemode = "duoFPP";
		else if(args[1].toLowerCase() == "squadfpp")
			gamemode = "squadFPP";
		else if(args[1].toLowerCase() == "squad" || args[1].toLowerCase() == "squadtpp")
			gamemode = "squad";
		else {
			message.channel.send(message.author + " please provide a valid gamemode (solo, soloFPP, squadFPP, etc)");
			return;
		}
	}

  	// Get a single player using their name
  	const player = Client.getPlayer({name: args[0]})
     	.then(player => {
        	//TODO find season without hardcode
          	const season = player.getPlayerSeason('division.bro.official.2018-09')
          	.then(season => {
				let gamemodeTitle = gamemode.charAt(0).toUpperCase() + gamemode.slice(1);
      			const embed = new Discord.RichEmbed()
      				.setTitle(args[0] + "\'s **" + gamemodeTitle + "** Stats")
      				.setAuthor(client.user.username, client.user.avatarURL)
      				.addField("Kills",season.attributes.gameModeStats[gamemode].kills,true)
					.addField("Deaths",season.attributes.gameModeStats[gamemode].losses,true)
		            .addField("DBNOs",season.attributes.gameModeStats[gamemode].dBNOs,true)
		            .addField("Assists",season.attributes.gameModeStats[gamemode].assists,true)
		            .addField("Headshot Kills",season.attributes.gameModeStats[gamemode].headshotKills,true)
		            .addField("Damage",season.attributes.gameModeStats[gamemode].damageDealt,true)
		            .addField("Longest Kill",season.attributes.gameModeStats[gamemode].longestKill,true)
		            .addField("Wins",season.attributes.gameModeStats[gamemode].wins,true)
		            .addField("Road Kills",season.attributes.gameModeStats[gamemode].roadKills,true)
		            .addField("Most Kills in Round",season.attributes.gameModeStats[gamemode].roundMostKills,true)
		            .addField("Team Kills",season.attributes.gameModeStats[gamemode].teamKills,true)
		            .addField("Top 10s",season.attributes.gameModeStats[gamemode].top10s,true)

					.setThumbnail("https://pubattlegroundstips.com/wp-content/uploads/2018/02/pubg-orange-square.png")
      				.setColor(config.embed_color)
      				.setFooter("Try adding a game type parameter to see stats for different gamemodes.")
      				.setTimestamp()

					.setDescription((season.attributes.gameModeStats[gamemode].kills/season.attributes.gameModeStats[gamemode].losses).toString().substring(0,4) + " Kill/Death Ratio\n"
										+ (season.attributes.gameModeStats[gamemode].wins/season.attributes.gameModeStats[gamemode].roundsPlayed*100).toString().substring(0,4) + "% Winrate")

				message.channel.send({embed});
        	})
          	.catch(error => message.channel.send("No Season Found"))
        })
    	.catch(error => message.channel.send("No Player Found"))
}



exports.help = {
	name: "pubg-stats",
	category: "Games",
	usage: "pubg-stats <username> [gamemode]",//TODO region
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
