const Discord = require("discord.js");
const request = require("request-promise");
const config = require("../../config.json");

exports.run = (client, message, servers, args) => {
	request("https://api.thecatapi.com/api/images/get?format=json").then(data => {
		data = JSON.parse(data);
		if(data[0]) {
			console.log(data[0].url);
			const embed =  new Discord.RichEmbed()
				.setImage(data[0].url)
				.setFooter("Powered by the cat api")
				.setColor(config.embed_color)
			message.channel.send({embed});
		}
		else {
			console.log("---Error in cat.js--");
			console.log(data);
			message.channel.send(message.author + " sorry. Something went wrong :(")
		}
	})
	.catch((err) => {
		console.log("---Error in cat.js---");
		console.log(err);
	});

}
exports.help = {
	name: "cat",
	category: "Fun",
	usage: "cat",
	help: "Cat!",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
