//colors for the avatars depending on the letter
const letterColors = {
    A: "#D32F2F",
    B: "#C2185B",
    C: "#7B1FA2",
    D: "#512DA8",
    E: "#1976D2",
    F: "#0288D1",
    G: "#00796B",
    H: "#388E3C",
    I: "#689F38",
    J: "#F57C00",
    K: "#E64A19",
    L: "#5D4037",
    M: "#455A64",
    N: "#263238",
    O: "#D81B60",
    P: "#8E24AA",
    Q: "#673AB7",
    R: "#303F9F",
    S: "#0288D1",
    T: "#0097A7",
    U: "#00796B",
    V: "#388E3C",
    W: "#689F38",
    X: "#F57C00",
    Y: "#E64A19",
    Z: "#5D4037",
  };

// array with objects
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
      status: "await-feedback",
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
      status: "done",
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
      status: "in-progress",
    },
    {
      id: "task-4",
      title: "Dark Mode Toggle",
      description: "As a user, I want to switch between dark and light mode.",
      priority: "medium",
      taskType: "userStory",
      dueDate: "15/04/2025",
      assignedTo: ["Ada Lovelace", "Shafi Goldwasser"],
      subtasks: [
        "Design toggle switch",
        "Implement dark/light themes",
        "Store preference in localStorage",
      ],
      status: "to-do",
    },
    {
      id: "task-5",
      title: "Drag & Drop Task Board",
      description:
        "Enable drag and drop functionality to move tasks across different columns.",
      priority: "low",
      taskType: "technical",
      dueDate: "20/04/2025",
      assignedTo: ["Reshma Saujani", "Frances Allen"],
      subtasks: [
        "Set up drag listeners",
        "Handle drop zones",
        "Update task status on drop",
      ],
      status: "to-do",
    },
  ];

  // returns the HTML code for all user avatars of a task. Generates initials and the color
  function getUserAvatarsHTML(assignedTo) {
    return assignedTo.map(name => {
      const contactEl = document.querySelector(`.contact-item[data-name="${name}"]`);
      const avatarEl = contactEl?.querySelector(".contact-avatar");
  
      if (avatarEl) {
        return avatarEl.outerHTML;
      }
  
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
      const firstLetter = initials.charAt(0);
      const bgColor = letterColors[firstLetter] || "#888";
  
      return `<div class="contact-avatar" style="background-color: ${bgColor};">${initials}</div>`;
    }).join("");
  }


// creates a task card including labels, texts, subtask count, avatars, priority, ...
function createTaskHTML(task) {
    const label = task.taskType === "technical" ? "Technical Task" : "User Story";
    const color = task.taskType === "technical" ? "#1fd7c1" : "blue";
    const users = getUserAvatarsHTML(task.assignedTo);
    return `
      <div class="board-card d-flex-center" data-task-id="${task.id}">
        <div class="board-card-content d-flex-column">
        <button class="card-action-btn" onclick="toggleMoveMenu(this, event)">
            <img src="../assets/img/responsive_frame.png" alt="Aktion" />
          </button>
         <div class="move-menu d-none">
          <span class="menu-title">Move to</span>
  
          <div class="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-arrow-icon" viewBox="0 0 24 24">
              <path d="M12 19V5"></path>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            To-do
          </div>
  
          <div class="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-arrow-icon" viewBox="0 0 24 24">
              <path d="M12 5v14"></path>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            Review
          </div>
        </div>
                <label class="board-card-label br-8 d-flex-center" style="background:${color};">${label}</label>
          <div class="board-card-text d-flex-column br-10">
            <h4 class="board-card-title">${task.title}</h4>
            <p class="board-card-description">${task.description}</p>
          </div>
          <div class="status d-flex-center">
            <div class="progress" role="progressbar">
              <div class="progress-bar" style="width: 60%"></div>
            </div>
            <div class="d-flex-center subtasks">
              <span>0</span> / <span>${task.subtasks.length}</span> Subtasks
            </div>
          </div>
          <div class="d-flex-space-between board-card-footer">
            <div class="user-icons-wrapper d-flex-center">${users}</div>
            <img src="../assets/img/icons/${task.priority}-icon.png" class="priority" />
          </div>
        </div>
      </div>`;
  }

  // shows the user avatars + names in the modal in the “Assigned to” area
