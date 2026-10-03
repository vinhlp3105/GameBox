const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

const genres = [
{ name: "All", slug: "" },
{ name: "Action", slug: "action" },
{ name: "Adventure", slug: "adventure" },
{ name: "RPG", slug: "role-playing-games-rpg" },
{ name: "Shooter", slug: "shooter" },
{ name: "Strategy", slug: "strategy" },
{ name: "Sports", slug: "sports" },
{ name: "Racing", slug: "racing" },
{ name: "Simulation", slug: "simulation" },
{ name: "Puzzle", slug: "puzzle" },
{ name: "Platformer", slug: "platformer" },
{ name: "Arcade", slug: "arcade" },
{ name: "Indie", slug: "indie" },
{ name: "Massively Multiplayer", slug: "massively-multiplayer" }
];

const genreBar = document.getElementById("genreBar");
const genrePrev = document.getElementById("genrePrev");
const genreNext = document.getElementById("genreNext");

const categoryGames = document.getElementById("categoryGames");
const selectedGenre = document.getElementById("selectedGenre");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

let currentGenre = "";
let currentGenreName = "All Games";
let currentPage = 1;

const gamesPerPage = 12;

function createGenreButtons() {

genreBar.innerHTML = "";

genres.forEach(function (genre, index) {

    const button = document.createElement("button");

    button.className = "genre-button";

    if (index === 0) {
        button.classList.add("active");
    }

    button.textContent = genre.name;

    button.addEventListener("click", function () {

        document.querySelectorAll(".genre-button").forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentGenre = genre.slug;

        currentGenreName =
            genre.name === "All"
                ? "All Games"
                : genre.name + " Games";

        currentPage = 1;

        selectedGenre.textContent = currentGenreName;

        loadCategoryGames();
    });

    genreBar.appendChild(button);
});

}

async function loadCategoryGames() {

categoryGames.innerHTML =
    '<p id="loading">Loading games...</p>';

prevBtn.disabled = true;
nextBtn.disabled = true;

try {

    let url =
        "https://api.rawg.io/api/games?key=" +
        RAWG_API_KEY +
        "&page_size=" +
        gamesPerPage +
        "&page=" +
        currentPage +
        "&ordering=-rating";

    if (currentGenre !== "") {
        url += "&genres=" + currentGenre;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "RAWG API error: " + response.status
        );
    }

    const data = await response.json();

    categoryGames.innerHTML = "";

    if (!data.results || data.results.length === 0) {

        categoryGames.innerHTML =
            "<p>No games found.</p>";

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

        categoryGames.appendChild(card);
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

    categoryGames.innerHTML =
        "<p>Failed to load games. Please try again.</p>";
}

}

function viewGame(gameId) {

window.location.href =
    "game-detail.html?id=" + gameId;

}

nextBtn.addEventListener("click", function () {

currentPage++;

loadCategoryGames();

});

prevBtn.addEventListener("click", function () {

if (currentPage > 1) {

    currentPage--;

    loadCategoryGames();
}

});

genrePrev.addEventListener("click", function () {

genreBar.scrollBy({
    left: -350,
    behavior: "smooth"
});

});

genreNext.addEventListener("click", function () {

genreBar.scrollBy({
    left: 350,
    behavior: "smooth"
});

});

createGenreButtons();

loadCategoryGames();