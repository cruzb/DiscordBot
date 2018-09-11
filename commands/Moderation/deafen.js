const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!config.allow_moderation) return;
	let target = message.mentions.members.first();
	let reason = args.join(" ");

	if(target.user.bot)
		return message.channel.send("Nice try.");

	if(message.mentions.members.size == 0)
		return message.channel.send(message.author + " you need to mention a user to .");

	else {
		let status = !target.serverDeaf;
		target.setDeaf(status, target.user.username + "#" + target.user.discriminator + " was deafened by " + message.author.username + "#" + message.author.discriminator + " for reason: " + reason);
		return message.channel.send(message.author + " successfully deafened " + target);
	}
}

exports.help = {
	name: "deafen",
	category: "Moderation",
	usage: "deafen <@user> [reason]",
	help: "Toggle whether a user is deafened",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [ "DEAFEN_MEMBERS" ]
};
