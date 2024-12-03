const playlistDisplay = document.getElementById("playlist-list");

// Iterates through the localStorage to search for non-token playlists
for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "spotify_access_token") {
                const playlist = document.createElement("li");
                playlist.textContent = localStorage.key(i);
                playlistDisplay.appendChild(playlist);
        }
}