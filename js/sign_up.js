// Import Firebase database functions from firebase.js
import { saveUserData, database, ref, push, get } from "./firebase.js";  // Now everything is imported from firebase.js

/**
 * This function automatically fills in the signup fields (for testing purposes).
 */
function autoFillFieldsSignUp() {
    document.getElementById("name").value = "Sofia Müller";
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
    document.getElementById("confirm-password").value = "MyPassword12345";
    document.getElementById("privacy-policy").checked = true;
}

/**
 * This function handles the form submission, saves user data to Firebase,
 * displays a success message, and redirects to the signup page after a short delay.
 * @param {Event} event - The event object to prevent the default form submission.
 */
function handleSignUpSubmission(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userId = email.replace(/[^a-zA-Z0-9]/g, "_");

    saveUserData(userId, name, email);

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

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
 * This function creates a contact in Firebase and visually adds it to the contact list.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 */
function createContact(name, email) {
    const contactsRef = ref(database, 'contacts');

    get(contactsRef)
        .then((snapshot) => {
            let contactExists = false;
            snapshot.forEach((childSnapshot) => {
                const contact = childSnapshot.val();
                if (contact.email === email) {
                    contactExists = true;
                }
            });

            if (!contactExists) {
                push(contactsRef, {
                    name: name,
                    email: email
                })
                .then(() => {
                    console.log("Contact created successfully after signup.");

                    // Visually add the contact
                    const contactList = document.getElementById("contactList");
                    if (contactList) {
                        const newContactElement = createContactElement(name, email);
                        // Find the correct group letter div
                        const firstLetter = name.charAt(0).toUpperCase();
                        let groupDiv = contactList.querySelector(`.contact-group:has(.contact-group-letter:contains("${firstLetter}"))`);
                        if (groupDiv) {
                            groupDiv.appendChild(newContactElement);
                        } else {
                            // Create a new group if it doesn't exist
                            groupDiv = document.createElement("div");
                            groupDiv.classList.add("contact-group");
                            groupDiv.innerHTML = `<div class="contact-group-letter">${firstLetter}</div>`;
                            groupDiv.appendChild(newContactElement);
                            contactList.appendChild(groupDiv);
                        }
                        // Optionally, sort the contacts list after adding the new contact
                        sortContactsList();
                    }
                })
                .catch((error) => {
                    console.error("Error creating contact:", error);
                });
            } else {
                console.log("Contact with this email already exists. Not creating a duplicate.");
            }
        })
        .catch((error) => {
            console.error("Error checking for existing contact:", error);
        });
}

/**
 * This function toggles the visibility of a password field.
 * @param {string} inputId - The ID of the password field.
 * @param {HTMLImageElement} imgElement - The image element for the visibility icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === "text";

    if (isPasswordVisible) {
        inputField.type = "password";
        imgElement.src = "../assets/img/eye_closed.png";
    } else {
        inputField.type = "text";
        imgElement.src = "../assets/img/eye.png";
    }
}

/**
 * This function updates the password visibility icon.
 * @param {string} inputId - The ID of the password field.
 * @param {HTMLImageElement} imgElement - The image element for the visibility icon.
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        imgElement.src = "../assets/img/eye_closed.png";
    } else {
        imgElement.src = "../assets/img/lock.png";
    }
}

/**
 * This function creates the HTML element for a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact (optional).
 * @returns {HTMLElement} The HTML element for the contact.
 */
function createContactElement(name, email, phone = "") {
    const firstLetter = name.charAt(0).toUpperCase();
    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact-item");
    contactDiv.setAttribute("data-name", name);
    contactDiv.setAttribute("data-email", email);
    if (phone) {
        contactDiv.setAttribute("data-phone", phone);
    }

    contactDiv.innerHTML = `
        <div class="contact-avatar" data-name="${name}">${firstLetter}</div>
        <div class="contact-details">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${email}</div>
        </div>
        <button id="delete" class="delete-btn-contact">
            <img class="actions-img" src="../assets/img/delete.png" alt="delete">
            Delete
        </button>
    `;

    return contactDiv;
}

/**
 * This function sorts the contact list alphabetically by group names and contact names.
 */
function sortContactsList() {
    const contactList = document.getElementById("contactList");
    if (!contactList) return;

    const contactGroups = Array.from(contactList.querySelectorAll(".contact-group"));

    contactGroups.sort((a, b) => {
        const letterA = a.querySelector(".contact-group-letter").textContent;
        const letterB = b.querySelector(".contact-group-letter").textContent;
        return letterA.localeCompare(letterB);
    });

    contactGroups.forEach(group => {
        const contacts = Array.from(group.querySelectorAll(".contact-item"));
        contacts.sort((a, b) => {
            const nameA = a.dataset.name.toUpperCase();
            const nameB = b.dataset.name.toUpperCase();
            return nameA.localeCompare(nameB);
        });
        const groupLetterDiv = group.querySelector(".contact-group-letter");
        group.innerHTML = "";
        group.appendChild(groupLetterDiv);
        contacts.forEach(contact => group.appendChild(contact));
    });

    contactList.innerHTML = "";
    contactGroups.forEach(group => contactList.appendChild(group));
}

// Make functions available for inline event listeners
window.autoFillFieldsSignUp = autoFillFieldsSignUp;
window.handleSignUpSubmission = handleSignUpSubmission;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordIcon = updatePasswordIcon;

document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signup-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", handleSignUpSubmission);
    } else {
        console.error("Sign-up form not found.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const passwordIcon = document.getElementById("eye-icon-password");
    const confirmPasswordIcon = document.getElementById("eye-icon-confirm-password");

    if (passwordField && passwordIcon) {
        passwordField.addEventListener("focus", function () {
            if (passwordField.type === "password") {
                passwordIcon.src = "../assets/img/eye_closed.png";
            }
        });
    }

    if (confirmPasswordField && confirmPasswordIcon) {
        confirmPasswordField.addEventListener("focus", function () {
            if (confirmPasswordField.type === "password") {
                confirmPasswordIcon.src = "../assets/img/eye_closed.png";
            }
        });
    }
});

document.getElementById("start").style.display = "none";
