import { getUserDataByEmail } from './firebase.js';

/**
 * Shows an error message visually in the user interface by updating the text content
 * and removing the 'd_none' class of the designated error message element.
 * @param {string} message - The error message string to be displayed to the user.
 */
function showError(message) {
    const errorBox = document.getElementById("error-message");
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove("d_none");
    }
}

/**
 * Hides the visual error message by clearing the text content and adding the 'd_none'
 * class back to the designated error message element, effectively making it invisible.
 */
function hideError() {
    const errorBox = document.getElementById("error-message");
    if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.add("d_none");
    }
}

/**
 * Automatically fills the email and password input fields with predefined values.
 * This function is primarily intended for testing and development purposes to quickly
 * populate the login form.
 */
function autoFillFields() {
    const email = "SofiaMueller@gmail.com";
    const password = "MyPassword12345";
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
}

/**
 * Toggles the visibility of the text in a password input field. When called, it switches
 * the 'type' attribute of the input field between 'password' (obscured) and 'text' (visible).
 * It also updates the source of the associated image element to reflect the current visibility state.
 * @param {string} inputId - The ID of the password input field whose visibility is to be toggled.
 * @param {HTMLImageElement} imgElement - The image element that serves as the toggle control.
 * Its 'src' attribute is updated to 'eye.png' (visible) or
 * 'eye_closed.png' (obscured).
 */
function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === "text";

    if (isPasswordVisible) {
        inputField.type = "password";
        imgElement.src = "/assets/img/eye_closed.png";
    } else {
        inputField.type = "text";
        imgElement.src = "/assets/img/eye.png";
    }
}

/**
 * Updates the visual icon associated with a password input field to indicate whether the
 * field is currently displaying obscured text (password type) or visible text (text type).
 * When the input field has content and is of type 'password', the icon is set to 'eye_closed.png'.
 * If the input field is empty and of type 'password', the icon is set back to 'lock.png'.
 * If the input field is of type 'text', the icon is set to 'eye.png'.
 * @param {string} inputId - The ID of the password input field being observed.
 * @param {HTMLImageElement} imgElement - The image element that visually represents the password visibility.
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0 && inputField.type === "password") {
        imgElement.src = "/assets/img/eye_closed.png";
    } else if (inputField.value.length === 0 && inputField.type === "password") {
        imgElement.src = "/assets/img/lock.png";
    } else if (inputField.type === "text") {
        imgElement.src = "/assets/img/eye.png";
    }
}

/**
 * Asynchronously handles the normal login submission. It prevents the default form submission,
 * hides any existing error messages, retrieves the entered email and password, and then
 * attempts to authenticate the user by querying Firebase for user data based on the email.
 * If a user is found and the entered password matches the stored (though this implementation
 * directly compares plain text, which is not secure for production), it stores the user's
 * name and login status in local storage and redirects the user to the summary page.
 * It also handles the 'remember me' functionality by storing or removing email and password
 * from local storage based on the checkbox state. If authentication fails (user not found or
 * incorrect password), it displays an appropriate error message.
 * @async
 * @param {Event} event - The submit event triggered by the login form.
 */
async function normalLogin(event) {
    event.preventDefault();
    hideError();

    const rememberMe = document.getElementById("rememberMe").checked;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showError("Please enter both email and password.");
        return;
    }

    try {
        const userData = await getUserDataByEmail(email);

        if (userData) {
            if (password === document.getElementById("password").value) {
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

                window.location.href = '/html/summary.html';
            } else {
                showError("Incorrect password.");
            }
        } else {
            showError("User not found. Please sign up.");
        }
    } catch (error) {
        showError("Login failed. Please try again.");
    }
}

/**
 * Handles the guest login action. It prevents the default action of the button click,
 * hides any visible error messages, sets a flag in local storage indicating that the
 * user is logged in as a guest, and then redirects the browser to the summary page.
 * @param {Event} event - The click event triggered by the guest login button.
 */
