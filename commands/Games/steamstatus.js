const Discord = require("discord.js");
const request = require('request-promise');
const config = require("../../config.json");

exports.run = (client, message, args) => {

	const options = {
	    uri: `https://steamgaug.es/api/v2`,
		json: true
  	};


	request(options).then((data) => {
		const embed = new Discord.RichEmbed()
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png")
			.setColor(config.embed_color)
			.setTimestamp()
			.setFooter("Response time: " + data.SteamCommunity.time + "ms")

		if(data.SteamCommunity.online == 1)
			embed.addField("Steam Store", ":white_check_mark:", true);
		else
			embed.addField("Steam Store", ":x:", true);

		if(data.SteamStore.online == 1)
			embed.addField("Steam Store", ":white_check_mark:", true);
		else
			embed.addField("Steam Store", ":x:", true);

		message.channel.send({embed});
	})
	.catch((err) => {
		console.log("---Error in steamstatus---");
		console.log(err);
		message.channel.send(message.author + " something went wrong. You should probably report this.")
	});
}


exports.help = {
	name: "steamstatus",
	category: "Games",
	usage: "steamstatus",
	help: "Check the status of various steam services",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "steam" ],
	perms: [  ]
};
