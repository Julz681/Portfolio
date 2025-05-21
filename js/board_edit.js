
/**
 * Asynchronously opens the task editing overlay, populating all input fields with the data
 * of the provided task object and updating the visual states of UI elements like priority buttons
 * and the assignees list. It also fetches user names if they are not already loaded.
 * @async
 * @param {Object} task - The task object containing the data to populate the edit form.
 */
async function openEditOverlay(task) {
    if (!task) return;
    if (!window.userNames || window.userNames.length === 0) {
        window.userNames = await getUsersFromDatabase();
    }
    window.assignees = Array.isArray(task.assignedTo) ? [...task.assignedTo] : [];
    window.subtaskArray = Array.isArray(task.subtasks)
        ? task.subtasks.map((subtask) => ({ ...subtask }))
        : [];
    const overlay = document.getElementById("editTaskOverlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    const titleInput = overlay.querySelector(".edit-input[placeholder='Enter a title']");
    const descriptionTextarea = overlay.querySelector(".edit-textarea[placeholder='Enter a Description']");
    const dueDateInput = overlay.querySelector("#due-date");
    const priorityButtons = overlay.querySelectorAll(".priority-labels");
    const subtaskListContainer = document.getElementById("subtaskList");
    titleInput.value = task.title || "";
    descriptionTextarea.value = task.description || "";
    if (dueDateInput._flatpickr && task.dueDate) {
        dueDateInput._flatpickr.setDate(task.dueDate, true, "d/m/Y");
    }
    priorityButtons.forEach((btn) => {
        resetPriority(btn);
        btn.classList.remove("selected");
        if (btn.id === task.priority) {
            activatePriority(btn);
            btn.classList.add("selected");
        }
    });
    renderUsersToAssignEdit();
    renderAssigneesEdit("assigned-to-dropdown-edit", document.getElementById("assigned-to-dropdown-edit"));
    renderSubtasks({ subtasks: window.subtaskArray }, subtaskListContainer);
    setupEditDropdownEvents();
    setupPrioritySelection();
    setupSubtaskInput();
    setupAllDatePickers();
}


/**
 * Renders the avatars of the users currently assigned to the task in the edit overlay.
 * It takes the ID of the dropdown container and the container element itself as parameters.
 * It iterates through the `window.assignees` array, generates avatar HTML for each assignee,
 * and appends it to the designated container. If there are no assignees, it hides the container.
 * @param {string} containerId - The ID of the dropdown container for assignees (e.g., "assigned-to-dropdown-edit").
 * @param {HTMLElement} container - The HTML element of the dropdown container.
 */
function renderAssigneesEdit(containerId, container) {
    const assigneesContainerId =
        containerId === "assigned-to-dropdown-edit"
            ? "assignees-list-edit"
            : "assignees-list";
    const assigneesContainerRef = document.getElementById(assigneesContainerId);
    if (!assigneesContainerRef) return;
    assigneesContainerRef.innerHTML = "";
    if (!Array.isArray(window.assignees)) return;
    if (window.assignees.length > 0) {
        assigneesContainerRef.classList.remove("d_none");
        window.assignees.forEach((name) => {
            const initials = getInitials(name);
            const bgColor = getIconBackgroundColor(initials);
            const avatarHTML = getAvatarTemplate(initials, bgColor);

            const wrapper = document.createElement("div");
            wrapper.innerHTML = avatarHTML;
            assigneesContainerRef.appendChild(wrapper.firstElementChild);
        });
    } else {
        assigneesContainerRef.classList.add("d_none");
    }
}

/**
 * Renders the list of users that can be assigned to the task in the edit overlay.
 * It retrieves the `window.userNames` array, sorts it to prioritize already assigned users,
 * and then generates HTML for each user item using the `getUsersToAssignTemplateForEditTaskForm` template.
 */
function renderUsersToAssignEdit() {
    const usersList = document.getElementById("assigned-to-users-list-edit");
    if (!usersList || !window.userNames) return;
    usersList.innerHTML = "";
    const sortedUsers = [...window.userNames].sort((a, b) => {
        const aAssigned = window.assignees?.includes(a) ? -1 : 1;
        const bAssigned = window.assignees?.includes(b) ? -1 : 1;
        return aAssigned - bAssigned;
    });
    sortedUsers.forEach((name, index) => {
        const initials = getInitials(name);
        const bgColor = getIconBackgroundColor(initials);
        const isSelected = window.assignees?.includes(name);
        usersList.innerHTML += getUsersToAssignTemplateForEditTaskForm(
            name,
            index,
            isSelected,
            initials,
            bgColor
        );
    });
}

/**
 * Toggles the assignment status of a user to the task in the edit overlay.
 * It checks if the user's name is already in the `window.assignees` array and either adds or removes it.
 * After updating the array, it re-renders the assignees list and the list of users to assign.
 * @param {string} name - The name of the user whose assignment status is being toggled.
 * @param {string} containerId - The ID of the dropdown container for assignees (e.g., "assigned-to-dropdown-edit").
 */
function toggleAssigned(name, containerId) {
    const index = window.assignees.indexOf(name);
    if (index > -1) {
        window.assignees.splice(index, 1);
    } else {
        window.assignees.push(name);
    }
    const dropdown = document.getElementById(containerId);
    renderAssigneesEdit(containerId, dropdown);
    renderUsersToAssignEdit();
}

/**
 * Extracts the initials of a given name. If the name has multiple parts, it takes the first letter of the first two parts.
 * If the name has only one part or is empty, it returns the first letter or a question mark respectively.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user's name in uppercase.
 */
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Toggles the visibility of a dropdown element in the edit overlay.
 * It also toggles the visibility of the associated closed and open arrow icons.
 * @param {string} dropdownId - The ID of the dropdown element to toggle.
 * @param {Event} event - The click event that triggered the toggle. It's stopped from propagating.
 */
function toggleDropdownSelectionInEdit(dropdownId, event) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    const arrowClosed = document.getElementById(`${dropdownId}-closed`);
    const arrowOpen = document.getElementById(`${dropdownId}-open`);
    const isOpen = !dropdown.classList.contains("d_none");
    if (isOpen) {
        dropdown.classList.add("d_none");
        arrowClosed.classList.remove("d_none");
        arrowOpen.classList.add("d_none");
    } else {
        dropdown.classList.remove("d_none");
        arrowClosed.classList.add("d_none");
        arrowOpen.classList.remove("d_none");
    }
}

