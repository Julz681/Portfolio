import { database, ref, push, set, get, remove, update } from "../js/firebase.js";

window.users = [];
window.userNames = [];

async function init() {
    await getUsersFromDatabase();
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

// getUsersFromDatabase();

async function renderUsersToAssign() {
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
            </li>`
}

window.renderUsersToAssign = renderUsersToAssign;
window.getUsersToAssignTemplate = getUsersToAssignTemplate;
window.init = init;