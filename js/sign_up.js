/**
 * This function automatically fills the sign-up form fields with predefined values when clicking in the e-mail field.
 * This function is primarily used for testing or demonstration purposes.
 */
function autoFillFieldsSignUp() {
    document.getElementById("name").value = "Sofia Müller";
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
    document.getElementById("confirm-password").value = "MyPassword12345";
    document.getElementById("privacy-policy").checked = true;
}

/**
 * This function adds an event listener to the sign-up form that prevents the default form submission,
 * displays a success message, and redirects the user after a short delay.
 */
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from actually submitting

    /**
     * The success message element.
     * @type {HTMLElement}
     */
    let successMessage = document.querySelector('.success-message');

    // If the success message does not exist, create and append it
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'You signed up successfully';
        document.body.appendChild(successMessage);
    }

    // Show the success message
    successMessage.classList.add('show');

    // Hide the success message after 4 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);

    // Redirect to the homepage
    window.location.href = '/index.html';
});

/**
 * This function toggles the visibility of a password input field and updates the corresponding icon.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye icon.
 */
function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === 'text';

    if (isPasswordVisible) {
        inputField.type = 'password';
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        inputField.type = 'text';
        imgElement.src = '/assets/img/eye.png'; 
    }
}

/**
 * This function updates the password visibility icon based on the input field value.
 * If the field contains text, the closed-eye icon is shown- if it does not, a lock icon is displayed.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLImageElement} imgElement - The image element representing the eye or lock icon.
 */
function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        imgElement.src = '/assets/img/lock.png'; 
    }
}

/**
 * This function hides the element with the ID "start" by setting its display property to "none".
 */
document.getElementById('start').style.display = 'none';
