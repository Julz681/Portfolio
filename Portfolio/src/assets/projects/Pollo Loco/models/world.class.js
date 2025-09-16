/** Main game world containing characters, enemies, canvas and game logic.*/
class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBar = new StatusBar();
  throwableObject = [];
  endbossBar = new StatusBarEndboss();
  statusBarBottle = new StatusBarBottle();
  coinBar = new CoinStatusBar();
  endScreenImage = null;
  showingEndScreen = false;
  isPaused = false;
  pauseImage = null;
  isGameOver = false;
  deaths = 0;
  coinsCollectedFinal = 0;
  startTime = 0;
  isMuted = false;
  canThrow = true;

  /** Initializes the world with canvas, keyboard input and level data.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {Keyboard} keyboard - Keyboard input manager.
   * @param {Level} level - Current game level.*/
  constructor(canvas, keyboard, level) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = level;
    this.soundManager = new SoundManager(this);
    this.soundManager.initSounds();
    this.collisionManager = new CollisionManager(this);
    this._setupSounds();
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Setup sounds and mute/unmute based on stored preference */
  _setupSounds() {
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.5;
    if (localStorage.getItem("isMuted") === "true") this.soundManager.muteAllSounds();
    else {
      this.soundManager.unmuteAllSounds();
      this.isMuted = false;
      this.updateMuteIcon();
      this.sounds.background.play();
    }
  }

  /** Assign this world instance to character and enemies */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
    this.pauseImage = new Image();
    this.pauseImage.src = "img/You won, you lost/Game_paused.png";
  }

  /** Main game loop running periodically */
  run() {
    setInterval(() => {
      this.handlePauseToggle();
      if (this.isPaused || this.isGameOver) return;
      if (this.keyboard.UP) this.character.jump();
      this.checkCollisions();
      this.checkThrowObjects();
    }, 100);
  }

  /** Handle pause and continue controls */
  handlePauseToggle() {
    if (this.keyboard.P) this.isPaused = true;
    if (this.keyboard.C) this.isPaused = false;
  }

  /** Check if player threw a bottle */
  checkThrowObjects() {
    if (
      this.keyboard.D &&
      this.statusBarBottle.percentage > 0 &&
      !this.character.isThrowing
    )
      this.throwBottle();
  }

  /** Logic to throw a bottle */
  throwBottle() {
    if (!this.canThrow) return;
    this.canThrow = false;
    this.createBottle();
    this.startThrowAnimation();
    this.updateBottleStatus();
    this.soundManager.playThrowSound();
    setTimeout(() => (this.canThrow = true), 1500);
  }

  /** Create a new bottle object at character position */
  createBottle() {
    const offsetX = this.character.otherDirection ? -100 : 100;
    const bottle = new throwableObject(
      this.character.x + offsetX,
      this.character.y + 100
    );
    bottle.otherDirection = this.character.otherDirection;
    bottle.world = this;
    this.throwableObject.push(bottle);
  }

  /** Animate character throwing action */
  startThrowAnimation() {
    this.character.isThrowing = true;
    this.character.loadImage(this.character.IMAGE_THROW[0]);
    setTimeout(() => {
      this.character.isThrowing = false;
      this.character.loadImage(this.character.IMAGES_WALKING[0]);
    }, 300);
  }

  /** Update bottle status bar after throwing */
  updateBottleStatus() {
    this.statusBarBottle.setPercentage(this.statusBarBottle.percentage - 20);
  }

  /** Check all collision types */
  checkCollisions() {
    this.collisionManager.checkEnemyCollisions();
    this.collisionManager.checkBottleCollisions();
    this.collisionManager.collectBottles();
    this.collisionManager.collectCoins();
    this.collisionManager.collectHearts();
    this.collisionManager.checkGameOverOrWin();
  }

  /** Increase character's energy and update status bar */
  updateCharacterEnergy() {
    const newEnergy = Math.min(this.character.energy + 20, 100);
    this.character.energy = newEnergy;
    this.statusBar.setPercentage(newEnergy);
  }

  /** Handle game over sequence */
  handleGameOver() {
    this.showingEndScreen = true;
    setTimeout(() => this._doGameOver(), 100);
  }

  /** Finalize game over */
  _doGameOver() {
    this.isGameOver = true;
    this.soundManager.pauseBackgroundSound();
    showGameOverScreen();
    this.soundManager.playDieSound();
  }

  /** Handle game win sequence */
  handleGameWin() {
    this.soundManager.playEndbossDieSound();
    this._saveBestCoins();
    this._doGameWin();
  }

  /** Save best coins to local storage */
  _saveBestCoins() {
    const storageKey = `coinsLevel${currentLevel}`;
    const previousBest = parseInt(localStorage.getItem(storageKey)) || 0;
    if (this.coinsCollectedFinal > previousBest) {
      localStorage.setItem(storageKey, this.coinsCollectedFinal);
    }
  }

  /** Finalize game win */
  _doGameWin() {
    this.isGameOver = true;
    this.soundManager.pauseBackgroundSound();
    if (currentLevel === 8) {
      this.handleFinalLevelWin();
    } else {
      this.showWinScreenWithApplause();
    }
  }

  /** Show final level overlay with applause and confetti */
  showFinalLevelOverlayWithApplause() {
    showFinalLevelOverlay();
    this._playApplause();
    setTimeout(() => {
      stopConfetti();
      showEndScreenWithButtons("img/You won, you lost/You won A.png");
    }, 5000);
  }

  /** Show win screen and play applause */
  showWinScreenWithApplause() {
    showEndScreenWithButtons("img/You won, you lost/You won A.png");
    this._updateBestCoinsDisplay();
    setTimeout(() => this._playApplause(), 200);
  }

  /** Play applause sound */
  _playApplause() {
    if (!this.sounds.applause.paused) {
      this.sounds.applause.pause();
      this.sounds.applause.currentTime = 0;
    }
    this.sounds.applause.play();
  }

  /** Update the best coins display in UI */
  _updateBestCoinsDisplay() {
    const storageKey = `coinsLevel${currentLevel}`;
    const bestCoins = localStorage.getItem(storageKey) || 0;
    const coinsDisplay = document.getElementById("coinsDisplay");
    if (coinsDisplay) coinsDisplay.textContent = `Best Coins: ${bestCoins}`;
  }

  /** Main draw loop */
  draw() {
    if (this.isPaused) return this.drawPausedScreen();
    if (this.isGameOver) return this.drawGameOverScreen();
    this.resumeBackgroundSound();
    this.clearCanvas();
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();
    this.drawCharacterAndEnemies();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUD();
    this.drawEndbossBarIfVisible();
    this.drawEndScreenIfShowing();
    requestAnimationFrame(() => this.draw());
  }

  /** Draw pause screen */
  drawPausedScreen() {
    if (!this.sounds.background.paused) this.sounds.background.pause();
    if (this.sounds.gamePaused.paused) {
      this.sounds.gamePaused.currentTime = 0;
      this.sounds.gamePaused.play();
    }
    this.clearCanvas();
    this.drawPauseScreen();
    requestAnimationFrame(() => this.draw());
  }

  /** Draw game over screen */
  drawGameOverScreen() {
    this.clearCanvas();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawEndScreenIfShowing();
    requestAnimationFrame(() => this.draw());
  }

  /** Resume background sound if needed */
  resumeBackgroundSound() {
    if (!this.sounds.gamePaused.paused) this.sounds.gamePaused.pause();
    if (this.sounds.background.paused) this.sounds.background.play();
  }

  /** Clear the canvas */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Draw pause image on canvas */
  drawPauseScreen() {
    this.ctx.drawImage(
      this.pauseImage,
      this.canvas.width / 2 - 200,
      this.canvas.height / 2 - 150,
      400,
      300
    );
  }

  /** Draw background layers and objects */
  drawBackgroundObjects() {
    [this.level.backgroundObjects, this.level.clouds, this.level.bottles, this.level.coins, this.level.hearts, this.level.enemies, this.throwableObject].forEach(group => this._drawObjects(group));
  }

  /** Helper to draw a list of objects */
  _drawObjects(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /** Draw character and enemies */
  drawCharacterAndEnemies() {
    this.addToMap(this.character);
  }

  /** Draw HUD elements */
  drawHUD() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.coinBar);
  }

  /** Draw endboss health bar if boss in view */
  drawEndbossBarIfVisible() {
    if (this.endbossInView()) this.addToMap(this.endbossBar);
  }

  /** Draw end screen if showing */
  drawEndScreenIfShowing() {
    if (!this.showingEndScreen || !this.endScreenImage) return;
    this.ctx.drawImage(
      this.endScreenImage,
      this.endScreenX,
      this.canvas.height / 2 - 150,
      400,
      300
    );
  }

  /** Draw a movable object, flipping image if needed.
   * @param {MovableObject} movableObject */
  addToMap(movableObject) {
    if (movableObject.otherDirection) this._flipImage(movableObject);
    movableObject.draw(this.ctx);
    if (movableObject.otherDirection) this._flipImageBack(movableObject);
  }

  _flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x *= -1;
  }

  _flipImageBack(movableObject) {
    movableObject.x *= -1;
    this.ctx.restore();
  }

  /** Check if endboss is in view */
  endbossInView() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    return boss && this.character.x + 400 >= boss.x && !boss.isDead;
  }

  /**Show end screen image sliding in.
   * @param {string} path - Image source for end screen.*/
  showEndScreen(path) {
    this.showingEndScreen = true;
    this.endScreenImage = new Image();
    this.endScreenImage.src = path;
    this.endScreenX = this.canvas.width;
    this.animateEndScreen();
  }

  /** Animate end screen sliding from right */
  animateEndScreen() {
    if (this.endScreenX <= this.canvas.width / 2 - 200) return;
    this.endScreenX -= 10;
    requestAnimationFrame(() => this.animateEndScreen());
  }

  /** Update mute icon visibility */
  updateMuteIcon() {
    const muteIcon = document.getElementById("muteIcon");
    if (!muteIcon) return;
    muteIcon.style.display = this.isMuted ? "block" : "none";
  }

  /** Handle winning the final level */
  handleFinalLevelWin() {
    this.showingEndScreen = true;
    this.isGameOver = true;
    showFinalLevelOverlay();
    this._playApplause();
    setTimeout(() => {
      stopConfetti();
    }, 5000);
  }
}

/** Checks and handles device orientation, shows overlay if portrait */
function checkOrientation() {
  const overlay = document.getElementById("rotateScreenOverlay");
  if (!overlay) return;
  if (window.innerWidth < window.innerHeight) {
    overlay.classList.remove("hidden");
    if (window.world) window.world.isPaused = true;
  } else {
    overlay.classList.add("hidden");
    if (window.world) window.world.isPaused = false;
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
