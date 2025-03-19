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
const auth = getAuth(app);
const db = getDatabase(app);

function autoFillFieldsSignUp() {
  document.getElementById("name").value = "Sofia Müller";
  document.getElementById("email").value = "SofiaMueller@gmail.com";
  document.getElementById("password").value = "MyPassword12345";
  document.getElementById("confirm-password").value = "MyPassword12345";
  document.getElementById("privacy-policy").checked = true;
}

async function handleSignUp(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

document.querySelectorAll('.toggle-password').forEach((toggle) => {
  toggle.addEventListener('click', function () {
    const inputId = this.previousElementSibling.id;
    togglePasswordVisibility(inputId, this);
  });
});

document.querySelectorAll('.input-field[type="password"]').forEach((inputField) => {
  inputField.addEventListener('input', function () {
    const imgElement = this.nextElementSibling;
    imgElement.src = this.value.length > 0 ? "../assets/img/eye_closed.png" : "../assets/img/lock.png";
  });
});

document.getElementById("name").addEventListener("click", autoFillFieldsSignUp);
document.getElementById("start").style.display = "none";
document.getElementById("signup-form").onsubmit = handleSignUp;
