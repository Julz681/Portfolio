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
        imgElement.src = '/assets/img/eye.png'; 
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

window.onload = function() {
    // Überprüft, ob gespeicherte Daten vorhanden sind
    if (localStorage.getItem('rememberMe') === 'true') {
        document.getElementById('email').value = localStorage.getItem('email') || '';
        document.getElementById('password').value = localStorage.getItem('password') || '';
        document.getElementById('rememberMe').checked = true;
    }
};

document.getElementById('loginForm').addEventListener('submit', function() {
    const rememberMe = document.getElementById('rememberMe').checked;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.setItem('rememberMe', 'false');
    }
});
