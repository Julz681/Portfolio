let dateFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
let suppressEvents;
let fp;
let subtaskArray = [];
let assignees = [];
let searchResults = [];
let newTasks = [];


/**
 * Checks the value of a title input field for required and size errors,
 * and updates the corresponding error message containers and input styling.
 * @param {string} requiredErrorContainerId - The ID of the element to display the required error message.
 * @param {string} valueSizeErrorContainerId - The ID of the element to display the value size error message.
 * @param {string} containerId - The ID of the input container element.
 */
function checkTitleInputValue(requiredErrorContainerId, valueSizeErrorContainerId, containerId) {
    let requiredErrorContainer = getErrorContainer(`${requiredErrorContainerId}`);
    let valueSizeErrorContainer = getErrorContainer(`${valueSizeErrorContainerId}`);
    let inputContainer = getInputContainer(`${containerId}`);
    let inputContainerValue = getInputContainerValue(`${containerId}`);
    titleErrorsHandling(requiredErrorContainer, valueSizeErrorContainer, inputContainer, inputContainerValue);
}

/**
 * Handles the display and styling of error messages for a title input field
 * based on whether the input value is empty, too short, or not a valid text.
 * @param {HTMLElement} requiredErrorContainer - The element to display the required error message.
 * @param {HTMLElement} valueSizeErrorContainer - The element to display the value size error message.
 * @param {HTMLElement} inputContainer - The input container element to apply styling to.
 * @param {string} containerValue - The current value of the input field.
 */
