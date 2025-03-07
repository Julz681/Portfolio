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

document.addEventListener("DOMContentLoaded", () => {
  setAvatarColorsByInitials();
  initContactClickEvents();
 
});

function setAvatarColorsByInitials() {
  const avatars = document.querySelectorAll(".contact-avatar");
  avatars.forEach((avatar) => {
    const name = avatar.dataset.name;
    const initial = name.trim().charAt(0).toUpperCase();
    const color = letterColors[initial] || "#999";
    avatar.style.backgroundColor = color;
  });
}

function initContactClickEvents() {
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".contact-item.selected")
        .forEach((selected) => {
          selected.classList.remove("selected");
        });
      item.classList.add("selected");
      const name = item.dataset.name;
      const email = item.dataset.email;
      const phone = item.dataset.phone;
      displayContactDetails(name, email, phone);
    });
  });
}

function displayContactDetails(name, email, phone) {
  const initial = name.trim().charAt(0).toUpperCase();
  const avatarColor = letterColors[initial] || "#999";

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
              <button>
                <img class="actions-img" src="/assets/img/edit.png" alt="edit">
                Edit
              </button>
            </div>
            <div class="contact-details-actions-2">
              <button>
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

  const container = document.querySelector(".contacts-right-bottom");

  container.classList.remove("slide-in");
  void container.offsetWidth;
  container.innerHTML = detailsHtml;
  container.classList.add("slide-in");
}

function getSecondInitial(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length > 1) {
    return parts[1].charAt(0).toUpperCase();
  }
  return "";
}

const openBtn = document.getElementById("openAddContact");
const overlay = document.getElementById("addContactOverlay");
const cancelBtn = document.getElementById("cancelAddContact");
const createBtn = document.getElementById("createContact");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");

openBtn.addEventListener("click", () => {
  overlay.classList.add("open");
});

cancelBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

createBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("open");
  }
});

closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("open");
});

function sortContacts() {
  const contactList = document.getElementById("contactList");

  const groups = Array.from(
    contactList.getElementsByClassName("contact-group")
  );

  groups.forEach((group) => {
    const contacts = Array.from(group.getElementsByClassName("contact-item"));
    contacts.sort((a, b) => {
      const nameA = a.getAttribute("data-name").toUpperCase();
      const nameB = b.getAttribute("data-name").toUpperCase();
      return nameA.localeCompare(nameB);
    });

    contacts.forEach((contact) => {
      group.removeChild(contact);
      group.appendChild(contact);
    });
  });

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

  groups.forEach((group) => {
    contactList.removeChild(group);
    contactList.appendChild(group);
  });
}

document
  .getElementById("createContact")
  .addEventListener("click", function (e) {
    e.preventDefault();  

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();

    const errorMessage = document.getElementById("error-message");
    const createBtn = document.getElementById("createContact");
    const overlay = document.getElementById("addContactOverlay");  

   
    if (!name || !email || !phone) {
      createBtn.disabled = true; 
      errorMessage.style.display = "block"; 
      
      return;  
    } else {
      errorMessage.style.display = "none";  
      createBtn.disabled = false;  
    }

    // Hier wird der Kontakt nur erstellt, wenn alle Felder ausgefüllt sind
    if (name && email && phone) {
      // Code für die Erstellung des Kontakts
      const groupLetter = name.charAt(0).toUpperCase();
      let initials = name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
      initials = initials.length > 2 ? initials.slice(0, 2) : initials;

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

      const contactList = document.getElementById("contactList");

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

      sortContacts();

      document.getElementById("contactName").value = "";
      document.getElementById("contactEmail").value = "";
      document.getElementById("contactPhone").value = "";

      initContactClickEvents();

      setTimeout(() => {
        contactItem.click();
      }, 200);
    }
  });

 


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
      phoneField.value = "+1 650-543-4800";
    }

    nameField.removeEventListener("focus", autofillAllFields);
    emailField.removeEventListener("focus", autofillAllFields);
    phoneField.removeEventListener("focus", autofillAllFields);
  }

  nameField.addEventListener("focus", autofillAllFields);
  emailField.addEventListener("focus", autofillAllFields);
  phoneField.addEventListener("focus", autofillAllFields);
});
