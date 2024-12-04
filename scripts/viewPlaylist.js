const playlistDisplay = document.getElementById("playlist-list");
const exportButton = document.getElementById("exportButton");

// Iterates through all the playlists stored in localStorage
exportButton.addEventListener("click", () => {
        const playlists = {};
        for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key !== "access_token" && key !== "debug") {
                        playlists[key] = JSON.parse(localStorage.getItem(key) || "null");
                }
        }
        // Creates a new Blob containg all JSON-ified playlist informatio
        const exportBlob = new Blob([JSON.stringify(playlists, null, 2)], {
                type: "application/json",
        });
        // Creates an temporary object url/link to the new json file
        const url = URL.createObjectURL(exportBlob);
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.download = "playlists.json";
        // Appends the temporary link to the body of the document and autoclicks it to download the file
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
});

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
