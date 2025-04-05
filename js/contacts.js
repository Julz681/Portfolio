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

window.addEventListener("DOMContentLoaded", () => {
  hideError(); // hide the error message on page load
  setAvatarColors(); // set avatar background colors based on the letters
  bindContactClicks(); // add click events to contact items for selection
  bindOverlayButtons(); // add functionality to open/close the contact overlay
  bindCreateButton(); // enable creating or editing a contact
  bindDeleteButton(); // enable deleting a selected contact
  bindEditButton(); // enable editing an existing contact
  enableAutofill(); // automatically fill in example contact -> Mark Zuckerberg
  closeErrorOnInput(); // hide the error message when all fields are filled
});

// hides the error message
function hideError() {
  const error = document.getElementById("error-message");
  if (error) error.style.display = "none";
}

// sets the color for each avatar based on the first letter of the name
function setAvatarColors() {
  document.querySelectorAll(".contact-avatar").forEach((avatar) => {
    const name = avatar.dataset.name;
    const initial = name?.trim()[0].toUpperCase();
    avatar.style.backgroundColor = letterColors[initial] || "#999";
  });
}

// adds the clickEventListener to all contacts
function bindContactClicks() {
  document.querySelectorAll(".contact-item").forEach((item) => {
    item.addEventListener("click", () => selectContact(item));
  });
}

// selects the clicked contact and shows the details
function selectContact(item) {
  document
    .querySelectorAll(".contact-item.selected")
    .forEach((el) => el.classList.remove("selected"));
  item.classList.add("selected");
  const { name, email, phone } = item.dataset;
  showContactDetails(name, email, phone);
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

// connects buttons for opening, closing and canceling the overlay
function bindOverlayButtons() {
  const overlay = document.getElementById("addContactOverlay");
  const cancel = document.getElementById("cancelAddContact");
  const close = document.getElementById("closeOverlayBtn");
  document
    .getElementById("openAddContact")
    ?.addEventListener("click", openOverlay);
  cancel?.addEventListener("click", resetOverlay);
  close?.addEventListener("click", resetOverlay);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) resetOverlay();
  });
}

// opens the overlay for adding a new contact
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
}

// function for the cancel-btn in the edit mode
function animateCancelBtn() {
  const cancel = document.getElementById("cancelAddContact");
  if (!cancel || !isEditing) return;

  cancel.style.transition = "none";
  cancel.style.marginLeft = "0px";
  cancel.offsetHeight;

  setTimeout(() => {
    cancel.style.transition = "margin-left 0.3s ease-in-out";
    cancel.style.marginLeft = "-95px";
  }, 100);
}

// resets the overlay
function resetOverlay() {
  document.getElementById("addContactOverlay").classList.remove("open");
  clearForm();
  isEditing = false;
  currentEditingContact = null;
  resetAvatarToDefault();
  resetCancelButtonToDefault();
}

// clears all input from the overlay
function clearForm() {
  ["contactName", "contactEmail", "contactPhone"].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

// connects the "Create Contact" button to create or edit
function bindCreateButton() {
  document
    .getElementById("createContact")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const name = getValue("contactName");
      const email = getValue("contactEmail");
      const phone = getValue("contactPhone");
      if (!name || !email || !phone) return showError();
      hideError();
      const list = document.getElementById("contactList");
      if (isEditing && currentEditingContact) {
        updateEditedContact(name, email, phone, list);
      } else {
        createContactElement(name, email, phone, list);
      }
      resetOverlay();
    });
}

// checks the value in the input field
function getValue(id) {
  return document.getElementById(id).value.trim();
}

// shows the error message
function showError() {
  const error = document.getElementById("error-message");
  if (error) error.style.display = "block";
}

// creates a new contact in the list
function createContactElement(name, email, phone, contactList) {
  const groupLetter = name[0].toUpperCase();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const item = document.createElement("div");
  item.className = "contact-item";
  item.dataset.name = name;
  item.dataset.email = email;
  item.dataset.phone = phone;
  item.innerHTML = `
    <div class="contact-avatar" data-name="${name}" style="background-color:${
    letterColors[groupLetter] || "#000"
  }">${initials}</div>
    <div class="contact-details">
      <div class="contact-name">${name}</div>
      <div class="contact-email">${email}</div>
    </div>`;
  let group = [...document.querySelectorAll(".contact-group")].find(
    (g) => g.querySelector(".contact-group-letter")?.textContent === groupLetter
  );
  if (!group) {
    group = document.createElement("div");
    group.className = "contact-group";
    group.innerHTML = `<div class="contact-group-letter">${groupLetter}</div>`;
    contactList.appendChild(group);
  }
  group.appendChild(item);
  selectContact(item);
  bindContactClicks();
  sortContacts();
}

