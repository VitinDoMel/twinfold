// Game configuration and constants
// Target resolution: 1280 x 720 (16:9)

export const VIEW = {
  WIDTH: 1280,
  HEIGHT: 720,
  HEADER_HEIGHT: 76,
  PANEL_Y: 86,
  PANEL_W: 590,
  PANEL_H: 596,
  PANEL_LEFT_X: 34,
  PANEL_RIGHT_X: 656,
  DIVIDER_X: 640,
  HIT_RADIUS: 36,
  MISS_PENALTY_SEC: 5,
};

export const LEVELS = [
  {
    id: 1,
    key: 'harbor',
    title: 'Lighthouse Harbor',
    subtitle: 'Twilight at the Forgotten Pier',
    differencesCount: 5,
    timeLimit: 90,
    hintCharges: 3,
  },
  {
    id: 2,
    key: 'bazaar',
    title: 'Night Bazaar',
    subtitle: 'Silk Road Lantern Market',
    differencesCount: 7,
    timeLimit: 100,
    hintCharges: 3,
  },
  {
    id: 3,
    key: 'greenhouse',
    title: 'Greenhouse Lab',
    subtitle: 'Victorian Botanical Alchemical Conservatory',
    differencesCount: 9,
    timeLimit: 110,
    hintCharges: 3,
  },
  {
    id: 4,
    key: 'attic',
    title: 'Clockwork Attic',
    subtitle: 'Master Horologist’s Observatory',
    differencesCount: 10,
    timeLimit: 120,
    hintCharges: 3,
  },
];

export const SCORING = {
  BASE_FIND_POINTS: 1000,
  COMBO_BONUS_MULTIPLIER: 0.25,
  COMBO_WINDOW_SEC: 4.0,
  HINT_PENALTY_POINTS: 150,
  TIME_BONUS_PER_SEC: 50,
  STAR_THRESHOLDS: [
    { stars: 1, percent: 0.0 },
    { stars: 2, percent: 0.5 },
    { stars: 3, percent: 0.75 },
  ],
};
