const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

const gameImage = document.getElementById("gameImage");
const gameName = document.getElementById("gameName");
const gameRating = document.getElementById("gameRating");
const gameRelease = document.getElementById("gameRelease");
const gamePlatforms = document.getElementById("gamePlatforms");
const gameGenres = document.getElementById("gameGenres");
const gameDescription = document.getElementById("gameDescription");

const gameDeveloper = document.getElementById("gameDeveloper");
const gamePublisher = document.getElementById("gamePublisher");
const gameReleaseInfo = document.getElementById("gameReleaseInfo");
const gameMetacritic = document.getElementById("gameMetacritic");

const gameAbout = document.getElementById("gameAbout");

const screenshotsGrid = document.getElementById("screenshotsGrid");
const similarGames = document.getElementById("similarGames");

const favoriteBtn = document.getElementById("favoriteBtn");
const trailerBtn = document.getElementById("trailerBtn");

let currentGame = null;

async function loadGame() {

if (!gameId) {
    showError("Game not found.");
    return;
}

try {

    const response = await fetch(
        "https://api.rawg.io/api/games/" +
        gameId +
        "?key=" +
        RAWG_API_KEY
    );

    if (!response.ok) {
        throw new Error(
            "RAWG API error: " + response.status
        );
    }

    const game = await response.json();

    currentGame = game;

    displayGame(game);

    loadScreenshots(game.id);

    loadSimilarGames(game.id, game.genres);

    setupFavorite(game);

} catch (error) {

    console.error(error);

    showError(
        "Failed to load game information."
    );
}

}

function displayGame(game) {

document.title =
    "GameHub - " + game.name;

gameName.textContent =
    game.name || "Unknown Game";

gameImage.src =
    game.background_image || "";

gameImage.alt =
    game.name || "Game";

gameRating.textContent =
    game.rating || "N/A";

gameRelease.textContent =
    game.released || "N/A";

gameReleaseInfo.textContent =
    game.released || "N/A";

if (game.platforms && game.platforms.length > 0) {

    gamePlatforms.textContent =
        game.platforms
            .map(function (item) {
                return item.platform.name;
            })
            .join(" • ");

} else {

    gamePlatforms.textContent =
        "N/A";
}

gameGenres.innerHTML = "";

if (game.genres && game.genres.length > 0) {

    game.genres.forEach(function (genre) {

        const tag =
            document.createElement("span");

        tag.className =
            "genre-tag";

        tag.textContent =
            genre.name;

        gameGenres.appendChild(tag);
    });

}

const description =
    cleanDescription(
        game.description_raw ||
        game.description ||
        "No description available."
    );

gameDescription.textContent =
    shortenText(description, 300);

gameAbout.textContent =
    description;

if (
    game.developers &&
    game.developers.length > 0
) {

    gameDeveloper.textContent =
        game.developers
            .map(function (developer) {
                return developer.name;
            })
            .join(", ");

} else {

    gameDeveloper.textContent =
        "N/A";
}

if (
    game.publishers &&
    game.publishers.length > 0
) {

    gamePublisher.textContent =
        game.publishers
            .map(function (publisher) {
                return publisher.name;
            })
            .join(", ");

} else {

    gamePublisher.textContent =
        "N/A";
}

gameMetacritic.textContent =
    game.metacritic || "N/A";

if (
    game.website &&
    game.website.trim() !== ""
) {

    const websiteButton =
        document.createElement("a");

    websiteButton.href =
        game.website;

    websiteButton.target =
        "_blank";

    websiteButton.className =
        "trailer-btn";

    websiteButton.textContent =
        "Official Website";

    document
        .querySelector(".detail-buttons")
        .appendChild(websiteButton);
}

}

async function loadScreenshots(id) {

screenshotsGrid.innerHTML =
    "<p>Loading screenshots...</p>";

try {

    const response = await fetch(
        "https://api.rawg.io/api/games/" +
        id +
        "/screenshots?key=" +
        RAWG_API_KEY +
        "&page_size=8"
    );

    if (!response.ok) {
        throw new Error(
            "Screenshot API error"
        );
    }

    const data =
        await response.json();

    screenshotsGrid.innerHTML = "";

    if (
        !data.results ||
        data.results.length === 0
    ) {

        screenshotsGrid.innerHTML =
            "<p>No screenshots available.</p>";

        return;
    }

    data.results.forEach(function (screenshot) {

        const item =
            document.createElement("div");

        item.className =
            "screenshot-item";

        const image =
            document.createElement("img");

        image.src =
            screenshot.image;

        image.alt =
            "Game screenshot";

        image.loading =
            "lazy";

        item.appendChild(image);

        screenshotsGrid.appendChild(item);
    });

} catch (error) {

    console.error(error);

    screenshotsGrid.innerHTML =
        "<p>Failed to load screenshots.</p>";
}

}

