const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;

        authMessage.textContent = "Creating account...";

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            authMessage.textContent = error.message;
            return;
        }

        if (data.user && !data.session) {
            authMessage.textContent =
                "Account created! Please check your email to confirm your account.";
            return;
        }

        authMessage.textContent = "Account created successfully!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        authMessage.textContent = "Logging in...";

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            authMessage.textContent = error.message;
            return;
        }

        authMessage.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    });
}