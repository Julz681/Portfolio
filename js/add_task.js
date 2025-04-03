let dateFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // Regular expression for dd/mm/yyyy format

async function init() {
  //  initDatePicker();
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

function changePriorityColor(prioritySVG){
  let label = document.getElementById(${priority});
  let priorityIcon = label.childNodes;
  switch(priority){
    case 'urgent':
     for(let i = 0; i < icon.length; i++) {
       icon[i].style.fill = '581845';
     }
      break;
  }
  
}

function checkDateInput(containerId) {
    let dateInput = getInputContainer(containerId);
    let dateInputValue = getInputValue(dateInput);
    let requiredErrorContainerRef = getErrorContainer("due-date-required-error-message");
    let invalidInputErrorContainerRef = getErrorContainer("due-date-time-error-message");
    let dateFormatErrorContainerRef = getErrorContainer("date-format-error-message");
    let formattedDateValue = formatDateValue(dateInputValue).setHours(0,0,0,0);
    let currentDate = new Date().setHours(0,0,0,0);
    // if(dateInputValue.length === 0) {
    //     showErrorMessage(requiredErrorContainerRef);
    //     fp.altInput.classList.add("task-input-fields-invalid");
    // }
    // else if (!dateFormat.test(dateInputValue )) {
    //     showErrorMessage(dateFormatErrorContainerRef);
    //     fp.altInput.classList.add("task-input-fields-invalid");
    // } 
    // else if (formattedDateValue < currentDate|| formattedDateValue == currentDate) {
    //     showErrorMessage(invalidInputErrorContainerRef);
    //     fp.altInput.classList.add("task-input-fields-invalid");
    // } else {
    //     fp.altInput.classList.remove("task-input-fields-invalid");
    //     removeErrorMessage(requiredErrorContainerRef);
    //     removeErrorMessage(dateFormatErrorContainerRef);
    //     removeErrorMessage(invalidInputErrorContainerRef);
    // }
    if(checkDateValueValidity(dateInputValue, requiredErrorContainerRef, dateFormatErrorContainerRef)) {
        return
    } else if (checkFormattedDateValue(formattedDateValue, invalidInputErrorContainerRef, currentDate)) {
        return
    }
    else {
        fp.altInput.classList.remove("task-input-fields-invalid");
        removeErrorMessage(requiredErrorContainerRef);
        removeErrorMessage(dateFormatErrorContainerRef);
        removeErrorMessage(invalidInputErrorContainerRef);
        removeValueErrorStylingOnInput(fp.altInput);
    }    
}

function checkDateValueValidity(dateInputValue, requiredErrorContainerRef, dateFormatErrorContainerRef) {
    if(dateInputValue.length === 0) {
        fp.altInput.classList.add("task-input-fields-invalid");
        showErrorMessage(requiredErrorContainerRef);
        return true;
    }
    else if (!dateFormat.test(dateInputValue )) {
        fp.altInput.classList.add("task-input-fields-invalid");
        showErrorMessage(dateFormatErrorContainerRef);
        return true;
    }
}

function checkFormattedDateValue(formattedDateValue, invalidInputErrorContainerRef, currentDate) {
    if (formattedDateValue < currentDate|| formattedDateValue == currentDate) {
        showErrorMessage(invalidInputErrorContainerRef);
        fp.altInput.classList.add("task-input-fields-invalid");
        return true;
    }
}

function formatDateValue(dateInputValue) {
    let dateParts = dateInputValue.split("/");
    let day = dateParts[0];
    let month = dateParts[1];
    let year = dateParts[2];
    return new Date(year, month - 1, day);
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

//function initDatePicker() {
//    const fp = flatpickr("#due-date", {
//        dateFormat: "d/m/Y",
//        altInput: true,
//        altFormat: "d/m/Y",
//        allowInput: true,
//        onOpen: function() {
//            checkDateInput("due-date");
//        },
//        onChange: function() {
//            checkDateInput("due-date");
//        }
//    });
//}

const fp = flatpickr("#due-date", {
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

