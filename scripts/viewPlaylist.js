const playlistDisplay = document.getElementById("playlist-list");

// Iterates through the localStorage to search for non-token playlists
for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "spotify_access_token") {
                if(localStorage.key(i) != "debug") {
                        const playlist = document.createElement("li");
                        const deleteButton = document.createElement("button");
                        deleteButton.addEventListener("click", async () => {
                                localStorage.removeItem(localStorage.key(i));
                                location.reload();
                        });
                        deleteButton.classList.add("delete");
                        playlist.textContent = localStorage.key(i);
                        playlist.append(deleteButton);
                        playlistDisplay.appendChild(playlist);
                }
        }
}