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
    let timeoutId; // Variable to store the timeout ID

    function handleScreenLogic() {
        if (window.innerWidth < 1200 && containerDiv && greetingDiv) {
            // Clear any existing timeout
            clearTimeout(timeoutId);

            // Initially hide the container
            containerDiv.style.display = 'none';

            // Fade out the greeting after 2 seconds
            timeoutId = setTimeout(() => {
                greetingDiv.style.transition = 'opacity 1s ease-in-out';
                greetingDiv.style.opacity = '0';

                // After the fade out, hide the greeting and show the container
                setTimeout(() => {
                    greetingDiv.style.display = 'none';
                    greetingDiv.style.opacity = '1'; 
                    greetingDiv.style.transition = ''; 
                    containerDiv.style.display = 'flex'; 
                }, 1000);
            }, 1000);
        } else if (window.innerWidth >= 1200 && containerDiv && greetingDiv) {
            // If the screen is large, ensure greeting is visible and container might be as well
            clearTimeout(timeoutId); // Clear any pending timeout
            greetingDiv.style.display = 'block';
            greetingDiv.style.opacity = '1';
            greetingDiv.style.transition = '';
            containerDiv.style.display = 'flex'; 
        }
    }

    // Call handleScreenLogic on initial load
    handleScreenLogic();

    // Add event listener for window resizing
    window.addEventListener('resize', handleScreenLogic);

    // Call the functions when the page loads
    updateGreeting();
    updateUserProfileInitials();
});