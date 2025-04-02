// async function init() {
//   await includeHTML();
// }

// async function includeHTML() {
//   let sidebarRef = document.getElementById("sidebarRef");
//   let headerRef = document.getElementById("headerRef");
//   let sidebarRefFile = sidebarRef.getAttribute("w3-include-html");
//   let headerRefFile = headerRef.getAttribute("w3-include-html");
//   await fetchFile(sidebarRef, sidebarRefFile);
//   await fetchFile(headerRef, headerRefFile);
// }

// async function fetchFile(element, file) {
//   if (!file) return;
//   try {
//     const response = await fetch(file);
//     if (!response.ok) {
//       throw new Error("Page not found.");
//     }
//     element.innerHTML = await response.text();
//   } catch (error) {
//     element.innerHTML = error.message;
//   } finally {
//     element.removeAttribute("w3-include-html");
//   }
// }

async function init() {
  await includeHTML();
}

async function includeHTML() {
  let generalFrameRef = document.getElementById("general-frame");
  let generalFrameFile = generalFrameRef.getAttribute("w3-include-html");
  await fetchFile(generalFrameRef, generalFrameFile);
}

async function fetchFile(element, file) {
  if (!file) return;
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("Page not found.");
    }
    element.innerHTML = await response.text();
  } catch (error) {
    element.innerHTML = error.message;
  } finally {
    element.removeAttribute("w3-include-html");
  }
}

//colors for the avatars depending on the letter
const letterColors = {
  A: "#D32F2F",
  B: "#C2185B",
  C: "#7B1FA2",
  D: "#512DA8",
  E: "#1976D2",
  F: "#0288D1",
  G: "#00796B",
  H: "#388E3C",
  I: "#689F38",
  J: "#F57C00",
  K: "#E64A19",
  L: "#5D4037",
  M: "#455A64",
  N: "#263238",
  O: "#D81B60",
  P: "#8E24AA",
  Q: "#673AB7",
  R: "#303F9F",
  S: "#0288D1",
  T: "#0097A7",
  U: "#00796B",
  V: "#388E3C",
  W: "#689F38",
  X: "#F57C00",
  Y: "#E64A19",
  Z: "#5D4037",
};

// array with objects
const tasks = [
  {
    id: "task-1",
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation",
    priority: "urgent",
    taskType: "userStory",
    dueDate: "10/06/2023",
    assignedTo: ["Judtih Lütke", "Bernadette Pöltl"],
    subtasks: ["Create Recommender", "Get some Recipe", "Implement Backend"],
    status: "await-feedback",
  },
  {
    id: "task-2",
    title: "Design the Homepage",
    description: "Create a wireframe for the main landing page.",
    priority: "medium",
    taskType: "technical",
    dueDate: "10/06/2023",
    assignedTo: ["Ada Lovelace", "Tobias Fröhler"],
    subtasks: ["Create Wireframe", "Get Approval", "Implement UI"],
    status: "done",
  },
  {
    id: "task-3",
    title: "Implement Login System",
    description: "Develop authentication using Firebase Auth.",
    priority: "low",
    taskType: "technical",
    dueDate: "10/10/2023",
    assignedTo: ["Frances Allen", "Edsger Dijkstra"],
    subtasks: ["Setup Firebase", "Create Login Form", "Test Auth Flow"],
    status: "in-progress",
  },
  {
    id: "task-4",
    title: "Dark Mode Toggle",
    description: "As a user, I want to switch between dark and light mode.",
    priority: "medium",
    taskType: "userStory",
    dueDate: "15/04/2025",
    assignedTo: ["Ada Lovelace", "Shafi Goldwasser"],
    subtasks: [
      "Design toggle switch",
      "Implement dark/light themes",
      "Store preference in localStorage",
    ],
    status: "to-do",
  },
  {
    id: "task-5",
    title: "Drag & Drop Task Board",
    description:
      "Enable drag and drop functionality to move tasks across different columns.",
    priority: "low",
    taskType: "technical",
    dueDate: "20/04/2025",
    assignedTo: ["Reshma Saujani", "Frances Allen"],
    subtasks: [
      "Set up drag listeners",
      "Handle drop zones",
      "Update task status on drop",
    ],
    status: "to-do",
  },
];

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

