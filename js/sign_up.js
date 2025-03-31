import { saveUserData } from "./firebase.js";

/**
 * This function automatically fills the sign-up form fields with predefined values when clicking in the email field.
 * This function is primarily used for testing or demonstration purposes.
 */
function autoFillFieldsSignUp() {
  document.getElementById("name").value = "Sofia Müller";
  document.getElementById("email").value = "SofiaMueller@gmail.com";
  document.getElementById("password").value = "MyPassword12345";
  document.getElementById("confirm-password").value = "MyPassword12345";
  document.getElementById("privacy-policy").checked = true;
}

/**
 * This function handles the sign-up form submission, saves the user data to Firebase,
 * displays a success message, and redirects the user to the login page after a short delay.
 * @param {Event} event - The event object for preventing default form submission.
 */
function handleSignUpSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting the usual way

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Generate a simple user ID based on the email (or use UUID in a real-world scenario)
  const userId = email.replace(/[^a-zA-Z0-9]/g, "_");

  // Save user data to Firebase
  saveUserData(userId, name, email);

  // Save credentials to Local Storage for login (store only email and password)
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  // Show success message
  let successMessage = document.querySelector(".success-message");
  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "You signed up successfully";
    document.body.appendChild(successMessage);
  }
  successMessage.classList.add("show");

  // Hide the success message after 4 seconds and redirect to the login page
  setTimeout(() => {
    successMessage.classList.remove("show");
    window.location.href = "/index.html"; // Redirect to login page
  }, 1000);
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
  if (inputField.value.length > 0) {
    imgElement.src = "../assets/img/eye_closed.png";
  } else {
    imgElement.src = "../assets/img/lock.png";
  }
}

// Expose functions to the global scope for inline event listeners
window.autoFillFieldsSignUp = autoFillFieldsSignUp;
window.handleSignUpSubmission = handleSignUpSubmission;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordIcon = updatePasswordIcon;

/**
 * This function ensures that the sign-up form event listener is properly attached after the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const signUpForm = document.getElementById("signup-form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUpSubmission);
  } else {
    console.error("Sign-up form not found.");
  }
});

/**
 * This function changes the eye icon when the password field is focused.
 */
document.addEventListener("DOMContentLoaded", function () {
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm-password");
  const passwordIcon = document.getElementById("eye-icon-password");
  const confirmPasswordIcon = document.getElementById("eye-icon-confirm-password");

  if (passwordField && passwordIcon) {
    passwordField.addEventListener("focus", function () {
      if (passwordField.type === "password") {
        passwordIcon.src = "../assets/img/eye_closed.png";
      }
    });
  }

  if (confirmPasswordField && confirmPasswordIcon) {
    confirmPasswordField.addEventListener("focus", function () {
      if (confirmPasswordField.type === "password") {
        confirmPasswordIcon.src = "../assets/img/eye_closed.png";
      }
    });
  }
});

// Hide the start element
document.getElementById("start").style.display = "none";
