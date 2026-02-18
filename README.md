## Overview
This project is an API for querying song data - artist, playlists, songs, averages, and moods. All data is returned in JSON format.

## Built with
**Node JS** - JavaScript runtime<br>
**Express** - Routing<br>
**Render** - Deployment -> https://avent464-comp4513-assign1.onrender.com

## API Endpoints
| Endpoint | Description |
|---|---|
| `/api/artists` | Returns all artists sorted by artist name. |
| `/api/artists/:ref` | Returns a single artist by id. |
| `/api/artists/averages/:ref` | Returns the average audio values for all songs by the specified artist. |
| `/api/genres` | Returns all genres. |
| `/api/songs` | Returns all data for all songs. |
| `/api/songs/sort/:order` | Returns all the songs sorted by order field. |
| `/api/songs/:ref` | Returns just the specified song. |
| `/api/songs/search/begin/:substring` | Returns the songs whose title begins with the provided substring. |
| `/api/songs/search/any/:substring` | Returns songs whose titles contain the given substring anywhere. |
| `/api/songs/search/year/:year` | Returns songs where year is equal to given substring. |
| `/api/songs/artist/:ref` | Returns songs for the specified artist. |
| `/api/songs/genre/:ref` | Returns songs for the specified genre. |
| `/api/playlists` | Returns all playlist ids. |
| `/api/playlists/:ref` | Returns songs for playlist id. |
| `/api/mood/dancing/:ref` | Returns top songs sorted by danceability (desc). |
| `/api/mood/happy/:ref` | Returns top songs sorted by valence (desc). |
| `/api/mood/happy` | Returns the top number of songs sorted by valence parameter. |
| `/api/mood/coffee/:ref` | Returns top songs sorted by (liveness / acousticness) (desc). |
| `/api/mood/studying/:ref` | Returns top songs sorted by (energy × speechiness) (asc). |

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