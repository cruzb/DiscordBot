const Discord = require("discord.js");
const request = require("request-promise");
const config = require("../../config.json");

exports.run = (client, message, servers, args) => {
	request("https://dog.ceo/api/breeds/image/random").then(data => {
		data = JSON.parse(data);
		if(data.status == "success") {
			const embed =  new Discord.RichEmbed()
				.setImage(data.message)
				.setFooter("Powered by dog.ceo")
				.setColor(config.embed_color)
			message.channel.send({embed});
		}
		else {
			console.log("---Error in dog.js--");
			console.log(data);
			message.channel.send(message.author + " sorry. Something went wrong :(")
		}
	})
	.catch((err) => {
		console.log("---Error in dog.js---");
		console.log(err);
	});

}
exports.help = {
	name: "dog",
	category: "Fun",
	usage: "dog",
	help: "Woof!",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