function setModalUsers(task) {
    let box = document.querySelector(".assignments");
    let avatars = getUserAvatarsHTML(task.assignedTo);
    let namesHTML = "";
  
    for (let i = 0; i < task.assignedTo.length; i++) {
      let name = task.assignedTo[i];
      namesHTML += "<span>" + name + "</span>";
    }
  
    let html =
      "" +
      "<span>Assigned to:</span>" +
      "<div class='user-line d-flex-space-between gap-16'>" +
      "<div class='d-flex-column gap-16'>" +
      avatars +
      "</div>" +
      "<div class='user-names d-flex-column gap-24'>" +
      namesHTML +
      "</div>" +
      "</div>";
  
    box.innerHTML = html;
  }
  
  // renders the individual subtasks in the modal as a checkbox list
  function setModalSubtasks(task) {
    const box = document.querySelector(".subtasks-wrapper");
    box.innerHTML = task.subtasks
      .map(
        (s, i) => `
      <div class="modal-card-subtask-wrapper d-flex-center">
        <label class="modal-card-subtask gap-16">
          <input type="checkbox" id="subtask-${i}" />
          <span class="checkmark"></span>
          <span>${s}</span>
        </label>
      </div>`
      )
      .join("");
  }

  
// shows the contact details on the right side
function showContactDetails(name, email, phone) {
  const initial = name.trim()[0].toUpperCase();
  const second = name.split(" ")[1]?.[0]?.toUpperCase() || "";
  const color = letterColors[initial] || "#999";
  const html = `
    <div class="contact-details-card">
      <div class="contact-header">
        <div class="contact-avatar-large" style="background-color:${color};">${initial}${second}</div>
        <div class="name-action-alignment">
          <h3 class="details-name">${name}</h3>
          <div class="contact-details-actions-containter">
            <div class="contact-details-actions-1">
              <button id="edit"><img class="actions-img" src="/assets/img/edit.png"> Edit</button>
            </div>
            <div class="contact-details-actions-2">
              <button id="deleteBtn"><img class="actions-img" src="/assets/img/delete.png"> Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div class="details-label">Contact Information</div>
      <div class="details-info">
        <div><strong>Email</strong><br><br><a class="email-address" href="mailto:${email}">${email}</a></div>
        <div><strong>Phone</strong><br><br>${phone}</div>
      </div>
    </div>`;
  const container = document.querySelector(".contacts-right-bottom");
  container.classList.remove("slide-in");
  void container.offsetWidth;
  container.innerHTML = html;
  container.classList.add("slide-in");
}

// opens the "Add Contact" overlay and resets relevant states
function openOverlay() {
  isEditing = false;
  currentEditingContact = null;
  document.getElementById("addContactOverlay").classList.add("open");
  document.getElementById("overlayTitle").textContent = "Add Contact";
  document.getElementById("overlayDescription").style.display = "block";
  document.getElementById("createContact").innerHTML = `
  <span>${isEditing ? "Save" : "Create Contact"}</span>
  <span class="checkmark-icon"></span>
`;
  document.getElementById(
    "overlayAvatar"
  ).innerHTML = `<img class="vector" src="../assets/img/addnewcontact.png">`;
  document.getElementById("overlayAvatar").style.backgroundColor =
    "transparent";
  clearForm();

  const cancelBtn = document.getElementById("cancelAddContact");
  if (cancelBtn) {
    cancelBtn.style.transition = "none";
    cancelBtn.style.marginLeft = "0px";
  }
  updateFloatingButtons();
}

// create the contact HTML element
function buildContactItem(name, email, phone) {
  const initials = getInitials(name);
  const color = letterColors[name[0].toUpperCase()] || "#000";
  const item = document.createElement("div");
  item.className = "contact-item";
  item.dataset.name = name;
  item.dataset.email = email;
  item.dataset.phone = phone;
  item.innerHTML = `
    <div class="contact-avatar" data-name="${name}" style="background-color:${color}">${initials}</div>
    <div class="contact-details">
      <div class="contact-name">${name}</div>
      <div class="contact-email">${email}</div>
    </div>`;
  return item;
}

// finds or creates a contact group container based on the first letter
function getOrCreateGroup(letter, list) {
  let group = [...list.querySelectorAll(".contact-group")].find(
    (g) => g.querySelector(".contact-group-letter")?.textContent === letter
  );
  if (!group) {
    group = document.createElement("div");
    group.className = "contact-group";
    group.innerHTML = `<div class="contact-group-letter">${letter}</div>`;
    list.appendChild(group);
  }
  return group;
}
