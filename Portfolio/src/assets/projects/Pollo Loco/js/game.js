window.keyboard = new Keyboard();
window.isMuted = false;

/**
 * Returns the maximum number of coins for a given level.
 * @param {number} levelNumber - The level number.
 * @returns {number} Maximum coins for the level.
 */
function getMaxCoinsForLevel(levelNumber) {
  return maxCoinsPerLevel[levelNumber] || 0;
}

/**
 * Starts the game at the specified level.
 * Initializes the world and hides the level menu.
 * @param {number} levelNumber - The level to start.
 */
function startGame(levelNumber) {
  currentLevel = levelNumber;
  document.getElementById("levelmenu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  canvas = document.getElementById("canvas");
  let level = getLevel(levelNumber);
  world = new World(canvas, window.keyboard, level);
  window.world = world; 
  if (levelNumber === 8) resetFinalLevelStats();
}

/**
 * Returns the level object corresponding to the level number.
 * @param {number} levelNumber - The level number.
 * @returns {object} The level instance.
 */
function getLevel(levelNumber) {
  switch (levelNumber) {
    case 1: return createLevel1();
    case 2: return createLevel2();
    case 3: return createLevel3();
    case 4: return createLevel4();
    case 5: return createLevel5();
    case 6: return createLevel6();
    case 7: return createLevel7();
    case 8: return createLevel8();
    default: return createLevel1();
  }
}

/**
 * Resets statistics specific to the final level.
 */
function resetFinalLevelStats() {
  world.startTime = Date.now();
  world.deaths = 0;
  world.coinsCollectedFinal = 0;
}

/**
 * Handles keydown events for controlling the game.
 * Supports mute, unmute, fullscreen toggles, and movement keys.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyDown(e) {
  if (window.world?.isGameOver) return;
  if (e.shiftKey && (e.key === "m" || e.key === "M")) {
    window.isMuted = true;
    if (window.world) window.world.soundManager.muteAllSounds();
    return;
  }
  if (e.shiftKey && (e.key === "u" || e.key === "U")) {
    window.isMuted = false;
    if (window.world) window.world.soundManager.unmuteAllSounds();
    return;
  }
  setKeyPressed(e.keyCode, true);
  if (window.keyboard.SHIFT && window.keyboard.F) {
    e.preventDefault();
    enterFullscreen();
  }
  if (window.keyboard.SHIFT && window.keyboard.S) {
    e.preventDefault();
    exitFullscreen();
  }
}

/**
 * Handles keyup events to stop movement or actions.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyUp(e) {
  setKeyPressed(e.keyCode, false);
}

/**
 * Updates keyboard state flags for pressed keys.
 * @param {number} keyCode - The code of the key.
 * @param {boolean} pressed - True if pressed, false if released.
 */
function setKeyPressed(keyCode, pressed) {
  switch (keyCode) {
    case 39: window.keyboard.RIGHT = pressed; break;
    case 37: window.keyboard.LEFT = pressed; break;
    case 38: window.keyboard.UP = pressed; break;
    case 40: window.keyboard.DOWN = pressed; break;
    case 32: window.keyboard.SPACE = pressed; break;
    case 68: window.keyboard.D = pressed; break;
    case 80: window.keyboard.P = pressed; break;
    case 67: window.keyboard.C = pressed; break;
    case 16: window.keyboard.SHIFT = pressed; break;
    case 83: window.keyboard.S = pressed; break;
    case 70: window.keyboard.F = pressed; break;
  }
}

/**
 * Requests fullscreen mode for the canvas element.
 */
function enterFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(() => {});
  }
}

/**
 * Exits fullscreen mode if currently active.
 */
function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

/**
 * Resizes the canvas element to fill the window.
 */
function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

document.addEventListener("fullscreenchange", resizeCanvas);
window.addEventListener("resize", () => {
  if (document.fullscreenElement) resizeCanvas();
});
