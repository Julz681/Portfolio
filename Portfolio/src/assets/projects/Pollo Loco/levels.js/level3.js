/**
 * Creates and returns Level 3 configuration.
 * @returns {Level} Configured Level 3 instance.
 */
window.createLevel3 = function () {
  const level_start_x = 600;
  const level_end_x = 5200;
  const usableWidth = level_end_x - level_start_x - 500;

  // Create enemies using helper function: 6 big chickens, 4 small chickens, 1 endboss
  const enemies = createEnemies(level_start_x, usableWidth, 6, 4, 4900);

  // Environmental elements: clouds and background objects
  const clouds = createClouds(15);
  const backgroundObjects = createBackgroundObjects(12);

  // Bottles spread across the level
  const bottles = createBottles(7, level_start_x, usableWidth);

  // Coins arranged in rows with alternating heights
  const coins = [];
  const spacingX = 40;
  const coinsPerRow = 5;
  const rowCount = 8;
  const lowY = 160;
  const highY = 280;

  const totalCoinsWidth = coinsPerRow * spacingX;
  const rowSpacingX = (usableWidth - totalCoinsWidth) / (rowCount - 1);

  for (let row = 0; row < rowCount; row++) {
    const baseX = level_start_x + row * rowSpacingX;
    const y = row % 2 === 0 ? lowY : highY;
    for (let i = 0; i < coinsPerRow; i++) {
      coins.push(new Coin(baseX + i * spacingX, y));
    }
  }

  // Return the constructed level
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
