/**
 * Creates and returns Level 8 configuration.
 * @returns {Level} Configured Level 8 instance.
 */
window.createLevel8 = function () {
  const level_start_x = 600;
  const level_end_x = 16000;
  const usableWidth = level_end_x - level_start_x - 500;

  const enemies = createEnemies(level_start_x, usableWidth, 18, 15, 15600);
  const clouds = createClouds(25);
  const backgroundObjects = createBackgroundObjects(25);
  const bottles = createBottles(15, level_start_x, usableWidth);
  const coins = createWobbleCoins();

  const hearts = createHearts([
    [5000, 200],
    [10000, 150],
    [14000, 220],
  ]);

  const level8 = new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    hearts,
    level_end_x
  );
  level8.number = 8;

  return level8;
};


/**
 * Creates wobbling coins arranged in rows for Level 8.
 * @returns {Coin[]} Array of animated wobbling Coin objects.
 */
function createWobbleCoins() {
  const coins = [];
  const spacingX = 40;
  const coinsPerRow = 5;
  const rowCount = 12;
  const lowY = 160;
  const highY = 280;
  const level_start_x = 600;
  const level_end_x = 15000;
  const usableWidth = level_end_x - level_start_x;
  const totalCoinsWidth = coinsPerRow * spacingX;
  const rowSpacingX = (usableWidth - totalCoinsWidth) / (rowCount - 1);

  for (let row = 0; row < rowCount; row++) {
    const baseX = level_start_x + row * rowSpacingX;
    const yBase = row % 2 === 0 ? lowY : highY;
    for (let i = 0; i < coinsPerRow; i++) {
      const x = baseX + i * spacingX;
      const wobbleOffset = i % 2 === 0 ? 0 : Math.PI;
      const coin = new Coin(x, yBase, wobbleOffset);
      coin.animateWobble();
      coins.push(coin);
    }
  }
  return coins;
}
