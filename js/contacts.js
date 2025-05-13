window.addEventListener("DOMContentLoaded", () => {
    hideError(); // hide the error message on page load
    setAvatarColors(); // set avatar background colors based on the letters
    bindContactClicks(); // add click events to contact items for selection
    bindOverlayButtons(); // add functionality to open/close the contact overlay
    bindCreateButton(); // enable creating or editing a contact
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
 * Handles the creation of a new contact when the "Create Contact" button is clicked.
 * It prevents the default form submission, gets the values from the input fields,
 * shows an error if any field is empty, hides the error if all are filled,
 * creates a new contact element and adds it to the contact list, resets the overlay,
 * shows a success message on smaller screens, updates floating buttons, and re-binds edit overlay buttons.
 */
function bindCreateButton() {
    document
        .getElementById("createContact")
        .addEventListener("click", function (e) {
            e.preventDefault();
            const name = getValue("contactName");
            const email = getValue("contactEmail");
            const phone = getValue("contactPhone");
            if (!name || !email || !phone) return showError();
            hideError();
            const list = document.getElementById("contactList");
            createContactElement(name, email, phone, list);
            resetOverlay();
            if (window.innerWidth < 900) {
                document
                    .querySelector(".contacts-right")
                    ?.classList.add("show-contact-right");
                showSuccessMessage();
            }
            updateFloatingButtons();
            bindEditOverlayButtons();
        });
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
 * Handles the submission of the edit contact form. It prevents the default submission,
 * gets the updated values, validates them, and if valid, updates the contact in the UI
 * and closes the edit overlay.
 * @param {Event} e - The submit event.
 */
function handleEditSubmit(e) {
    e.preventDefault();
    const name = getValue("editContactName");
    const email = getValue("editContactEmail");
    const phone = getValue("editContactPhone");
    if (!name || !email || !phone) {
        document.getElementById("edit-error-message").style.display = "block";
        return;
    }
    const list = document.getElementById("contactList");
    const currentName =
        document.getElementById("editContactOverlay").dataset.current;

    const selected = [...document.querySelectorAll(".contact-item")].find(
        (i) => i.dataset.name === currentName
    );
    if (!selected) {
        return;
    }
    updateEditedContact(name, email, phone, list, selected);
    closeEditOverlay();
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
 * Closes the edit contact overlay by removing the 'open' class and clearing the 'current' dataset attribute.
 */
function closeEditOverlay() {
    const overlay = document.getElementById("editContactOverlay");
    overlay.classList.remove("open");
    overlay.dataset.current = "";
}

/**
 * A helper function to get the trimmed value of an input element by its ID.
 * @param {string} id - The ID of the input element.
 * @returns {string} The trimmed value of the input element.
 */
function getValue(id) {
    return document.getElementById(id).value.trim();
}

/**
 * Activates an autofill feature for the add contact form. When all input fields
 * are empty and one of them receives focus, it automatically fills them with
 * example data for "Mark Zuckerberg". This action is performed only once.
 */
function enableAutofill() {
  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const phone = document.getElementById("contactPhone");
  if (!name || !email || !phone) return;
  let used = false;
  const fill = () => {
    if (used || name.value || email.value || phone.value) return;
    name.value = "Mark Zuckerberg";
    email.value = "mark@facebook.com";
    phone.value = "+1 650 550 450";
    used = true;
  };
  [name, email, phone].forEach((f) => f.addEventListener("focus", fill));
}

/**
 * Hides the error message in the add contact overlay when all input fields
 * (name, email, phone) have a non-empty value.
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
