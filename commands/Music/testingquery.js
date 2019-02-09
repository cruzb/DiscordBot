const request = require('request-promise');
const auth = require("../../auth.json");

exports.run = (client, message, args) => {

	if(!message.guild.voiceConnection) message.member.voiceChannel.join().then((connection) => {
		play(server, connection)
	})
}

function play(server, connection){
	server.dispatcher = connection.playArbitraryInput(request("https://clips.twitch.tv/AmazonianEncouragingLyrebirdAllenHuhu?tt_medium=clips_api&tt_content=url"));
	server.currentSong = server.queue[0];
	//get info and add to current song here

	//TODO make bot join channel of author?
	server.queue.shift();
	server.dispatcher.on("end", end => {
		if(server.queue[0]){
			play(server, connection);
		}
		else {
			server.currentSong = null;
			connection.disconnect();
		}
	});
}


exports.help = {
	name: "sdsfstatus",
	category: "Games",
	usage: "steamssdfus",
	help: "Check the status of various steam services",
	dev: false
}

exports.config = {
	enabled: false,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
