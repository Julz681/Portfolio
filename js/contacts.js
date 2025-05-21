window.addEventListener("DOMContentLoaded", () => {
  hideError(); // hide the error message on page load
  setAvatarColors(); // set avatar background colors based on the letters
  bindContactClicks(); // add click events to contact items for selection
  bindOverlayButtons(); // add functionality to open/close the contact overlay
  bindCreateButton(); // enable creating or editing a contact
  loadContactsFromLocalStorage();
  bindDeleteButton(); // enable deleting a selected contact
  bindEditButton(); // enable editing an existing contact
  enableAutofill(); // automatically fill in example contact -> Mark Zuckerberg
  closeErrorOnInput(); // hide the error message when all fields are filled
  bindEditOverlayButtons(); // binds all Event-Listener for the Edit-Overlay
});

/**
 * Hides the error message in both the add and edit contact overlays
 * when all required input fields (name, email, phone) are filled.
 */
function hideError() {
  const nameField = document.getElementById("contactName");
  const emailField = document.getElementById("contactEmail");
  const phoneField = document.getElementById("contactPhone");

  const addError = document.getElementById("error-message");
  const editError = document.getElementById("edit-error-message");

  if (!nameField || !emailField || !phoneField) return;

  const checkAndHide = () => {
    const allFilled =
      nameField.value.trim() &&
      emailField.value.trim() &&
      phoneField.value.trim();
    if (allFilled && addError) addError.style.display = "none";
    if (allFilled && editError) editError.style.display = "none";
  };

  [nameField, emailField, phoneField].forEach((field) =>
    field.addEventListener("input", checkAndHide)
  );
}

/**
 * Sets the background color of each contact avatar based on the first letter
 * of the contact's name, using the `letterColors` object for mapping.
 * If the first letter is not found in `letterColors`, a default color (#999) is used.
 */
function setAvatarColors() {
  document.querySelectorAll(".contact-avatar").forEach((avatar) => {
    const name = avatar.dataset.name;
    const initial = name?.trim()[0].toUpperCase();
    avatar.style.backgroundColor = letterColors[initial] || "#999";
  });
}

/**
 * Adds a click event listener to each contact item in the list,
 * calling the `selectContact` function when an item is clicked.
 */
function bindContactClicks() {
  document.querySelectorAll(".contact-item").forEach((item) => {
    item.addEventListener("click", () => selectContact(item));
  });
}

/**
 * Selects the clicked contact item by adding a 'selected' class and removes
 * the 'selected' class from any previously selected items. It then extracts
 * the name, email, and phone from the item's dataset and calls `showContactDetails`.
 * @param {HTMLElement} item - The clicked contact item element.
 */
function selectContact(item) {
  document
    .querySelectorAll(".contact-item.selected")
    .forEach((el) => el.classList.remove("selected"));
  item.classList.add("selected");
  const { name, email, phone } = item.dataset;
  showContactDetails(name, email, phone);
}

/**
 * Saves a new contact to the browser's localStorage.
 * If there are existing contacts, it adds the new one to the list.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function saveContactToLocalStorage(name, email, phone) {
  // Retrieve existing contacts or initialize as empty array
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Add the new contact to the array
  contacts.push({ name, email, phone });

  // Save the updated contact list back to localStorage
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

/**
 * Loads all saved contacts from localStorage and adds them to the contact list in the UI.
 * This is typically called when the page is first loaded.
 */
function loadContactsFromLocalStorage() {
  // Retrieve saved contacts or use empty array if none exist
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Get the container element for the contact list
  const contactList = document.getElementById("contactList");

  // For each saved contact, create and add it to the UI
  contacts.forEach(({ name, email, phone }) => {
    createContactElement(name, email, phone, contactList);
  });
}

/**
 * Updates an existing contact in localStorage based on the previous name.
 * If the contact is found, its details are updated.
 * @param {string} previousName - The name of the contact before editing.
 * @param {string} newName - The updated name of the contact.
 * @param {string} newEmail - The updated email address.
 * @param {string} newPhone - The updated phone number.
 */
function updateContactInLocalStorage(
  previousName,
  newName,
  newEmail,
  newPhone
) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Find and update the contact by previous name
  const index = contacts.findIndex((contact) => contact.name === previousName);
  if (index !== -1) {
    contacts[index] = { name: newName, email: newEmail, phone: newPhone };
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
}

/**
 * Deletes a contact from localStorage by name.
 * If the contact exists, it is removed from the saved list.
 * @param {string} nameToDelete - The name of the contact to delete.
 */
