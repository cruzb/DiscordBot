const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!args[0]) return message.channel.send(message.author + " missing argument. I need a command name to search for.");

	let command = args[0].toLowerCase();


	if(client.aliases.get(command)) {
		let commandFile = require("../." + client.aliases.get(command));
		command = commandFile.help.name;
	}
	if(client.commands.get(command)) {
		let commandFile = require("../." + client.commands.get(command));
		let aliases = "";
		commandFile.config.aliases.forEach((alias) => {
			aliases += config.prefix + alias + "\n";
		});
		if(aliases.length > 0)
			message.channel.send("**" + command + " Aliases:**\n" + aliases);
		else message.channel.send(message.author + " " + command + " has no aliases.");
	}
	else return message.channel.send(message.author + " no such command exists.");
}


exports.help = {
	name: "aliases",
	category: "Functional",
	usage: "aliases <command>",
	help: "Shows other ways to use a given command.",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "alias",  ],
	perms: [  ]
};
