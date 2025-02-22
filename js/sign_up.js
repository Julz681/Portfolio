function autoFillFieldsSignUp() {
    document.getElementById("name").value = "Sofia Müller";
    document.getElementById("email").value = "SofiaMueller@gmail.com";
    document.getElementById("password").value = "MyPassword12345";
    document.getElementById("confirm-password").value = "MyPassword12345";
    document.getElementById("privacy-policy").checked = true;
}


document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'You signed up successfully';
        document.body.appendChild(successMessage);
    }
    
    
    successMessage.classList.add('show');

    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);

    
    window.location.href = '/index.html';
});


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



document.getElementById('start').style.display = 'none';