async function loadSimilarGames(id, genres) {

similarGames.innerHTML =
    "<p>Loading games...</p>";

try {

    let genreSlug = "";

    if (
        genres &&
        genres.length > 0
    ) {

        genreSlug =
            genres[0].slug;
    }

    let url =
        "https://api.rawg.io/api/games?key=" +
        RAWG_API_KEY +
        "&page_size=4" +
        "&ordering=-rating" +
        "&exclude=" +
        id;

    if (genreSlug) {

        url +=
            "&genres=" +
            encodeURIComponent(genreSlug);
    }

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Similar games API error"
        );
    }

    const data =
        await response.json();

    similarGames.innerHTML = "";

    if (
        !data.results ||
        data.results.length === 0
    ) {

        similarGames.innerHTML =
            "<p>No similar games found.</p>";

        return;
    }

    data.results.forEach(function (game) {

        const card =
            document.createElement("div");

        card.className =
            "similar-game-card";

        card.innerHTML =
            '<img src="' +
            (game.background_image || "") +
            '" alt="' +
            game.name +
            '">' +

            '<div class="similar-game-info">' +

            '<h3>' +
            game.name +
            '</h3>' +

            '<p>⭐ ' +
            (game.rating || "N/A") +
            '</p>' +

            '</div>';

        card.addEventListener(
            "click",
            function () {

                window.location.href =
                    "game-detail.html?id=" +
                    game.id;
            }
        );

        similarGames.appendChild(card);
    });

} catch (error) {

    console.error(error);

    similarGames.innerHTML =
        "<p>Failed to load similar games.</p>";
}

}

async function loadTrailer(id) {

try {

    const response =
        await fetch(
            "https://api.rawg.io/api/games/" +
            id +
            "/movies?key=" +
            RAWG_API_KEY
        );

    if (!response.ok) {
        return;
    }

    const data =
        await response.json();

    if (
        data.results &&
        data.results.length > 0
    ) {

        const movie =
            data.results[0];

        let trailerUrl = "";

        if (movie.data) {

            trailerUrl =
                movie.data.max ||
                movie.data["480"] ||
                movie.data["720"] ||
                "";
        }

        if (
            !trailerUrl &&
            movie.external
        ) {

            trailerUrl =
                movie.external;
        }

        if (trailerUrl) {

            trailerBtn.href =
                trailerUrl;

            trailerBtn.style.display =
                "inline-block";
        }
    }

} catch (error) {

    console.error(
        "Trailer error:",
        error
    );
}

}

function setupFavorite(game) {

const favorites =
    JSON.parse(
        localStorage.getItem(
            "gamebox_favorites"
        ) || "[]"
    );

const isFavorite =
    favorites.some(function (item) {
        return item.id === game.id;
    });

updateFavoriteButton(isFavorite);

favoriteBtn.addEventListener(
    "click",
    function () {

        toggleFavorite(game);
    }
);

}

function toggleFavorite(game) {

let favorites =
    JSON.parse(
        localStorage.getItem(
            "gamebox_favorites"
        ) || "[]"
    );

const index =
    favorites.findIndex(function (item) {
        return item.id === game.id;
    });

if (index === -1) {

    favorites.push({
        id: game.id,
        name: game.name,
        image: game.background_image,
        rating: game.rating
    });

    localStorage.setItem(
        "gamebox_favorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButton(true);

} else {

    favorites.splice(index, 1);

    localStorage.setItem(
        "gamebox_favorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButton(false);
}

}

function updateFavoriteButton(isFavorite) {

if (isFavorite) {

    favoriteBtn.textContent =
        "♥ Added to Favorites";

    favoriteBtn.classList.add(
        "active"
    );

} else {

    favoriteBtn.textContent =
        "♡ Add to Favorites";

    favoriteBtn.classList.remove(
        "active"
    );
}

}

function cleanDescription(text) {

const div =
    document.createElement("div");

div.innerHTML =
    text;

return div.textContent ||
    div.innerText ||
    "";

}

function shortenText(text, maxLength) {

if (text.length <= maxLength) {
    return text;
}

return text.substring(
    0,
    maxLength
) + "...";

}

function showError(message) {

gameName.textContent =
    "Game Not Found";

gameDescription.textContent =
    message;

gameAbout.textContent =
    message;

}

loadGame();

if (gameId) {
loadTrailer(gameId);
}