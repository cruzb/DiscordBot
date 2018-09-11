const Discord = require("discord.js");
const request = require('request-promise');
const auth = require("../../auth.json");
const config = require("../../config.json");

//TODO allow user change time window
//TODO improve amount in request with random and sort
exports.run = (client, message, args) => {
	let subreddit = "all";
	let window = "all";
	let sort = "top";
	let nsfw = false;

	//BEGIN VALIDITY CHECKS
	if(!args[0]) return message.channel.send(message.author + " please include a subreddit to search.");
	else subreddit = args[0];

	//optional arguments are included
	//NOTE kept incase a 3rd argument is readded to this command
	let isSortChanged = false;
	let isWindowChanged = false;
	let arg1;
	let arg2;
	if(args[1]) {
		arg1 = args[1].toLowerCase();
		if(arg1 == "random") {
			sort = "random";
			isSortChanged = true;
		}
		else if(arg1 == "top") {
			sort = "top";
			isSortChanged = true;
		}
		else if(arg1 == "hour" || arg1 == "day" || arg1 == "week" || arg1 == "month" || arg1 == "year" || arg1 == "all") {
			window = arg1;
			isWindowChanged = true;
		}
		else return message.channel.send(message.author + " invalid argument. Try something like \"" + config.prefix + "reddit pics top all\"");
	}
	if(args[2]) {
		arg2 = args[2].toLowerCase();
		if(arg2 == "random") {
			sort = "random";
			isSortChanged = true;
		}
		else if(arg2 == "top") {
			sort = "top";
			isSortChanged = true;
		}
		else if(arg2 == "hour" || arg2 == "day" || arg2 == "week" || arg2 == "month" || arg2 == "year" || arg2 == "all") {
			window = arg2;
			isWindowChanged = true;
		}
		else return message.channel.send(message.author + " invalid argument. Try something like \"" + config.prefix + "reddit pics top all\"");
	}
	//if there are two arguments and they both changed the same parameter, tell the user the input was wrong
	if(args[2] && (isWindowChanged && !isSortChanged || !isWindowChanged && isSortChanged)) {
		return message.channel.send(message.author + " repeated argument type. Try something like \"" + config.prefix + "reddit pics top all\"");
	}
	//END VALIDITY CHECKS



	let limit = "1";
	const options = {
	    uri: `https://www.reddit.com/r/${subreddit}/top.json?t=${window}&limit=${limit}`,
		json: true
  	};
	if(sort == "random")
		options.uri = `https://www.reddit.com/r/${subreddit}/random.json`;

	//console.log("\n\n\n\n" + options.uri);
	request(options).then((data) => {
		//console.dir(data,  {depth:5, colors:true});
		let post;
		if(sort == "random") {
			if(data.data) post = data.data.children[0].data;
			//sometimes the above format doesn't work but only for some selfpost subreddits?
			else if(data[0]) post = data[0].data.children[0].data;
			else {
				console.log("---Error in reddit lookup---\nUnrecognized json format");
				return message.channel.send(message.author + " sorry, I received my data in an unexpected form. You should report this to my creator.");
			}
		}
		else post = data.data.children[0].data;

		//nsfw safety check
		if(post.over_18 && !message.channel.nsfw)
			return message.channel.send(message.author + " sorry the post I found was nsfw but this channel isn't nsfw.");


		//console.dir(post,  {depth:5, colors:true});
		const embed = new Discord.RichEmbed()
			.setTitle(post.title)
			.setAuthor("/u/" + post.author + "   |   /" + post.subreddit_name_prefixed + "")
			.setURL("https://reddit.com" + post.permalink)

			//.setImage(post.url)
			.setColor(config.embed_color)
			.setFooter("Score: " + post.score
						+ "  |  Comments: " + post.num_comments
			 			+ "  |  Gilds: " + post.gilded)




		//self posts have no media to share
		if(post.is_self) {
			if(post.selftext.length < 2045)
				embed.setDescription(post.selftext);
			else
				embed.setDescription(post.selftext.substring(0,2045) + "...")

		}
		else if(!post.post_hint || post.post_hint.includes("link")) {
			if(post.preview){
				embed.setImage(post.preview.images[0].source.url);
				//console.log(post.preview.images[0].source.url);
			}
			else if(post.thumbnail)
				embed.setImage(post.thumbnail);
		}
		else {
			//cannot include videos in embeds so post, then give the info in the embed after
			if(post.post_hint.includes("video")) {
				//reddit hosted videos have to be specially handled because they suck
				if(post.media.reddit_video)
					message.channel.send(post.media.reddit_video.fallback_url);
				else message.channel.send(post.url);
			}
			else if(post.post_hint.includes("image")) {
				embed.setImage(post.url);
			}
			else {
				console.log("---Error in reddit search---")
				console.log("Unhandles post type: " + post.post_hint);
				return message.channel.send(message.author + " sorry, something went wrong.");
			}
		}


		message.channel.send({embed});

	})
	.catch((err) => {
		console.log("---Error in reddit imgur lookup---");
		console.log(err);
		message.channel.send(message.author + " something went wrong. You may not have provided an valid subreddit.")
	});
}


exports.help = {
	name: "reddit",
	category: "Fun",
	usage: "reddit <subreddit> [random|top] [day|week|etc]",
	help: "Posts a random or top image from a subreddit.",
	dev: false
}

exports.config = {
	enabled: true,
	guildOnly: false,
	permissionLevel: 1,
	aliases: [  ],
	perms: [  ]
};
