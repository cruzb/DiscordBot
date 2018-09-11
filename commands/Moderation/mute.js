const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!config.allow_moderation) return;
	let target = message.mentions.members.first();
	let reason = args.join(" ");

	if(target.user.bot)
		return message.channel.send("Nice try.");

	if(message.mentions.members.size == 0)
		return message.channel.send(message.author + " you need to mention a user to mute.");

	else {
		let status = !target.serverMute;
		target.setMute(status, target.user.username + "#" + target.user.discriminator + " was muted by " + message.author.username + "#" + message.author.discriminator + " for reason: " + reason);
		return message.channel.send(message.author + " successfully muted " + target);
	}
}



exports.help = {
	name: "mute",
	category: "Moderation",
	usage: "mute <@user> [reason]",
	help: "Toggle whether a user is muted",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [ "MUTE_MEMBERS" ]
};
