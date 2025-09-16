/**
 * Class representing a movable game object with physics and animation.
 * Extends DrawableObject.
 */
class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object, affecting vertical position and speed.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level.
   * @returns {boolean} True if above ground.
   */
  isAboveGround() {
    if (this instanceof throwableObject) {
      return true;
    } else {
      return this.y < 160;
    }
  }

  /**
   * Checks collision with another movable object.
   * @param {MovableObject} mo - Other movable object.
   * @returns {boolean} True if colliding.
   */
    isColliding(mo) {
    const centerX = mo.x + mo.width / 2;
    const centerY = mo.y + mo.height / 2;

    return (
      centerX > this.x &&
      centerX < this.x + this.width &&
      centerY > this.y &&
      centerY < this.y + this.height
    );
  }

  /**
   * Checks collision with coins.
   * @param {MovableObject} mo - Other movable object.
   * @returns {boolean} True if colliding.
   */

  isCollidingEnemy(mo) {
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Reduces energy when hit and records the time of last hit.
   */
  hit() {
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object was hit within the last second.
   * @returns {boolean} True if recently hurt.
   */
  isHurt() {
    let timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead (energy is 0).
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays animation by cycling through provided image paths.
   * @param {string[]} images - Array of image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Makes the object jump by setting vertical speed.
   */
  jump() {
    this.speedY = 30;
  }
}