/**
 * Retrieves a task object from the global `tasks` array based on its ID.
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Object | undefined} The task object if found, otherwise undefined.
 */
function getTaskById(id) {
    return tasks.find((t) => t.id === id);
}

/**
 * Hides the task editing overlay by adding the 'hidden' class to its element.
 */
function closeEditOverlay() {
    document.getElementById("editTaskOverlay").classList.add("hidden");
}

/**
 * Sets up event listeners for all priority buttons (Urgent, Medium, Low) in the edit overlay.
 * When a button is clicked, it removes the 'selected' class and resets the styling of all other priority buttons,
 * and then adds the 'selected' class and activates the styling for the clicked button.
 */
function setupPrioritySelection() {
    const buttons = document.querySelectorAll("#urgent, #medium, #low");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((btn) => {
                btn.classList.remove("selected");
                resetPriority(btn);
            });
            button.classList.add("selected");
            activatePriority(button);
        });
    });
}


/**
 * Resets the visual styling of a priority button to its default state.
 * This includes setting the background color to white, text color to black,
 * font weight to normal, and resetting the fill color of the SVG path based on the button's ID.
 * @param {HTMLElement} button - The priority button element to reset.
 */
function resetPriority(button) {
    button.style.backgroundColor = "#ffffff";
    button.style.color = "#000000";
    button.style.fontWeight = "normal";
    const paths = button.querySelectorAll("svg path");
    paths.forEach((path) => setDefaultColor(path, button.id));
}

