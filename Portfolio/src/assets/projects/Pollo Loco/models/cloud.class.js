/**
 * Represents a moving cloud in the background.
 * Extends MovableObject with simple leftward animation.
 */
class Cloud extends MovableObject {
  y = 40;
  width = 400;
  height = 200;

  /**
   * Initializes the cloud with a random horizontal position.
   */
  constructor() {
    super();
    this.loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = 0 + Math.random() * 500;
    this.animate();
  }

  /**
   * Animates the cloud by moving it slowly to the left.
   */
  animate() {
    setInterval(() => {
      this.x -= 0.15;
    }, 1000 / 60);
  }
}
