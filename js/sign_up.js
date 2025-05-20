// Import Firebase database functions from firebase.js
import { saveUserData, database, ref, push, get } from "./firebase.js";

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 */
function showFieldError(fieldId, message) {
    const el = document.getElementById(`${fieldId}-error`);
    if (el) {
        el.textContent = message;
        el.classList.remove("d_none");
    }
}

/**
 * Hides any visible error message from the UI.
 */
function hideAllFieldErrors() {
    const errorIds = ["name", "email", "password", "confirm-password", "privacy"];
    errorIds.forEach(id => {
        const el = document.getElementById(`${id}-error`);
        if (el) {
            el.textContent = "";
            el.classList.add("d_none");
        }
    });
}
/**
 * Automatically fills in the sign-up fields for demo/testing purposes.
 */
function autoFillFieldsSignUp() {
    document.getElementById("name").value = "Sofia Müller";
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
    document.getElementById("confirm-password").value = "MyPassword12345";
    document.getElementById("privacy-policy").checked = true;
}

/**
 * Handles the submission of the sign-up form. Validates input fields,
 * saves user data, shows a success message, and redirects to login.
 * @param {Event} event - The submit event triggered by the form.
 */
function handleSignUpSubmission(event) {
    event.preventDefault();
    hideAllFieldErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const privacyAccepted = document.getElementById("privacy-policy").checked;

    let hasError = false;

    if (!name) {
        showFieldError("name", "Please enter your name.");
        hasError = true;
    }

    if (!email) {
        showFieldError("email", "Please enter your email.");
        hasError = true;
    } else if (!email.includes("@") || !email.includes(".")) {
        showFieldError("email", "Please enter a valid email address.");
        hasError = true;
    }

    if (!password) {
        showFieldError("password", "Please enter a password.");
        hasError = true;
    } else if (password.length < 8) {
        showFieldError("password", "Password must be at least 8 characters.");
        hasError = true;
    }

    if (!confirmPassword) {
        showFieldError("confirm-password", "Please confirm your password.");
        hasError = true;
    } else if (password !== confirmPassword) {
        showFieldError("confirm-password", "Passwords do not match.");
        hasError = true;
    }

    if (!privacyAccepted) {
        showFieldError("privacy", "Please accept the privacy policy.");
        hasError = true;
    }

    if (hasError) return;

    const userId = email.replace(/[^a-zA-Z0-9]/g, "_");
    saveUserData(userId, name, email, password);
localStorage.setItem("savedEmail", email);
localStorage.setItem("savedPassword", password);
localStorage.setItem("rememberMe", "true");

    createContact(name, email);

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
 * Creates a contact in Firebase if it doesn't already exist,
 * and adds it visually to the contact list in the UI.
 * @param {string} name - The contact's full name.
 * @param {string} email - The contact's email address.
 */
function createContact(name, email) {
    const contactsRef = ref(database, 'contacts');

    get(contactsRef)
        .then((snapshot) => {
            let exists = false;

            snapshot.forEach((child) => {
                if (child.val().email === email) {
                    exists = true;
                }
            });

            if (!exists) {
                push(contactsRef, { name, email }).then(() => {
                    const contactList = document.getElementById("contactList");
                    if (!contactList) return;

                    const element = createContactElement(name, email);
                    const firstLetter = name.charAt(0).toUpperCase();
                    let group = contactList.querySelector(
                        `.contact-group:has(.contact-group-letter:contains("${firstLetter}"))`
                    );

                    if (group) {
                        group.appendChild(element);
                    } else {
                        group = document.createElement("div");
                        group.classList.add("contact-group");
                        group.innerHTML = `<div class="contact-group-letter">${firstLetter}</div>`;
                        group.appendChild(element);
                        contactList.appendChild(group);
                    }

                    sortContactsList();
                });
            }
        });
}

/**
 * Toggles the visibility of the password field and updates the icon accordingly.
 * @param {string} inputId - The ID of the input field.
 * @param {HTMLImageElement} imgElement - The icon element to update.
 */
function togglePasswordVisibility(inputId, imgElement) {
    const input = document.getElementById(inputId);
    input.type = input.type === "text" ? "password" : "text";
    imgElement.src = input.type === "password"
        ? "/assets/img/eye_closed.png"
        : "/assets/img/eye.png";
}

/**
 * Updates the password icon depending on whether input is present.
 * @param {string} inputId - The ID of the password field.
 * @param {HTMLImageElement} imgElement - The icon element to update.
 */
function updatePasswordIcon(inputId, imgElement) {
    const input = document.getElementById(inputId);
    imgElement.src = input.value.length > 0
        ? "/assets/img/eye_closed.png"
        : "/assets/img/lock.png";
}

/**
 * Creates the DOM element for a new contact item.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} [phone=""] - Optional phone number.
 * @returns {HTMLElement} The contact DOM node.
 */
function createContactElement(name, email, phone = "") {
    const firstLetter = name.charAt(0).toUpperCase();
    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact-item");
    contactDiv.setAttribute("data-name", name);
    contactDiv.setAttribute("data-email", email);
    if (phone) contactDiv.setAttribute("data-phone", phone);

    contactDiv.innerHTML = `
        <div class="contact-avatar" data-name="${name}">${firstLetter}</div>
        <div class="contact-details">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${email}</div>
        </div>
        <button id="delete" class="delete-btn-contact">
            <img class="actions-img" src="/assets/img/delete.png" alt="delete">
            Delete
        </button>
    `;
    return contactDiv;
}

/**
 * Sorts all contact groups and their items alphabetically.
 */
function sortContactsList() {
    const contactList = document.getElementById("contactList");
    if (!contactList) return;

    const groups = Array.from(contactList.querySelectorAll(".contact-group"));

    groups.sort((a, b) => {
        const aLetter = a.querySelector(".contact-group-letter").textContent;
        const bLetter = b.querySelector(".contact-group-letter").textContent;
        return aLetter.localeCompare(bLetter);
    });

    groups.forEach(group => {
        const contacts = Array.from(group.querySelectorAll(".contact-item"));
        contacts.sort((a, b) =>
            a.dataset.name.localeCompare(b.dataset.name)
        );

        const letterDiv = group.querySelector(".contact-group-letter");
        group.innerHTML = "";
        group.appendChild(letterDiv);
        contacts.forEach(contact => group.appendChild(contact));
    });

    contactList.innerHTML = "";
    groups.forEach(group => contactList.appendChild(group));
}

// Bind core functions to the window for inline event usage
window.autoFillFieldsSignUp = autoFillFieldsSignUp;
window.handleSignUpSubmission = handleSignUpSubmission;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordIcon = updatePasswordIcon;

// Add event listeners once DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (form) form.addEventListener("submit", handleSignUpSubmission);

    const pw = document.getElementById("password");
    const pwConfirm = document.getElementById("confirm-password");
    const eye1 = document.getElementById("eye-icon-password");
    const eye2 = document.getElementById("eye-icon-confirm-password");

    if (pw && eye1) {
        pw.addEventListener("focus", () => eye1.src = "/assets/img/eye_closed.png");
    }

    if (pwConfirm && eye2) {
        pwConfirm.addEventListener("focus", () => eye2.src = "/assets/img/eye_closed.png");
    }
});
