
// shows the editing overlay - populates all fields with task data and updates UI states.
function openEditOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.classList.remove("hidden");

  const titleInput = overlay.querySelector(".edit-input[placeholder='Enter a title']");
  const descriptionTextarea = overlay.querySelector(".edit-textarea[placeholder='Enter a Description']");
  const dueDateInput = overlay.querySelector("#due-date");
  const priorityButtons = overlay.querySelectorAll(".priority-labels");
  const subtaskInput = overlay.querySelector("#subtasks-edit");
  const subtaskListContainer = document.getElementById("subtaskList");

  titleInput.value = task.title;
  descriptionTextarea.value = task.description;
  dueDateInput.value = task.dueDate;

  priorityButtons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");
    if (btn.id === task.priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });

  window.assignees = Array.isArray(task.assignedTo) ? [...task.assignedTo] : [];
  renderUsersToAssignEdit();
  renderAssignees("assigned-to-dropdown-edit", document.getElementById("assigned-to-dropdown-edit"));

  renderSubtasks(task, subtaskListContainer);

  setupEditDropdownEvents();
  setupPrioritySelection();
  setupSubtaskInput();
  setupSubtaskEditing(task, subtaskListContainer);
  setupDatePicker();
}

function getTaskById(id) {
  return tasks.find(t => t.id === id);
}


  // hides the editing overlay
  function closeEditOverlay() {
    document.getElementById("editTaskOverlay").classList.add("hidden");
  }
  
  // click event for all priority buttons (Urgent, Medium, Low) in the edit overlay
  function setupPrioritySelection() {
    const buttons = document.querySelectorAll("#urgent, #medium, #low");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const isSelected = button.classList.contains("selected");
        buttons.forEach((btn) => {
          resetPriority(btn);
          btn.classList.remove("selected");
        });
        if (!isSelected) {
          activatePriority(button);
          button.classList.add("selected");
        }
      });
    });
  }
  
  // resets the color and style of a priority button
  function resetPriority(button) {
    button.style.backgroundColor = "#ffffff";
    button.style.color = "#000000";
    button.style.fontWeight = "normal";
    const paths = button.querySelectorAll("svg path");
    paths.forEach((path) => setDefaultColor(path, button.id));
  }
  
  // colors the icons in the button again according to the priority (if inactive)
  function setDefaultColor(path, id) {
    if (id === "urgent") path.setAttribute("fill", "#FF3D00");
    if (id === "medium") path.setAttribute("fill", "#FFA800");
    if (id === "low") path.setAttribute("fill", "#7AE229");
  }
  
  // activates the clicked priority button (color, style, icon white)
  function activatePriority(button) {
    const paths = button.querySelectorAll("svg path");
    button.style.fontWeight = "bold";
    button.style.color = "#ffffff";
    if (button.id === "urgent") button.style.backgroundColor = "#FF3D00";
    if (button.id === "medium") button.style.backgroundColor = "#FFA800";
    if (button.id === "low") button.style.backgroundColor = "#7AE229";
    paths.forEach((path) => path.setAttribute("fill", "#ffffff"));
  }
  
  // controls the dropdown for "Assigned to" in the edit overlay including the arrow behavior
  function setupAssignedToDropdown() {
    if (!window.userNames || window.userNames.length === 0) {
      window.userNames = ["Max Mustermann", "Erika Musterfrau"];
    }
  }
  
  function setupEditDropdownEvents() {
    const arrow = document.getElementById("select-arrow-edit");
    const wrapper = document.querySelector(".dropdown-field-wrapper");
    const dropdown = document.getElementById("assigned-to-dropdown-edit");
  
    if (!arrow || !wrapper || !dropdown) return;
  
    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains("d_none");
  
      if (isOpen) {
        closeEditDropdown(dropdown, arrow);
      } else {
        openEditDropdown(dropdown, arrow);
      }
    });
  
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        closeEditDropdown(dropdown, arrow);
      }
    });
  }
  
  function openEditDropdown(dropdown, arrow) {
    dropdown.classList.remove("d_none");
    arrow.classList.remove("closed");
    arrow.classList.add("open");
  }
  
  function closeEditDropdown(dropdown, arrow) {
    dropdown.classList.add("d_none");
    arrow.classList.remove("open");
    arrow.classList.add("closed");
  }
  
  function renderAssignees(containerId, container) {
    const assigneesContainerId =
      containerId === "assigned-to-dropdown-edit"
        ? "assignees-list-edit"
        : "assignees-list";
  
    let assigneesContainerRef = document.getElementById(assigneesContainerId);
  
    if (
      (container.classList.contains("d_none") === false &&
        assignees.length > 0) ||
      (containerId.includes("category-dropdown") && assignees.length > 0)
    ) {
      assigneesContainerRef.classList.remove("d_none");
      assigneesContainerRef.innerHTML = "";
  
      assignees.forEach((name) => {
        let initials = getInitials(name);
        let iconBackgroundColor = getIconBackgroundColor(initials);
        assigneesContainerRef.innerHTML += getAvatarTemplate(
          initials,
          iconBackgroundColor
        );
      });
    } else {
      assigneesContainerRef.classList.add("d_none");
      assigneesContainerRef.innerHTML = "";
    }
  }
  
  function toggleDropdownSelection(dropdownId, event) {
    event.stopPropagation();
  
    const dropdown = document.getElementById(dropdownId);
    const arrowClosed = document.getElementById(`${dropdownId}-closed`);
    const arrowOpen = document.getElementById(`${dropdownId}-open`);
  
    const isOpen = !dropdown.classList.contains("d_none");
  
    if (isOpen) {
      dropdown.classList.add("d_none");
      arrowClosed.classList.remove("d_none");
      arrowOpen.classList.add("d_none");
    } else {
      dropdown.classList.remove("d_none");
      arrowClosed.classList.add("d_none");
      arrowOpen.classList.remove("d_none");
    }
  }
  
  function toggleAssigned(name, containerId) {
    const index = assignees.indexOf(name);
    if (index > -1) {
      assignees.splice(index, 1);
    } else {
      assignees.push(name);
    }
  
    const dropdown = document.getElementById(containerId);
    renderAssignees(containerId, dropdown);
    renderUsersToAssignEdit();
  }
  
  function renderUsersToAssignEdit() {
    const usersList = document.getElementById("assigned-to-users-list-edit");
    if (!usersList || !window.userNames) return;
  
    usersList.innerHTML = "";
  
    window.userNames.forEach((name, index) => {
      if (typeof name === "string") {
        const initials = getInitials(name);
        const bgColor = getIconBackgroundColor(initials);
        const styling = checkIsAssigned(name);
  
        usersList.innerHTML += getUsersToAssignTemplate(
          name,
          index,
          styling.wrapperClass,
          styling.checkboxClass,
          initials,
          bgColor
        );
      }
    });
  }
  
  // binds buttons for adding or canceling subtask inputs in the overlay
  function setupSubtaskInput() {
    const input = document.getElementById("subtasks-edit");
    const addBtn = document.getElementById("edit-add-subtask-icon");
    const confirmWrap = document.getElementById("confirm-icons");
    const confirmBtn = document.getElementById("confirm-icon");
    const clearBtn = document.getElementById("clear-icon");
    addBtn.addEventListener("click", () =>
      showConfirm(input, confirmWrap, addBtn)
    );
    clearBtn.addEventListener("click", () =>
      resetInput(input, confirmWrap, addBtn)
    );
    confirmBtn.addEventListener("click", () =>
      resetInput(input, confirmWrap, addBtn)
    );
  }
  
  // shows the check mark/cancel symbol on the subtask input
  function showConfirm(input, confirm, add) {
    add.classList.add("d-none");
    confirm.classList.remove("d-none");
    input.focus();
  }
  
  // resets the subtask input field
  function resetInput(input, confirm, add) {
    input.value = "";
    confirm.classList.add("d-none");
    add.classList.remove("d-none");
  }
  
  // initializes the calendar field (Flatpickr) for the due date
  function setupDatePicker() {
    if (window.flatpickr) {
      flatpickr("#due-date", {
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "d/m/Y",
        allowInput: true,
      });
    }
  }
  function saveEdit() {
    const overlay = document.getElementById("editTaskOverlay");
    const taskId = document.getElementById("task-card-modal").getAttribute("data-task-id");
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
  
    const updatedTask = { ...tasks[taskIndex] };
    updatedTask.title = overlay.querySelector(".edit-input[placeholder='Enter a title']").value.trim();
    updatedTask.description = overlay.querySelector(".edit-textarea[placeholder='Enter a Description']").value.trim();
    updatedTask.dueDate = overlay.querySelector("#due-date").value;
    updatedTask.priority = overlay.querySelector(".priority-labels.selected")?.id || "";
    updatedTask.assignedTo = [...assignees];
  
    const subtaskItems = overlay.querySelectorAll("#subtaskList .subtask-item span:first-child");
    updatedTask.subtasks = Array.from(subtaskItems).map((el) => {
      const label = el.textContent.replace(/^\u2022\s*/, "").trim();
      return { [label]: label };
    });
  
    tasks[taskIndex] = updatedTask;
    saveTasksToStorageOrFirebase();
    renderAllColumns();
    closeEditOverlay();
  }
  

  