/**
 * Sets the default fill color of an SVG path within a priority button based on the button's ID.
 * @param {SVGPathElement} path - The SVG path element to style.
 * @param {string} id - The ID of the priority button ("urgent", "medium", or "low").
 */
function setDefaultColor(path, id) {
    if (id === "urgent") path.setAttribute("fill", "#FF3D00");
    if (id === "medium") path.setAttribute("fill", "#FFA800");
    if (id === "low") path.setAttribute("fill", "#7AE229");
}

/**
 * Activates the visual styling of a priority button to indicate it is selected.
 * This includes setting the background color based on the priority, text color to white,
 * font weight to bold, and setting the fill color of the SVG path to white.
 * @param {HTMLElement} button - The priority button element to activate.
 */
function activatePriority(button) {
    button.style.backgroundColor = button.id === "urgent" ? "#FF3D00" : button.id === "medium" ? "#FFA800" : "#7AE229";
    button.style.color = "#ffffff";
    button.style.fontWeight = "bold";
    const paths = button.querySelectorAll("svg path");
    paths.forEach((path) => path.setAttribute("fill", "#ffffff"));
}

/**
 * Initializes the "Assigned to" dropdown in the edit overlay by ensuring the `window.userNames` array is populated
 * with at least some default values if no data has been loaded yet.
 */
function setupAssignedToDropdown() {
    if (!window.userNames || window.userNames.length === 0) {
        window.userNames = ["Max Mustermann", "Erika Musterfrau"];
    }
}

/**
 * Sets up the event listeners for the "Assigned to" dropdown in the edit overlay.
 * It handles the click event on the dropdown arrow to open and close the dropdown,
 * and a global click listener to close the dropdown if the user clicks outside of it.
 */
function setupEditDropdownEvents() {
    const arrow = document.getElementById("select-arrow-edit");
    const wrapper = document.querySelector(".dropdown-field-wrapper");
    const dropdown = document.getElementById("assigned-to-dropdown-edit");
    if (!arrow || !wrapper || !dropdown) return;
    arrow.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains("d_none");

        if (isOpen) {
            closeEditDropdown(dropdown, arrow);
        } else {
            openEditDropdown(dropdown, arrow);
        }
    });
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            closeEditDropdown(dropdown, arrow);
        }
    });
}

/**
 * Opens the specified dropdown element in the edit overlay and updates the visual state of the dropdown arrow.
 * @param {HTMLElement} dropdown - The dropdown element to open.
 * @param {HTMLElement} arrow - The arrow icon element of the dropdown.
 */
function openEditDropdown(dropdown, arrow) {
    dropdown.classList.remove("d_none");
    arrow.classList.remove("closed");
    arrow.classList.add("open");
}

/**
 * Closes the specified dropdown element in the edit overlay and updates the visual state of the dropdown arrow.
 * @param {HTMLElement} dropdown - The dropdown element to close.
 * @param {HTMLElement} arrow - The arrow icon element of the dropdown.
 */
function closeEditDropdown(dropdown, arrow) {
    dropdown.classList.add("d_none");
    arrow.classList.remove("open");
    arrow.classList.add("closed");
}

/**
 * Binds event listeners to the add, clear, and confirm buttons for subtask input in the edit overlay.
 * Clicking the add button shows the confirm and clear icons.
 * Clicking the clear or confirm button resets the input field and hides the confirm/clear icons.
 */
function setupSubtaskInput() {
    const input = document.getElementById("subtasks-edit");
    const addBtn = document.getElementById("edit-add-subtask-icon");
    const confirmWrap = document.getElementById("confirm-icons");
    const confirmBtn = document.getElementById("confirm-icon");
    const clearBtn = document.getElementById("clear-icon");
    addBtn.addEventListener("click", () =>
        showConfirm(input, confirmWrap, addBtn)
    );
    clearBtn.addEventListener("click", () =>
        resetInput(input, confirmWrap, addBtn)
    );
    confirmBtn.addEventListener("click", () =>
        resetInput(input, confirmWrap, addBtn)
    );
}

