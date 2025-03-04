/**
 * This function automatically fills the login form fields with predefined values when clicking in the e-mail field.
 * This function is primarily used for testing or demonstration purposes.
 */
function autoFillFields() {
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
}

/**
 * This function toggles the visibility of a password input field and updates the corresponding icon.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === 'text';

    if (isPasswordVisible) {
        inputField.type = 'password';
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        inputField.type = 'text';
        imgElement.src = '/assets/img/eye.png'; 
    }
}

/**
 * This function updates the password visibility icon based on the input field value.
 * If the field contains text, the closed-eye icon is shown- if it does not, a lock icon is displayed.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye or lock icon.
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        imgElement.src = '/assets/img/lock.png'; 
    }
}

/**
 * This function loads stored login credentials from localStorage if the "Remember Me" option was selected.
 * This function automatically fills the email and password fields if saved data exists.
 */
window.onload = function() {
    if (localStorage.getItem('rememberMe') === 'true') {
        document.getElementById('email').value = localStorage.getItem('email') || '';
        document.getElementById('password').value = localStorage.getItem('password') || '';
        document.getElementById('rememberMe').checked = true;
    }
};

/**
 * This function handles the login form submission.
 * This function saves or removes login credentials in localStorage based on the "Remember Me" checkbox status.
 */
document.getElementById('loginForm').addEventListener('submit', function() {
    const rememberMe = document.getElementById('rememberMe').checked;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (rememberMe) {
        // Store credentials in localStorage
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', 'true');
    } else {
        // Remove stored credentials
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.setItem('rememberMe', 'false');
    }
});
