/**
 * Shows the assignee container.
 * @param {HTMLElement} container - Target container.
 */
function showAssigneeContainer(container) {
  container.classList.remove("d_none");
}

/**
 * Hides the assignee container.
 * @param {HTMLElement} container - Target container.
 */
function hideAssigneeContainer(container) {
  container.classList.add("d_none");
}

/**
 * Renders assigned user avatars in a container.
 * @param {HTMLElement} container - Target element.
 */
function renderAssigneeAvatars(container) {
  window.assignees.forEach((name) => {
    const initials = getInitials(name);
    const color = getIconBackgroundColor(initials);
    const html = getAvatarTemplate(initials, color);
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    container.appendChild(wrap.firstElementChild);
  });
}

/**
 * Toggles user assignment in list.
 * @param {string} name - Username.
 * @param {string} containerId - Dropdown ID.
 */
function toggleAssigned(name, containerId) {
  const i = window.assignees.indexOf(name);
  if (i > -1) window.assignees.splice(i, 1);
  else window.assignees.push(name);
  const dropdown = document.getElementById(containerId);
  renderAssigneesEdit(containerId, dropdown);
  renderUsersToAssignEdit();
}

/**
 * Returns initials from a full name.
 * @param {string} name - Full name.
 * @returns {string} Initials.
 */
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

/**
 * Toggles dropdown visibility with arrows.
 */
function toggleDropdownSelectionInEdit(id, e) {
  e.stopPropagation();
  const d = document.getElementById(id);
  const aC = document.getElementById(`${id}-closed`);
  const aO = document.getElementById(`${id}-open`);
  toggleDropdownAndArrows(d, aC, aO);
}

/**
 * Toggles dropdown and arrows state.
 */
function toggleDropdownAndArrows(drop, closed, open) {
  const openNow = !drop.classList.contains("d_none");
  openNow ? hideDropdown(drop, closed, open)
          : showDropdown(drop, closed, open);
}

/**
 * Hides dropdown and shows closed arrow.
 */
function hideDropdown(drop, closed, open) {
  drop.classList.add("d_none");
  closed.classList.remove("d_none");
  open.classList.add("d_none");
}

/**
 * Shows dropdown and shows open arrow.
 */
function showDropdown(drop, closed, open) {
  drop.classList.remove("d_none");
  closed.classList.add("d_none");
  open.classList.remove("d_none");
}

/**
 * Finds task by ID.
 */
function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

/**
 * Enables priority selection.
 */
function setupPrioritySelection() {
  const btns = document.querySelectorAll("#urgent, #medium, #low");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => {
        b.classList.remove("selected");
        resetPriority(b);
      });
      btn.classList.add("selected");
      activatePriority(btn);
    });
  });
}

/**
 * Resets visual style of priority button.
 */
function resetPriority(button) {
  button.style.backgroundColor = "#fff";
  button.style.color = "#000";
  button.style.fontWeight = "normal";
  button.querySelectorAll("svg path").forEach(p =>
    setDefaultColor(p, button.id)
  );
}

/**
 * Highlights active priority button.
 */
function activatePriority(button) {
  button.style.backgroundColor = getPriorityColor(button.id);
  button.style.color = "#fff";
  button.style.fontWeight = "bold";
  button.querySelectorAll("svg path").forEach(p =>
    p.setAttribute("fill", "#fff")
  );
}

/**
 * Returns priority color for ID.
 */
function getPriorityColor(id) {
  const colors = { urgent: "#FF3D00", medium: "#FFA800", low: "#7AE229" };
  return colors[id] || "#ccc";
}

/**
 * Sets default SVG color for priority.
 */
function setDefaultColor(path, id) {
  const colors = { urgent: "#FF3D00", medium: "#FFA800", low: "#7AE229" };
  path.setAttribute("fill", colors[id] || "#000");
}

/**
 * Initializes default users if empty.
 */
function setupAssignedToDropdown() {
  if (!window.userNames?.length) {
    window.userNames = ["Max Mustermann", "Erika Musterfrau"];
  }
}

/**
 * Sets up dropdown arrow and outside click.
 */
function setupEditDropdownEvents() {
  const arrow = document.getElementById("select-arrow-edit");
  const wrap = document.querySelector(".dropdown-field-wrapper");
  const drop = document.getElementById("assigned-to-dropdown-edit");
  if (!arrow || !wrap || !drop) return;
  bindDropdownArrowClick(arrow, drop);
  bindOutsideDropdownClose(wrap, drop, arrow);
}

/**
 * Toggles dropdown open/close on click.
 */
function bindDropdownArrowClick(arrow, drop) {
  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !drop.classList.contains("d_none");
    open ? closeEditDropdown(drop, arrow)
         : openEditDropdown(drop, arrow);
  });
}

/**
 * Closes dropdown if clicking outside.
 */
function bindOutsideDropdownClose(wrapper, drop, arrow) {
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      closeEditDropdown(drop, arrow);
    }
  });
}

/**
 * Initializes subtask input behavior.
 */
