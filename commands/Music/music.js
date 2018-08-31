const Discord = require("discord.js");
const request = require('request-promise');
const config = require("../../config.json");
const auth = require("../../auth.json");

exports.run = (client, message, servers, args) => {
	let type = "m"; //search type artist or song
	let index = config.prefix.length;
	let identifier = message.content.charAt(index);

	//validity checks
	if(!args[0]) return message.channel.send(message.author + " missing arguments. Try something like \"!!music artist chvrches\"");
	if(identifier == "s" || identifier == "a" )
		type = identifier;
	if(identifier == "l")
		type = "s";

	if(type != "m" && !args[0]) return message.channel.send(message.author + " missing arguments. Try something like \"!!artist post malone\"");
	else if(type == "m" && !args[1]) return message.channel.send(message.author + " missing arguments. Try something like \"!!music song stairway to heaven\"");


	//search setup
	if(type == "m") {
		let arg = args[0].toLowerCase();
		if(arg.toLowerCase() == "song")
			type = "s";
		else if(arg.toLowerCase() == "artist")
			type = "a";
		else return message.channel.send(message.author + " invalid argument. Try something like \"!!music song rap god\"");
		args.shift();
	}

	let searchTerms = args.join(" ");
	const options = {
	    uri: `https://api.genius.com/search?q=${encodeURIComponent(searchTerms)}`,
	    headers: {
	     	Authorization: `Bearer ${auth.genius_api_key}`,
	    },
		json: true
  	};
	const options2 = {
		uri: ``,
		headers: {
			Authorization: `Bearer ${auth.genius_api_key}`,
		},
		json: true
	};


	//search
	request(options).then((data) => {
		if(type == "s")
			options2.uri = "https://api.genius.com" + data.response.hits[0].result.api_path + "?text_format=plain";
		else options2.uri = "https://api.genius.com" + data.response.hits[0].result.primary_artist.api_path + "?text_format=plain";

		//format output
		request(options2).then((data2) => {
			if(type == "s")
				songEmbed(message, data2);
			else artistEmbed(message, data2);
		})
		.catch((err2) => {
			console.log("---Error in !!music secondary api request---");
			console.log(err2);
			return message.channel.send(message.author + " sorry, something went wrong :(");
		});
	})
	.catch((err) => {
		console.log("---Error in !!music initial api request---");
		console.log(err);
		return message.channel.send(message.author + " sorry, something went wrong :(");
	});

}


function artistEmbed(message, data) {
	data = data.response.artist;
	const embed = new Discord.RichEmbed()
		.setTitle("**" + data.name + "**")
		.setURL(data.url)
		.setColor(config.embed_color)
		.setFooter("Powered by genius.com")

	//image
	if(data.header_image_url)
		embed.setImage(data.header_image_url);
	else if(data.image_url)
		embed.setImage(data.image_url);

	//social media
	if(data.facebook_name)
		embed.addField("Facebook", "[" + data.facebook_name + "](https://facebook.com/" + data.facebook_name + ")", true);
	if(data.instagram_name)
		embed.addField("Instagram", "[" + data.instagram_name + "](https://instagram.com/" + data.instagram_name + ")", true);
	if(data.twitter_name)
		embed.addField("Twitter", "[" + data.twitter_name + "](https://twitter.com/" + data.twitter_name + ")", true);

	//description
	if(data.description.toString().length > 1) {
		if(data.description.plain.length < 1000)
			embed.setDescription(data.description.plain);
		else embed.setDescription(data.description.plain.substring(0,1000) + "...");
	}

	message.channel.send({embed});
}



function songEmbed(message, data) {
	data = data.response.song;
	const embed = new Discord.RichEmbed()
		.setTitle("**" + data.title_with_featured + "**")
		.setAuthor(data.primary_artist.name)
		.setURL(data.url)
		.setColor(config.embed_color)
		.setFooter("Powered by genius.com")

	//info
	if(data.album) {
		if(data.album.cover_art_url)
			embed.setThumbnail(data.album.cover_art_url);
		embed.addField("Album", "[" + data.album.name + "](" + data.album.url + ")", true);
	}
	if(data.release_date)
		embed.addField("Released", data.release_date, true);
	embed.addField("Lyrics", "[Genius.com](" + data.url + ")", true);

	if(data.featured_artists.length > 0) {
		let subfield = makeList(data.featured_artists);
		embed.addField("Featured Artists", subfield, true);
	}
	if(data.writer_artists.length > 0) {
		let subfield = makeList(data.writer_artists);
		embed.addField("Written by", subfield, true);
	}
	if(data.producer_artists.length > 0) {
		let subfield = makeList(data.producer_artists);
		embed.addField("Produced by", subfield, true);
	}


	//listen here
	if(data.media.length > 0){
		let subfield = "";
		data.media.forEach((media) => {
			subfield += "[" + media.provider + "](" + media.url + ")\n";
		});
		embed.addBlankField()
		embed.addField("Listen On", subfield, true);
	}

	//image
	if(data.header_image_url)
		embed.setImage(data.header_image_url);
	else if(data.image_url)
		embed.setImage(data.image_url);

	//description
	if(data.description.toString().length > 1) {
		if(data.description.plain.length < 400)
			embed.setDescription(data.description.plain);
			else embed.setDescription(data.description.plain.substring(0,400) + "...");
	}

	message.channel.send({embed});
}


//Utility function for song embed
function makeList(array) {
	let list = "";
	array.forEach((item) => {
		if(item.url)
			list += "[" + item.name + "](" + item.url + "), ";
		else list += artist.name + ", ";
	});
	return list.substring(0, list.length-2);;
}

exports.help = {
	name: "music",
	category: "Music",
	usage: "music <artist|song> [search terms]",
	help: "Shows info related to a given artist or song. Powered by GENIUS",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "musicinfo", "music-info", "song", "song-info", "songinfo", "artist-info", "artist", "artistinfo", "lyrics" ],
	perms: [  ]
};
