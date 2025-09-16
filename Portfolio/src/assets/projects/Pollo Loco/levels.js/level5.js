/**
 * Creates and returns Level 5 configuration.
 * @returns {Level} Configured Level 5 instance.
 */
window.createLevel5 = function () {
  const level_start_x = 600;
  const level_end_x = 10000;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 7500;

  // Enemies including big and small chickens plus an endboss
  const enemies = createEnemies(level_start_x, usableWidth, 15, 12, 9200);

  // Clouds and layered background objects
  const clouds = createClouds(18);
  const backgroundObjects = createBackgroundObjects(16);

  // Bottles placed across the level
  const bottles = createBottles(18, level_start_x, usableWidth);

  // Coins arranged diagonally in rows and columns
  const coins = createDiagonalCoins(10, 5, coinsStartX, coinsWidth);

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
