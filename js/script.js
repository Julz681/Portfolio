document.addEventListener("DOMContentLoaded", () => {
    // Funktion für den Zurück-Button
    function goBack() {
        window.history.back();
    }
    window.goBack = goBack; // Stelle die Funktion global zur Verfügung, falls sie direkt im HTML aufgerufen wird

    // Animation am Seitenanfang
    const startElement = document.querySelector(".start");
    if (startElement) {
        startElement.addEventListener("animationend", function () {
            this.classList.add("finished");
        });
    } else {
        console.error("Element with class 'start' not found!");
    }

    // Hilfe-Button im Header ausblenden/einblenden
    const helpButton = document.querySelector(".help-btn");
    if (helpButton) {
        const isHelpPage = window.location.pathname.includes("help.html");
        helpButton.style.display = isHelpPage ? "none" : "block";
        console.log("Current Path:", window.location.pathname, "Help Button Visible:", !isHelpPage);
    }

    // Aktiven Link in der Sidebar hervorheben
    const navLinks = document.querySelectorAll(".main-nav a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        const parentListItem = link.parentElement;
        if (parentListItem) {
            parentListItem.classList.toggle("active", linkPage === currentPage);
        }
    });

    // Funktion zum Aktualisieren des Benutzerprofils (Icon)
    function updateUserProfileIcon() {
        const userProfileSpan = document.querySelector(".user-profile span");
        if (userProfileSpan) {
            const isGuest = localStorage.getItem("isGuest") === "true";
            userProfileSpan.textContent = isGuest ? "G" : "SM";
        }
    }

    // Funktion zum Aktualisieren der Benutzerinitialen (detailliert)
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

    // Rufe die Profil-Update-Funktionen auf
    updateUserProfileIcon();
    updateUserProfileInitials();

    const policyLinks = document.querySelectorAll('a[href*="privacy_policy"], a[href*="legal_notice"]');

    policyLinks.forEach(link => {
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

    // Drag & Drop für Board-Karten
    const boardCards = document.querySelectorAll(".board-card");
    boardCards.forEach(card => {
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", card.dataset.taskId);
            card.style.transform = "rotate(20deg)";
        });
    });
});