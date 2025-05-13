document.addEventListener("DOMContentLoaded", () => {
    // Function for the back button
    /**
     * Navigates the browser back to the previous page in history.
     */
    function goBack() {
        window.history.back();
    }
    window.goBack = goBack; // Make the function globally available in case it's called directly in the HTML


    // This function starts the logo-animation
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


    // Hide/show the help button in the header
    const helpButton = document.querySelector(".help-btn");
    if (helpButton) {
        const isHelpPage = window.location.pathname.includes("help.html");
        helpButton.style.display = isHelpPage ? "none" : "block";

    }

    // Highlight the active link in the sidebar
    const navLinks = document.querySelectorAll(".main-nav a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();
        const parentListItem = link.parentElement;
        if (parentListItem) {
            parentListItem.classList.toggle("active", linkPage === currentPage);
        }
    });

    // highlight current nav link responsive
    window.addEventListener("DOMContentLoaded", () => {
        const navLinks = document.querySelectorAll(".mobile-nav a");
        const currentPath = window.location.pathname.split("/").pop();

        navLinks.forEach((link) => {
            const linkPath = link.getAttribute("href")?.split("/").pop();
            if (linkPath === currentPath) {
                link.classList.add("active");
            }
        });
    });

    // highlight current nav link logged out responsive
    window.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth < 1200) {
            const currentFile = window.location.pathname
                .toLowerCase()
                .split("/")
                .pop();

            document
                .querySelectorAll(".bottom-nav-a, .mobile-nav a")
                .forEach((link) => {
                    const href = link
                        .getAttribute("href")
                        ?.toLowerCase()
                        .split("/")
                        .pop();

                    if (href === currentFile) {
                        link.classList.add("active");
                    }
                });
        }
    });

    // Function to update the user profile icon
    /**
     * Updates the text content of the user profile icon based on whether the user is a guest.
     */
    function updateUserProfileIcon() {
        const userProfileSpan = document.querySelector(".user-profile span");
        if (userProfileSpan) {
            const isGuest = localStorage.getItem("isGuest") === "true";
            userProfileSpan.textContent = isGuest ? "G" : "SM";
        }
    }

    // Function to update the user profile initials (detailed)
    /**
     * Updates the text content of the detailed user profile icon with the user's initials
     * or "G" if the user is a guest or the username is not available.
     */
    function updateUserProfileInitials() {
        const userProfileSpan = document.querySelector("#userProfile span");
        const isGuest = localStorage.getItem("isGuest") === "true";
        const userName = localStorage.getItem("loggedInUserName");

        if (isGuest) {
            userProfileSpan.textContent = "G";
        } else if (userName) {
            const names = userName.split(" ");
            let initials = "";
            if (names.length > 0) initials += names[0].charAt(0).toUpperCase();
            if (names.length > 1) initials += names[1].charAt(0).toUpperCase();
            userProfileSpan.textContent = initials;
        } else {
            userProfileSpan.textContent = "G";
        }
    }

    // Call the profile update functions
    updateUserProfileIcon();
    updateUserProfileInitials();

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
                window.location.href = "/html/privacy_policy_logged_out.html";
            } else if (href.includes("legal_notice.html")) {
                event.preventDefault();
                window.location.href = "/html/legal_notice_logged_out.html";
            }
        });
    });

    // Drag & Drop for board cards
    const boardCards = document.querySelectorAll(".board-card");
    boardCards.forEach((card) => {
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", card.dataset.taskId);
            card.style.transform = "rotate(20deg)";
        });
    });
});

/**
 * Returns the background color associated with the first initial of a given string from the `letterColors` object.
 * @param {string} initials - The initials of a name (usually the first letter).
 * @returns {string} The background color for the given initial.
 */
function getIconBackgroundColor(initials) {
    let firstChar = initials[0];
    return letterColors[firstChar];
}

/**
 * Extracts the first letter of each word in a username and returns the first two initials in uppercase.
 * @param {string} username - The full username.
 * @returns {string} The first two initials of the username in uppercase.
 */
function getInitials(username) {
    return username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2);
}

/**
 * Clears all data stored in the browser's local storage.
 */
function clearTasksInLocalStorage() {
    localStorage.clear();
}