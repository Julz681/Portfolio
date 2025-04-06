import { database, ref, get, update, remove, push } from '../js/firebase.js';
// This is an object that provides colors for the avatars, depending on the first letter of the contact name.
const letterColors = {};

/**
 * This function creates a new contact element (div) for display in the contact list.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} contactId - The unique ID of the contact from Firebase.
 * @returns {HTMLDivElement} - The newly created contact div element.
 */
function createFirebaseContactElement(name, email, phone = "", contactId = "") {
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
    item.dataset.firebaseId = contactId;
    item.innerHTML = `
        <div class="contact-avatar" data-name="${name}">
            ${initials}
        </div>
        <div class="contact-details">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${email}</div>
        </div>`;
    return item;
}

/**
 * This function loads contacts from the Firebase Realtime Database and displays them in the contact list.
 */
function loadContactsFromFirebase() {
    get(ref(database, 'contacts')) // Use the 'database' reference from firebase.js
        .then((snapshot) => {
            const firebaseContacts = snapshot.val();
            if (firebaseContacts) {
                const contactList = document.getElementById("contactList");
                if (!contactList) return;

                const contactsArray = Object.entries(firebaseContacts).map(([contactId, contactData]) => ({
                    id: contactId,
                    ...contactData
                }));

                contactsArray.sort((a, b) => a.name.localeCompare(b.name));

                contactsArray.forEach(contactData => {
                    const existingContact = document.querySelector(`.contact-item[data-firebase-id="${contactData.id}"]`);
                    if (!existingContact) {
                        const newContactElement = createFirebaseContactElement(contactData.name, contactData.email, contactData.phone, contactData.id);
                        const groupLetter = contactData.name[0].toUpperCase();
                        let group = [...document.querySelectorAll(".contact-group")].find(
                            (g) => g.querySelector(".contact-group-letter")?.textContent === groupLetter
                        );
                        if (!group) {
                            group = document.createElement("div");
                            group.className = "contact-group";
                            group.innerHTML = `<div class="contact-group-letter">${groupLetter}</div>`;
                            contactList.appendChild(group);
                        }
                        group.appendChild(newContactElement);
                    } else {
                        existingContact.dataset.name = contactData.name;
                        existingContact.dataset.email = contactData.email;
                        existingContact.dataset.phone = contactData.phone;
                        existingContact.querySelector(".contact-avatar").dataset.name = contactData.name;
                        existingContact.querySelector(".contact-avatar").textContent = contactData.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
                        existingContact.querySelector(".contact-name").textContent = contactData.name;
                        existingContact.querySelector(".contact-email").textContent = contactData.email;
                    }
                });

                sortContacts();
                bindContactClicks();
                setAvatarColors();
            }
        })
        .catch((error) => {
            console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
        });
}

/**
 * This function updates a contact's data in the Firebase Realtime Database.
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 * @param {string} name - The new name of the contact.
 * @param {string} email - The new email address of the contact.
 * @param {string} phone - The new phone number of the contact.
 * @returns {Promise<void>}
 */
function updateFirebaseContact(firebaseId, name, email, phone) {
    const contactRef = ref(database, `contacts/${firebaseId}`);
    return update(contactRef, { name, email, phone });
}

/**
 * This function deletes a contact from the Firebase Realtime Database.
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 * @returns {Promise<void>}
 */
function deleteFirebaseContact(firebaseId) {
    const contactRef = ref(database, `contacts/${firebaseId}`);
    return remove(contactRef)
        .then(() => console.log("Kontakt erfolgreich gelöscht"))
        .catch((error) => console.error("Fehler beim Löschen des Kontakts:", error));
}

/**
 * This function adds a new contact to the Firebase Realtime Database.
 * @param {object} contactData - An object containing the contact's name, email, and phone number.
 * @returns {Promise<string>} - A promise that resolves with the unique ID of the newly created contact.
 */
function addContactToFirebase(contactData) {
    const newContactRef = push(ref(database, 'contacts'), contactData);  // Use ref(database, 'contacts')
    return new Promise((resolve, reject) => {
        newContactRef.then(snapshot => {
            resolve(snapshot.key);
        }).catch(error => {
            reject(error);
        })
    });
}

// Event listener that runs when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadContactsFromFirebase, 100);
    setTimeout(setAvatarColors, 200);
    window.updateContactInFirebase = updateFirebaseContact;
    window.deleteContactFromFirebase = deleteFirebaseContact;
    window.addContactToFirebase = addContactToFirebase;
});
