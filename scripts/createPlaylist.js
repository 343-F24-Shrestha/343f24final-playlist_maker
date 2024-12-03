// Event listener for when the DOM is loaded to handle the spotify authentication
document.addEventListener('DOMContentLoaded', () => {
    const radioSections = document.querySelectorAll('.radio-section');

    radioSections.forEach(section => {
        const toggleLabel = section.querySelector('.radio-toggle');
        toggleLabel.addEventListener('click', () => {
            section.classList.toggle('open');
        });
    });

    handleSpotifyAuth();
});

// Gets the access token from the url
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
}

// Handles if a token is present, else it gives the work to authorize the credentials
async function handleSpotifyAuth() {
    const token = getAccessTokenFromUrl();
    const tokenExpiration = localStorage.getItem("spotify_token_expiration");
    const currentTime = new Date().getTime();
    const storedToken = localStorage.getItem("spotify_access_token");

    if (token) {
        // Get ur token
        window.location.hash = "";
        localStorage.setItem("spotify_access_token", token); // sets the token
        localStorage.setItem("spotify_token_expiration", currentTime + 3600 * 1000); // Token valid for 1 hour bc currenttime is
        // in milliseconds and you add 3600 for seconds in an hour and multiply it by 1000 to get it in miliseconds
    } else if (token || currentTime > tokenExpiration){ //missing token or time runs out

        authorizeSpotify();
    }
}

// Authorizes access to Spotify APi with clientID and the redirect URI
function authorizeSpotify() {
    const clientId = "61e27c75288442e492a4585b195b1750";
    const redirectUri = "https://343-f24-shrestha.github.io/343f24final-playlist_maker/build-playlist.html";
    // Defines the scopes for access to the Spotify API
    const scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-public",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(
        clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
        scopes.join(" ")
    )}`;
    window.location.href = authUrl;
}

// Searches for the tracks based on the user input parameters
async function searchTracks(year, genre, popularity) {
    const apiUrl = 'https://api.spotify.com/v1/search';
    const query = `year:${year} genre:${genre}`;
    const accessToken = localStorage.getItem("spotify_access_token");

    if (!accessToken) {
        console.error("Access token is missing. Re-authorizing.");
        authorizeSpotify();
        return null;
    }

    try {
        // Fetch request to the API to get data from Spotify
        const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {
            console.error("Unauthorized: Token may be expired. Re-authorizing.");
            authorizeSpotify();
            return null;
        }
        const data = await response.json();

        // Creates a track object containing name, artist, album, and popularity
        if (data.tracks && data.tracks.items.length > 0) {
            const tracks = data.tracks.items.map(track => ({
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                popularity: track.popularity,
                url: track.external_urls.spotify,
            }));
            return tracks;
        } else {
        }
    } catch (error) {
    }
}

// Helper function to get the value that was selected for the radio inputs
function getSelectedRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

document.getElementById("new-submit").addEventListener("click", getTracks);

// Helper function to get the tracks and appends the songs to the created playlist on the HTML page
async function getTracks() {
    const year = getSelectedRadioValue("year");
    const genre = getSelectedRadioValue("genre");
    const popularity = getSelectedRadioValue("popularity");
    const titleInput= document.getElementById("title-input1").value;
    const songContainer = document.getElementById("song-container");
    let tracks = await searchTracks(year, genre, popularity);
    if (tracks) {
        // Iterates through the added tracks and creates html elements to the song-container element
        for (let i = 0; i < tracks.length; i++) {
            let song = document.createElement("p");
            song.textContent = "Artist: " + tracks[i].artist + " Title: " + tracks[i].name;
            songContainer.appendChild(song);
        }
        localStorage.setItem(titleInput, JSON.stringify(tracks));
    }
}