// sorts contacts alphabetically into groups
function sortContacts() {
  const contactList = document.getElementById("contactList");
  const groups = [...contactList.querySelectorAll(".contact-group")];
  groups.forEach((group) => {
    const items = [...group.querySelectorAll(".contact-item")];
    items.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    items.forEach((i) => group.appendChild(i));
  });
  groups.sort((a, b) =>
    a
      .querySelector(".contact-group-letter")
      .textContent.localeCompare(
        b.querySelector(".contact-group-letter").textContent
      )
  );
  groups.forEach((g) => contactList.appendChild(g));
}

// updates an edited contact
function updateEditedContact(name, email, phone, list) {
  const oldGroup = currentEditingContact.closest(".contact-group");
  oldGroup.removeChild(currentEditingContact);
  if (!oldGroup.querySelector(".contact-item")) oldGroup.remove();
  createContactElement(name, email, phone, list);
  isEditing = false;
  currentEditingContact = null;
}

// deletes the contact when the delete button is clicked
function bindDeleteButton() {
  document
    .querySelector(".contacts-right-bottom")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest("#deleteBtn");
      if (!btn) return;
      const name = document.querySelector(".details-name")?.textContent;
      document.querySelectorAll(".contact-item").forEach((item) => {
        if (item.dataset.name === name) item.remove();
      });
      document.querySelectorAll(".contact-group").forEach((group) => {
        if (!group.querySelector(".contact-item")) group.remove();
      });
      document.querySelector(".contacts-right-bottom").innerHTML = "";
    });
}

// start the edit mode, if the edit-btn is klicked
function bindEditButton() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#edit")) return;
    startEditMode();
  });
}

// prepares everything for editing a contact
function startEditMode() {
  const selected = document.querySelector(".contact-item.selected");
  if (!selected) return;

  setOverlayText("Edit Contact");
  fillFormFields(selected);
  updateAvatarForEdit(selected);
  updateButtonsForEdit();

  document.getElementById("addContactOverlay").classList.add("open");
  isEditing = true;
  currentEditingContact = selected;
  animateCancelBtn();
}

// changes the overlay text
function setOverlayText(title) {
  document.getElementById("overlayTitle").textContent = title;
  document.getElementById("overlayDescription").style.display = "none";
}

// enter the name, email, and phone number of the selected contact into the form fields
function fillFormFields(contact) {
  document.getElementById("contactName").value = contact.dataset.name;
  document.getElementById("contactEmail").value = contact.dataset.email;
  document.getElementById("contactPhone").value = contact.dataset.phone;
}

// update the avatar
function updateAvatarForEdit(contact) {
  const avatar = contact.querySelector(".contact-avatar");
  const initials = avatar.textContent;
  const bgColor = avatar.style.backgroundColor;

  const avatarOverlay = document.getElementById("overlayAvatar");
  avatarOverlay.innerHTML = `<div class="avatar-initials">${initials}</div>`;
  avatarOverlay.style.backgroundColor = bgColor;
  avatarOverlay.classList.add("edit-avatar");
}

// reset the avatar to the img for create contact
function resetAvatarToDefault() {
  const avatarOverlay = document.getElementById("overlayAvatar");
  avatarOverlay.classList.remove("edit-avatar");
  avatarOverlay.innerHTML = `
    <img class="vector" src="../assets/img/addnewcontact.png" alt="User Avatar">
  `;
  avatarOverlay.style.backgroundColor = "transparent";
}

// changes the buttons for edit mode
function updateButtonsForEdit() {
  const createBtn = document.getElementById("createContact");
  createBtn.innerHTML = `
    <span>Save</span>
    <span class="checkmark-icon"></span>
  `;

  const deleteBtn = document.getElementById("cancelAddContact");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.classList.add("delete-mode");
  deleteBtn.onclick = deleteCurrentContact;
  const newDeleteBtn = deleteBtn.cloneNode(true);
  deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
  newDeleteBtn.innerHTML = "Delete";
  newDeleteBtn.classList.add("delete-mode");
  newDeleteBtn.addEventListener("click", deleteCurrentContact);
}

// reset cancel button (used in create Contact mode)
function resetCancelButtonToDefault() {
  const cancelBtn = document.getElementById("cancelAddContact");
  if (!cancelBtn) return;
  cancelBtn.innerHTML = `
    <span>Cancel</span>
    <span class="cancel-icon"></span>
  `;
  cancelBtn.classList.remove("delete-mode");
  cancelBtn.onclick = resetOverlay;
}

// delete the current contact
function deleteCurrentContact() {
  const name = currentEditingContact?.dataset.name;
  if (!name) return;

  document.querySelectorAll(".contact-item").forEach((item) => {
    if (item.dataset.name === name) item.remove();
  });

  document.querySelectorAll(".contact-group").forEach((group) => {
    if (!group.querySelector(".contact-item")) group.remove();
  });

  document.getElementById("addContactOverlay").classList.remove("open");
  document.querySelector(".contacts-right-bottom").innerHTML = "";
  resetOverlay();
}

