// Cohesive color palettes and color manipulation utilities

export const PALETTE = {
  ui: {
    bgDark: '#0b0e14',
    bgPanel: '#141822',
    panelBorder: '#273142',
    panelBorderGlow: '#3e4e68',
    panelDivider: '#1a202c',
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

  bazaar: {
    skyNight: '#0c0b1e',
    skyMid: '#1b1435',
    skyHorizon: '#331d4a',
    stars: '#fef3c7',
    moon: '#fde68a',
    moonGlow: 'rgba(253, 230, 138, 0.25)',
    sandGround: '#38221c',
    stonePave: '#2a1a1e',
    tentMaroon: '#7c1c2e',
    tentGold: '#d97706',
    tentTeal: '#0f766e',
    tentPurple: '#581c87',
    tentCream: '#fef3c7',
    lanternBrass: '#d97706',
    lanternGlowWarm: 'rgba(245, 158, 11, 0.35)',
    lanternGlowTurquoise: 'rgba(20, 184, 166, 0.35)',
    lanternGlowRose: 'rgba(244, 63, 94, 0.35)',
    rugRed: '#991b1b',
    rugBlue: '#1e3a8a',
    rugBorder: '#fef08a',
    spiceSaffron: '#f59e0b',
    spicePaprika: '#dc2626',
    spiceTurmeric: '#fbbf24',
    spiceIndigo: '#312e81',
    brassTeapot: '#f59e0b',
    clayJar: '#b45309',
    melonGreen: '#16a34a',
    pomegranate: '#be123c',
  },

  greenhouse: {
    skyTwilight: '#06131e',
    glassDome: 'rgba(147, 197, 253, 0.12)',
    ironFrame: '#1e293b',
    ironFrameHighlight: '#334155',
    mossDark: '#14311e',
    fernGreen: '#15803d',
    fernBright: '#22c55e',
    fernShadow: '#052e16',
    orchidMagenta: '#c026d3',
    orchidPetal: '#f472b6',
    benchWood: '#451a03',
    benchWoodLight: '#78350f',
    glassFlask: 'rgba(224, 242, 254, 0.65)',
    potionEmerald: '#10b981',
    potionEmeraldGlow: 'rgba(16, 185, 129, 0.5)',
    potionAmethyst: '#a855f7',
    potionAmethystGlow: 'rgba(168, 85, 247, 0.5)',
    potionAmber: '#f59e0b',
    potionAmberGlow: 'rgba(245, 158, 11, 0.5)',
    potionAzure: '#06b6d4',
    brassInstrument: '#d97706',
    brassShine: '#fde047',
    butterflyWing: '#0284c7',
    butterflySpot: '#38bdf8',
    steamVapor: 'rgba(241, 245, 249, 0.25)',
  },

  attic: {
    wallWoodDark: '#1c1917',
    wallWoodMid: '#292524',
    rafterBeam: '#171412',
    skylightGlass: '#0f172a',
    moonbeam: 'rgba(186, 230, 253, 0.18)',
    moonbeamCore: 'rgba(224, 242, 254, 0.28)',
    brassGear: '#b45309',
    brassGearLight: '#d97706',
    brassGearTeeth: '#f59e0b',
    bronzeGear: '#92400e',
    steelGear: '#475569',
    steelGearHighlight: '#94a3b8',
    clockWood: '#3b1d11',
    clockFace: '#fef3c7',
    clockHands: '#0f172a',
    clockGoldRim: '#d97706',
    pendulumRod: '#d97706',
    pendulumBob: '#f59e0b',
    telescopeBrass: '#d97706',
    telescopeStand: '#334155',
    hourglassWood: '#78350f',
    hourglassSand: '#fde047',
    parchment: '#fef3c7',
    parchmentInk: '#1e293b',
    parchmentShadow: '#d97706',
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
