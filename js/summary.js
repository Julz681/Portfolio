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
        let greetingHTML = `${greetingText}`;

        if (!isGuest) {
            const userName = localStorage.getItem("loggedInUserName") || "User";
            greetingHTML += `, <br> <span class='highlight'>${userName}</span>`;
        }

        greetingElement.innerHTML = greetingHTML;
    }

    /**
     * This function updates the user profile initials.
     */
    function updateUserProfileInitials() {
        const userProfileSpan = document.querySelector("#userProfile span");
        const isGuest = localStorage.getItem("isGuest") === "true";
        const userName = localStorage.getItem("loggedInUserName");

        if (isGuest) {
            userProfileSpan.textContent = "G"; // Always "G" for guests
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
            userProfileSpan.textContent = "G"; // Default if there is no name
        }
    }

    const greetingDiv = document.querySelector('.greeting');
    const containerDiv = document.querySelector('.container');

    function handleScreenClick() {
        if (window.innerWidth < 1200 && containerDiv) {
            containerDiv.style.display = 'flex'; // Or 'block', depending on your layout
            if (greetingDiv) {
                greetingDiv.style.display = 'none'; // Hide greeting
            }
            // Optional: Remove the event listener after it's triggered once
            document.removeEventListener('click', handleScreenClick);
        }
    }

    // Add the event listener only if the initial screen width is less than 1200px
    if (window.innerWidth < 1200) {
        document.addEventListener('click', handleScreenClick);
        // Ensure the container is initially hidden (in case CSS doesn't apply)
        if (containerDiv) {
            containerDiv.style.display = 'none';
        }
    }

    // Optional: Handle window resizing if the layout is dynamically adjusted
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1200 && containerDiv) {
            containerDiv.style.display = 'flex'; // Or 'block'
            if (greetingDiv) {
                greetingDiv.style.display = 'block'; // Show greeting again (optional)
            }
            document.removeEventListener('click', handleScreenClick); // Remove the click listener
        } else if (window.innerWidth < 1200 && containerDiv && containerDiv.style.display === 'none') {
            document.addEventListener('click', handleScreenClick); // Add the click listener again
            if (greetingDiv) {
                greetingDiv.style.display = 'block'; // Ensure greeting is displayed
            }
        }
    });

    // Call the functions when the page loads
    updateGreeting();
    updateUserProfileInitials();
});