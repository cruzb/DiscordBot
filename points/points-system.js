//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./scores.sqlite');

//Any message seen by this bot that is not sent by a bot and not a command
//is handled in sent to this function for handling
exports.run = (client, message) => {
	if(!message.guild) return; //ignore private messages
	if(!message.content.includes("😠")) return;

	let score = client.getScore.get(message.author.id, message.guild.id);

	if (!score) {
	  	score = {
	    	id: `${message.guild.id}-${message.author.id}`,
	    	user: message.author.id,
	    	guild: message.guild.id,
	    	points: 0,
	    	level: 1
  		}
	}

	score.points++;
	// Calculate the current level through MATH OMG HALP.
	const currLevel = Math.floor(0.1 * Math.sqrt(score.points));

	// Check if the user has leveled up, and let them know if they have:
	if(score.level < currLevel) {
  		// Level up!
  		message.reply(`You've leveled up to level **${currLevel}**! Ain't that dandy?`);
	}
	client.setScore.run(score);
}
