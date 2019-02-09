const config = require("../../config.json");

exports.run = (client, message, args) => {
    const rate = parseFloat(args[0]);
    let server = client.servers.get(message.guild.id);
    server.dispatcher.setBitrate(rate);
	message.channel.send(message.author + ` set the bitrate to **${rate}**`);
}

exports.help = {
	name: "bitrate",
	category: "Music",
	usage: "bitrate [number]",
	help: "Change the bitrate of the streamed music",
	dev: true
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [ "br", "rate" ],
	perms: [  ]
};