// activates autofill when all fields are empty and receive focus
function enableAutofill() {
  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const phone = document.getElementById("contactPhone");
  let used = false;
  const fill = () => {
    if (used || name.value || email.value || phone.value) return;
    name.value = "Mark Zuckerberg";
    email.value = "mark@facebook.com";
    phone.value = "+1 650 550 450";
    used = true;
  };
  [name, email, phone].forEach((f) => f.addEventListener("focus", fill));
}

// the error message close, if all fields are filled
function closeErrorOnInput() {
  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const phone = document.getElementById("contactPhone");
  const error = document.getElementById("error-message");
  const check = () => {
    if (name.value.trim() && email.value.trim() && phone.value.trim()) {
      error.style.display = "none";
    }
  };
  [name, email, phone].forEach((f) => f.addEventListener("input", check));
}

let isEditing = false;
let currentEditingContact = null;

// show the contacts right - responsive
window.addEventListener("DOMContentLoaded", () => {
  const contactItems = document.querySelectorAll(".contact-item");

  contactItems.forEach((item) => {
    item.addEventListener("click", () => {
      openContactDetails();
    });
  });
});

function openContactDetails() {
  const rightBox = document.querySelector(".contacts-right");
  const backBtn = document.querySelector(".mobile-only-goback");

  if (rightBox) rightBox.classList.add("show-contact-right");

  if (window.innerWidth <= 900 && backBtn) {
    backBtn.classList.add("visible");
  }
}

// shows the close button only in the mobile version - contacts right
window.closeContactDetails = function () {
  const rightBox = document.querySelector(".contacts-right");
  const backBtn = document.querySelector(".mobile-only-goback");

  if (rightBox) rightBox.classList.remove("show-contact-right");

  if (window.innerWidth <= 900 && backBtn) {
    backBtn.classList.remove("visible");
  }
  updateFloatingButtons();
};

function updateFloatingButtons() {
  const right = document.querySelector(".contacts-right");
  const addBtn = document.getElementById("openAddContact");
  const dotsBtn = document.getElementById("menuDotsBtn");
  const dropup = document.getElementById("dropupMenu");
  const isMobile = window.innerWidth < 900;
  const visible = right?.classList.contains("show-contact-right");

  addBtn.style.display = isMobile && visible ? "none" : "flex";
  dotsBtn.style.display = isMobile && visible ? "flex" : "none";
  if (!visible && dropup) dropup.classList.remove("show");

  document.getElementById("cancelAddContact")?.classList.add("hidden");
  document.querySelector(".mobile-only-goback")?.classList.add("visible");
}

function toggleDropupMenu() {
  const menu = document.getElementById("dropupMenu");
  const right = document.querySelector(".contacts-right");
  if (!right?.classList.contains("show-contact-right")) return;

  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    menu.classList.add("hide");
    setTimeout(() => {
      menu.classList.remove("hide");
      menu.style.display = "none";
    }, 250);
  } else {
    menu.style.display = "block";
    requestAnimationFrame(() => menu.classList.add("show"));
  }
}

function editContact() {
  startEditMode();
}

function deleteContact() {
  const name = document.querySelector(".details-name")?.textContent;
  if (!name) return;

  document.querySelectorAll(".contact-item").forEach(item => {
    if (item.dataset.name === name) item.remove();
  });
  document.querySelectorAll(".contact-group").forEach(group => {
    if (!group.querySelector(".contact-item")) group.remove();
  });

  document.querySelector(".contacts-right")?.classList.remove("show-contact-right");
  document.querySelector(".contacts-right-bottom").innerHTML = "";

  const menu = document.getElementById("dropupMenu");
  if (menu?.classList.contains("show")) {
    menu.classList.remove("show");
    menu.classList.add("hide");
    setTimeout(() => {
      menu.classList.remove("hide");
      menu.style.display = "none";
    }, 250);
  }

  updateFloatingButtons();
  if (window.innerWidth < 1200) {
    closeContactDetails();
    document.getElementById("addContactOverlay")?.classList.remove("open");
  }
}

document.addEventListener("click", e => {
  const menu = document.getElementById("dropupMenu");
  const btn = document.getElementById("menuDotsBtn");
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
      menu.classList.add("hide");
      setTimeout(() => {
        menu.classList.remove("hide");
        menu.style.display = "none";
      }, 250);
    }
  }
});

function openContactDetails() {
  document.querySelector(".contacts-right")?.classList.add("show-contact-right");
  updateFloatingButtons();
}

function closeContactDetails() {
  document.querySelector(".contacts-right")?.classList.remove("show-contact-right");
  document.querySelector(".mobile-only-goback")?.classList.remove("visible");
  updateFloatingButtons();
}

document.getElementById("dropupMenu")?.classList.remove("show");
window.addEventListener("load", updateFloatingButtons);
window.addEventListener("resize", updateFloatingButtons);
