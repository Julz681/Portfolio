//colors for the avatars depending on the letter
/**
 * @constant {object} letterColors - An object mapping uppercase letters to specific hexadecimal color codes.
 * This is used to determine the background color of user avatars based on the first letter of their name.
 * Each letter of the alphabet (A-Z) has a corresponding color defined.
 */
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
/**
 * @global
 * @type {Array<object>} window.tasks - An array containing task objects.
 * Each task object represents a work item with properties such as:
 * - `id`: A unique identifier for the task.
 * - `title`: The name or subject of the task.
 * - `description`: A detailed explanation of the task.
 * - `priority`: The level of importance of the task ('urgent', 'medium', 'low').
 * - `taskType`: The category of the task ('userStory', 'technical').
 * - `dueDate`: The deadline for the task in 'dd/mm/yyyy' format.
 * - `assignedTo`: An array of strings, each representing the name of a person assigned to the task.
 * - `subtasks`: An array of objects, where each object contains a single key-value pair representing a subtask ID and its description.
 * - `status`: The current stage of the task ('await-feedback', 'done', 'in-progress', 'to-do').
 */
window.tasks = [
    {
        id: "task-1",
        title: "Kochwelt Page & Recipe Recommender",
        description: "Build start page with recipe recommendation",
        priority: "urgent",
        taskType: "userStory",
        dueDate: "06/10/2025",
        assignedTo: ["Judtih Lütke", "Bernadette Pöltl"],
        subtasks: [
            { 'subtask-0': 'Create Recommender' },
            { 'subtask-1': "Get some Recipe" },
            { 'subtask-2': "Implement Backend" }
        ],
        status: "await-feedback",
    },
    {
        id: "task-2",
        title: "Design the Homepage",
        description: "Create a wireframe for the main landing page.",
        priority: "medium",
        taskType: "technical",
        dueDate: "15/06/2025",
        assignedTo: ["Ada Lovelace", "Tobias Fröhler"],
        subtasks: [
            { 'subtask-0': "Create Wireframe" },
            { 'subtask-1': "Get Approval" },
            { 'subtask-2': "Implement UI" }
        ],
        status: "done",
    },
    {
        id: "task-3",
        title: "Implement Login System",
        description: "Develop authentication using Firebase Auth.",
        priority: "low",
        taskType: "technical",
        dueDate: "10/10/2025",
        assignedTo: ["Frances Allen", "Edsger Dijkstra"],
        subtasks: [
            { 'subtask-0': "Setup Firebase" },
            { 'subtask-1': "Create Login Form" },
            { 'subtask-2': "Test Auth Flow" }
        ],
        status: "in-progress",
    },
    {
        id: "task-4",
        title: "Dark Mode Toggle",
        description: "As a user, I want to switch between dark and light mode.",
        priority: "medium",
        taskType: "userStory",
        dueDate: "15/06/2025",
        assignedTo: ["Ada Lovelace", "Shafi Goldwasser"],
        subtasks: [
            { 'subtask-0': "Design toggle switch" },
            { 'subtask-1': "Implement dark/light themes" },
            { 'subtask-2': "Store preference in localStorage" },
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
        dueDate: "20/07/2025",
        assignedTo: ["Reshma Saujani", "Frances Allen"],
        subtasks: [
            { 'subtask - 0': "Set up drag listeners" },
            { 'subtask - 1': "Handle drop zones" },
            { 'subtask-2': "Update task status on drop" },
        ],
        status: "to-do",
    },
];

/**
 * Returns the HTML code for displaying the avatars of users assigned to a task.
 * It iterates through the `assignedTo` array, attempts to retrieve existing contact avatars from the DOM,
 * and if not found, generates a new avatar with initials and a background color based on the first letter of the name.
 * @param {Array<string>} assignedTo - An array of names of users assigned to a task.
 * @returns {string} A string containing the HTML for all user avatars assigned to the task.
 */
function getUserAvatarsHTML(assignedTo) {
    const MAX_VISIBLE = 4;
    const visibleUsers = assignedTo.slice(0, MAX_VISIBLE);
    const hiddenCount = assignedTo.length - MAX_VISIBLE;

    let avatarsHTML = visibleUsers
        .map((name) => {
            const contactEl = document.querySelector(`.contact-item[data-name="${name}"]`);
            const avatarEl = contactEl?.querySelector(".contact-avatar");

            if (avatarEl) {
                return avatarEl.outerHTML;
            }

            const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
            const firstLetter = initials.charAt(0);
            const bgColor = letterColors[firstLetter] || "#888";

            return `<div class="contact-avatar" style="background-color: ${bgColor};">${initials}</div>`;
        })
        .join("");

    
    if (hiddenCount > 0) {
        avatarsHTML += `
            <div class="contact-avatar" style="background-color: #ccc;">
                +${hiddenCount}
            </div>
        `;
    }

    return avatarsHTML;
}


/**
 * Creates the HTML structure for a task card to be displayed on the board.
 * It includes the task label, title, description, subtask progress, assigned user avatars, and priority icon.
 * @param {object} task - A task object from the `window.tasks` array.
 * @returns {string} A string containing the HTML for the task card.
 */
function createTaskHTML(task) {
    const label = task.taskType === "technical" ? "Technical Task" : "User Story";
    const color = task.taskType === "technical" ? "#1fd7c1" : "blue";
    const users = getUserAvatarsHTML(task.assignedTo);
    return `
        <div class="board-card d-flex-center" data-task-id="${task.id}">
            <div class="board-card-content d-flex-column">
                    <button class="card-action-btn" onclick="toggleMoveMenu(this, event)">
                <img src="/assets/img/responsive_frame.png" alt="Aktion" />
            </button>

            <div class="move-menu d-none">
                <span class="menu-title">Move to</span>
                <div class="menu-item" onclick="moveTaskToColumn('to-do', event)">
                    <span class="menu-icon">+</span> To do
                </div>
                <div class="menu-item" onclick="moveTaskToColumn('in-progress', event)">
                    <span class="menu-icon">+</span> In progress
                </div>
                <div class="menu-item" onclick="moveTaskToColumn('await-feedback', event)">
                    <span class="menu-icon">+</span> Await Feedback
                </div>
                <div class="menu-item" onclick="moveTaskToColumn('done', event)">
                    <span class="menu-icon">+</span> Done
                </div>
            </div>
               <label class="board-card-label br-8 d-flex-center" style="background:${color};">${label}</label>
                <div class="board-card-text d-flex-column br-10">
                    <h4 class="board-card-title">${task.title}</h4>
                    <p class="board-card-description">${task.description}</p>
                </div>
                <div class="status d-flex-center">
                <div class="progress" role="progressbar">
                    <div class="progress-bar" id="progress-bar-${task.id}" style="width: 0%"></div>
                </div>
                <div class="d-flex-center subtasks" id="subtask-count-${task.id}">
                    0 / ${task.subtasks.length} Subtasks
                </div>
            </div>

                <div class="d-flex-space-between board-card-footer">
                    <div class="user-icons-wrapper d-flex-center">${users}</div>
                    <img src="/assets/img/icons/${task.priority}-icon.png" class="priority" />
                </div>
            </div>
        </div>`;
}

/**
 * Sets the HTML content for the "Assigned to" section in the task details modal.
 * It displays the avatars of the assigned users along with their names.
 * @param {object} task - A task object containing the `assignedTo` array.
 */
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

/**
 * Renders the subtasks of a given task in the task details modal as a list of checkboxes.
 * It iterates through the `subtasks` array, determines if each subtask is marked as checked,
 * and generates the corresponding HTML for a checkbox and its label.
 * @param {object} task - A task object containing the `subtasks` array.
 */
function setModalSubtasks(task) {
    const box = document.querySelector(".subtasks-wrapper");
    box.innerHTML = task.subtasks
        .map((s, i) => {
            const [key, value] = Object.entries(s)[0];
            const isChecked = value.startsWith("[x]");
            const label = isChecked ? value.replace("[x] ", "") : value;

            return `
                <div class="modal-card-subtask-wrapper d-flex-center">
                    <label class="modal-card-subtask gap-16">
                        <input 
                            type="checkbox" 
                            id="subtask-${key}" 
                            ${isChecked ? "checked" : ""} 
                            onchange="toggleSubtaskCheckbox('${task.id}', ${i})"
                        />
                        <span class="checkmark"></span>
                        <span>${label}</span>
                    </label>
                </div>`;
        })
        .join("");
}


/**
 * Displays the details of a selected contact on the right side of the contacts page.
 * It generates HTML containing the contact's avatar (with initials and background color),
 * name, and contact information (email and phone number), along with edit and delete buttons.
 * It also handles a slide-in animation for the contact details container.
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function showContactDetails(name, email, phone) {
    const initial = name.trim()[0].toUpperCase();
    const second = name.split(" ")[1]?.[0]?.toUpperCase() || "";
    const color = letterColors[initial] || "#999";
    const html = `
        <div class="contact-details-card">
            <div class="contact-header">
                <div class="contact-avatar-large" style="background-color:${color};">${initial}${second}</div>
                <div class="name-action-alignment">
                    <h3 class="details-name">${name}</h3>
                    <div class="contact-details-actions-containter">
                        <div class="contact-details-actions-1">
                            <button id="edit"><img class="actions-img" src="/assets/img/edit.png"> Edit</button>
                        </div>
                        <div class="contact-details-actions-2">
                            <button id="deleteBtn"><img class="actions-img" src="/assets/img/delete.png"> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="details-label">Contact Information</div>
            <div class="details-info">
                <div><strong>Email</strong><br><br><a class="email-address" href="mailto:${email}">${email}</a></div>
                <div><strong>Phone</strong><br><br>${phone}</div>
            </div>
        </div>`;
    const container = document.querySelector(".contacts-right-bottom");
    container.classList.remove("slide-in");
    void container.offsetWidth;
    container.innerHTML = html;
    container.classList.add("slide-in");
}

// opens the "Add Contact" overlay and resets relevant states
/**
 * Opens the "Add Contact" overlay, resets the editing state (`isEditing` to false and
 * `currentEditingContact` to null), sets the overlay title to "Add Contact", displays the
 * overlay description, updates the "Create Contact" button text and icon, resets the overlay avatar,
 * clears the contact form, and updates the floating action buttons. It also ensures the cancel
 * button's transition and margin are reset.
 */
function openOverlay() {
    isEditing = false;
    currentEditingContact = null;
    document.getElementById("addContactOverlay").classList.add("open");
    document.getElementById("overlayTitle").textContent = "Add Contact";
    document.getElementById("overlayDescription").style.display = "block";
    document.getElementById("createContact").innerHTML = `
        <span>${isEditing ? "Save" : "Create Contact"}</span>
        <span class="checkmark-icon"></span>
    `;
    document.getElementById(
        "overlayAvatar"
    ).innerHTML = `<img class="vector" src="/assets/img/addnewcontact.png">`;
    document.getElementById("overlayAvatar").style.backgroundColor =
        "transparent";
    clearForm();

    const cancelBtn = document.getElementById("cancelAddContact");
    if (cancelBtn) {
        cancelBtn.style.transition = "none";
        cancelBtn.style.marginLeft = "0px";
    }
    updateFloatingButtons();
}

/**
 * Creates a new HTML element for a contact item in the contact list.
 * It generates the initials and background color for the contact's avatar based on their name.
 * The created element includes the avatar, name, and email, and stores the name, email, and phone
 * as data attributes.
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {HTMLElement} The newly created contact item div element.
 */
function buildContactItem(name, email, phone) {
    const initials = getInitials(name);
    const color = letterColors[name[0].toUpperCase()] || "#000";
    const item = document.createElement("div");
    item.className = "contact-item";
    item.dataset.name = name;
    item.dataset.email = email;
    item.dataset.phone = phone;
    item.innerHTML = `
        <div class="contact-avatar" data-name="${name}" style="background-color:${color}">${initials}</div>
        <div class="contact-details">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${email}</div>
        </div>`;
    return item;
}

/**
 * Finds an existing contact group container in the contact list for a given letter,
 * or creates a new one if it doesn't exist. The group container is used to organize
 * contacts alphabetically.
 * @param {string} letter - The uppercase letter that the contact group should correspond to.
 * @param {HTMLElement} list - The HTML element representing the contact list container.
 * @returns {HTMLElement} The existing or newly created contact group div element.
 */
function getOrCreateGroup(letter, list) {
    let group = [...list.querySelectorAll(".contact-group")].find(
        (g) => g.querySelector(".contact-group-letter")?.textContent === letter
    );
    if (!group) {
        group = document.createElement("div");
        group.className = "contact-group";
        group.innerHTML = `<div class="contact-group-letter">${letter}</div>`;
        list.appendChild(group);
    }
    return group;
}

/**
 * Returns the HTML template for a single subtask list item.
 * The template includes a visual bullet point, an input field for the subtask text (initially disabled for display),
 * and icons for editing, deleting, and confirming edits to the subtask.
 * @param {number} index - The unique index of the subtask, used in the input field's ID.
 * @param {string} subtaskValue - The current text value of the subtask.
 * @returns {string} The HTML string for a subtask list item.
 */
function getSubtaskTemplate(index, subtaskValue) {
    return `<li class="subtask-list-item br-10" ondblclick="enableSubtaskEdit('subtask-${index}')">
                <span class="d-flex-center">•</span>
                <div class="subtask-list-item-content-wrapper d-flex-space-between">
                    <input class="subtask-item-input" id="subtask-${index}" value="${subtaskValue}" onkeydown="editSubtaskOnKeyPress('subtask-${index}', event)" disabled>
                    <div class="d-flex-space-between edit-subtask-icons">
                        <span class="edit-marker" onclick="enableSubtaskEdit('subtask-${index}')"></span>
                        <span class="confirm-input-icons-separator-1">|</span>
                        <span class="delete-marker" onclick="deleteSubtask('subtask-${index}')"></span>
                        <span class="confirm-input-icons-separator-2">|</span>
                        <span class="confirm-icon" onclick="confirmEditSubtask('subtask-${index}')"></span>
                    </div>
                </div>
            </li>`
}

/**
 * Returns the HTML template for a single user to be listed in the "Assign to" dropdown.
 * It includes the user's avatar (with initials and background color), their name, and a checkbox-like element
 * to indicate selection status.
 * @param {string} userName - The full name of the user.
 * @param {number} index - A unique index for the user, used in the list item's ID.
 * @param {string} wrapperClass - The CSS class for the list item wrapper, used for styling based on selection.
 * @param {string} checkboxClass - The CSS class for the checkbox-like span, used for visual indication of selection.
 * @param {string} initials - The initials of the user's name.
 * @param {string} iconBackgroundColor - The background color for the user's avatar icon.
 * @returns {string} The HTML string for a user in the "Assign to" dropdown.
 */
function getUsersToAssignTemplate(userName, index, wrapperClass, checkboxClass, initials, iconBackgroundColor) {
    return `<li id="US-${index}" class="${wrapperClass} d-flex-space-between br-10"
                    onclick="assignContactToTask('US-${index}', event)">
                    <div class="d-flex-space-between gap-16">
                        <span class="single-contact-icon d-flex-center" style="background-color: ${iconBackgroundColor}">${initials}</span>
                        <span>${userName}</span>
                    </div>
                    <span class="${checkboxClass}"></span>
                </li>`;
}

/**
 * Returns the HTML template for a user avatar icon, displaying the user's initials with a background color.
 * @param {string} initials - The initials of the user's name.
 * @param {string} iconBackgroundColor - The background color for the avatar icon.
 * @returns {string} The HTML string for a user avatar icon.
 */
function getAvatarTemplate(initials, iconBackgroundColor) {
    return `<span class="single-contact-icon d-flex-center" style="background-color: ${iconBackgroundColor}">${initials}</span>`
}

/**
 * Returns the HTML template for a single user to be listed in the "Assign to" dropdown within the task form.
 * It includes the user's avatar, name, and a checkbox to indicate if they are selected.
 * The styling of the list item and checkbox changes based on the `isSelected` parameter.
 * @param {string} userName - The full name of the user.
 * @param {number} index - A unique index for the user, used in the list item's ID.
 * @param {boolean} isSelected - A boolean indicating whether the user is currently selected.
 * @param {string} initials - The initials of the user's name.
 * @param {string} iconBackgroundColor - The background color for the user's avatar icon.
 * @returns {string} The HTML string for a user in the "Assign to" dropdown in the task form.
 */
function getUsersToAssignTemplateForTaskForm(userName, index, isSelected, initials, iconBackgroundColor) {
    const wrapperClass = isSelected
        ? "single-contact-wrapper-checked d-flex-space-between br-10"
        : "single-contact-wrapper d-flex-space-between br-10";

    const checkboxClass = isSelected
        ? "single-contact-checkbox-checked"
        : "single-contact-checkbox-unchecked";

    return `
        <li id="TF-${index}" class="${wrapperClass}"
            onclick="assignContactToTaskForm('TF-${index}', event)">
            <div class="d-flex-space-between gap-16">
                <span class="single-contact-icon d-flex-center" style="background-color: ${iconBackgroundColor}">${initials}</span>
                <span>${userName}</span>
            </div>
            <span class="${checkboxClass}"></span>
        </li>`;
}

/**
 * Returns the HTML template for a single user to be listed in the "Assign to" dropdown within the edit task form.
 * It includes the user's avatar, name, and a checkbox to indicate if they are selected.
 * The styling of the list item and checkbox changes based on the `isSelected` parameter.
 * The `onclick` event calls `toggleAssigned` to handle the assignment logic.
 * @param {string} userName - The full name of the user.
 * @param {number} index - A unique index for the user, used in the list item's ID.
 * @param {boolean} isSelected - A boolean indicating whether the user is currently selected.
 * @param {string} initials - The initials of the user's name.
 * @param {string} iconBackgroundColor - The background color for the user's avatar icon.
 * @returns {string} The HTML string for a user in the "Assign to" dropdown in the edit task form.
 */
function getUsersToAssignTemplateForEditTaskForm(userName, index, isSelected, initials, iconBackgroundColor) {
    const wrapperClass = isSelected
        ? "single-contact-wrapper-checked d-flex-space-between br-10"
        : "single-contact-wrapper d-flex-space-between br-10";

    const checkboxClass = isSelected
        ? "single-contact-checkbox-checked"
        : "single-contact-checkbox-unchecked";

    return `
        <li id="EDIT-${index}" class="${wrapperClass}"
            onclick="toggleAssigned('${userName}', 'assigned-to-dropdown-edit')">
            <div class="d-flex-space-between gap-16">
                <span class="single-contact-icon d-flex-center" style="background-color:${iconBackgroundColor}">${initials}</span>
                <span>${userName}</span>
            </div>
            <span class="${checkboxClass}"></span>
        </li>`;
}



/**
 * Renders a button with "Edit" text. This function seems to be a placeholder or a very basic
 * way to generate an edit button, likely intended for task cards.
 * @param {object} task - The task object for which the edit button is being rendered.
 * @returns {string} The HTML string for an edit button.
 */
function renderTaskCard(task) {
    return `
        <button onclick="openEditOverlay(getTaskById('${task.id}'))">Edit</button>
    `;
}


/**
 * Returns the HTML template for a single subtask list item within an edit context.
 * Similar to `getSubtaskTemplate`, but specifically styled for the edit view.
 * It includes a bullet point, an input field (initially disabled), and icons for editing,
 * deleting, and confirming edits.
 * @param {number} index - The unique index of the subtask.
 * @param {string} subtaskValue - The current text value of the subtask.
 * @returns {string} The HTML string for an editable subtask list item.
 */
function getSubtaskEditTemplate(index, subtaskValue) {
    return `<li class="subtask-list-item br-10" ondblclick="enableSubtaskEdit('subtask-${index}')">
                <span class="d-flex-center">•</span>
                <div class="subtask-list-item-content-wrapper d-flex-space-between">
                    <input class="subtask-item-input" id="subtask-${index}" value="${subtaskValue}" onkeydown="editSubtaskOnKeyPress('subtask-${index}', event)" disabled>
                    <div class="edit-subtask-icons-edit">
                        <span class="edit-marker" onclick="enableSubtaskEdit('subtask-${index}')"></span>
                        <span class="confirm-input-icons-separator-1">|</span>
                        <span class="delete-marker" onclick="deleteSubtask('subtask-${index}')"></span>
                        <span class="confirm-input-icons-separator-2">|</span>
                        <span class="confirm-icon" onclick="confirmEditSubtask('subtask-${index}')"></span>
                    </div>
                </div>
            </li>`
}