function deleteContactFromLocalStorage(nameToDelete) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Filter out the contact to be deleted
  contacts = contacts.filter((contact) => contact.name !== nameToDelete);

  localStorage.setItem("contacts", JSON.stringify(contacts));
}

/**
 * Returns the trimmed value of a form input field specified by its ID.
 * @param {string} id - The ID of the input element.
 * @returns {string} The trimmed value of the input field.
 */
function getValue(id) {
  return document.getElementById(id).value.trim();
}

/**
 * Shows the error message in the add-contact overlay by setting its display style to "block".
 */
function showError() {
  const error = document.getElementById("error-message");
  if (error) error.style.display = "block";
}

/**
 * Creates a new contact DOM element using `buildContactItem`, determines the correct
 * contact group based on the first letter of the name (creating a new group if necessary),
 * appends the new contact to the group, selects the new contact, re-binds contact click listeners,
 * and sorts the contact list.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {HTMLElement} contactList - The container for the contact groups.
 */
function createContactElement(name, email, phone, contactList) {
  const item = buildContactItem(name, email, phone);
  const group = getOrCreateGroup(name[0].toUpperCase(), contactList);
  group.appendChild(item);
  selectContact(item);
  bindContactClicks();
  sortContacts();
}

// function sendContactToLocalStorage(name, email, phone) {
//     localStorage.setItem("tasks", JSON.stringify(object))
// }

/**
 * Extracts the first letter of each word in a name and returns the first two initials in uppercase.
 * @param {string} name - The full name of the contact.
 * @returns {string} The first two initials of the name in uppercase.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Sorts the contacts alphabetically within each group and then sorts the groups themselves
 * alphabetically by the first letter.
 */
function sortContacts() {
  const contactList = document.getElementById("contactList");
  const groups = [...contactList.querySelectorAll(".contact-group")];
  groups.forEach((group) => {
    const items = [...group.querySelectorAll(".contact-item")];
    items.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    items.forEach((i) => group.appendChild(i));
  });
  groups.sort((a, b) =>
    a
      .querySelector(".contact-group-letter")
      .textContent.localeCompare(
        b.querySelector(".contact-group-letter").textContent
      )
  );
  groups.forEach((g) => contactList.appendChild(g));
}

/**
 * Updates an existing contact in the UI after editing. It finds the old contact's group,
 * removes the old contact element, creates a new contact element with the updated information,
 * and adds it to the contact list. It also resets the editing state.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email address of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @param {HTMLElement} list - The container for the contact groups.
 */
function updateEditedContact(name, email, phone, list) {
  const oldGroup = currentEditingContact.closest(".contact-group");
  oldGroup.removeChild(currentEditingContact);
  if (!oldGroup.querySelector(".contact-item")) oldGroup.remove();
  createContactElement(name, email, phone, list);
  isEditing = false;
  currentEditingContact = null;
}

/**
 * Adds a click event listener to the contact details view to handle the deletion of a contact
 * when the delete button is clicked. It finds the name of the currently displayed contact,
 * removes all corresponding contact items from the list, removes any resulting empty groups,
 * and clears the contact details view.
 */
function bindDeleteButton() {
  document
    .querySelector(".contacts-right-bottom")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest("#deleteBtn");
      if (!btn) return;
      const name = document.querySelector(".details-name")?.textContent;

      document.querySelectorAll(".contact-item").forEach((item) => {
        if (item.dataset.name === name) item.remove();
      });
      document.querySelectorAll(".contact-group").forEach((group) => {
        if (!group.querySelector(".contact-item")) group.remove();
      });
      document.querySelector(".contacts-right-bottom").innerHTML = "";

      deleteContactFromLocalStorage(name);
    });
}

/**
 * Adds a click event listener to the document to detect clicks on the "Edit" button
 * in the contact details view and calls the `startEditMode` function.
 */
function bindEditButton() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#edit")) return;
    startEditMode();
  });
}

/**
 * Removes the old contact element from the UI and adds a new contact element
 * with the updated information into the correct alphabetical group.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email address of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @param {HTMLElement} list - The container for the contact groups.
 * @param {HTMLElement} oldItem - The DOM element of the contact being edited.
 */
function updateEditedContact(name, email, phone, list, oldItem) {
  const oldGroup = oldItem.closest(".contact-group");
  oldGroup.removeChild(oldItem);
  if (!oldGroup.querySelector(".contact-item")) oldGroup.remove();
  createContactElement(name, email, phone, list);
}

/**
 * A helper function to get the trimmed value of an input element by its ID.
 * @param {string} id - The ID of the input element.
 * @returns {string} The trimmed value of the input element.
 */
function getValue(id) {
  return document.getElementById(id).value.trim();
}
