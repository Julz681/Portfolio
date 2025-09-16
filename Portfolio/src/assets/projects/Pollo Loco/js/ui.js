/** @type {HTMLElement} Overlay for the final level */
let finalOverlay;
/** @type {HTMLCanvasElement} Canvas for confetti animation */
let confettiCanvas;
/** @type {CanvasRenderingContext2D} Context for confetti canvas */
let confettiCtx;
/** @type {number} ID for confetti animation frame */
let confettiAnimationId;
/** @type {HTMLCanvasElement} Main game canvas */
let gameCanvas;

/**
 * Initializes UI elements and sets up event listeners on window load.
 */
window.addEventListener("load", () => {
  initOverlays();
  setupOverlayButtons();
  setupMobileControls();
  showStartscreen();
});

/**
 * Mapping from level number to maximum coins in that level.
 * @type {Object<number, number>}
 */
const maxCoinsPerLevel = {
  1: 30,
  2: 35,
  3: 40,
  4: 45,
  5: 50,
  6: 50,
  7: 50,
  8: 60,
};

/**
 * Initializes overlay elements and canvas contexts.
 */
function initOverlays() {
  finalOverlay = document.getElementById("finalLevelOverlay");
  confettiCanvas = document.getElementById("confettiCanvas");
  confettiCtx = confettiCanvas.getContext("2d");
  confettiCanvas.width = 720;
  confettiCanvas.height = 480;
  gameCanvas = document.getElementById("canvas");
}

/**
 * Shows the start screen and hides the game canvas and level menu.
 */
function showStartscreen() {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("startscreen").classList.remove("hidden");
  document.getElementById("levelmenu").classList.add("hidden");
}

/**
 * Updates the displayed coin count for a specific level.
 * @param {number} level - The level number.
 */
function updateCoinsDisplay(level) {
  const maxCoins = getMaxCoinsForLevel(level);
  const collectedCoins = localStorage.getItem(`coinsLevel${level}`) || 0;
  const display = document.getElementById(`coinsLevel${level}Display`);
  if (display) {
    display.innerHTML = `${collectedCoins} / ${maxCoins} <img src="img/8_coin/coin_1.png" alt="Coin" style="width:70px; vertical-align:middle;margin-left:-20px;">`;
  }
}

/**
 * Updates coin counts for all levels in the level menu.
 */
function updateCoinsInLevelMenu() {
  for (let level = 1; level <= 8; level++) {
    updateCoinsDisplay(level);
  }
}

/**
 * Shows the level selection menu and hides the start screen.
 */
function showLevelMenu() {
  document.getElementById("startscreen").classList.add("hidden");
  document.getElementById("levelmenu").classList.remove("hidden");
  updateCoinsInLevelMenu();
}

/**
 * Sets up click event handlers for all overlay buttons.
 */
function setupOverlayButtons() {
  setupGameOverButtons();
  setupEndScreenButtons();
  setupFinalOverlayButtons();
}

/**
 * Configures buttons for the Game Over overlay.
 */
function setupGameOverButtons() {
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  if (tryAgainBtn) {
    tryAgainBtn.onclick = () => {
      hideOverlay("gameOverOverlay");
      startGame(currentLevel);
    };
  }
  const backToMenuBtnGameOver = document.getElementById("backToMenuBtnGameOver");
  if (backToMenuBtnGameOver) {
    backToMenuBtnGameOver.onclick = () => {
      hideOverlay("gameOverOverlay");
      showLevelMenu();
    };
  }
}

/**
 * Configures buttons for the End Screen overlay.
 */
function setupEndScreenButtons() {
  const playAgainBtn = document.getElementById("playAgainBtn");
  if (playAgainBtn) {
    playAgainBtn.onclick = () => {
      hideOverlay("endScreenOverlay");
      startGame(currentLevel);
    };
  }
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  if (nextLevelBtn) {
    nextLevelBtn.onclick = () => {
      hideOverlay("endScreenOverlay");
      if (currentLevel < 8) startGame(currentLevel + 1);
      else showLevelMenu();
    };
  }
  const backToMenuBtnEndScreen = document.getElementById("backToMenuBtnEndScreen");
  if (backToMenuBtnEndScreen) {
    backToMenuBtnEndScreen.onclick = () => {
      hideOverlay("endScreenOverlay");
      showLevelMenu();
    };
  }
}

/**
 * Configures buttons for the Final Level overlay.
 */
function setupFinalOverlayButtons() {
  const playAgainBtnFinal = document.getElementById("playAgainBtnFinal");
  if (playAgainBtnFinal) {
    playAgainBtnFinal.onclick = () => {
      stopConfetti();
      hideFinalOverlay();
      startGame(1);
    };
  }
  const backToMenuBtnFinal = document.getElementById("backToMenuBtnFinal");
  if (backToMenuBtnFinal) {
    backToMenuBtnFinal.onclick = () => {
      stopConfetti();
      hideFinalOverlay();
      showLevelMenu();
    };
  }
}

/**
 * Adds the 'hidden' class to an element by its ID.
 * @param {string} id - The element's ID.
 */
function hideOverlay(id) {
  document.getElementById(id).classList.add("hidden");
}

/**
 * Hides the final level overlay and shows the main game canvas.
 */
function hideFinalOverlay() {
  finalOverlay.classList.add("hidden");
  gameCanvas.style.display = "block";
}

/**
 * Shows the end screen overlay with a specified image.
 * @param {string} imagePath - The path to the image.
 */