function titleErrorsHandling(requiredErrorContainer, valueSizeErrorContainer, inputContainer, containerValue) {
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
 * Changes the background color and text color of priority labels when one is selected,
 * and reverts the colors of the others.
 * @param {string} priorityLabelId - The ID of the priority label that was clicked or selected.
 */
function changePriorityLabelColors(priorityLabelId) {
    let priorityLabels = document.getElementsByClassName("priority-labels");
    modifyPriorityLabels(priorityLabels, priorityLabelId);
}

/**
 * Iterates through all priority labels and updates their background and text colors
 * based on whether they are the currently selected label.
 * @param {HTMLCollectionOf<Element>} priorityLabels - A collection of all priority label elements.
 * @param {string} priorityLabelId - The ID of the currently selected priority label.
 */
function modifyPriorityLabels(priorityLabels, priorityLabelId) {
    for (let i = 0; i < priorityLabels.length; i++) {
        let currentPriorityLabelId = priorityLabels[i].id;
        let priorityIconParts = getPriorityIconParts(currentPriorityLabelId);
        let priorityColor = getPriorityColor(currentPriorityLabelId);
        if (
            currentPriorityLabelId != priorityLabelId ||
            (currentPriorityLabelId == priorityLabelId &&
                priorityLabels[i].classList.contains(`${priorityLabelId}-prio-bg`))
        ) {
            priorityLabels[i].style.color = "#000000";
            switchPriorityIconColor(priorityIconParts, priorityColor);
            setDefaultBackgroundColorOnPriorityLabel(
                priorityLabels[i],
                currentPriorityLabelId
            );
        } else {
            activatePriorityLabel(
                priorityLabels[i],
                currentPriorityLabelId,
                priorityIconParts
            );
        }
    }
}

/**
 * Sets the text color to white and the background color based on the priority
 * for a given priority label element. Also updates the associated priority icon color.
 * @param {HTMLElement} priorityLabelContainerRef - The HTML element of the priority label to activate.
 * @param {string} priorityLabelId - The ID of the priority label (e.g., "low", "medium", "urgent").
 * @param {HTMLCollectionOf<SVGElement>} priorityIcon - A collection of SVG elements that make up the priority icon.
 */
function activatePriorityLabel(priorityLabelContainerRef, priorityLabelId, priorityIcon) {
    priorityLabelContainerRef.style.color = "#ffffff";
    setPriorityBackgroundColor(priorityLabelContainerRef, priorityLabelId);
    switchPriorityIconColor(priorityIcon, "#ffffff");
}

/**
 * Returns the color code associated with a given priority label ID.
 * @param {string} priorityLabelId - The ID of the priority label ("low", "medium", or "urgent").
 * @returns {string} The hexadecimal color code for the priority.
 */
function getPriorityColor(priorityLabelId) {
    switch (priorityLabelId) {
        case "low":
            return "#7AE229";
        case "medium":
            return "#FFA800";
        case "urgent":
            return "#FF3D00";
    }
}

/**
 * Retrieves the individual SVG elements that make up the icon for a given priority label.
 * @param {string} priorityLabelId - The ID of the priority label (e.g., "low", "medium", "urgent").
 * @returns {HTMLCollectionOf<SVGElement>} A collection of SVG elements representing the priority icon parts.
 */
function getPriorityIconParts(priorityLabelId) {
    let prioritySVG = document.getElementById(`${priorityLabelId}-svg`);
    let priorityIconParts = prioritySVG.children;
    return priorityIconParts;
}

/**
 * Changes the fill color of all parts of a priority icon to a specified color.
 * @param {HTMLCollectionOf<SVGElement>} priorityIconParts - A collection of SVG elements representing the priority icon parts.
 * @param {string} color - The color to set as the fill color for the icon parts.
 */
function switchPriorityIconColor(priorityIconParts, color) {
    for (let i = 0; i < priorityIconParts.length; i++) {
        priorityIconParts[i].style.fill = color;
    }
}

/**
 * Adds a specific background color class and a bold font weight class to a priority label element.
 * It also removes the default background color class.
 * @param {HTMLElement} priorityLabel - The HTML element of the priority label.
 * @param {string} priorityLabelId - The ID of the priority label to determine the background class.
 */
function setPriorityBackgroundColor(priorityLabel, priorityLabelId) {
    priorityLabel.classList.add(`${priorityLabelId}-prio-bg`, "weight-700");
    priorityLabel.classList.remove("default-prio-bg");
}

/**
 * Removes the specific background color class and bold font weight class from a priority label element,
 * and adds the default background color class.
 * @param {HTMLElement} priorityLabel - The HTML element of the priority label.
 * @param {string} priorityLabelId - The ID of the priority label to determine the background class to remove.
 */
function setDefaultBackgroundColorOnPriorityLabel(priorityLabel, priorityLabelId) {
    priorityLabel.classList.remove(`${priorityLabelId}-prio-bg`, "weight-700");
    priorityLabel.classList.add("default-prio-bg");
}


/**
 * Handles the assignment or unassignment of a contact to a task.
 * It toggles the visual styling of the contact in the list and updates the `assignees` array.
 * @param {string} contactId - The ID of the contact container element.
 * @param {Event} event - The click event that triggered the function.
 */
function assignContactToTask(contactId, event) {
    let contactContainerRef = document.getElementById(contactId);
    if (contactContainerRef.classList.contains("single-contact-wrapper")) {
        toggleAssigneesStyling(contactContainerRef);
        assignees.push(
            contactContainerRef.getElementsByTagName("span")[1].innerHTML
        );
    } else {
        toggleAssigneesStyling(contactContainerRef);
        removeAssigneeIfExists(contactContainerRef);
    }
    event.stopPropagation();
}

/**
 * Toggles the visual styling of an assignee container to indicate whether it is selected or not.
 * This includes changing the background and checkbox appearance.
 * @param {HTMLElement} assigneeContainer - The HTML element representing the contact in the assignees list.
 */
function toggleAssigneesStyling(assigneeContainer) {
    assigneeContainer.classList.toggle("single-contact-wrapper");
    assigneeContainer.classList.toggle("single-contact-wrapper-checked");
    assigneeContainer.lastElementChild.classList.toggle("single-contact-checkbox-unchecked");
    assigneeContainer.lastElementChild.classList.toggle("single-contact-checkbox-checked");
}

/**
 * Checks if the name of a contact (extracted from the container) exists in the `assignees` array.
 * If it does, the contact's name is removed from the array.
 * @param {HTMLElement} contactContainerRef - The HTML container element of the contact.
 */
function removeAssigneeIfExists(contactContainerRef) {
    const contactName = contactContainerRef.getElementsByTagName("span")[1].innerHTML;
    const index = assignees.indexOf(contactName);
    if (index !== -1) {
        assignees.splice(index, 1);
    }
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
        toggleInputContainerVisibilities(containerDropdownObject.dropdownContainer, containerDropdownObject.iconClosed, containerDropdownObject.iconOpen);
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
 * Checks if a given user name is currently in the `assignees` array.
 * Based on this, it returns an object containing the appropriate CSS classes
 * for the user item's wrapper and checkbox.
 * @param {string} value - The user name to check for assignment.
 * @returns {{wrapperClass: string, checkboxClass: string}} An object with CSS classes for styling.
 */
function checkIsAssigned(value) {
    let isAssigned = assignees.includes(value);
    let wrapperClass = isAssigned ? "single-contact-wrapper-checked" : "single-contact-wrapper";
    let checkboxClass = isAssigned ? "single-contact-checkbox-checked" : "single-contact-checkbox-unchecked";
    return (stylingObject = {
        wrapperClass: wrapperClass,
        checkboxClass: checkboxClass,
    });
}


/**
 * Selects a task category from the dropdown and updates the placeholder text of the category input field.
 * @param {string} categoryId - The ID of the selected category element.
 */
function selectCategory(categoryId) {
    let categoryContainerRef = getInputContainer(categoryId);
    let selectedCategory = categoryContainerRef.innerHTML;
    let categoryInputContainerRef = document.getElementById("category");
    categoryInputContainerRef.placeholder = selectedCategory;
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
    // let categoryValue = getInputContainer("category").value;
    let errorContainerRef = getErrorContainer(requiredErrorContainerId);
    if (placeholder === "Select task category" && dropdownContainerRef.classList.contains("d_none")) {
        showErrorMessage(errorContainerRef);
    } else {
        removeErrorMessage(errorContainerRef);
    }
    // if (!categoryValue) {
    //     showErrorMessage(errorContainerRef);
    // } else {
    //     removeErrorMessage(errorContainerRef);
    // }

}

/**
 * Moves the focus (cursor) to the input field for adding new subtasks.
 */
function moveCursorToSubtaskInput() {
    let subtaskInputContainerRef = getInputContainer("subtasks-task-form");
    subtaskInputContainerRef.focus();
}

/**
 * Evaluates the input value of the subtask input field and switches the visibility
 * of the add and confirm icons based on the input length. It also handles error messages.
 * @param {string} valueSizeErrorContainerId - The ID of the element to display the value size error message.
 */
function evaluateSubtaskInput(valueSizeErrorContainerId) {
    let confirmInputIconsRef = document.getElementById("confirm-input-icons");
    let addIconRef = document.getElementById("add-subtask-icon");
    let subtaskInputContainerRef = getInputContainer("subtasks-task-form");
    let inputValue = getInputValue(subtaskInputContainerRef);
    if (inputValue.length > 3) {
        switchIconsOnSubtasks(confirmInputIconsRef, addIconRef);
        removeErrorMessageOnSubtaskInput(subtaskInputContainerRef.parentElement, valueSizeErrorContainerId);
    } else if (inputValue.length <= 3 && inputValue.length > 0) {
        falseInputValueHandling(confirmInputIconsRef, addIconRef, valueSizeErrorContainerId, subtaskInputContainerRef.parentElement);
    } else {
        switchIconsOnSubtasks(addIconRef, confirmInputIconsRef);
        removeErrorMessageOnSubtaskInput(subtaskInputContainerRef.parentElement, valueSizeErrorContainerId);
    }
}

/**
 * Removes error styling and hides the value size error message for the subtask input field.
 * @param {HTMLElement} subtaskInputContainer - The parent container of the subtask input field.
 * @param {string} valueSizeErrorContainerId - The ID of the value size error message container.
 */
function removeErrorMessageOnSubtaskInput(subtaskInputContainer, valueSizeErrorContainerId) {
    removeValueErrorStylingOnInput(subtaskInputContainer);
    hideValueErrorMessage(valueSizeErrorContainerId);
}

/**
 * Switches the visibility of two icons related to subtask input (e.g., add and confirm).
 * @param {HTMLElement} showIcon1 - The icon element to make visible.
 * @param {HTMLElement} hideIcon2 - The icon element to hide.
 */
function switchIconsOnSubtasks(showIcon1, hideIcon2) {
    showIcon1.classList.remove("d_none");
    hideIcon2.classList.add("d_none");
}

/**
 * Handles the UI updates when the subtask input value is too short,
 * showing an error message and the add icon while hiding the confirm icon.
 * @param {HTMLElement} confirmInputIconsRef - The container for the confirm icons.
 * @param {HTMLElement} addIconRef - The add subtask icon element.
 * @param {string} valueSizeErrorContainerId - The ID of the value size error message container.
 * @param {HTMLElement} InputContainerWrapperRef - The wrapper element of the subtask input.
 */
function falseInputValueHandling(confirmInputIconsRef, addIconRef, valueSizeErrorContainerId, InputContainerWrapperRef) {
    confirmInputIconsRef.classList.add("d_none");
    addIconRef.classList.remove("d_none");
    showValueErrorMessage(valueSizeErrorContainerId);
    addValueErrorStylingOnInput(InputContainerWrapperRef);
}

/**
 * Adds a new subtask to the `subtaskArray` based on the input value,
 * renders the updated subtask list, clears the input field, and evaluates the input state.
 * @param {string} id - The ID of the subtask input field.
 * @param {string} valueSizeErrorContainerId - The ID of the value size error message container.
 */
function addSubtask(id, valueSizeErrorContainerId) {
    let input = getInputContainer(id);
    let inputValue = input.value.trim();
    let subtaskNumber = subtaskArray.length;
    let subtaskKey = `subtask-${subtaskNumber}`;
    subtaskArray.push({
        [subtaskKey]: inputValue,
    });
    renderSubtaskList();
    input.value = "";
    evaluateSubtaskInput(valueSizeErrorContainerId);
}



/**
 * Clears the input field for subtasks and evaluates the input state to update icons and error messages.
 * @param {string} id - The ID of the subtask input field.
 * @param {string} valueSizeErrorContainerId - The ID of the error message container for value size.
 */
function clearSubtaskInput(id, valueSizeErrorContainerId) {
    let input = getInputContainer(id);
    input.value = "";
    evaluateSubtaskInput(valueSizeErrorContainerId);
}

/**
 * Enables editing of a subtask by removing the 'disabled' attribute from the input field
 * and visually highlighting the list item as active.
 * @param {string} id - The ID of the subtask input field to enable for editing.
 */
function enableSubtaskEdit(id) {
    let subtaskInputContainerRef = getInputContainer(id);
    subtaskInputContainerRef.removeAttribute("disabled");
    let listItemContainerRef = subtaskInputContainerRef.closest(".subtask-list-item");
    listItemContainerRef.classList.add("subtask-list-item-active");
    listItemContainerRef.classList.remove("subtask-list-item", "br-10");
}

/**
 * Confirms the edit of a subtask, updates the `subtaskArray` with the new value,
 * reverts the visual highlighting of the list item, and disables the input field.
 * @param {string} id - The ID of the subtask input field that was edited.
 */
function confirmEditSubtask(id) {
    let subtaskInputContainerRef = getInputContainer(id);
    let subtaskInputValue = getInputValue(subtaskInputContainerRef);
    let subtaskIndex = extractIndex(id);
    subtaskArray[subtaskIndex] = { [id]: subtaskInputValue };
    let listItemContainerRef = subtaskInputContainerRef.closest(".subtask-list-item-active");
    listItemContainerRef.classList.remove("subtask-list-item-active");
    listItemContainerRef.classList.add("subtask-list-item", "br-10");
    subtaskInputContainerRef.setAttribute("disabled", true);
}

/**
 * Extracts the numerical index from a given ID string.
 * This is used to identify the position of a subtask in the `subtaskArray`.
 * @param {string} id - The ID string from which to extract the index.
 * @returns {Array<number>} An array containing the extracted numerical index.
 */
function extractIndex(id) {
    let index = [];
    for (let i = 0; i < id.length; i++) {
        let char = id[i];
        if (!isNaN(char)) {
            index.push(parseInt(char));
        }
    }
    return index;
}

/**
 * Deletes a subtask from the `subtaskArray` based on its ID and then re-renders the subtask list.
 * @param {string} id - The ID of the subtask to delete.
 */
function deleteSubtask(id) {
    let currentSubtaskIndex = extractIndex(id);
    subtaskArray.splice(currentSubtaskIndex, 1);
    renderSubtaskList();
}

/**
 * Adds a new subtask when the 'Enter' key is pressed while focused on the subtask input field.
 * @param {string} id - The ID of the subtask input field.
 * @param {KeyboardEvent} event - The keyboard event object.
 * @param {string} valueSizeErrorContainerId - The ID of the error message container for value size.
 */
function createSubtaskOnKeyPress(id, event, valueSizeErrorContainerId) {
    if (detectKey(event)) {
        addSubtask(id, valueSizeErrorContainerId);
    }
}

/**
 * Confirms the edit of a subtask when the 'Enter' key is pressed while focused on the subtask edit input field.
 * @param {string} id - The ID of the subtask input field being edited.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function editSubtaskOnKeyPress(id, event) {
    if (detectKey(event)) {
        confirmEditSubtask(id);
    }
}

/**
 * Detects if the 'Enter' key was pressed during a keyboard event.
 * @param {KeyboardEvent} event - The keyboard event object.
 * @returns {boolean} True if the 'Enter' key was pressed, false otherwise.
 */
function detectKey(event) {
    if (event.key === "Enter") {
        return true;
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
 * Retrieves an HTML element by its ID. This is a helper function for accessing DOM elements.
 * @param {string} id - The ID of the HTML element to retrieve.
 * @returns {HTMLElement} The HTML element with the given ID.
 */
function getInputContainer(id) {
    return document.getElementById(id);
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