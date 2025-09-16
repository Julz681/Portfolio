/**
 * Renders the search results for users to assign in the designated list container.
 * Clears the container and appends HTML for each result with proper styling.
 * @param {Array<string>} searchResults - An array of user names to display.
 */
function renderUserSearchResult(searchResults) {
  const usersListContainerRef = document.getElementById("assigned-to-users-list");
  clearUserListContainer(usersListContainerRef);
  searchResults.forEach((userName, index) => {
    const userHTML = createUserSearchResultHTML(userName, index);
    usersListContainerRef.innerHTML += userHTML;
  });
}

/**
 * Clears the inner content of the user list container.
 * @param {HTMLElement} container - The container to clear.
 */
function clearUserListContainer(container) {
  container.innerHTML = "";
}

/**
 * Creates the HTML string for a single user in the search results.
 * Handles checking assignment state, initials, and background color.
 * @param {string} userName - The user's full name.
 * @param {number} index - The index of the user in the results array.
 * @returns {string} - The HTML string representing the user item.
 */
function createUserSearchResultHTML(userName, index) {
  const stylingObject = checkIsAssigned(userName);
  const initials = getInitials(userName);
  const iconBackgroundColor = getIconBackgroundColor(initials);
  return getUsersToAssignTemplate(
    userName,
    index,
    stylingObject.wrapperClass,
    stylingObject.checkboxClass,
    initials,
    iconBackgroundColor
  );
}


/**
 * Renders the list of subtasks based on the current `subtaskArray`.
 * It clears the existing list and appends new list items using the `getSubtaskTemplate` for each subtask.
 */
function renderSubtaskList() {
  let subtaskListContainerRef = document.getElementById("subtask-list");
  if (!subtaskListContainerRef) return; 
  subtaskListContainerRef.innerHTML = "";
  for (let i = 0; i < subtaskArray.length; i++) {
    let subtaskKey = Object.keys(subtaskArray[i])[0];
    subtaskListContainerRef.innerHTML += getSubtaskTemplate(
      i,
      subtaskArray[i][subtaskKey]
    );
  }
  subtaskListContainerRef.classList.remove("d_none");
}



/**
 * Renders the avatars of the assigned users in the task form.
 * Determines whether to show or hide the assignees list based on dropdown state and data.
 * @param {string} containerId - The ID of the dropdown triggering the render.
 * @param {HTMLElement} container - The dropdown HTML element.
 */
function renderAssignees(containerId, container) {
  const assigneesContainerRef = document.getElementById("assignees-list-task-form");
  if (shouldShowAssignees(containerId, container)) {
    displayAssignees(assigneesContainerRef);
  } else if (!container.classList.contains("d_none") || assignees.length === 0) {
    hideAssigneesContainer(assigneesContainerRef);
  }
}

/**
 * Checks whether the assignees should be rendered.
 * @param {string} containerId - The ID of the triggering dropdown.
 * @param {HTMLElement} container - The dropdown element.
 * @returns {boolean} - True if assignees should be shown.
 */
function shouldShowAssignees(containerId, container) {
  const isAssignedDropdown = containerId === "assigned-to-dropdown" || containerId === "assigned-to-dropdown-task-form";
  const isCategoryDropdown = containerId === "category-dropdown";
  return (
    (isAssignedDropdown && assignees.length !== 0 && container.classList.contains("d_none")) ||
    (isCategoryDropdown && assignees.length !== 0)
  );
}

/**
 * Displays the list of assignee avatars with overflow handling.
 * @param {HTMLElement} container - The container where avatars are rendered.
 */
function displayAssignees(container) {
  showAssigneesContainer(container);
  let additionalAssignees = 0;
  for (let index = 0; index < assignees.length; index++) {
    addSingleAssignee(index, assignees[index], container);
    additionalAssignees = checkForAdditionalAssignees(index, additionalAssignees);
  }
  showAdditionalAssignees(additionalAssignees, container);
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
  assigneesContainerRef.innerHTML += getAvatarTemplate(
    initials,
    iconBackgroundColor
  );
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
    assigneesContainerRef.innerHTML += getAvatarTemplate(
      `+${additionalAssignees}`,
      "#ccc"
    );
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

/** EDIT OVERLAY BOARD:
 * Renders the list of assignees and the user dropdown inside the edit overlay.
 */
function renderAssigneesEditUI() {
  renderUsersToAssignEdit();
  const dropdown = document.getElementById("assigned-to-dropdown-edit");
  renderAssigneesEdit("assigned-to-dropdown-edit", dropdown);
}

/**
 * Renders the subtasks of the given task inside the edit overlay.
 * @param {Object} task - The task object containing subtasks.
 */
function renderSubtaskSection(task) {
  const subtaskListContainer = document.getElementById("subtaskList");
  renderSubtasks(task, subtaskListContainer);
}

/**
 * Renders avatars of assigned users in the edit overlay.
 * Hides the container if no assignees are present.
 * @param {string} containerId - ID of the assignee dropdown (e.g. "assigned-to-dropdown-edit").
 * @param {HTMLElement} container - The container element for displaying avatars.
 */
function renderAssigneesEdit(containerId, container) {
  const assigneesContainerRef = getAssigneesContainer(containerId);
  if (!assigneesContainerRef) return;
  assigneesContainerRef.innerHTML = "";
  if (!Array.isArray(window.assignees)) return;
  if (window.assignees.length > 0) {
    showAssigneeContainer(assigneesContainerRef);
    renderAssigneeAvatars(assigneesContainerRef);
  } else {
    hideAssigneeContainer(assigneesContainerRef);
  }
}

/**
 * Renders the list of users that can be assigned to the task in the edit overlay.
 * This function clears the current user list in the edit view, sorts all available users
 * so that already assigned users appear first, and appends each user as an HTML element
 * using the `getUsersToAssignTemplateForEditTaskForm` template function.
 */
function renderUsersToAssignEdit() {
  const usersList = document.getElementById("assigned-to-users-list-edit");
  if (!usersList || !window.userNames) return;
  usersList.innerHTML = "";
  const sortedUsers = getSortedUsers();
  sortedUsers.forEach((name, index) => {
    const userHTML = createUserHTML(name, index);
    usersList.innerHTML += userHTML;
  });
}

/**
 * Sorts the global `window.userNames` array to prioritize already assigned users.
 * Users who are already present in the `window.assignees` array are sorted to appear at the top of the list.
 * @returns {string[]} A new sorted array of user names.
 */
function getSortedUsers() {
  return [...window.userNames].sort((a, b) => {
    const aAssigned = window.assignees?.includes(a) ? -1 : 1;
    const bAssigned = window.assignees?.includes(b) ? -1 : 1;
    return aAssigned - bAssigned;
  });
}

/**
 * Generates the HTML string for a single user in the edit overlay's assignable users list.
 * This includes the user's initials, background color, and selection state, which are passed
 * to the `getUsersToAssignTemplateForEditTaskForm()` template function.
 * @param {string} name - The full name of the user.
 * @param {number} index - The index of the user in the sorted list.
 * @returns {string} The HTML string for the user entry.
 */
function createUserHTML(name, index) {
  const initials = getInitials(name);
  const bgColor = getIconBackgroundColor(initials);
  const isSelected = window.assignees?.includes(name);
  return getUsersToAssignTemplateForEditTaskForm(
    name,
    index,
    isSelected,
    initials,
    bgColor
  );
}

