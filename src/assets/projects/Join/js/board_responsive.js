import { database, ref, set } from "../js/firebase.js";

/**
 * Handles the display of a "no results" message based on the search text length,
 * the count of matching results, and the current window width.
 * It shows a global "no results" message for desktop (width >= 1440px)
 * and a per-column placeholder for mobile/smaller screens (width < 1440px).
 * @param {string} text - The current search text.
 * @param {number} matchCount - The number of search results found.
 */
function handleNoResultsMessage(text, matchCount) {
    const noResults = document.getElementById("no-results");
    const noTaskPlaceholders = document.querySelectorAll(".no-tasks-feedback");
    const showGlobalNoResults =
        text.length >= 2 && matchCount === 0 && window.innerWidth >= 1440;
    const showPerColumnPlaceholder =
        text.length >= 2 && matchCount === 0 && window.innerWidth < 1440;
    if (noResults) {
        noResults.style.display = showGlobalNoResults ? "block" : "none";
    }
    noTaskPlaceholders.forEach((placeholder) => {
        placeholder.style.display = showPerColumnPlaceholder ? "flex" : "none";
    });
}

/**
 * Handles the click event for adding a new task, adapting the behavior
 * based on the window width. On smaller screens (< 1200px), it navigates
 * to the add_task.html page. On larger screens, it opens the task form
 * as an overlay.
 */
function handleAddTaskClickResponsive() {
    const width = window.innerWidth;
    if (width < 1200) {
        window.location.href = "add_task.html";
    } else {
        openTaskForm();
    }
}

/**
 * Toggles the visibility of the "Move to" menu associated with a task card.
 * It prevents the click event from propagating, finds the menu related to the clicked button,
 * closes any other open menus, and then toggles the 'd-none' class on the target menu.
 * It also toggles a 'menu-open' class on the card for visual feedback.
 * @param {HTMLElement} button - The button that triggers the menu toggle.
 * @param {Event} event - The click event.
 */
function toggleMoveMenu(button, event) {
    event.stopPropagation();
    const card = button.closest(".board-card");
    const menu = card.querySelector(".move-menu");
    closeAllMenus(menu);
    menu.classList.toggle("d-none");
    card.classList.toggle("menu-open", !menu.classList.contains("d-none"));
}

/**
 * Closes all "Move to" menus that are currently open, except for the one optionally provided as a parameter.
 * It also removes the 'menu-open' class from any task cards that have it.
 * @param {HTMLElement | null} [current=null] - The menu to exclude from closing (i.e., the currently open one).
 */
function closeAllMenus(current = null) {
    document.querySelectorAll(".move-menu").forEach((m) => {
        if (m !== current) m.classList.add("d-none");
    });
    document
        .querySelectorAll(".board-card.menu-open")
        .forEach((c) => c.classList.remove("menu-open"));
}

/**
 * Closes any open "Move to" menus when a click event occurs outside of a menu or a button that opens a menu.
 */
document.addEventListener("click", (e) => {
    const insideMenu = e.target.closest(".move-menu");
    const isButton = e.target.closest(".card-action-btn");
    if (!insideMenu && !isButton) closeAllMenus();
});

/**
 * Moves a task to a different column on the board by updating its 'status' property
 * and then re-rendering all the columns to reflect the change. It also closes any open menus.
 * @param {string} status - The new status (column ID) to which the task should be moved.
 * @param {Event} event - The click event.
 */
function moveTaskToColumn(status, event) {
    event.stopPropagation();
    const openCard = document.querySelector(".board-card.menu-open");
    if (!openCard) return;
    const taskId = openCard.dataset.taskId;
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;
    task.status = status;
    const taskRef = ref(database, `tasks/${task.id}`);
    set(taskRef, task);
    renderAllColumns();
    closeAllMenus();
}

window.toggleMoveMenu = toggleMoveMenu;
window.handleAddTaskClickResponsive = handleAddTaskClickResponsive;
window.moveTaskToColumn = moveTaskToColumn;
window.handleNoResultsMessage = handleNoResultsMessage;
window.closeAllMenus = closeAllMenus;




