/**
 * Represents a collectable bottle object in the game.
 * Extends MovableObject and randomly selects one of the bottle images.
 */
class CollectableBottle extends MovableObject {
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a collectable bottle at a specified x position.
   * @param {number} x - The horizontal position of the bottle.
   */
  constructor(x) {
    super();
    const randomImg = this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)];
    this.loadImage(randomImg);
    this.x = x;
    this.y = 365;
    this.height = 60;
    this.width = 40;
  }
}
