/**
 * Creates background objects for the level.
 * @param {number} levelSegments - Number of level segments.
 * @returns {BackgroundObject[]} Array of background objects.
 */
function createBackgroundObjects(levelSegments) {
  const backgroundObjects = [];
  const segmentWidth = 719;
  const layerFiles = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/",
    "img/5_background/layers/2_second_layer/",
    "img/5_background/layers/1_first_layer/",
  ];

  for (let i = 0; i < levelSegments; i++) {
    const x = i * segmentWidth - segmentWidth;
    backgroundObjects.push(new BackgroundObject(layerFiles[0], x));
    addLayerObjects(backgroundObjects, layerFiles, i, x);
  }
  return backgroundObjects;
}

/**
 * Adds layered background objects to the backgroundObjects array.
 * @param {BackgroundObject[]} backgroundObjects
 * @param {string[]} layerFiles - Array of layer path prefixes.
 * @param {number} segmentIndex - Current segment index.
 * @param {number} x - X position for objects.
 */
function addLayerObjects(backgroundObjects, layerFiles, segmentIndex, x) {
  for (let j = 1; j < layerFiles.length; j++) {
    const layerNum = (segmentIndex % 2) + 1;
    const path = layerFiles[j] + layerNum + ".png";
    backgroundObjects.push(new BackgroundObject(path, x));
  }
}

/**
 * Class representing a game level with all its elements.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  hearts;
  level_end_x;

  /**
   * Create a level instance.
   * @param {MovableObject[]} enemies - Array of enemy objects.
   * @param {Cloud[]} clouds - Array of cloud objects.
   * @param {BackgroundObject[]} backgroundObjects - Background layers.
   * @param {CollectableBottle[]} [bottles=[]] - Collectable bottles.
   * @param {Coin[]} [coins=[]] - Collectable coins.
   * @param {CollectableHeart[]} [hearts=[]] - Collectable hearts.
   * @param {number} [level_end_x=3680] - Level end position.
   */
  constructor(enemies, clouds, backgroundObjects, bottles = [], coins = [], hearts = [], level_end_x = 3680) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
    this.hearts = hearts;
    this.level_end_x = level_end_x;
  }
}

/**
 * Distributes positions evenly within a range.
 * @param {number} count - Number of positions to generate.
 * @param {number} startX - Start x position.
 * @param {number} usableWidth - Width in which to distribute.
 * @returns {number[]} Array of positions.
 */
function distributePositions(count, startX, usableWidth) {
  if (count === 1) return [startX + usableWidth / 2];
  const positions = [];
  const spacing = usableWidth / (count - 1);
  for (let i = 0; i < count; i++) {
    positions.push(startX + i * spacing);
  }
  return positions;
}

/**
 * Creates an array of cloud objects.
 * @param {number} [count=15] - Number of clouds to create.
 * @returns {Cloud[]} Array of clouds.
 */
function createClouds(count = 15) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }
  return clouds;
}

/**
 * Creates collectable bottles positioned evenly.
 * @param {number} count - Number of bottles to create.
 * @param {number} startX - Start x position.
 * @param {number} usableWidth - Width range to distribute bottles.
 * @returns {CollectableBottle[]} Array of bottles.
 */
function createBottles(count, startX, usableWidth) {
  const bottles = [];
  const positions = distributePositions(count, startX, usableWidth);
  for (let i = 0; i < count; i++) {
    bottles.push(new CollectableBottle(positions[i]));
  }
  return bottles;
}

/**
 * Creates diagonal rows of coins with alternating vertical positions.
 * @param {number} [rowCount=10] - Number of rows.
 * @param {number} [coinsPerRow=5] - Coins per row.
 * @param {number} [startX=600] - Start x position.
 * @param {number} [width=9000] - Width over which to distribute rows.
 * @returns {Coin[]} Array of coins.
 */
function createDiagonalCoins(rowCount = 10, coinsPerRow = 5, startX = 600, width = 9000) {
  const coins = [];
  const spacingX = 40;
  const lowY = 160;
  const highY = 280;

  const totalCoinsWidth = spacingX * (coinsPerRow - 1);
  const rowSpacingX = (width - totalCoinsWidth) / (rowCount - 1);

  for (let row = 0; row < rowCount; row++) {
    const baseX = startX + row * rowSpacingX;
    const yStart = row % 2 === 0 ? lowY : highY;
    const yEnd = row % 2 === 0 ? highY : lowY;
    const yStep = (yEnd - yStart) / (coinsPerRow - 1);
    addCoinsRow(coins, baseX, spacingX, yStart, yStep, coinsPerRow);
  }
  return coins;
}

/**
 * Helper to add a row of coins diagonally.
 * @param {Coin[]} coins - Array to add coins to.
 * @param {number} baseX - Starting x position of the row.
 * @param {number} spacingX - Horizontal spacing between coins.
 * @param {number} yStart - Starting y position.
 * @param {number} yStep - Y increment per coin.
 * @param {number} coinsPerRow - Number of coins in the row.
 */
function addCoinsRow(coins, baseX, spacingX, yStart, yStep, coinsPerRow) {
  for (let i = 0; i < coinsPerRow; i++) {
    const x = baseX + i * spacingX;
    const y = yStart + i * yStep;
    coins.push(new Coin(x, y));
  }
}

/**
 * Creates enemy objects including chickens and optionally a boss.
 * @param {number} level_start_x - Starting x position of enemies.
 * @param {number} usableWidth - Width range for distributing enemies.
 * @param {number} bigChickenCount - Number of big chickens.
 * @param {number} smallChickenCount - Number of small chickens.
 * @param {number} bossX - X position of the boss (optional).
 * @returns {MovableObject[]} Array of enemies.
 */
function createEnemies(level_start_x, usableWidth, bigChickenCount, smallChickenCount, bossX) {
  const enemies = [];
  addChickens(enemies, bigChickenCount, level_start_x, usableWidth, Chicken);
  addChickens(enemies, smallChickenCount, level_start_x, usableWidth, SmallChicken);
  if (typeof bossX === 'number') {
    const boss = new Endboss();
    boss.x = bossX;
    enemies.push(boss);
  }
  return enemies;
}

/**
 * Adds chickens of a specific type to the enemies array.
 * @param {MovableObject[]} enemies - Array to add chickens to.
 * @param {number} count - Number of chickens to add.
 * @param {number} startX - Starting x position.
 * @param {number} usableWidth - Width range for distribution.
 * @param {Function} ChickenType - Class constructor for chicken type.
 */
function addChickens(enemies, count, startX, usableWidth, ChickenType) {
  const positions = distributePositions(count, startX, usableWidth);
  for (let pos of positions) {
    const chicken = new ChickenType();
    chicken.x = pos;
    enemies.push(chicken);
  }
}

/**
 * Creates collectable hearts at specified positions.
 * @param {Array.<number[]>} [positions=[[2000,200], [6000,150], [8000,220]]] - Array of [x,y] positions.
 * @returns {CollectableHeart[]} Array of hearts.
 */
function createHearts(positions = [[2000,200], [6000,150], [8000,220]]) {
  const hearts = [];
  for (let [x, y] of positions) {
    hearts.push(new CollectableHeart(x, y));
  }
  return hearts;
}
