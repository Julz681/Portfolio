window.createLevel6 = function () {
  const level_start_x = 600;
  const level_end_x = 12000;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 10000;
  const enemies = createEnemies(level_start_x, usableWidth, 15, 12, 11500);
  const clouds = createClouds(20);
  const backgroundObjects = createBackgroundObjects(20);
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
  level.number = 6;
  return level;
};
