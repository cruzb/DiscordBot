const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!config.allow_moderation) return;
	let target = message.mentions.members.first();
	let reason = args.join(" ");

	if(target.user.bot)
		return message.channel.send("Nice try.");

	if(message.mentions.members.size == 0)
		return message.channel.send(message.author + " you need to mention a user to kick.");

	if(!target.kickable)
		return message.channel.send("I'm sorry " + message.author + ", I'm afraid you can't do that");

	else {
		target.kick(target.user.username + "#" + target.user.discriminator + " was kicked by " + message.author.username + "#" + message.author.discriminator + " for reason: " + reason);
		return message.channel.send(message.author + " successfully kicked " + target);
	}
}

exports.help = {
	name: "kick",
	category: "Moderation",
	usage: "kick <@user> [reason]",
	help: "Kick a user from this server",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [ "KICK_MEMBERS" ]
};
