const config = require("../../config.json");

exports.run = (client, message, args) => {
	if(!config.allow_moderation) return;
	//TODO user different permission?

	if(args[1]) return message.channel.send(message.author + " that's too many arguments! Just tag the target.")


	let target = message.mentions.members.first();
	let entry = client.getBlacklist.get(`${message.guild.id}-${target.id}`);

	if(target.user.bot)
		return message.channel.send("Nice try.");

	if (!entry) {
	  	entry = {
	    	id: `${message.guild.id}-${target.id}`,
	    	user: target.id,
	    	guild: message.guild.id,
  		}
	}

	client.setBlacklist.run(entry);
	message.channel.send(message.author + " successfully blacklisted " + target + " from using me.");
}


exports.help = {
	name: "blacklist",
	category: "Moderation",
	usage: "blacklist <@user>",
	help: "Blacklist a user from using my commands",
	dev: false
}


exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 3,
	aliases: [  ],
	perms: [ "MANAGE_ROLES" ]
};
