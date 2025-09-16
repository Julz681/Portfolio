document.addEventListener("DOMContentLoaded", () => {
  initStartLogoAnimation();
  handleHelpButtonVisibility();
  highlightActiveDesktopNav();
  highlightActiveMobileNav();
  highlightActiveNavOnSmallScreen();
  updateUserProfileIcon();
  updateUserProfileInitials();
  setupGuestPolicyLinkRedirects();
  setupBoardCardDragEvents();
});

/**
 * Navigates the browser back to the previous page in history.
 */
function goBack() {
  window.history.back();
}
window.goBack = goBack;

/**
 * Initializes the start logo animation sequence.
 */
function initStartLogoAnimation() {
  const startLogo = document.querySelector(".start-logo");
  const logoOverlay = document.getElementById("logo-overlay");
  const startElement = document.querySelector(".start");
  if (startLogo && logoOverlay && startElement) {
    startLogo.addEventListener("animationend", () => {
      startLogo.classList.add("finished");
      logoOverlay.style.backgroundColor = "transparent";
      startElement.classList.add("finished");
    });
  }
}

/**
 * Handles visibility of the help button depending on current page.
 */
function handleHelpButtonVisibility() {
  const helpButton = document.querySelector(".help-btn");
  if (helpButton) {
    const isHelpPage = window.location.pathname.includes("help.html");
    helpButton.style.display = isHelpPage ? "none" : "block";
  }
}

/**
 * Highlights the active navigation link in desktop navigation.
 */
function highlightActiveDesktopNav() {
  const navLinks = document.querySelectorAll(".main-nav a");
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    const parentListItem = link.parentElement;
    if (parentListItem) {
      parentListItem.classList.toggle("active", linkPage === currentPage);
    }
  });
}

/**
 * Highlights the active link in the mobile navigation.
 */
function highlightActiveMobileNav() {
  const navLinks = document.querySelectorAll(".mobile-nav a");
  const currentPath = window.location.pathname.split("/").pop();
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href")?.split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
}

/**
 * Highlights the correct bottom or mobile nav item on small screens.
 */
function highlightActiveNavOnSmallScreen() {
  if (window.innerWidth < 1200) {
    const currentFile = window.location.pathname.toLowerCase().split("/").pop();
    document.querySelectorAll(".bottom-nav-a, .mobile-nav a").forEach((link) => {
      const href = link.getAttribute("href")?.toLowerCase().split("/").pop();
      if (href === currentFile) {
        link.classList.add("active");
      }
    });
  }
}

/**
 * Updates the basic user profile icon based on guest status.
 */
function updateUserProfileIcon() {
  const userProfileSpan = document.querySelector(".user-profile span");
  if (userProfileSpan) {
    const isGuest = localStorage.getItem("isGuest") === "true";
    userProfileSpan.textContent = isGuest ? "G" : "SM";
  }
}

/**
 * Updates the detailed user profile icon with initials or "G" if guest.
 */
function updateUserProfileInitials() {
  const userProfileSpan = document.querySelector("#userProfile span");
  const isGuest = localStorage.getItem("isGuest") === "true";
  const userName = localStorage.getItem("loggedInUserName");
  if (!userProfileSpan) return;

  if (isGuest || !userName) {
    userProfileSpan.textContent = "G";
  } else {
    userProfileSpan.textContent = getInitialsFromName(userName);
  }
}

/**
 * Extracts up to two initials from a full username string.
 * @param {string} username - The full name of the user.
 * @returns {string} - The extracted initials.
 */
function getInitialsFromName(username) {
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Redirects guest users to the appropriate logged-out policy/legal pages.
 */
function setupGuestPolicyLinkRedirects() {
  const policyLinks = document.querySelectorAll(
    'a[href*="privacy_policy"], a[href*="legal_notice"]'
  );

  policyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const isGuest = localStorage.getItem("isGuest") === "true";
      if (!isGuest) return;
      const href = link.getAttribute("href");
      if (href.includes("privacy_policy.html")) {
        event.preventDefault();
        window.location.href = "../html/privacy_policy_logged_out.html";
      } else if (href.includes("legal_notice.html")) {
        event.preventDefault();
        window.location.href = "../html/legal_notice_logged_out.html";
      }
    });
  });
}

/**
 * Adds dragstart behavior to board task cards for dragging.
 */
function setupBoardCardDragEvents() {
  const boardCards = document.querySelectorAll(".board-card");
  boardCards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.taskId);
      card.style.transform = "rotate(20deg)";
    });
  });
}

/**
 * Returns the background color associated with the first initial of a given string from the `letterColors` object.
 * @param {string} initials - The initials of a name (usually the first letter).
 * @returns {string} The background color for the given initial.
 */
function getIconBackgroundColor(initials) {
  const firstChar = initials[0];
  return letterColors[firstChar];
}

/**
 * Extracts the first two initials from a username in uppercase.
 * @param {string} username - The full username.
 * @returns {string} The initials.
 */
function getInitials(username) {
  return username.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/**
 * Clears all user-related data from localStorage, except saved email if "rememberMe" is true.
 */
function clearTasksInLocalStorage() {
  const remember = localStorage.getItem("rememberMe");
  const savedEmail = localStorage.getItem("savedEmail");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  localStorage.removeItem("loggedInUserName");
  localStorage.removeItem("isGuest");
  if (remember === "true" && savedEmail) {
    localStorage.setItem("rememberMe", "true");
    localStorage.setItem("savedEmail", savedEmail);
  }
}
