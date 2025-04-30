// general variables

let dateFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // Regular expression for dd/mm/yyyy format
let suppressEvents;

const fp = flatpickr("#due-date-task", {
  dateFormat: "d/m/Y",
  altInput: true,
  altFormat: "d/m/Y",
  allowInput: true,
  onOpen: function () {
    if (!suppressEvents) checkDateInput("due-date-task");
  },
  onChange: function () {
    if (!suppressEvents) checkDateInput("due-date-task");
  },
  onValueUpdate: function () {
    if (!suppressEvents) checkDateInput("due-date-task");
  },
});

console.log(fp);

let subtaskArray = [];
let assignees = [];
let searchResults = [];
let newTasks = [];

// title input validation

function checkTitleInputValue(
  requiredErrorContainerId,
  valueSizeErrorContainerId,
  containerId
) {
  let requiredErrorContainer = getErrorContainer(`${requiredErrorContainerId}`);
  let valueSizeErrorContainer = getErrorContainer(
    `${valueSizeErrorContainerId}`
  );
  let inputContainer = getInputContainer(`${containerId}`);
  let inputContainerValue = getInputContainerValue(`${containerId}`);
  titleErrorsHandling(
    requiredErrorContainer,
    valueSizeErrorContainer,
    inputContainer,
    inputContainerValue
  );
}

