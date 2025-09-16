/**
 * Represents a throwable bottle object with rotation and splash animations.
 */
class throwableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Initializes a throwable bottle at a given position.
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position.
   */
  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.hasHit = false;
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
  }

  /**
   * Starts the throw animation and movement.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();

    this.throwInterval = setInterval(() => {
      this.x += this.otherDirection ? -10 : 10;
    }, 25);

    setInterval(() => {
      this.playAnimation(this.IMAGES_ROTATION);
    }, 100);
  }

  /**
   * Plays the splash animation and removes the bottle afterwards.
   */
  splash() {
    this.playAnimation(this.IMAGES_SPLASH);
    this.speedY = 0;
    this.speed = 0;

    setTimeout(() => {
      const index = this.world.throwableObject.indexOf(this);
      if (index > -1) {
        this.world.throwableObject.splice(index, 1);
      }
    }, 500);
  }
}
