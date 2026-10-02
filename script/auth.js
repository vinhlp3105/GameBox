const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");

if (registerForm) {
registerForm.addEventListener("submit", async function(event) {
event.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    authMessage.textContent = "Creating account...";

    const result = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (result.error) {
        authMessage.textContent = result.error.message;
        return;
    }

    if (result.data.user && !result.data.session) {
        authMessage.textContent =
            "Account created! Please check your email to confirm your account.";
        return;
    }

    authMessage.textContent = "Account created successfully!";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
});

}

if (loginForm) {
loginForm.addEventListener("submit", async function(event) {
event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    authMessage.textContent = "Logging in...";

    const result = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (result.error) {
        authMessage.textContent = result.error.message;
        return;
    }

    authMessage.textContent = "Login successful!";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 700);
});

}