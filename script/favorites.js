const favoritesGrid =
document.getElementById("favoritesGrid");

function getFavoritesKey() {

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "gamebox_current_user"
        ) || "null"
    );

if (!currentUser || !currentUser.email) {
    return null;
}

return "gamebox_favorites_" +
    currentUser.email;

}

function loadFavorites() {

const favoritesKey =
    getFavoritesKey();

favoritesGrid.innerHTML = "";

if (!favoritesKey) {

    favoritesGrid.innerHTML = `
        <div class="empty-favorites">
            <h2>Please Sign In</h2>

            <p>
                Sign in to see and manage your favorite games.
            </p>

            <a href="login.html">
                Sign In
            </a>
        </div>
    `;

    return;
}

const favorites =
    JSON.parse(
        localStorage.getItem(
            favoritesKey
        ) || "[]"
    );

if (favorites.length === 0) {

    favoritesGrid.innerHTML = `
        <div class="empty-favorites">
            <h2>No favorite games yet</h2>

            <p>
                Add games to your favorites from the game detail page.
            </p>

            <a href="game.html">
                Browse Games
            </a>
        </div>
    `;

    return;
}

favorites.forEach(function (game) {

    const card =
        document.createElement("div");

    card.className =
        "favorite-card";

    card.innerHTML = `
        <img
            src="${game.image || ""}"
            alt="${game.name || "Game"}"
        >

        <div class="favorite-info">

            <h3>
                ${game.name || "Unknown Game"}
            </h3>

            <p class="favorite-rating">
                ⭐ ${game.rating || "N/A"}
            </p>

            <div class="favorite-actions">

                <button
                    class="view-favorite-btn"
                    onclick="viewGame(${game.id})"
                >
                    View Detail
                </button>

                <button
                    class="remove-favorite-btn"
                    onclick="removeFavorite(${game.id})"
                >
                    Remove
                </button>

            </div>

        </div>
    `;

    favoritesGrid.appendChild(card);
});

}

function viewGame(gameId) {

window.location.href =
    "game-detail.html?id=" +
    gameId;

}

function removeFavorite(gameId) {

const favoritesKey =
    getFavoritesKey();

if (!favoritesKey) {
    window.location.href =
        "login.html";
    return;
}

let favorites =
    JSON.parse(
        localStorage.getItem(
            favoritesKey
        ) || "[]"
    );

favorites =
    favorites.filter(function (game) {
        return game.id !== gameId;
    });

localStorage.setItem(
    favoritesKey,
    JSON.stringify(favorites)
);

loadFavorites();

}

loadFavorites();