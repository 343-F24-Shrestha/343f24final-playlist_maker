

window.addEventListener('load', () => {
    const numPlaylists = document.getElementById("num_playlists") // The text for the number of playlists
    const playlistDisplay = document.getElementById("playlist_UL")
    const userDisplay = document.getElementById("username")
    let numPlaylistsNum = 0;
    numPlaylists.textContent = localStorage.length - 2
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes("playlist_")) {
                if(localStorage.key(i) != "debug") {
                        const playlist = document.createElement("li");
                        playlist.style.color = "white";
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
                numPlaylistsNum++;
        }
}
numPlaylists.textContent = numPlaylistsNum;
});
