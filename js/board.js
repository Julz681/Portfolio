import { database, ref, set } from "/js/firebase.js";


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
  const html = createTaskHTML(task);
  column.insertAdjacentHTML("beforeend", html);
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
 * Updates the visual progress bar and subtask count display on a task card.
 * It calculates the percentage of completed subtasks and updates the corresponding DOM elements.
 * @param {Object} task - The task object containing the subtasks.
 */
function renderSubtaskProgress(task) {
  const progressBar = document.getElementById(`progress-bar-${task.id}`);
  const countDisplay = document.getElementById(`subtask-count-${task.id}`);

  const total = task.subtasks.length;
  let completed = 0;

task.subtasks.forEach(subtask => {
  if (subtask.checked) completed++;
});


  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  if (countDisplay) {
    countDisplay.innerHTML = `${completed} / ${total} Subtasks`;
  }
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

/**
 * Saves the current `window.tasks` array to local storage as a JSON string.
 */


function saveTasksToStorageOrFirebase() {
  localStorage.setItem("tasks", JSON.stringify(window.tasks));

  window.tasks.forEach(task => {
    // Fallbacks für fehlende Pflichtfelder
    if (!task.status) task.status = 'to-do';
    if (!task.priority) task.priority = 'low';

    // Subtasks korrekt formatieren
    if (Array.isArray(task.subtasks)) {
      task.subtasks = task.subtasks.map(subtask => {
        if (typeof subtask === "object" && 'title' in subtask && 'checked' in subtask) {
          return subtask;
        } else if (typeof subtask === "string") {
          return { title: subtask, checked: false };
        } else {
          const key = Object.keys(subtask)[0];
          return { title: key, checked: false };
        }
      });
    }

    const taskRef = ref(database, `tasks/${task.id}`);
    set(taskRef, task);
  });
}



/**
 * Adds a click event listener to each task card on the board.
 * When a card is clicked, it opens the task details modal and populates it with the task's information.
 */
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

/**
 * Opens the task details modal, sets its content based on the provided task,
 * and applies animation to slide it into view. It also sets a data attribute
 * on the modal to store the current task ID and adds a class to the body
 * to indicate that a modal is open.
 * @param {Object} task - The task object whose details will be displayed.
 * @param {HTMLElement} modal - The modal overlay element.
 * @param {HTMLElement} wrapper - The wrapper element containing the modal content.
 */
function openModal(task, modal, wrapper) {
  setModalContent(task);
  modal.classList.add("active");
  wrapper.classList.remove("slide-out");
  wrapper.classList.add("slide-in");
  modal.setAttribute("data-task-id", task.id);
  document.body.classList.add("modal-open");
}

/**
 * Animates the task card modal to slide into view.
 * @param {HTMLElement} wrapper - The wrapper element containing the modal content.
 */
function openTaskCardAnimation(wrapper) {
  wrapper.classList.remove("slide-out");
  wrapper.classList.add("slide-in");
}

/**
 * Animates the task card modal to slide out of view.
 * @param {HTMLElement} wrapper - The wrapper element containing the modal content.
 */
function closeTaskCardAnimation(wrapper) {
  wrapper.classList.remove("slide-in");
  wrapper.classList.add("slide-out");
}

/**
 * Fills all the content areas within the task details modal with the information from the provided task object.
 * This includes basic details, priority, assigned users, and subtasks.
 * @param {Object} task - The task object whose details will be displayed in the modal.
 */
function setModalContent(task) {
  setModalBasics(task);
  setModalPriority(task);
  setModalUsers(task);
  setModalSubtasks(task);
}

/**
 * Sets the task type label, title, description, and due date within the task details modal.
 * @param {Object} task - The task object containing the basic information.
 */
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

/**
 * Displays the priority label and icon within the task details modal based on the task's priority.
 * @param {Object} task - The task object containing the priority information.
 */
function setModalPriority(task) {
  const span = document.querySelector(".prio-label span");
  const img = document.querySelector(".prio-label img");
  span.textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  img.src = `/assets/img/icons/${task.priority}-icon.png`;
}

/**
 * Main function called in template.js to open the task details modal
 * and populate the user and subtask information.
 * @param {string} taskId - The ID of the task to display in the modal.
 */
function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  setModalUsers(task);
  setModalSubtasks(task);
}

/**
 * Sets up the click event listener for the modal close button to call the `closeModal` function.
 */
function setupModalCloseButton() {
  const btn = document.getElementById("modal-close-button");
  btn.addEventListener("click", closeModal);
}

/**
 * Animates the closing of the task details modal with a slide-out and fade-out effect.
 * It removes the 'active' and 'fade-out' classes from the modal and the 'slide-out' class
 * from the wrapper after the transition ends. It also removes the 'modal-open' class from the body.
 */
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

/**
 * Sets up the click event listeners for the edit and delete buttons within the task details modal.
 * The edit button triggers the population of the edit overlay and closes the modal.
 * The delete button calls the `deleteTask` function.
 */
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

/**
 * Deletes the currently displayed task from the `tasks` array based on its ID,
 * removes it from Firebase (if applicable), re-renders all columns on the board,
 * and then closes the task details modal.
 */
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

// handles searching tasks by title or description
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

/**
 * Filters an array of task card elements based on whether their title or description includes the search text.
 * Only cards with titles or descriptions containing the text (if the text length is 2 or more) are returned.
 * @param {NodeListOf<Element>} cards - A collection of all task card elements.
 * @param {string} text - The text to search for (in lowercase).
 * @returns {Array<Element>} An array of task card elements that match the search criteria.
 */
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

/**
 * Toggles the display style of all task cards based on whether they are included in the array of matching cards.
 * Cards that are not matches are hidden if the search text has a length of 2 or more.
 * @param {NodeListOf<Element>} allCards - A collection of all task card elements.
 * @param {Array<Element>} matchingCards - An array of task card elements that match the search criteria.
 * @param {string} text - The current search text.
 */
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

/**
 * Sets up the click event listener for the task form close button to call the `closeTaskForm` function.
 */
function setupTaskFormCloseButton() {
  const closeBtn = document.getElementById("modalCloseTaskForm");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeTaskForm);
  }
}

let overlayIsOpen = false;

/**
 * Asynchronously opens the task creation form as an overlay.
 * It fetches the HTML content of the form, injects it into the DOM,
 * renders the users to assign, and sets up the close button functionality.
 * It also handles potential errors during the fetching process.
 */
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
  //   dateFormat: "d/m/Y",
  //   allowInput: true,
  //   disableMobile: true,
  // });
  setupAllDatePickers();
}

/**
 * Closes the task creation form overlay by animating it to slide out and fade away.
 * It also resets the form container's inner HTML and the `overlayIsOpen` flag.
 */
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
 subtaskArray = [];

}

let assigneesTaskForm = [];

/**
 * Assigns or unassigns a contact to the task form based on the clicked user item.
 * It updates the `assigneesTaskForm` array and re-renders the list of users to assign and the displayed assignees.
 * @param {string} id - The ID of the clicked user item, used to extract the user's index.
 * @param {Event} event - The click event.
 */
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

/**
 * Renders the avatars of the currently assigned contacts in the task form.
 * It iterates through the `assigneesTaskForm` array, generates avatar HTML for each assignee,
 * and appends it to the designated container. If there are no assignees, it hides the container.
 */
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

window.saveTasksToStorageOrFirebase = saveTasksToStorageOrFirebase;
window.renderAllColumns = renderAllColumns;
window.openTaskForm = openTaskForm;
