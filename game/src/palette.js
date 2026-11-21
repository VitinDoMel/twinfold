// Cohesive color palettes and color manipulation utilities

export const PALETTE = {
  ui: {
    bgDark: '#0e1117',
    bgPanel: '#161b24',
    panelBorder: '#2d3748',
    panelBorderGlow: '#4a5568',
    panelDivider: '#1f242e',
    textLight: '#f7fafc',
    textMuted: '#a0aec0',
    textDim: '#718096',
    gold: '#ecc94b',
    goldGlow: '#d69e2e',
    amber: '#dd6b20',
    green: '#38a169',
    greenBright: '#48bb78',
    greenGlow: 'rgba(72, 187, 120, 0.4)',
    red: '#e53e3e',
    redGlow: 'rgba(229, 62, 62, 0.45)',
    blue: '#3182ce',
    blueBright: '#63b3ed',
    purple: '#805ad5',
  },

  harbor: {
    skyTop: '#13192f',
    skyMid: '#2d3356',
    skyHorizon: '#e07a5f',
    skyGlow: '#f4a261',
    sun: '#fbd38d',
    mountainsFar: '#272b47',
    mountainsMid: '#1e2238',
    waterDeep: '#0f172a',
    waterMid: '#1b2d4b',
    waterFoam: '#63b3ed',
    waterHighlight: '#fbd38d',
    pierWoodDark: '#2c1e19',
    pierWoodMid: '#4a332a',
    pierWoodLight: '#6e4c3e',
    pierPlanks: '#583e33',
    lighthouseWhite: '#edf2f7',
    lighthouseRed: '#c53030',
    lighthouseBase: '#4a5568',
    lighthouseRoof: '#1a202c',
    beaconGlow: '#feebc8',
    beaconBeam: 'rgba(254, 235, 200, 0.22)',
    sailCanvas: '#f7fafc',
    sailFold: '#cbd5e0',
    boatWood: '#744210',
    boatTrim: '#975a16',
    barrelWood: '#5b3a29',
    barrelHoop: '#2d3748',
    crateWood: '#975a16',
    cratePlank: '#b7791f',
    rope: '#d69e2e',
    lanternBrass: '#b7791f',
    lanternFlame: '#f6ad55',
    seagullBody: '#f7fafc',
    seagullWing: '#a0aec0',
    seagullBeak: '#ed8936',
  },
};

/**
 * Converts Hex string to rgba string
 * @param {string} hex e.g. #38a169
 * @param {number} alpha e.g. 0.5
 * @returns {string}
 */
export function hexToRgba(hex, alpha = 1.0) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Linearly interpolates between two colors
 * @param {string} hexA 
 * @param {string} hexB 
 * @param {number} t 0.0 to 1.0
 * @returns {string}
 */
export function lerpColor(hexA, hexB, t) {
  const parse = (h) => {
    let clean = h.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(ch => ch + ch).join('');
    const n = parseInt(clean, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const a = parse(hexA);
  const b = parse(hexB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const blue = Math.round(a[2] + (b[2] - a[2]) * t);

  return `rgb(${r}, ${g}, ${blue})`;
}

/**
 * Adjust brightness of a hex color
 * @param {string} hex 
 * @param {number} percent -100 to 100
 * @returns {string}
 */
export function adjustBrightness(hex, percent) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) clean = clean.split('').map(ch => ch + ch).join('');
  const num = parseInt(clean, 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
