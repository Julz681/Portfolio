/**
 * Binds event listeners to buttons in the contact edit overlay.
 * Includes close, submit, and delete actions.
 */
function bindEditOverlayButtons() {
  bindCloseEditOverlayButton();
  bindEditSubmitButton();
  bindDeleteEditOverlayButton();
}

/**
 * Binds the close button to hide the edit overlay.
 */
function bindCloseEditOverlayButton() {
  document
    .getElementById("closeEditOverlayBtn")
    ?.addEventListener("click", closeEditOverlay);
}

/**
 * Binds the form submit to handle saving the edited contact.
 */
function bindEditSubmitButton() {
  document
    .getElementById("editContactForm")
    ?.addEventListener("submit", handleEditSubmit);
}

/**
 * Binds the delete button with behavior based on screen size.
 * On desktop: triggers edit delete handler.
 * On mobile: deletes contact directly.
 */
function bindDeleteEditOverlayButton() {
  document
    .getElementById("deleteContactEditOverlay")
    ?.addEventListener("click", () => {
      window.innerWidth > 1200 ? handleEditDelete() : deleteContact();
    });
}

/**
 * Updates the visibility of floating action buttons (add contact, menu dots, back button)
 * based on the current screen width and whether the contact details view is open.
 * The edit overlay's open state also prevents these buttons from being updated.
 */
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

/**
 * Smoothly hides the drop-up menu for contact actions using a CSS transition.
 * It removes the 'show' class and adds the 'hide' class, then sets the display to 'none'
 * after the transition duration.
 */
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

/**
 * Toggles the visibility of the drop-up menu for contact actions with an animation.
 * It only works if the contact details view is currently visible.
 */
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

/**
 * Deletes the currently viewed contact from the contact list in the UI.
 * It finds the contact item based on the name displayed in the details view
 * and removes it from the DOM. It also handles removing empty contact groups
 * and closes relevant views based on screen width.
 */
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

/**
 * Closes the contact details view in the right sidebar and clears its content.
 * It also closes the drop-up menu if it is open.
 */
function closeDetailAndMenu() {
  document
    .querySelector(".contacts-right")
    ?.classList.remove("show-contact-right");
  document.querySelector(".contacts-right-bottom").innerHTML = "";
  closeDropupMenu();
}

/**
 * Closes the drop-up menu when a click event occurs outside of the menu and its trigger button.
 */
document.addEventListener("click", (e) => {
  const menu = document.getElementById("dropupMenu");
  const btn = document.getElementById("menuDotsBtn");
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    closeDropupMenu();
  }
});

/**
 * Opens the contact details view in the right sidebar by adding the 'show-contact-right' class.
 * It also updates the visibility of floating action buttons.
 */
function openContactDetails() {
  document
    .querySelector(".contacts-right")
    ?.classList.add("show-contact-right");
  updateFloatingButtons();
}

/**
 * Closes the contact details view in the right sidebar by removing the 'show-contact-right' class.
 * It also hides the mobile-only go-back button and updates floating action buttons.
 */
function closeContactDetails() {
  document
    .querySelector(".contacts-right")
    ?.classList.remove("show-contact-right");
  document.querySelector(".mobile-only-goback")?.classList.remove("visible");
  updateFloatingButtons();
}

/**
 * Ensures the drop-up menu is initially hidden when the page loads.
 */
document.getElementById("dropupMenu")?.classList.remove("show");

/**
 * Updates the visibility of floating action buttons when the page is loaded and when the window is resized.
 */
window.addEventListener("load", updateFloatingButtons);
window.addEventListener("resize", updateFloatingButtons);

/**
 * Sets up a click event listener on the contact list to open the contact details view
 * when a contact item is clicked. It also binds the event listeners for the edit overlay buttons.
 */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contactList")?.addEventListener("click", (e) => {
    const item = e.target.closest(".contact-item");
    if (item) openContactDetails();
  });
  bindEditOverlayButtons();
});

/**
 * Shows a temporary success message after a contact is created.
 * The message fades in and then fades out after a short delay.
 */
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

/**
 * Changes the animation of the add contact modal based on the screen width.
 * On larger screens (>= 1200px), it slides in from the right; on smaller screens, it slides in from the bottom.
 */
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

/**
 * Changes the animation of the add contact modal when closing, based on the screen width.
 * On larger screens (>= 1200px), it slides out to the right; on smaller screens, it slides out to the bottom.
 */
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
