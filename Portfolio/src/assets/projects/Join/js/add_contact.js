import { database, ref, get, update, remove, push } from '../js/firebase.js';

/**
 * An object used to assign and store avatar background colors
 * based on the first letter of each contact's name.
 * @type {Object<string, string>}
 */
const letterColors = {};

/**
 * Creates a new contact element (div) for display in the contact list.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} email - The contact's email address.
 * @param {string} [phone=""] - The contact's phone number (optional).
 * @param {string} [contactId=""] - The unique ID of the contact from Firebase.
 * @returns {HTMLDivElement} - The newly created contact item element.
 */
function createFirebaseContactElement(name, email, phone = "", contactId = "") {
  const groupLetter = name[0].toUpperCase();
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const item = document.createElement("div");
  item.className = "contact-item";
  item.dataset.name = name;
  item.dataset.email = email;
  item.dataset.phone = phone;
  item.dataset.firebaseId = contactId;
  item.innerHTML = getContactElementTemplate(name, email, initials);
  return item;
}

/**
 * Returns the HTML template string for a contact element.
 *
 * @param {string} name - The contact's full name.
 * @param {string} email - The contact's email address.
 * @param {string} initials - The initials to display in the avatar.
 * @returns {string} - The HTML template string.
 */
function getContactElementTemplate(name, email, initials) {
  return `<div class="contact-avatar" data-name="${name}">
            ${initials}
        </div>
        <div class="contact-details">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${email}</div>
        </div>`;
}

/**
 * Loads contacts from the Firebase Realtime Database and renders them into the contact list.
 */
function loadContactsFromFirebase() {
  get(ref(database, "contacts"))
    .then((snapshot) => {
      const firebaseContacts = snapshot.val();
      if (!firebaseContacts) return;
      const contactList = document.getElementById("contactList");
      if (!contactList) return;
      const contactsArray = Object.entries(firebaseContacts).map(([contactId, contactData]) => ({
        id: contactId,
        ...contactData,
      }));
      createContactsFromFirebase(contactsArray);
    }).catch((error) => {
      console.error("Error loading contacts from Firebase:", error);
    });
}

/**
 * Sorts and renders all contacts from Firebase, and initializes UI behavior.
 *
 * @param {Array<Object>} contactsArray - An array of contact data objects from Firebase.
 */
function createContactsFromFirebase(contactsArray) {
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  contactsArray.forEach(renderContactFromFirebase);
  sortContacts();
  bindContactClicks();
  setAvatarColors();
}

/**
 * Renders a contact in the UI. If it already exists, it updates the contact element.
 *
 * @param {Object} contactData - A contact object including name, email, phone, and id.
 */
function renderContactFromFirebase(contactData) {
  const existingContact = document.querySelector(`.contact-item[data-firebase-id="${contactData.id}"]`);
  if (existingContact) {
    updateExistingContactElement(existingContact, contactData);
    return;
  }
  const newContactElement = createFirebaseContactElement(
    contactData.name,
    contactData.email,
    contactData.phone,
    contactData.id
  );
  const group = groupLetterContainer(contactData.name[0].toUpperCase());
  group.appendChild(newContactElement);
}

/**
 * Retrieves or creates a container group based on the first letter of a contact's name.
 *
 * @param {string} letter - The first uppercase letter of the contact's name.
 * @returns {HTMLElement} - The container DOM element for the contact group.
 */
function groupLetterContainer(letter) {
  const contactList = document.getElementById("contactList");
  let group = [...document.querySelectorAll(".contact-group")].find(
    (g) => g.querySelector(".contact-group-letter")?.textContent === letter
  );
  if (!group) {
    group = document.createElement("div");
    group.className = "contact-group";
    group.innerHTML = `<div class="contact-group-letter">${letter}</div>`;
    contactList.appendChild(group);
  }
  return group;
}

/**
 * Updates an existing contact DOM element with new data.
 *
 * @param {HTMLElement} el - The existing contact element to update.
 * @param {Object} data - The updated contact data.
 */
function updateExistingContactElement(el, data) {
  el.dataset.name = data.name;
  el.dataset.email = data.email;
  el.dataset.phone = data.phone;
  const avatar = el.querySelector(".contact-avatar");
  const initials = data.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  avatar.dataset.name = data.name;
  avatar.textContent = initials;
  el.querySelector(".contact-name").textContent = data.name;
  el.querySelector(".contact-email").textContent = data.email;
}

/**
 * Updates a contact’s information in Firebase.
 *
 * @param {string} firebaseId - The contact's unique Firebase ID.
 * @param {string} name - The updated name.
 * @param {string} email - The updated email address.
 * @param {string} phone - The updated phone number.
 * @returns {Promise<void>} - A promise that resolves when the contact is updated.
 */
function updateFirebaseContact(firebaseId, name, email, phone) {
  const contactRef = ref(database, `contacts/${firebaseId}`);
  return update(contactRef, { name, email, phone });
}

/**
 * Deletes a contact from the Firebase Realtime Database.
 *
 * @param {string} firebaseId - The contact's unique Firebase ID.
 * @returns {Promise<void>} - A promise that resolves when the contact is deleted.
 */
function deleteFirebaseContact(firebaseId) {
  const contactRef = ref(database, `contacts/${firebaseId}`);
  return remove(contactRef)
    .then(() => console.log("Contact successfully deleted"))
    .catch((error) => console.error("Error deleting contact:", error));
}

/**
 * Adds a new contact to the Firebase Realtime Database.
 *
 * @param {Object} contactData - The contact data to add (name, email, phone).
 * @returns {Promise<string>} - A promise that resolves with the contact’s Firebase ID.
 */
function addContactToFirebase(contactData) {
  const newContactRef = push(ref(database, 'contacts'), contactData);
  return new Promise((resolve, reject) => {
    newContactRef.then(snapshot => {
      resolve(snapshot.key);
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * Initializes Firebase contact handling once the DOM is fully loaded.
 * It loads contacts, sets avatar colors, and exposes Firebase functions to the global scope.
 */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadContactsFromFirebase, 100);
  setTimeout(setAvatarColors, 200);
  window.updateContactInFirebase = updateFirebaseContact;
  window.deleteContactFromFirebase = deleteFirebaseContact;
  window.addContactToFirebase = addContactToFirebase;
});
