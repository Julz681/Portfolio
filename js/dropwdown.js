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

// add task dropdowns toggle

function toggleDropdownSelection(dropdownContainerId, event) {
  let containerDropdownObject = createContainerObject(dropdownContainerId);
  if (containerDropdownObject.dropdownContainer.classList.contains("d_none")) {
    toggleInputContainerVisibilities(containerDropdownObject.dropdownContainer, containerDropdownObject.iconClosed, containerDropdownObject.iconOpen);
  } else {
    toggleInputContainerVisibilities(containerDropdownObject.dropdownContainer, containerDropdownObject.iconOpen, containerDropdownObject.iconClosed)
  }
  // TODO: change this behavior because otherwise every new toggle will trigger the render function
  if (dropdownContainerId === "assigned-to-dropdown" && searchResults.length === 0) {
    renderUsersToAssign();
  }
  closeDropdown(event);
  event.stopPropagation();
}

function createContainerObject(containerId) {
  let containerDropdownObject = {
    dropdownContainer: document.getElementById(containerId),
    iconOpen: document.getElementById(`${containerId}-open`),
    iconClosed: document.getElementById(`${containerId}-closed`)
  }
  return containerDropdownObject;
}

function toggleInputContainerVisibilities(dropdownContainerRef, dropdownIconContainerClosedRef, dropdownIconContainerOpenRef) {
  toggleDropdownContainerVisibility(dropdownContainerRef);
  toggleDropdownContainerVisibility(dropdownIconContainerClosedRef);
  toggleDropdownContainerVisibility(dropdownIconContainerOpenRef);
}

function toggleDropdownContainerVisibility(dropdownContainerRef) {
  dropdownContainerRef.classList.toggle("d_none");
}

function closeAllDropdowns(event) {
  let dropdownContainers = [createContainerObject('category-dropdown'), createContainerObject('assigned-to-dropdown')];
  for (let i = 0; i < dropdownContainers.length; i++) {
    let dropdownContainerObject = dropdownContainers[i];
    if (!dropdownContainerObject.dropdownContainer.classList.contains("d_none")) {
      toggleInputContainerVisibilities(dropdownContainerObject.dropdownContainer, dropdownContainerObject.iconClosed, dropdownContainerObject.iconOpen)
    }
  }
  closeDropdown(event);
  event.stopPropagation();
}