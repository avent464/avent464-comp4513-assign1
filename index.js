const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const dbPath = path.join(__dirname, "data", "songs-2026.db");

const app = express();
const PORT = 8080;

app.use(express.json());

/* opening the database */
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.log("Database failed to connect: ", err.message);
	}else{
		console.log("Successfully connected to the Database.");
	}
});

app.get ("/", (req, res) => {
	res.json({ status: "good" });
});

/* testing the route */
app.get("/api/tables", (req, res) => {
	const sql = "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;";
	db.all(sql, [], (err, rows) => {
		if (err) {
			return res.status(500).json({error: err.message});
		}else{
			res.json(rows);
		}
	});
});

/* query #1 - returns data for artists sorted by artist_name */
app.get("/api/artists", (req, res) => {
	const sql = `
		SELECT
			a.artist_id,
			a.artist_name,
			a.artist_image_url,
			a.spotify_url,
			a.spotify_desc,
			t.type_name
		FROM artists a
		INNER JOIN types t ON a.artist_type_id = t.type_id
		ORDER BY a.artist_name;

	`;
	db.all(sql, [], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}
		res.json(rows);
	});
});

/* query #3 - returns average values for the specified artist */
app.get("/api/artists/averages/:ref", (req, res) => {
	const ref = Number(req.params.ref);
	
	if(!Number.isInteger(ref)) {
		return res.status(404).json({error: "Artist averages not fount"});
	}
	
	const sql = `
		SELECT
			AVG(bpm) AS bpm,
			AVG(energy) AS energy,
			AVG(danceability) AS danceability,
			AVG(loudness) AS loudness,
                        AVG(liveness) AS liveness,
                        AVG(valence) AS valence,
			AVG(bpm) AS duration,
                        AVG(acousticness) AS acousticness,
                        AVG(speechiness) AS speechiness,
			AVG(popularity) AS popularity
		FROM songs
		WHERE artist_id = ?;
	`;
	db.get(sql, [ref], (err, row) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}else{
			if(!row || row.popularity === null) {
				return res.status(404).json({error: "Artist averages not found"});
			}
			res.json(row);
		}
	});
}); 

/* query #2 - returns the specified artist */
app.get("/api/artists/:ref", (req, res) => {
	const ref = Number(req.params.ref);

	if(!Number.isInteger(ref)) {
		return res.status(404).json({error: "Artist not found"});
	}

	const sql = `
		SELECT
			a.artist_id,
			a.artist_name,
			a.artist_image_url,
			a.spotify_url,
			a.spotify_desc,
			t.type_name
		FROM artists a
		INNER JOIN types t ON a.artist_type_id = t.type_id
		WHERE a.artist_id = ?;
	`;
	db.get(sql, [ref], (err, row) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}
		res.json(row);
	});
});


app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});

