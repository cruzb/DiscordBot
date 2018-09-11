const owjs = require("overwatch-js");
const Discord = require("discord.js");
const config = require("../../config.json");

const defaultPlatform = "pc";
const defaultRegion = "us";


exports.run = (client, message, args) => {
	let platforms = ["xbl", "psn", "pc"];
	let regions = ["eu", "us", "as"];

	let platform = "pc";
	let region = "us";

	if(!args[0]) {
		message.channel.send(message.author + " please provide a player name");
		return;
	}

	if(args[2]) {
		if(platforms.includes(args[2])) platform = args[2];
		else if(regions.includes(args[2])) region = args[2];
	}
	if(args[3]) {
		if(platforms.includes(args[3])) platform = args[3];
		else if(regions.includes(args[3])) region = args[3];
	}

	args[0] = args[0].replace("#", "-");

	owjs.getOverall(platform, region, args[0]).then((data) => {
		let rateComp = (data.competitive.global.games_won/data.competitive.global.games_played*100).toString().substring(0,4);
		let rateQuick = (data.quickplay.global.games_won/data.quickplay.global.games_played*100).toString().substring(0,4);
		const embed = new Discord.RichEmbed()
			.setTitle(data.profile.nick + "\'s Stats")
			.setAuthor(client.user.username, client.user.avatarURL)
			.addField("Level",data.profile.level,true)
			.addField("Prestige",data.profile.tier,true)
			.addField("Rank",data.profile.rank,true)
			//.addBlankField()


			.addField("__**Competitive**__",rateComp + "\% Win Rate",false)
			.addField("Most Played", data.competitive.global.masteringHeroe,true)
			.addField("Eliminations",data.competitive.global.eliminations,true)
			.addField("Hero Damage",data.competitive.global.hero_damage_done,true)
			.addField("Healing",data.competitive.global.healing_done,true)
			.addField("Deaths",data.competitive.global.deaths,true)
			.addField("Games Won",data.competitive.global.games_won,true)
			.addField("Games Lost",data.competitive.global.games_lost,true)
			.addField("Games Played",data.competitive.global.games_played,true)
			//.addBlankField()


			.addField("__**Quick Play**__","Winrates are not recorded for QP", false)
			.addField("Most Played",data.quickplay.global.masteringHeroe,true)
			.addField("Eliminations",data.quickplay.global.eliminations,true)
			.addField("Hero Damage",data.quickplay.global.hero_damage_done,true)
			.addField("Healing",data.quickplay.global.healing_done,true)
			.addField("Deaths",data.quickplay.global.deaths,true)
			.addField("Games Won",data.quickplay.global.games_won,true)


			.setColor(config.embed_color)
			.setFooter("If data is not found the user's profile is likely private.", "https://i.imgur.com/UIusJGD.png")
			.setThumbnail(data.profile.avatar)
			.setTimestamp()

		message.channel.send({embed});
	})
	.catch( err => {
		console.log(err);
		message.channel.send("No player found. Note that player name is case sensitive, and player profiles are now private by default.");
	})

}


exports.help = {
	name: "overwatch-stats",
	category: "Games",
	usage: "overwatch-stats <username>",//TODO region
	help: "Check the overwatch stats of a player",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "overwatchstats", "ow", "overwatch" ],
	perms: [  ]
};
