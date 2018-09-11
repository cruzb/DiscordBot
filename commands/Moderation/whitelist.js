const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!config.allow_moderation) return;
	//TODO use different permission?

	if(args[1]) return message.channel.send(message.author + " that's too many arguments! Just tag the target.")

	let target = message.mentions.members.first();
	let entry = client.getBlacklist.get(`${message.guild.id}-${target.id}`);

	if(target.user.bot)
		return message.channel.send("Nice try.");

	if (entry) {
	  	client.delBlacklist.run(entry.id);
		message.channel.send(message.author + " successfully whitelisted " + target);
	}
	else{
		message.channel.send(message.author + " you cannot whitelist " + target + " as they are not blacklisted.");
	}
}


exports.help = {
	name: "whitelist",
	category: "Moderation",
	usage: "whitelist <@user>",
	help: "Allow a user to use my commands",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [ "MANAGE_ROLES" ]
};
