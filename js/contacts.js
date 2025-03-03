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

document.addEventListener("DOMContentLoaded", () => {
  setAvatarColorsByInitials();
  initContactClickEvents();
});

function setAvatarColorsByInitials() {
  const avatars = document.querySelectorAll(".contact-avatar");
  avatars.forEach((avatar) => {
    const name = avatar.dataset.name;
    const initial = name.trim().charAt(0).toUpperCase();
    const color = letterColors[initial] || "#999";
    avatar.style.backgroundColor = color;
  });
}

function initContactClickEvents() {
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".contact-item.selected")
        .forEach((selected) => selected.classList.remove("selected"));

      item.classList.add("selected");

      const name = item.dataset.name;
      const email = item.dataset.email;
      const phone = item.dataset.phone;

      displayContactDetails(name, email, phone);
    });
  });
}

function displayContactDetails(name, email, phone) {
  const initial = name.trim().charAt(0).toUpperCase();
  const avatarColor = letterColors[initial] || "#999";

  const detailsHtml = `
    <div class="contact-details-card">
      <div class="contact-header">
        <div class="contact-avatar-large" style="background-color:${avatarColor};">
          ${initial}${getSecondInitial(name)}
        </div>
        <div class="name-action-alignment">
          <h3 class="details-name">${name}</h3>
          <div class="contact-details-actions-containter">
            <div class="contact-details-actions-1">
              <button>
                <img class="actions-img" src="/assets/img/edit.png" alt="edit">
                Edit
              </button>
            </div>
            <div class="contact-details-actions-2">
              <button>
                <img class="actions-img" src="/assets/img/delete.png" alt="delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="details-label">Contact Information</div>
      <div class="details-info">
        <div>
          <strong>Email</strong>
          <br><br>
          <!-- E-Mail wird zum mailto:-Link -->
          <a class="email-address" href="mailto:${email}">${email}</a>
        </div>
        <div>
          <strong>Phone</strong>
          <br><br>
          ${phone}
        </div>
      </div>
    </div>
  `;
  document.querySelector(".contacts-right-bottom").innerHTML = detailsHtml;
}

function getSecondInitial(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length > 1) {
    return parts[1].charAt(0).toUpperCase();
  }
  return "";
}

const openBtn = document.getElementById("openAddContact");
const overlay = document.getElementById("addContactOverlay");
const cancelBtn = document.getElementById("cancelAddContact");
const createBtn = document.getElementById("createContact");

openBtn.addEventListener("click", () => {
  overlay.classList.add("open");
});

cancelBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

createBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("open");
  }
});

closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});
