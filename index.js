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

/* ----- query #1 - returns data for artists sorted by artist_name ----- */
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

/* ----- query #3 - returns average values for the specified artist ----- */
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

/* ----- query #2 - returns the specified artist ----- */
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

/* ----- query #4 - returns all genres ----- */
app.get("/api/genres", (req, res) => {
	const sql = `
		SELECT 
			genre_id,
			genre_name
		FROM genres
		ORDER BY genre_name;
	`;
	db.all(sql, [], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}
		res.json(rows);
	});
});

/* ----- query #5 - returns data for songs sorted by title ----- */

app.get("/api/songs", (req, res) => {
	const sql = `
		SELECT
			s.song_id,
			s.title,
			s.year,
			s.bpm,
			s.energy,
			s.danceability,
			s.loudness,
			s.liveness,
			s.valence,
			s.duration,
			s.acousticness,
			s.speechiness,
			s.popularity,
			a.artist_id AS artist_id,
			a.artist_name AS artist_name,
			g.genre_id AS genre_id,
			g.genre_name AS genre_name
		FROM songs s
		INNER JOIN artists a ON s.artist_id = a.artist_id
		INNER JOIN genres g ON s.genre_id = g.genre_id
		ORDER BY s.title;
	`;
	db.all(sql, [], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}
	
		const result = rows.map(r => ({
			song_id: r.song_id,
			title: r.title,
			year: r.year,
			bpm: r.bpm,
			energy: r.energy,
			danceability: r.danceability,
			loudness: r.loudness,
			liveness: r.liveness,
			valence: r.valence,
			duration: r.duration,
			acousticness: r.acousticness,
			speechiness: r.speechiness,
			popularity: r.popularity,
			artist: {
				artist_id: r.artist_id,
				artist_name: r.artist_name
			},
                      	genre: {
                                genre_id: r.genre_id,
                                genre_name: r.genre_name
                        }
		}));
		res.json(result);
	});
});

/* ----- query #6 - returns sorted songs ----- */
app.get("/api/songs/sort/:order", (req, res) => {
	const order = req.params.order;

	let sortBy;
	if(order === "id") {
		sortBy = "s.song_id";
	} else if(order === "title") {
		sortBy = "s.title";
	} else if(order === "year") {
		sortBy = "s.year";
	} else if(order === "duration") {
		sortBy = "s.duration";
	} else if(order === "artist") {
		sortBy = "a.artist_name";
	} else if(order === "genre") {
		sortBy = "g.genre_name";
	} else {
		return res.status(404).json({error: "Sorted order not found"});
	}

	const sql = `
		SELECT
			s.song_id, 
			s.title, 
			s.year, 
			s.bpm, 
			s.energy, 
			s.danceability, 
			s.loudness,
      			s.liveness, 
			s.valence, 
			s.duration, 
			s.acousticness, 
			s.speechiness, 
			s.popularity,
      			a.artist_id AS art_id, 
			a.artist_name AS art_name,
      			g.genre_id AS gen_id, 
			g.genre_name AS gen_name
		FROM songs s
		INNER JOIN artists a ON s.artist_id = a.artist_id
		INNER JOIN genres g ON s.genre_id = g.genre_id
		ORDER BY ${sortBy};
	`;
	db.all(sql, [], (err, rows) => {
		if(err) {
			return res.status(500).json({error: err.message});
		}

		const result = rows.map(r => ({
      			song_id: r.song_id,
      			title: r.title,
      			year: r.year,
      			bpm: r.bpm,
      			energy: r.energy,
      			danceability: r.danceability,
      			loudness: r.loudness,
      			liveness: r.liveness,
      			valence: r.valence,
      			duration: r.duration,
      			acousticness: r.acousticness,
     			speechiness: r.speechiness,
      			popularity: r.popularity,
      			artist: { artist_id: r.art_id, artist_name: r.art_name },
      			genre: { genre_id: r.gen_id, genre_name: r.gen_name }
    		}));
		res.json(result);
	});
});




app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});

