import { database, ref, push, set, get } from "../js/firebase.js";

window.users = [];
window.userNames = [];
let tasksUploaded = false; 

async function init() {
    await getUsersFromDatabase();
    await checkAndUploadTasks();
}

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

function getUserNames(users) {
    let names = Object.values(users).map(user => user.name);
    return window.userNames = names;
}

async function checkAndUploadTasks() {
    if (tasksUploaded) {
        console.log('Tasks wurden bereits hochgeladen und werden nicht erneut gespeichert.');
        return;
    }

    const tasksRef = ref(database, 'tasks');
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
        console.log('Tasks sind bereits in der Firebase vorhanden.');
        tasksUploaded = true; 
        return;
    }


    await uploadHardcodedTasks();
    tasksUploaded = true; 
}

async function uploadHardcodedTasks() {
    const allBoardCards = document.querySelectorAll('.board-wrapper .board-columns .column-content-wrapper .board-card');
    const tasksRef = ref(database, 'tasks');
    const existingTasks = [];

    const existingSnapshot = await get(tasksRef);
    if (existingSnapshot.exists()) {
        existingSnapshot.forEach((childSnapshot) => {
            const task = childSnapshot.val();
            if (task && task.title) {
                existingTasks.push(task.title);
            }
        });
    }

    allBoardCards.forEach(async taskElement => {
        const label = taskElement.querySelector('.board-card-label')?.textContent.trim();
        const title = taskElement.querySelector('.board-card-title')?.textContent.trim();
        const description = taskElement.querySelector('.board-card-description')?.textContent.trim();
        const priorityImg = taskElement.querySelector('.priority');
        let priority;
        if (priorityImg) {
            if (priorityImg.src.includes('low-icon')) {
                priority = 'low';
            } else if (priorityImg.src.includes('medium-icon')) {
                priority = 'medium';
            } else if (priorityImg.src.includes('urgent')) {
                priority = 'urgent';
            } else {
                priority = 'unknown';
            }
        } else {
            priority = 'not set';
        }

        let status = 'unknown';
        const column = taskElement.closest('.board-columns');
        if (column?.classList.contains('to-do-wrapper')) {
            status = 'to do';
        } else if (column?.classList.contains('in-progress-wrapper')) {
            status = 'in progress';
        } else if (column?.classList.contains('await-feedback-wrapper')) {
            status = 'await feedback';
        } else if (column?.classList.contains('done-wrapper')) {
            status = 'done';
        }

        if (!existingTasks.includes(title)) {
            const taskData = {
                label: label,
                title: title,
                description: description,
                priority: priority,
                status: status
            };

            push(tasksRef, taskData)
                .then((snapshot) => {
                    console.log('Task erfolgreich hochgeladen:', title, 'Status:', status, 'ID:', snapshot.key);
                    taskElement.dataset.taskId = snapshot.key; 
                })
                .catch((error) => {
                    console.error('Fehler beim Hochladen der Task:', title, error);
                });
        } else {
            console.log(`Task mit Titel "${title}" ist bereits vorhanden und wird nicht erneut hochgeladen.`);

        }
    });

    console.log('Überprüfung und potenzieller Upload der Board Cards abgeschlossen.');
}

function renderUsersToAssign() {
    let usersListContainerRef = document.getElementById("assigned-to-users-list");
    usersListContainerRef.innerHTML = "";
    for (let index = 0; index < window.userNames.length; index++) {
        usersListContainerRef.innerHTML += getUsersToAssignTemplate(window.userNames[index], index);
    }
}

function getUsersToAssignTemplate(userName, index) {
    return `<li id="US-${index}" class="single-contact-wrapper d-flex-space-between br-10"
                onclick="assignContactToTask('US-${index}', event)">
                <div class="d-flex-space-between gap-16">
                    <span class="single-contact-icon d-flex-center">US</span>
                    <span>${userName}</span>
                </div>
                <span class="single-contact-checkbox-unchecked"></span>
            </li>`;
}

window.renderUsersToAssign = renderUsersToAssign;
window.getUsersToAssignTemplate = getUsersToAssignTemplate;
window.init = init;

document.addEventListener('DOMContentLoaded', () => {
    init(); 
});