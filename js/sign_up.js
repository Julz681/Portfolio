import { saveUserData } from "./firebase.js";

/**
 * This function automatically fills the sign-up form fields with predefined values when clicking in the e-mail field.
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
 * This function handles the sign-up form submission, saves the data to Firebase,
 * displays a success message, and redirects the user after a short delay.
 */
function handleSignUpSubmission(event) {
  event.preventDefault();  // Prevent the form from submitting the usual way

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

  // Hide the success message after 4 seconds and redirect to login page
  setTimeout(() => {
    successMessage.classList.remove("show");
    window.location.href = "/index.html";  // Redirect to login page
  }, 1000);
}

/**
 * This function toggles the visibility of a password input field and updates the corresponding icon.
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
 * This function updates the password visibility icon based on the input field value.
 */
function updatePasswordIcon(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  if (inputField.value.length > 0) {
    imgElement.src = "../assets/img/eye_closed.png";
  } else {
    imgElement.src = "../assets/img/lock.png";
  }
}

// Expose functions to global scope for inline event listeners
window.autoFillFieldsSignUp = autoFillFieldsSignUp;
window.handleSignUpSubmission = handleSignUpSubmission;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordIcon = updatePasswordIcon;

// Ensure that the signup form event listener is properly attached after DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  const signUpForm = document.getElementById("signup-form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUpSubmission);
  } else {
    console.error("Sign-up form not found.");
  }
});

document.getElementById("start").style.display = "none";
