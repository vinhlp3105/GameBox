// ================================
// GAME DETAIL
// ================================

// GIU NGUYEN API KEY CU CUA BAN
const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

const API_URL = "https://api.rawg.io/api/games";


// ================================
// LAY GAME ID TU URL
// ================================

const urlParams = new URLSearchParams(
    window.location.search
);

const gameId = urlParams.get("id");


// ================================
// LAY CAC PHAN TU HTML
// ================================

const loading = document.getElementById("loading");
const gameContent = document.getElementById("gameContent");

const gameImage = document.getElementById("gameImage");
const gameTitle = document.getElementById("gameTitle");

const gameRating = document.getElementById("gameRating");
const gameMetacritic = document.getElementById("gameMetacritic");

const gameGenres = document.getElementById("gameGenres");
const gameRelease = document.getElementById("gameRelease");

const gameDeveloper = document.getElementById("gameDeveloper");
const gamePublisher = document.getElementById("gamePublisher");

const gamePlatforms = document.getElementById("gamePlatforms");

const gameDescription =
    document.getElementById("gameDescription");

const gameWebsite =
    document.getElementById("gameWebsite");


// ================================
// XOA HTML TRONG MO TA
// ================================

function cleanDescription(text) {

    if (!text) {
        return "No description available.";
    }

    const temp = document.createElement("div");

    temp.innerHTML = text;

    return temp.textContent || temp.innerText || "";
}


// ================================
// LAY TEN THE LOAI
// ================================

function getGenres(game) {

    if (!game.genres || game.genres.length === 0) {
        return "N/A";
    }

    return game.genres
        .map(genre => genre.name)
        .join(", ");
}


// ================================
// LAY TEN DEVELOPER
// ================================

function getDevelopers(game) {

    if (
        !game.developers ||
        game.developers.length === 0
    ) {
        return "N/A";
    }

    return game.developers
        .map(developer => developer.name)
        .join(", ");
}


// ================================
// LAY TEN PUBLISHER
// ================================

function getPublishers(game) {

    if (
        !game.publishers ||
        game.publishers.length === 0
    ) {
        return "N/A";
    }

    return game.publishers
        .map(publisher => publisher.name)
        .join(", ");
}


// ================================
// LAY TEN PLATFORM
// ================================

function getPlatforms(game) {

    if (
        !game.platforms ||
        game.platforms.length === 0
    ) {
        return "N/A";
    }

    return game.platforms
        .map(item => item.platform.name)
        .join(", ");
}


// ================================
// HIEN THI THONG TIN GAME
// ================================

function displayGame(game) {

    loading.style.display = "none";

    gameContent.style.display = "grid";


    // Anh game
    gameImage.src =
        game.background_image ||
        "https://via.placeholder.com/1200x700?text=No+Image";

    gameImage.alt = game.name;


    // Ten game
    gameTitle.textContent = game.name;


    // Rating
    gameRating.textContent =
        `⭐ ${game.rating || "N/A"}`;


    // Metacritic
    gameMetacritic.textContent =
        `Metacritic: ${game.metacritic || "N/A"}`;


    // Genre
    gameGenres.textContent =
        getGenres(game);


    // Ngay phat hanh
    gameRelease.textContent =
        game.released || "N/A";


    // Developer
    gameDeveloper.textContent =
        getDevelopers(game);


    // Publisher
    gamePublisher.textContent =
        getPublishers(game);


    // Platform
    gamePlatforms.textContent =
        getPlatforms(game);


    // Mo ta
    gameDescription.textContent =
        cleanDescription(game.description);


    // Website
    if (game.website) {

        gameWebsite.href =
            game.website;

        gameWebsite.style.display =
            "inline-block";

    } else {

        gameWebsite.style.display =
            "none";
    }


    // Doi ten tab trinh duyet
    document.title =
        `${game.name} - GameHub`;
}


// ================================
// TAI GAME TU RAWG
// ================================

async function loadGame() {

    if (!gameId) {

        loading.textContent =
            "Khong tim thay game.";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${gameId}?key=${RAWG_API_KEY}`
        );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        const game = await response.json();

        displayGame(game);


    } catch (error) {

        console.error(
            "Loi khi tai game:",
            error
        );

        loading.textContent =
            "Khong the tai thong tin game.";
    }
}


// ================================
// BAT DAU
// ================================

document.addEventListener(
    "DOMContentLoaded",
    loadGame
);