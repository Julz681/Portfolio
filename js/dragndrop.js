function init() {
    // This function makes all tasks in board draggable  
    const tasks = document.querySelectorAll('.board-card');
    tasks.forEach(task => {
        task.setAttribute('draggable', true);
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
    });

    
    const columns = document.querySelectorAll('.board-columns');
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });

    createHighlightLine();
    updateAllColumnsPlaceholder(); // Initial check for placeholder visibility in all columns
}

let draggedTask = null;

/**
 * This function starts the dragging process for a task card.
 * It sets the `draggedTask` variable, adds a 'dragging' class to the dragged element,
 * applies a slight rotation for visual feedback, sets the data to be transferred during the drag,
 * and displays the highlight line.
 * @param {DragEvent} event - The drag start event object.
 */
function dragStart(event) {
    draggedTask = event.target;
    draggedTask.classList.add('dragging');
    draggedTask.style.transform = 'rotate(5deg)'; // Slightly rotate the card while dragging

    event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    document.querySelector('.highlight-line').style.display = 'block';
}

/**
 * This function is called when the dragging process ends.
 * It removes the rotation and the 'dragging' class from the task card,
 * hides the highlight line, and updates the visibility of the placeholder text in all columns.
 */
function dragEnd() {
    draggedTask.style.transform = 'none'; // Reset rotation
    draggedTask.classList.remove('dragging');
    removeHighlightLine();
    updateAllColumnsPlaceholder(); // Update placeholder visibility after drag ends
}

/**
 * This function handles the dragover event for a column.
 * It prevents the default behavior to allow dropping, identifies the target column and its content,
 * and positions the highlight line to indicate where the dragged task will be dropped.
 * @param {DragEvent} event - The drag over event object.
 */
function dragOver(event) {
    event.preventDefault(); // Prevent default behavior (to allow drop)
    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');
    const highlightLine = document.querySelector('.highlight-line');

    if (columnContent) {
        const rect = columnContent.getBoundingClientRect();
        const allCards = columnContent.querySelectorAll('.board-card');

        let topPosition = rect.top + 10; // If no cards exist, set the line at the top

        // If cards exist, position the highlight line below the last card
        if (allCards.length > 0) {
            const lastCard = allCards[allCards.length - 1];
            topPosition = lastCard.getBoundingClientRect().bottom + 16; // Line below the last card
        }

        highlightLine.style.top = `${topPosition}px`; // Position the line below the last card
        highlightLine.style.left = `${rect.left + rect.width / 2 - 110}px`; // Center the line
        highlightLine.style.display = 'block'; // Show the line
    }
}

/**
 * This function handles the drop event when a task card is dropped onto a column.
 * It prevents the default behavior, identifies the target column and its content,
 * appends the dragged task to the end of the column's content, updates the placeholder visibility,
 * determines the new status based on the column, and updates the task's status in Firebase.
 * Finally, it hides the highlight line.
 * @param {DragEvent} event - The drop event object.
 */
function drop(event) {
    event.preventDefault(); // Prevent default behavior

    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');

    // If cards exist, add the card to the end of the column
    if (columnContent && draggedTask) {
        columnContent.appendChild(draggedTask); // Append the card to the end of the column
        updateAllColumnsPlaceholder(); // Update placeholder visibility after drop

        // Ermittle den neuen Status basierend auf der Spalte und speichere ihn in Firebase
        const taskId = draggedTask.dataset.taskId;
        const newStatus = getStatusFromColumn(column);
        if (taskId && newStatus) {
            window.updateTaskStatusInFirebase(taskId, newStatus);
        }
    }

    removeHighlightLine(); // Hide the highlight line after the drop
}

/**
 * This function determines the status of a task based on the class name of the column it is in.
 * @param {Element} column - The HTML element representing the column.
 * @returns {string|null} The corresponding status ('to do', 'in progress', 'await feedback', 'done'),
 * or null if the column's class does not match any known status.
 */
function getStatusFromColumn(column) {
    if (column.classList.contains('to-do-wrapper')) return 'to do';
    if (column.classList.contains('in-progress-wrapper')) return 'in progress';
    if (column.classList.contains('await-feedback-wrapper')) return 'await feedback';
    if (column.classList.contains('done-wrapper')) return 'done';
    return null;
}

/**
 * This function creates the highlight line element and appends it to the document body
 * if it does not already exist. The highlight line is used to visually indicate
 * the drop target during drag and drop operations.
 */
function createHighlightLine() {
    if (!document.querySelector('.highlight-line')) {
        const highlightLine = document.createElement('div');
        highlightLine.classList.add('highlight-line');
        document.body.appendChild(highlightLine);
    }
}

/**
 * This function hides the highlight line by setting its `display` style to 'none'.
 */
function removeHighlightLine() {
    document.querySelector('.highlight-line').style.display = 'none';
}

/**
 * This function updates the visibility of the "No tasks" feedback message in all board columns.
 * It iterates through each column, checks if there are any task cards (excluding the one being dragged),
 * and shows or hides the feedback message accordingly.
 */
function updateAllColumnsPlaceholder() {
    const columns = document.querySelectorAll('.board-columns');
    columns.forEach(column => {
        const columnContent = column.querySelector('.column-content-wrapper');
        const noTasksFeedback = columnContent.querySelector('.no-tasks-feedback');

        if (columnContent && noTasksFeedback) {
            // Only count elements with class 'board-card'
            const numberOfCards = columnContent.querySelectorAll('.board-card:not(.dragging)').length;
            const isDraggingInThisColumn = columnContent.contains(draggedTask);

            if (numberOfCards === 0 && !isDraggingInThisColumn) {
                // Show feedback when no cards are placed in column
                noTasksFeedback.classList.remove('d_none');
            } else {
                // Show no feedback when cards are placed in column
                noTasksFeedback.classList.add('d_none');
            }
        }
    });
}

// Initialize drag & drop when the page loads
document.addEventListener('DOMContentLoaded', init);