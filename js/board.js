document.addEventListener("DOMContentLoaded", function () {
  setupModalOverlay();
  setupModalCloseButton();
  setupDeleteButton();
  setupPrioritySelection();
  setupAssignedToDropdown();
  setupSubtaskInput();
  setupDatePicker();
  renderAllColumns();
});

// this funktion ensures that clicking outside the task detail card closes the modal
function setupModalOverlay() {
  const overlay = document.getElementById("task-card-modal");
  const card = document.querySelector(".modal-card-wrapper");
  overlay.addEventListener("click", function (e) {
    if (!card.contains(e.target)) {
      closeModal();
    }
  });
}

// this function links the task status names to the corresponding columns in the DOM
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

// renders all columns in the board
function renderAllColumns() {
  const map = getColumnMap();
  for (const status in map) {
    const column = map[status];
    const list = getTasksByStatus(status);
    clearColumn(column);
    list.forEach((task) => renderTask(column, task));
    toggleEmptyMsg(column, list);
  }
  setupCardClick();
  init(); // Drag & Drop new
  setTimeout(syncDOMTaskStatusesWithFirebase, 100); 
}


// filters all task by they status
function getTasksByStatus(status) {
  return tasks.filter((task) => task.status === status);
}

// deletes all board-card elements in the passed column
function clearColumn(column) {
  column.querySelectorAll(".board-card").forEach((card) => card.remove());
}

// inserts a new task card into the given column - HTML template
function renderTask(column, task) {
  const html = createTaskHTML(task);
  column.insertAdjacentHTML("beforeend", html);
}

// shows or hides the No Tasks message in a column depending on whether tasks are present
function toggleEmptyMsg(column, tasks) {
  const msg = column.querySelector(".no-tasks-feedback");
  if (msg) msg.classList.toggle("d_none", tasks.length > 0);
}

// creates a task card - main function = in the board_template.js
function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  tasks.forEach((task) => {
    board.innerHTML += createTaskHTML(task); 
  });
}

//  adds a click listener to all task cards so that they open the modal when clicked
function setupCardClick() {
  const modal = document.getElementById("task-card-modal");
  const wrapper = document.querySelector(".modal-card-wrapper");
  const cards = document.querySelectorAll(".board-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.classList.contains("menu-open")) return;
      const id = card.getAttribute("data-task-id");
      const task = tasks.find((t) => t.id === id);
      if (task) openModal(task, modal, wrapper);
    });
  });
}

// opens the modal and fills it with task data
function openModal(task, modal, wrapper) {
  setModalContent(task);
  modal.classList.add("active");
  wrapper.classList.remove("slide-out");
  wrapper.classList.add("slide-in");
  modal.setAttribute("data-task-id", task.id);
  document.body.classList.add("modal-open");
}

// fills all content in the modal (title, description, user, subtasks, ...) for the passed task
function setModalContent(task) {
  setModalBasics(task);
  setModalPriority(task);
  setModalUsers(task);
  setModalSubtasks(task);
}

// sets task type - label, title, description and date in the modal
function setModalBasics(task) {
  const label = document.querySelector(".modal-card-label");
  label.textContent =
    task.taskType === "technical" ? "Technical Task" : "User Story";
  label.style.background = task.taskType === "technical" ? "#1fd7c1" : "blue";
  document.querySelector(".modal-card-title").textContent = task.title;
  document.querySelector(".modal-card-content p").textContent =
    task.description;
  document.querySelector(".date-line span:last-child").textContent =
    task.dueDate;
}

// displays priority labels in the modal
function setModalPriority(task) {
  const span = document.querySelector(".prio-label span");
  const img = document.querySelector(".prio-label img");
  span.textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  img.src = `../assets/img/icons/${task.priority}-icon.png`;
}

// main function in the template.js
function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  setModalUsers(task);
  setModalSubtasks(task);
}

// closing function of the modal
function setupModalCloseButton() {
  const btn = document.getElementById("modal-close-button");
  btn.addEventListener("click", closeModal);
}