function setupSubtaskInput() {
  const input = document.getElementById("subtasks-edit");
  const addBtn = document.getElementById("edit-add-subtask-icon");
  const confirmWrap = document.getElementById("confirm-icons");
  const confirm = document.getElementById("confirm-icon");
  const clear = document.getElementById("clear-icon");
  addBtn.addEventListener("click", () =>
    showConfirm(input, confirmWrap, addBtn)
  );
  clear.addEventListener("click", () =>
    resetInput(input, confirmWrap, addBtn)
  );
  confirm.addEventListener("click", () =>
    resetInput(input, confirmWrap, addBtn)
  );
}

/**
 * Shows confirm/clear icons for input.
 */
function showConfirm(input, confirm, add) {
  add.classList.add("d-none");
  confirm.classList.remove("d-none");
  input.focus();
}

/**
 * Clears input and restores add icon.
 */
function resetInput(input, confirm, add) {
  input.value = "";
  confirm.classList.add("d-none");
  add.classList.remove("d-none");
}

/**
 * Renders all subtasks of a task.
 * @param {object} task - Task object.
 * @param {HTMLElement} container - Target container.
 */
function renderSubtasks(task, container) {
  container.innerHTML = "";
  if (!Array.isArray(task.subtasks)) return;
  task.subtasks.forEach((subtask, index) => {
    const element = createSubtaskElement(subtask, index);
    container.appendChild(element);
  });
}

/**
 * Creates one subtask element.
 * @param {object} subtask - Subtask data.
 * @param {number} index - Subtask index.
 * @returns {HTMLElement} DOM element.
 */
function createSubtaskElement(subtask, index) {
  const [key, value] = Object.entries(subtask)[0];
  const item = document.createElement("div");
  item.classList.add("subtask-list-item");
  applySubtaskStyles(item);
  item.innerHTML = getSubtaskItemTemplate(value, index);
  return item;
}

/**
 * Applies list item styles.
 * @param {HTMLElement} el - Target element.
 */
function applySubtaskStyles(el) {
  Object.assign(el.style, {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 16px"
  });
}

/**
 * Updates selected priority buttons.
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
 * Prepares overlay and renders subtasks.
 */
function finishOverlaySetup(task, input, icon, list) {
  renderSubtasks(task, list);
  input.value = "";
  openEditOverlay(task);
  setupSubtaskAdd(icon, input, task, list);
  setupSubtaskListEvents(list, task);
}

/**
 * Adds click handlers for subtask actions.
 */
function setupSubtaskListEvents(container) {
  container.addEventListener("click", (e) => {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;
    if (e.target.classList.contains("delete-icon")) {
      window.subtaskArray.splice(index, 1); 
      renderSubtasks({ subtasks: window.subtaskArray }, container); 
    } else if (e.target.classList.contains("edit-icon")) {
      const dummyTask = { subtasks: window.subtaskArray }; 
      startEditingSubtask(e, dummyTask, index, container);
    }
  });
}

/**
 * Begins subtask editing.
 */
function startEditingSubtask(e, task, index, container) {
  const item = e.target.closest(".subtask-list-item");
  const input = replaceSubtaskTextWithInput(item);
  const iconWrap = getIconWrapper(item);
  if (!input || !iconWrap) return;
  replaceIconsForEdit(iconWrap, input, task, index, container);
  input.focus();
  item.classList.add("subtask-list-item-active");
}

/**
 * Turns subtask text into input.
 */
function replaceSubtaskTextWithInput(item) {
  const wrapper = item.querySelector(".subtask-list-item-content-wrapper");
  const span = wrapper?.querySelector("span");
  if (!wrapper || !span) return null;
  const input = document.createElement("input");
  input.classList.add("subtask-item-input");
  input.value = span.textContent.trim();
  wrapper.innerHTML = "";
  wrapper.appendChild(input);
  return input;
}

/**
 * Returns the icon wrapper element.
 */
function getIconWrapper(item) {
  return item.querySelector("div:nth-child(2)");
}

/**
 * Replaces icons with confirm/delete.
 */
function replaceIconsForEdit(wrapper, input, task, index, container) {
  const del = wrapper.querySelector(".delete-icon");
  del.style.display = "flex";
  const confirm = createConfirmButton();
  wrapper.innerHTML = "";
  wrapper.appendChild(del);
  wrapper.appendChild(confirm);
  bindEditActions(input, confirm, del, task, index, container);
}

/**
 * Creates a confirm (✓) icon.
 * @returns {HTMLElement} Confirm element.
 */
function createConfirmButton() {
  return createIcon(
    "confirm-icon",
    `<img src="../assets/img/confirm_icon.png" alt="Confirm" width="16" style="cursor: pointer;">`
  );
}

/**
 * Binds edit save and cancel logic.
 */
function bindEditActions(input, confirmBtn, deleteBtn, task, index, container) {
  confirmBtn.addEventListener("click", () =>
    saveEditedSubtask(input, task, index, container)
  );
  deleteBtn.addEventListener("click", () =>
    cancelEditSubtask(task, container)
  );
  input.addEventListener("click", (e) => e.stopPropagation());
}

/**
 * Saves edited subtask.
 */
function saveEditedSubtask(input, task, index, container) {
  const newText = input.value.trim();
  if (!newText) return;
  const key = Object.keys(task.subtasks[index])[0];
  task.subtasks[index] = { [key]: newText };
  renderSubtasks(task, container);
}

/**
 * Cancels subtask edit.
 */
function cancelEditSubtask(task, container) {
  renderSubtasks(task, container);
}
