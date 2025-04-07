document.addEventListener('DOMContentLoaded', function() {
    /**
     * This function updates the greeting message based on the current time of day.
     */
    function updateGreeting() {
        const greetingElement = document.querySelector(".greeting p");
        const currentHour = new Date().getHours();
        let greetingText = "Good morning";

        if (currentHour >= 12 && currentHour < 18) {
            greetingText = "Good afternoon";
        } else if (currentHour >= 18 || currentHour < 5) {
            greetingText = "Good evening";
        }

        const isGuest = localStorage.getItem("isGuest") === "true";
        const userName = isGuest ? "Guest" : localStorage.getItem("loggedInUserName") || "User";

        greetingElement.innerHTML = `${greetingText}, <br> <span class='highlight'>${userName}</span>`;
    }

    /**
     * This function updates the user profile initials.
     */
    function updateUserProfileInitials() {
        const userProfileSpan = document.querySelector("#userProfile span");
        const isGuest = localStorage.getItem("isGuest") === "true";
        const userName = localStorage.getItem("loggedInUserName");

        if (isGuest) {
            userProfileSpan.textContent = "G"; // Immer "G" für Gäste
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

    const greetingDiv = document.querySelector('.greeting');
    const containerDiv = document.querySelector('.container');

    function handleScreenClick() {
        if (window.innerWidth < 1200 && containerDiv) {
            containerDiv.style.display = 'flex'; // Oder 'block', je nach deinem Layout
            if (greetingDiv) {
                greetingDiv.style.display = 'none'; // Greeting ausblenden
            }
            // Optional: Entferne den Event Listener, nachdem er einmal ausgelöst wurde
            document.removeEventListener('click', handleScreenClick);
        }
    }

    // Füge den Event Listener nur hinzu, wenn die Bildschirmbreite initial unter 1200px ist
    if (window.innerWidth < 1200) {
        document.addEventListener('click', handleScreenClick);
        // Stelle sicher, dass der Container initial ausgeblendet ist (falls CSS nicht greift)
        if (containerDiv) {
            containerDiv.style.display = 'none';
        }
    }

    // Optional: Behandle Fenstergrößenänderungen, falls das Layout dynamisch angepasst wird
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1200 && containerDiv) {
            containerDiv.style.display = 'flex'; // Oder 'block'
            if (greetingDiv) {
                greetingDiv.style.display = 'block'; // Greeting wieder anzeigen (optional)
            }
            document.removeEventListener('click', handleScreenClick); // Entferne den Klick-Listener
        } else if (window.innerWidth < 1200 && containerDiv && containerDiv.style.display === 'none') {
            document.addEventListener('click', handleScreenClick); // Füge den Klick-Listener wieder hinzu
            if (greetingDiv) {
                greetingDiv.style.display = 'block'; // Stelle sicher, dass Greeting angezeigt wird
            }
        }
    });

    // Call the functions when the page loads
    updateGreeting();
    updateUserProfileInitials();
});