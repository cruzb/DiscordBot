const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
	let maxPerPage = 10;
	let likes = client.getLikes.all(message.author.id);

	if(!likes)
		return message.channel.send(message.author + " you haven't liked anything yet.")

	let page = parseInt(args[0]);
	if(!page && args[0]) return message.channel.send(message.author + " invalid argument. Try something like " + config.prefix + "liked 5");
	else page = 1;

	let totalPages = Math.ceil(likes.length/maxPerPage);
	if(page < 1 || page > totalPages) return message.channel.send(message.author + " invalid page number.")


	const embed = new Discord.RichEmbed()
		.setTitle(message.author.username + "\'s Likes")
		.setFooter("Page " + page + " of " + totalPages)
		.setTimestamp()

	let subfield = "";
	let start = (page - 1) * maxPerPage;
	for(var i = start; i < start + 10; i++){
		if(likes[i]) {
			subfield += (i+1) + ". [" + likes[i].title + "](" + getURL(likes[i].type, likes[i].videoid) + ")\n";
		}
		else break;
	}
	//embed.addField("Page " + page + " of " + totalPages, subfield, true);
	embed.setDescription(subfield);
	message.channel.send({embed});
}


function getURL(type, id) {
	if(type == "youtube") {
		return "https://www.youtube.com/watch?v=" + id;
	}
}



exports.help = {
	name: "liked",
	category: "Music",
	usage: "liked [page]",
	help: "Show songs you've liked",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "likes" ],
	perms: [  ]
};
