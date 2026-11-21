// game/src/config.js
// Configuration constants, level definitions, layout geometry, and gameplay tuning.

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const PANELS = {
  left: {
    id: 'left',
    x: 36,
    y: 76,
    width: 586,
    height: 624,
  },
  right: {
    id: 'right',
    x: 658,
    y: 76,
    width: 586,
    height: 624,
  },
  dividerGap: 36,
  borderRadius: 14,
  borderWidth: 3,
};

export const LEVELS = [
  {
    index: 0,
    id: 'harbor',
    name: 'Lighthouse Harbor',
    subtitle: 'Twilight Port',
    differencesCount: 5,
    timeLimit: 90,
    sceneKey: 'harbor',
    description: 'A cozy coastal harbor bathed in the golden amber of late twilight.',
  },
  {
    index: 1,
    id: 'bazaar',
    name: 'Night Bazaar',
    subtitle: 'Lantern Alley',
    differencesCount: 7,
    timeLimit: 100,
    sceneKey: 'bazaar',
    description: 'A vibrant desert spice market illuminated by hanging paper lamps.',
  },
  {
    index: 2,
    id: 'greenhouse',
    name: 'Greenhouse Lab',
    subtitle: 'Botanical Glasshouse',
    differencesCount: 9,
    timeLimit: 110,
    sceneKey: 'greenhouse',
    description: 'A sprawling Victorian greenhouse filled with exotic flora and glassware.',
  },
  {
    index: 3,
    id: 'attic',
    name: 'Clockwork Attic',
    subtitle: 'Gear & Pendulum Loft',
    differencesCount: 10,
    timeLimit: 120,
    sceneKey: 'attic',
    description: 'A dusty inventor\'s workshop overflowing with brass horology and blueprints.',
  },
];

export const GAMEPLAY = {
  baseHitScore: 250,
  timeBonusPerSecond: 15,
  comboWindowSeconds: 4.5,
  maxComboMultiplier: 5,
  errorPenaltySeconds: 5,
  maxHintsPerLevel: 3,
  hintDurationSeconds: 6.0,
  hitToleranceRadiusMargin: 12, // extra click margin for fairness
  starThresholds: [
    { stars: 3, minAccuracy: 0.85, minTimeRatio: 0.4 },
    { stars: 2, minAccuracy: 0.65, minTimeRatio: 0.15 },
    { stars: 1, minAccuracy: 0.0, minTimeRatio: 0.0 },
  ],
};

export const SHOTS_CONFIG = {
  coverLevel: 2, // 0-indexed Level 3: Greenhouse Lab
  coverTargetFound: 4,
  coverTotalDiffs: 9,
  coverTimeProgress: 0.45,
};
