/**
 * Asynchronously opens the task editing overlay, populating all input fields with the data
 * of the provided task object and updating the visual states of UI elements like priority buttons
 * and the assignees list. It also fetches user names if they are not already loaded.
 * @async
 * @param {Object} task - The task object containing the data to populate the edit form.
 */
async function openEditOverlay(task) {
  if (!task) return;

  await prepareAssignees(task);
  const overlay = getEditOverlay();
  if (!overlay) return;

  fillEditFormFields(task, overlay);
  updatePriorityButtons(task, overlay);
  renderAssigneesEditUI();
  renderSubtaskSection(task);
  setupAllBehaviors();
}

/**
 * Loads user names from the database if not already available,
 * and prepares the list of assigned users for editing.
 * @async
 * @param {Object} task - The task object containing assigned user information.
 */
async function prepareAssignees(task) {
  if (!window.userNames || window.userNames.length === 0) {
    window.userNames = await getUsersFromDatabase();
  }
  window.assignees = Array.isArray(task.assignedTo) ? [...task.assignedTo] : [];
}

/**
 * Retrieves and shows the edit overlay element.
 * @returns {HTMLElement|null} The edit task overlay DOM element, or null if not found.
 */
function getEditOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) overlay.classList.remove("hidden");
  return overlay;
}

/**
 * Populates the form fields in the edit overlay with data from the given task object.
 * @param {Object} task - The task whose data should fill the form.
 * @param {HTMLElement} overlay - The DOM element representing the edit overlay.
 */
function fillEditFormFields(task, overlay) {
  const titleInput = overlay.querySelector(
    ".edit-input[placeholder='Enter a title']"
  );
  const descriptionTextarea = overlay.querySelector(
    ".edit-textarea[placeholder='Enter a Description']"
  );
  const dueDateInput = overlay.querySelector("#due-date");

  titleInput.value = task.title || "";
  descriptionTextarea.value = task.description || "";

  if (dueDateInput._flatpickr && task.dueDate) {
    dueDateInput._flatpickr.setDate(task.dueDate, true, "d/m/Y");
  }
}

/**
 * Updates the priority buttons in the edit overlay based on the task's priority.
 * @param {Object} task - The task object containing priority information.
 * @param {HTMLElement} overlay - The edit overlay DOM element.
 */
function updatePriorityButtons(task, overlay) {
  const priorityButtons = overlay.querySelectorAll(".priority-labels");
  priorityButtons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");
    if (btn.id === task.priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });
}

/**
 * Sets up all interactive behaviors within the edit overlay,
 * such as dropdowns, date pickers, subtasks, and priority selection.
 */
function setupAllBehaviors() {
  setupEditDropdownEvents();
  setupPrioritySelection();
  setupSubtaskInput();
  setupAllDatePickers();
}

/**
 * Returns the correct DOM element for displaying assigned users,
 * depending on the dropdown type (edit or add view).
 * @param {string} containerId - ID of the dropdown.
 * @returns {HTMLElement|null} - The assignees container element.
 */
function getAssigneesContainer(containerId) {
  const id =
    containerId === "assigned-to-dropdown-edit"
      ? "assignees-list-edit"
      : "assignees-list";
  return document.getElementById(id);
}

/**
 * Hides the task editing overlay by adding the 'hidden' class to its element.
 */
function closeEditOverlay() {
  document.getElementById("editTaskOverlay").classList.add("hidden");
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
 * Populates the edit overlay with the details of a given task.
 * It fills the title, description, and due date fields, updates the priority selection,
 * renders the subtasks, and sets up the subtask input and list event handlers.
 * Finally, it opens the edit overlay.
 * @param {object} task - The task object whose details will be displayed in the edit overlay.
 */
function populateEditOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  const titleInput = overlay.querySelector(
    ".edit-input[placeholder='Enter a title']"
  );
  const descriptionTextarea = overlay.querySelector(
    ".edit-textarea[placeholder='Enter a Description']"
  );
  const dueDateInput = overlay.querySelector("#due-date");
  const subtaskInput = overlay.querySelector("#subtasks-edit");

  const addSubtaskIcon = document.getElementById("edit-add-subtask-icon");
  const subtaskListContainer = document.getElementById("subtaskList");
  const priorityButtons = overlay.querySelectorAll(".priority-labels");

  fillFormFields(task, titleInput, descriptionTextarea, dueDateInput);
  updatePrioritySelection(task.priority, priorityButtons);
  finishOverlaySetup(task, subtaskInput, addSubtaskIcon, subtaskListContainer);
}

function fillFormFields(task, titleInput, descriptionTextarea, dueDateInput) {
  titleInput.value = task.title || "";
  descriptionTextarea.value = task.description || "";

  if (dueDateInput._flatpickr && task.dueDate) {
    dueDateInput._flatpickr.setDate(task.dueDate, true, "d/m/Y");
  }
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
      if (!Array.isArray(task.subtasks)) task.subtasks = [];
      task.subtasks.push({ [newTitle]: newTitle });
      renderSubtasks(task, container);
      input.value = "";
    }
  });
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
function bindEditActions(
  input,
  confirmBtn,
  deleteIcon,
  task,
  index,
  container
) {
  deleteIcon.onclick = () => {
    renderSubtasks(task, container);
  };

  confirmBtn.onclick = () => {
    const newText = input.value.trim();
    if (newText) {
      const key = Object.keys(task.subtasks[index])[0];
      task.subtasks[index] = { [key]: newText };
      renderSubtasks(task, container);
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
function bindEditSaveCancel(
  input,
  confirmBtn,
  cancelBtn,
  task,
  index,
  container,
  item
) {
  confirmBtn.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText) {
      const key = Object.keys(task.subtasks[index])[0];
      task.subtasks[index] = { [key]: newText };
      renderSubtasks(task, container);
    }
    item.classList.remove("subtask-list-item-active");
  });

  cancelBtn.addEventListener("click", () => {
    renderSubtasks(task, container);
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
  const taskId = getTaskIdFromOverlay();
  const taskIndex = findTaskIndexById(taskId);
  if (taskIndex === -1) return;

  const updatedTask = buildUpdatedTask(overlay, tasks[taskIndex]);
  tasks[taskIndex] = updatedTask;

  saveTasksToStorageOrFirebase();
  renderAllColumns();
  closeEditOverlay();
}

function getTaskIdFromOverlay() {
  return document
    .getElementById("task-card-modal")
    .getAttribute("data-task-id");
}

function findTaskIndexById(taskId) {
  return tasks.findIndex((t) => t.id === taskId);
}

function buildUpdatedTask(overlay, oldTask) {
  return {
    ...oldTask,
    title: getOverlayValue(overlay, ".edit-input[placeholder='Enter a title']"),
    description: getOverlayValue(
      overlay,
      ".edit-textarea[placeholder='Enter a Description']"
    ),
    dueDate: overlay.querySelector("#due-date").value,
    priority: overlay.querySelector(".priority-labels.selected")?.id || "",
    assignedTo: [...window.assignees],
    subtasks: extractSubtasksFromDOM(),
  };
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
  const subtaskWrappers = document.querySelectorAll(
    "#subtaskList .subtask-list-item-content-wrapper"
  );
  return Array.from(subtaskWrappers)
    .map((wrapper) => {
      const input = wrapper.querySelector("input");
      const span = wrapper.querySelector("span");
      const text = input ? input.value.trim() : span?.textContent.trim() || "";
      return { [text]: text };
    })
    .filter((subtask) => Object.keys(subtask)[0] !== "");
}