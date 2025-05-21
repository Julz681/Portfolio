
/**
 * Creates a new task object if all required input fields are valid.
 * It gathers the task details, resets the task form, adds the new task to a local array,
 * saves it to local storage, and performs actions based on the current window location.
 * @param {string} dateFieldId - The ID of the input field for the due date.
 */
function createTask(dateFieldId) {
    if (checkAllRequiredValues(dateFieldId) === true) {
        return;
    } else {
        let taskId = "task-" + (tasks.length + newTasks.length + 1);
        let taskObject = createTaskObject(taskId, dateFieldId);
        resetTaskHTML();
        newTasks.push(taskObject);
        sendTaskToLocalStorage(newTasks);
        checkWindowLocation(taskObject);
        showTaskSuccessMessage();
    }
}

/**
 * Checks the current window location and performs specific actions after a task is created.
 * If on the board page, it adds the new task to the global `tasks` array (if it exists)
 * and re-renders the columns. It also closes the task form.
 * @param {Object} taskObject - The newly created task object.
 */
function checkWindowLocation(taskObject) {
    if (window.location.pathname === "/html/board.html") {
        if (!window.tasks) window.tasks = [];
        window.tasks.push(taskObject);
        if (typeof renderAllColumns === "function") {
            renderAllColumns();
        }
        closeTaskForm();
    }
}

/**
 * Creates a task object with data from the input fields.
 * @param {string} taskId - The unique ID for the new task.
 * @param {string} dateFieldId - The ID of the input field for the due date.
 * @returns {Object} An object containing all the data for the new task.
 */
/**
 * Creates a task object with data from the input fields.
 * @param {string} taskId - The unique ID for the new task.
 * @param {string} dateFieldId - The ID of the input field for the due date.
 * @returns {Object} An object containing all the data for the new task.
 */
function createTaskObject(taskId, dateFieldId) {
    return {
        id: taskId,
        title: getInputContainer("task-title").value,
        description: getInputContainer("task-description").value,
        priority: getTaskPriority(),
        dueDate: getInputContainer(dateFieldId).value,
        taskType: getTaskType(),
        assignedTo: [...assignees],
        subtasks: subtaskArray.map(subtask => ({ ...subtask })), 
        status: "to-do",
    };
}

/**
 * Determines the task type (user story or technical) based on the placeholder text of the category input field.
 * @returns {string} The type of the task ("userStory" or "technical").
 */
function getTaskType() {
    // return getInputContainer("category").value;
    let type = getInputContainer("category").placeholder;
    if (type === "User Story") {
        return "userStory";
    } else {
        return "technical";
    }
}

/**
 * Checks if all required input fields in the task form have valid values.
 * It calls individual validation functions for the title, due date, and category.
 * @param {string} dateFieldId - The ID of the input field for the due date.
 * @returns {boolean} True if any of the required fields are invalid, false otherwise.
 */
function checkAllRequiredValues(dateFieldId) {
    let requiredErrorContainers = [getErrorContainer("task-title-error"), getErrorContainer("due-date-required-error-message"), getErrorContainer("category-error"),];
    checkTitleInputValue(`task-title-error`, `value-length-error`, `task-title`);
    checkDateInput(dateFieldId);
    checkCategoryInputPlaceholder("category-error");
    for (let index = 0; index < requiredErrorContainers.length; index++) {
        if (!requiredErrorContainers[index].classList.contains("d_none")) {
            return true;
        }
    }
}

/**
 * Determines the selected priority of the task by checking which priority label does not have the default background class.
 * @returns {string | undefined} The ID of the selected priority label ("low", "medium", or "urgent"), or undefined if none is selected.
 */
function getTaskPriority() {
    let priorityButtonsRef = document.getElementsByClassName("priority-labels");
    for (let index = 0; index < priorityButtonsRef.length; index++) {
        if (!priorityButtonsRef[index].classList.contains("default-prio-bg"))
            return priorityButtonsRef[index].id;
    }
}

/**
 * Resets all input fields and selections in the task creation form to their default states.
 * This includes clearing text inputs, resetting the date picker, resetting the category placeholder,
 * resetting priority labels, clearing the subtask list, and clearing the assignees.
 */
function resetTaskHTML() {
    getInputContainer("task-title").value = "";
    suppressEvents = true;
    fp.clear();
    suppressEvents = false;
    getInputContainer("task-description").value = "";
    getInputContainer("category").placeholder = "Select task category";
    resetPriorityLabels();
    resetSubtasksList();
    resetAssignees();
}

/**
 * Resets the visual styling of all priority labels to their default state.
 * This includes setting the background color, text color, and icon color.
 */
function resetPriorityLabels() {
    let priorityLabels = document.getElementsByClassName("priority-labels");
    for (let index = 0; index < priorityLabels.length; index++) {
        if (priorityLabels[index].id != 'medium') {
            resetLabelToDefault(priorityLabels[index]);
        } else {
            priorityLabels[index].classList.add("medium-prio-bg");
            priorityLabels[index].style.color = "#ffffff";
            let priorityIconParts = getPriorityIconParts(priorityLabels[index].id);
            switchPriorityIconColor(priorityIconParts, "#ffffff")
        }
    }
}

function resetLabelToDefault(priorityLabel) {
    priorityLabel.classList.add("default-prio-bg");
    priorityLabel.classList.remove("low-prio-bg", "medium-prio-bg", "urgent-prio-bg", "weight-700");
    priorityLabel.style.color = "#000000";
    resetIconColor(priorityLabel);
}

/**
 * Resets the subtask list by clearing the `subtaskArray` and the inner HTML of the subtask list container.
 */
function resetSubtasksList() {
    subtaskArray = [];
    document.getElementById("subtask-list").innerHTML = "";
    document.getElementById("subtask-list").classList.add("d_none");
}

/**
 * Resets the color of the priority icon associated with a given label.
 * @param {HTMLElement} label - The HTML element of the priority label.
 */
function resetIconColor(label) {
    let id = label.id;
    let color = getPriorityColor(id);
    let icon = getPriorityIconParts(id);
    switchPriorityIconColor(icon, color);
}

/**
 * Resets the assignees array and re-renders the assignees list in the task form.
 */
function resetAssignees() {
    assignees = [];
    let assigneesContainerRef = document.getElementById("assignees-list-task-form");
    renderAssignees("assigned-to-dropdown", assigneesContainerRef);
}

/**
 * Sends an array of task objects to the local storage by stringifying it.
 * @param {Array<Object>} object - The array of task objects to store.
 */
function sendTaskToLocalStorage(object) {
    localStorage.setItem("tasks", JSON.stringify(object));
}

/**
 * Shows a temporary success message after a task is created.
 */
function showTaskSuccessMessage() {
    let msg = document.getElementById("success-message");
    msg.classList.remove("d_none");
    msg.classList.add("show");
    setTimeout(() => {
        msg.classList.remove("show");
        msg.classList.add("d_none");
        redirectToBoard();
    }, 2000);
}

/**
 * Redirects the user to the board page if they are not already on it.
 * Normalizes the current path to use forward slashes and checks against expected board URLs.
 */
function redirectToBoard() {
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    if (currentPath !== '/html/board.html' && currentPath !== '/board.html') {
        window.location.href = '/html/board.html';
    }
}

