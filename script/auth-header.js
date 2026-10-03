const authButtons =
document.getElementById("authButtons");

function updateAuthHeader() {

if (!authButtons) {
    return;
}

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "gamebox_current_user"
        ) || "null"
    );

if (currentUser) {

    authButtons.innerHTML = `
        <div class="user-account">

            <span class="user-email">
                👤 ${currentUser.username}
            </span>

            <button
                class="auth-btn logout-btn"
                id="logoutBtn"
            >
                Logout
            </button>

        </div>
    `;

    const logoutBtn =
        document.getElementById("logoutBtn");

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "gamebox_current_user"
            );

            window.location.reload();
        }
    );

} else {

    authButtons.innerHTML = `
        <a
            href="login.html"
            class="auth-btn login-btn"
        >
            Sign In
        </a>

        <a
            href="register.html"
            class="auth-btn register-btn"
        >
            Sign Up
        </a>
    `;
}

}

updateAuthHeader();