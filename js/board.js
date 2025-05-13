document.addEventListener("DOMContentLoaded", function () {
  setupModalOverlay();
  setupModalCloseButton();
  setupDeleteButton();
  setupPrioritySelection();
  setupAssignedToDropdown();
  setupSubtaskInput();
  // setupDatePicker();
  getTasksFromLocalStorage();
  renderAllColumns();
  setupTaskFormCloseButton();

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

// updates the progress bar and subtask count display for a given task
function renderSubtaskProgress(task) {
  const progressBar = document.getElementById(`progress-bar-${task.id}`);
  const countDisplay = document.getElementById(`subtask-count-${task.id}`);

  const total = task.subtasks.length;
  let completed = 0;

  task.subtasks.forEach((subtask) => {
    const key = Object.keys(subtask)[0];
    const value = subtask[key];

    if (typeof value === "string" && value.startsWith("[x]")) {
      completed++;
    }
  });

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  if (countDisplay) {
    countDisplay.innerHTML = `${completed} / ${total} Subtasks`;
  }
}

// toggles the checkbox state of a subtask and updates progress + storage
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

// saves the current tasks array to localStorage
function saveTasksToStorageOrFirebase() {
  localStorage.setItem("tasks", JSON.stringify(window.tasks));
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

// opens the task card via an animation
function openTaskCardAnimation(wrapper) {
  wrapper.classList.remove("slide-out");
  wrapper.classList.add("slide-in");
}

function closeTaskCardAnimation(wrapper) {
  wrapper.classList.remove("slide-in");
  wrapper.classList.add("slide-out");
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
  img.src = `/assets/img/icons/${task.priority}-icon.png`;
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
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      populateEditOverlay(task);
      closeModal();
    }
  });
  const deleteBtn = document.getElementById("delete-task-button");
  deleteBtn.addEventListener("click", deleteTask);
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

document.addEventListener("DOMContentLoaded", () => {
  const openTaskFormBtn = document.getElementById("openTaskForm");

  if (openTaskFormBtn) {
    openTaskFormBtn.addEventListener("click", () => {
      openTaskForm();
    });
  }
});

function setupTaskFormCloseButton() {
  const closeBtn = document.getElementById("modalCloseTaskForm");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeTaskForm);
  }
}

let overlayIsOpen = false;

async function openTaskForm() {
  if (overlayIsOpen) return;
  overlayIsOpen = true;

  const modalWrapper = document.getElementById("task-form-modal-wrapper");
  const formWrapper = document.getElementById("task-form-wrapper");
  const formContainer = document.getElementById("task-form");

  const file = formContainer.getAttribute("w3-include-html");
  if (!file) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Page not found.");
    const html = await response.text();
    formContainer.innerHTML = html;

    await new Promise(resolve => setTimeout(resolve, 0));


    renderUsersToAssign();

  } catch (error) {
    formContainer.innerHTML = error.message;
    return;
  }

  formContainer.classList.add("active");
  modalWrapper.classList.remove("d_none");

  formWrapper.classList.remove("slide-out");
  void formWrapper.offsetWidth;
  formWrapper.classList.add("slide-in");

  setupTaskFormCloseButton();

  // flatpickr("#due-date-form", {
  //   dateFormat: "d/m/Y",
  //   allowInput: true,
  //   disableMobile: true,
  // });
  setupAllDatePickers();
}

function closeTaskForm() {
  const modal = document.getElementById("task-form-modal-wrapper");
  const wrapper = document.getElementById("task-form-wrapper");
  const container = document.getElementById("task-form");
  if (!modal || !wrapper || !container) return;
  wrapper.classList.remove("slide-in");
  wrapper.classList.add("slide-out");
  modal.classList.add("fade-out");
  wrapper.addEventListener(
    "transitionend",
    function end() {
      modal.classList.remove("active", "fade-out");
      modal.classList.add("d_none");
      wrapper.classList.remove("slide-out");
      container.innerHTML = "";
      wrapper.removeEventListener("transitionend", end);
      overlayIsOpen = false;
    },
    { once: true }
  );

  document.body.classList.remove("modal-open");
  assignees = [];
  subtasks = [];
}

let assigneesTaskForm = [];

// function renderUsersToAssignForm() {
//   const list = document.getElementById("assigned-to-users-list");
//   if (!list) {
//     return;
//   }

//   list.innerHTML = "";

//   window.userNames.forEach((name, index) => {
//     const initials = getInitials(name);
//     const bgColor = getIconBackgroundColor(initials);
//     const isSelected = assigneesTaskForm.includes(name);

//     list.innerHTML += getUsersToAssignTemplateForTaskForm(
//       name,
//       index,
//       isSelected,
//       initials,
//       bgColor
//     );
//   });
// }

function assignContactToTaskForm(id, event) {
  event.stopPropagation();

  const index = parseInt(id.split("-")[1]);
  const name = window.userNames[index];
  if (!name) return;

  const i = assigneesTaskForm.indexOf(name);
  if (i > -1) {
    assigneesTaskForm.splice(i, 1);
  } else {
    assigneesTaskForm.push(name);
  }

  renderUsersToAssignForm();
  renderAssigneesTaskForm();
}

function renderAssigneesTaskForm() {
  const container = document.getElementById("assignees-list-task-form");
  if (!container) return;

  container.innerHTML = "";

  if (assigneesTaskForm.length > 0) {
    container.classList.remove("d_none");

    assigneesTaskForm.forEach(name => {
      const initials = getInitials(name);
      const color = getIconBackgroundColor(initials);
      container.innerHTML += getAvatarTemplate(initials, color);
    });
  } else {
    container.classList.add("d_none");
  }
}
