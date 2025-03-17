// async function init() {
//   await includeHTML();
// }

// async function includeHTML() {
//   let sidebarRef = document.getElementById("sidebarRef");
//   let headerRef = document.getElementById("headerRef");
//   let sidebarRefFile = sidebarRef.getAttribute("w3-include-html");
//   let headerRefFile = headerRef.getAttribute("w3-include-html");
//   await fetchFile(sidebarRef, sidebarRefFile);
//   await fetchFile(headerRef, headerRefFile);
// }

// async function fetchFile(element, file) {
//   if (!file) return;
//   try {
//     const response = await fetch(file);
//     if (!response.ok) {
//       throw new Error("Page not found.");
//     }
//     element.innerHTML = await response.text();
//   } catch (error) {
//     element.innerHTML = error.message;
//   } finally {
//     element.removeAttribute("w3-include-html");
//   }
// }

async function init() {
  await includeHTML();
}

async function includeHTML() {
  let generalFrameRef = document.getElementById("general-frame");
  let generalFrameFile = generalFrameRef.getAttribute("w3-include-html");
  await fetchFile(generalFrameRef, generalFrameFile);
}

async function fetchFile(element, file) {
  if (!file) return;
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("Page not found.");
    }
    element.innerHTML = await response.text();
  } catch (error) {
    element.innerHTML = error.message;
  } finally {
    element.removeAttribute("w3-include-html");
  }
}

// Array of tasks to be displayed on the board
const tasks = [
  {
    title: "Design the Homepage", // Task title
    description: "Create a wireframe for the main landing page.", // Task description
    priority: "urgent", // Task priority: "urgent", "medium", "low"
    taskType: "technical", // Task type: "technical" or "userStory"
  },
  {
    title: "Implement Login System",
    description: "Develop authentication using Firebase Auth.",
    priority: "medium",
    taskType: "technical",
  },
];

// Wait until the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  const boardColumn = document.querySelector(".column-content-wrapper"); // Select the board column

  if (!boardColumn) return; // Stop execution if boardColumn is not found

  // Iterate through each task in the tasks array
  tasks.forEach((task) => {
    // Determine the label based on task type
    const taskLabel =
      task.taskType === "technical" ? "Technical Task" : "User Story";
    const labelColor = task.taskType === "technical" ? "#1fd7c1" : "blue"; // Different colors for labels

    // Construct the HTML structure for the task card
    const taskHTML = `
          <div class="board-card d-flex-center">
              <div class="board-card-content d-flex-column">
                  <label class="board-card-label br-8 d-flex-center" style="background: ${labelColor};">${taskLabel}</label>
                  <div class="board-card-text d-flex-column br-10">
                      <h4 class="board-card-title">${task.title}</h4>
                      <p class="board-card-description">${task.description}</p>
                  </div>
                  <div class="status d-flex-center">
                      <div class="progress" role="progressbar" aria-label="Subtask Progress" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar" style="width: 60%"></div>
                      </div>
                      <div class="d-flex-center subtasks">
                          <span>0</span>
                          <span>/</span>
                          <span>3</span>
                          <span>Subtasks</span>
                      </div>
                  </div>
                  <div class="d-flex-space-between board-card-footer">
                      <div class="user-icons-wrapper d-flex-center">
                          <span class="user-icons d-flex-center">US</span>
                          <span class="user-icons d-flex-center">US</span>
                          <span class="user-icons d-flex-center">US</span>
                      </div>
                      <img src="../assets/img/icons/${task.priority}-icon.png" class="priority" />
                  </div>
              </div>
          </div>
      `;

    boardColumn.insertAdjacentHTML("beforeend", taskHTML);
  });
});
