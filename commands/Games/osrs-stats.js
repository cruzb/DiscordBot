const { constants, hiscores } = require("osrs-api");
const Discord = require("discord.js");
const config = require("../../config.json");


exports.run = (client, message, args) => {

	if(!args[0]) {
		message.channel.send(message.author + " please provide a player name");
		return;
	}
	else  {
		//TODO allow search by any category by default
		//TODO switch to custom emoji
		hiscores.getPlayer({ name: args.join(', '), type: constants.playerTypes.normal }).then((data) => {
			//console.dir(data, {depth : 4, colors : true});
			const embed = new Discord.RichEmbed()
				.setTitle(data.name + "\'s Stats")
				.setAuthor(client.user.username, client.user.avatarURL)

				.addField("Attack:dagger:","**Level: **" + data.attack.level + "\n**Experience: **" + data.attack.experience + "\n**Rank: **" + data.attack.rank,true)
				.addField("Health:heart:","**Level: **" + data.hitpoints.level + "\n**Experience: **" + data.hitpoints.experience + "\n**Rank: **" + data.hitpoints.rank,true)
				.addField("Mining:pick:","**Level: **" + data.mining.level + "\n**Experience: **" + data.mining.experience + "\n**Rank: **" + data.mining.rank,true)
				//.addBlankField()
				.addField("Strength:fist:","**Level: **" + data.strength.level + "\n**Experience: **" + data.strength.experience + "\n**Rank: **" + data.strength.rank,true)
				.addField("Agility:runner:","**Level: **" + data.agility.level + "\n**Experience: **" + data.agility.experience + "\n**Rank: **" + data.agility.rank,true)
				.addField("Smithing:hammer:","**Level: **" + data.smithing.level + "\n**Experience: **" + data.smithing.experience + "\n**Rank: **" + data.smithing.rank,true)
				//.addBlankField()
				.addField("Defence:shield:","**Level: **" + data.defence.level + "\n**Experience: **" + data.defence.experience + "\n**Rank: **" + data.defence.rank,true)
				.addField("Herblore:herb:","**Level: **" + data.herblore.level + "\n**Experience: **" + data.herblore.experience + "\n**Rank: **" + data.herblore.rank,true)
				.addField("Fishing:fish:","**Level: **" + data.fishing.level + "\n**Experience: **" + data.fishing.experience + "\n**Rank: **" + data.fishing.rank,true)
				//.addBlankField()
				.addField("Ranging:bow_and_arrow:","**Level: **" + data.ranged.level + "\n**Experience: **" + data.ranged.experience + "\n**Rank: **" + data.ranged.rank,true)
				.addField("Thieving:spy:","**Level: **" + data.thieving.level + "\n**Experience: **" + data.thieving.experience + "\n**Rank: **" + data.thieving.rank,true)
				.addField("Cooking:fork_and_knife:","**Level: **" + data.cooking.level + "\n**Experience: **" + data.cooking.experience + "\n**Rank: **" + data.cooking.rank,true)
				//.addBlankField()
				.addField("Prayer:star:","**Level: **" + data.prayer.level + "**\nExperience: **" + data.prayer.experience + "\n**Rank: **" + data.prayer.rank,true)
				.addField("Crafting:hammer_pick:","**Level: **" + data.crafting.level + "\n**Experience: **" + data.crafting.experience + "\n**Rank: **" + data.crafting.rank,true)
				.addField("Firemaking:fire:","**Level: **" + data.firemaking.level + "\n**Experience: **" + data.firemaking.experience + "\n**Rank: **" + data.firemaking.rank,true)
				//.addBlankField()
				.addField("Magic:8ball:","**Level: **" + data.magic.level + "\n**Experience: **" + data.magic.experience + "\n**Rank: **" + data.magic.rank,true)
				.addField("Fletching:tanabata_tree:","**Level: **" + data.fletching.level + "\n**Experience: **" + data.fletching.experience + "\n**Rank: **" + data.fletching.rank,true)
				.addField("Woodcutting:deciduous_tree:","**Level: **" + data.woodcutting.level + "\n**Experience: **" + data.woodcutting.experience + "\n**Rank: **" + data.woodcutting.rank,true)
				//.addBlankField()
				.addField("Runecrafting:slight_frown:","**Level: **" + data.runecrafting.level + "\n**Experience: **" + data.runecrafting.experience + "**\nRank: **" + data.runecrafting.rank,true)
				.addField("Slayer:skull:","**Level: **" + data.slayer.level + "\n**Experience: **" + data.slayer.experience + "\n**Rank: **" + data.slayer.rank,true)
				.addField("Farming:shower:","**Level: **" + data.farming.level + "\n**Experience: **" + data.farming.experience + "\n**Rank: **" + data.farming.rank,true)
				//.addBlankField()
				.addField("Construction:tools:","**Level: **" + data.construction.level + "\n**Experience: **" + data.construction.experience + "\n**Rank: **" + data.construction.rank,true)
				.addField("Hunter:feet:","**Level: **" + data.hunter.level + "\n**Experience: **" + data.hunter.experience + "\n**Rank: **" + data.hunter.rank,true)
				.addField("Total Level","**Level: **" + data.overall.level + "\n**Experience: **" + data.overall.experience + "\n**Rank: **" + data.overall.rank,true)


				.setColor(config.embed_color)
				.setFooter("If data is not found the user may be an ironman")
				.setTimestamp()

			message.channel.send({embed});
		})
		.catch( err => {
			console.log(err);
            message.channel.send('No player found')
        });

	}

}



exports.help = {
	name: "osrs-stats",
	category: "Games",
	usage: "osrs-stats <username> [playertype]",
	help: "Check someone's Old School Runescape stats",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [ "osrsstats", "osrs" ],
	perms: [  ]
};