/**
 * Shows the confirm (check mark) and cancel (X) icons next to the subtask input field
 * and hides the add icon, while also focusing on the input field.
 * @param {HTMLInputElement} input - The subtask input field.
 * @param {HTMLElement} confirm - The container for the confirm and clear icons.
 * @param {HTMLElement} add - The add subtask icon.
 */
function showConfirm(input, confirm, add) {
    add.classList.add("d-none");
    confirm.classList.remove("d-none");
    input.focus();
}

/**
 * Resets the subtask input field by clearing its value and hiding the confirm/clear icons,
 * while making the add icon visible again.
 * @param {HTMLInputElement} input - The subtask input field.
 * @param {HTMLElement} confirm - The container for the confirm and clear icons.
 * @param {HTMLElement} add - The add subtask icon.
 */
function resetInput(input, confirm, add) {
    input.value = "";
    confirm.classList.add("d-none");
    add.classList.remove("d-none");
}

/**
 * Renders the subtasks of a given task into the specified container element in the edit overlay.
 * For each subtask, it creates a list item with the subtask title and edit/delete icons.
 * @param {object} task - The task object containing the subtasks.
 * @param {HTMLElement} container - The HTML element to append the subtask list items to.
 */
function renderSubtasks(task, container) {
    container.innerHTML = "";
    const subtasks = task.subtasks || window.subtaskArray;
    if (Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask, index) => {
            const [key, value] = Object.entries(subtask)[0];
            const subtaskItem = document.createElement("div");
            subtaskItem.classList.add("subtask-list-item");
            subtaskItem.style.listStyle = "none";
            subtaskItem.style.display = "flex";
            subtaskItem.style.justifyContent = "space-between";
            subtaskItem.style.alignItems = "center";
            subtaskItem.style.padding = "6px 16px";
            subtaskItem.innerHTML = `
                <div class="subtask-list-item-content-wrapper" style="width: 100%;">
                    <span> ${value}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <span class="edit-icon" data-index="${index}"></span>
                    <span class="delete-icon" data-index="${index}"></span>
                </div>
            `;
            container.appendChild(subtaskItem);
        });
    }
}

/**
 * Populates the edit overlay with the details of a given task.
 * It fills the title, description, and due date fields, updates the priority selection,
 * renders the subtasks, and sets up the subtask input and list event handlers.
 * Finally, it opens the edit overlay.
 * @param {object} task - The task object whose details will be displayed in the edit overlay.
 */
function populateEditOverlay(task) {
    const overlay = document.getElementById("editTaskOverlay");
    const titleInput = overlay.querySelector(".edit-input[placeholder='Enter a title']");
    const descriptionTextarea = overlay.querySelector(".edit-textarea[placeholder='Enter a Description']");
    const dueDateInput = overlay.querySelector("#due-date");
    const subtaskInput = overlay.querySelector("#subtasks-edit");
    const addSubtaskIcon = document.getElementById("edit-add-subtask-icon");
    const subtaskListContainer = document.getElementById("subtaskList");
    const priorityButtons = overlay.querySelectorAll(".priority-labels");
    fillFormFields(task, titleInput, descriptionTextarea, dueDateInput);
    updatePrioritySelection(task.priority, priorityButtons);
    renderSubtasks(task, subtaskListContainer);
    subtaskInput.value = "";
    openEditOverlay(task);
    setupSubtaskAdd(addSubtaskIcon, subtaskInput, task, subtaskListContainer);
    setupSubtaskListEvents(subtaskListContainer, task);
}

/**
 * Fills the title, description, and due date input fields in the edit overlay with the corresponding task data.
 * @param {object} task - The task object containing the data.
 * @param {HTMLInputElement} titleInput - The input field for the task title.
 * @param {HTMLTextAreaElement} descriptionTextarea - The textarea for the task description.
 * @param {HTMLInputElement} dueDateInput - The input field for the task due date.
 */
function fillFormFields(task, titleInput, descriptionTextarea, dueDateInput) {
    titleInput.value = task.title;
    descriptionTextarea.value = task.description;
    dueDateInput.value = task.dueDate;
}

