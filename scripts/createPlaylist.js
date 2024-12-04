// Event listener for when the DOM is loaded to handle the spotify authentication
document.addEventListener('DOMContentLoaded', () => {
    const radioSections = document.querySelectorAll('.radio-section');

    radioSections.forEach(section => {
        const toggleLabel = section.querySelector('.radio-toggle');
        toggleLabel.addEventListener('click', () => {
            section.classList.toggle('open');
        });
    });
});

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

// Gets a Spotify API token with a POST
async function getToken() {
    const clientId = "61e27c75288442e492a4585b195b1750";
    const clientSecret = "6749ffe7281b4a85b84bc23b2341cad7";
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
};

document.getElementById("new-submit").addEventListener("click", getTracks);
document.getElementById("add-button").addEventListener("click", addPlaylist);

// Searches for the tracks based on the user input parameters
async function searchTracks(year, genre, popularity) {
    const apiUrl = 'https://api.spotify.com/v1/search';
    const query = `year:${year} genre:${genre}`;

    try {
        const token = await getToken();
        const result = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
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
        }
    } catch (error) {
        console.error(`Error raised by playlist creation: ${error}`);
    }
}

let madeTracks;

// Helper function to get the tracks and appends the songs to the created playlist on the HTML page
async function getTracks() {
    const year = getSelectedRadioValue("year");
    const genre = getSelectedRadioValue("genre");
    const popularity = getSelectedRadioValue("popularity");
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = "";
    let tracks = await searchTracks(year, genre, popularity);
    if (tracks) {
        // Iterates through the added tracks and creates html elements to the song-container element
        for (let i = 0; i < tracks.length; i++) {
            let song = document.createElement("p");
            song.textContent = "Artist: " + tracks[i].artist + " Title: " + tracks[i].name;
            songContainer.appendChild(song);
        }
        madeTracks = tracks;
    }
}

// Helper function to add the playlist to localStorage if tracks were retrieved
async function addPlaylist() {
    const titleInput = document.getElementById("title-input1").value;
    if (madeTracks) {
        if (titleInput == "") {
            localStorage.setItem("Untitled", JSON.stringify(madeTracks));
            alert("Added New Playlist: Untitled");
        } else {
            localStorage.setItem(titleInput, JSON.stringify(madeTracks));
            alert(`Added New Playlist: ${titleInput}`);
        }
    }
}