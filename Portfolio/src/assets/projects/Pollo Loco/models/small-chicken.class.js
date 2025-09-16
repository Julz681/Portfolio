/**
 * Class representing a small chicken enemy.
 * Extends MovableObject.
 */
class SmallChicken extends MovableObject {
  y = 370;
  height = 50;
  width = 40;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  isDead = false;

  /**
   * Creates a small chicken instance with randomized position and speed.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500;
    this.speed = 0.5 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Starts movement and animation intervals.
   */
  animate() {
    setInterval(() => {
      if (this.world?.isPaused) return;
      this.moveLeft();
    }, 1000 / 80);

    setInterval(() => {
      if (this.world?.isPaused) return;
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 80);
  }

  /**
   * Handles the death of the small chicken.
   * Stops movement, switches to dead image, and removes from enemies list.
   */
  die() {
    this.isDead = true;
    this.speed = 0;
    this.loadImage(this.IMAGES_DEAD[0]);
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) this.world.level.enemies.splice(index, 1);
    }, 1000);
  }
}
