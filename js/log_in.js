import { getUserDataByEmail } from './firebase.js';

/**
 * Displays a field-specific error message below the input field.
 * @param {string} fieldId - The ID of the field (e.g., "email", "password").
 * @param {string} message - The message to show.
 */
function showFieldError(fieldId, message) {
    const el = document.getElementById(`${fieldId}-error`);
    if (el) {
        el.textContent = message;
        el.classList.remove("d_none");
    }
}

/**
 * Hides all field-specific error messages.
 */
function hideFieldErrors() {
    ["email-error", "password-error"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = "";
            el.classList.add("d_none");
        }
    });
}

/**
 * Fills email and password fields with demo values for testing.
 */
function autoFillFields() {
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
}

/**
 * Toggles password visibility and updates the eye icon accordingly.
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element for the icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
    const input = document.getElementById(inputId);
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    imgElement.src = isVisible ? "/assets/img/eye_closed.png" : "/assets/img/eye.png";
}

/**
 * Updates the password field icon depending on visibility and value.
 * @param {string} inputId - ID of the password field.
 * @param {HTMLImageElement} imgElement - The icon image element.
 */
function updatePasswordIcon(inputId, imgElement) {
    const input = document.getElementById(inputId);
    if (input.type === "text") {
        imgElement.src = "/assets/img/eye.png";
    } else if (input.value.length === 0) {
        imgElement.src = "/assets/img/lock.png";
    } else {
        imgElement.src = "/assets/img/eye_closed.png";
    }
}

/**
 * Logs the user in with credentials and optionally remembers them.
 * @param {Event} [event] - The event object from the form/button.
 */
async function normalLogin(event = null) {
    if (event) event.preventDefault();
    hideFieldErrors();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!email || !password) {
        if (!email) showFieldError("email", "Email is required.");
        if (!password) showFieldError("password", "Password is required.");
        return;
    }

    try {
        const userData = await getUserDataByEmail(email);
        if (!userData) {
            showFieldError("email", "User not found.");
            return;
        }

        if (userData.password !== password) {
            showFieldError("password", "Incorrect password.");
            return;
        }

        localStorage.setItem("email", email);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("loggedInUserName", userData.name);
        localStorage.setItem("isGuest", "false");

        if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("savedEmail", email);
            localStorage.setItem("savedPassword", password);
        } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
        }

        window.location.href = "/html/summary.html";

    } catch (err) {
        console.error("Login failed:", err);
        showFieldError("email", "Login failed. Please try again.");
    }
}

/**
 * Logs in as a guest with predefined credentials.
 */
function guestLogin() {
    hideFieldErrors();
    localStorage.setItem("email", "guest@example.com");
    localStorage.setItem("userId", "guest_user");
    localStorage.setItem("loggedInUserName", "Guest");
    localStorage.setItem("isGuest", "true");
    window.location.href = "/html/summary.html";
}

/**
 * Restores the saved login credentials if "Remember Me" was used.
 */
function restoreLogin() {
    const remember = localStorage.getItem("rememberMe") === "true";
    const email = localStorage.getItem("savedEmail");
    const password = localStorage.getItem("savedPassword");

    if (remember && email && password) {
        document.getElementById("email").value = email;
        document.getElementById("password").value = password;
        document.getElementById("rememberMe").checked = true;
    }
}

/**
 * Initializes all event listeners after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePasswordImg = document.querySelector(".toggle-password");

    
    document.getElementById("email").addEventListener("click", autoFillFields);

   
    let firstFocus = true;
    passwordInput.addEventListener("focus", () => {
        if (firstFocus) {
            togglePasswordImg.src = "/assets/img/eye_closed.png";
            firstFocus = false;
        }
    });

    passwordInput.addEventListener("input", () => updatePasswordIcon("password", togglePasswordImg));
    passwordInput.addEventListener("blur", () => updatePasswordIcon("password", togglePasswordImg));

    togglePasswordImg.addEventListener("click", () => {
        togglePasswordVisibility("password", togglePasswordImg);
        updatePasswordIcon("password", togglePasswordImg);
    });

    
    document.getElementById("loginButton").addEventListener("click", normalLogin);
    document.getElementById("guestLoginButton").addEventListener("click", guestLogin);

    const signupBtn = document.querySelector(".signup-btn");
    const signupBtn1 = document.querySelector(".signup-btn1");
    if (signupBtn) signupBtn.addEventListener("click", () => window.location.href = "/html/sign_up.html");
    if (signupBtn1) signupBtn1.addEventListener("click", () => window.location.href = "/html/sign_up.html");

    
    restoreLogin();
});
