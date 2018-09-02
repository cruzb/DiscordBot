const Discord = require("discord.js");
const config = require("../../config.json");
const ytdl = require("ytdl-core");
const youtubeID = require("get-youtube-id");
const youtubeInfo = require('youtube-info');



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


exports.run = (client, message, servers, args) => {
	if(!args[0]) return showQueue(client, message);//return message.channel.send(message.author + " missing argument. Please include a url or search term.");
	if((args[0].toLowerCase() == "youtube" || args[0].toLowerCase() == "soundcloud") && !args[1])
		return message.channel.send(message.author + " missing argument. Please include a url or search term.");

	if(!message.member.voiceChannel) return message.channel.send(message.author + " please join a voice channel.");
	if(!message.member.voiceChannel.joinable) return message.channel.send(message.author + " I can't join that channel.");

	//TODO determine url validity
	//TODO search if not
	let path = args[0];
	let data;

	//if there is no server server obj for this server make one
	//server:
	//    queue: [] array of song objects
	//	  dispatcher: dispatcher object
	//	  currentsong: song info ytinfo object

	if(!client.servers.get(message.guild.id))
		client.servers.set(message.guild.id, {queue: [], dispatcher: null, currentSong: null});
	let server = client.servers.get(message.guild.id);



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


//requires args[0] at least is non null

function setupQuery(args) {
	if(args[0].toLowerCase() == "youtube" && args[1]) {
		if(ytdl.validateURL(args[1])) {
			return args[1];
		}
		else {
			args.shift(); //get rid of youtube arguments
			let search = args.join(" ");
			return
		}
	}
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

//function isValid(url){
//	return url.toLowerCase().indexOf("youtube.com" > -1);
//} 28:52

function searchVideos() {}








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

function isURL(str) {
  	let pattern = new RegExp('^(https?:\/\/)?'+ // protocol
	    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
	    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
	    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
	    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
	    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  	return pattern.test(str);
}

exports.help = {
	name: "queue",
	category: "Music",
	usage: "queue [youtube|soundcloud] [url|search term]",
	help: "Add a new song to the queue from youtube (nonfunctional)",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [ "play" ],
	perms: [  ]
};
