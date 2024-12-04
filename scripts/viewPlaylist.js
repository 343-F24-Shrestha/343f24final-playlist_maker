const playlistDisplay = document.getElementById("playlist-list");

// Iterates through the localStorage to search for non-token playlists
for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "access_token") {
                if(localStorage.key(i) != "debug") {
                        const playlist = document.createElement("li");
                        const deleteButton = document.createElement("button");
                        deleteButton.innerText = "Remove";
                        deleteButton.addEventListener("click", async () => {
                                let previousKey = localStorage.key(i);
                                localStorage.removeItem(localStorage.key(i));
                                location.reload();
                                alert(`Successfully Removed ${previousKey}`);
                        });
                        deleteButton.classList.add("delete");
                        playlist.textContent = localStorage.key(i);
                        playlist.append(deleteButton);
                        playlistDisplay.appendChild(playlist);
                }
        }
}