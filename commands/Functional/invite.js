const Discord = require("discord.js")
const hourMultiplier = 3600;

exports.run = (client, message, args) => {
	let options = {
		temporary: false,
		maxAge: 86400,
		maxUses: 0,
		unique: false
	}

	if(!message.member.hasPermission("CREATE_INSTANT_INVITE"))
		return message.channel.send(message.author + " you are not allowed to make instant invites.");

	//if both arguments were given which is needed if one is given
	if(args[0] && args[1]) {
		let time = parseInt(args[0]);
		let uses = parseInt(args[1]);
		if(!time) return message.channel.send(message.author + " please provide the expiration time as a number");
		if(!uses) return message.channel.send(message.author + " please provide the number of uses before expiration as a number");

		options.maxAge = time * hourMultiplier;
		options.maxUses = uses;

		message.channel.createInvite(options).then((invite) => {
			message.channel.send(message.author + " created an invite: " + invite);
		});
	}
	//if no args were given which is also fine
	else if(!args[0]) {
		message.channel.createInvite(options).then((invite) => {
			message.channel.send(message.author + " created an invite: " + invite);
		});
	}
	else {
		message.channel.send(message.author + " please provide both arguments | invite [expiration in hours] [number of uses]");
	}
}



exports.help = {
	name: "invite",
	category: "Functional",
	usage: "invite [expiration time] [# of uses]",
	help: "Create an invite (both arguments needed if one used)",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 2,
	aliases: [  ],
	perms: [ "CREATE_INSTANT_INVITE" ]
};
