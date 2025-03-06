/**
 * This function pdates the greeting message based on the current time of day.
 * 
 * - "Good morning" (5 AM - 11 AM)
 * - "Good afternoon" (12 PM - 5 PM)
 * - "Good evening" (6 PM - 4 AM)
 * 
 * The greeting is applied to an element with the class `.greeting p`.
 * The user's name is hardcoded as "Sofia Müller" as it is for test-purposes only.
 * 
 * This function runs when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Select the greeting paragraph element
    const greetingElement = document.querySelector(".greeting p");

    // Get the current hour (0-23)
    const currentHour = new Date().getHours();
    
    // Default greeting
    let greetingText = "Good morning";

    // Determine the appropriate greeting based on the time of day
    if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good afternoon";
    } else if (currentHour >= 18 || currentHour < 5) {
        greetingText = "Good evening";
    }

    // Update the greeting message in the DOM
    greetingElement.innerHTML = `${greetingText}, <br> <span class="highlight">Sofia Müller</span>`;
});


