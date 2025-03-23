// This function is used for the animation at the beginning.
document.querySelector(".start").addEventListener("animationend", function () {
  this.classList.add("finished");
});

// The event listener is for the help button in the header, making it disappear when on the help HTML page and reappear when leaving it.
document.addEventListener("DOMContentLoaded", () => {
  const helpButton = document.querySelector(".help-btn");

  // Log the current pathname to check if it's what we expect
  console.log("Current Path:", window.location.pathname);

  // Only hide the help button if we are on the help page
  if (helpButton && window.location.pathname.includes("help.html")) {
    helpButton.style.display = "none"; // Hide the help button on help.html page
  } else {
    helpButton.style.display = "block"; // Ensure it is visible on other pages
  }
});

// This function ensures that the arrow always brings the user back to the page they were on before clicking the help button.
function goBack() {
  window.history.back();
}

/**
 * This function updates the user profile icon and initials in the summary.
 * It sets the profile initials to "G" for guests and "SM" for logged-in users.
 */
function updateUserProfile() {
  const userProfile = document.querySelector(".user-profile span");

  // Check if the user is logged in as a guest
  const isGuest = localStorage.getItem("isGuest") === "true";

  // Set profile initials
  const profileInitials = isGuest ? "G" : "SM";

  // Update the profile icon text
  if (userProfile) {
    userProfile.textContent = profileInitials;
  }
}

// Call the functions when the page loads
updateUserProfile();
