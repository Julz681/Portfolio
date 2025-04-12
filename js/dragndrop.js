function init() {
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
 * Starts the dragging process and displays the highlight line.
 * @param {DragEvent} event - The drag start event.
 */
function dragStart(event) {
    draggedTask = event.target;
    draggedTask.classList.add('dragging');
    draggedTask.style.transform = 'rotate(5deg)'; // Slightly rotate the card while dragging

    event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    document.querySelector('.highlight-line').style.display = 'block';
}

/**
 * Removes the dragging effect after releasing the mouse.
 */
function dragEnd() {
    draggedTask.style.transform = 'none'; // Reset rotation
    draggedTask.classList.remove('dragging');
    removeHighlightLine();
    updateAllColumnsPlaceholder(); // Update placeholder visibility after drag ends
}

/**
 * Handles the dragover event to position the card correctly and display the highlight line.
 * @param {DragEvent} event - The drag over event.
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
 * Handles the drop event. The drop is now possible in the entire column.
 * @param {DragEvent} event - The drop event.
 */
function drop(event) {
    event.preventDefault(); // Prevent default behavior

    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');

    // If cards exist, add the card to the end of the column
    if (columnContent && draggedTask) {
        columnContent.appendChild(draggedTask); // Append the card to the end of the column
        updateAllColumnsPlaceholder(); // Update placeholder visibility after drop
    }

    removeHighlightLine(); // Hide the highlight line after the drop
}

/**
 * Creates the highlight line if it doesn't already exist.
 */
function createHighlightLine() {
    if (!document.querySelector('.highlight-line')) {
        const highlightLine = document.createElement('div');
        highlightLine.classList.add('highlight-line');
        document.body.appendChild(highlightLine);
    }
}

/**
 * Removes the highlight line.
 */
function removeHighlightLine() {
    document.querySelector('.highlight-line').style.display = 'none';
}

/**
 * Updates the visibility of the "No tasks" feedback in all board columns.
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