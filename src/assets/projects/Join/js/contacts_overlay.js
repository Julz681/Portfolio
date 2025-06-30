/**
 * Connects the buttons for opening, canceling, and closing the add-contact overlay
 * to their respective functions (`openOverlay`, `resetOverlay`).
 * It also adds a click listener to the overlay itself to close it when clicked outside the form.
 */
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

/**
 * Closes the add-contact overlay by removing the 'open' class, clears the form inputs,
 * and resets the `isEditing` flag and `currentEditingContact` variable.
 */
function resetOverlay() {
  document.getElementById("addContactOverlay").classList.remove("open");
  clearForm();
  isEditing = false;
  currentEditingContact = null;
  document.getElementById("email-error-message").classList.add("hidden");
  document.getElementById("phone-error-message").classList.add("hidden");
}

/**
 * Clears the value of the input fields in the add-contact form (name, email, phone).
 */
function clearForm() {
  ["contactName", "contactEmail", "contactPhone"].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

/**
 * Binds the click event to the "Create Contact" button and handles contact creation.
 */
function bindCreateButton() {
  document.getElementById("createContact")
    .addEventListener("click", handleCreateContactClick);
}

/**
 * Handles the click event for creating a new contact.
 * @param {Event} e - The click event.
 */
function handleCreateContactClick(e) {
  e.preventDefault();
  const name = getValue("contactName");
  const email = getValue("contactEmail");
  const phone = getValue("contactPhone");
  if (!name || !email || !phone) return showError();
  hideError();
  if (validateEmail("contactEmail", "email-error-message")) return;
  if (validatePhoneNumber("contactPhone", "phone-error-message")) return;
  processValidContact(name, email, phone);
}

/**
 * Processes the creation of a valid contact and updates the UI.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function processValidContact(name, email, phone) {
  const list = document.getElementById("contactList");
  createContactElement(name, email, phone, list);
  saveContactToLocalStorage(name, email, phone);
  resetOverlay();
  if (window.innerWidth < 900) {
    showMobileSuccessUI();
  }
  updateFloatingButtons();
  bindEditOverlayButtons();
}

/**
 * Shows contact success feedback and contact section on smaller screens.
 */
function showMobileSuccessUI() {
  document
    .querySelector(".contacts-right")
    ?.classList.add("show-contact-right");
  showSuccessMessage();
}


/**
 * Adds a click event listener to the document to close the edit contact overlay
 * when a click occurs outside the modal content.
 */
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("editContactOverlay");
  const modal = overlay?.querySelector(".add-contact-modal");
  if (overlay?.classList.contains("open") && !modal.contains(e.target)) {
    closeEditOverlay();
  }
});

/**
 * Loads the data of the currently selected contact into the edit form,
 * sets the avatar in the edit overlay, and opens the edit overlay.
 */
function startEditMode() {
  const selected = document.querySelector(".contact-item.selected");
  if (!selected) {
    return;
  }
  const { name, email, phone } = selected.dataset;
  fillEditForm(name, email, phone);
  setEditAvatar(name);
  const overlay = document.getElementById("editContactOverlay");
  overlay.classList.remove("hidden");
  overlay.classList.add("open");
  overlay.dataset.current = name;
}

/**
 * Fills the input fields of the edit contact form with the provided name, email, and phone.
 * @param {string} name - The name of the contact to edit.
 * @param {string} email - The email address of the contact to edit.
 * @param {string} phone - The phone number of the contact to edit.
 */
function fillEditForm(name, email, phone) {
  document.getElementById("editContactName").value = name;
  document.getElementById("editContactEmail").value = email;
  document.getElementById("editContactPhone").value = phone;
}

/**
 * Sets the avatar in the edit overlay based on the initials of the provided name.
 * @param {string} name - The name of the contact.
 */
function setEditAvatar(name) {
  const initials = getInitials(name);
  const color = letterColors[name[0].toUpperCase()] || "#999";
  const avatar = document.getElementById("editOverlayAvatar");
  avatar.innerHTML = `<div class="avatar-initials">${initials}</div>`;
  avatar.style.backgroundColor = color;
}

/**
 * Binds event listeners to the buttons within the edit contact overlay:
 * close button, submit button for saving edits, and delete button.
 */
function bindEditOverlayButtons() {
  document
    .getElementById("closeEditOverlayBtn")
    ?.addEventListener("click", closeEditOverlay);
  document
    .getElementById("editContactForm")
    ?.addEventListener("submit", handleEditSubmit);
  document
    .getElementById("deleteContactEditOverlay")
    ?.addEventListener("click", handleEditDelete);
}

