/**
 * Represents a walking enemy chicken in the game.
 * Extends MovableObject with walking and death animations.
 */
class Chicken extends MovableObject {
  y = 360;
  height = 70;
  width = 60;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  isDead = false;

  /**
   * Initializes the chicken with random starting position and speed.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 500;
    this.speed = 0.2 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Starts animation intervals for walking movement and walking sprites.
   */
  animate() {
    setInterval(() => {
      if (this.world?.isPaused) return;
      this.moveLeft();
    }, 1000 / 60);

    this.walkInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Handles death of the chicken:
   * - Sets dead flag
   * - Stops movement
   * - Shows dead image
   * - Removes from enemy list after 1 second
   */
  die() {
    this.isDead = true;
    this.speed = 0;
    this.loadImage(this.IMAGES_DEAD[0]);

    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 1000);
  }
}
