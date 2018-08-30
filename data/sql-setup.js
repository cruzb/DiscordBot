const SQLite = require("better-sqlite3");
const sql = new SQLite('./database.sqlite');

exports.run = (client) => {
	//BEGIN point table setup
	//generate point table and prepare sql commands
	//Notes cause im bad at sqlite
	//count(*) is number of rows that satisfy WHERE clause
	const pointTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!pointTable['count(*)']) {
		// If the table isn't there, create it and setup the database correctly.
	   	sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
	   	// Ensure that the "id" row is always unique and indexed.
	   	sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
	   	sql.pragma("synchronous = 1");
	   	sql.pragma("journal_mode = wal");
	}
	// And then we have two prepared statements to get and set the score data.
	client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
	client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
	client.top10Scores = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;")
	// END point table setup

	////////////////////////////////////////////////////

	const blacklistTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='blacklist';").get();
	if(!blacklistTable['count(*)']) {
		// If the table isn't there, create it and setup the database correctly.
	   	sql.prepare("CREATE TABLE blacklist (id TEXT PRIMARY KEY, user TEXT, guild TEXT);").run();
	   	// Ensure that the "id" row is always unique and indexed.
	   	sql.prepare("CREATE UNIQUE INDEX idx_blacklist_id ON blacklist (id);").run();
	   	sql.pragma("synchronous = 1");
	   	sql.pragma("journal_mode = wal");
	}
	client.getBlacklist = sql.prepare("SELECT * FROM blacklist WHERE id = ?");
	client.setBlacklist = sql.prepare("INSERT OR REPLACE INTO blacklist (id, user, guild) VALUES (@id, @user, @guild);");
	client.delBlacklist = sql.prepare("DELETE FROM blacklist WHERE id = ?")
}
