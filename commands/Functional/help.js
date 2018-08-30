const Discord = require("discord.js");
const config = require("../../config.json");
const categories = require("../../data/help.json");


exports.run = (client, message, servers, args) => {
	if(args[1]) return message.channel.send(message.author + " too many arguments! Try something like " + config.prefix + "help or " + config.prefix + " help fun");

	const embed = new Discord.RichEmbed()
		.setDescription("Made by quichelorraine#4187\n<> Indicates a necessary argument, [] indicates an optional one\nDo not type the bracket symbols\nThe current command prefix is **" + config.prefix + "**")
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(config.embed_color)
		.setTimestamp()


	if(args[0]) {
		let category = args[0].toLowerCase();
		category = category.charAt(0).toUpperCase() + category.slice(1);
		if(categories[category]) {
			if(config.allow_moderation || (!config.allow_moderation && category != "Moderation"))
				embed.addField("**"+category+"**", categories[category], false);
			else return message.channel.send(message.author + " invalid argument. You can view category names by running help without arguments.")
		}
		else return message.channel.send(message.author + " invalid argument. You can view category names by running help without arguments.")
	}
	else {
		for (c in categories) {
			if(!(c == "Moderation" && !config.allow_moderation))
			 	embed.addField("**"+c+"**", categories[c], false);
		}
	}

	message.channel.send({embed});

}


exports.help = {
	name: "help",
	category: "Functional",
	usage: "help [category]",
	help: "You already used it!",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
