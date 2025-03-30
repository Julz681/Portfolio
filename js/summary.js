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
     * This function counts the tasks and updates the task metrics.
     */
    function updateTaskMetrics() {
        const todoCount = document.querySelectorAll(".to-do-wrapper .board-card").length;
        const inProgressCount = document.querySelectorAll(".in-progress-wrapper .board-card").length;
        const awaitFeedbackCount = document.querySelectorAll(".await-feedback-wrapper .board-card").length;
        const doneCount = document.querySelectorAll(".done-wrapper .board-card").length;
        const totalCount = todoCount + inProgressCount + awaitFeedbackCount + doneCount;

        document.querySelector(".metrics .metric-box:nth-of-type(1) h2").textContent = todoCount;
        document.querySelector(".metrics .metric-box:nth-of-type(2) h2").textContent = doneCount;
        document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(1) h2").textContent = totalCount;
        document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(2) h2").textContent = inProgressCount;
        document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(3) h2").textContent = awaitFeedbackCount;
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
            userProfileSpan.textContent = "G"; // Standardinitiale, falls kein Name vorhanden
        }
    }

    // Call the functions when the page loads
    updateGreeting();
    updateTaskMetrics();
    updateUserProfileInitials();
});