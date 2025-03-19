// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
const db = getFirestore(app);

/**
 * This function retrieves the user's name from Firestore based on their UID.
 * @param {string} uid - The UID of the logged-in user.
 * @returns {string} - The user's name or "Guest" if no user is found.
 */
async function getUserName(uid) {
  const userDoc = doc(db, "users", uid);
  const userSnap = await getDoc(userDoc);

  if (userSnap.exists()) {
    const userName = userSnap.data().name;
    console.log("User name from Firestore:", userName);  // Log user name for debugging
    return userName;  
  } else {
    console.log("No user found!");
    return "Guest";  
  }
}

/**
 * This function updates the greeting message based on the current time of day.
 * It shows "Good morning", "Good afternoon", or "Good evening" and adds the username.
 * @param {string} userName - The username to be displayed in the greeting.
 */
function updateGreeting(userName) {
  const greetingElement = document.getElementById("greeting-name");
  const currentHour = new Date().getHours();
  let greetingText = "Good morning";

  // Adjust the greeting based on the time of day
  if (currentHour >= 12 && currentHour < 18) {
    greetingText = "Good afternoon";
  } else if (currentHour >= 18 || currentHour < 5) {
    greetingText = "Good evening";
  }

  // Log greeting update for debugging
  console.log("Greeting updated with name:", userName);

  // Update the greeting element with the proper greeting and username
  greetingElement.innerHTML = `${greetingText}, <br><span class='highlight'>${userName}</span>`;
}

/**
 * This function updates the user profile and sets the initials in the profile section.
 * @param {string} initials - The initials of the user to be displayed.
 */
function updateUserProfile(initials) {
  const userProfile = document.getElementById("user-initials");
  console.log("Updating profile with initials:", initials);  // Log initials for debugging
  userProfile.textContent = initials;
}

/**
 * This function counts the tasks and updates the task metrics.
 */
function updateTaskMetrics() {
  const todoCount = document.querySelectorAll(".to-do-wrapper .board-card").length;
  const inProgressCount = document.querySelectorAll(".in-progress-wrapper .board-card").length;
  const awaitFeedbackCount = document.querySelectorAll(".await-feedback-wrapper .board-card").length;
  const doneCount = document.querySelectorAll(".done-wrapper .board-card").length;
  const totalCount = todoCount + inProgressCount + awaitFeedbackCount + doneCount;

  // Update task metrics in the DOM
  document.querySelector(".metrics .metric-box:nth-of-type(1) h2").textContent = todoCount;
  document.querySelector(".metrics .metric-box:nth-of-type(2) h2").textContent = doneCount;
  document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(1) h2").textContent = totalCount;
  document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(2) h2").textContent = inProgressCount;
  document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(3) h2").textContent = awaitFeedbackCount;
}

// Firebase Auth: Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in:", user);

    // Get the user's name from Firestore
    const userName = await getUserName(user.uid);

    // Set the greeting with the user's name
    updateGreeting(userName);

    // Set the user profile with the initials
    const userInitials = userName.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
    updateUserProfile(userInitials);
  } else {
    console.log("User not logged in. Guest mode.");

    // If the user is not logged in, use "Guest"
    updateGreeting("Guest");
    updateUserProfile("G"); // Set the initials for guests
  }

  // Update the task metrics
  updateTaskMetrics();
});

// Call the functions when the page loads
updateTaskMetrics(); // Task metrics are always called, regardless of whether the user is logged in or not
