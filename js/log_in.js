function autoFillFields() {
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
};


function togglePasswordVisibility(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    const isPasswordVisible = inputField.type === 'text';

    if (isPasswordVisible) {
        inputField.type = 'password';
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        inputField.type = 'text';
        imgElement.src = '/assets/img/eye.jpg'; 
    }
}


function updatePasswordIcon(inputId, imgElement) {
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        imgElement.src = '/assets/img/eye_closed.png'; 
    } else {
        imgElement.src = '/assets/img/lock.png'; 
    }
}
