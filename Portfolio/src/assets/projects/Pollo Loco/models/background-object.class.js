/**
 * Represents a background object in the game world.
 * Extends MovableObject with fixed size and position based on the image.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a BackgroundObject.
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - The horizontal position of the object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
