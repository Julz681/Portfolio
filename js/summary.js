import { database, ref, onValue } from '../js/firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    const todoCountElement = document.querySelector('.wrapper_todo_done .metric-box:first-child h2');
    const doneCountElement = document.querySelector('.wrapper_todo_done .metric-box:nth-child(2) h2');
    const urgentCountElement = document.querySelector('.metric-box-urgent .wrapper_box h2');
    const tasksInBoardCountElement = document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(1) h2');
    const inProgressCountElement = document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(2) h2');
    const awaitingFeedbackCountElement = document.querySelector('.wrapper_tasks .metric-box-tasks:nth-child(3) h2');
    const urgentDeadlineElement = document.querySelector('.metric-box-urgent .deadline-info p:first-child');

    /**
     * Updates the displayed counts for each task status.
     * @param {object} tasks - An object containing all tasks from Firebase.
     */
    function updateTaskCounts(tasks) {
        let todoCount = 0;
        let doneCount = 0;
        let urgentCount = 0;
        let inProgressCount = 0;
        let awaitingFeedbackCount = 0;
        let allTasksCount = 0;
        let closestUrgentDeadline = null;

        for (const taskId in tasks) {
            if (tasks.hasOwnProperty(taskId)) {
                const task = tasks[taskId];
                allTasksCount++;
                switch (task.status) {
                    case 'to-do':
                        todoCount++;
                        break;
                    case 'done':
                        doneCount++;
                        break;
                    case 'in-progress':
                        inProgressCount++;
                        break;
                    case 'await-feedback':
                        awaitingFeedbackCount++;
                        break;
                }
                // Counts urgent tasks realted to priority
                if (task.priority === 'urgent') {
                    urgentCount++;
                    if (task.dueDate) {
                        const dueDate = new Date(task.dueDate);
                        if (!closestUrgentDeadline || dueDate < closestUrgentDeadline) {
                            closestUrgentDeadline = dueDate;
                        }
                    }
                }
            }
        }

        if (todoCountElement) todoCountElement.textContent = todoCount;
        if (doneCountElement) doneCountElement.textContent = doneCount;
        if (urgentCountElement) urgentCountElement.textContent = urgentCount;
        if (tasksInBoardCountElement) tasksInBoardCountElement.textContent = allTasksCount;
        if (inProgressCountElement) inProgressCountElement.textContent = inProgressCount;
        if (awaitingFeedbackCountElement) awaitingFeedbackCountElement.textContent = awaitingFeedbackCount;
        if (urgentDeadlineElement && closestUrgentDeadline) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            urgentDeadlineElement.textContent = closestUrgentDeadline.toLocaleDateString('en-US', options);
        } else if (urgentDeadlineElement) {
            urgentDeadlineElement.textContent = 'No urgent tasks';
        }
    }

    // Get a reference to the 'Tasks' node in your Firebase database
    const tasksRef = ref(database, 'tasks');

    // Set up a listener to be notified whenever there are changes to the data at the tasksRef
    onValue(tasksRef, (snapshot) => {
        
        const tasks = snapshot.val();
        if (tasks) {
            updateTaskCounts(tasks);
        } else {
            // If there are no tasks, reset the counts to 0
            if (todoCountElement) todoCountElement.textContent = 0;
            if (doneCountElement) doneCountElement.textContent = 0;
            if (urgentCountElement) urgentCountElement.textContent = 0;
            if (tasksInBoardCountElement) tasksInBoardCountElement.textContent = 0;
            if (inProgressCountElement) inProgressCountElement.textContent = 0;
            if (awaitingFeedbackCountElement) awaitingFeedbackCountElement.textContent = 0;
            if (urgentDeadlineElement) urgentDeadlineElement.textContent = 'No urgent tasks';
        }
    });

    /**
     * This function updates the greeting message based on the current time of day.
     */
    function updateGreeting() {
        const greetingElement = document.querySelector(".greeting p");
        const currentHour = new Date().getHours();
        let greetingText = "Good morning";

        if (currentHour >= 12 && currentHour < 18) {
            greetingText = "Good afternoon";
        } else if (currentHour >= 18 || currentHour < 5) {
            greetingText = "Good evening";
        }

        const isGuest = localStorage.getItem("isGuest") === "true";
        let greetingHTML = `${greetingText}`;

        if (!isGuest) {
            const userName = localStorage.getItem("loggedInUserName") || "User";
            greetingHTML += `, <br> <span class='highlight'>${userName}</span>`;
        }

        greetingElement.innerHTML = greetingHTML;
    }

    /**
     * This function updates the user profile initials.
     */
    function updateUserProfileInitials() {
        const userProfileSpan = document.querySelector("#userProfile span");
        const isGuest = localStorage.getItem("isGuest") === "true";
        const userName = localStorage.getItem("loggedInUserName");

        if (isGuest) {
            userProfileSpan.textContent = "G"; // Always "G" for guests
        } else if (userName) {
            const names = userName.split(" ");
            let initials = "";
            if (names.length > 0) {
                initials += names[0].charAt(0).toUpperCase();
            }
            if (names.length > 1) {
                initials += names[1].charAt(0).toUpperCase();
            }
            userProfileSpan.textContent = initials;
        } else {
            userProfileSpan.textContent = "G"; // Default if there is no name
        }
    }

    const greetingDiv = document.querySelector('.greeting');
    const containerDiv = document.querySelector('.container');
    let timeoutId; // Variable to store the timeout ID

    function handleScreenLogic() {
        if (window.innerWidth < 1200 && containerDiv && greetingDiv) {
            // Clear any existing timeout
            clearTimeout(timeoutId);

            // Initially hide the container
            containerDiv.style.display = 'none';

            // Fade out the greeting after 2 seconds
            timeoutId = setTimeout(() => {
                greetingDiv.style.transition = 'opacity 1s ease-in-out';
                greetingDiv.style.opacity = '0';

                // After the fade out, hide the greeting and show the container
                setTimeout(() => {
                    greetingDiv.style.display = 'none';
                    greetingDiv.style.opacity = '1';
                    greetingDiv.style.transition = '';
                    containerDiv.style.display = 'flex';
                }, 1000);
            }, 1000);
        } else if (window.innerWidth >= 1200 && containerDiv && greetingDiv) {
            // If the screen is large, ensure greeting is visible and container might be as well
            clearTimeout(timeoutId); // Clear any pending timeout
            greetingDiv.style.display = 'block';
            greetingDiv.style.opacity = '1';
            greetingDiv.style.transition = '';
            containerDiv.style.display = 'flex';
        }
    }

    // Call handleScreenLogic on initial load
    handleScreenLogic();

    // Add event listener for window resizing
    window.addEventListener('resize', handleScreenLogic);

    // Call the functions when the page loads
    updateGreeting();
    updateUserProfileInitials();

});