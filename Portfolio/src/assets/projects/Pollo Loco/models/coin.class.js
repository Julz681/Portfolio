/**
 * Represents a collectible coin with wobble animation.
 * Extends MovableObject to add floating effect.
 */
class Coin extends MovableObject {
  baseY;
  wobbleOffset;

  /**
   * Creates a coin at position (x, y) with an optional wobble offset.
   * @param {number} x - Horizontal position of the coin.
   * @param {number} y - Vertical base position of the coin.
   * @param {number} [wobbleOffset=0] - Phase offset for wobble animation.
   */
  constructor(x, y, wobbleOffset = 0) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 80;
    this.height = 80;
    this.wobbleOffset = wobbleOffset;
  }

  /**
   * Animates the coin with a smooth vertical wobble.
   */
  animateWobble() {
    setInterval(() => {
      const time = Date.now() / 500;
      this.y = this.baseY + Math.sin(time + this.wobbleOffset) * 15;
    }, 50);
  }
}
