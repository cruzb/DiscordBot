const Discord = require("discord.js");
const videoInfo = require("youtube-info");
const getVideoId = require("get-youtube-id");
const config = require("../../config.json");

exports.run = (client, message, args) => {

	if(!client.servers.get(message.guild.id) || !message.guild.voiceConnection)
		return message.channel.send(message.author + " nothing is currently playing.");

	let server = client.servers.get(message.guild.id);
	if(!server.currentSong && server.queue.length == 0)
		return message.channel.send(message.author + " nothing is currently playing.");

	let song = server.currentSong;

	// formatting rich embed
	const embed = new Discord.RichEmbed()
        .setTitle(song.data.title)
		.setAuthor(song.data.owner)
        .setColor(config.embed_color)
        .setFooter("Requested by " + song.author.user.username + "#" + song.author.user.discriminator + "   |   Posted on " + song.data.datePublished)
        .setThumbnail(song.data.thumbnailUrl)
        .setURL(song.data.url)
		.addField("Views", song.data.views, true)
		.addField(":thumbsup:", song.data.likeCount, true)
		.addField("Comments", song.data.commentCount, true)
		.addField(":thumbsdown:", song.data.dislikeCount, true)



		if(song.data.description) {
			//fix description and remove html
			let description = song.data.description.replace(/<(?:.|\n)*?>/gm, '');
			if(description.length < 500)
				embed.setDescription(description);
			else embed.setDescription(description.substring(0,500) + "...");
		}

        message.channel.send({embed});
}


exports.help = {
	name: "currentsong",
	category: "Music",
	usage: "currentsong",
	help: "Get information about the current song",
	dev: false
}


exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "np", "cs", "nowplaying" ],
	perms: [  ]
};
