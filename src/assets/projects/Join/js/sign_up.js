/** Import Firebase database functions */
import { saveUserData, database, ref, push, get } from "./firebase.js";

/**
 * Displays an error message below a specific input field.
 * @param {string} fieldId - ID of the input field.
 * @param {string} message - Error message to display.
 */
function showFieldError(fieldId, message) {
  const el = document.getElementById(`${fieldId}-error`);
  if (el) {
    el.textContent = message;
    el.classList.remove("d_none");
  }
}

/**
 * Hides all field-specific error messages.
 */
function hideAllFieldErrors() {
  const fields = ["name", "email", "password", "confirm-password", "privacy"];
  fields.forEach(id => {
    const el = document.getElementById(`${id}-error`);
    if (el) {
      el.textContent = "";
      el.classList.add("d_none");
    }
  });
}

/**
 * Validates sign-up form and creates user + contact if valid.
 * @param {Event} event - Submit event from the form.
 */
function handleSignUpSubmission(event) {
  event.preventDefault();
  hideAllFieldErrors();
  const data = getFormData();
  if (validateForm(data)) {
    saveAccount(data);
    showSuccessAndRedirect();
  }
}

/**
 * Gets values from form fields.
 * @returns {Object} Form data object.
 */
function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirm-password").value,
    privacyAccepted: document.getElementById("privacy-policy").checked,
  };
}

/**
 * Validates form input and shows field errors if needed.
 * @param {Object} data - Form input data.
 * @returns {boolean} True if form is valid.
 */
function validateForm(data) {
  let error = false;
  if (!data.name) showFieldError("name", "Please enter your name."), error = true;
  if (!data.email) showFieldError("email", "Please enter your email."), error = true;
  else if (!data.email.includes("@") || !data.email.includes(".")) {
    showFieldError("email", "Please enter a valid email address."); error = true;
  }
  if (!data.password) showFieldError("password", "Please enter a password."), error = true;
  else if (data.password.length < 8) showFieldError("password", "Password must be at least 8 characters."), error = true;
  if (!data.confirmPassword) showFieldError("confirm-password", "Please confirm your password."), error = true;
  else if (data.password !== data.confirmPassword) showFieldError("confirm-password", "Passwords do not match."), error = true;
  if (!data.privacyAccepted) showFieldError("privacy", "Please accept the privacy policy."), error = true;
  return !error;
}

/**
 * Saves user data and localStorage, then creates contact.
 * @param {Object} data - Validated user data.
 */
function saveAccount(data) {
  const userId = data.email.replace(/[^a-zA-Z0-9]/g, "_");
  saveUserData(userId, data.name, data.email, data.password);
sessionStorage.setItem("tempEmail", data.email);
sessionStorage.setItem("tempPassword", data.password);
  createContact(data.name, data.email);
}

/**
 * Displays success message and redirects to login page.
 */
function showSuccessAndRedirect() {
  let successMessage = document.querySelector(".success-message");
  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "You signed up successfully";
    document.body.appendChild(successMessage);
  }
  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
    window.location.href = "/index.html";
  }, 1000);
}

/**
 * Creates a new contact in Firebase if not already present.
 * @param {string} name - Contact name.
 * @param {string} email - Contact email.
 */
function createContact(name, email) {
  const contactsRef = ref(database, 'contacts');
  get(contactsRef).then((snapshot) => {
    let exists = false;
    snapshot.forEach(child => {
      if (child.val().email === email) exists = true;
    });
    if (!exists) addNewContact(contactsRef, name, email);
  });
}

/**
 * Pushes new contact to Firebase and updates UI.
 * @param {Reference} refNode - Firebase ref to contacts.
 * @param {string} name - Contact name.
 * @param {string} email - Contact email.
 */
function addNewContact(refNode, name, email) {
  push(refNode, { name, email }).then(() => {
    const list = document.getElementById("contactList");
    if (!list) return;
    const element = createContactElement(name, email);
    const firstLetter = name.charAt(0).toUpperCase();
    let group = [...list.children].find(div =>
      div.classList.contains("contact-group") &&
      div.querySelector(".contact-group-letter")?.textContent === firstLetter
    );
    if (!group) {
      group = document.createElement("div");
      group.className = "contact-group";
      group.innerHTML = `<div class="contact-group-letter">${firstLetter}</div>`;
      list.appendChild(group);
    }
    group.appendChild(element);
    sortContactsList();
  });
}

/**
 * Creates and returns a contact DOM element.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} [phone=""] - Optional phone number.
 * @returns {HTMLElement} New contact element.
 */
function createContactElement(name, email, phone = "") {
  const firstLetter = name.charAt(0).toUpperCase();
  const div = document.createElement("div");
  div.className = "contact-item";
  div.dataset.name = name;
  div.dataset.email = email;
  if (phone) div.dataset.phone = phone;
  div.innerHTML = `
    <div class="contact-avatar" data-name="${name}">${firstLetter}</div>
    <div class="contact-details">
      <div class="contact-name">${name}</div>
      <div class="contact-email">${email}</div>
    </div>
    <button id="delete" class="delete-btn-contact">
      <img class="actions-img" src="/../assets/img/delete.png" alt="delete">
      Delete
    </button>`;
  return div;
}

/**
 * Sorts all contact groups and contacts alphabetically.
 */
function sortContactsList() {
  const list = document.getElementById("contactList");
  if (!list) return;
  const groups = Array.from(list.querySelectorAll(".contact-group"));
  groups.sort((a, b) =>
    a.querySelector(".contact-group-letter").textContent.localeCompare(
      b.querySelector(".contact-group-letter").textContent));
  groups.forEach(group => {
    const contacts = [...group.querySelectorAll(".contact-item")];
    contacts.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    const letter = group.querySelector(".contact-group-letter");
    group.innerHTML = "";
    group.appendChild(letter);
    contacts.forEach(c => group.appendChild(c));
  });
  list.innerHTML = "";
  groups.forEach(g => list.appendChild(g));
}

/**
 * Toggles password field visibility.
 * @param {string} inputId - ID of the password input.
 * @param {HTMLImageElement} imgElement - Eye icon element.
 */
function togglePasswordVisibility(inputId, imgElement) {
  const input = document.getElementById(inputId);
  input.type = input.type === "text" ? "password" : "text";
  imgElement.src = input.type === "password"
    ? "/../assets/img/eye_closed.png"
    : "/../assets/img/eye.png";
}

/**
 * Updates password icon based on input value.
 * @param {string} inputId - ID of the password input.
 * @param {HTMLImageElement} imgElement - Eye/lock icon.
 */
function updatePasswordIcon(inputId, imgElement) {
  const input = document.getElementById(inputId);
  imgElement.src = input.value.length > 0
    ? "/../assets/img/eye_closed.png"
    : "/../assets/img/lock.png";
}

/** Exported for inline usage */
window.handleSignUpSubmission = handleSignUpSubmission;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordIcon = updatePasswordIcon;

/**
 * Initializes form and password field listeners on load.
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  if (form) form.addEventListener("submit", handleSignUpSubmission);
  const pw = document.getElementById("password");
  const pwConfirm = document.getElementById("confirm-password");
  const eye1 = document.getElementById("eye-icon-password");
  const eye2 = document.getElementById("eye-icon-confirm-password");
  if (pw && eye1) {
    pw.addEventListener("focus", () => eye1.src = "/../assets/img/eye_closed.png");
  }
  if (pwConfirm && eye2) {
    pwConfirm.addEventListener("focus", () => eye2.src = "/../assets/img/eye_closed.png");
  }
});