// returns the HTML code for all user avatars of a task. Generates initials and the color
function getUserAvatarsHTML(assignedTo) {
  let result = "";

  for (let i = 0; i < assignedTo.length; i++) {
    let name = assignedTo[i];
    let contact = document.querySelector(`.contact-item[data-name="${name}"]`);

    if (contact) {
      let avatar = contact.querySelector(".contact-avatar");
      if (avatar) {
        result += avatar.outerHTML;
      }
    } else {
      let parts = name.split(" ");
      let initials = parts
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      let firstLetter = initials.charAt(0);
      let bgColor = letterColors[firstLetter] || "#888";

      result += `
        <div class="contact-avatar" style="background-color: ${bgColor};">
          ${initials}
        </div>
      `;
    }
  }

  return result;
}

// creates a task card including labels, texts, subtask count, avatars, priority, ...
function createTaskHTML(task) {
  const label = task.taskType === "technical" ? "Technical Task" : "User Story";
  const color = task.taskType === "technical" ? "#1fd7c1" : "blue";
  const users = getUserAvatarsHTML(task.assignedTo);
  return `
    <div class="board-card d-flex-center" data-task-id="${task.id}">
      <div class="board-card-content d-flex-column">
        <label class="board-card-label br-8 d-flex-center" style="background:${color};">${label}</label>
        <div class="board-card-text d-flex-column br-10">
          <h4 class="board-card-title">${task.title}</h4>
          <p class="board-card-description">${task.description}</p>
        </div>
        <div class="status d-flex-center">
          <div class="progress" role="progressbar">
            <div class="progress-bar" style="width: 60%"></div>
          </div>
          <div class="d-flex-center subtasks">
            <span>0</span> / <span>${task.subtasks.length}</span> Subtasks
          </div>
        </div>
        <div class="d-flex-space-between board-card-footer">
          <div class="user-icons-wrapper d-flex-center">${users}</div>
          <img src="../assets/img/icons/${task.priority}-icon.png" class="priority" />
        </div>
      </div>
    </div>`;
}

//  adds a click listener to all task cards so that they open the modal when clicked
function setupCardClick() {
  const modal = document.getElementById("task-card-modal");
  const wrapper = document.querySelector(".modal-card-wrapper");
  const cards = document.querySelectorAll(".board-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
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

// shows the user avatars + names in the modal in the “Assigned to” area
function setModalUsers(task) {
  let box = document.querySelector(".assignments");
  let avatars = getUserAvatarsHTML(task.assignedTo);
  let namesHTML = "";

  for (let i = 0; i < task.assignedTo.length; i++) {
    let name = task.assignedTo[i];
    namesHTML += "<span>" + name + "</span>";
  }

  let html =
    "" +
    "<span>Assigned to:</span>" +
    "<div class='user-line d-flex-space-between gap-16'>" +
    "<div class='d-flex-column gap-16'>" +
    avatars +
    "</div>" +
    "<div class='user-names d-flex-column gap-24'>" +
    namesHTML +
    "</div>" +
    "</div>";

  box.innerHTML = html;
}

// renders the individual subtasks in the modal as a checkbox list
function setModalSubtasks(task) {
  const box = document.querySelector(".subtasks-wrapper");
  box.innerHTML = task.subtasks
    .map(
      (s, i) => `
    <div class="modal-card-subtask-wrapper d-flex-center">
      <label class="modal-card-subtask gap-16">
        <input type="checkbox" id="subtask-${i}" />
        <span class="checkmark"></span>
        <span>${s}</span>
      </label>
    </div>`
    )
    .join("");
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
}

// adds the function to delete a task to the delete button in the modal
function setupDeleteButton() {
  const btn = document.getElementById("delete-task-button");
  btn.addEventListener("click", deleteTask);
}

// deletes the current task from the array, re-renders the board, and closes the modal
function deleteTask() {
  const modal = document.getElementById("task-card-modal");
  const id = modal.getAttribute("data-task-id");
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) tasks.splice(index, 1);
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
  const buttons = document.querySelectorAll(".priority-labels");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => resetPriority(btn));
      activatePriority(button);
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
    fillEditDropdownWithContacts(); 
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
function saveEdit() {
  document.getElementById("editTaskOverlay").classList.add("hidden");
  document.getElementById("task-card-modal").classList.add("active");
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
  let allCards = document.querySelectorAll(".board-card");
  let found = 0;

  for (let i = 0; i < allCards.length; i++) {
    let card = allCards[i];
    let title = card
      .querySelector(".board-card-title")
      .textContent.toLowerCase();
    let description = card
      .querySelector(".board-card-description")
      .textContent.toLowerCase();

    if (text.length < 2 || title.includes(text) || description.includes(text)) {
      card.style.display = "flex";
      if (
        text.length >= 2 &&
        (title.includes(text) || description.includes(text))
      ) {
        found++;
      }
    } else {
      card.style.display = "none";
    }
  }

  if (text.length >= 2 && found === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}
