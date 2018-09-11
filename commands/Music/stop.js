exports.run = (client, message, args) => {
	if(!client.servers.get(message.guild.id) || !message.guild.voiceConnection)
		return message.channel.send(message.author + " nothing is currently playing.");

	let server = client.servers.get(message.guild.id);
	if(!server.currentSong && server.queue.length == 0)
		return message.channel.send(message.author + " nothing is currently playing.");

	for(var i = server.queue.length - 1; i >= 0; i--) {
		server.queue.splice(i, 1);
	}
	server.dispatcher.end();
	message.guild.me.voiceChannel.leave();
	message.channel.send(message.author + " stopped the queue.");
}


exports.help = {
	name: "stop",
	category: "Music",
	usage: "stop",
	help: "Stop the queue and remove all songs",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [  ]
};
