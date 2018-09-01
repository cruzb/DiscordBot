exports.run = (client, message, servers, args) => {
	if(!client.servers.get(message.guild.id)) return message.channel.send(message.author + " no song is currently playing.");;
	let server = client.servers.get(message.guild.id)

	if(!server.currentSong)
		return message.channel.send(message.author + " no song is currently playing.");


	/*if(!client.server.get(message.guild.id))
		return message.channel.send(message.author + " no song is currently playing.");

	let server = client.server.get(message.guild.id);	*/
	let like = client.getLike.get(`${message.author.id}-${server.currentSong.id}`);
	let likeChanged = false;

	if(!like) return message.channel.send(message.author + " you didn't like this song.");
	likeChanged = true;

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
		message.channel.send(message.author + " you removed your :thumbsup: from " + like.title);
		plays.likes--;
		client.delLike.run(like.id);
		client.setPlays.run(plays);
	}
}



exports.help = {
	name: "unlike",
	category: "Music",
	usage: "unlike [page] [num on Page]",
	help: "Unlike the current song or some song from your likes list (page deletion nonfunctional)",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "downvote", "thumbdown" ],
	perms: [  ]
};
