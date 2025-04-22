// handle no results message function - no results desktop & mobile version
function handleNoResultsMessage(text, matchCount) {
    const noResults = document.getElementById("no-results");
    const noTaskPlaceholders = document.querySelectorAll(".no-tasks-feedback");
    const showGlobalNoResults =
      text.length >= 2 && matchCount === 0 && window.innerWidth >= 1440;
    const showPerColumnPlaceholder =
      text.length >= 2 && matchCount === 0 && window.innerWidth < 1440;
  
    if (noResults) {
      noResults.style.display = showGlobalNoResults ? "block" : "none";
    }
    noTaskPlaceholders.forEach((placeholder) => {
      placeholder.style.display = showPerColumnPlaceholder ? "flex" : "none";
    });
  }
  
  // function for handling onclick + btns under and over 1200px
  function handleAddTaskClickResponsive() {
    const width = window.innerWidth;
    if (width < 1200) {
      window.location.href = "add_task.html";
    } else {
      openOverlay();
    }
  }
  
  // toggles the "Move to" menu on a task card
  function toggleMoveMenu(button, event) {
    event.stopPropagation();
    const card = button.closest(".board-card");
    const menu = card.querySelector(".move-menu");
    closeAllMenus(menu);
    menu.classList.toggle("d-none");
    card.classList.toggle("menu-open", !menu.classList.contains("d-none"));
  }
  
  // closes all move menus except the currently open one
  function closeAllMenus(current = null) {
    document.querySelectorAll(".move-menu").forEach((m) => {
      if (m !== current) m.classList.add("d-none");
    });
    document
      .querySelectorAll(".board-card.menu-open")
      .forEach((c) => c.classList.remove("menu-open"));
  }
  
  // closes menus when clicking outside
  document.addEventListener("click", (e) => {
    const insideMenu = e.target.closest(".move-menu");
    const isButton = e.target.closest(".card-action-btn");
    if (!insideMenu && !isButton) closeAllMenus();
  });
  
  // moves a task to a different column and re-renders
  function moveTaskToColumn(status, event) {
    event.stopPropagation();
  
    const openCard = document.querySelector(".board-card.menu-open");
    if (!openCard) return;
  
    const taskId = openCard.dataset.taskId;
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;
  
    task.status = status;
    renderAllColumns();
    closeAllMenus();
  }
  