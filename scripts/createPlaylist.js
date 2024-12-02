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

function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
}

function handleSpotifyAuth() {
    const token = getAccessTokenFromUrl();
    if (token) {
        console.log("token :", token);
        window.location.hash = ""; 
        localStorage.setItem("spotify_access_token", token);
    } else {
        console.log("No token found, authorizing...");
        authorizeSpotify();
    }
}

function authorizeSpotify() {
    const clientId = "61e27c75288442e492a4585b195b1750";
    const redirectUri = "https://343-f24-shrestha.github.io/343f24final-playlist_maker/build-playlist.html";
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

async function searchTracks(year, genre, popularity) {
    const apiUrl = 'https://api.spotify.com/v1/search';
    const query = `year:${year} genre:${genre}`;
    const accessToken = localStorage.getItem("spotify_access_token");

    try {
        const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
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
            console.log('no tracks');
        }
    } catch (error) {
        console.error('failed track:', error);
    }
}

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

async function getTracks() {
    const year = getSelectedRadioValue("year");
    const genre = getSelectedRadioValue("genre");
    const popularity = getSelectedRadioValue("popularity");
    const title = document.getElementById("title-input").value;

    console.log(year + genre + popularity);

    const container = document.getElementById("song-container");
    let tracks = await searchTracks(year, genre, popularity);

    if (tracks) {
        for (let i = 0; i < tracks.length; i++) {
            let song = document.createElement("p");
            song.textContent = "Artist: " + tracks[i].artist + " Title: " + tracks[i].name;
            container.appendChild(song);
        }
        localStorage.setItem(title, JSON.stringify(tracks));
    }
}
