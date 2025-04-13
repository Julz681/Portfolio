// bind all buttons inside the edit overlay
function bindEditOverlayButtons() {
  document
    .getElementById("closeEditOverlayBtn")
    ?.addEventListener("click", closeEditOverlay);
  document
    .getElementById("editContactForm")
    ?.addEventListener("submit", handleEditSubmit);
  document
    .getElementById("deleteContactEditOverlay")
    ?.addEventListener("click", () => {
      if (window.innerWidth > 1200) {
        handleEditDelete();
      } else {
        deleteContact();
      }
    });
}

// show or hide floating buttons depending on screen and state
function updateFloatingButtons() {
  const editOverlay = document.getElementById("editContactOverlay");
  if (editOverlay?.classList.contains("open")) return;

  const addOverlay = document.getElementById("addContactOverlay");
  const rightBox = document.querySelector(".contacts-right");
  const addBtn = document.getElementById("openAddContact");
  const dotsBtn = document.getElementById("menuDotsBtn");
  const backBtn = document.querySelector(".mobile-only-goback");

  const isMobile = window.innerWidth < 900;
  const showContact = rightBox?.classList.contains("show-contact-right");

  addBtn.style.display = isMobile && showContact ? "none" : "flex";
  dotsBtn.style.display = isMobile && showContact ? "flex" : "none";

  if (backBtn) backBtn.classList.toggle("visible", isMobile && showContact);
}

// smoothly hide the drop-up menu
function closeDropupMenu() {
  const menu = document.getElementById("dropupMenu");
  if (!menu?.classList.contains("show")) return;

  menu.classList.remove("show");
  menu.classList.add("hide");

  setTimeout(() => {
    menu.classList.remove("hide");
    menu.style.display = "none";
  }, 250);
}

// toggle drop-up menu with animation
function toggleDropupMenu() {
  const menu = document.getElementById("dropupMenu");
  const rightBox = document.querySelector(".contacts-right");
  if (!rightBox?.classList.contains("show-contact-right")) return;

  if (menu.classList.contains("show")) {
    closeDropupMenu();
  } else {
    menu.style.display = "block";
    requestAnimationFrame(() => menu.classList.add("show"));
  }

  updateFloatingButtons();
}

// delete contact from list and close views
function deleteContact() {
  const name = document.querySelector(".details-name")?.textContent;
  if (!name) return;

  document.querySelectorAll(".contact-item").forEach((item) => {
    if (item.dataset.name === name) item.remove();
  });

  document.querySelectorAll(".contact-group").forEach((group) => {
    if (!group.querySelector(".contact-item")) group.remove();
  });
  if (window.innerWidth < 1200) {
    closeContactDetails();
    document.getElementById("editContactOverlay")?.classList.remove("open");
  }
  closeDetailAndMenu();
  updateFloatingButtons();
}

// close contact details and clear content
function closeDetailAndMenu() {
  document
    .querySelector(".contacts-right")
    ?.classList.remove("show-contact-right");
  document.querySelector(".contacts-right-bottom").innerHTML = "";
  closeDropupMenu();
}

// close drop-up menu when clicking outside
document.addEventListener("click", (e) => {
  const menu = document.getElementById("dropupMenu");
  const btn = document.getElementById("menuDotsBtn");

  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    closeDropupMenu();
  }
});

// open contact detail view
function openContactDetails() {
  document
    .querySelector(".contacts-right")
    ?.classList.add("show-contact-right");
  updateFloatingButtons();
}

// close contact detail view
function closeContactDetails() {
  document
    .querySelector(".contacts-right")
    ?.classList.remove("show-contact-right");
  document.querySelector(".mobile-only-goback")?.classList.remove("visible");
  updateFloatingButtons();
}

// hide menu state on page load
document.getElementById("dropupMenu")?.classList.remove("show");

// update floating buttons on load and resize
window.addEventListener("load", updateFloatingButtons);
window.addEventListener("resize", updateFloatingButtons);

// set up contact list click and overlay buttons
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contactList")?.addEventListener("click", (e) => {
    const item = e.target.closest(".contact-item");
    if (item) openContactDetails();
  });

  bindEditOverlayButtons();
});

// shows success message after creating a contact
function showSuccessMessage() {
  const msg = document.getElementById("contactSuccessMsg");
  if (!msg) return;

  msg.classList.remove("hidden");
  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
    msg.classList.add("hidden");
  }, 2000);
}

//change animation when the overlay open under 1200px slide in from right becomes slide in from bottom
function openContactModal() {
  const overlay = document.querySelector(".overlay");
  const modal = document.querySelector(".add-contact-modal");

  modal.classList.remove(
    "slide-from-right",
    "show-from-right",
    "slide-from-bottom",
    "show-from-bottom"
  );

  overlay.classList.add("open");

  if (window.innerWidth >= 1200) {
    modal.classList.add("slide-from-right");
    setTimeout(() => modal.classList.add("show-from-right"), 10);
  } else {
    modal.classList.add("slide-from-bottom");
    setTimeout(() => modal.classList.add("show-from-bottom"), 10);
  }
}

//change animation when the overlay close under 1200px slide in from right becomes slide in from bottom
function closeContactModal() {
  const overlay = document.querySelector(".overlay");
  const modal = document.querySelector(".add-contact-modal");

  if (window.innerWidth >= 1200) {
    modal.classList.remove("show-from-right");
    modal.classList.add("slide-from-right");
  } else {
    modal.classList.remove("show-from-bottom");
    modal.classList.add("slide-from-bottom");
  }

  setTimeout(() => overlay.classList.remove("open"), 8000);
}
