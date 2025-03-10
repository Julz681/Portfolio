//colors for the avatars depending on the letter
const letterColors = {
  A: "#D32F2F",
  B: "#C2185B",
  C: "#7B1FA2",
  D: "#512DA8",
  E: "#1976D2",
  F: "#0288D1",
  G: "#00796B",
  H: "#388E3C",
  I: "#689F38",
  J: "#F57C00",
  K: "#E64A19",
  L: "#5D4037",
  M: "#455A64",
  N: "#263238",
  O: "#D81B60",
  P: "#8E24AA",
  Q: "#673AB7",
  R: "#303F9F",
  S: "#0288D1",
  T: "#0097A7",
  U: "#00796B",
  V: "#388E3C",
  W: "#689F38",
  X: "#F57C00",
  Y: "#E64A19",
  Z: "#5D4037",
};

//is called as soon as the HTML page has been completely loaded
document.addEventListener("DOMContentLoaded", () => {
  //...to set the avatar colors.
  setAvatarColorsByInitials();
  //...to enable click events for contacts.
  initContactClickEvents();
});

// Set avatar background color based on the first letter of the name
function setAvatarColorsByInitials() {
  // Select all avatar elements
  const avatars = document.querySelectorAll(".contact-avatar");

  // Loop through each avatar
  avatars.forEach((avatar) => {
    // Get the contact name from the data attribute
    const name = avatar.dataset.name;

    // Extract the first letter and convert to uppercase
    const initial = name.trim().charAt(0).toUpperCase();

    // Get the corresponding color or default to gray
    const color = letterColors[initial] || "#999";

    // Apply the background color to the avatar
    avatar.style.backgroundColor = color;
  });
}

// Initialize click events for contact items
function initContactClickEvents() {
  // Select all contact items
  const contactItems = document.querySelectorAll(".contact-item");

  // Loop through each contact item
  contactItems.forEach((item) => {
    // Add click event listener
    item.addEventListener("click", () => {
      // Remove "selected" class from all previously selected contacts
      document
        .querySelectorAll(".contact-item.selected")
        .forEach((selected) => {
          selected.classList.remove("selected");
        });

      // Add "selected" class to the clicked contact item
      item.classList.add("selected");

      // Get contact details from data attributes
      const name = item.dataset.name;
      const email = item.dataset.email;
      const phone = item.dataset.phone;

      // Display the contact details in the UI
      displayContactDetails(name, email, phone);
    });
  });
}

// Display contact details in the details panel
function displayContactDetails(name, email, phone) {
  // Get the first initial and convert to uppercase
  const initial = name.trim().charAt(0).toUpperCase();

  // Get the avatar color based on the initial or use default gray
  const avatarColor = letterColors[initial] || "#999";

  // Generate the HTML structure for contact details
  const detailsHtml = `
    <div class="contact-details-card">
      <div class="contact-header">
        <div class="contact-avatar-large" style="background-color:${avatarColor};">
          ${initial}${getSecondInitial(name)}
        </div>
        <div class="name-action-alignment">
          <h3 class="details-name">${name}</h3>
          <div class="contact-details-actions-containter">
            <div class="contact-details-actions-1">
              <button id="edit">
                <img class="actions-img" src="/assets/img/edit.png" alt="edit">
                Edit
              </button>
            </div>
            <div class="contact-details-actions-2">
              <button id="deleteBtn">
                <img class="actions-img" src="/assets/img/delete.png" alt="delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="details-label">Contact Information</div>
      <div class="details-info">
        <div>
          <strong>Email</strong>
          <br><br>
          <a class="email-address" href="mailto:${email}">${email}</a>
        </div>
        <div>
          <strong>Phone</strong>
          <br><br>
          ${phone}
        </div>
      </div>
    </div>
  `;

  // Select the container where the contact details will be displayed
  const container = document.querySelector(".contacts-right-bottom");

  // Remove and re-trigger the animation for smooth transition
  container.classList.remove("slide-in");
  void container.offsetWidth; // Force reflow for animation reset
  container.innerHTML = detailsHtml;
  container.classList.add("slide-in");
}

// Get the second initial from a full name
function getSecondInitial(fullName) {
  // Split the name into parts by spaces
  const parts = fullName.trim().split(" ");

  // If there is more than one word, return the first letter of the second word
  if (parts.length > 1) {
    return parts[1].charAt(0).toUpperCase();
  }

  // Return an empty string if there is no second word
  return "";
}

// Select elements for opening and closing the contact overlay
const openBtn = document.getElementById("openAddContact");
const overlay = document.getElementById("addContactOverlay");
const cancelBtn = document.getElementById("cancelAddContact");
const createBtn = document.getElementById("createContact");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");

// Open the contact overlay when the "Add Contact" button is clicked
openBtn.addEventListener("click", () => {
  overlay.classList.add("open");
});

// Close the overlay when the "Cancel" button is clicked
cancelBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

// Close the overlay when clicking outside of it
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("open");
  }
});

// Close the overlay when clicking the close button
closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

