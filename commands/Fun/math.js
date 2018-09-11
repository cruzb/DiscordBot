const request = require('request');
const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
	if(!args[0]) message.channel.send(message.author + " add some math to evaluate!");

	let expression = args.join(" ");

	request(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}&precision=3`, (err,response,body) => {
		if(err) return message.channel.send(message.author + " add some math to evaluate!");
		else {
			message.channel.send({embed: {
				title: expression,
				description: `\`\`\`js\n${body}\n\`\`\``,
				color: config.embed_color,
				url: "http://mathjs.org/"
			}});
		}
	})
}


exports.help = {
	name: "math",
	category: "Fun",
	usage: "math <function>",
	help: "Evaluate a mathematical function"
}
exports.config = {
	enabled: false,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
