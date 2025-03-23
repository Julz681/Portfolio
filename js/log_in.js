/**
 * This function automatically fills the login form fields with predefined values when clicking in the e-mail field.
 * This function is primarily used for testing or demonstration purposes.
 */
function autoFillFields() {
  // Always autofill with the default test credentials for Sophia Müller
  const email = "SofiaMueller@gmail.com";
  const password = "MyPassword12345";
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;
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
    imgElement.src = "../assets/img/eye_closed.png";
  } else {
    inputField.type = "text";
    imgElement.src = "../assets/img/eye.png";
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
    imgElement.src = "../assets/img/eye_closed.png";
  } else {
    imgElement.src = "../assets/img/lock.png";
  }
}

/**
 * This function handles the normal login.
 * It saves or removes login credentials based on the "Remember Me" checkbox status.
 */
function normalLogin(event) {
  // Prevent form submission
  if (event) {
    event.preventDefault(); // Make sure event is defined before calling preventDefault()
  }

  console.log("Login button clicked!"); // Check if this log appears

  const rememberMe = document.getElementById("rememberMe").checked;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Check if both fields are filled
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

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
  location.href = '../html/summary.html'; // Redirect to the summary page after successful login
}

/**
 * This function handles the guest login.
 * It does not require email or password, and just sets the "isGuest" flag.
 */
function guestLogin() {
  localStorage.setItem("isGuest", "true");
  location.href = '../html/summary.html'; // Redirect to the summary page after guest login
}

/**
 * This function restores the saved credentials when the page loads if "Remember Me" was checked.
 */
function restoreLogin() {
  const rememberMe = localStorage.getItem("rememberMe") === "true";

  // Get email and password from localStorage if available
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  // If credentials are found, fill in the form
  if (email && password) {
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
  } else {
    // Leave the fields empty if no data in localStorage
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }

  // Set the "Remember Me" checkbox based on the localStorage
  if (rememberMe) {
    document.getElementById("rememberMe").checked = true;
  } else {
    document.getElementById("rememberMe").checked = false;
  }
}

// Ensure the form and elements exist before adding event listeners
window.onload = () => {
  restoreLogin();

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", normalLogin);
  } else {
    console.error("Login form not found!");
  }

  // Add event listener for guest login
  const guestLoginButton = document.getElementById("guest-login-button");
  if (guestLoginButton) {
    guestLoginButton.addEventListener("click", guestLogin);
  } else {
    console.error("Guest login button not found!");
  }
};
