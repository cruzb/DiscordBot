const Discord = require("discord.js");
const config = require("../../config.json");
const auth = require("../../auth.json");
const ytdl = require("ytdl-core");
const ytsearch = require("youtube-search");
const youtubeID = require("get-youtube-id");
const youtubeInfo = require('youtube-info');
const url = require("url");


/*
server:
	queue: [] array of song objects
	dispatcher: dispatcher object
	currentsong: song info ytinfo object
	title:


song:
	type: youtube or spotify
	author: who added it to queue
	data: meta info
*/


exports.run = (client, message, args) => {
	if(!args[0]) return showQueue(client, message);//return message.channel.send(message.author + " missing argument. Please include a url or search term.");
	//if((args[0].toLowerCase() == "youtube" || args[0].toLowerCase() == "soundcloud") && !args[1])
		//return message.channel.send(message.author + " missing argument. Please include a url or search term.");

	if(!message.member.voiceChannel) return message.channel.send(message.author + " please join a voice channel.");
	if(!message.member.voiceChannel.joinable) return message.channel.send(message.author + " I can't join that channel.");

	//if there is no server server obj for this server make one
	//server:
	//    queue: [] array of song objects
	//	  dispatcher: dispatcher object
	//	  currentsong: song info ytinfo object
	if(!client.servers.get(message.guild.id))
		client.servers.set(message.guild.id, {queue: [], dispatcher: null, currentSong: null});
	let server = client.servers.get(message.guild.id);



	//determine if url or search
	let myurl;
	let isurl = false;
	try {
		myurl = new URL(args[0]);
		isurl = true;
	}
	catch(err) { }

	if(isurl) {
		const host = myurl.host;
		if(!host.startsWith("www.youtube")) return	message.channel.send(message.author + " invalid url. I can only process youtube or spotify urls at this time.")
		enqueue(server, myurl.toString(), message);
	}
	else {
		//if adding additional queue sources make that here
		//if(type != "youtube")
		//	return message.channel.send(message.author + " invalid search. I can only process youtube or spotify searches at this time.")

		let search = args.join(" ");
		const options = {
			maxResults: 1,
			key: auth.youtube_api_key,
		}
		ytsearch(search, options, function(err, res) {
			if(err) return console.log(err); //TODO fix
			enqueue(server, res[0].link, message);
		});
	}

}


function enqueue(server, path, message) {
	let id = youtubeID(path);
	youtubeInfo(id).then((info) => {

		let song = {
			type: "youtube", // TODO:
			id: id,
			author: message.member,
			data: info
		}

		server.queue.push(song);

		const embed = new Discord.RichEmbed()
			.setTitle("Added to Queue")
			.setDescription("[" + song.data.title + "](" + song.data.url + ")\n" + sToTime(song.data.duration))
			.setColor(config.embed_color)
			.setThumbnail(song.data.thumbnailUrl)
			.setFooter("Requested by " + message.author.username + "#" + message.author.discriminator)
		message.channel.send({embed});

		if(message.guild.me.hasPermission("MANAGE_MESSAGES"))
			message.delete(1000); //Supposed to delete message


		if(!message.guild.voiceConnection) message.member.voiceChannel.join().then((connection) => {
			play(server, connection)
		})
	});
}


function play(server, connection){
	server.dispatcher = connection.playStream(ytdl(server.queue[0].data.url, {filter:"audioonly"}));
	server.currentSong = server.queue[0];
	//get info and add to current song here

	//TODO make bot join channel of author?
	server.queue.shift();
	server.dispatcher.on("end", end => {
		if(server.queue[0]){
			play(server, connection);
		}
		else {
			server.currentSong = null;
			connection.disconnect();
		}
	});
}


function showQueue(client, message) {
	if(!client.servers.get(message.guild.id))
		return message.channel.send(message.author + " the queue is empty.");
	let queue = client.servers.get(message.guild.id).queue;
	if(queue.length == 0)
		return message.channel.send(message.author + " the queue is empty.");


	const embed = new Discord.RichEmbed()
		.setColor(config.embed_color)


	const maxToShow = 10;
	let index = 0;
	let subfield = "";
	queue.forEach((song) => {
		index++;
		subfield += index + ". [" + song.data.title+ "](" + song.data.url + ")\n"
		if (index > maxToShow) return;
	});
	embed.addField("Current Queue", subfield);
	message.channel.send({embed});
}


function sToTime(s) {
	let hrs = Math.floor(s / 3600);
	s %= 3600;
	let mins = Math.floor(s / 60);
	let secs = s % 60;

	return hrs + "h " + mins + "m " + secs + "s";
}



exports.help = {
	name: "queue",
	category: "Music",
	usage: "queue [url] [search term]",//todo spotify and searches
	help: "Add a new song to the queue from youtube",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [ "play" ],
	perms: [  ]
};
