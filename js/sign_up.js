/**
 * This function shows the closed-eye icon when the password field is focused.
 */
function handlePasswordFocus(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  
  // When the password field is focused, set the icon to the closed-eye icon
  imgElement.src = "/assets/img/eye_closed.png";
}

/**
 * This function shows and hides the password when the eye icon is clicked.
 * @param {string} inputId - The ID of the password field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  
  // If the password is visible, set it back to "password" and change the icon to the closed-eye icon.
  if (inputField.type === "text") {
    inputField.type = "password";
    imgElement.src = "/assets/img/eye_closed.png";
  } else {
    // If the password is hidden, set it to "text" and change the icon to the open-eye icon.
    inputField.type = "text";
    imgElement.src = "/assets/img/eye.png";
  }
}

/**
 * This function updates the password icon based on the input.
 * If the password field contains text, the closed-eye icon is displayed; otherwise, the lock icon is shown.
 */
function updatePasswordIcon(inputId, imgElement) {
  const inputField = document.getElementById(inputId);
  if (inputField.value.length > 0) {
    imgElement.src = "/assets/img/eye_closed.png";
  } else {
    imgElement.src = "/assets/img/lock.png";
  }
}

/**
 * This function automatically fills the sign-up form when the email field is focused.
 */
function autoFillFieldsSignUp() {
  document.getElementById("name").value = "Sofia Müller";
  document.getElementById("email").value = "SofiaMueller@gmail.com";
  document.getElementById("password").value = "MyPassword12345";
  document.getElementById("confirm-password").value = "MyPassword12345";
  document.getElementById("privacy-policy").checked = true;
}

/**
 * This function adds an event listener to the sign-up form that prevents the form from being submitted,
 * displays a success message, and redirects the user after a short delay.
 */
document.getElementById("signup-form").onsubmit = function(event) {
  event.preventDefault(); // Prevents the form from actually submitting
  
  // Create the success message
  let successMessage = document.querySelector(".success-message");

  // If the success message doesn't exist, create it
  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "You have successfully signed up!";
    document.body.appendChild(successMessage);
  }

  // Show the success message
  successMessage.classList.add("show");

  // Hide the success message after 4 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 4000);

  // Redirect to the homepage
  window.location.href = "/index.html";
}

/**
 * This function hides the element with the ID "start" by setting its display value to "none".
 */
document.getElementById("start").style.display = "none";