// performs a slide-out and fade-out animation and then closes the modal
function closeModal() {
  const modal = document.getElementById("task-card-modal");
  const wrapper = document.querySelector(".modal-card-wrapper");
  wrapper.classList.remove("slide-in");
  wrapper.classList.add("slide-out");
  modal.classList.add("fade-out");
  wrapper.addEventListener(
    "transitionend",
    function end() {
      modal.classList.remove("active", "fade-out");
      wrapper.classList.remove("slide-out");
      wrapper.removeEventListener("transitionend", end);
    },
    { once: true }
  );
  document.body.classList.remove("modal-open");
}

// adds the function to delete a task to the delete button in the modal
function setupDeleteButton() {
  const editBtn = document.getElementById("edit-task-button");
  editBtn.addEventListener("click", () => {
      const modal = document.getElementById("task-card-modal");
      const taskId = modal.getAttribute("data-task-id");
      const task = tasks.find(t => t.id === taskId);
      if (task) {
          populateEditOverlay(task);
          closeModal(); 
      }
  });
}


// deletes the current task from the array, re-renders the board, and closes the modal
function deleteTask() {
  const modal = document.getElementById("task-card-modal");
  const id = modal.getAttribute("data-task-id");
  const index = tasks.findIndex((t) => t.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
    deleteTaskFromFirebase(id); 
  }

  renderAllColumns();
  closeModal();
}

// shows the editing overlay
function openEditOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.classList.remove("hidden");
}

// hides the editing overlay
function closeEditOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.classList.add("hidden");
}

// click event for all priority buttons (Urgent, Medium, Low) in the edit overlay
function setupPrioritySelection() {
  const buttons = document.querySelectorAll("#urgent, #medium, #low");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const isSelected = button.classList.contains("selected");
      buttons.forEach((btn) => {
        resetPriority(btn);
        btn.classList.remove("selected");
      });
      if (!isSelected) {
        activatePriority(button);
        button.classList.add("selected");
      }
    });
  });
}

// resets the color and style of a priority button
function resetPriority(button) {
  button.style.backgroundColor = "#ffffff";
  button.style.color = "#000000";
  button.style.fontWeight = "normal";
  const paths = button.querySelectorAll("svg path");
  paths.forEach((path) => setDefaultColor(path, button.id));
}

// colors the icons in the button again according to the priority (if inactive)
function setDefaultColor(path, id) {
  if (id === "urgent") path.setAttribute("fill", "#FF3D00");
  if (id === "medium") path.setAttribute("fill", "#FFA800");
  if (id === "low") path.setAttribute("fill", "#7AE229");
}

// activates the clicked priority button (color, style, icon white)
function activatePriority(button) {
  const paths = button.querySelectorAll("svg path");
  button.style.fontWeight = "bold";
  button.style.color = "#ffffff";
  if (button.id === "urgent") button.style.backgroundColor = "#FF3D00";
  if (button.id === "medium") button.style.backgroundColor = "#FFA800";
  if (button.id === "low") button.style.backgroundColor = "#7AE229";
  paths.forEach((path) => path.setAttribute("fill", "#ffffff"));
}

// controls the dropdown for "Assigned to" in the edit overlay including the arrow behavior
function setupAssignedToDropdown() {
  const select = document.getElementById("assigned-select");
  const arrow = document.getElementById("select-arrow");
  const placeholder = document.querySelector(".select-placeholder");
  select.addEventListener("mousedown", () => {
      toggleArrow(arrow);
      // fillEditDropdownWithContacts(); // <-- HIER ENTFERNT
  });

  select.addEventListener("change", () => {
      placeholder.style.display = select.value ? "none" : "block";
      resetArrow(arrow);
  });
  document.addEventListener("click", (e) => {
      const wrapper = document.querySelector(".select-wrapper");
      if (!wrapper.contains(e.target)) resetArrow(arrow);
  });
}

// toggles the dropdown arrow icon (opens/closes)
function toggleArrow(arrow) {
  arrow.classList.toggle("open");
  arrow.classList.toggle("closed");
}

// sets the dropdown arrow icon to the closed state
function resetArrow(arrow) {
  arrow.classList.remove("open");
  arrow.classList.add("closed");
}

