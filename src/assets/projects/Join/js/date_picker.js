/**
 * Initializes all Flatpickr date picker fields for various due date inputs.
 * Applies date constraints (min/max), custom formatting, and event handlers to
 * trigger validation whenever the date input is interacted with.
 */
function setupAllDatePickers() {
  const datePickerIDs = [
    "#due-date",
    "#due-date-add-task",
    "#due-date-form",
  ];
  if (!window.flatpickr) return;
  datePickerIDs.forEach((selector) => {
    setupSingleDatePicker(selector);
  });
}

function setupSingleDatePicker(selector) {
  const element = document.querySelector(selector);
  let id = selector.replace("#", "");
  if (element) {
    initFlatpickr(selector, id);
  }
}

function initFlatpickr(selector, id) {
  fp = flatpickr(selector, {
    dateFormat: "d/m/Y",
    altFormat: "d/m/Y",
    altInput: true,
    allowInput: false,
    disableMobile: true,
    minDate: new Date().fp_incr(0),
    maxDate: new Date().fp_incr(365),
    onOpen: function () {
      if (!suppressEvents) checkDateInput(id);},
    onChange: function () {
      if (!suppressEvents) checkDateInput(id);},
    onValueUpdate: function () {
      if (!suppressEvents) checkDateInput(id);},
  });
}

/**
 * Validates the date input field. Handles both "add task" and "edit task" forms by checking:
 * - if the date is empty
 * - if the date format is invalid
 * - if the selected date is in the past or today
 * Applies and removes error messages and styling accordingly.
 *
 * @param {string} containerId - The ID of the container holding the date input field.
 */
function checkDateInput(containerId) {
  let dateInput = getInputContainer(containerId);
  let dateInputValue = getInputValue(dateInput);
  let errorContainers = initializeErrorContainersObject();
  if (containerId === "due-date-add-task" || containerId === "due-date-form") {
    errorContainers = getErrorContainersTaskForm();
  } else {
    errorContainers = getErrorContainersEditForm();
  }
  let formattedDateValue = formatDateValue(dateInputValue).setHours(0, 0, 0, 0);
  let currentDate = new Date().setHours(0, 0, 0, 0);
  if (checkDateValueValidity(dateInputValue, errorContainers.requiredErrorContainerRef, errorContainers.dateFormatErrorContainerRef, errorContainers.invalidInputErrorContainerRef)) return;
  else if (checkFormattedDateValue(formattedDateValue, errorContainers.invalidInputErrorContainerRef, errorContainers.requiredErrorContainerRef, errorContainers.dateFormatErrorContainerRef, currentDate)) return;
  else removeAllDateErrorUserInteractions(errorContainers.requiredErrorContainerRef, errorContainers.dateFormatErrorContainerRef, errorContainers.invalidInputErrorContainerRef);
}

function getErrorContainersTaskForm() {
  return {
    requiredErrorContainerRef: getErrorContainer("due-date-required-error-message"),
    invalidInputErrorContainerRef: getErrorContainer("due-date-time-error-message"),
    dateFormatErrorContainerRef: getErrorContainer("date-format-error-message"),
  }
}

function getErrorContainersEditForm() {
  return {
    requiredErrorContainerRef: getErrorContainer("due-date-edit-required-error-message"),
    invalidInputErrorContainerRef: getErrorContainer("due-date-edit-time-error-message"),
    dateFormatErrorContainerRef: getErrorContainer("due-date-edit-format-error-message"),
  }
}

function initializeErrorContainersObject() {
  return {
    requiredErrorContainerRef: null,
    invalidInputErrorContainerRef: null,
    dateFormatErrorContainerRef: null,
  }
}

/**
 * Checks if the raw date input is valid:
 * - Not empty
 * - Matches the expected dd/mm/yyyy format
 * If invalid, displays appropriate error messages and styling.
 *
 * @param {string} dateInputValue - The raw input value from the user.
 * @param {HTMLElement} requiredErrorContainerRef - Error element for empty input.
 * @param {HTMLElement} dateFormatErrorContainerRef - Error element for invalid format.
 * @param {HTMLElement} invalidInputErrorContainerRef - Error element for other invalid input.
 * @returns {boolean} - True if the input is invalid; false otherwise.
 */
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

/**
 * Validates the parsed date against the current date. If it's today or in the past,
 * shows an error and applies invalid styling.
 *
 * @param {Date} formattedDateValue - The parsed date from user input.
 * @param {HTMLElement} invalidInputErrorContainerRef - Error element for invalid past/today date.
 * @param {HTMLElement} requiredErrorContainerRef - Error element for empty field.
 * @param {HTMLElement} dateFormatErrorContainerRef - Error element for format mismatch.
 * @param {Date} currentDate - The current date, normalized to midnight.
 * @returns {boolean} - True if the date is invalid; false otherwise.
 */
function checkFormattedDateValue(formattedDateValue, invalidInputErrorContainerRef, requiredErrorContainerRef, dateFormatErrorContainerRef, currentDate) {
  if (formattedDateValue < currentDate || formattedDateValue == currentDate) {
    showErrorMessage(invalidInputErrorContainerRef);
    removeErrorMessage(requiredErrorContainerRef);
    removeErrorMessage(dateFormatErrorContainerRef);
    fp.altInput.classList.add("task-input-fields-invalid");
    return true;
  }
}

/**
 * Converts a date string from dd/mm/yyyy to a native JavaScript Date object.
 *
 * @param {string} dateInputValue - The date string in dd/mm/yyyy format.
 * @returns {Date} - Parsed Date object.
 */
function formatDateValue(dateInputValue) {
  let dateParts = dateInputValue.split("/");
  let day = dateParts[0];
  let month = dateParts[1];
  let year = dateParts[2];
  return new Date(year, month - 1, day);
}

/**
 * Clears all date-related error messages and removes any invalid styling
 * from the Flatpickr input.
 *
 * @param {HTMLElement} requiredErrorContainerRef - Error element for empty field.
 * @param {HTMLElement} dateFormatErrorContainerRef - Error element for format mismatch.
 * @param {HTMLElement} invalidInputErrorContainerRef - Error element for invalid value.
 */
function removeAllDateErrorUserInteractions(requiredErrorContainerRef, dateFormatErrorContainerRef, invalidInputErrorContainerRef) {
  fp.altInput.classList.remove("task-input-fields-invalid");
  removeErrorMessage(requiredErrorContainerRef);
  removeDateValueErrorMessages(dateFormatErrorContainerRef, invalidInputErrorContainerRef);
  removeValueErrorStylingOnInput(fp.altInput);
}

/**
 * Hides all error messages related to date format or invalid values.
 *
 * @param {HTMLElement} dateFormatErrorContainerRef - Error element for format issue.
 * @param {HTMLElement} invalidInputErrorContainerRef - Error element for invalid date.
 */
function removeDateValueErrorMessages(dateFormatErrorContainerRef, invalidInputErrorContainerRef) {
  removeErrorMessage(dateFormatErrorContainerRef);
  removeErrorMessage(invalidInputErrorContainerRef);
}

/**
 * Initializes all date pickers when the DOM is fully loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  setupAllDatePickers();
});
