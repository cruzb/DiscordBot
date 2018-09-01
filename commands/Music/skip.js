exports.run = (client, message, servers, args) => {
	if(!client.servers.get(message.guild.id) || !message.guild.voiceConnection)
		return message.channel.send(message.author + " nothing is currently playing.");

	let server = client.servers.get(message.guild.id);
	if(!server.currentSong && server.queue.length == 0)
		return message.channel.send(message.author + " nothing is currently playing.");

	server.dispatcher.end();
}

exports.help = {
	name: "skip",
	category: "Music",
	usage: "skip",
	help: "Skip the currently playing song on the queue",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [  ],
	perms: [  ]
};
