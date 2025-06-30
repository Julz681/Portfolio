/**
 * Checks the value of a title input field for required and size errors,
 * and updates the corresponding error message containers and input styling.
 * @param {string} requiredErrorContainerId - The ID of the element to display the required error message.
 * @param {string} valueSizeErrorContainerId - The ID of the element to display the value size error message.
 * @param {string} containerId - The ID of the input container element.
 */
function checkTitleInputValue(requiredErrorContainerId,valueSizeErrorContainerId,containerId) {
  let requiredErrorContainer = getErrorContainer(`${requiredErrorContainerId}`);
  let valueSizeErrorContainer = getErrorContainer(
    `${valueSizeErrorContainerId}`
  );
  let inputContainer = getInputContainer(`${containerId}`);
  let inputContainerValue = getInputContainerValue(`${containerId}`);
  titleErrorsHandling(requiredErrorContainer,valueSizeErrorContainer,inputContainer,inputContainerValue);
}

/**
 * Handles the display and styling of error messages for a title input field
 * based on whether the input value is empty, too short, or not a valid text.
 * @param {HTMLElement} requiredErrorContainer - The element to display the required error message.
 * @param {HTMLElement} valueSizeErrorContainer - The element to display the value size error message.
 * @param {HTMLElement} inputContainer - The input container element to apply styling to.
 * @param {string} containerValue - The current value of the input field.
 */
function titleErrorsHandling(requiredErrorContainer,valueSizeErrorContainer,inputContainer,containerValue) {
  if (containerValue.length == 0 || containerValue.length <= 3) {
    showErrorMessage(valueSizeErrorContainer);
    showErrorMessage(requiredErrorContainer);
    addValueErrorStylingOnInput(inputContainer);
  } else if (!isNaN(containerValue) || containerValue === "") {
    showErrorMessage(requiredErrorContainer);
    addValueErrorStylingOnInput(inputContainer);
    removeErrorMessage(valueSizeErrorContainer);
  } else {
    removeErrorMessage(valueSizeErrorContainer);
    removeErrorMessage(requiredErrorContainer);
    removeValueErrorStylingOnInput(inputContainer);
  }
}

/**
 * Checks the length of a description input field and displays or hides
 * a value size error message accordingly.
 * @param {string} containerId - The ID of the input container element.
 * @param {string} valueSizeErrorContainerId - The ID of the element to display the value size error message.
 */
function checkDescriptionInput(containerId, valueSizeErrorContainerId) {
  let valueSize = getInputContainerValue(containerId);
  if (valueSize.length <= 3 && valueSize.length > 0) {
    showValueErrorMessage(`${valueSizeErrorContainerId}`);
  } else if (valueSize.length == 0 || valueSize.length > 3) {
    hideValueErrorMessage(`${valueSizeErrorContainerId}`);
  }
}

/**
 * Retrieves the current value of an input field within a specified container.
 * @param {string} containerId - The ID of the container element that holds the input field.
 * @returns {string} The value of the input field.
 */
function getInputContainerValue(containerId) {
  let inputContainer = getInputContainer(containerId);
  let inputContainerValue = getInputValue(inputContainer);
  return inputContainerValue;
}

/**
 * Initiates the search for users to assign to a task based on the input value.
 * It retrieves the search value, creates search results, and renders them in the dropdown.
 * @param {string} containerId - The ID of the dropdown container for the search results.
 */
function searchUsersToAssign(containerId) {
  let searchValue = getSearchValue();
  searchResults = createSearchResult(searchValue);
  let containerDropdownObject = createContainerObject(containerId);
  if (containerDropdownObject.dropdownContainer.classList.contains("d_none")) {
    toggleInputContainerVisibilities(
      containerDropdownObject.dropdownContainer,
      containerDropdownObject.iconClosed,
      containerDropdownObject.iconOpen
    );
  }
  renderUserSearchResult(searchResults);
}

/**
 * Retrieves the current value entered in the search input field for assigning users.
 * @returns {string} The lowercase value of the search input field.
 */
