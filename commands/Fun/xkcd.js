const request = require('request-promise');
const Discord = require("discord.js");
const config = require("../../config.json");


exports.run = async (client, message, args) => {
	//TODO fix promise style
	let data = await request( { uri: 'https://xkcd.com/info.0.json', json: true } );
	let comic;

	//TODO add search? do people even know xkcd codes
	if(args[0] == "Random" || args[0] == "random") {
		comic = Math.ceil(Math.random() * data.num);
		data = await request( { uri: `https://xkcd.com/${comic}/info.0.json`, json: true } );
	}
	else {
		comic = data.num;
	}


	const embed = new Discord.RichEmbed()
		.setTitle(data.title)
		.setAuthor(client.user.username, client.user.avatarURL)
		.setDescription(data.alt)
		.setURL(data.url)
		.setImage(data.img)
		.setColor(config.embed_color)
		.setFooter("Comic #" + data.num)
		.setTimestamp()

	message.channel.send({embed});
}


exports.help = {
	name: "xkcd",
	category: "Fun",
	usage: "xkcd [random]",
	help: "See the latest xkcd comic or a random one",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
