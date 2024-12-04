

window.addEventListener('load', () => {
    const numPlaylists = document.getElementById("num_playlists") // The text for the number of playlists
    const playlistDisplay = document.getElementById("playlist_UL")
    numPlaylists.textContent = localStorage.length - 1
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
});