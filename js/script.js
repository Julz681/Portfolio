document.querySelector('.start').addEventListener('animationend', function() {
    this.classList.add('finished');
});

document.addEventListener("DOMContentLoaded", () => {
      const helpButton = document.querySelector(".help-btn");
      if (helpButton) {
          helpButton.style.display = "none";
      }
  });

  function goBack() {
    window.history.back();
}
