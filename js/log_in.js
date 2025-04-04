import { getUserDataByEmail } from './firebase.js';

/**
 * This function automatically fills the login form fields with predefined values for testing or demonstration purposes.
 */
function autoFillFields() {
    const email = "SofiaMueller@gmail.com";
    const password = "MyPassword12345";
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
}

/**
 * This function toggles the visibility of a password input field and updates the corresponding icon.
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the visibility icon.
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
 * This function updates the password visibility icon based on whether the input field contains text.
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the visibility icon.
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0 && inputField.type === "password") {
        imgElement.src = "../assets/img/eye_closed.png";
    } else if (inputField.value.length === 0 && inputField.type === "password") {
        imgElement.src = "../assets/img/lock.png";
    } else if (inputField.type === "text") {
        imgElement.src = "../assets/img/eye.png";
    }
}

/**
 * This function handles the normal login process, verifies user credentials, 
 * and redirects the user upon successful authentication.
 * @param {Event} event - The event object to prevent default form submission.
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
 * This function handles the guest login, allowing access without authentication.
 * @param {Event} event - The event object to prevent default form submission.
 */
function guestLogin(event) {
    event.preventDefault();
    localStorage.setItem("isGuest", "true");
    window.location.href = '../html/summary.html';
}

/**
 * This function restores saved credentials if the "Remember Me" option was previously selected.
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

// Add event listeners after the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const togglePasswordImg = document.querySelector('.toggle-password');
    let firstFocus = true;

    document.getElementById('email').addEventListener('click', autoFillFields);

    passwordInput.addEventListener('focus', () => {
        if (firstFocus) {
            togglePasswordImg.src = "../assets/img/eye_closed.png";
            firstFocus = false;
        }
    });

    passwordInput.addEventListener('input', () => updatePasswordIcon('password', togglePasswordImg));

    passwordInput.addEventListener('blur', () => {
        updatePasswordIcon('password', togglePasswordImg);
    });

    togglePasswordImg.addEventListener('click', () => {
        togglePasswordVisibility('password', togglePasswordImg);
        updatePasswordIcon('password', togglePasswordImg); // Update icon after toggle
    });

    document.getElementById('loginButton').addEventListener('click', normalLogin);
    document.getElementById('guestLoginButton').addEventListener('click', guestLogin);

    // Weiterleitung für die Sign-up Buttons
    const signupBtn = document.querySelector('.signup-btn');
    const signupBtn1 = document.querySelector('.signup-btn1');
    
    signupBtn.addEventListener('click', () => {
        window.location.href = '../html/sign_up.html'; // Weiterleitung zur Sign-Up-Seite
    });
    
    signupBtn1.addEventListener('click', () => {
        window.location.href = '../html/sign_up.html'; // Weiterleitung zur Sign-Up-Seite
    });

    restoreLogin();
});
