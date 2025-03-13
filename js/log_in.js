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
 * This function updates the password visibility icon based on the input field value.
 * If the field contains text, the closed-eye icon is shown; if it does not, a lock icon is displayed.
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye or lock icon.
 */
function updatePasswordIcon(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  if (inputField.value.length > 0) {
    imgElement.src = "../assets/img/eye_closed.png"; // Show the closed eye icon when the field is not empty
  } else {
    imgElement.src = "../assets/img/lock.png"; // Show the lock icon when the field is empty
  }
}

/**
 * This function handles the normal login.
 * It saves or removes login credentials based on the "Remember Me" checkbox status.
 */
function normalLogin() {
  const rememberMe = document.getElementById("rememberMe").checked;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
  const rememberMe = localStorage.getItem("rememberMe") === "true";
  if (rememberMe) {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    document.getElementById("email").value = email || "";
    document.getElementById("password").value = password || "";
    document.getElementById("rememberMe").checked = true;
  }
}

// Restore login details on page load
restoreLogin();
