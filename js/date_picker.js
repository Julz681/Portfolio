// initializes the calendar field (Flatpickr) for the due date
// function setupDatePicker() {
//   if (window.flatpickr) {
//     flatpickr("#due-date", {
//       dateFormat: "d/m/Y",
//       allowInput: true,
//       disableMobile: true,
//     });
//   }
// }

function setupAllDatePickers() {
  const datePickerIDs = [
    "#due-date",
    "#due-date-add-task",
    "#due-date-form",
  ];

  if (!window.flatpickr) return;

  datePickerIDs.forEach((selector) => {
    const element = document.querySelector(selector);
    let id = selector.replace("#", "");
    if (element) {
      fp = flatpickr(selector, {
        dateFormat: "d/m/Y",
        altFormat: "d/m/Y",
        altInput: true,
        allowInput: false,
        disableMobile: true,
        minDate: new Date().fp_incr(0),
        maxDate: new Date().fp_incr(365),
        onOpen: function () {
          if (!suppressEvents) checkDateInput(id);
        },
        onChange: function () {
          if (!suppressEvents) checkDateInput(id);
        },
        onValueUpdate: function () {
          if (!suppressEvents) checkDateInput(id);
        },
      });
    }
  });
}


// date input validation

function checkDateInput(containerId) {
  let dateInput = getInputContainer(containerId);
  let dateInputValue = getInputValue(dateInput);
  let requiredErrorContainerRef;
  let invalidInputErrorContainerRef;
  let dateFormatErrorContainerRef;
  if (containerId === "due-date-add-task" || containerId === "due-date-form") {
    requiredErrorContainerRef = getErrorContainer("due-date-required-error-message");
    invalidInputErrorContainerRef = getErrorContainer("due-date-time-error-message");
    dateFormatErrorContainerRef = getErrorContainer("date-format-error-message");
  } else {
    requiredErrorContainerRef = getErrorContainer("due-date-edit-required-error-message");
    invalidInputErrorContainerRef = getErrorContainer("due-date-edit-time-error-message");
    dateFormatErrorContainerRef = getErrorContainer("due-date-edit-format-error-message");
  }
  let formattedDateValue = formatDateValue(dateInputValue).setHours(0, 0, 0, 0);
  let currentDate = new Date().setHours(0, 0, 0, 0);
  if (checkDateValueValidity(dateInputValue, requiredErrorContainerRef, dateFormatErrorContainerRef, invalidInputErrorContainerRef)) {
    return;
  } else if (
    checkFormattedDateValue(formattedDateValue, invalidInputErrorContainerRef, requiredErrorContainerRef, dateFormatErrorContainerRef, currentDate)) {
    return;
  } else {
    removeAllDateErrorUserInteractions(requiredErrorContainerRef, dateFormatErrorContainerRef, invalidInputErrorContainerRef);
  }
}

function checkDateValueValidity(dateInputValue, requiredErrorContainerRef, dateFormatErrorContainerRef, invalidInputErrorContainerRef) {
  if (dateInputValue.length === 0) {
    fp.altInput.classList.add("task-input-fields-invalid");
    showErrorMessage(requiredErrorContainerRef);
    removeDateValueErrorMessages(dateFormatErrorContainerRef, invalidInputErrorContainerRef);
    return true;
  } else if (!dateFormat.test(dateInputValue)) {
    fp.altInput.classList.add("task-input-fields-invalid");
    showErrorMessage(dateFormatErrorContainerRef);
    removeErrorMessage(requiredErrorContainerRef);
    removeErrorMessage(invalidInputErrorContainerRef);
    return true;
  }
}

function checkFormattedDateValue(formattedDateValue, invalidInputErrorContainerRef, requiredErrorContainerRef, dateFormatErrorContainerRef, currentDate) {
  if (formattedDateValue < currentDate || formattedDateValue == currentDate) {
    showErrorMessage(invalidInputErrorContainerRef);
    removeErrorMessage(requiredErrorContainerRef);
    removeErrorMessage(dateFormatErrorContainerRef);
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

function removeAllDateErrorUserInteractions(
  requiredErrorContainerRef,
  dateFormatErrorContainerRef,
  invalidInputErrorContainerRef
) {
  fp.altInput.classList.remove("task-input-fields-invalid");
  removeErrorMessage(requiredErrorContainerRef);
  removeDateValueErrorMessages(dateFormatErrorContainerRef, invalidInputErrorContainerRef);
  removeValueErrorStylingOnInput(fp.altInput);
}

function removeDateValueErrorMessages(dateFormatErrorContainerRef, invalidInputErrorContainerRef) {
  removeErrorMessage(dateFormatErrorContainerRef);
  removeErrorMessage(invalidInputErrorContainerRef);
}

window.addEventListener("DOMContentLoaded", () => {
  // setupDatePicker();
  setupAllDatePickers();
});



