/**
 * Creates and returns Level 4 configuration.
 * @returns {Level} Configured Level 4 instance.
 */
window.createLevel4 = function () {
  const level_start_x = 600;
  const level_end_x = 7200;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 5600;

  // Enemies including big and small chickens plus an endboss
  const enemies = createEnemies(level_start_x, usableWidth, 10, 8, 6800);

  // Clouds and layered background objects
  const clouds = createClouds(15);
  const backgroundObjects = createBackgroundObjects(12);

  // Bottles spread throughout the level
  const bottles = createBottles(12, level_start_x, usableWidth);

  // Coins arranged diagonally with specified rows and columns
  const coins = createDiagonalCoins(9, 5, coinsStartX, coinsWidth);

  // Return constructed Level instance
  return new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    [],
    level_end_x
  );
};
