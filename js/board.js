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
    id: "task-1",
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation",
    priority: "urgent",
    taskType: "userStory",
    dueDate: "10/06/2023",
    assignedTo: ["Judtih Lütke", "Bernadette Pöltl"],
    subtasks: ["Create Recommender", "Get some Recipe", "Implement Backend"],
  },
  {
    id: "task-2",
    title: "Design the Homepage",
    description: "Create a wireframe for the main landing page.",
    priority: "medium",
    taskType: "technical",
    dueDate: "10/06/2023",
    assignedTo: ["Ada Lovelace", "Tobias Fröhler"],
    subtasks: ["Create Wireframe", "Get Approval", "Implement UI"],
  },
  {
    id: "task-3",
    title: "Implement Login System",
    description: "Develop authentication using Firebase Auth.",
    priority: "low",
    taskType: "technical",
    dueDate: "10/10/2023",
    assignedTo: ["Frances Allen", "Edsger Dijkstra"],
    subtasks: ["Setup Firebase", "Create Login Form", "Test Auth Flow"],
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const boardColumn = document.querySelector(".column-content-wrapper");
  const modalOverlay = document.getElementById("task-card-modal");
  const modalCardWrapper = document.querySelector(".modal-card-wrapper");
  const modalCloseButton = document.getElementById("modal-close-button");

  if (!boardColumn) return;

  function renderTasks() {
    boardColumn.innerHTML = "";
    tasks.forEach((task) => {
      const taskLabel = task.taskType === "technical" ? "Technical Task" : "User Story";
      const labelColor = task.taskType === "technical" ? "#1fd7c1" : "blue";

      const taskHTML = `
        <div class="board-card d-flex-center" data-task-id="${task.id}">
          <div class="board-card-content d-flex-column">
            <label class="board-card-label br-8 d-flex-center" style="background: ${labelColor};">${taskLabel}</label>
            <div class="board-card-text d-flex-column br-10">
              <h4 class="board-card-title">${task.title}</h4>
              <p class="board-card-description">${task.description}</p>
            </div>
            <div class="status d-flex-center">
              <div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 60%"></div>
              </div>
              <div class="d-flex-center subtasks">
                <span>0</span> / <span>${task.subtasks.length}</span> Subtasks
              </div>
            </div>
            <div class="d-flex-space-between board-card-footer">
              <div class="user-icons-wrapper d-flex-center">
                ${task.assignedTo.map(user => `<span class="user-icons d-flex-center">${user[0]}</span>`).join("")}
              </div>
              <img src="../assets/img/icons/${task.priority}-icon.png" class="priority" />
            </div>
          </div>
        </div>
      `;

      boardColumn.insertAdjacentHTML("beforeend", taskHTML);
    });

    attachTaskClickEvents();
  }

  function attachTaskClickEvents() {
    document.querySelectorAll(".board-card").forEach((card) => {
      card.addEventListener("click", function () {
        const taskId = this.getAttribute("data-task-id");
        const taskData = tasks.find((task) => task.id === taskId);

        if (taskData) {
          const modalLabel = document.querySelector(".modal-card-label");
          modalLabel.textContent = taskData.taskType === "technical" ? "Technical Task" : "User Story";
          modalLabel.style.background = taskData.taskType === "technical" ? "#1fd7c1" : "blue";

          document.querySelector(".modal-card-title").textContent = taskData.title;
          document.querySelector(".modal-card-content p").textContent = taskData.description;
          document.querySelector(".date-line span:last-child").textContent = taskData.dueDate;
          document.querySelector(".prio-label span").textContent = taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1);
          document.querySelector(".prio-label img").src = `../assets/img/icons/${taskData.priority}-icon.png`;

          const userContainer = document.querySelector(".assignments");
          userContainer.innerHTML = `<span>Assigned to:</span>` + taskData.assignedTo.map(user => `
            <div class="user-line gap-16 d-flex-space-between">
              <span class="user-icons d-flex-center">${user[0]}</span><span>${user}</span>
            </div>
          `).join("");

          const subtaskContainer = document.querySelector(".subtasks-wrapper");
          subtaskContainer.innerHTML = taskData.subtasks.map((subtask, index) => `
            <div class="modal-card-subtask-wrapper d-flex-center">
              <label class="modal-card-subtask gap-16">
                <input type="checkbox" id="subtask-${index}" />
                <span class="checkmark"></span>
                <span>${subtask}</span>
              </label>
            </div>
          `).join("");

          modalOverlay.classList.add("active");
          modalCardWrapper.classList.add("slide-in");
        }
      });
    });
  }

  modalCloseButton.addEventListener("click", function () {
    modalCardWrapper.classList.remove("slide-in");
    modalCardWrapper.classList.add("slide-out");

    setTimeout(() => {
      modalOverlay.classList.remove("active");
      modalCardWrapper.classList.remove("slide-out");
    }, 400);
  });

  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      modalCardWrapper.classList.remove("slide-in");
      modalCardWrapper.classList.add("slide-out");

      setTimeout(() => {
        modalOverlay.classList.remove("active");
        modalCardWrapper.classList.remove("slide-out");
      }, 400);
    }
  });

  renderTasks();
});
