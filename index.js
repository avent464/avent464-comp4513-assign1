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

function mapRow(r) {
  return {
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
    artist: { artist_id: r.artist_id, artist_name: r.artist_name },
    genre: { genre_id: r.genre_id, genre_name: r.genre_name }
  };
}

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
		if (err) {
			return res.status(500).json({error: err.message});
		}
		res.json(rows);
	});
});

/* ----- query #3 - returns average values for the specified artist ----- */
app.get("/api/artists/averages/:ref", (req, res) => {
	const ref = Number(req.params.ref);
	
	if (!Number.isInteger(ref)) {
		return res.status(404).json({error: "Artist averages not found"});
	}
	
	const sql = `
		SELECT
			AVG(bpm) AS bpm,
			AVG(energy) AS energy,
			AVG(danceability) AS danceability,
			AVG(loudness) AS loudness,
            AVG(liveness) AS liveness,
            AVG(valence) AS valence,
			AVG(duration) AS duration,
            AVG(acousticness) AS acousticness,
            AVG(speechiness) AS speechiness,
			AVG(popularity) AS popularity
		FROM songs
		WHERE artist_id = ?;
	`;

	db.get(sql, [ref], (err, row) => {
		if (err) {
			return res.status(500).json({error: err.message});
		} else {
			if (!row || row.popularity === null) {
				return res.status(404).json({error: "Artist averages not found"});
			}
			res.json(row);
		}
	});
}); 

/* ----- query #2 - returns the specified artist ----- */
app.get("/api/artists/:ref", (req, res) => {
	const ref = Number(req.params.ref);

	if (!Number.isInteger(ref)) {
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
		if (err) {
			return res.status(500).json({error: err.message});
		}
		if (!row) {
  			return res.status(404).json({ error: "Artist not found" });
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
		if (err) {
			return res.status(500).json({error: err.message});
		}
		res.json(rows);
	});
});