/**
 * Handles the submission of the edit contact form.
 * Prevents default behavior, validates inputs, and updates the contact.
 * @param {Event} e - The submit event.
 */
function handleEditSubmit(e) {
  e.preventDefault();
  const name = getValue("editContactName");
  const email = getValue("editContactEmail");
  const phone = getValue("editContactPhone");

  if (!validateEditInputs(name, email, phone)) return;
  if (validateEmail("editContactEmail", "email-edit-error-message")) return;
  if (validatePhoneNumber("editContactPhone", "phone-edit-error-message")) return;

  handleContactUpdate(name, email, phone);
}

/**
 * Validates edit form inputs and shows error if any field is empty.
 * @param {string} name - The edited name.
 * @param {string} email - The edited email.
 * @param {string} phone - The edited phone number.
 * @returns {boolean} True if all fields are filled, false otherwise.
 */
function validateEditInputs(name, email, phone) {
  if (!name || !email || !phone) {
    document.getElementById("edit-error-message").style.display = "block";
    return false;
  }
  return true;
}

/**
 * Handles updating the contact in the UI and local storage.
 * @param {string} name - The new contact name.
 * @param {string} email - The new contact email.
 * @param {string} phone - The new contact phone number.
 */
function handleContactUpdate(name, email, phone) {
  const list = document.getElementById("contactList");
  const currentName = document.getElementById("editContactOverlay").dataset.current;
  const selected = [...document.querySelectorAll(".contact-item")]
    .find(item => item.dataset.name === currentName);
  if (!selected) return;

  updateEditedContact(name, email, phone, list, selected);
  closeEditOverlay();
  updateContactInLocalStorage(currentName, name, email, phone);
}


/**
 * Handles the deletion of a contact from within the edit overlay.
 * It gets the name of the contact being edited and removes all corresponding
 * contact items and any resulting empty groups from the contact list.
 * Finally, it clears the contact details view and closes the edit overlay.
 */
function handleEditDelete() {
  const currentName =
    document.getElementById("editContactOverlay").dataset.current;
  if (!currentName) return;
  document.querySelectorAll(".contact-item").forEach((i) => {
    if (i.dataset.name === currentName) i.remove();
  });
  document.querySelectorAll(".contact-group").forEach((g) => {
    if (!g.querySelector(".contact-item")) g.remove();
  });
  document.querySelector(".contacts-right-bottom").innerHTML = "";
  closeEditOverlay();
}

/**
 * Closes the edit contact overlay by removing the 'open' class and clearing the 'current' dataset attribute.
 */
function closeEditOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  overlay.classList.remove("open");
  overlay.dataset.current = "";
  document.getElementById("email-edit-error-message").classList.add("hidden");
  document.getElementById("phone-edit-error-message").classList.add("hidden");
}


/**
 * Hides the error message in the add contact overlay when all input fields
 * (name, email, phone) have a non-empty value.
 * Attaches input event listeners to relevant fields.
 */
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

/**
 * Validates an email address input against a basic email pattern.
 *
 * @param {string} id - The ID of the input element containing the email address.
 * @param {string} errorMessageId - The ID of the element to display the error message.
 * @returns {boolean} - Returns true if validation fails, false otherwise.
 */
function validateEmail(id, errorMessageId) {
  let emailInputValue = document.getElementById(id).value;
  let errorMessage = document.getElementById(errorMessageId);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return showValidationError(emailPattern, emailInputValue, errorMessage);
}

/**
 * Validates a phone number input against a general phone number pattern.
 *
 * @param {string} id - The ID of the input element containing the phone number.
 * @param {string} errorMessageId - The ID of the element to display the error message.
 * @returns {boolean} - Returns true if validation fails, false otherwise.
 */
function validatePhoneNumber(id, errorMessageId) {
  let phoneInputValue = document.getElementById(id).value;
  let errorMessage = document.getElementById(errorMessageId);
  const phonePattern =
    /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,5}\)?[\s-]?)?[\d\s\-\.]{5,15}$/;
  return showValidationError(phonePattern, phoneInputValue, errorMessage);
}

/**
 * Shows or hides an error message based on whether the input value matches the pattern.
 *
 * @param {RegExp} pattern - The regular expression pattern to validate against.
 * @param {string} value - The input value to validate.
 * @param {HTMLElement} errorMessage - The DOM element used to show the error message.
 * @returns {boolean} - Returns true if the input is invalid, false if valid.
 */
function showValidationError(pattern, value, errorMessage) {
  if (pattern.test(value) === false) {
    errorMessage.classList.remove("hidden");
    return true;
  } else {
    errorMessage.classList.add("hidden");
    return false;
  }
}