// binds buttons for adding or canceling subtask inputs in the overlay
function setupSubtaskInput() {
  const input = document.getElementById("subtasks");
  const addBtn = document.getElementById("add-subtask-icon");
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

// shows the check mark/cancel symbol on the subtask input
function showConfirm(input, confirm, add) {
  add.classList.add("d-none");
  confirm.classList.remove("d-none");
  input.focus();
}

// resets the subtask input field
function resetInput(input, confirm, add) {
  input.value = "";
  confirm.classList.add("d-none");
  add.classList.remove("d-none");
}

// initializes the calendar field (Flatpickr) for the due date
function setupDatePicker() {
  if (window.flatpickr) {
    flatpickr("#due-date", {
      dateFormat: "d/m/Y",
      altInput: true,
      altFormat: "d/m/Y",
      allowInput: true,
    });
  }
}

// closes the edit overlay and shows the modal again
// - This is only a temporary feature!
// closes the edit overlay and shows the modal again
// - This is only a temporary feature!
// closes the edit overlay and shows the modal again
// - This is only a temporary feature!
async function saveEdit() {
  const editOverlay = document.getElementById("editTaskOverlay");
  const taskId = document.getElementById("task-card-modal").getAttribute("data-task-id"); 
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex !== -1) {
      const updatedTask = { ...tasks[taskIndex] }
      updatedTask.title = editOverlay.querySelector(".edit-input[placeholder='Enter a title']").value;
      updatedTask.description = editOverlay.querySelector(".edit-textarea[placeholder='Enter a Description']").value;
      updatedTask.dueDate = editOverlay.querySelector("#due-date").value;
      updatedTask.priority = editOverlay.querySelector(".priority-labels.selected")?.id || 'not set';
      updatedTask.assignedTo = Array.from(editOverlay.querySelector("#assigned-select").selectedOptions).map(option => option.value);


      tasks[taskIndex] = updatedTask; 

      renderAllColumns();
      closeEditOverlay();
      document.getElementById("task-card-modal").classList.remove("active");
  }
}

// searches all tasks by title or description
// - shows/hides cards based on the search term
let searchInput = document.getElementById("task-search");
let noResults = document.getElementById("no-results");

searchInput.addEventListener("input", function () {
  let searchText = searchInput.value.toLowerCase();
  handleSearch(searchText);
});

function handleSearch(text) {
  const allCards = document.querySelectorAll(".board-card");
  const normalizedText = text.toLowerCase();

  const matchingCards = filterCards(allCards, normalizedText);
  toggleCardsDisplay(allCards, matchingCards, normalizedText);
  handleNoResultsMessage(normalizedText, matchingCards.length);
}

function filterCards(cards, text) {
  return Array.from(cards).filter((card) => {
    const title = card
      .querySelector(".board-card-title")
      .textContent.toLowerCase();
    const description = card
      .querySelector(".board-card-description")
      .textContent.toLowerCase();
    return (
      text.length >= 2 && (title.includes(text) || description.includes(text))
    );
  });
}

function toggleCardsDisplay(allCards, matchingCards, text) {
  allCards.forEach((card) => {
    const isMatch = matchingCards.includes(card);
    card.style.display = text.length < 2 || isMatch ? "flex" : "none";
  });
}

/**
 * This function renders the subtasks of a given task into a specified container.
 *
 * @param {object} task - The task object containing an array of subtasks.
 * @param {HTMLElement} container - The HTML element where the subtasks will be rendered.
 */
function renderSubtasks(task, container) {
  container.innerHTML = '';
  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((subtask, index) => {
      const subtaskItem = document.createElement('div');
      subtaskItem.classList.add('subtask-item', 'd-flex-space-between');
      subtaskItem.innerHTML = `
        <span>• ${subtask}</span>
        <div>
          <span class="edit-icon" data-index="${index}"></span>
          <span class="delete-icon" data-index="${index}"></span>
        </div>
      `;
      container.appendChild(subtaskItem);
    });
  }
}

/**
 * This function populates the edit task overlay with the details of a given task.

 *
 * @param {object} task - The task object whose details will be displayed in the edit overlay.
 */
