const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const searchGames = document.getElementById("searchGames");
const resultTitle = document.getElementById("resultTitle");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

let currentPage = 1;
let currentSearch = "";

const gamesPerPage = 12;

async function searchGamesFromRAWG() {

if (currentSearch === "") {

    searchGames.innerHTML =
        '<p id="searchMessage">Enter a game name to search.</p>';

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    return;
}

searchGames.innerHTML =
    '<p id="searchMessage">Searching...</p>';

try {

    const url =
        "https://api.rawg.io/api/games?key=" +
        RAWG_API_KEY +
        "&search=" +
        encodeURIComponent(currentSearch) +
        "&page_size=" +
        gamesPerPage +
        "&page=" +
        currentPage;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "RAWG API error: " + response.status
        );
    }

    const data = await response.json();

    searchGames.innerHTML = "";

    resultTitle.textContent =
        'Results for "' + currentSearch + '"';

    if (!data.results || data.results.length === 0) {

        searchGames.innerHTML =
            '<p id="searchMessage">No games found.</p>';

        prevBtn.disabled = true;
        nextBtn.disabled = true;

        return;
    }

    data.results.forEach(function (game) {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML =
            '<img src="' +
            (game.background_image || "") +
            '" alt="' +
            game.name +
            '">' +

            '<div class="game-info">' +

            '<h3>' +
            game.name +
            '</h3>' +

            '<p>⭐ ' +
            (game.rating || "N/A") +
            '</p>' +

            '<button onclick="viewGame(' +
            game.id +
            ')">' +
            'View Detail' +
            '</button>' +

            '</div>';

        searchGames.appendChild(card);
    });

    pageNumber.textContent =
        "Page " + currentPage;

    prevBtn.disabled =
        currentPage === 1;

    nextBtn.disabled =
        !data.next;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

} catch (error) {

    console.error(error);

    searchGames.innerHTML =
        '<p id="searchMessage">Failed to search games. Please try again.</p>';

    prevBtn.disabled = true;
    nextBtn.disabled = true;
}

}

function startSearch() {

const value =
    searchInput.value.trim();

if (value === "") {
    return;
}

currentSearch = value;
currentPage = 1;

searchGamesFromRAWG();

}

searchBtn.addEventListener("click", function () {
startSearch();
});

searchInput.addEventListener("keydown", function (event) {

if (event.key === "Enter") {
    startSearch();
}

});

nextBtn.addEventListener("click", function () {

currentPage++;

searchGamesFromRAWG();

});

prevBtn.addEventListener("click", function () {

if (currentPage > 1) {

    currentPage--;

    searchGamesFromRAWG();
}

});

function viewGame(gameId) {

window.location.href =
    "game-detail.html?id=" + gameId;

}