const key = "19a0219f7af2d64ef945a24702924a8b";
const countries = ["Spain", "Germany", "United States", "Japan", "Finland", "Ghana"];

// Function that dynamically creates divs containing song lists for genres
async function loadPlaylists() {
    try {
        const premadeWrapper = document.getElementById("premade-wrapper");
        premadeWrapper.innerHTML = "";

        // Iterates through the countries in the array to create the elements themselves
        for (const country of countries) {
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${key}&format=json&limit=10`
            );
            const data = await response.json();
            const tracks = data.tracks?.track || [];
            // Lines of creating various html elements to eventually add to the page
            const albumDiv = document.createElement("div");
            albumDiv.classList.add("premade-playlist");
            const countryInfo = document.createElement("h3");
            const expandButton = document.createElement("button");
            expandButton.classList.add("expand");
            expandButton.type = "button";
            expandButton.textContent = "Expand";
            albumDiv.appendChild(expandButton);
            const addButton = document.createElement("button");
            addButton.type = "submit";
            addButton.textContent = "Add Playlist";
            albumDiv.appendChild(addButton);
            countryInfo.textContent = `Top Tracks in ${country}`;
            albumDiv.appendChild(countryInfo);
            const firstTrack = tracks[0];
            const trackInfo = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${firstTrack.artist.name}&track=${firstTrack.name}&api_key=${key}&format=json`
            );
            const trackResponse = await trackInfo.json();
            const imgResponse = trackResponse.track.album.image[3]["#text"]
            premadeWrapper.appendChild(albumDiv);

            // Event listener for the expand to expand the module for each countries
            expandButton.addEventListener("click", async () => {
                if (albumDiv.style.height === "150px") {
                    albumDiv.style.height = "475px";
                    // Add the background image only when expanded
                    albumDiv.style.backgroundImage = `url(${imgResponse}})`;
                    albumDiv.style.backgroundSize = "60%";
                    albumDiv.style.backgroundPosition = "center";
                    albumDiv.style.backgroundPositionY = "65%";
                    albumDiv.style.backgroundRepeat = "no-repeat";
                } else {
                    const genreDetails = albumDiv.querySelector(".genre-details");
                    if (genreDetails) {
                        albumDiv.removeChild(genreDetails);
                    }
                    albumDiv.style.height = "150px";
                    albumDiv.style.backgroundImage = "none";
                    albumDiv.style.color = "";
                    return;
                }

                const genreDetails = document.createElement("div");
                genreDetails.classList.add("genre-details");
                const trackList = document.createElement("ol");
                trackList.classList.add("track-list-list");
                trackList.innerHTML = "<strong>Top Tracks:</strong>";

                // Iterates through 5 tracks from the fetched country to add to the modules
                for (let i = 0; i < Math.min(5, tracks.length); i++) {
                    const trackItem = document.createElement("li");
                    trackItem.classList.add("track-list-item")
                    trackItem.textContent = `${tracks[i].name} by ${tracks[i].artist.name}`;
                    trackList.appendChild(trackItem);
                }

                genreDetails.appendChild(trackList);
                albumDiv.appendChild(genreDetails);
            });

            // Event listener to add the country playlist to the users localStorage
            addButton.addEventListener("click", () => {
                const playlistKey = `Top Tracks in ${country}`;
                const playlistData = {
                    name: `Top Tracks in ${country}`,
                    tracks: tracks.map(track => ({
                        name: track.name,
                        artist: track.artist.name,
                    }))
                };
                const existingPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
                existingPlaylists.push(playlistData);
                localStorage.setItem(playlistKey, JSON.stringify(existingPlaylists));
                alert(`Succesfully Added: Top Tracks in ${country}`);
            });
        }
    } catch (error) {
        console.error(`Error raised by premade playlists: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists();
});
