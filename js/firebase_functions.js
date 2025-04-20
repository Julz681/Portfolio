import { database, ref, push, set, get, update } from "../js/firebase.js"; //

window.users = [];
window.userNames = [];
let tasksUploaded = false;


/**
 * This function initializes the board by fetching users from the database
 * and then synchronizing hardcoded tasks with Firebase.
 */
async function init() {
    await getUsersFromDatabase();
    await syncHardcodedTasksWithFirebase();
}


/**
 * This function asynchronously retrieves user data from the 'users' node in the Firebase database.
 * It then processes the retrieved data to extract user names.
 * @returns {Promise<Array<string>|null>} A promise that resolves to an array of user names if successful,
 * or null if there's no data or an error occurs during fetching.
 */
async function getUsersFromDatabase() {
    const usersRef = ref(database, 'users');
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            window.users = snapshot.val();
            return getUserNames(window.users);
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
    let names = Object.values(users).map(user => user.name);
    return window.userNames = names;

}


/**
 * This function iterates through all visible board cards in the DOM, extracts task details
 * from their elements, and synchronizes this data with the 'tasks' node in the Firebase database.
 * It either updates an existing task (if a taskId data attribute is present) or creates a new one.
 * A default due date is used if no specific date is found in the HTML.
 */
async function syncHardcodedTasksWithFirebase() {
    const allBoardCards = document.querySelectorAll('.board-wrapper .board-columns .column-content-wrapper .board-card:not(.d_none)');
    const tasksRef = ref(database, 'tasks');
    const firebaseTasksSnapshot = await get(tasksRef);
    const firebaseTasks = firebaseTasksSnapshot.exists() ? firebaseTasksSnapshot.val() : {};
    const defaultDueDate = '01/01/2026';

    allBoardCards.forEach(async taskElement => {
        const label = taskElement.querySelector('.board-card-label')?.textContent.trim();
        const title = taskElement.querySelector('.board-card-title')?.textContent.trim();
        const description = taskElement.querySelector('.board-card-description')?.textContent.trim();
        const priorityImg = taskElement.querySelector('.priority');
        let priority = getPriorityFromImageElement(priorityImg);
        let status = getStatusFromColumnElement(taskElement);
        const taskId = taskElement.dataset.taskId;

        const taskData = {
            label: label,
            title: title,
            description: description,
            priority: priority,
            status: status,
            dueDate: defaultDueDate
        };

        if (taskId && firebaseTasks[taskId]) {
            try {
                await update(ref(database, `tasks/${taskId}`), taskData);
                console.log(`Task mit ID ${taskId} erfolgreich synchronisiert.`);
            } catch (error) {
                console.error(`Fehler beim Aktualisieren der Task mit ID ${taskId}:`, error);
            }
        } else {
            try {
                const newSnapshot = await push(tasksRef, taskData);
                console.log('Neue Task erfolgreich hochgeladen:', title, 'ID:', newSnapshot.key);
                taskElement.dataset.taskId = newSnapshot.key;
            } catch (error) {
                console.error('Fehler beim Hochladen der neuen Task:', title, error);
            }
        }
    });

    console.log('Synchronisation der hard-codierten Board Cards mit Firebase abgeschlossen.');
    tasksUploaded = true;
}


/**
 * This function determines the priority of a task based on the 'src' attribute
 * of the provided image element.
 * @param {HTMLElement|null} priorityImg The HTML image element representing the priority icon.
 * @returns {string} A string representing the priority ('low', 'medium', 'urgent', or 'not set' if the source doesn't match).
 */
function getPriorityFromImageElement(priorityImg) {

    if (priorityImg?.src.includes('low-icon')) return 'low';
    if (priorityImg?.src.includes('medium-icon')) return 'medium';
    if (priorityImg?.src.includes('urgent')) return 'urgent';
    return 'not set';

}


/**
 * This function determines the status of a task by checking the class list of its closest
 * ancestor with the class 'board-columns'.
 * @param {HTMLElement} taskElement The HTML element representing the task card.
 * @returns {string} A string representing the status of the task ('to do', 'in progress',
 * 'await feedback', 'done', or 'unknown' if the column class is not recognized).
 */
function getStatusFromColumnElement(taskElement) {

    const column = taskElement.closest('.board-columns');
    if (column?.classList.contains('to-do-wrapper')) return 'to do';
    if (column?.classList.contains('in-progress-wrapper')) return 'in progress';
    if (column?.classList.contains('await-feedback-wrapper')) return 'await feedback';
    if (column?.classList.contains('done-wrapper')) return 'done';
    return 'unknown';

}


/**
 * This function asynchronously saves the edited data for a specific task to the Firebase database.
 * @param {string} taskId The unique identifier of the task to be updated.
 * @param {object} updatedData An object containing the key-value pairs of the data to be updated for the task.
 */
async function saveEditedTask(taskId, updatedData) {
    const taskRef = ref(database, `tasks/${taskId}`);
    try {
        await update(taskRef, updatedData);
        console.log(`Task mit ID ${taskId} erfolgreich aktualisiert.`, updatedData);

    } catch (error) {
        console.error(`Fehler beim Aktualisieren der Task mit ID ${taskId}:`, error);
    }
}


/**
 * This function asynchronously updates the status of a specific task in the Firebase database.
 * @param {string} taskId The unique identifier of the task to be updated.
 * @param {string} newStatus The new status to be assigned to the task.
 */
async function updateTaskStatusInFirebase(taskId, newStatus) {

    const taskRef = ref(database, `tasks/${taskId}`);
    try {
        await update(taskRef, { status: newStatus });
        console.log(`Status der Task mit ID ${taskId} auf "${newStatus}" aktualisiert.`);
    } catch (error) {
        console.error(`Fehler beim Aktualisieren des Status der Task mit ID ${taskId}:`, error);

    }

}


/**
 * This function dynamically renders a list of users to assign to a task in the UI.
 * It clears the existing content of the container and then appends HTML generated
 * by the `getUsersToAssignTemplate` function for each user in the `window.userNames` array.
 */
function renderUsersToAssign() {
    let usersListContainerRef = document.getElementById("assigned-to-users-list");
    usersListContainerRef.innerHTML = "";
    for (let index = 0; index < window.userNames.length; index++) {
        if(typeof window.userNames[index] === "string") {
            let initials = getInitials(window.userNames[index]);
            let stylingObject = checkIsAssigned(window.userNames[index]);
            let iconBackgroundColor = getIconBackgroundColor(initials);
            usersListContainerRef.innerHTML += getUsersToAssignTemplate(window.userNames[index], index, stylingObject.wrapperClass, stylingObject.checkboxClass, initials, iconBackgroundColor);
        }
    }
}

window.saveEditedTask = saveEditedTask; // Exportiere die Funktion
window.updateTaskStatusInFirebase = updateTaskStatusInFirebase; // Exportiere die Funktion
window.renderUsersToAssign = renderUsersToAssign;
window.init = init;


document.addEventListener('DOMContentLoaded', () => {
    init();
});