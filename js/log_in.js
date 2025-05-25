import { getUserDataByEmail } from "./firebase.js";

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
  ["email-error", "password-error"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = "";
      el.classList.add("d_none");
    }
  });
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
  imgElement.src = isVisible
    ? "/assets/img/eye_closed.png"
    : "/assets/img/eye.png";
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
 * Handles user login with credentials and remember-me option.
 * @param {Event} [event] - The event object (optional).
 */
async function normalLogin(event = null) {
  if (event) event.preventDefault();
  hideFieldErrors();
  const { email, password, rememberMe } = getLoginFormValues();
  if (!validateLoginFields(email, password)) return;
  try {
    const userData = await getUserDataByEmail(email);
    if (!handleUserValidation(userData, password)) return;
    saveLoginSession(userData, rememberMe, email, password);
    window.location.href = "/html/summary.html";
  } catch (err) {
    showFieldError("email", "Login failed. Please try again.");
  }
}

function getLoginFormValues() {
  return {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    rememberMe: document.getElementById("rememberMe").checked,
  };
}

function validateLoginFields(email, password) {
  let valid = true;
  if (!email) {
    showFieldError("email", "Email is required.");
    valid = false;
  }
  if (!password) {
    showFieldError("password", "Password is required.");
    valid = false;
  }
  return valid;
}

function handleUserValidation(userData, password) {
  if (!userData) {
    showFieldError("email", "User not found.");
    return false;
  }
  if (userData.password !== password) {
    showFieldError("password", "Incorrect password.");
    return false;
  }
  return true;
}

function saveLoginSession(userData, rememberMe, email, password) {
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
 * Initializes all login-related event listeners once the DOM is ready.
 */
document.addEventListener("DOMContentLoaded", () => {
  initPasswordField();
  initLoginButtons();
  initSignupLinks();
  restoreLogin();
});

/**
 * Configures password field events (focus, input, blur, toggle).
 */
function initPasswordField() {
  const input = document.getElementById("password");
  const icon = document.querySelector(".toggle-password");
  let firstFocus = true;
  input?.addEventListener("focus", () => {
    if (firstFocus) {
      icon.src = "/assets/img/eye_closed.png";
      firstFocus = false;
    }
  });
  input?.addEventListener("input", () => updatePasswordIcon("password", icon));
  input?.addEventListener("blur", () => updatePasswordIcon("password", icon));
  icon?.addEventListener("click", () => {
    togglePasswordVisibility("password", icon);
    updatePasswordIcon("password", icon);
  });
}

/**
 * Sets up login and guest login buttons.
 */
function initLoginButtons() {
  document.getElementById("loginButton")
    ?.addEventListener("click", normalLogin);
  document.getElementById("guestLoginButton")
    ?.addEventListener("click", guestLogin);
}

/**
 * Configures sign-up button redirections.
 */
function initSignupLinks() {
  const signupBtn = document.querySelector(".signup-btn");
  const signupBtn1 = document.querySelector(".signup-btn1");
  const goToSignup = () => (window.location.href = "/html/sign_up.html");
  signupBtn?.addEventListener("click", goToSignup);
  signupBtn1?.addEventListener("click", goToSignup);
}
