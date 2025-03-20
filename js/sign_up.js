// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ9srsMl4-kHVT_LsIXZ1jsq2iDfKdr0Y",
  authDomain: "join-67ec1.firebaseapp.com",
  databaseURL: "https://join-67ec1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-67ec1",
  storageBucket: "join-67ec1.firebasestorage.app",
  messagingSenderId: "401858328124",
  appId: "1:401858328124:web:3c24258f8f0ce204a5f539"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Database
const db = getDatabase(app);

// Autofill Function for SignUp Form
function autoFillFieldsSignUp() {
  // Autofill form fields for demonstration or testing
  document.getElementById("name").value = "Sofia Müller";
  document.getElementById("email").value = "SofiaMueller@gmail.com";
  document.getElementById("password").value = "MyPassword12345";
  document.getElementById("confirm-password").value = "MyPassword12345";
  document.getElementById("privacy-policy").checked = true;
}

// Function to Handle User Registration (Sign-Up)
async function handleSignUp(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form values from the input fields
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
      createdAt: new Date().toISOString() // Store the account creation date
    });

    // Show success message and redirect after registration
    showSuccessMessage("You signed up successfully!");
    sessionStorage.setItem("registeredEmail", email);
    sessionStorage.setItem("registeredPassword", password);
    setTimeout(() => {
      window.location.href = "/index.html"; // Redirect to the main page after 2 seconds
    }, 2000);
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Error during registration:", error);
    showSuccessMessage("Registration failed: " + error.message);
  }
}

// Function to display success messages to the user
function showSuccessMessage(message) {
  let successMessage = document.querySelector(".success-message");

  if (!successMessage) {
    // Create a success message element if it doesn't exist
    successMessage = document.createElement("div");
    successMessage.className = "success-message";
    document.body.appendChild(successMessage);
  }

  // Update and show the success message
  successMessage.textContent = message;
  successMessage.classList.add("show");

  // Hide the success message after a certain amount of time
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 4000);
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  const isPasswordVisible = inputField.type === "text"; // Check the current visibility status of the password

  // Toggle the password visibility and change the icon accordingly
  if (isPasswordVisible) {
    inputField.type = "password";
    imgElement.src = "../assets/img/eye_closed.png";
  } else {
    inputField.type = "text";
    imgElement.src = "../assets/img/eye.png";
  }
}

// Add event listener to toggle password visibility on clicking the icon
document.querySelectorAll('.toggle-password').forEach((toggle) => {
  toggle.addEventListener('click', function () {
    const inputId = this.previousElementSibling.id;
    togglePasswordVisibility(inputId, this);
  });
});

// Add event listener to change the password visibility icon when typing in the password field
document.querySelectorAll('.input-field[type="password"]').forEach((inputField) => {
  inputField.addEventListener('input', function () {
    const imgElement = this.nextElementSibling;
    imgElement.src = this.value.length > 0 ? "../assets/img/eye_closed.png" : "../assets/img/lock.png";
  });
});

// Trigger autofill when the name field is clicked (for testing purposes)
document.getElementById("name").addEventListener("click", autoFillFieldsSignUp);

// Hide the "start" section upon loading the sign-up form
document.getElementById("start").style.display = "none";

// Set up the form submission event to call handleSignUp
document.getElementById("signup-form").onsubmit = handleSignUp;
