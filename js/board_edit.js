/**
 * Makes the assignee container visible.
 * @param {HTMLElement} container - The container to show.
 */
function showAssigneeContainer(container) {
  container.classList.remove("d_none");
}

/**
 * Hides the assignee container.
 * @param {HTMLElement} container - The container to hide.
 */
function hideAssigneeContainer(container) {
  container.classList.add("d_none");
}

/**
 * Creates and appends avatar elements for each assigned user.
 * @param {HTMLElement} container - The element where avatars will be appended.
 */
function renderAssigneeAvatars(container) {
  window.assignees.forEach((name) => {
    const initials = getInitials(name);
    const bgColor = getIconBackgroundColor(initials);
    const avatarHTML = getAvatarTemplate(initials, bgColor);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = avatarHTML;
    container.appendChild(wrapper.firstElementChild);
  });
}

/**
 * Toggles a user's assignment in the edit overlay.
 * Updates the assignee list and re-renders UI.
 * @param {string} name - User name to toggle.
 * @param {string} containerId - ID of the assignee dropdown.
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
 * Styles a priority button as active.
 * Sets color, weight, and SVG fill.
 * @param {HTMLElement} button - The button to style.
 */
function activatePriority(button) {
  button.style.backgroundColor =
    button.id === "urgent"
      ? "#FF3D00"
      : button.id === "medium"
      ? "#FFA800"
      : "#7AE229";

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

  bindDropdownArrowClick(arrow, dropdown);
  bindOutsideDropdownClose(wrapper, dropdown, arrow);
}

function bindDropdownArrowClick(arrow, dropdown) {
  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains("d_none");

    if (isOpen) {
      closeEditDropdown(dropdown, arrow);
    } else {
      openEditDropdown(dropdown, arrow);
    }
  });
}

function bindOutsideDropdownClose(wrapper, dropdown, arrow) {
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      closeEditDropdown(dropdown, arrow);
    }
  });
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

  if (!Array.isArray(task.subtasks)) return;

  task.subtasks.forEach((subtask, index) => {
    const subtaskElement = createSubtaskElement(subtask, index);
    container.appendChild(subtaskElement);
  });
}

function createSubtaskElement(subtask, index) {
  const [key, value] = Object.entries(subtask)[0];

  const subtaskItem = document.createElement("div");
  subtaskItem.classList.add("subtask-list-item");

  applySubtaskStyles(subtaskItem);
  subtaskItem.innerHTML = getSubtaskItemTemplate(value, index);

  return subtaskItem;
}

function applySubtaskStyles(element) {
  element.style.listStyle = "none";
  element.style.display = "flex";
  element.style.justifyContent = "space-between";
  element.style.alignItems = "center";
  element.style.padding = "6px 16px";
}

function updatePrioritySelection(priority, priorityButtons) {
  priorityButtons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");

    if (btn.id === priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });
}

function finishOverlaySetup(
  task,
  subtaskInput,
  addSubtaskIcon,
  subtaskListContainer
) {
  renderSubtasks(task, subtaskListContainer);
  subtaskInput.value = "";
  openEditOverlay(task);
  setupSubtaskAdd(addSubtaskIcon, subtaskInput, task, subtaskListContainer);
  setupSubtaskListEvents(subtaskListContainer, task);
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
      task.subtasks.splice(index, 1);
      renderSubtasks(task, container);
    } else if (e.target.classList.contains("edit-icon")) {
      startEditingSubtask(e, task, index, container);
    }
  });
}

/**
 * Starts editing a subtask in the edit overlay.
 * Replaces the subtask text with an input field and shows confirm/delete icons.
 * Binds save and cancel actions and focuses the input field.
 * @param {MouseEvent} e - The event from clicking the edit icon.
 * @param {object} task - The task containing the subtasks.
 * @param {number} index - Index of the subtask to edit.
 * @param {HTMLElement} container - Subtask list container element.
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
