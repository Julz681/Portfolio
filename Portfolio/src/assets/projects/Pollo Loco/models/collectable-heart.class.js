/**
 * Represents a collectible heart that wobbles up and down.
 * Extends MovableObject to include wobble animation.
 */
class CollectableHeart extends MovableObject {
  /**
   * Creates a heart collectible at the specified (x, y) position.
   * @param {number} x - Horizontal position of the heart.
   * @param {number} y - Vertical position of the heart.
   */
  constructor(x, y) {
    super();
    this.loadImage("img/7_statusbars/3_icons/icon_health.png");
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 60;
    this.height = 60;

    this.animateWobble();
  }

  /**
   * Animates the heart with a smooth vertical wobble effect.
   */
  animateWobble() {
    setInterval(() => {
      const time = Date.now() / 600;
      this.y = this.baseY + Math.sin(time) * 10;
    }, 50);
  }
}
