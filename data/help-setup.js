const categories = require("./help.json");
const config = require("../config.json");

exports.run = (commands) => {
	commands.array().forEach((c) => {
		let command = require("." + c);

		//error handle for a command file that is missing help data
		if(!command.help) return console.log("---Error " + c + " is missing help field---");
		//error handle for category name that does not match with the above categories object
		if(!categories.hasOwnProperty(command.help.category)) return console.log("---Error " + c + " has improper category name---");

		if(command.help.dev) return; //exclude dev commands
		if(!command.config.enabled) return;


		//per config exclude moderation commands
		if(!config.allow_moderation && command.help.category == "Moderation") {
			command.config.enabled = false;
			return;
		}




		let field = "***" + command.help.usage + "*** - " + command.help.help + "\n";
		categories[command.help.category] = categories[command.help.category].concat(field);

	});
}
