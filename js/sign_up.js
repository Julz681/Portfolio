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
    }, 3000);

    
    window.location.href = '/index.html';
});

document.getElementById('start').style.display = 'none';