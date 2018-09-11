exports.run = (client, message, args) => {
	if(!message.guild.voiceConnection)
		return message.channel.send(message.author + " I am not in a channel.");

	if(client.currentSong)
		return message.channel.send(message.author + " I still have songs to play.");


	message.guild.me.voiceChannel.leave();
	let server = client.servers.get(message.guild.id);
}


exports.help = {
	name: "leave",
	category: "Music",
	usage: "leave",
	help: "Makes me leave the voice channel if I'm not doing anything",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
