const Discord = require("discord.js");
const config = require("../../config.json");
const categories = require("../../data/help.json");


exports.run = (client, message, servers, args) => {


}


exports.help = {
	name: "poll",
	category: "Functional",
	usage: "poll <time> <question> [option1] [option2] [etc]  Put options on seperate lines.l",
	help: "Make a poll.",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
