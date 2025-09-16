/**
 * Creates and returns Level 7 configuration.
 * @returns {Level} Configured Level 7 instance.
 */
window.createLevel7 = function () {
  const level_start_x = 600;
  const level_end_x = 14000;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 12000;
  const enemies = createEnemies(level_start_x, usableWidth, 15, 12, 13500);
  const clouds = createClouds(25);
  const backgroundObjects = createBackgroundObjects(25);
  const bottles = createBottles(18, level_start_x, usableWidth);
  const coins = createDiagonalCoins(10, 5, coinsStartX, coinsWidth);
  const hearts = createHearts();
  const level = new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    hearts,
    level_end_x
  );
  level.number = 7;
  return level;
};

