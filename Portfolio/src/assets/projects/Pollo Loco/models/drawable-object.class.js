/**
 * Base class for drawable objects on the canvas.
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 290;
  height = 150;
  width = 100;

  /**
   * Loads an image from a given path.
   * @param {string} path - The URL/path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images and caches them for animation or flipping.
   * @param {string[]} arr - Array of image paths to load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = "transform: scaleX(-1)"; 
      this.imageCache[path] = img;
    });
  }
}
