/**
 * Displays the player's health bar.
 */
class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the health bar display based on percentage.
   * @param {number} percentage - Health percentage (0-100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index for the current health percentage.
   * @returns {number} Image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}

/**
 * Displays the endboss energy/status bar.
 */
class StatusBarEndboss extends DrawableObject {
  IMAGES_ENDBOSS_ENERGY = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS_ENERGY);
    this.x = 270;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the endboss bar display based on percentage.
   * @param {number} percentage - Endboss energy percentage (0-100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const index = this.resolveImageIndex();
    const path = this.IMAGES_ENDBOSS_ENERGY[index];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index for the current energy percentage.
   * @returns {number} Image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}

/**
 * Displays the bottle power/status bar.
 */
class StatusBarBottle extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 60;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the bottle bar display based on percentage.
   * @param {number} percentage - Bottle power percentage (0-100).
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(percentage, 100));
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index for the current bottle power percentage.
   * @returns {number} Image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}

/**
 * Displays the current coin count in the HUD.
 */
class CoinStatusBar extends DrawableObject {
  constructor() {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = 580;
    this.y = 2;
    this.width = 100;
    this.height = 100;
    this.coins = 0;
  }

  /**
   * Sets the number of collected coins.
   * @param {number} count - Current coin count.
   */
  setCoinCount(count) {
    this.coins = count;
  }

  /**
   * Draws the coin icon and count on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
   */
  draw(ctx) {
    super.draw(ctx);
    ctx.font = "40px Luckiest Guy, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(this.coins, this.x + 75, this.y + 62);
  }
}
