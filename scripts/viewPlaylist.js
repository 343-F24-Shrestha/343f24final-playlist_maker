let playlistDisplay = document.getElementById("playlist-list");

for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "spotify_access_token") {
                let playlist = document.createElement("li");
                playlist.textContent = localStorage.key(i);
                playlistDisplay.appendChild(playlist);
        }
}