/**
 * This function shows and hides the menu when the user profile is clicked.
 */
function toggleDropdown() {
    const dropdownMenu = document.getElementById("dropdownMenu");
  
    const isVisible = dropdownMenu.style.display === "block";
    const isMobile = window.innerWidth < 1200;
  
    if (isVisible) {
      dropdownMenu.style.display = "none";
      dropdownMenu.classList.remove("dropdown-slide-in");
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
