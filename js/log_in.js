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
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  const isPasswordVisible = inputField.type === "text";

  // Toggle password visibility and update icon
  if (isPasswordVisible) {
    inputField.type = "password";
    imgElement.src = "../assets/img/eye_closed.png"; // Change to closed eye icon when password is hidden
  } else {
    inputField.type = "text";
    imgElement.src = "../assets/img/eye.png"; // Change to open eye icon when password is visible
  }
}

/**
 * This function handles the normal login.
 * It saves or removes login credentials based on the "Remember Me" checkbox status.
 */
function normalLogin() {
  const rememberMe = document.getElementById("rememberMe") ? document.getElementById("rememberMe").checked : false;
  const email = document.getElementById("email") ? document.getElementById("email").value : "";
  const password = document.getElementById("password") ? document.getElementById("password").value : "";

  if (rememberMe) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.setItem("rememberMe", "false");
  }

  // Set Guest Mode to false for normal login
  localStorage.setItem("isGuest", "false");
  location.href = '../html/summary.html';
}

/**
 * This function handles the guest login.
 * It sets the "isGuest" value to true and redirects to the summary page.
 */
function guestLogin() {
  localStorage.setItem("isGuest", "true");
  location.href = "../html/summary.html";
}

/**
 * This function restores the saved credentials when the page loads if "Remember Me" was checked.
 */
function restoreLogin() {
  // Ensure the elements exist before trying to access them
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const rememberMeField = document.getElementById("rememberMe");

  // Check if all required elements exist
  if (emailField && passwordField && rememberMeField) {
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe) {
      // If "Remember Me" is checked, restore the saved credentials from localStorage
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      emailField.value = email || "";
      passwordField.value = password || "";
      rememberMeField.checked = true;
    } else {
      // If "Remember Me" is unchecked, reset the form fields
      emailField.value = "";
      passwordField.value = "";
      rememberMeField.checked = false;
    }

    // Check if there's sessionStorage data from sign up (if the user just signed up)
    const sessionEmail = sessionStorage.getItem("registeredEmail");
    const sessionPassword = sessionStorage.getItem("registeredPassword");

    if (sessionEmail && sessionPassword) {
      emailField.value = sessionEmail;
      passwordField.value = sessionPassword;
      sessionStorage.removeItem("registeredEmail"); // Clear sessionStorage after using the data
      sessionStorage.removeItem("registeredPassword");
    }
  } else {
    console.error("Required form elements not found.");
  }
}

// Ensure the DOM is fully loaded before running restoreLogin
document.addEventListener('DOMContentLoaded', function() {
  restoreLogin(); // This function is called when the DOM is ready
});