/**
 * Rendert die Subtasks eines Tasks in das angegebene Container-Element.
 *
 * @param {object} task - Der Task mit den Subtasks.
 * @param {HTMLElement} container - Das HTML-Element für die Subtask-Liste.
 */
function renderSubtasks(task, container) {
  container.innerHTML = "";
  if (Array.isArray(task.subtasks)) {
    task.subtasks.forEach((subtask, index) => {
      const [key, value] = Object.entries(subtask)[0];
      const subtaskItem = document.createElement("div");
      subtaskItem.classList.add("subtask-item", "d-flex-space-between");
      subtaskItem.innerHTML = `
        <span>• ${value}</span>
        <div>
          <span class="edit-icon" data-index="${index}"></span>
          <span class="delete-icon" data-index="${index}"></span>
        </div>
      `;
      container.appendChild(subtaskItem);
    });
  }
}

function populateEditOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  const titleInput = overlay.querySelector(".edit-input[placeholder='Enter a title']");
  const descriptionTextarea = overlay.querySelector(".edit-textarea[placeholder='Enter a Description']");
  const dueDateInput = overlay.querySelector("#due-date");
  const priorityButtons = overlay.querySelectorAll(".priority-labels");
  const assignedSelect = overlay.querySelector("#assigned-select");
  const assignedPlaceholder = overlay.querySelector(".select-placeholder");
  const subtaskInput = overlay.querySelector("#subtasks-edit");
  const addSubtaskIcon = document.getElementById("edit-add-subtask-icon");
  const subtaskListContainer = document.getElementById("subtaskList");

  titleInput.value = task.title;
  descriptionTextarea.value = task.description;
  dueDateInput.value = task.dueDate;

  priorityButtons.forEach((btn) => {
    resetPriority(btn);
    btn.classList.remove("selected");
    if (btn.id === task.priority) {
      activatePriority(btn);
      btn.classList.add("selected");
    }
  });

  Array.from(assignedSelect.options).forEach((option) => {
    option.selected = task.assignedTo?.includes(option.value);
  });

  assignedPlaceholder.style.display = task.assignedTo?.length ? "none" : "block";

  renderSubtasks(task, subtaskListContainer);
  subtaskInput.value = "";
  openEditOverlay(task);

  addSubtaskIcon.addEventListener("click", () => {
    const newTitle = subtaskInput.value.trim();
    if (newTitle) {
      if (!Array.isArray(task.subtasks)) task.subtasks = [];
      task.subtasks.push({ [newTitle]: newTitle });
      renderSubtasks(task, subtaskListContainer);
      subtaskInput.value = "";
    }
  });

  subtaskListContainer.addEventListener("click", (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains("delete-icon")) {
      task.subtasks.splice(index, 1);
      renderSubtasks(task, subtaskListContainer);
    } else if (e.target.classList.contains("edit-icon")) {
      const item = e.target.closest(".subtask-item");
      const textEl = item.querySelector("span");
      const oldText = textEl.textContent.slice(2);

      const input = document.createElement("input");
      input.type = "text";
      input.value = oldText;
      input.classList.add("edit-subtask-input");

      const saveBtn = document.createElement("span");
      saveBtn.classList.add("confirm-icon");
      saveBtn.innerHTML = "&#10004;";

      const cancelBtn = document.createElement("span");
      cancelBtn.classList.add("clear-icon");
      cancelBtn.innerHTML = "&#10006;";

      const controls = e.target.parentNode;
      controls.innerHTML = "";
      controls.append(saveBtn, cancelBtn);
      textEl.replaceWith(input);
      input.focus();

      saveBtn.addEventListener("click", () => {
        const newText = input.value.trim();
        if (newText) {
          const key = Object.keys(task.subtasks[index])[0];
          task.subtasks[index] = { [key]: newText };
          renderSubtasks(task, subtaskListContainer);
        }
      });

      cancelBtn.addEventListener("click", () => {
        renderSubtasks(task, subtaskListContainer);
      });

      input.addEventListener("click", (ev) => ev.stopPropagation());
    }
  });

  console.log("task.subtasks:", task.subtasks);
}