const auth = require("../../auth.json");
const request = require('request');

exports.run = (client, message, args) => {
	if(!args[0])
		return message.channel.send(message.author + " please include a term to search.")

	let term = args.join(" ");
	request(`http://api.giphy.com/v1/gifs/search?fmt=json&api_key=` + auth.giphy_api_key + `&limit=1&q=${encodeURIComponent(term)}`, (err, data) => {
		//TODO why is this returning a string not a json?
		let json = JSON.parse(data.body);

		if(err) return console.log("---Error returned in giphy---\n" + err);

		try {
			message.channel.send(json.data[0].url);
		}
		catch (error) {
			message.channel.send(message.author + " No results found.");
		}
	});
}



exports.help = {
	name: "giphy",
	category: "Fun",
	usage: "giphy <search term>",
	help: "Find a giphy related to your search term",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "gfy" ],
	perms: [  ]
};