function guestLogin(event) {
    event.preventDefault();
    hideError();
    localStorage.setItem("isGuest", "true");
    window.location.href = '/html/summary.html';
}

/**
 * Restores the email and password in the login form from local storage if the user
 * had previously checked the "remember me" option. This function is typically called
 * when the page is loaded to provide a persistent login experience.
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

/**
 * Adds event listeners to various elements on the page once the DOM is fully loaded.
 * These listeners handle user interactions such as clicking the email field for autofill,
 * focusing and typing in the password field to update the visibility icon, clicking the
 * toggle password image to show/hide the password, and clicking the login and guest login buttons
 * to initiate the respective login processes. It also attaches listeners to the signup buttons
 * to navigate to the signup page and calls the `restoreLogin` function to check for and
 * restore any saved login credentials.
 */
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const togglePasswordImg = document.querySelector('.toggle-password');
    let firstFocus = true;

    /**
     * Event listener attached to the email input field. When the field is clicked,
     * the `autoFillFields` function is called to populate the email and password
     * fields with predefined testing values.
     */
    document.getElementById('email').addEventListener('click', autoFillFields);

    /**
     * Event listener attached to the password input field. When the field receives focus
     * for the first time after the page load, it sets the password visibility icon to
     * the 'eye_closed.png' to indicate that the password is initially hidden. The `firstFocus`
     * flag ensures this action is only performed once per page load.
     */
    passwordInput.addEventListener('focus', () => {
        if (firstFocus) {
            togglePasswordImg.src = "/assets/img/eye_closed.png";
            firstFocus = false;
        }
    });

    /**
     * Event listener attached to the password input field. Whenever the content of the
     * input field changes (on 'input' event), the `updatePasswordIcon` function is called
     * to adjust the visibility icon based on whether the field has content and its type.
     */
    passwordInput.addEventListener('input', () => updatePasswordIcon('password', togglePasswordImg));

    /**
     * Event listener attached to the password input field. When the field loses focus ('blur' event),
     * the `updatePasswordIcon` function is called to ensure the visibility icon reflects the
     * current state of the password field (e.g., showing a lock if the field is now empty and of password type).
     */
    passwordInput.addEventListener('blur', () => updatePasswordIcon('password', togglePasswordImg));

    /**
     * Event listener attached to the toggle password image. When clicked, it calls the
     * `togglePasswordVisibility` function to switch the visibility of the password text
     * and then updates the icon using `updatePasswordIcon` to reflect the new state.
     */
    togglePasswordImg.addEventListener('click', () => {
        togglePasswordVisibility('password', togglePasswordImg);
        updatePasswordIcon('password', togglePasswordImg);
    });

    /**
     * Event listener attached to the login button. When clicked, it triggers the `normalLogin`
     * function, which handles the user authentication process against Firebase.
     */
    document.getElementById('loginButton').addEventListener('click', normalLogin);

    /**
     * Event listener attached to the guest login button. When clicked, it calls the `guestLogin`
     * function, which sets the user as a guest in local storage and redirects to the summary page.
     */
    document.getElementById('guestLoginButton').addEventListener('click', guestLogin);

    const signupBtn = document.querySelector('.signup-btn');
    const signupBtn1 = document.querySelector('.signup-btn1');

    /**
     * Event listener attached to the primary signup button. When clicked, it navigates the
     * browser to the '/html/sign_up.html' page, allowing the user to create a new account.
     */
    signupBtn.addEventListener('click', () => {
        window.location.href = '/html/sign_up.html';
    });

    /**
     * Event listener attached to the secondary signup button (if it exists). When clicked,
     * it also navigates the browser to the '/html/sign_up.html' page.
     */
    signupBtn1.addEventListener('click', () => {
        window.location.href = '/html/sign_up.html';
    });

    /**
     * Calls the `restoreLogin` function when the DOM is loaded to check if there are any
     * saved login credentials in local storage and, if so, pre-fills the login form.
     */
    restoreLogin();
});