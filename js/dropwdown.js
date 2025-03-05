/**
 * This function waits until the DOM is fully loaded and then adds event listeners
 * for a user profile dropdown menu.
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * The user profile element that is clicked to toggle the dropdown menu.
   * @type {HTMLElement}
   */
  const userProfile = document.getElementById("userProfile");

  /**
   * The dropdown menu that is shown or hidden.
   * @type {HTMLElement}
   */
  const dropdownMenu = document.getElementById("dropdownMenu");

  /**
   * Event listener for the user profile. Clicking toggles the dropdown menu.
   * @param {MouseEvent} event - The click event.
   */
  userProfile.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevents the document click event from closing the dropdown immediately
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  /**
   * Event listener for the document to hide the dropdown menu when clicking outside the user profile
   *
   * @param {MouseEvent} event - The click event.
   */
  document.addEventListener("click", function (event) {
    if (
      !userProfile.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.style.display = "none";
    }
  });
});
