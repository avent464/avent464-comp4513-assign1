## Overview
This project is an API for querying song data - artist, playlists, songs, averages, and moods. All data is returned in JSON format.

## Built with
**Node JS** - JavaScript runtime<br>
**Express** - Routing<br>
**Render** - Deployment -> https://avent464-comp4513-assign1.onrender.com

## Endpoints
| API Endpoint | Description |
|---|---|
| `/api/artists` | Returns all artists sorted by `artist_name`. |
| `/api/artists/:ref` | Returns a single artist by id (`ref`). |
| `/api/artists/averages/:ref` | Returns the average audio feature values for all songs by the given artist id (`ref`). |
| `/api/genres` | Returns all genres sorted by `genre_name`. |
| `/api/songs` | Returns all songs (includes nested artist + genre info). |
| `/api/songs/sort/:order` | Returns all songs sorted by `order` (`artist`, `year`, or `duration`). |
| `/api/songs/:ref` | Returns a single song by song id (`ref`). |
| `/api/songs/search/begin/:substring` | Returns songs whose titles begin with `substring`. |
| `/api/songs/search/begin/:substring/:order` | Returns songs whose titles begin with `substring`, with sorting controlled by `order`. |
| `/api/songs/search/any/:substring` | Returns songs whose titles contain `substring` anywhere. |
| `/api/songs/search/year/:year` | Returns songs where `year` matches exactly. |
| `/api/songs/artist/:ref` | Returns songs for the given artist id (`ref`). |
| `/api/songs/genre/:ref` | Returns songs for the given genre id (`ref`). |
| `/api/playlists` | Returns all playlist ids. |
| `/api/playlists/:ref` | Returns songs for playlist id (`ref`). |
| `/api/mood/dancing/:ref` | Returns top `ref` songs sorted by danceability (desc). |
| `/api/mood/happy/:ref` | Returns top `ref` songs sorted by valence (desc). |
| `/api/mood/happy` | Missing ref test route (returns JSON error). |
| `/api/mood/coffee/:ref` | Returns top `ref` songs sorted by (liveness / acousticness) (desc). |
| `/api/mood/studying/:ref` | Returns top `ref` songs sorted by (energy × speechiness) (asc). |

## Example API Requests

- https://avent464-comp4513-assign1.onrender.com/api/artists
- https://avent464-comp4513-assign1.onrender.com/api/artists/129
- https://avent464-comp4513-assign1.onrender.com/api/artists/sdfjkhsdf
- https://avent464-comp4513-assign1.onrender.com/api/artists/averages/129
- https://avent464-comp4513-assign1.onrender.com/api/genres
- https://avent464-comp4513-assign1.onrender.com/api/songs
- https://avent464-comp4513-assign1.onrender.com/api/songs/sort/artist
- https://avent464-comp4513-assign1.onrender.com/api/songs/sort/year
- https://avent464-comp4513-assign1.onrender.com/api/songs/sort/duration
- https://avent464-comp4513-assign1.onrender.com/api/songs/1010
- https://avent464-comp4513-assign1.onrender.com/api/songs/sjdkfhsdkjf
- https://avent464-comp4513-assign1.onrender.com/api/songs/search/begin/love
- https://avent464-comp4513-assign1.onrender.com/api/songs/search/begin/sdjfhs
- https://avent464-comp4513-assign1.onrender.com/api/songs/search/any/love
- https://avent464-comp4513-assign1.onrender.com/api/songs/search/year/2017
- https://avent464-comp4513-assign1.onrender.com/api/songs/search/year/2027
- https://avent464-comp4513-assign1.onrender.com/api/songs/artist/149
- https://avent464-comp4513-assign1.onrender.com/api/songs/artist/7834562
- https://avent464-comp4513-assign1.onrender.com/api/songs/genre/115
- https://avent464-comp4513-assign1.onrender.com/api/playlists
- https://avent464-comp4513-assign1.onrender.com/api/playlists/3
- https://avent464-comp4513-assign1.onrender.com/api/playlists/35362
- https://avent464-comp4513-assign1.onrender.com/api/mood/dancing/5
- https://avent464-comp4513-assign1.onrender.com/api/mood/dancing/500
- https://avent464-comp4513-assign1.onrender.com/api/mood/dancing/ksdjf
- https://avent464-comp4513-assign1.onrender.com/api/mood/happy/8
- https://avent464-comp4513-assign1.onrender.com/api/mood/happy
- https://avent464-comp4513-assign1.onrender.com/api/mood/coffee/10
- https://avent464-comp4513-assign1.onrender.com/api/mood/studying/15