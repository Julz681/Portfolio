/**
 * This function shows and hides the menu when the user profile is clicked.
 */
function toggleDropdown() {
    var dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

/**
 * Hides the dropdown menu if the user clicks outside of it or the profile.
 * @param {MouseEvent} event - The click event.
 */
function closeDropdown(event) {
    // This function gets the menu and user profile elements
    var dropdownMenu = document.getElementById("dropdownMenu");
    var userProfile = document.getElementById("userProfile");

    //  Check if the click occurred outside the dropdown menu and the user profile
    var clickedOutsideMenu = !dropdownMenu.contains(event.target);
    var clickedOutsideProfile = !userProfile.contains(event.target);

    if (clickedOutsideMenu && clickedOutsideProfile) {
        dropdownMenu.style.display = "none";
    }
}

// This function closes the drop down menu
document.onclick = closeDropdown;
