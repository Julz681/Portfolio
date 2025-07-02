import { database, ref, onValue } from '../firebase.js';
    /**
     * DOM elements for updating task counts and deadlines.
     */
document.addEventListener('DOMContentLoaded', function () {
    const elements = {
        todo: document.querySelector('.wrapper_todo_done .metric-box:first-child h2'),
        done: document.querySelector('.wrapper_todo_done .metric-box:nth-child(2) h2'),
        urgent: document.querySelector('.metric-box-urgent .wrapper_box h2'),
        total: document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(1) h2'),
        progress: document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(2) h2'),
        feedback: document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(3) h2'),
        deadline: document.querySelector('.metric-box-urgent .deadline-info p:first-child')};
    const tasksRef = ref(database, 'tasks');
    onValue(tasksRef, (snapshot) => {
        const tasks = snapshot.val();
        if (tasks) updateTaskCounts(tasks, elements);
        else resetCounts(elements);});
    updateGreeting();
    updateUserProfileInitials();
    handleScreenLogic();
    window.addEventListener('resize', handleScreenLogic);
});

/**
 * Updates task counters and the urgent deadline display.
 * @param {Object} tasks - Task list retrieved from Firebase.
 * @param {Object} el - Object containing DOM references for output.
 */
function updateTaskCounts(tasks, el) {
    const counters = initCounters();
    for (const id in tasks) countTaskStats(tasks[id], counters);
    updateDOMCounts(el, counters);
}

/**
 * Initializes a blank stats counter object.
 * @returns {Object} Initialized counters for task stats.
 */
function initCounters() {
    return {
        todo: 0, done: 0, urgent: 0, total: 0,
        progress: 0, feedback: 0, closestDeadline: null
    };
}

/**
 * Increments the appropriate counters for a single task.
 * @param {Object} task - A task object.
 * @param {Object} c - Counters object to update.
 */
function countTaskStats(task, c) {
    c.total++;
    if (task.status === 'to-do') c.todo++;
    if (task.status === 'done') c.done++;
    if (task.status === 'in-progress') c.progress++;
    if (task.status === 'await-feedback') c.feedback++;
    if (task.priority === 'urgent') countUrgent(task, c);
}

/**
 * Updates urgent task count and finds closest deadline.
 * @param {Object} task - A task object with "urgent" priority.
 * @param {Object} c - Counters object to update.
 */
function countUrgent(task, c) {
    c.urgent++;
    if (!task.dueDate) return;
    const date = new Date(task.dueDate);
    if (!c.closestDeadline || date < c.closestDeadline) c.closestDeadline = date;
}

/**
 * Updates the DOM with calculated task statistics.
 * @param {Object} el - Object containing DOM elements.
 * @param {Object} c - Counters containing task data.
 */
function updateDOMCounts(el, c) {
    if (el.todo) el.todo.textContent = c.todo;
    if (el.done) el.done.textContent = c.done;
    if (el.urgent) el.urgent.textContent = c.urgent;
    if (el.total) el.total.textContent = c.total;
    if (el.progress) el.progress.textContent = c.progress;
    if (el.feedback) el.feedback.textContent = c.feedback;
    updateDeadlineText(el.deadline, c.closestDeadline);
}

/**
 * Displays the closest urgent deadline or fallback text.
 * @param {HTMLElement} el - Element to show deadline.
 * @param {Date|null} date - Closest deadline date or null.
 */
function updateDeadlineText(el, date) {
    if (!el) return;
    if (!date) el.textContent = 'No urgent tasks';
    else el.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Resets all task-related DOM elements to default state.
 * @param {Object} el - Object containing DOM element references.
 */
function resetCounts(el) {
    if (el.todo) el.todo.textContent = 0;
    if (el.done) el.done.textContent = 0;
    if (el.urgent) el.urgent.textContent = 0;
    if (el.total) el.total.textContent = 0;
    if (el.progress) el.progress.textContent = 0;
    if (el.feedback) el.feedback.textContent = 0;
    if (el.deadline) el.deadline.textContent = 'No urgent tasks';
}

/**
 * Updates the greeting message depending on the time of day.
 * Adds the user name if logged in and not a guest.
 */
function updateGreeting() {
    const greetingEl = document.querySelector('.greeting p');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let text = hour < 12 ? 'Good morning' :
        hour < 18 ? 'Good afternoon' : 'Good evening';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (!isGuest) {
        const name = localStorage.getItem('loggedInUserName') || 'User';
        text += `,<br><span class='highlight'>${name}</span>`;
    }
    greetingEl.innerHTML = text;
}

/**
 * Sets the user profile icon initials based on the username.
 * Defaults to "G" for guests or missing user data.
 */
function updateUserProfileInitials() {
    const span = document.querySelector("#userProfile span");
    if (!span) return;
    const isGuest = localStorage.getItem("isGuest") === "true";
    const name = localStorage.getItem("loggedInUserName");
    if (isGuest || !name) {
        span.textContent = "G";
    } else {
        const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
        span.textContent = initials;
    }
}

/**
 * Controls fade animation between greeting and main UI
 * depending on screen size (mobile vs desktop).
 */
function handleScreenLogic() {
    const greetingDiv = document.querySelector('.greeting');
    const containerDiv = document.querySelector('.container');
    if (!greetingDiv || !containerDiv) return;
    clearTimeout(window.timeoutId);
    if (window.innerWidth >= 1200) {
        greetingDiv.style.display = 'block';
        containerDiv.style.display = 'flex';
        greetingDiv.style.opacity = '1';
        return;
    }
    containerDiv.style.display = 'none';
    window.timeoutId = setTimeout(() => fadeGreeting(greetingDiv, containerDiv), 1000);
}

/**
 * Applies fade-out effect to greeting and shows container.
 * @param {HTMLElement} greeting - Greeting element to fade.
 * @param {HTMLElement} container - Container element to show.
 */
function fadeGreeting(greeting, container) {
    greeting.style.transition = 'opacity 1s ease-in-out';
    greeting.style.opacity = '0';
    setTimeout(() => {
        greeting.style.display = 'none';
        greeting.style.opacity = '1';
        greeting.style.transition = '';
        container.style.display = 'flex';
    }, 1000);
}
