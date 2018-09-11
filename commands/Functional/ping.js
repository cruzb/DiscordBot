exports.run = (client, message, args) => {
	message.channel.send("Ping: " + client.pings[0] + " ms");
	let uptime = Date.now();
	uptime -= client.startTime;
	message.channel.send("Uptime: " + msToTime(uptime));
}

function msToTime(s) {
	let ms = s % 1000;
	s = (s - ms) / 1000;
	let secs = s % 60;
	s = (s - secs) / 60;
	let mins = s % 60;
	let hrs = (s - mins) / 60;

	return hrs + "h " + mins + "m " + secs + "s";
}

exports.help = {
	name: "ping",
	category: "Functional",
	usage: "ping",
	help: "Pong!",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "uptime", "connection" ],
	perms: [  ]
};
