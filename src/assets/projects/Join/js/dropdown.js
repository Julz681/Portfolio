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
    /** This function gets the menu and user profile elements */
    var dropdownMenu = document.getElementById("dropdownMenu");
    var userProfile = document.getElementById("userProfile");
    /**  Check if the click occurred outside the dropdown menu and the user profile */
    var clickedOutsideMenu = !dropdownMenu.contains(event.target);
    var clickedOutsideProfile = !userProfile.contains(event.target);
    if (clickedOutsideMenu && clickedOutsideProfile) {
        dropdownMenu.style.display = "none";
    }
}

/** This function closes the drop down menu */
document.onclick = closeDropdown;


/**
 * Toggles the visibility of a dropdown selection container and its associated icons.
 * It also calls functions to render assignees, handle dropdown container IDs, and close the dropdown.
 * @param {string} dropdownContainerId - The ID of the dropdown container.
 * @param {Event} event - The click event that triggered the toggle.
 */
function toggleDropdownSelection(dropdownContainerId, event) {
    let containerDropdownObject = createContainerObject(dropdownContainerId);
    if (containerDropdownObject.dropdownContainer.classList.contains("d_none")) {
        toggleInputContainerVisibilities(containerDropdownObject.dropdownContainer, containerDropdownObject.iconClosed, containerDropdownObject.iconOpen);
        renderAssignees(dropdownContainerId, containerDropdownObject.dropdownContainer);
    } else {
        toggleInputContainerVisibilities(containerDropdownObject.dropdownContainer, containerDropdownObject.iconOpen, containerDropdownObject.iconClosed);
        renderAssignees(dropdownContainerId, containerDropdownObject.dropdownContainer);
    }
    handleDropdownContainerIds(dropdownContainerId);
    closeDropdown(event);
    event.stopPropagation();
}

/**
 * Creates an object containing references to the dropdown container and its open/closed icons.
 * @param {string} containerId - The ID of the dropdown container.
 * @returns {object} An object with references to the dropdown container, open icon, and closed icon.
 */
function createContainerObject(containerId) {
    let containerDropdownObject = {
        dropdownContainer: document.getElementById(containerId),
        iconOpen: document.getElementById(`${containerId}-open`),
        iconClosed: document.getElementById(`${containerId}-closed`),
    };
    return containerDropdownObject;
}

/**
 * Toggles the visibility of a dropdown container and its associated open and closed icons.
 * @param {HTMLElement} dropdownContainerRef - The dropdown container element.
 * @param {HTMLElement} dropdownIconContainerClosedRef - The closed icon element.
 * @param {HTMLElement} dropdownIconContainerOpenRef - The open icon element.
 */
function toggleInputContainerVisibilities(dropdownContainerRef, dropdownIconContainerClosedRef, dropdownIconContainerOpenRef) {
    toggleDropdownContainerVisibility(dropdownContainerRef);
    toggleDropdownContainerVisibility(dropdownIconContainerClosedRef);
    toggleDropdownContainerVisibility(dropdownIconContainerOpenRef);
}

/**
 * Toggles the 'd_none' class on a given HTML element to show or hide it.
 * @param {HTMLElement} dropdownContainerRef - The HTML element to toggle visibility on.
 */
function toggleDropdownContainerVisibility(dropdownContainerRef) {
    dropdownContainerRef.classList.toggle("d_none");
}

/**
 * Closes all dropdown containers on the page, handling different dropdowns based on the current page.
 * It also checks for category error conditions and renders assignees if necessary.
 * @param {Event} event - The click event that triggered the close action.
 */
function closeAllDropdowns(event) {
    let assignedToDropdownContainerId;
    let dropdownContainers = [];
    if (window.location.pathname === "../html/board.html") {
        assignedToDropdownContainerId = "assigned-to-dropdown-task-form";
        dropdownContainers = [createContainerObject("category-dropdown"), createContainerObject("assigned-to-dropdown-task-form"),];
        closeAllMenus(current = null);
    } else {
        assignedToDropdownContainerId = "assigned-to-dropdown";
        dropdownContainers = [createContainerObject("category-dropdown"), createContainerObject("assigned-to-dropdown"),];
    }
    closeAllDropdownsTaskForm(event, assignedToDropdownContainerId, dropdownContainers)
}

function closeAllDropdownsTaskForm(event, assignedToDropdownContainerId, dropdownContainers) {
    checkDropdownContainersArray(assignedToDropdownContainerId, dropdownContainers);
    closeDropdown(event);
    event.stopPropagation();
}

/**
 * Iterates through an array of dropdown container objects and closes each one.
 * It also checks for category errors and renders assignees for the assigned-to dropdown.
 * @param {string} assignedToDropdownContainerId - The ID of the assigned-to dropdown container.
 * @param {Array<object>} dropdownContainers - An array of dropdown container objects.
 */
function checkDropdownContainersArray(assignedToDropdownContainerId, dropdownContainers) {
    dropdownContainers.forEach((container) => {
        if (container.dropdownContainer != null) {
            checkForCategoryErrorCondition(dropdownContainers);
            closeSingleDropdown(container);
            renderAssignees(assignedToDropdownContainerId, dropdownContainers[1].dropdownContainer);
        }
    });
}

/**
 * Closes a single dropdown container by toggling the visibility of the container and its icons.
 * @param {object} dropdownContainerObject - An object containing references to the dropdown container and its icons.
 */
function closeSingleDropdown(dropdownContainerObject) {
    if (!dropdownContainerObject.dropdownContainer.classList.contains("d_none")) {
        toggleInputContainerVisibilities(
            dropdownContainerObject.dropdownContainer,
            dropdownContainerObject.iconClosed,
            dropdownContainerObject.iconOpen
        );
    }
}

/**
 * Checks for a specific error condition related to the category dropdown and displays an error message if met.
 * @param {Array<object>} dropdownContainers - An array of dropdown container objects.
 */
function checkForCategoryErrorCondition(dropdownContainers) {
    if (dropdownContainers[1].dropdownContainer.classList.contains("d_none") && getInputContainer("category").placeholder === "Select task category" && getInputContainer("dropdownMenu").style.display === "none" && !dropdownContainers[0].dropdownContainer.classList.contains("d_none")) {
        showErrorMessage(getErrorContainer("category-error"));
    }
}

/**
 * Handles specific actions based on the ID of the dropdown container that was toggled.
 * It renders users to assign if the assigned-to dropdown is toggled and no search results are present,
 * and it checks the category input placeholder if the category dropdown is toggled.
 * @param {string} dropdownContainerId - The ID of the dropdown container that was toggled.
 */
function handleDropdownContainerIds(dropdownContainerId) {
    if ((dropdownContainerId === "assigned-to-dropdown" || dropdownContainerId === "assigned-to-dropdown-task-form") && searchResults.length === 0) {
        renderUsersToAssign();
    }
    if (dropdownContainerId === "category-dropdown") {
        checkCategoryInputPlaceholder("category-error");
    }
}
window.toggleDropdown = toggleDropdown;