// Sort contacts alphabetically within their respective groups and reorder groups
function sortContacts() {
  // Select the main contact list container
  const contactList = document.getElementById("contactList");

  // Get all contact groups (each representing a letter section)
  const groups = Array.from(
    contactList.getElementsByClassName("contact-group")
  );

  // Loop through each group to sort the contacts inside
  groups.forEach((group) => {
    // Get all contacts within the current group
    const contacts = Array.from(group.getElementsByClassName("contact-item"));

    // Sort contacts alphabetically by their "data-name" attribute
    contacts.sort((a, b) => {
      const nameA = a.getAttribute("data-name").toUpperCase();
      const nameB = b.getAttribute("data-name").toUpperCase();
      return nameA.localeCompare(nameB);
    });

    // Reorder contacts inside the group
    contacts.forEach((contact) => {
      group.removeChild(contact);
      group.appendChild(contact);
    });
  });

  // Sort groups alphabetically by their letter header
  groups.sort((a, b) => {
    const letterA = a
      .querySelector(".contact-group-letter")
      .textContent.trim()
      .toUpperCase();
    const letterB = b
      .querySelector(".contact-group-letter")
      .textContent.trim()
      .toUpperCase();
    return letterA.localeCompare(letterB);
  });

  // Reorder the groups inside the contact list
  groups.forEach((group) => {
    contactList.removeChild(group);
    contactList.appendChild(group);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("error-message").style.display = "none";
});

document
  .getElementById("createContact")
  .addEventListener("click", function (e) {
    e.preventDefault();

    const nameField = document.getElementById("contactName");
    const emailField = document.getElementById("contactEmail");
    const phoneField = document.getElementById("contactPhone");
    const overlay = document.getElementById("addContactOverlay");
    const errorMessage = document.getElementById("error-message");

    const updatedName = nameField.value.trim();
    const updatedEmail = emailField.value.trim();
    const updatedPhone = phoneField.value.trim();

    if (!updatedName || !updatedEmail || !updatedPhone) {
      errorMessage.style.display = "block";
      overlay.classList.add("open");
      return;
    }

    errorMessage.style.display = "none";

    const contactList = document.getElementById("contactList");

    if (isEditing && currentEditingContact) {
      const oldName = currentEditingContact.getAttribute("data-name");
      if (oldName !== updatedName) {
        const parentGroup = currentEditingContact.closest(".contact-group");
        parentGroup.removeChild(currentEditingContact);

        if (parentGroup.querySelectorAll(".contact-item").length === 0) {
          contactList.removeChild(parentGroup);
        }
      }

      createContactElement(
        updatedName,
        updatedEmail,
        updatedPhone,
        contactList
      );

      sortContacts();

      isEditing = false;
      currentEditingContact = null;
    } else {
      createContactElement(
        updatedName,
        updatedEmail,
        updatedPhone,
        contactList
      );

      sortContacts();
      initContactClickEvents();
    }

    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";

    overlay.classList.remove("open");
  });

function createContactElement(name, email, phone, contactList) {
  const groupLetter = name.charAt(0).toUpperCase();
  let initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  const contactItem = document.createElement("div");
  contactItem.classList.add("contact-item");
  contactItem.setAttribute("data-name", name);
  contactItem.setAttribute("data-email", email);
  contactItem.setAttribute("data-phone", phone);

  const contactAvatar = document.createElement("div");
  contactAvatar.classList.add("contact-avatar");
  contactAvatar.setAttribute("data-name", name);
  contactAvatar.textContent = initials;
  contactAvatar.style.backgroundColor = letterColors[groupLetter] || "#000";

  const contactDetails = document.createElement("div");
  contactDetails.classList.add("contact-details");

  const contactNameDiv = document.createElement("div");
  contactNameDiv.classList.add("contact-name");
  contactNameDiv.textContent = name;

  const contactEmailDiv = document.createElement("div");
  contactEmailDiv.classList.add("contact-email");
  contactEmailDiv.textContent = email;

  contactDetails.appendChild(contactNameDiv);
  contactDetails.appendChild(contactEmailDiv);
  contactItem.appendChild(contactAvatar);
  contactItem.appendChild(contactDetails);

  let groupElement = null;
  const groups = contactList.getElementsByClassName("contact-group");

  for (let i = 0; i < groups.length; i++) {
    const letterDiv = groups[i].querySelector(".contact-group-letter");
    if (letterDiv && letterDiv.textContent.trim() === groupLetter) {
      groupElement = groups[i];
      break;
    }
  }

  if (!groupElement) {
    groupElement = document.createElement("div");
    groupElement.classList.add("contact-group");

    const groupLetterDiv = document.createElement("div");
    groupLetterDiv.classList.add("contact-group-letter");
    groupLetterDiv.textContent = groupLetter;

    groupElement.appendChild(groupLetterDiv);
    contactList.appendChild(groupElement);
  }

  groupElement.appendChild(contactItem);

  document.querySelectorAll(".contact-item.selected").forEach((selected) => {
    selected.classList.remove("selected");
  });

  contactItem.classList.add("selected");

  displayContactDetails(name, email, phone);

  initContactClickEvents();
}

document.addEventListener("DOMContentLoaded", () => {
  const nameField = document.getElementById("contactName");
  const emailField = document.getElementById("contactEmail");
  const phoneField = document.getElementById("contactPhone");

  function autofillAllFields() {
    if (
      !nameField.value.trim() &&
      !emailField.value.trim() &&
      !phoneField.value.trim()
    ) {
      nameField.value = "Mark Zuckerberg";
      emailField.value = "mark@facebook.com";
      phoneField.value = "+1 650 550 450 ";
    }

    nameField.removeEventListener("focus", autofillAllFields);
    emailField.removeEventListener("focus", autofillAllFields);
    phoneField.removeEventListener("focus", autofillAllFields);
  }

  nameField.addEventListener("focus", autofillAllFields);
  emailField.addEventListener("focus", autofillAllFields);
  phoneField.addEventListener("focus", autofillAllFields);
});

document.addEventListener("DOMContentLoaded", () => {
  const nameField = document.getElementById("contactName");
  const emailField = document.getElementById("contactEmail");
  const phoneField = document.getElementById("contactPhone");
  const errorMessage = document.getElementById("error-message");

  function checkInputs() {
    if (
      nameField.value.trim() &&
      emailField.value.trim() &&
      phoneField.value.trim()
    ) {
      errorMessage.style.display = "none";
    }
  }

  nameField.addEventListener("input", checkInputs);
  emailField.addEventListener("input", checkInputs);
  phoneField.addEventListener("input", checkInputs);
});

document.addEventListener("DOMContentLoaded", function () {
  const detailsContainer = document.querySelector(".contacts-right-bottom");

  detailsContainer.addEventListener("click", function (e) {
    const deleteButton = e.target.closest("button#deleteBtn");
    if (!deleteButton) {
      return;
    }

    e.preventDefault();

    const detailsNameElement = detailsContainer.querySelector(".details-name");
    if (!detailsNameElement) {
      return;
    }
    const contactName = detailsNameElement.textContent.trim();

    const contactList = document.getElementById("contactList");
    const contactItems = contactList.querySelectorAll(".contact-item");
    contactItems.forEach(function (item) {
      if (item.getAttribute("data-name") === contactName) {
        item.remove();
      }
    });

    const groups = contactList.querySelectorAll(".contact-group");
    groups.forEach(function (group) {
      if (group.querySelectorAll(".contact-item").length === 0) {
        group.remove();
      }
    });

    detailsContainer.innerHTML = "";
  });
});

let contacts = [];
let isEditing = false;
let currentEditingContact = null;

document.addEventListener("click", function (e) {
  const editBtn = e.target.closest("#edit");
  if (!editBtn) return;

  e.preventDefault();

  const selectedContact = document.querySelector(".contact-item.selected");
  if (!selectedContact) {
    return;
  }

  const detailsContainer = document.querySelector(".contacts-right-bottom");
  if (!detailsContainer) return;

  const detailsNameEl = detailsContainer.querySelector(".details-name");
  const emailEl = detailsContainer.querySelector(".email-address");
  if (!detailsNameEl || !emailEl) return;

  const contactName = detailsNameEl.textContent.trim();
  const contactEmail = emailEl.textContent.trim();

  const infoDivs = detailsContainer.querySelectorAll(".details-info > div");
  let phoneText = "";
  if (infoDivs.length > 1) {
    phoneText = infoDivs[1].textContent.trim();
  }

  const overlay = document.getElementById("addContactOverlay");
  if (!overlay) {
    return;
  }
  overlay.classList.add("open");

  document.getElementById("contactName").value = contactName;
  document.getElementById("contactEmail").value = contactEmail;
  document.getElementById("contactPhone").value =
    phoneText.match(/\+?\d[\d ]+/g)?.[0] || "";

  const overlayTitle = document.getElementById("overlayTitle");
  const overlayDescription = document.getElementById("overlayDescription");

  if (overlayTitle) {
    overlayTitle.textContent = "Edit Contact";
  }

  if (overlayDescription) {
    overlayDescription.style.display = "none";
  }

  const submitBtn = document.getElementById("createContact");
  const cancelBtn = document.getElementById("cancelAddContact");

  if (submitBtn) {
    submitBtn.textContent = "Save \u2714";
  }

  if (cancelBtn) {
    cancelBtn.offsetWidth;
    setTimeout(() => {
      cancelBtn.style.marginLeft = "-75px";
    }, 50);
  }

  isEditing = true;
  currentEditingContact = selectedContact;

  function resetOverlay() {
    if (overlayTitle) {
      overlayTitle.textContent = "Add Contact";
    }

    if (overlayDescription) {
      overlayDescription.style.display = "block";
    }

    if (submitBtn) {
      submitBtn.textContent = "Create Contact \u2714";
    }

    if (cancelBtn) {
      cancelBtn.style.marginLeft = "0px";
    }

    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactPhone").value = "";

    isEditing = false;
    currentEditingContact = null;
  }

  document
    .getElementById("createContact")
    .addEventListener("click", function () {
      setTimeout(() => {
        resetOverlay();
      }, 200);
    });

  cancelBtn.addEventListener("click", function () {
    resetOverlay();
  });
});
