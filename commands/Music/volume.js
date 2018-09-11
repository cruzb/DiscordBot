const config = require("../../config.json");

exports.run = (client, message, args) => {
    //only allow change in volume while things are playing to prevent trolling somwhat
	if(!client.servers.get(message.guild.id) || !message.guild.voiceConnection)
		return message.channel.send(message.author + " nothing is currently playing.");

	let server = client.servers.get(message.guild.id);
	if(!server.currentSong && server.queue.length == 0)
		return message.channel.send(message.author + " nothing is currently playing.");

    if(!args[0])
        return message.channel.send(message.author + ` the current volume is **${server.dispatcher.volume}**`);

    const vol = parseInt(args[0]);
    if((!vol || vol < 0 || vol > 100) && message.member.id != config.creatorID)
        return message.channel.send(message.author + " invalid new volume. It must be between 0 and 100.");

    server.dispatcher.setVolume(vol/50);
	message.channel.send(message.author + ` set the volume to **${vol}**`);
}

exports.help = {
	name: "volume",
	category: "Music",
	usage: "volume [number]",
	help: "Change the volume of the streamed music",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [  ],
	perms: [  ]
};
