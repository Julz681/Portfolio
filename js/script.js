// This function ensures that the arrow always brings the user back to the page they were on before clicking the help button.
function goBack() {
  window.history.back();
}

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

  // the hover-effect is on the klicked link (Sidebar) active
  window.addEventListener("DOMContentLoaded", function () {
      const navLinks = document.querySelectorAll(".main-nav a");
      const currentPage = window.location.pathname.split("/").pop();

      for (let i = 0; i < navLinks.length; i++) {
          const link = navLinks[i];
          const linkPage = link.getAttribute("href").split("/").pop();

          if (linkPage === currentPage) {
              link.parentElement.classList.add("active");
          } else {
              link.parentElement.classList.remove("active");
          }
      }
  });

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

  /**
   * This function updates the user profile initials.
   */
  function updateUserProfileInitials() {
      const userProfileSpan = document.querySelector("#userProfile span");
      const isGuest = localStorage.getItem("isGuest") === "true";
      const userName = localStorage.getItem("loggedInUserName");

      if (isGuest) {
          userProfileSpan.textContent = "G"; // Always use "G" for guests
      } else if (userName) {
          const names = userName.split(" ");
          let initials = "";
          if (names.length > 0) {
              initials += names[0].charAt(0).toUpperCase();
          }
          if (names.length > 1) {
              initials += names[1].charAt(0).toUpperCase();
          }
          userProfileSpan.textContent = initials;
      } else {
          userProfileSpan.textContent = "G"; // Standard if there is no name
      }
  }

  // Call the function to update the user profile initials
  updateUserProfileInitials();
});

// Call all board-cards
const boardCards = document.querySelectorAll(".board-card");

// Get the columns where the cards can be moved
const columns = document.querySelectorAll(".board-columns");

// Loop through all cards and add event listeners for drag start
boardCards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
        // Set the ID value of the card as data stored in the drag and drop
        e.dataTransfer.setData("text/plain", card.dataset.taskId);

        // Rotate the card 20 degrees to the right
        card.style.transform = "rotate(20deg)";
    });
});

