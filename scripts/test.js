// Event listener for when the DOM is loaded to handle the spotify authentication
document.getElementById("login").addEventListener('click', () => {
    handleSpotifyAuth();
});

// Gets the access token from the url 
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
}

// Handles if a token is present, else it gives the work to authorize the credentials
function handleSpotifyAuth() {
    const token = getAccessTokenFromUrl();
    if (token) {
        window.location.hash = ""; 
        localStorage.setItem("spotify_access_token", token);
        console.log(token);
    } else {
        authorizeSpotify();
    }
}

// Authorizes access to Spotify APi with clientID and the redirect URI
function authorizeSpotify() {
    const clientId = "61e27c75288442e492a4585b195b1750";
    const redirectUri = "http://127.0.0.1:5500/profile.html";
    // Defines the scopes for access to the Spotify API
    const scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-public",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(
        clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
        scopes.join(" ")
    )}`;
    window.location.href = authUrl;
}