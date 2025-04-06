




// NOT YET ADAPTED TO THE CHANGES.
// ADAPTED IN THE NEXT DAYS!




// show the contacts right - responsive
window.addEventListener("DOMContentLoaded", () => {
    const contactItems = document.querySelectorAll(".contact-item");
  
    contactItems.forEach((item) => {
      item.addEventListener("click", () => {
        openContactDetails();
      });
    });
  });
  
  function openContactDetails() {
    const rightBox = document.querySelector(".contacts-right");
    const backBtn = document.querySelector(".mobile-only-goback");
  
    if (rightBox) rightBox.classList.add("show-contact-right");
  
    if (window.innerWidth <= 900 && backBtn) {
      backBtn.classList.add("visible");
    }
  }
  
  // shows the close button only in the mobile version - contacts right
  window.closeContactDetails = function () {
    const rightBox = document.querySelector(".contacts-right");
    const backBtn = document.querySelector(".mobile-only-goback");
  
    if (rightBox) rightBox.classList.remove("show-contact-right");
  
    if (window.innerWidth <= 900 && backBtn) {
      backBtn.classList.remove("visible");
    }
    updateFloatingButtons();
  };
  
  // update buttons for mobile and edit mode
  function updateFloatingButtons() {
    const right = document.querySelector(".contacts-right");
    const addBtn = document.getElementById("openAddContact");
    const dotsBtn = document.getElementById("menuDotsBtn");
    const dropup = document.getElementById("dropupMenu");
    const cancelBtn = document.getElementById("cancelAddContact");
  
    const isMobile = window.innerWidth < 900;
    const isEditMode = cancelBtn?.classList.contains("delete-mode");
    const isOverlayOpen = document
      .getElementById("addContactOverlay")
      ?.classList.contains("open");
    const showContact = right?.classList.contains("show-contact-right");
  
    addBtn.style.display = isMobile && showContact ? "none" : "flex";
    dotsBtn.style.display = isMobile && showContact ? "flex" : "none";
    if (!showContact && dropup) dropup.classList.remove("show");
  
    if (cancelBtn && isOverlayOpen) {
      if (isEditMode) {
        cancelBtn.style.display =
          window.innerWidth < 1200 ? "flex" : "inline-flex";
      } else {
        cancelBtn.style.display =
          window.innerWidth < 1200 ? "none" : "inline-flex";
      }
    }
  
    document.querySelector(".mobile-only-goback")?.classList.add("visible");
  }
  
  // show delete button only in edit mode under 1200px
  function showDeleteBtnInEdit(btn) {
    if (!btn) return;
    const editMode = btn.classList.contains("delete-mode");
    const overlayOpen = document
      .getElementById("addContactOverlay")
      ?.classList.contains("open");
    const smallScreen = window.innerWidth < 1200;
    btn.style.display = editMode && overlayOpen && smallScreen ? "flex" : "none";
  }
  
  // toggle menu open/close with animation
  function toggleDropupMenu() {
    const menu = document.getElementById("dropupMenu");
    const right = document.querySelector(".contacts-right");
    if (!right?.classList.contains("show-contact-right")) return;
  
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
      menu.classList.add("hide");
      setTimeout(() => {
        menu.classList.remove("hide");
        menu.style.display = "none";
      }, 250);
    } else {
      menu.style.display = "block";
      requestAnimationFrame(() => menu.classList.add("show"));
    }
  }
  
  // open edit mode and refresh buttons
  function editContact() {
    startEditMode();
    updateFloatingButtons();
  }
  
  // delete contact and return to list
  function deleteContact() {
    const name = document.querySelector(".details-name")?.textContent;
    if (!name) return;
  
    document.querySelectorAll(".contact-item").forEach((i) => {
      if (i.dataset.name === name) i.remove();
    });
    document.querySelectorAll(".contact-group").forEach((g) => {
      if (!g.querySelector(".contact-item")) g.remove();
    });
  
    closeDetailAndMenu();
    updateFloatingButtons();
    if (window.innerWidth < 1200) {
      closeContactDetails();
      document.getElementById("addContactOverlay")?.classList.remove("open");
    }
  }
  
  // closes right view and clears detail content
  function closeDetailAndMenu() {
    document
      .querySelector(".contacts-right")
      ?.classList.remove("show-contact-right");
    document.querySelector(".contacts-right-bottom").innerHTML = "";
  
    const menu = document.getElementById("dropupMenu");
    if (menu?.classList.contains("show")) {
      menu.classList.remove("show");
      menu.classList.add("hide");
      setTimeout(() => {
        menu.classList.remove("hide");
        menu.style.display = "none";
      }, 250);
    }
  }
  
  // close drop-up menu if clicked outside
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("dropupMenu");
    const btn = document.getElementById("menuDotsBtn");
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        menu.classList.add("hide");
        setTimeout(() => {
          menu.classList.remove("hide");
          menu.style.display = "none";
        }, 250);
      }
    }
  });
  
  // open contact detail view
  function openContactDetails() {
    document
      .querySelector(".contacts-right")
      ?.classList.add("show-contact-right");
    updateFloatingButtons();
  }
  
  // close contact detail view
  function closeContactDetails() {
    document
      .querySelector(".contacts-right")
      ?.classList.remove("show-contact-right");
    document.querySelector(".mobile-only-goback")?.classList.remove("visible");
    updateFloatingButtons();
  }
  
  // remove open state from menu at start
  document.getElementById("dropupMenu")?.classList.remove("show");
  
  // update buttons on load and resize
  window.addEventListener("load", updateFloatingButtons);
  window.addEventListener("resize", updateFloatingButtons);
  