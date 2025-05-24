/**
 * Initializes the board by setting up drag-and-drop and placeholders.
 */
function init() {
  setupDraggableTasks();
  setupDroppableColumns();
  createHighlightLine();
  updateAllColumnsPlaceholder();
}

/**
 * Makes all task cards draggable and binds drag events.
 */
function setupDraggableTasks() {
  const tasks = document.querySelectorAll(".board-card");
  tasks.forEach((task) => {
    task.setAttribute("draggable", true);
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
  });
}

/**
 * Adds dragover and drop event listeners to board columns.
 */
function setupDroppableColumns() {
  const columns = document.querySelectorAll(".board-columns");
  columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("drop", drop);
  });
}

let draggedTask = null;

/**
 * This function starts the dragging process for a task card.
 * It sets the `draggedTask` variable, adds a 'dragging' class to the dragged element,
 * applies a slight rotation for visual feedback, sets the data to be transferred during the drag,
 * and displays the highlight line.
 * @param {DragEvent} event - The drag start event object.
 */
function dragStart(event) {
  draggedTask = event.target;
  draggedTask.classList.add("dragging");
  draggedTask.style.transform = "rotate(5deg)"; 
  event.dataTransfer.setData("text/plain", draggedTask.dataset.taskId);
  document.querySelector(".highlight-line").style.display = "block";
}

/**
 * This function is called when the dragging process ends.
 * It removes the rotation and the 'dragging' class from the task card,
 * hides the highlight line, and updates the visibility of the placeholder text in all columns.
 */
function dragEnd() {
  draggedTask.style.transform = "none"; 
  draggedTask.classList.remove("dragging");
  removeHighlightLine();
  updateAllColumnsPlaceholder(); 
}

/**
 * Handles the dragover event for a column and positions the highlight line.
 * @param {DragEvent} event - The drag over event object.
 */
function dragOver(event) {
  event.preventDefault();
  const column = event.target.closest(".board-columns");
  const columnContent = column.querySelector(".column-content-wrapper");
  const highlightLine = document.querySelector(".highlight-line");
  if (columnContent) {
    const rect = columnContent.getBoundingClientRect();
    const top = calculateHighlightTop(columnContent, rect.top);
    positionHighlightLine(highlightLine, top, rect);
  }
}

/**
 * Calculates the vertical position for the highlight line.
 * @param {HTMLElement} container - The column content wrapper.
 * @param {number} topOffset - The top offset of the container.
 * @returns {number} - The vertical position (in px).
 */
function calculateHighlightTop(container, topOffset) {
  const cards = container.querySelectorAll(".board-card");
  if (cards.length === 0) return topOffset + 10;
  const lastCard = cards[cards.length - 1];
  return lastCard.getBoundingClientRect().bottom + 16;
}

/**
 * Positions and shows the highlight line visually.
 * @param {HTMLElement} line - The highlight line element.
 * @param {number} top - Calculated top position.
 * @param {DOMRect} rect - Bounding rectangle of the column content.
 */
function positionHighlightLine(line, top, rect) {
  line.style.top = `${top}px`;
  line.style.left = `${rect.left + rect.width / 2 - 110}px`;
  line.style.display = "block";
}

/**
 * Handles the drop event when a task is dropped onto a column.
 * @param {DragEvent} event - The drop event object.
 */
function drop(event) {
  event.preventDefault();
  const column = event.target.closest(".board-columns");
  const columnContent = column?.querySelector(".column-content-wrapper");
  if (columnContent && draggedTask) {
    handleDropOnColumn(columnContent);
    handleTaskStatusUpdate(column);
  }
  removeHighlightLine();
}

/**
 * Appends dragged task to the column and updates placeholders.
 * @param {HTMLElement} columnContent - The content container of the column.
 */
function handleDropOnColumn(columnContent) {
  columnContent.appendChild(draggedTask);
  updateAllColumnsPlaceholder();
}

/**
 * Updates the task's status after being dropped in a column.
 * @param {HTMLElement} column - The column where the task was dropped.
 */
function handleTaskStatusUpdate(column) {
  const taskId = draggedTask.dataset.taskId;
  const newStatus = getStatusFromColumn(column);
  if (!taskId || !newStatus) return;
  window.updateTaskStatusInFirebase(taskId, newStatus);
  updateTaskInMemory(taskId, newStatus);
}

/**
 * Updates the task in local memory and saves to localStorage.
 * @param {string} taskId - ID of the updated task.
 * @param {string} newStatus - New column status.
 */
function updateTaskInMemory(taskId, newStatus) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * This function determines the status of a task based on the class name of the column it is in.
 * @param {Element} column - The HTML element representing the column.
 * @returns {string|null} The corresponding status ('to do', 'in progress', 'await feedback', 'done'),
 * or null if the column's class does not match any known status.
 */
function getStatusFromColumn(column) {
  if (column.classList.contains("to-do-wrapper")) return "to-do";
  if (column.classList.contains("in-progress-wrapper")) return "in-progress";
  if (column.classList.contains("await-feedback-wrapper"))
    return "await-feedback";
  if (column.classList.contains("done-wrapper")) return "done";
  return null;
}

/**
 * This function creates the highlight line element and appends it to the document body
 * if it does not already exist. The highlight line is used to visually indicate
 * the drop target during drag and drop operations.
 */
function createHighlightLine() {
  if (!document.querySelector(".highlight-line")) {
    const highlightLine = document.createElement("div");
    highlightLine.classList.add("highlight-line");
    document.body.appendChild(highlightLine);
  }
}

/**
 * This function hides the highlight line by setting its `display` style to 'none'.
 */
function removeHighlightLine() {
  document.querySelector(".highlight-line").style.display = "none";
}

/**
 * Updates visibility of the "No tasks" message in all board columns.
 */
function updateAllColumnsPlaceholder() {
  const columns = document.querySelectorAll(".board-columns");
  columns.forEach((column) => {
    const columnContent = column.querySelector(".column-content-wrapper");
    const noTasksFeedback = columnContent?.querySelector(".no-tasks-feedback");
    if (!columnContent || !noTasksFeedback) return;
    updateSingleColumnPlaceholder(columnContent, noTasksFeedback);
  });
}

/**
 * Checks task count and updates placeholder visibility for one column.
 * @param {HTMLElement} content - The column content wrapper.
 * @param {HTMLElement} feedback - The feedback element to show/hide.
 */
function updateSingleColumnPlaceholder(content, feedback) {
  const cardCount = content.querySelectorAll(
    ".board-card:not(.dragging)"
  ).length;
  const taskIsInColumn = content.contains(draggedTask);
  if (cardCount === 0 && !taskIsInColumn) {
    feedback.classList.remove("d_none");
  } else {
    feedback.classList.add("d_none");
  }
}

document.addEventListener("DOMContentLoaded", init);
