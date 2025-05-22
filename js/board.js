document.addEventListener("DOMContentLoaded", function () {
  setupModalOverlay();
  setupModalCloseButton();
  setupDeleteButton();
  setupPrioritySelection();
  setupAssignedToDropdown();
  setupSubtaskInput();
  getTasksFromLocalStorage();
  renderAllColumns();
  setupTaskFormCloseButton();
});

/**
 * Sets up the modal overlay to close the modal when the user clicks outside the task detail card.
 */
function setupModalOverlay() {
  const overlay = document.getElementById("task-card-modal");
  const card = document.querySelector(".modal-card-wrapper");
  overlay.addEventListener("click", function (e) {
    if (!card.contains(e.target)) {
      closeModal();
    }
  });
}

/**
 * Returns an object mapping task status names to their corresponding column elements in the DOM.
 * @returns {Object<string, HTMLElement>} An object where keys are status names ("to-do", "in-progress", etc.)
 * and values are the corresponding column content wrapper elements.
 */
function getColumnMap() {
  return {
    "to-do": document.querySelector(".to-do-wrapper .column-content-wrapper"),
    "in-progress": document.querySelector(
      ".in-progress-wrapper .column-content-wrapper"
    ),
    "await-feedback": document.querySelector(
      ".await-feedback-wrapper .column-content-wrapper"
    ),
    done: document.querySelector(".done-wrapper .column-content-wrapper"),
  };
}

/**
 * Renders all columns on the board by iterating through the status map,
 * filtering tasks by status, clearing the column, rendering each task,
 * updating subtask progress, and toggling the "no tasks" message.
 * It also sets up the click event listeners for the task cards.
 */
function renderAllColumns() {
  const map = getColumnMap();
  for (const status in map) {
    const column = map[status];
    const tasksByStatus = getTasksByStatus(status);
    clearColumn(column);
    tasksByStatus.forEach((task) => {
      renderTask(column, task);
      renderSubtaskProgress(task);
    });
    toggleEmptyMsg(column, tasksByStatus);
  }
  setupCardClick();
  init();
}

/**
 * Filters the global `tasks` array to return only tasks with the specified status.
 * @param {string} status - The status to filter by (e.g., "to-do", "in-progress").
 * @returns {Array<Object>} An array of task objects matching the given status.
 */
function getTasksByStatus(status) {
  return tasks.filter((task) => task.status === status);
}

/**
 * Removes all task card elements from a given column in the DOM.
 * @param {HTMLElement} column - The column element to clear.
 */
function clearColumn(column) {
  column.querySelectorAll(".board-card").forEach((card) => card.remove());
}

/**
 * Inserts the HTML representation of a task card into the specified column.
 * @param {HTMLElement} column - The column element to insert the task card into.
 * @param {Object} task - The task object to render.
 */
function renderTask(column, task) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = createTaskHTML(task);

  const taskCard = wrapper.firstElementChild;
  if (!taskCard) return;

  taskCard.setAttribute("draggable", true);
  taskCard.addEventListener("dragstart", dragStart);
  taskCard.addEventListener("dragend", dragEnd);

  column.appendChild(taskCard);
}

/**
 * Shows or hides the "No Tasks" message within a column based on whether there are any tasks in that column.
 * @param {HTMLElement} column - The column element containing the message.
 * @param {Array<Object>} tasks - An array of tasks in the column.
 */
function toggleEmptyMsg(column, tasks) {
  const msg = column.querySelector(".no-tasks-feedback");
  if (msg) msg.classList.toggle("d_none", tasks.length > 0);
}

/**
 * Renders progress bar and subtask count for a task card.
 * @param {Object} task - The task object.
 */
function renderSubtaskProgress(task) {
  const progressBar = document.getElementById(`progress-bar-${task.id}`);
  const countDisplay = document.getElementById(`subtask-count-${task.id}`);
  if (!progressBar || !countDisplay) return;

  const total = task.subtasks.length;
  if (total === 0) return hideSubtaskProgress(progressBar, countDisplay);

  const completed = countCompletedSubtasks(task.subtasks);
  const percentage = calculateCompletionPercentage(completed, total);
  updateProgressBar(progressBar, percentage);
  updateSubtaskCounter(countDisplay, completed, total);
}

/**
 * Hides the subtask progress UI if there are no subtasks.
 * @param {HTMLElement} bar - The progress bar element.
 * @param {HTMLElement} counter - The counter element.
 */
function hideSubtaskProgress(bar, counter) {
  bar.style.display = "none";
  counter.style.display = "none";
}

/**
 * Counts how many subtasks are marked as completed.
 * @param {Array} subtasks - Array of subtasks.
 * @returns {number} Number of completed subtasks.
 */
function countCompletedSubtasks(subtasks) {
  let completed = 0;
  subtasks.forEach((subtask) => {
    const key = Object.keys(subtask)[0];
    const value = subtask[key];
    if (typeof value === "string" && value.startsWith("[x]")) {
      completed++;
    }
  });
  return completed;
}

/**
 * Calculates the percentage of completed subtasks.
 * @param {number} completed - Completed subtasks.
 * @param {number} total - Total subtasks.
 * @returns {number} Completion percentage (rounded).
 */
function calculateCompletionPercentage(completed, total) {
  return Math.round((completed / total) * 100);
}

/**
 * Updates the visual width of the progress bar.
 * @param {HTMLElement} bar - The progress bar element.
 * @param {number} percent - Completion percentage.
 */
function updateProgressBar(bar, percent) {
  bar.style.width = `${percent}%`;
  bar.style.display = "block";
}

/**
 * Updates the subtask count display element.
 * @param {HTMLElement} counter - The counter element.
 * @param {number} completed - Number of completed subtasks.
 * @param {number} total - Total subtasks.
 */
function updateSubtaskCounter(counter, completed, total) {
  counter.textContent = `${completed} / ${total} Subtasks`;
  counter.style.display = "block";
}

/**
 * Toggles the checked state of a subtask's checkbox and updates the task's subtasks array
 * and the displayed progress. It also saves the changes to local storage.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtasks array.
 */
function toggleSubtaskCheckbox(taskId, subtaskIndex) {
  const task = window.tasks.find((t) => t.id === taskId);
  if (!task) return;
  const subtask = task.subtasks[subtaskIndex];
  const key = Object.keys(subtask)[0];
  const currentValue = subtask[key];
  const isChecked = currentValue.startsWith("[x]");
  const label = isChecked ? currentValue.replace("[x] ", "") : currentValue;
  const newValue = isChecked ? label : `[x] ${label}`;
  task.subtasks[subtaskIndex][key] = newValue;
  renderSubtaskProgress(task);

  saveTasksToStorageOrFirebase();
}

/** handles searching tasks by title or description */
let searchInput = document.getElementById("task-search");
let noResults = document.getElementById("no-results");

searchInput.addEventListener("input", function () {
  let searchText = searchInput.value.toLowerCase();
  handleSearch(searchText);
});

/**
 * Handles the search functionality by taking the search text, filtering the task cards,
 * toggling their display based on the search results, and displaying a "no results" message if necessary.
 * @param {string} text - The text to search for (in lowercase).
 */
function handleSearch(text) {
  const allCards = document.querySelectorAll(".board-card");
  const normalizedText = text.toLowerCase();

  const matchingCards = filterCards(allCards, normalizedText);
  toggleCardsDisplay(allCards, matchingCards, normalizedText);
  handleNoResultsMessage(normalizedText, matchingCards.length);
}
