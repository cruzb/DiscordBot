exports.run = (client, message, args) => {
	if(!client.servers.get(message.guild.id)) return message.channel.send(message.author + " no song is currently playing.");;
	let server = client.servers.get(message.guild.id)

	if(!server.currentSong)
		return message.channel.send(message.author + " no song is currently playing.");


	/*if(!client.server.get(message.guild.id))
		return message.channel.send(message.author + " no song is currently playing.");

	let server = client.server.get(message.guild.id);	*/
	let like = client.getLike.get(`${message.author.id}-${server.currentSong.id}`);
	let likeChanged = false;

	if(!like) {
		likeChanged = true;
		like = {
			id: `${message.author.id}-${server.currentSong.id}`,
			user: message.author.id,
			videoid: `${server.currentSong.id}`,
			type: "youtube", //TODO
			title: server.currentSong.data.title
		}
	}

	let plays = client.getPlays.get(server.currentSong.id);

	//should never reach this because it should be created on queue
	if(!plays) {
		plays = {
			videoid: `${server.currentSong.id}`,
			plays: 0,
			likes: 0,
			type: "youtube", //TODO
		}
	}


	if(likeChanged) {
		message.channel.send(message.author + " you :thumbsup: " + like.title);
		plays.likes++;
		client.setLike.run(like);
		client.setPlays.run(plays);
	}
}



exports.help = {
	name: "like",
	category: "Music",
	usage: "like",
	help: "Like a song",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "upvote", "thumbup" ],
	perms: [  ]
};
