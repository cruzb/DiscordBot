const request = require('request-promise');
const Discord = require("discord.js");
const config = require("../../config.json");


exports.run = async (client, message, args) => {
	if(!args[0])
		return message.channel.send(message.author + " please include a term to search.");

	let term = args.join(" ");

	const options = {
		uri: "http://api.urbandictionary.com/v0/define?term=" + term,
		json: true
	};

	request(options).then((data) => {
		//data = JSON.parse(data);
		if(data.list.length == 0) return message.channel.send(message.author + " there was no search result for **" + term + "**");
		data = data.list[0];
		const embed = new Discord.RichEmbed()
			.setTitle(data.word)
			.setAuthor(data.author)
			.setURL(data.permalink)
			.setColor(config.embed_color)
			.setFooter("Powered by Urban Dictionary")



		if(data.example) {
			if(data.example.length < 400)
				embed.addField("Example", data.example.replace(/[\[\]]+/g, ''), false);
			else
				embed.addField("Example", data.example.replace(/[\[\]]+/g, '').substring(0,397) + "...", false);
		}

		let def = data.definition.toString().replace(/[\[\]]+/g, '');
		if(def.length < 500)
			embed.setDescription(def);
		else {
			embed.setDescription(def.substring(0,500) + "...");
			embed.addBlankField(); //only add if description big for aesthetics
		}

		embed.addField(":thumbsup:", data.thumbs_up, true)
		embed.addField(":thumbsdown:", data.thumbs_down, true)

		message.channel.send({embed});
	})
	.catch((err) => {
		console.log("---Error in urbandictionary lookup request---");
		console.log(err);
	});
}


exports.help = {
	name: "urbandictionary",
	category: "Fun",
	usage: "urbandictionary [search term]",
	help: "Search the world\'s greatest dictionary",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "ud", "urban-dictionary", "dictionary" ],
	perms: [  ]
};
