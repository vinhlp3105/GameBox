const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

const gamesGrid = document.getElementById("gamesGrid");

async function loadGames() {
try {
const url =
"https://api.rawg.io/api/games?key=" +
RAWG_API_KEY +
"&page_size=24&ordering=-rating";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("RAWG API error: " + response.status);
    }

    const data = await response.json();

    gamesGrid.innerHTML = "";

    data.results.forEach(function (game) {
        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML =
            '<img src="' + (game.background_image || "") + '" alt="' + game.name + '">' +
            '<div class="game-info">' +
                '<h3>' + game.name + '</h3>' +
                '<p>⭐ ' + (game.rating || "N/A") + '</p>' +
                '<button onclick="viewGame(' + game.id + ')">View Detail</button>' +
            '</div>';

        gamesGrid.appendChild(card);
    });

} catch (error) {
    console.error(error);

    if (gamesGrid) {
        gamesGrid.innerHTML = "<p>Failed to load games.</p>";
    }
}

}

function viewGame(gameId) {
window.location.href = "game-detail.html?id=" + gameId;
}

loadGames();