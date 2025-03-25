/**
 * Initializes the drag-and-drop functionality by adding event listeners to the tasks and columns.
 * Sets each task to be draggable and binds the appropriate drag events to the tasks and columns.
 */
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
}

let draggedTask = null;
const DROP_AREA_PADDING = 20;

/**
 * Handles the start of the drag event. 
 * Adds a 'dragging' class to the task and rotates the task by 5 degrees.
 * Sets the data for the dragged task and displays the highlight line.
 * 
 * @param {Event} event - The dragstart event.
 */
function dragStart(event) {
    draggedTask = event.target;
    draggedTask.classList.add('dragging');

    // Rotate the task by 5 degrees while dragging
    draggedTask.style.transform = 'rotate(5deg)';

    event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    document.querySelector('.highlight-line').style.display = 'block';
}

/**
 * Handles the end of the drag event.
 * Removes the 'dragging' class from the task and resets its rotation.
 * Hides the highlight line after the task has been dropped.
 */
function dragEnd() {
    // Remove rotation after dragging
    draggedTask.style.transform = 'none';  // Reset rotation

    draggedTask.classList.remove('dragging');
    removeHighlightLine();
}

/**
 * Handles the dragover event.
 * Displays the highlight line and positions it correctly depending on where the task is being dragged over.
 * 
 * @param {Event} event - The dragover event.
 */
function dragOver(event) {
    event.preventDefault();
    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');
    const highlightLine = document.querySelector('.highlight-line');

    if (columnContent) {
        const rect = columnContent.getBoundingClientRect();
        const allCards = columnContent.querySelectorAll('.board-card');

        let topPosition = rect.top + 10; // If column is empty, set the line at the top

        if (allCards.length > 0) {
            const lastCard = allCards[allCards.length - 1];
            topPosition = lastCard.getBoundingClientRect().bottom + 16;
        }

        highlightLine.style.top = `${topPosition}px`;
        highlightLine.style.left = `${rect.left + rect.width / 2 - highlightLine.offsetWidth / 2}px`; // Center the line
        highlightLine.style.width = `252px`; // Set a fixed width for the card
        highlightLine.style.display = 'block';
    }
}

/**
 * Handles the drop event.
 * Moves the dragged task into the appropriate position within the target column.
 * If the task is dropped above an existing card, it will be inserted before that card.
 * Otherwise, it will be appended at the end of the column.
 * 
 * @param {Event} event - The drop event.
 */
function drop(event) {
    event.preventDefault();
    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');
    const highlightLine = document.querySelector('.highlight-line');

    if (columnContent && draggedTask) {
        const allCards = columnContent.querySelectorAll('.board-card');
        const highlightRect = highlightLine.getBoundingClientRect();

        let dropPosition = allCards.length;

        for (let i = 0; i < allCards.length; i++) {
            const cardRect = allCards[i].getBoundingClientRect();
            if (highlightRect.top + highlightRect.height / 2 < cardRect.top + cardRect.height / 2) {
                dropPosition = i;
                break;
            }
        }

        if (dropPosition >= allCards.length) {
            columnContent.appendChild(draggedTask);
        } else {
            columnContent.insertBefore(draggedTask, allCards[dropPosition]);
        }
    }

    removeHighlightLine();
}

/**
 * Creates the highlight line element and appends it to the document body if it does not already exist.
 */
function createHighlightLine() {
    if (!document.querySelector('.highlight-line')) {
        const highlightLine = document.createElement('div');
        highlightLine.classList.add('highlight-line');
        document.body.appendChild(highlightLine);
    }
}

/**
 * Removes the highlight line by setting its display to 'none'.
 */
function removeHighlightLine() {
    document.querySelector('.highlight-line').style.display = 'none';
}

// Initialize the drag-and-drop functionality once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
