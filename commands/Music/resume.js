exports.run = (client, message, servers, args) => {
	if(!client.servers.get(message.guild.id) || !message.guild.voiceConnection)
		return message.channel.send(message.author + " nothing is currently playing.");

	let server = client.servers.get(message.guild.id);
	if(!server.currentSong && server.queue.length == 0)
		return message.channel.send(message.author + " nothing is currently playing.");

	server.dispatcher.resume();
	message.channel.send(message.author + " resumed the queue.")
}


exports.help = {
	name: "resume",
	category: "Music",
	usage: "resume",
	help: "Resume the queue if it was paused",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [ "continue" ],
	perms: [  ]
};
