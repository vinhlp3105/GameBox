const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");

function getUsers() {
return JSON.parse(localStorage.getItem("gamebox_users") || "[]");
}

function saveUsers(users) {
localStorage.setItem("gamebox_users", JSON.stringify(users));
}

if (registerForm) {
registerForm.addEventListener("submit", function (event) {
event.preventDefault();

    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (!username || !email || !password) {
        authMessage.textContent = "Please fill in all fields.";
        return;
    }

    if (password.length < 6) {
        authMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    const users = getUsers();

    const emailExists = users.some(function (user) {
        return user.email === email;
    });

    const usernameExists = users.some(function (user) {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    if (emailExists) {
        authMessage.textContent = "This email is already registered.";
        return;
    }

    if (usernameExists) {
        authMessage.textContent = "This username is already taken.";
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem("gamebox_current_user", JSON.stringify({
        username: username,
        email: email
    }));

    authMessage.textContent = "Account created successfully!";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 700);
});

}

if (loginForm) {
loginForm.addEventListener("submit", function (event) {
event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        authMessage.textContent = "Please enter your email and password.";
        return;
    }

    const users = getUsers();

    const user = users.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        authMessage.textContent = "Incorrect email or password.";
        return;
    }

    localStorage.setItem("gamebox_current_user", JSON.stringify({
        username: user.username,
        email: user.email
    }));

    authMessage.textContent = "Login successful!";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 700);
});}