/**
 * Updates the priority selection in the edit overlay based on the task's priority.
 * It resets all priority buttons and then activates the one matching the task's priority.
 * @param {string} priority - The priority of the task ("urgent", "medium", or "low").
 * @param {NodeListOf<HTMLElement>} buttons - A list of all priority button elements.
 */
function updatePrioritySelection(priority, buttons) {
    buttons.forEach((btn) => {
        resetPriority(btn);
        btn.classList.remove("selected");
        if (btn.id === priority) {
            activatePriority(btn);
            btn.classList.add("selected");
        }
    });
}

/**
 * Sets up the event listener for adding a new subtask in the edit overlay.
 * When the add button is clicked, it takes the value from the input field,
 * adds it as a new subtask to the task object, re-renders the subtask list, and clears the input.
 * @param {HTMLElement} addBtn - The button to add a new subtask.
 * @param {HTMLInputElement} input - The input field for the new subtask title.
 * @param {object} task - The task object to which the subtask will be added.
 * @param {HTMLElement} container - The container for the subtask list.
 */
function setupSubtaskAdd(addBtn, input, task, container) {
    addBtn.addEventListener("click", () => {
        const newTitle = input.value.trim();
        if (newTitle) {
            window.subtaskArray.push({ [`subtask-${window.subtaskArray.length}`]: newTitle });
            renderSubtasks({ subtasks: window.subtaskArray }, container); // ⬅️ geändert
            input.value = "";
        }
    });
}


/**
 * Sets up event listeners for the subtask list in the edit overlay to handle deleting and editing subtasks.
 * It listens for clicks on the delete and edit icons within each subtask list item.
 * @param {HTMLElement} container - The container for the subtask list.
 * @param {object} task - The task object whose subtasks are being displayed.
 */
function setupSubtaskListEvents(container, task) {
    container.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        if (e.target.classList.contains("delete-icon")) {
            window.subtaskArray.splice(index, 1);
            renderSubtasks({ subtasks: window.subtaskArray }, container); // ⬅️ geändert
        } else if (e.target.classList.contains("edit-icon")) {
            startEditingSubtask(e, task, index, container);
        }
    });
}


/**
 * Initiates the editing process for a subtask within the edit overlay.
 * It finds the corresponding list item, creates an input field with the current subtask text,
 * prepares the icons for editing (hides the edit icon), ensures the delete icon is visible,
 * creates a confirm button, replaces the icons in the item, binds the edit actions (save and cancel),
 * focuses on the input field, and visually marks the list item as active.
 * @param {MouseEvent} e - The mouse event triggered by clicking the edit icon.
 * @param {object} task - The task object containing the subtasks.
 * @param {number} index - The index of the subtask being edited in the task's subtasks array.
 * @param {HTMLElement} container - The container element of the subtask list.
 */
function startEditingSubtask(e, task, index, container) {
    const item = e.target.closest(".subtask-list-item");
    const input = createSubtaskEditInput(item);
    if (!input) return;
    const iconWrapper = getIconWrapper(item);
    if (!iconWrapper) return;
    prepareIconsForEditing(iconWrapper);
    const deleteIcon = ensureDeleteIconVisible(iconWrapper);
    const confirmBtn = createConfirmButton();
    replaceIcons(iconWrapper, deleteIcon, confirmBtn);
    bindEditActions(input, confirmBtn, deleteIcon, task, index, container);
    input.focus();
    item.classList.add("subtask-list-item-active");
}

/**
 * Creates an input element for editing a subtask, populates it with the current subtask text,
 * and replaces the span containing the text with the new input element in the DOM.
 * @param {HTMLElement} item - The list item containing the subtask to be edited.
 * @returns {HTMLInputElement} The created input element for editing.
 */
function createSubtaskEditInput(item) {
    if (!item) return null;
    const textWrapper = item.querySelector(".subtask-list-item-content-wrapper");
    if (!textWrapper) return null;
    const textEl = textWrapper.querySelector("span");
    if (!textEl) return null;
    const oldText = textEl.textContent.trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.classList.add("subtask-item-input");
    textWrapper.innerHTML = "";
    textWrapper.appendChild(input);
    return input;
}

