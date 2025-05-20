/**
 * Renders the search results for users to assign in the designated list container.
 * For each search result, it checks if the user is already assigned and then
 * appends the HTML for the user item to the list.
 * @param {Array<string>} searchResults - An array of user names to display in the search results.
 */
function renderUserSearchResult(searchResults) {
    let usersListContainerRef = document.getElementById("assigned-to-users-list");
    usersListContainerRef.innerHTML = "";
    for (let index = 0; index < searchResults.length; index++) {
        let stylingObject = checkIsAssigned(searchResults[index]);
        let initials = getInitials(searchResults[index]);
        let iconBackgroundColor = getIconBackgroundColor(initials);
        usersListContainerRef.innerHTML += getUsersToAssignTemplate(searchResults[index], index, stylingObject.wrapperClass, stylingObject.checkboxClass, initials, iconBackgroundColor);
    }
}

/**
 * Renders the list of subtasks based on the current `subtaskArray`.
 * It clears the existing list and appends new list items using the `getSubtaskTemplate` for each subtask.
 */
function renderSubtaskList() {
    let subtaskListContainerRef = document.getElementById("subtask-list");
    subtaskListContainerRef.innerHTML = "";
    for (let subtaskArrayIndex = 0; subtaskArrayIndex < subtaskArray.length; subtaskArrayIndex++) {
        let subtaskKey = Object.keys(subtaskArray[subtaskArrayIndex]);
        subtaskListContainerRef.innerHTML += getSubtaskTemplate(subtaskArrayIndex, subtaskArray[subtaskArrayIndex][subtaskKey]);
    }
    subtaskListContainerRef.classList.remove("d_none");
}

/**
 * Renders the avatars of the assigned users in the task form.
 * It checks if the dropdown for assignees is being toggled or if the category dropdown is open,
 * and if there are assignees, it displays their avatars. Otherwise, it hides the assignee container.
 * @param {string} containerId - The ID of the dropdown container that triggered the render.
 * @param {HTMLElement} container - The HTML element of the dropdown container.
 */
function renderAssignees(containerId, container) {
    let assigneesContainerRef = document.getElementById("assignees-list-task-form");
    let additionalAssignees = 0;
    if (((containerId === "assigned-to-dropdown" || containerId === "assigned-to-dropdown-task-form") && assignees.length != 0 && container.classList.contains("d_none")) || (containerId === "category-dropdown" && assignees.length != 0)) {
        showAssigneesContainer(assigneesContainerRef);
        for (let index = 0; index < assignees.length; index++) {
            addSingleAssignee(index, assignees[index], assigneesContainerRef)
            additionalAssignees = checkForAdditionalAssignees(index, additionalAssignees);
        }
        showAdditionalAssignees(additionalAssignees, assigneesContainerRef);
    } else if (!container.classList.contains("d_none") || assignees.length === 0) {
        hideAssigneesContainer(assigneesContainerRef);
    }
}

/**
 * Renders a single assignee's avatar within a specified container.
 *
 * @param {object} singleAssignee - The assignee object containing information to render.
 * @param {HTMLElement} assigneesContainerRef - The DOM element where the assignee's avatar will be appended.
 */
function renderSingleAssignee(singleAssignee, assigneesContainerRef) {
    let initials = getInitials(singleAssignee);
    let iconBackgroundColor = getIconBackgroundColor(initials);
    assigneesContainerRef.innerHTML += getAvatarTemplate(initials, iconBackgroundColor);
}

/**
 * Makes the assignees container visible and clears its current content.
 *
 * @param {HTMLElement} assigneesContainerRef - The DOM element representing the assignees container.
 */
function showAssigneesContainer(assigneesContainerRef) {
    assigneesContainerRef.classList.remove("d_none");
    assigneesContainerRef.innerHTML = "";
}

/**
 * Displays an avatar indicating the number of additional assignees if there are any.
 *
 * @param {number} additionalAssignees - The number of assignees beyond the initial display limit.
 * @param {HTMLElement} assigneesContainerRef - The DOM element where the additional assignees avatar will be appended.
 */
function showAdditionalAssignees(additionalAssignees, assigneesContainerRef) {
    if (additionalAssignees > 0) {
        assigneesContainerRef.innerHTML += getAvatarTemplate(`+${additionalAssignees}`, '#ccc');
    }
}

/**
 * Hides the assignees container and clears its current content.
 *
 * @param {HTMLElement} assigneesContainerRef - The DOM element representing the assignees container.
 */
function hideAssigneesContainer(assigneesContainerRef) {
    assigneesContainerRef.classList.add("d_none");
    assigneesContainerRef.innerHTML = "";
}

/**
 * Checks if the current index indicates an additional assignee (beyond the first four).
 *
 * @param {number} index - The current index of the assignee being processed.
 * @param {number} additionalAssignees - The current count of additional assignees.
 * @returns {number} The updated count of additional assignees.
 */
function checkForAdditionalAssignees(index, additionalAssignees) {
    if (index >= 4) {
        additionalAssignees++;
    }
    return additionalAssignees;
}

/**
 * Adds a single assignee's avatar to the container, but only if the index is less than 4.
 * This effectively limits the number of displayed assignees.
 *
 * @param {number} index - The current index of the assignee.
 * @param {object} singleAssignee - The assignee object to be rendered.
 * @param {HTMLElement} assigneesContainerRef - The DOM element where the assignee's avatar will be appended.
 */
function addSingleAssignee(index, singleAssignee, assigneesContainerRef) {
    if (index < 4) {
        renderSingleAssignee(singleAssignee, assigneesContainerRef);
    }
}