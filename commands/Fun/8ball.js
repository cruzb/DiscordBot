const responses = require("../../data/8ball.json");

exports.run = (client, message, args) => {
	let response = responses.message[Math.floor(Math.random() * responses.message.length)];
	message.channel.send(response);
}



exports.help = {
	name: "8ball",
	category: "Fun",
	usage: "8ball",
	help: "Ask the magic 8 ball a question",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "8b" ],
	perms: [  ]
};
