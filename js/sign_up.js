// Import the necessary Firebase functions from firebase.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Warten, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {

  // Autofill Function for SignUp Form
  function autoFillFieldsSignUp() {
    document.getElementById("name").value = "Sofia Müller";
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
    document.getElementById("confirm-password").value = "MyPassword12345";
    document.getElementById("privacy-policy").checked = true;
  }

  // Function to Handle User Registration (Sign-Up)
  async function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user's information in Firebase Realtime Database
      await set(ref(db, 'users/' + user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      });

      showSuccessMessage("You signed up successfully!");
      sessionStorage.setItem("registeredEmail", email);
      sessionStorage.setItem("registeredPassword", password);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      showSuccessMessage("Registration failed: " + error.message);
    }
  }

  // Function to display success messages to the user
  function showSuccessMessage(message) {
    let successMessage = document.querySelector(".success-message");

    if (!successMessage) {
      successMessage = document.createElement("div");
      successMessage.className = "success-message";
      document.body.appendChild(successMessage);
    }

    successMessage.textContent = message;
    successMessage.classList.add("show");

    setTimeout(() => {
      successMessage.classList.remove("show");
    }, 4000);
  }

  // Function to toggle password visibility
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

  // Event Listener für Passwort-Sichtbarkeit beim Klick auf das Auge
  document.querySelectorAll('.toggle-password').forEach((toggle) => {
    toggle.addEventListener('click', function () {
      const inputId = this.previousElementSibling.id;
      togglePasswordVisibility(inputId, this);
    });
  });

  // Event Listener zum Ändern des Passwort-Icons beim Tippen
  document.querySelectorAll('.input-field[type="password"]').forEach((inputField) => {
    inputField.addEventListener('input', function () {
      const imgElement = this.nextElementSibling;
      imgElement.src = this.value.length > 0 ? "../assets/img/eye_closed.png" : "../assets/img/lock.png";
    });
  });

  // Trigger autofill when the name field is clicked (for testing purposes)
  const nameField = document.getElementById("name");
  if (nameField) {
    nameField.addEventListener("click", autoFillFieldsSignUp);
  }

  // Hide the "start" section upon loading the sign-up form
  const startSection = document.getElementById("start");
  if (startSection) {
    startSection.style.display = "none";
  }

  // Set up the form submission event to call handleSignUp
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignUp);
  }
});