function titleErrorsHandling(
  requiredErrorContainer,
  valueSizeErrorContainer,
  inputContainer,
  containerValue
) {
  if (containerValue.length == 0 || containerValue.length <= 3) {
    showErrorMessage(valueSizeErrorContainer);
    showErrorMessage(requiredErrorContainer);
    addValueErrorStylingOnInput(inputContainer);
  } else if (!isNaN(containerValue) || containerValue === "") {
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
  if (valueSize.length <= 3 && valueSize.length > 0) {
    showValueErrorMessage(`${valueSizeErrorContainerId}`);
  } else if (valueSize.length == 0 || valueSize.length > 3) {
    hideValueErrorMessage(`${valueSizeErrorContainerId}`);
  }
}

function getInputContainerValue(containerId) {
  let inputContainer = getInputContainer(containerId);
  let inputContainerValue = getInputValue(inputContainer);
  return inputContainerValue;
}

// date input validation

// TODO: give date fcts. less variables?

function checkDateInput(containerId) {
  let dateInput = getInputContainer(containerId);
  let dateInputValue = getInputValue(dateInput);
  let requiredErrorContainerRef = getErrorContainer(
    "due-date-required-error-message"
  );
  let invalidInputErrorContainerRef = getErrorContainer(
    "due-date-time-error-message"
  );
  let dateFormatErrorContainerRef = getErrorContainer(
    "date-format-error-message"
  );
  let formattedDateValue = formatDateValue(dateInputValue).setHours(0, 0, 0, 0);
  let currentDate = new Date().setHours(0, 0, 0, 0);
  if (
    checkDateValueValidity(
      dateInputValue,
      requiredErrorContainerRef,
      dateFormatErrorContainerRef,
      invalidInputErrorContainerRef
    )
  ) {
    return;
  } else if (
    checkFormattedDateValue(
      formattedDateValue,
      invalidInputErrorContainerRef,
      requiredErrorContainerRef,
      dateFormatErrorContainerRef,
      currentDate
    )
  ) {
    return;
  } else {
    removeAllDateErrorUserInteractions(
      requiredErrorContainerRef,
      dateFormatErrorContainerRef,
      invalidInputErrorContainerRef
    );
  }
}

function checkDateValueValidity(
  dateInputValue,
  requiredErrorContainerRef,
  dateFormatErrorContainerRef,
  invalidInputErrorContainerRef
) {
  if (dateInputValue.length === 0) {
    fp.altInput.classList.add("task-input-fields-invalid");
    showErrorMessage(requiredErrorContainerRef);
    removeDateValueErrorMessages(
      dateFormatErrorContainerRef,
      invalidInputErrorContainerRef
    );
    return true;
  } else if (!dateFormat.test(dateInputValue)) {
    fp.altInput.classList.add("task-input-fields-invalid");
    showErrorMessage(dateFormatErrorContainerRef);
    removeErrorMessage(requiredErrorContainerRef);
    removeErrorMessage(invalidInputErrorContainerRef);
    return true;
  }
}

function checkFormattedDateValue(
  formattedDateValue,
  invalidInputErrorContainerRef,
  requiredErrorContainerRef,
  dateFormatErrorContainerRef,
  currentDate
) {
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
  removeDateValueErrorMessages(
    dateFormatErrorContainerRef,
    invalidInputErrorContainerRef
  );
  removeValueErrorStylingOnInput(fp.altInput);
}

function removeDateValueErrorMessages(
  dateFormatErrorContainerRef,
  invalidInputErrorContainerRef
) {
  removeErrorMessage(dateFormatErrorContainerRef);
  removeErrorMessage(invalidInputErrorContainerRef);
}

// priority label color change

function changePriorityLabelColors(priorityLabelId) {
  let priorityLabels = document.getElementsByClassName("priority-labels");
  modifyPriorityLabels(priorityLabels, priorityLabelId);
}

function modifyPriorityLabels(priorityLabels, priorityLabelId) {
  for (let i = 0; i < priorityLabels.length; i++) {
    let currentPriorityLabelId = priorityLabels[i].id;
    let priorityIconParts = getPriorityIconParts(currentPriorityLabelId);
    let priorityColor = getPriorityColor(currentPriorityLabelId);
    if (
      currentPriorityLabelId != priorityLabelId ||
      (currentPriorityLabelId == priorityLabelId &&
        priorityLabels[i].classList.contains(`${priorityLabelId}-prio-bg`))
    ) {
      priorityLabels[i].style.color = "#000000";
      switchPriorityIconColor(priorityIconParts, priorityColor);
      setDefaultBackgroundColorOnPriorityLabel(
        priorityLabels[i],
        currentPriorityLabelId
      );
    } else {
      activatePriorityLabel(
        priorityLabels[i],
        currentPriorityLabelId,
        priorityIconParts
      );
    }
  }
}

function activatePriorityLabel(
  priorityLabelContainerRef,
  priorityLabelId,
  priorityIcon
) {
  priorityLabelContainerRef.style.color = "#ffffff";
  setPriorityBackgroundColor(priorityLabelContainerRef, priorityLabelId);
  switchPriorityIconColor(priorityIcon, "#ffffff");
}

function getPriorityColor(priorityLabelId) {
  switch (priorityLabelId) {
    case "low":
      return "#7AE229";
    case "medium":
      return "#FFA800";
    case "urgent":
      return "#FF3D00";
  }
}

function getPriorityIconParts(priorityLabelId) {
  let prioritySVG = document.getElementById(`${priorityLabelId}-svg`);
  let priorityIconParts = prioritySVG.children;
  return priorityIconParts;
}

function switchPriorityIconColor(priorityIconParts, color) {
  for (let i = 0; i < priorityIconParts.length; i++) {
    priorityIconParts[i].style.fill = color;
  }
}

function setPriorityBackgroundColor(priorityLabel, priorityLabelId) {
  priorityLabel.classList.add(`${priorityLabelId}-prio-bg`, "weight-700");
  priorityLabel.classList.remove("default-prio-bg");
}

function setDefaultBackgroundColorOnPriorityLabel(
  priorityLabel,
  priorityLabelId
) {
  priorityLabel.classList.remove(`${priorityLabelId}-prio-bg`, "weight-700");
  priorityLabel.classList.add("default-prio-bg");
}

// assign-To section

function assignContactToTask(contactId, event) {
  let contactContainerRef = document.getElementById(contactId);
  if (contactContainerRef.classList.contains("single-contact-wrapper")) {
    toggleAssigneesStyling(contactContainerRef);
    assignees.push(
      contactContainerRef.getElementsByTagName("span")[1].innerHTML
    );
  } else {
    toggleAssigneesStyling(contactContainerRef);
    removeAssigneeIfExists(contactContainerRef);
  }
  event.stopPropagation();
}

function toggleAssigneesStyling(assigneeContainer) {
  assigneeContainer.classList.toggle("single-contact-wrapper");
  assigneeContainer.classList.toggle("single-contact-wrapper-checked");
  assigneeContainer.lastElementChild.classList.toggle(
    "single-contact-checkbox-unchecked"
  );
  assigneeContainer.lastElementChild.classList.toggle(
    "single-contact-checkbox-checked"
  );
}

/**
 * This function checks if the value of `contactContainerRef.getElementsByTagName('span')[1].innerHTML`
 * is part of the `assignees` array. If it is, the value is removed from the array.
 * @param {HTMLElement} contactContainerRef The container reference to check.
 */
function removeAssigneeIfExists(contactContainerRef) {
  const contactName =
    contactContainerRef.getElementsByTagName("span")[1].innerHTML;
  const index = assignees.indexOf(contactName);
  if (index !== -1) {
    assignees.splice(index, 1);
  }
}

// search function

function searchUsersToAssign(containerId) {
  let searchValue = getSearchValue();
  searchResults = createSearchResult(searchValue);
  let containerDropdownObject = createContainerObject(containerId);
  if (containerDropdownObject.dropdownContainer.classList.contains("d_none")) {
    toggleInputContainerVisibilities(
      containerDropdownObject.dropdownContainer,
      containerDropdownObject.iconClosed,
      containerDropdownObject.iconOpen
    );
  }
  renderUserSearchResult(searchResults);
}

function getSearchValue() {
  let inputRef = document.getElementById("assigned-to-input");
  let searchValue = inputRef.value.toLowerCase();
  return searchValue;
}

function createSearchResult(searchValue) {
  let results = [];
  for (let index = 0; index < userNames.length; index++) {
    if (
      typeof userNames[index] === "string" &&
      userNames[index].toLowerCase().startsWith(searchValue)
    ) {
      results.push(userNames[index]);
    }
  }
  return results;
}

function renderUserSearchResult(searchResults) {
  let usersListContainerRef = document.getElementById("assigned-to-users-list");
  usersListContainerRef.innerHTML = "";
  for (let index = 0; index < searchResults.length; index++) {
    let stylingObject = checkIsAssigned(searchResults[index]);
    let initials = getInitials(searchResults[index]);
    let iconBackgroundColor = getIconBackgroundColor(initials);
    usersListContainerRef.innerHTML += getUsersToAssignTemplate(
      searchResults[index],
      index,
      stylingObject.wrapperClass,
      stylingObject.checkboxClass,
      initials,
      iconBackgroundColor
    );
  }
}

function checkIsAssigned(value) {
  let isAssigned = assignees.includes(value);
  let wrapperClass = isAssigned
    ? "single-contact-wrapper-checked"
    : "single-contact-wrapper";
  let checkboxClass = isAssigned
    ? "single-contact-checkbox-checked"
    : "single-contact-checkbox-unchecked";
  return (stylingObject = {
    wrapperClass: wrapperClass,
    checkboxClass: checkboxClass,
  });
}

// category section

function selectCategory(categoryId) {
  let categoryContainerRef = getInputContainer(categoryId);
  let selectedCategory = categoryContainerRef.innerHTML;
  let categoryInputContainerRef = document.getElementById("category");
  categoryInputContainerRef.placeholder = selectedCategory;
}

function checkCategoryInputPlaceholder(requiredErrorContainerId) {
  let placeholder = getInputContainer("category").placeholder;
  let dropdownContainerRef = document.getElementById("category-dropdown");
  let errorContainerRef = getErrorContainer(requiredErrorContainerId);
  if (
    placeholder === "Select task category" &&
    dropdownContainerRef.classList.contains("d_none")
  ) {
    showErrorMessage(errorContainerRef);
  } else {
    removeErrorMessage(errorContainerRef);
  }
}

// subtask section

function moveCursorToSubtaskInput() {
  let subtaskInputContainerRef = getInputContainer("subtasks");
  subtaskInputContainerRef.focus();
}

function evaluateSubtaskInput(valueSizeErrorContainerId) {
  let confirmInputIconsRef = document.getElementById("confirm-input-icons");
  let addIconRef = document.getElementById("add-subtask-icon");
  let subtaskInputContainerRef = getInputContainer("subtasks");
  let inputValue = getInputValue(subtaskInputContainerRef);
  if (inputValue.length > 3) {
    switchIconsOnSubtasks(confirmInputIconsRef, addIconRef);
    removeErrorMessageOnSubtaskInput(
      subtaskInputContainerRef.parentElement,
      valueSizeErrorContainerId
    );
  } else if (inputValue.length <= 3 && inputValue.length > 0) {
    falseInputValueHandling(
      confirmInputIconsRef,
      addIconRef,
      valueSizeErrorContainerId,
      subtaskInputContainerRef.parentElement
    );
  } else {
    switchIconsOnSubtasks(addIconRef, confirmInputIconsRef);
    removeErrorMessageOnSubtaskInput(
      subtaskInputContainerRef.parentElement,
      valueSizeErrorContainerId
    );
  }
}

function removeErrorMessageOnSubtaskInput(
  subtaskInputContainer,
  valueSizeErrorContainerId
) {
  removeValueErrorStylingOnInput(subtaskInputContainer);
  hideValueErrorMessage(valueSizeErrorContainerId);
}

function switchIconsOnSubtasks(showIcon1, hideIcon2) {
  showIcon1.classList.remove("d_none");
  hideIcon2.classList.add("d_none");
}

function falseInputValueHandling(
  confirmInputIconsRef,
  addIconRef,
  valueSizeErrorContainerId,
  InputContainerWrapperRef
) {
  confirmInputIconsRef.classList.add("d_none");
  addIconRef.classList.remove("d_none");
  showValueErrorMessage(valueSizeErrorContainerId);
  addValueErrorStylingOnInput(InputContainerWrapperRef);
}

function addSubtask(id, valueSizeErrorContainerId) {
  let input = getInputContainer(id);
  let inputValue = input.value.trim();
  let subtaskNumber = subtaskArray.length;
  let subtaskKey = `subtask-${subtaskNumber}`;
  subtaskArray.push({
    [subtaskKey]: inputValue,
  });
  renderSubtaskList();
  input.value = "";
  evaluateSubtaskInput(valueSizeErrorContainerId);
}

function clearSubtaskInput(id, valueSizeErrorContainerId) {
  let input = getInputContainer(id);
  input.value = "";
  evaluateSubtaskInput(valueSizeErrorContainerId);
}

function enableSubtaskEdit(id) {
  let subtaskInputContainerRef = getInputContainer(id);
  subtaskInputContainerRef.removeAttribute("disabled");
  let listItemContainerRef =
    subtaskInputContainerRef.closest(".subtask-list-item");
  listItemContainerRef.classList.add("subtask-list-item-active");
  listItemContainerRef.classList.remove("subtask-list-item", "br-10");
}

function confirmEditSubtask(id) {
  let subtaskInputContainerRef = getInputContainer(id);
  let subtaskInputValue = getInputValue(subtaskInputContainerRef);
  let subtaskIndex = extractIndex(id);
  subtaskArray[subtaskIndex] = { [id]: subtaskInputValue };
  renderSubtaskList();
}

function extractIndex(id) {
  let index = [];
  for (let i = 0; i < id.length; i++) {
    let char = id[i];
    if (!isNaN(char)) {
      index.push(parseInt(char));
    }
  }
  return index;
}

function deleteSubtask(id) {
  let currentSubtaskIndex = extractIndex(id);
  subtaskArray.splice(currentSubtaskIndex, 1);
  renderSubtaskList();
}

function createSubtaskOnKeyPress(id, event, valueSizeErrorContainerId) {
  if (detectKey(event)) {
    addSubtask(id, valueSizeErrorContainerId);
  }
}

function editSubtaskOnKeyPress(id, event) {
  if (detectKey(event)) {
    confirmEditSubtask(id);
  }
}

function detectKey(event) {
  if (event.key === "Enter") {
    return true;
  }
}

//  render functions

function renderSubtaskList() {
  let subtaskListContainerRef = document.getElementById("subtask-list");
  subtaskListContainerRef.innerHTML = "";
  for (
    let subtaskArrayIndex = 0;
    subtaskArrayIndex < subtaskArray.length;
    subtaskArrayIndex++
  ) {
    let subtaskKey = Object.keys(subtaskArray[subtaskArrayIndex]);
    subtaskListContainerRef.innerHTML += getSubtaskTemplate(
      subtaskArrayIndex,
      subtaskArray[subtaskArrayIndex][subtaskKey]
    );
  }
  subtaskListContainerRef.classList.remove("d_none");
}

function renderAssignees(containerId, container) {
  let assigneesContainerRef = document.getElementById("assignees-list");
  if (
    (containerId === "assigned-to-dropdown" &&
      assignees.length != 0 &&
      container.classList.contains("d_none")) ||
    (containerId === "category-dropdown" && assignees.length != 0)
  ) {
    assigneesContainerRef.classList.remove("d_none");
    assigneesContainerRef.innerHTML = "";
    for (let index = 0; index < assignees.length; index++) {
      let initials = getInitials(assignees[index]);
      let iconBackgroundColor = getIconBackgroundColor(initials);
      assigneesContainerRef.innerHTML += getAvatarTemplate(
        initials,
        iconBackgroundColor
      );
    }
  } else if (
    !container.classList.contains("d_none") ||
    assignees.length === 0
  ) {
    assigneesContainerRef.classList.add("d_none");
    assigneesContainerRef.innerHTML = "";
  }
}

//  error message handling

function showValueErrorMessage(valueSizeErrorContainerId) {
  let errorContainer = getErrorContainer(valueSizeErrorContainerId);
  return showErrorMessage(errorContainer);
}

function hideValueErrorMessage(valueSizeErrorContainerId) {
  let errorContainer = getErrorContainer(valueSizeErrorContainerId);
  return removeErrorMessage(errorContainer);
}

function getInputContainer(id) {
  return document.getElementById(id);
}

function getInputValue(inputContainer) {
  return inputContainer.value;
}

function getErrorContainer(id) {
  return document.getElementById(id);
}

function showErrorMessage(errorContainer) {
  if (errorContainer.classList.contains("d_none")) {
    errorContainer.classList.remove("d_none");
  }
}

function addValueErrorStylingOnInput(inputContainer) {
  if (!inputContainer.classList.contains("task-input-fields-invalid")) {
    inputContainer.classList.add("task-input-fields-invalid");
  }
}

function removeErrorMessage(errorContainer) {
  if (!errorContainer.classList.contains("d_none")) {
    errorContainer.classList.add("d_none");
  }
}

function removeValueErrorStylingOnInput(inputContainer) {
  if (inputContainer.classList.contains("task-input-fields-invalid")) {
    inputContainer.classList.remove("task-input-fields-invalid");
  }
}

// capture task

function createTask() {
  if (checkAllRequiredValues() === true) {
    return;
  } else {
    let taskId = "task-" + (tasks.length + newTasks.length + 1);
    let taskObject = createTaskObject(taskId);
    resetTaskHTML();
    newTasks.push(taskObject);
    sendTaskToLocalStorage(newTasks);
    showTaskSuccessMessage();
  }
}

function createTaskObject(taskId) {
  return (taskObject = {
    id: taskId,
    title: getInputContainer("task-title").value,
    description: getInputContainer("task-description").value,
    priority: getTaskPriority(),
    dueDate: getInputContainer("due-date-task").value,
    taskType: getTaskType(),
    assignedTo: assignees,
    subtasks: subtaskArray,
    status: "to-do",
  });
}

function getTaskType() {
  let type = getInputContainer("category").placeholder;
  if (type === "User Story") {
    return "userStory";
  } else {
    return "technical";
  }
}

function checkAllRequiredValues() {
  let requiredErrorContainers = [
    getErrorContainer("task-title-error"),
    getErrorContainer("due-date-required-error-message"),
    getErrorContainer("category-error"),
  ];
  checkTitleInputValue(`task-title-error`, `value-length-error`, `task-title`);
  checkDateInput("due-date-task");
  checkCategoryInputPlaceholder("category-error");
  for (let index = 0; index < requiredErrorContainers.length; index++) {
    if (!requiredErrorContainers[index].classList.contains("d_none")) {
      return true;
    }
  }
}

function getTaskPriority() {
  let priorityButtonsRef = document.getElementsByClassName("priority-labels");
  for (let index = 0; index < priorityButtonsRef.length; index++) {
    if (!priorityButtonsRef[index].classList.contains("default-prio-bg"))
      return priorityButtonsRef[index].id;
  }
}

function resetTaskHTML() {
  getInputContainer("task-title").value = "";
  suppressEvents = true;
  fp.clear();
  suppressEvents = false;
  getInputContainer("task-description").value = "";
  getInputContainer("category").placeholder = "Select Category";
  resetPriorityLabels();
  resetSubtasksList();
  resetAssignees();
}

function resetPriorityLabels() {
  let priorityLabels = document.getElementsByClassName("priority-labels");
  for (let index = 0; index < priorityLabels.length; index++) {
    priorityLabels[index].classList.add("default-prio-bg");
    priorityLabels[index].classList.remove(
      "low-prio-bg",
      "medium-prio-bg",
      "urgent-prio-bg",
      "weight-700"
    );
    priorityLabels[index].style.color = "#000000";
    resetIconColor(priorityLabels[index]);
  }
}

function resetSubtasksList() {
  subtaskArray = [];
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask-list").classList.add("d_none");
}

function resetIconColor(label) {
  let id = label.id;
  let color = getPriorityColor(id);
  let icon = getPriorityIconParts(id);
  switchPriorityIconColor(icon, color);
}

function resetAssignees() {
  assignees = [];
  let assigneesContainerRef = document.getElementById("assignees-list");
  renderAssignees("assigned-to-dropdown", assigneesContainerRef);
}

function sendTaskToLocalStorage(object) {
  localStorage.setItem("tasks", JSON.stringify(object));
}

function showTaskSuccessMessage() {
  let msg = document.getElementById("success-message");
  msg.classList.remove("d_none");
  msg.classList.add("show");
  setTimeout(() => {
    msg.classList.remove("show");
    msg.classList.add("d_none");
  }, 1500);
}

//TODO: Template add-task
//TODO: Add add-task Template integrations
//TODO: fix 100vh reset