function getSearchValue() {
  let inputRef = document.getElementById("assigned-to-input");
  let searchValue = inputRef.value.toLowerCase();
  return searchValue;
}

/**
 * Creates an array of user names that start with the given search value.
 * It iterates through the global `userNames` array and adds matching names to the results.
 * @param {string} searchValue - The lowercase string to search for at the beginning of user names.
 * @returns {Array<string>} An array of user names that match the search criteria.
 */
function createSearchResult(searchValue) {
  let results = [];
  for (let index = 0; index < userNames.length; index++) {
    if (
      typeof userNames[index] === "string" &&
      userNames[index].toLowerCase().startsWith(searchValue)
    ) {
      results.push(userNames[index]);
    }
  }
  return results;
}

/**
 * Checks if the placeholder of the category input field is still the default value,
 * indicating that no category has been selected. If so and the dropdown is closed,
 * it displays a required error message.
 * @param {string} requiredErrorContainerId - The ID of the element to display the required error message.
 */
function checkCategoryInputPlaceholder(requiredErrorContainerId) {
  let placeholder = getInputContainer("category").placeholder;
  let dropdownContainerRef = document.getElementById("category-dropdown");
  let errorContainerRef = getErrorContainer(requiredErrorContainerId);
  if (
    placeholder === "Select task category" &&
    dropdownContainerRef.classList.contains("d_none")
  ) {
    showErrorMessage(errorContainerRef);
  } else {
    removeErrorMessage(errorContainerRef);
  }
}

/**
 * Shows a value-related error message by retrieving the error container and calling `showErrorMessage`.
 * @param {string} valueSizeErrorContainerId - The ID of the error message container for value size.
 */
function showValueErrorMessage(valueSizeErrorContainerId) {
  let errorContainer = getErrorContainer(valueSizeErrorContainerId);
  return showErrorMessage(errorContainer);
}

/**
 * Hides a value-related error message by retrieving the error container and calling `removeErrorMessage`.
 * @param {string} valueSizeErrorContainerId - The ID of the error message container for value size.
 */
function hideValueErrorMessage(valueSizeErrorContainerId) {
  let errorContainer = getErrorContainer(valueSizeErrorContainerId);
  return removeErrorMessage(errorContainer);
}

/**
 * Retrieves the current value of an input element.
 * @param {HTMLInputElement} inputContainer - The HTML input element.
 * @returns {string} The current value of the input element.
 */
function getInputValue(inputContainer) {
  return inputContainer.value;
}

/**
 * Retrieves an HTML element that is intended to display error messages, by its ID.
 * @param {string} id - The ID of the error message container element.
 * @returns {HTMLElement} The HTML element for displaying error messages.
 */
function getErrorContainer(id) {
  return document.getElementById(id);
}

/**
 * Makes an error message container visible by removing the 'd_none' class.
 * @param {HTMLElement} errorContainer - The HTML element to make visible.
 */
function showErrorMessage(errorContainer) {
  if (errorContainer.classList.contains("d_none")) {
    errorContainer.classList.remove("d_none");
  }
}

/**
 * Adds invalid input styling to a given input container.
 * @param {HTMLElement} inputContainer - The HTML container of the input field to style as invalid.
 */
function addValueErrorStylingOnInput(inputContainer) {
  if (!inputContainer.classList.contains("task-input-fields-invalid")) {
    inputContainer.classList.add("task-input-fields-invalid");
  }
}

/**
 * Hides an error message container by adding the 'd_none' class.
 * @param {HTMLElement} errorContainer - The HTML element to hide.
 */
function removeErrorMessage(errorContainer) {
  if (!errorContainer.classList.contains("d_none")) {
    errorContainer.classList.add("d_none");
  }
}

/**
 * Removes invalid input styling from a given input container.
 * @param {HTMLElement} inputContainer - The HTML container of the input field to remove invalid styling from.
 */
function removeValueErrorStylingOnInput(inputContainer) {
  if (inputContainer.classList.contains("task-input-fields-invalid")) {
    inputContainer.classList.remove("task-input-fields-invalid");
  }
}
