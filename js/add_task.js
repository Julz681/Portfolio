async function init() {
    initDatePicker();
    await includeHTML();
}

async function includeHTML() {
    let generalFrameRef = document.getElementById("general-frame");
    let generalFrameFile = generalFrameRef.getAttribute("w3-include-html");
    await fetchFile(generalFrameRef, generalFrameFile);
}

async function fetchFile(element, file) {
    if (!file) return;
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error("Page not found.");
        }
        element.innerHTML = await response.text();
    } catch (error) {
        element.innerHTML = error.message;
    } finally {
        element.removeAttribute("w3-include-html");
    }
}

function checkTitleInputValue(requiredErrorContainerId, valueSizeErrorContainerId,  containerId) {
    let requiredErrorContainer = getErrorContainer(`${requiredErrorContainerId}`);
    let valueSizeErrorContainer = getErrorContainer(`${valueSizeErrorContainerId}`)
    let inputContainer = getInputContainer(`${containerId}`);
    let inputContainerValue = getInputContainerValue(`${containerId}`);     
    titleErrorsHandling(requiredErrorContainer, valueSizeErrorContainer, inputContainer, inputContainerValue);
}

function titleErrorsHandling(requiredErrorContainer, valueSizeErrorContainer, inputContainer, containerValue) {
    if(containerValue.length == 0 || containerValue.length <= 3) {
        showErrorMessage(valueSizeErrorContainer);
        showErrorMessage(requiredErrorContainer);
        addValueErrorStylingOnInput(inputContainer);
    } else if(!isNaN(containerValue) || containerValue === "") {
        showErrorMessage(requiredErrorContainer);
        addValueErrorStylingOnInput(inputContainer);
        removeErrorMessage(valueSizeErrorContainer);
    } else {
        removeErrorMessage(valueSizeErrorContainer);
        removeErrorMessage(requiredErrorContainer);
        removeValueErrorStylingOnInput(inputContainer);
    }
}

function checkDescriptionInput(containerId, valueSizeErrorContainerId) {
    let valueSize = getInputContainerValue(containerId);
    if(valueSize.length <= 3 && valueSize.length > 0) {
        showValueErrorMessage(`${valueSizeErrorContainerId}`)
    } else if (valueSize.length == 0 || valueSize.length > 3) {
        hideValueErrorMessage(`${valueSizeErrorContainerId}`)
    }
}

function getInputContainerValue(containerId) {
    let inputContainer = getInputContainer(containerId);
    let inputContainerValue = getInputValue(inputContainer);
    return inputContainerValue;
}

// TODO : Write function for date input

function checkDateInput(containerId) {
    let dateInput = getInputContainer(containerId);
    let dateInputValue = getInputValue(dateInput);
    
    console.log("Value", dateInputValue);
    let currentDate = new Date();
    if (dateInputValue == currentDate.setHours(0,0,0)) {
        console.log("Date is today");
        
    }
    
}

function showValueErrorMessage (valueSizeErrorContainerId) {
    let errorContainer = getErrorContainer(valueSizeErrorContainerId);
    return showErrorMessage(errorContainer);
}

function hideValueErrorMessage(valueSizeErrorContainerId) {
    let errorContainer = getErrorContainer(valueSizeErrorContainerId);
    return removeErrorMessage(errorContainer);
}

function getInputContainer(id) {
    return document.getElementById(id)
}

function getInputValue(inputContainer) {
    return inputContainer.value;
}

function getErrorContainer (id) {
    return document.getElementById(id);
}

function showErrorMessage(errorContainer) {
    if(errorContainer.classList.contains("d_none")) {
        errorContainer.classList.remove("d_none");
    }
}

function addValueErrorStylingOnInput(inputContainer) {
    if(!inputContainer.classList.contains("task-input-fields-invalid")) {
        inputContainer.classList.add("task-input-fields-invalid");
    }
}

function removeErrorMessage(errorContainer) {
    if(!errorContainer.classList.contains("d_none")) {
        errorContainer.classList.add("d_none");
    }
}

function removeValueErrorStylingOnInput(inputContainer) {
    if(inputContainer.classList.contains("task-input-fields-invalid")) {
        inputContainer.classList.remove("task-input-fields-invalid");
    }
}

function initDatePicker() {
    flatpickr("#due-date", {
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "d/m/Y",
        allowInput: true,
        onOpen: function() {
            checkDateInput("due-date");
        },
        onChange: function() {
            checkDateInput("due-date");
        }
    });
}

//commented out, because the header and sidebar would disappear - because of w3 include


// import { db } from "../firebase/firebase.js";  // Import Firestore database
// import { collection, addDoc } from "firebase/firestore";  // Import Firestore functions

// // Wait until the page is fully loaded before executing the script
// document.addEventListener("DOMContentLoaded", function () {
  
//   // Add an event listener for the task form submission
//   document.querySelector(".add-task-form").addEventListener("submit", async function (event) {
//       event.preventDefault(); // Prevent the page from reloading after form submission

//       // Get form data from input fields
//       const title = document.getElementById("task-title").value; // Task title
//       const description = document.getElementById("task-description").value; // Task description
//       const dueDate = document.getElementById("due-date").value; // Due date
//       const priority = document.querySelector(".priority-labels.selected")?.id || "low"; // Task priority (default is "low")
      
//       // Get assigned contacts from the selected users in the form
//       const assignedTo = Array.from(document.querySelectorAll(".single-contact-wrapper.selected span:nth-child(2)"))
//                               .map(el => el.textContent);
      
//       const category = document.getElementById("category").value; // Task category
      
//       // Get subtasks from input field (splitting by commas)
//       const subtasks = document.getElementById("subtasks").value
//                         .split(",") // Convert string into an array
//                         .map(sub => ({ name: sub.trim(), done: false })); // Store each subtask as an object

//       // Create a task object to be stored in Firestore
//       const newTask = {
//         title,
//         description,
//         dueDate,
//         priority,
//         assignedTo,
//         category,
//         subtasks
//       };

//       try {
//         // Save the task in Firestore under the "tasks" collection
//         await addDoc(collection(db, "tasks"), newTask);
//         console.log(`Task saved: ${title}`); // Log success message
//         alert("Task successfully saved!"); // Show success alert

//         // Reset the form after successful submission
//         document.querySelector(".add-task-form").reset();
//       } catch (error) {
//         console.error("Error while saving task:", error); // Log error if saving fails
//       }
//   });
// });

