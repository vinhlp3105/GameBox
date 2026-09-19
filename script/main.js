// ================================
// GameHub - main.js
// ================================

// GIỮ NGUYÊN API KEY CŨ CỦA BẠN
const RAWG_API_KEY = "c27f4154b723451bbdb76e3c3d2a0ceb";

// ================================
// CẤU HÌNH
// ================================

const TOP_GAMES = [
    "Minecraft",
    "VALORANT",
    "Fortnite",
    "Grand Theft Auto V",
    "Roblox"
];

const API_URL = "https://api.rawg.io/api/games";

// ================================
// BIẾN
// ================================

let topGames = [];
let currentSlide = 0;
let autoSlide;

// ================================
// GỌI RAWG API
// ================================

async function getGame(gameName) {
    try {
        const response = await fetch(
            `${API_URL}?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=5`
        );

        if (!response.ok) {
            throw new Error("RAWG API lỗi");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        // Tìm game có tên gần giống nhất
        const exactGame = data.results.find(
            game => game.name.toLowerCase() === gameName.toLowerCase()
        );

        return exactGame || data.results[0];

    } catch (error) {
        console.error(`Không thể lấy ${gameName}:`, error);
        return null;
    }
}

// ================================
// LOAD TOP 5
// ================================

async function loadTopGames() {

    const container = document.getElementById("topGames");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Đang tải game...
        </div>
    `;

    const results = [];

    for (const gameName of TOP_GAMES) {
        const game = await getGame(gameName);

        if (game) {
            results.push(game);
        }
    }

    topGames = results;

    renderTopGames();
    setupHero();
}

// ================================
// HIỂN THỊ CARD TOP 5
// ================================

function renderTopGames() {

    const container = document.getElementById("topGames");

    if (!container) return;

    if (topGames.length === 0) {
        container.innerHTML = `
            <p class="loading">
                Không tải được dữ liệu game.
            </p>
        `;
        return;
    }

    container.innerHTML = "";

    topGames.forEach((game, index) => {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <img
                src="${game.background_image || "https://via.placeholder.com/600x350?text=No+Image"}"
                alt="${game.name}"
            >

            <div class="game-card-content">

                <h3>${game.name}</h3>

                <div class="game-card-info">
                    <span>⭐ ${game.rating ? game.rating.toFixed(1) : "N/A"}</span>
                    <span>${getGenres(game)}</span>
                </div>

            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `game-detail.html?id=${game.id}`;
        });

        container.appendChild(card);
    });
}

// ================================
// LẤY THỂ LOẠI
// ================================

function getGenres(game) {

    if (!game.genres || game.genres.length === 0) {
        return "Game";
    }

    return game.genres
        .slice(0, 2)
        .map(genre => genre.name)
        .join(" • ");
}

// ================================
// HERO
// ================================

function setupHero() {

    if (topGames.length === 0) return;

    currentSlide = 0;

    showHero(currentSlide);

    createDots();

    startAutoSlide();
}

// ================================
// HIỂN THỊ HERO
// ================================

function showHero(index) {

    if (topGames.length === 0) return;

    const game = topGames[index];

    const heroImage = document.getElementById("heroImage");
    const heroTitle = document.getElementById("heroTitle");
    const heroRating = document.getElementById("heroRating");
    const heroGenre = document.getElementById("heroGenre");
    const heroDescription = document.getElementById("heroDescription");

    if (heroImage) {
        heroImage.src =
            game.background_image ||
            "https://via.placeholder.com/1200x600?text=No+Image";
    }

    if (heroTitle) {
        heroTitle.textContent = game.name;
    }

    if (heroRating) {
        heroRating.textContent =
            `⭐ ${game.rating ? game.rating.toFixed(1) : "N/A"}`;
    }

    if (heroGenre) {
        heroGenre.textContent = getGenres(game);
    }

    if (heroDescription) {

        let description =
            game.name +
            " is a popular game available on GameHub.";

        heroDescription.textContent = description;
    }

    updateDots();
}

// ================================
// DOTS
// ================================

function createDots() {

    const dotsContainer = document.getElementById("dots");

    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    topGames.forEach((game, index) => {

        const dot = document.createElement("button");

        dot.className = "dot";

        if (index === currentSlide) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            currentSlide = index;
            showHero(currentSlide);
            restartAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });
}

function updateDots() {

    const dots = document.querySelectorAll("#dots .dot");

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentSlide
        );

    });
}

// ================================
// NEXT / PREVIOUS
// ================================

function nextSlide() {

    if (topGames.length === 0) return;

    currentSlide++;

    if (currentSlide >= topGames.length) {
        currentSlide = 0;
    }

    showHero(currentSlide);
    restartAutoSlide();
}

function previousSlide() {

    if (topGames.length === 0) return;

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = topGames.length - 1;
    }

    showHero(currentSlide);
    restartAutoSlide();
}

// ================================
// AUTO SLIDE
// ================================

function startAutoSlide() {

    clearInterval(autoSlide);

    autoSlide = setInterval(() => {

        currentSlide++;

        if (currentSlide >= topGames.length) {
            currentSlide = 0;
        }

        showHero(currentSlide);

    }, 10000);
}

function restartAutoSlide() {

    startAutoSlide();
}

// ================================
// CATEGORY
// ================================

async function loadCategory(category) {

    const container = document.getElementById("categoryGames");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Đang tải ${category}...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}?key=${RAWG_API_KEY}&genres=${category}&page_size=8`
        );

        if (!response.ok) {
            throw new Error("Không thể tải category");
        }

        const data = await response.json();

        container.innerHTML = "";

        if (!data.results || data.results.length === 0) {

            container.innerHTML = `
                <p class="loading">
                    Không tìm thấy game.
                </p>
            `;

            return;
        }

        data.results.forEach(game => {

            const card = document.createElement("div");

            card.className = "game-card";

            card.innerHTML = `
                <img
                    src="${game.background_image || "https://via.placeholder.com/600x350?text=No+Image"}"
                    alt="${game.name}"
                >

                <div class="game-card-content">

                    <h3>${game.name}</h3>

                    <div class="game-card-info">
                        <span>
                            ⭐ ${game.rating ? game.rating.toFixed(1) : "N/A"}
                        </span>

                        <span>
                            ${getGenres(game)}
                        </span>
                    </div>

                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `game-detail.html?id=${game.id}`;
            });

            container.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="loading">
                Có lỗi khi tải game.
            </p>
        `;
    }
}

// ================================
// GAME INFO
// ================================

function showGameInfo(game) {

    const genres = getGenres(game);

    alert(
        `${game.name}\n\n` +
        `⭐ Rating: ${game.rating || "N/A"}\n` +
        `🎮 Genre: ${genres}\n` +
        `📅 Release: ${game.released || "N/A"}`
    );
}

// ================================
// SEARCH
// ================================

function setupSearch() {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (!searchInput || !searchBtn) return;

    function searchGame() {

        const query = searchInput.value.trim();

        if (!query) {
            return;
        }

        window.location.href =
            `search.html?query=${encodeURIComponent(query)}`;
    }

    searchBtn.addEventListener("click", searchGame);

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            searchGame();
        }

    });
}

// ================================
// NÚT HERO
// ================================

function setupButtons() {

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const detailsBtn = document.getElementById("detailsBtn");

    if (nextBtn) {
        nextBtn.addEventListener("click", nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", previousSlide);
    }

    if (detailsBtn) {

        detailsBtn.addEventListener("click", () => {

            if (topGames.length === 0) return;

            showGameInfo(topGames[currentSlide]);

        });

    }
}

// ================================
// CATEGORY BUTTONS
// ================================

function setupCategories() {

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const category =
                button.dataset.category;

            if (category) {
                loadCategory(category);
            }

        });

    });

    // Load Action mặc định
    if (categoryButtons.length > 0) {

        categoryButtons[0].classList.add("active");

        const firstCategory =
            categoryButtons[0].dataset.category;

        if (firstCategory) {
            loadCategory(firstCategory);
        }
    }
}

// ================================
// KHỞI ĐỘNG WEBSITE
// ================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("GameHub đang khởi động...");

    setupSearch();
    setupButtons();
    setupCategories();

    loadTopGames();

});