function showEndScreenWithButtons(imagePath) {
  const overlay = document.getElementById("endScreenOverlay");
  const img = document.getElementById("endScreenImage");
  img.src = imagePath;
  overlay.classList.remove("hidden");
}

/**
 * Shows the game over overlay.
 */
function showGameOverScreen() {
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}

/**
 * Sets up mobile control buttons to simulate keyboard input.
 */
function setupMobileControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnJump = document.getElementById("btn-jump");
  const btnThrow = document.getElementById("btn-throw");
  const btnPause = document.getElementById("btn-pause");
  const btnMute = document.getElementById("btn-mute");

  /**
   * Press a key on the virtual keyboard.
   * @param {string} key - The keyboard key name.
   */
  function pressKey(key) {
    window.keyboard[key] = true;
  }
  /**
   * Release a key on the virtual keyboard.
   * @param {string} key - The keyboard key name.
   */
  function releaseKey(key) {
    window.keyboard[key] = false;
  }

  btnLeft.addEventListener("touchstart", () => pressKey("LEFT"));
  btnLeft.addEventListener("touchend", () => releaseKey("LEFT"));
  btnLeft.addEventListener("mousedown", () => pressKey("LEFT"));
  btnLeft.addEventListener("mouseup", () => releaseKey("LEFT"));
  btnLeft.addEventListener("mouseleave", () => releaseKey("LEFT"));

  btnRight.addEventListener("touchstart", () => pressKey("RIGHT"));
  btnRight.addEventListener("touchend", () => releaseKey("RIGHT"));
  btnRight.addEventListener("mousedown", () => pressKey("RIGHT"));
  btnRight.addEventListener("mouseup", () => releaseKey("RIGHT"));
  btnRight.addEventListener("mouseleave", () => releaseKey("RIGHT"));

  btnJump.addEventListener("touchstart", () => pressKey("UP"));
  btnJump.addEventListener("touchend", () => releaseKey("UP"));
  btnJump.addEventListener("mousedown", () => pressKey("UP"));
  btnJump.addEventListener("mouseup", () => releaseKey("UP"));
  btnJump.addEventListener("mouseleave", () => releaseKey("UP"));

  btnThrow.addEventListener("touchstart", () => pressKey("D"));
  btnThrow.addEventListener("touchend", () => releaseKey("D"));
  btnThrow.addEventListener("mousedown", () => pressKey("D"));
  btnThrow.addEventListener("mouseup", () => releaseKey("D"));
  btnThrow.addEventListener("mouseleave", () => releaseKey("D"));

  btnPause.addEventListener("click", () => {
    if (window.keyboard.P) {
      window.keyboard.P = false;
      window.keyboard.C = true;
    } else {
      window.keyboard.P = true;
      window.keyboard.C = false;
    }
  });

  btnMute.addEventListener("click", () => {
    if (window.isMuted) {
      window.isMuted = false;
      if (window.world) window.world.soundManager.unmuteAllSounds();
      btnMute.textContent = "🔈";
    } else {
      window.isMuted = true;
      if (window.world) window.world.soundManager.muteAllSounds();
      btnMute.textContent = "🔇";
    }
  });
}

/**
 * Starts the confetti animation.
 */
function startConfetti() {
  initializeConfetti();
  confettiAnimationId = requestAnimationFrame(drawConfetti);
}

/**
 * Initializes the confetti pieces array with randomized confetti.
 */
function initializeConfetti() {
  const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"];
  confettiPieces = [];
  for (let i = 0; i < 100; i++) {
    confettiPieces.push(createConfettiPiece(colors));
  }
}

/**
 * Creates a single confetti piece with randomized attributes.
 * @param {string[]} colors - Array of confetti colors.
 * @returns {object} The confetti piece object.
 */
function createConfettiPiece(colors) {
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 20 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngle: 0,
    tiltAngleIncrement: Math.random() * 0.07 + 0.05,
    speedY: Math.random() + 1,
    speedX: (Math.random() - 0.5) * 2,
  };
}

/**
 * Draws a frame of the confetti animation.
 */
function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p) => updateAndDrawConfetti(p));
  confettiAnimationId = requestAnimationFrame(drawConfetti);
}

/**
 * Updates position and draws a single confetti piece.
 * @param {object} p - A confetti piece object.
 */
function updateAndDrawConfetti(p) {
  p.tiltAngle += p.tiltAngleIncrement;
  p.y += p.speedY;
  p.x += p.speedX;
  p.tilt = Math.sin(p.tiltAngle) * 15;

  confettiCtx.beginPath();
  confettiCtx.lineWidth = p.r / 2;
  confettiCtx.strokeStyle = p.color;
  confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
  confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
  confettiCtx.stroke();

  if (p.y > confettiCanvas.height) {
    p.x = Math.random() * confettiCanvas.width;
    p.y = -20;
  }
}

/**
 * Stops the confetti animation and clears the canvas.
 */
function stopConfetti() {
  cancelAnimationFrame(confettiAnimationId);
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

/**
 * Formats milliseconds into a mm:ss time string.
 * @param {number} ms - Time in milliseconds.
 * @returns {string} Formatted time string.
 */
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Shows the final level overlay with confetti animation.
 */
function showFinalLevelOverlay() {
  finalOverlay.classList.remove("hidden");
  startConfetti();
  const finalContent = finalOverlay.querySelector(".finalLevelContent");
  finalContent.classList.add("hidden");
  setTimeout(() => {
    stopConfetti();
    finalContent.classList.remove("hidden");
  }, 5000);
}
