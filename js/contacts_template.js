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
  