function populateEditOverlay(task) {
  const editOverlay = document.getElementById("editTaskOverlay");
  const titleInput = editOverlay.querySelector(".edit-input[placeholder='Enter a title']");
  const descriptionTextarea = editOverlay.querySelector(".edit-textarea[placeholder='Enter a Description']");
  const dueDateInput = editOverlay.querySelector("#due-date");
  const priorityButtons = editOverlay.querySelectorAll(".priority-labels");
  const assignedSelect = editOverlay.querySelector("#assigned-select");
  const assignedPlaceholder = editOverlay.querySelector(".select-placeholder");
  const subtaskInput = editOverlay.querySelector("#subtasks");
  const addSubtaskIcon = document.getElementById("add-subtask-icon");
  const subtaskListContainer = document.getElementById("subtaskList");

  titleInput.value = task.title;
  descriptionTextarea.value = task.description;
  dueDateInput.value = task.dueDate;

  priorityButtons.forEach(button => {
    resetPriority(button);
    button.classList.remove("selected");
    if (button.id === task.priority) {
      activatePriority(button);
      button.classList.add("selected");
    }
  });

  Array.from(assignedSelect.options).forEach(option => {
    option.selected = task.assignedTo ? task.assignedTo.includes(option.value) : false;
  });

  if (task.assignedTo && task.assignedTo.length > 0) {
    assignedPlaceholder.style.display = "none";
  } else {
    assignedPlaceholder.style.display = "block";
  }

 
  subtaskListContainer.innerHTML = ''; // Remove previous subtasks

  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((subtask, index) => {
      const subtaskItem = document.createElement('div');
      subtaskItem.classList.add('subtask-item', 'd-flex-space-between');
      subtaskItem.innerHTML = `
        <span>• ${subtask}</span>
        <div>
          <span class="edit-icon" data-index="${index}"></span>
          <span class="delete-icon" data-index="${index}"></span>
        </div>
      `;
      subtaskListContainer.appendChild(subtaskItem);
    });
  }

  subtaskInput.value = ""; // Clear the input field for new subtasks
  openEditOverlay();

  // Event Listener for adding a new subtask
  addSubtaskIcon.addEventListener('click', () => {
    const newSubtaskTitle = subtaskInput.value.trim();
    if (newSubtaskTitle) {
      if (!task.subtasks) {
        task.subtasks = [];
      }
      task.subtasks.push(newSubtaskTitle); // Store new subtasks as simple strings
      renderSubtasks(task, subtaskListContainer); // Function to display the subtasks
      subtaskInput.value = ''; // Clear the input field
    }
  });

  // Event Listener for deleting subtasks 
  subtaskListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-icon')) {
      const indexToDelete = parseInt(event.target.dataset.index);
      if (task.subtasks && indexToDelete >= 0 && indexToDelete < task.subtasks.length) {
        task.subtasks.splice(indexToDelete, 1);
        renderSubtasks(task, subtaskListContainer); // Rerender the subtasks
      }
    }
  });

  // Event Listener for editing subtasks 
  subtaskListContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-icon')) {
      const indexToEdit = parseInt(event.target.dataset.index);
      if (task.subtasks && indexToEdit >= 0 && indexToEdit < task.subtasks.length) {
        const subtaskItem = event.target.closest('.subtask-item');
        const subtaskTextElement = subtaskItem.querySelector('span');
        const originalText = subtaskTextElement.textContent.substring(2);

        // Create input field for editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.classList.add('edit-subtask-input');
        editInput.value = originalText;

        // Create save and cancel buttons
        const saveButton = document.createElement('span');
        saveButton.classList.add('confirm-icon');
        saveButton.innerHTML = '&#10004;'; // Check

        const cancelButton = document.createElement('span');
        cancelButton.classList.add('clear-icon');
        cancelButton.innerHTML = '&#10006;'; 

        const controlsDiv = event.target.parentNode;
        controlsDiv.innerHTML = ''; // Remove icons
        controlsDiv.appendChild(saveButton);
        controlsDiv.appendChild(cancelButton);

        subtaskTextElement.replaceWith(editInput);
        editInput.focus();

        // Event Listener for saving
        saveButton.addEventListener('click', () => {
          const newText = editInput.value.trim();
          if (newText) {
            task.subtasks[indexToEdit] = newText; // Update the subtask directly as a string
            renderSubtasks(task, subtaskListContainer);
          } else {
            renderSubtasks(task, subtaskListContainer); // Rerender if text is empty
          }
        });

        // Event Listener for canceling
        cancelButton.addEventListener('click', () => {
          renderSubtasks(task, subtaskListContainer);
        });

        // Prevent clicks inside the edit input from triggering the delegation event
        editInput.addEventListener('click', (e) => e.stopPropagation());
      }
    }
  });
  console.log('task.subtasks:', task.subtasks);
}
