import { getUserDataByEmail } from './firebase.js';

/**
 * This function automatically fills the login form fields...
 */
function autoFillFields() {
    const email = "SofiaMueller@gmail.com";
    const password = "MyPassword12345";
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
}

/**
 * This function toggles the visibility of a password input field...
 */
function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === "text";

    if (isPasswordVisible) {
        inputField.type = "password";
        imgElement.src = "../assets/img/eye_closed.png";
    } else {
        inputField.type = "text";
        imgElement.src = "../assets/img/eye.png";
    }
}

/**
 * This function updates the password visibility icon...
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        imgElement.src = "../assets/img/eye_closed.png";
    } else {
        imgElement.src = "../assets/img/lock.png";
    }
}

/**
 * This function handles the normal login.
 */
async function normalLogin(event) {
    event.preventDefault();

    console.log("normalLogin function called!");

    const rememberMe = document.getElementById("rememberMe").checked;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Email:", email, "Password:", password, "Remember Me:", rememberMe);

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        console.log("Calling getUserDataByEmail...");
        const userData = await getUserDataByEmail(email);
        console.log("getUserDataByEmail returned:", userData);

        if (userData) {
            if (password === document.getElementById("password").value) {
                console.log("Password matches (INSECURE CHECK)!");
                localStorage.setItem("loggedInUserName", userData.name);
                localStorage.setItem("isGuest", "false");
                if (rememberMe) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("password", password);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("password");
                    localStorage.setItem("rememberMe", "false");
                }
                window.location.href = '../html/summary.html';
            } else {
                alert("Incorrect password.");
            }
        } else {
            alert("User not found. Please sign up.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
    }
}

/**
 * This function handles the guest login.
 */
function guestLogin(event) {
    event.preventDefault();
    localStorage.setItem("isGuest", "true");
    window.location.href = '../html/summary.html';
}

/**
 * This function restores the saved credentials...
 */
function restoreLogin() {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) {
        document.getElementById("email").value = email;
        document.getElementById("password").value = password;
    }

    if (rememberMe) {
        document.getElementById("rememberMe").checked = true;
    }
}

// Add event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').addEventListener('click', autoFillFields);
    document.getElementById('password').addEventListener('input', () => updatePasswordIcon('password', document.querySelector('#password + img')));
    document.getElementById('password').addEventListener('blur', () => {
        const passwordImg = document.querySelector('#password + img');
        if (passwordImg) {
            updatePasswordIcon('password', passwordImg);
        }
    });
    document.querySelector('.toggle-password').addEventListener('click', () => togglePasswordVisibility('password', document.querySelector('.toggle-password')));
    document.getElementById('loginButton').addEventListener('click', normalLogin);
    document.getElementById('guestLoginButton').addEventListener('click', guestLogin);

    restoreLogin();
});