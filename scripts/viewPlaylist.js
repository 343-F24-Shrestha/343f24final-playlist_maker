const playlistDisplay = document.getElementById("playlist-list");

// Iterates through the localStorage to search for non-token playlists
for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "access_token") {
                if (localStorage.key(i) != "debug") {
                        const playlist = document.createElement("li");
                        const deleteButton = document.createElement("button");
                        deleteButton.innerText = "Remove";
                        // Delete button removes selected playlist from localStorage and alerts when completed
                        deleteButton.addEventListener("click", async () => {
                                let previousKey = localStorage.key(i);
                                localStorage.removeItem(localStorage.key(i));
                                location.reload();
                                if (previousKey) {
                                        alert(`Successfully Removed ${previousKey}`);
                                }
                        });
                        deleteButton.classList.add("delete");
                        // Rename button that allows users to update a playlist's title
                        let renameButton = document.createElement("button");
                        renameButton.classList.add("rename");
                        renameButton.innerText = "Rename";
                        renameButton.addEventListener("click", async () => {
                                const currentKey = localStorage.key(i);
                                let input = prompt(`Rename ${currentKey}:`);
                                if (input != null) {
                                        let playlist = localStorage.getItem(currentKey);
                                        localStorage.removeItem(currentKey);
                                        localStorage.setItem(input, playlist);
                                        playlist.textContent = input;
                                        location.reload();
                                }
                        })
                        playlist.textContent = localStorage.key(i);
                        playlist.append(renameButton);
                        playlist.append(deleteButton);
                        playlistDisplay.appendChild(playlist);
                }
        }
}