/**
 * Retrieves the second child element of a given list item, which is expected to be the wrapper for the edit and delete icons.
 * @param {HTMLElement} item - The list item whose icon wrapper is to be retrieved.
 * @returns {HTMLElement | null} The icon wrapper element or null if not found.
 */
function getIconWrapper(item) {
    return item.querySelector("div:nth-child(2)");
}

/**
 * Removes the edit icon from the icon wrapper of a subtask list item, preparing it for editing actions.
 * @param {HTMLElement} iconWrapper - The wrapper element containing the edit and delete icons.
 */
function prepareIconsForEditing(iconWrapper) {
    const editIcon = iconWrapper.querySelector(".edit-icon");
    if (editIcon) editIcon.remove();
}

/**
 * Ensures that the delete icon in the icon wrapper is visible and interactive during subtask editing.
 * @param {HTMLElement} iconWrapper - The wrapper element containing the delete icon.
 * @returns {HTMLElement | null} The delete icon element or null if not found.
 */
function ensureDeleteIconVisible(iconWrapper) {
    const deleteIcon = iconWrapper.querySelector(".delete-icon");
    if (deleteIcon) {
        deleteIcon.style.display = "flex";
        deleteIcon.style.visibility = "visible";
        deleteIcon.style.opacity = "1";
        deleteIcon.style.pointerEvents = "auto";
    }
    return deleteIcon;
}

/**
 * Creates a span element that serves as a confirm button (check mark icon) for saving edited subtasks.
 * The icon is initially hidden.
 * @returns {HTMLSpanElement} The created confirm button element.
 */
function createConfirmButton() {
    return createIcon(
        "confirm-icon",
        `<img src="/assets/img/icons/confirm_icon.png" alt="Confirm" width="16" style="cursor: pointer; display: none;">`
    );
}

/**
 * Clears the content of the icon wrapper and appends the delete icon and the confirm button to it.
 * This replaces the edit icon with the save and delete options during editing.
 * @param {HTMLElement} iconWrapper - The wrapper element for the icons.
 * @param {HTMLElement} deleteIcon - The delete icon element.
 * @param {HTMLElement} confirmBtn - The confirm button element.
 */
function replaceIcons(iconWrapper, deleteIcon, confirmBtn) {
    iconWrapper.innerHTML = "";
    iconWrapper.appendChild(deleteIcon);
    iconWrapper.appendChild(confirmBtn);
}

/**
 * Binds the functionality to the delete and confirm buttons that appear when a subtask is being edited.
 * Clicking the delete icon re-renders the subtask list (effectively canceling the edit).
 * Clicking the confirm button saves the edited text to the task's subtasks array and re-renders the list.
 * @param {HTMLInputElement} input - The input field where the subtask is being edited.
 * @param {HTMLElement} confirmBtn - The confirm button element.
 * @param {HTMLElement} deleteIcon - The delete icon element.
 * @param {object} task - The task object containing the subtasks.
 * @param {number} index - The index of the subtask being edited.
 * @param {HTMLElement} container - The container element of the subtask list.
 */
function bindEditActions(input, confirmBtn, deleteIcon, task, index, container) {
    deleteIcon.onclick = () => {
        renderSubtasks({ subtasks: window.subtaskArray }, container);
    };
    confirmBtn.onclick = () => {
        const newText = input.value.trim();
        if (newText) {
            const key = Object.keys(window.subtaskArray[index])[0];
            window.subtaskArray[index] = { [key]: newText };
            renderSubtasks({ subtasks: window.subtaskArray }, container);
        }
    };
}

/**
 * Creates a span element with a given class name and inner HTML content.
 * This is a utility function for creating icon elements.
 * @param {string} className - The CSS class to add to the span element.
 * @param {string} content - The inner HTML content of the span element.
 * @returns {HTMLSpanElement} The created span element.
 */
