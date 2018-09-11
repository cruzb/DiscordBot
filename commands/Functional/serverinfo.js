const Discord = require("discord.js");
const config = require("../../config.json");


module.exports.run = async (client, message, args) => {
    const embed = new Discord.RichEmbed()
	    .setTitle("Server Information")
	    .setColor(config.embed_color)
	    .setThumbnail(message.guild.iconURL)
	    .addField("Server Name", message.guild.name, true)
	    .addField("Created On", message.guild.createdAt, true)
		.addField("Location", message.guild.region, true)
	    .addField("You Joined", message.member.joinedAt, false)
	    .addField("Total Members", message.guild.memberCount, true)

    message.channel.send(embed);
}


exports.help = {
	name: "serverinfo",
	category: "Functional",
	usage: "serverinfo",
	help: "See some basic information about this server",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: true,
	permissionLevel: 1,
	aliases: [ "info", "server" ],
	perms: [  ]
};
