// This function is used for the animation at the beginning.

document.querySelector(".start").addEventListener("animationend", function () {
  this.classList.add("finished");
});

//The event listener is for the help button in the header, making it disappear when on the help HTML page and reappear when leaving it.
document.addEventListener("DOMContentLoaded", () => {
  const helpButton = document.querySelector(".help-btn");
  if (helpButton) {
    helpButton.style.display = "none";
  }
});

//This function ensures that the arrow always brings the user back to the page they were on before clicking the help button.
function goBack() {
  window.history.back();
}


