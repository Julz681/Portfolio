document.addEventListener("DOMContentLoaded", function() {
    const userProfile = document.getElementById("userProfile");
    const dropdownMenu = document.getElementById("dropdownMenu");

    userProfile.addEventListener("click", function(event) {
        event.stopPropagation(); // Verhindert das sofortige Schließen
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!userProfile.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