function createIcon(className, content) {
    const span = document.createElement("span");
    span.classList.add(className);
    span.innerHTML = content;
    return span;
}

/**
 * Binds event listeners to the confirm and cancel buttons that appear during subtask editing.
 * Clicking confirm saves the edited text, and clicking cancel reverts to the original text.
 * After either action, the visual state of the list item is reset.
 * @param {HTMLInputElement} input - The input field where the subtask is being edited.
 * @param {HTMLElement} confirmBtn - The confirm button element.
 * @param {HTMLElement} cancelBtn - The cancel button element.
 * @param {object} task - The task object containing the subtasks.
 * @param {number} index - The index of the subtask being edited.
 * @param {HTMLElement} container - The container element of the subtask list.
 * @param {HTMLElement} item - The list item being edited.
 */
function bindEditSaveCancel(input, confirmBtn, cancelBtn, task, index, container, item) {
    confirmBtn.addEventListener("click", () => {
        const newText = input.value.trim();
        if (newText) {
            const key = Object.keys(window.subtaskArray[index])[0];
            window.subtaskArray[index] = { [key]: newText };
            renderSubtasks({ subtasks: window.subtaskArray }, container);
        }
        item.classList.remove("subtask-list-item-active");
    });
    cancelBtn.addEventListener("click", () => {
        renderSubtasks({ subtasks: window.subtaskArray }, container);
        item.classList.remove("subtask-list-item-active");
    });
    input.addEventListener("click", (ev) => ev.stopPropagation());
}


/**
 * Saves the changes made in the edit overlay to the corresponding task object in the `tasks` array.
 * It retrieves the updated values from the input fields, priority selection, assignees, and subtasks,
 * updates the task object, saves the `tasks` array to local storage or Firebase, re-renders the board columns,
 * and closes the edit overlay.
 */
function saveEdit() {
    const overlay = document.getElementById("editTaskOverlay");
    const taskId = document.getElementById("task-card-modal").getAttribute("data-task-id");
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const updatedTask = { ...tasks[taskIndex] };
    updatedTask.title = getOverlayValue(overlay, ".edit-input[placeholder='Enter a title']");
    updatedTask.description = getOverlayValue(overlay, ".edit-textarea[placeholder='Enter a Description']");
    updatedTask.dueDate = overlay.querySelector("#due-date").value;
    updatedTask.priority = overlay.querySelector(".priority-labels.selected")?.id || "";
    updatedTask.assignedTo = [...window.assignees];
    // ⛏ Hier: statt extractSubtasksFromDOM()
    updatedTask.subtasks = window.subtaskArray.map(sub => ({ ...sub }));
    tasks[taskIndex] = updatedTask;
    saveTasksToStorageOrFirebase();
    renderAllColumns();
    closeEditOverlay();
}


/**
 * Retrieves the trimmed value of an element within a given overlay based on a CSS selector.
 * If the element is not found, it returns an empty string.
 * @param {HTMLElement} overlay - The overlay element to search within.
 * @param {string} selector - The CSS selector to identify the element.
 * @returns {string} The trimmed value of the element or an empty string if not found.
 */
function getOverlayValue(overlay, selector) {
    const element = overlay.querySelector(selector);
    return element ? element.value.trim() : "";
}

/**
 * Extracts the subtasks from the DOM in the edit overlay.
 * It selects all subtask content wrappers, maps them to an array of subtask objects (key-value pairs),
 * and filters out any empty subtasks.
 * @returns {Array<Object>} An array of subtask objects, where each object has a single key-value pair representing the subtask text.
 */
function extractSubtasksFromDOM() {
    const subtaskWrappers = document.querySelectorAll("#subtaskList .subtask-list-item-content-wrapper");
    return Array.from(subtaskWrappers)
        .map((wrapper) => {
            const input = wrapper.querySelector("input");
            const span = wrapper.querySelector("span");
            const text = input ? input.value.trim() : span?.textContent.trim() || "";
            return { [text]: text };
        }).filter((subtask) => Object.keys(subtask)[0] !== "");
}