/* ----- query #5 - returns data for songs sorted by title ----- */
app.get("/api/songs", (req, res) => {
	const sql = `
		SELECT
			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability,
			s.loudness, s.liveness, s.valence, s.duration,
			s.acousticness, s.speechiness, s.popularity,
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
		if (err) {
			return res.status(500).json({error: err.message});
		}
	
		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #6 - returns sorted songs ----- */
app.get("/api/songs/sort/:order", (req, res) => {
	const order = req.params.order;

	let sortBy;
	if (order === "id") {
		sortBy = "s.song_id";
	} else if (order === "title") {
		sortBy = "s.title";
	} else if (order === "year") {
		sortBy = "s.year";
	} else if (order === "duration") {
		sortBy = "s.duration";
	} else if (order === "artist") {
		sortBy = "a.artist_name";
	} else if (order === "genre") {
		sortBy = "g.genre_name";
	} else {
		return res.status(404).json({error: "Sorted order not found"});
	}

	const sql = `
		SELECT
			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
			s.loudness, s.liveness, s.valence, s.duration, 
			s.acousticness, s.speechiness, s.popularity,
      		a.artist_id AS artist_id, a.artist_name AS artist_name,
			g.genre_id AS genre_id, g.genre_name AS genre_name
		FROM songs s
		INNER JOIN artists a ON s.artist_id = a.artist_id
		INNER JOIN genres g ON s.genre_id = g.genre_id
		ORDER BY ${sortBy};
	`;

	db.all(sql, [], (err, rows) => {
		if (err) {
			return res.status(500).json({error: err.message});
		}

		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #8 - returns the songs whose title begins with the provided substring ----- */
app.get("/api/songs/search/begin/:substring", (req, res) => {
  	const substring = req.params.substring;

  	const sql = `
    		SELECT
      		s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
			s.loudness, s.liveness, s.valence, s.duration, 
			s.acousticness, s.speechiness, s.popularity,
      		a.artist_id AS artist_id, a.artist_name AS artist_name,
      		g.genre_id AS genre_id, g.genre_name AS genre_name
    		FROM songs s
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE LOWER(s.title) LIKE ?
    		ORDER BY s.title;
  	`;

  	const searchValue = substring.toLowerCase() + "%";

  	db.all(sql, [searchValue], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (rows.length === 0) {
			return res.status(404).json({ error: "No songs found" });
		}

		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #9 - returns the songs whose title contains the provided substring ----- */
app.get("/api/songs/search/any/:substring", (req, res) => {
  	const substring = req.params.substring;

  	const sql = `
    		SELECT
      			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
			s.loudness, s.liveness, s.valence, s.duration, 
			s.acousticness, s.speechiness, s.popularity,
     			a.artist_id AS artist_id, a.artist_name AS artist_name,
      			g.genre_id AS genre_id, g.genre_name AS genre_name
    		FROM songs s
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE LOWER(s.title) LIKE ?
    		ORDER BY s.title;
  	`;

  	const searchValue = "%" + substring.toLowerCase() + "%";

  	db.all(sql, [searchValue], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (rows.length === 0) {
			return res.status(404).json({ error: "No songs found" });
		}

		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #10 - returns the songs whose year is equal to the provided substring ----- */
app.get("/api/songs/search/year/:substring", (req, res) => {
 	const year = Number(req.params.substring);

  	if (!Number.isInteger(year)) {
  	  	return res.status(404).json({ error: "No songs found" });
  	}

  	const sql = `
    		SELECT
      			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
				s.loudness,s.liveness, s.valence, s.duration, 
				s.acousticness, s.speechiness, s.popularity,
      			a.artist_id AS artist_id, a.artist_name AS artist_name,
      			g.genre_id AS genre_id, g.genre_name AS genre_name
    		FROM songs s
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE s.year = ?
    		ORDER BY s.title;
  	`;

  	db.all(sql, [year], (err, rows) => {
    	if (err) {
			return res.status(500).json({ error: err.message });
		}

    	if (rows.length === 0) {
    		return res.status(404).json({ error: "No songs found" });
    	}

		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #11 - returns all the songs for the specified artist ----- */
app.get("/api/songs/artist/:ref", (req, res) => {
  	const ref = Number(req.params.ref);

  	if (!Number.isInteger(ref)) {
    		return res.status(404).json({ error: "No songs found" });
  	}

  	const sql = `
    		SELECT
      			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
				s.loudness, s.liveness, s.valence, s.duration, 
				s.acousticness, s.speechiness, s.popularity,
      			a.artist_id AS artist_id, a.artist_name AS artist_name,
      			g.genre_id AS genre_id, g.genre_name AS genre_name
    		FROM songs s
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE s.artist_id = ?
    		ORDER BY s.title;
  	`;

  	db.all(sql, [ref], (err, rows) => {
    	if (err) {
			return res.status(500).json({ error: err.message });
		}

    	if (rows.length === 0) {
      			return res.status(404).json({ error: "No songs found" });
    		}

		const result = rows.map(mapRow);
		res.json(result);
  	});
});

/* ----- query #12 - returns all the songs for the specified genre ----- */
app.get("/api/songs/genre/:ref", (req, res) => {
	const ref = Number(req.params.ref);

  	if (!Number.isInteger(ref)) {
    		return res.status(404).json({ error: "No songs found" });
  	}

  	const sql = `
    		SELECT
      			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
				s.loudness, s.liveness, s.valence, s.duration, 
				s.acousticness, s.speechiness, s.popularity,
      			a.artist_id AS artist_id, a.artist_name AS artist_name,
      			g.genre_id AS genre_id, g.genre_name AS genre_name
    		FROM songs s
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE s.genre_id = ?
    		ORDER BY s.title;
  	`;

  	db.all(sql, [ref], (err, rows) => {
    	if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (rows.length === 0) {
			return res.status(404).json({ error: "No songs found" });
		}

		const result = rows.map(mapRow);
		res.json(result);
	});
});

/* ----- query #7 - returns the specified song ----- */
app.get("/api/songs/:ref", (req, res) => {
	const ref = Number(req.params.ref);

  	if (!Number.isInteger(ref)) {
    	return res.status(404).json({ error: "Song not found" });
  	}

  	const sql = `
    	SELECT
			s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability,
			s.loudness,s.liveness, s.valence, s.duration, 
			s.acousticness, s.speechiness, s.popularity,
  			a.artist_id AS artist_id, a.artist_name AS artist_name,
    		g.genre_id AS genre_id, g.genre_name AS genre_name
    	FROM songs s
		INNER JOIN artists a ON s.artist_id = a.artist_id
    	INNER JOIN genres g ON s.genre_id = g.genre_id
    	WHERE s.song_id = ?;
  	`;

  	db.get(sql, [ref], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (!row) {
			return res.status(404).json({ error: "Song not found" });
		}

		const result = mapRow(row);
		res.json(result);
  	});
});

/* ----- query #13 - returns all the songs for the specified playlist ----- */
app.get("/api/playlists", (req, res) => {
  	const sql = `
		SELECT DISTINCT playlist_id
    		FROM playlists
    		ORDER BY playlist_id;
  	`;

  	db.all(sql, [], (err, rows) => {
    	if (err) {
			return res.status(500).json({ error: err.message });
    	}
		res.json(rows);
  	});
});

app.get("/api/playlists/:ref", (req, res) => {
  	const ref = Number(req.params.ref);

  	if (!Number.isInteger(ref)) {
    	return res.status(404).json({ error: "Playlist not found" });
  	}

  	const sql = `
    		SELECT
      			p.playlist_id AS playlist,
      			s.song_id,
      			s.title,
      			a.artist_name,
      			g.genre_name,
      			s.year
    		FROM playlists p
   			INNER JOIN songs s ON p.song_id = s.song_id
    		INNER JOIN artists a ON s.artist_id = a.artist_id
    		INNER JOIN genres g ON s.genre_id = g.genre_id
    		WHERE p.playlist_id = ?
    		ORDER BY s.title;
  	`;

  	db.all(sql, [ref], (err, rows) => {
    	if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (rows.length === 0) {
			return res.status(404).json({ error: "Playlist not found" });
		}
		res.json(rows);
  	});
});

/* ----- query #14 - returns top songs sorted by danceability parameter (descending) ----- */
function getLimit(ref) {
 	const n = Number(ref);

  	if (!Number.isInteger(n) || n < 1) {
		return 20;
	} else if (n > 20) {
		return 20;
	} else {
		 return n;
	}
}

function moodRoute(orderByParam, direction) {
  	return (req, res) => {
		const limit = getLimit(req.params.ref);

		const sql = `
			SELECT
				s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, 
				s.loudness, s.liveness, s.valence, s.duration, 
				s.acousticness, s.speechiness, s.popularity,
				a.artist_id AS artist_id, a.artist_name AS artist_name,
				g.genre_id AS genre_id, g.genre_name AS genre_name
			FROM songs s
			INNER JOIN artists a ON s.artist_id = a.artist_id
			INNER JOIN genres g ON s.genre_id = g.genre_id
			ORDER BY ${orderByParam} ${direction}
			LIMIT ?;
		`;

		db.all(sql, [limit], (err, rows) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			if (rows.length === 0) {
				return res.status(404).json({ error: "No songs found" });
			}	
	
			const result = rows.map(mapRow);
			res.json(result);
		});
  	};
}

/* ----- dancing ----- */
app.get("/api/mood/dancing/:ref", moodRoute("s.danceability", "DESC"));


/* ----- query #15 - happy ----- */
app.get("/api/mood/happy/:ref", moodRoute("s.valence", "DESC"));
app.get("/api/mood/happy", (req, res) => {
  return res.status(404).json({ error: "Missing ref parameter" });
});

/* ----- query #16 - coffee ----- */
app.get("/api/mood/coffee/:ref", moodRoute("(1.0 * s.liveness / NULLIF(s.acousticness, 0))", "DESC"));


/* ----- query #17 - studying ----- */
app.get("/api/mood/studying/:ref", moodRoute("(s.energy * s.speechiness)", "ASC"));

app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});