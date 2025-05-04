import { database, ref, push, set, get, update } from "/js/firebase.js"; //

window.users = [];
window.userNames = [];

/**
 * This function initializes the board by fetching users from the database
 * and then synchronizing hardcoded tasks with Firebase.
 */
async function init() {
  await getUsersFromDatabase();
  await uploadTemplateTasksOnce();
}

async function uploadTemplateTasksOnce() {
  const tasksRef = ref(database, "tasks");

  try {
    const snapshot = await get(tasksRef);
    const existingTasks = snapshot.exists() ? snapshot.val() : {};

    for (const task of tasks) {
      if (!existingTasks[task.id]) {
        await set(ref(database, `tasks/${task.id}`), task);
      }
    }
  } catch (error) {
    console.error("Error uploading tasks:", error);
  }
}

function getTasksFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem("tasks"));
  if (!saved) return;

  const existingIds = new Set(tasks.map((t) => t.id));
  saved.forEach((task) => {
    if (!existingIds.has(task.id)) {
      tasks.push(task);
    }
  });
}

/**
 * This function asynchronously retrieves user data from the 'users' node in the Firebase database.
 * It then processes the retrieved data to extract user names.
 * @returns {Promise<Array<string>|null>} A promise that resolves to an array of user names if successful,
 * or null if there's no data or an error occurs during fetching.
 */
async function getUsersFromDatabase() {
  const usersRef = ref(database, "users");
  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      window.users = snapshot.val();
      const names = getUserNames(window.users);
      window.userNames = names;
      return names;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}


/**
 * This function takes an object of users and extracts their names into a new array,
 * which is then assigned to the global `window.userNames` variable.
 * @param {object} users An object where each key represents a user ID and the value is an object
 * containing user information, including the 'name' property.
 * @returns {Array<string>} An array containing the names of all users from the input object.
 */
function getUserNames(users) {
  return Object.values(users).map((user) => user.name);
}


/**
 * This function determines the priority of a task based on the 'src' attribute
 * of the provided image element.
 * @param {HTMLElement|null} priorityImg The HTML image element representing the priority icon.
 * @returns {string} A string representing the priority ('low', 'medium', 'urgent', or 'not set' if the source doesn't match).
 */
function getPriorityFromImageElement(priorityImg) {
  if (priorityImg?.src.includes("low-icon")) return "low";
  if (priorityImg?.src.includes("medium-icon")) return "medium";
  if (priorityImg?.src.includes("urgent")) return "urgent";
  return "not set";
}

/**
 * This function determines the status of a task by checking the class list of its closest
 * ancestor with the class 'board-columns'.
 * @param {HTMLElement} taskElement The HTML element representing the task card.
 * @returns {string} A string representing the status of the task ('to do', 'in progress',
 * 'await feedback', 'done', or 'unknown' if the column class is not recognized).
 */
function getStatusFromColumnElement(taskElement) {
  const column = taskElement.closest(".board-columns");
  if (column?.classList.contains("to-do-wrapper")) return "to-do";
  if (column?.classList.contains("in-progress-wrapper")) return "in-progress";
  if (column?.classList.contains("await-feedback-wrapper"))
    return "await-feedback";
  if (column?.classList.contains("done-wrapper")) return "done";
  return "unknown";
}

function renderUsersToSelect() {
  const select = document.getElementById("assigned-select");
  if (!select || !Array.isArray(window.userNames)) return;

  select.innerHTML = `<option value="" disabled selected hidden></option>`;

  window.userNames.forEach((name, index) => {
    if (typeof name === "string") {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = name;
      select.appendChild(option);
    }
  });
}

/**
 * This function dynamically renders a list of users to assign to a task in the UI.
 * It clears the existing content of the container and then appends HTML generated
 * by the `getUsersToAssignTemplate` function for each user in the `window.userNames` array.
 */
function renderUsersToAssign(listId = "assigned-to-users-list") {
  let usersListContainerRef = document.getElementById(listId);
  if (!usersListContainerRef) {
    console.warn(`Element mit ID "${listId}" nicht gefunden.`);
    return;
  }

  usersListContainerRef.innerHTML = "";

  for (let index = 0; index < window.userNames.length; index++) {
    if (typeof window.userNames[index] === "string") {
      let initials = getInitials(window.userNames[index]);
      let stylingObject = checkIsAssigned(window.userNames[index]);
      let iconBackgroundColor = getIconBackgroundColor(initials);
      usersListContainerRef.innerHTML += getUsersToAssignTemplate(
        window.userNames[index],
        index,
        stylingObject.wrapperClass,
        stylingObject.checkboxClass,
        initials,
        iconBackgroundColor
      );
    }
  }

  renderUsersToSelect(); 
}

window.renderUsersToAssign = renderUsersToAssign;
window.init = init;
window.getTasksFromLocalStorage = getTasksFromLocalStorage;

/**
 * Updates the status of a task in Firebase based on drag & drop movement.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status (e.g. 'to do', 'in progress', 'done', etc.).
 */
function updateTaskStatusInFirebase(taskId, newStatus) {
  const taskRef = ref(database, `tasks/${taskId}`);
  update(taskRef, { status: newStatus })
    .then(() =>
      console.log(`Task ${taskId} updated to "${newStatus}" in Firebase.`)
    )
    .catch((error) => console.error("Error updating task status:", error));
}

window.updateTaskStatusInFirebase = updateTaskStatusInFirebase;

/**
 * This function scans all task cards on the board and updates their status in Firebase
 * based on their current column in the DOM.
 */
function syncDOMTaskStatusesWithFirebase() {
  const allCards = document.querySelectorAll(".board-card");
  allCards.forEach((card) => {
    const taskId = card.getAttribute("data-task-id");
    const newStatus = getStatusFromColumnElement(card);
    if (taskId && newStatus !== "unknown") {
      updateTaskStatusInFirebase(taskId, newStatus);
    }
  });
}
window.syncDOMTaskStatusesWithFirebase = syncDOMTaskStatusesWithFirebase;

import { remove } from "/js/firebase.js";

/**
 * This function deletes a task from firebase when it is deleted on board.
 * @param {string} taskId -
 */
function deleteTaskFromFirebase(taskId) {
  const taskRef = ref(database, `tasks/${taskId}`);
  remove(taskRef)
    .then(() =>
      console.log(`Task ${taskId} erfolgreich aus Firebase gelöscht.`)
    )
    .catch((error) =>
      console.error("Fehler beim Löschen des Tasks aus Firebase:", error)
    );
}

window.deleteTaskFromFirebase = deleteTaskFromFirebase;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

