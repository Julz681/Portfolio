// This function is used for the animation at the beginning.
document.addEventListener("DOMContentLoaded", () => {
  const startElement = document.querySelector(".start");
  if (startElement) {
    startElement.addEventListener("animationend", function () {
      this.classList.add("finished");
    });
  } else {
    console.error("Element with class 'start' not found!");
  }

  // The event listener is for the help button in the header, making it disappear when on the help HTML page and reappear when leaving it.
  const helpButton = document.querySelector(".help-btn");

  if (helpButton) {
    // Log the current pathname to check if it's what we expect
    console.log("Current Path:", window.location.pathname);

    // Only hide the help button if we are on the help page
    if (window.location.pathname.includes("help.html")) {
      helpButton.style.display = "none"; // Hide the help button on help.html page
    } else {
      helpButton.style.display = "block"; // Ensure it is visible on other pages
    }
  }

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

    // Only update the profile if the element exists
    if (userProfile) {
      const isGuest = localStorage.getItem("isGuest") === "true";
      const profileInitials = isGuest ? "G" : "SM"; // Set profile initials
      userProfile.textContent = profileInitials; // Update the profile icon text
    }
  }

  // Call the function to update the user profile, but only if the element exists
  updateUserProfile();
});
