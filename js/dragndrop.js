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

/**
 * Startet das Dragging und zeigt die Highlight-Line an.
 */
function dragStart(event) {
    draggedTask = event.target;
    draggedTask.classList.add('dragging');
    draggedTask.style.transform = 'rotate(5deg)'; // Drehe die Karte leicht beim Draggen
    
    event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    document.querySelector('.highlight-line').style.display = 'block';
}

/**
 * Entfernt den Dragging-Effekt nach dem Loslassen.
 */
function dragEnd() {
    draggedTask.style.transform = 'none'; // Zurücksetzen der Drehung
    draggedTask.classList.remove('dragging');
    removeHighlightLine();
}

/**
 * Handhabt das Dragover-Ereignis, damit die Karte richtig positioniert wird.
 * Hier wird auch die Highlight-Line angezeigt.
 */
function dragOver(event) {
    event.preventDefault(); // Standardverhalten verhindern (damit das Drop möglich ist)
    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');
    const highlightLine = document.querySelector('.highlight-line');

    if (columnContent) {
        const rect = columnContent.getBoundingClientRect();
        const allCards = columnContent.querySelectorAll('.board-card');

        let topPosition = rect.top + 10; // Wenn keine Karten vorhanden sind, setze die Linie oben

        // Wenn Karten existieren, positioniere die Highlight-Line unter der letzten Karte
        if (allCards.length > 0) {
            const lastCard = allCards[allCards.length - 1];
            topPosition = lastCard.getBoundingClientRect().bottom + 16; // Linie unter der letzten Karte
        }

        highlightLine.style.top = `${topPosition}px`; // Positioniere die Linie unterhalb der letzten Karte
        highlightLine.style.left = `${rect.left + rect.width / 2 - 126}px`; // Linie zentrieren
        highlightLine.style.display = 'block'; // Zeige die Linie
    }
}

/**
 * Handhabt das Drop-Ereignis. Der Drop ist jetzt in der gesamten Spalte möglich.
 */
function drop(event) {
    event.preventDefault(); // Verhindert das Standardverhalten

    const column = event.target.closest('.board-columns');
    const columnContent = column.querySelector('.column-content-wrapper');

    // Wenn Karten vorhanden sind, fügen wir die Karte ans Ende der Spalte hinzu
    if (columnContent && draggedTask) {
        columnContent.appendChild(draggedTask); // Karte ans Ende der Spalte anfügen
    }

    removeHighlightLine(); // Verstecke die Highlight-Line nach dem Drop
}

/**
 * Erstellt die Highlight-Line, falls diese noch nicht existiert.
 */
function createHighlightLine() {
    if (!document.querySelector('.highlight-line')) {
        const highlightLine = document.createElement('div');
        highlightLine.classList.add('highlight-line');
        document.body.appendChild(highlightLine);
    }
}

/**
 * Entfernt die Highlight-Line.
 */
function removeHighlightLine() {
    document.querySelector('.highlight-line').style.display = 'none';
}

// Initialisiere das Drag & Drop beim Laden der Seite
document.addEventListener('DOMContentLoaded', init);
