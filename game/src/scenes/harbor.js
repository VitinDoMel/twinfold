// Lighthouse Harbor Scene (Scene 1)
// Procedural vector illustration with high visual detail and 12 distinct difference candidates.

import { Painter } from '../painter.js';
import { PALETTE, hexToRgba, lerpColor } from '../palette.js';
import { VIEW } from '../config.js';

export const HARBOR_CANDIDATE_DIFFERENCES = [
  {
    id: 'diff_seagull_upper',
    name: 'Upper Flying Seagull',
    description: 'Seagull soaring in the high twilight sky',
    x: 185,
    y: 75,
    radius: 30,
    type: 'visibility', // present on left, missing on right
  },
  {
    id: 'diff_lighthouse_window',
    name: 'Lighthouse Tower Window',
    description: 'Warm glowing arched window on the central shaft',
    x: 488,
    y: 228,
    radius: 26,
    type: 'state', // glowing warm yellow on left, dark navy on right
  },
  {
    id: 'diff_lighthouse_band',
    name: 'Red Stripe Count',
    description: 'Red masonry band on the lighthouse tower',
    x: 488,
    y: 175,
    radius: 28,
    type: 'color', // crimson red on left, deep navy blue on right
  },
  {
    id: 'diff_weathervane_arrow',
    name: 'Dome Weathervane Spire',
    description: 'Directional arrow atop the lighthouse copper dome',
    x: 488,
    y: 42,
    radius: 24,
    type: 'rotation', // pointing right on left, pointing left on right
  },
  {
    id: 'diff_dock_lantern',
    name: 'Pier Hanging Lantern',
    description: 'Brass lantern hanging from the dock stanchion post',
    x: 348,
    y: 432,
    radius: 28,
    type: 'light', // brightly lit with warm radial aura on left, unlit dark glass on right
  },
  {
    id: 'diff_stacked_barrel',
    name: 'Fish Barrel on Pier',
    description: 'Wooden cargo barrel beside the pier crate stack',
    x: 520,
    y: 488,
    radius: 32,
    type: 'object', // double stacked barrel on left, single barrel on right
  },
  {
    id: 'diff_cutter_pennant',
    name: 'Masthead Pennant Flag',
    description: 'Fluttering streamer flag atop the boat mast',
    x: 142,
    y: 286,
    radius: 26,
    type: 'color', // golden-amber pennant on left, emerald green on right
  },
  {
    id: 'diff_floating_buoy',
    name: 'Harbor Channel Buoy',
    description: 'Floating navigational marker buoy in open water',
    x: 275,
    y: 365,
    radius: 28,
    type: 'color', // crimson red marker on left, bright yellow marker on right
  },
  {
    id: 'diff_perched_bird',
    name: 'Perched Pier Seagull',
    description: 'Seagull resting on the outer wooden piling',
    x: 74,
    y: 442,
    radius: 26,
    type: 'visibility', // perched resting on left, missing on right
  },
  {
    id: 'diff_crate_marking',
    name: 'Cargo Crate Stencil',
    description: 'Anchor insignia stenciled onto the wooden dock crate',
    x: 446,
    y: 508,
    radius: 26,
    type: 'detail', // maritime anchor symbol on left, star emblem on right
  },
  {
    id: 'diff_distant_ship',
    name: 'Distant Horizon Sailboat',
    description: 'Small silhouette vessel cruising the twilight horizon',
    x: 358,
    y: 310,
    radius: 24,
    type: 'visibility', // visible silhouette on left, missing on right
  },
  {
    id: 'diff_coiled_rope',
    name: 'Dock Hemp Rope Coil',
    description: 'Neatly coiled mooring rope resting near the bollard',
    x: 236,
    y: 512,
    radius: 26,
    type: 'visibility', // rope coil present on left, absent on right
  },
];

export class HarborScene {
  constructor() {
    this.key = 'harbor';
    this.title = 'Lighthouse Harbor';
    this.width = VIEW.PANEL_W;
    this.height = VIEW.PANEL_H;
  }

  /**
   * Renders the complete Lighthouse Harbor vector scene.
   * @param {CanvasRenderingContext2D} ctx 
   * @param {'left'|'right'} panelSide 
   * @param {Map<string, Object>} activeMutations Map of diffId -> mutation config
   * @param {number} timeElapsed For subtle animations (lights, water shimmer)
   */
  render(ctx, panelSide, activeMutations = new Map(), timeElapsed = 0) {
    const W = this.width;
    const H = this.height;
    const isRight = panelSide === 'right';

    ctx.save();
    // Clip strictly to panel boundaries
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.clip();

    // Helper to test if a mutation is active on the right panel
    const hasDiff = (id) => isRight && activeMutations.has(id);
    const getDiff = (id) => (isRight ? activeMutations.get(id) : null);

    // -------------------------------------------------------------
    // 1. SKY GRADIENT (Sunset Twilight)
    // -------------------------------------------------------------
    const skyGrad = Painter.linearGradient(ctx, 0, 0, 0, H * 0.6, [
      [0.0, PALETTE.harbor.skyTop],
      [0.35, PALETTE.harbor.skyMid],
      [0.72, PALETTE.harbor.skyHorizon],
      [1.0, PALETTE.harbor.skyGlow],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H * 0.6, 0, skyGrad);

    // -------------------------------------------------------------
    // 2. SETTING SUN & SKY GLOW
    // -------------------------------------------------------------
    const sunX = 310;
    const sunY = 270;
    const sunAura = Painter.radialGradient(ctx, sunX, sunY, 10, sunX, sunY, 180, [
      [0.0, 'rgba(251, 211, 141, 0.85)'],
      [0.25, 'rgba(244, 162, 97, 0.45)'],
      [0.6, 'rgba(224, 122, 95, 0.2)'],
      [1.0, 'rgba(224, 122, 95, 0.0)'],
    ]);
    Painter.circle(ctx, sunX, sunY, 180, sunAura);
    Painter.circle(ctx, sunX, sunY, 26, '#fff5df');

    // -------------------------------------------------------------
    // 3. TWILIGHT CLOUDS (Catching golden underbelly light)
    // -------------------------------------------------------------
    Painter.cloud(ctx, 40, 60, 150, 36, 'rgba(235, 130, 100, 0.35)');
    Painter.cloud(ctx, 45, 63, 140, 30, 'rgba(255, 200, 160, 0.25)');

    Painter.cloud(ctx, 230, 110, 190, 44, 'rgba(215, 110, 95, 0.32)');
    Painter.cloud(ctx, 235, 113, 180, 36, 'rgba(254, 215, 175, 0.22)');

    // Difference 1: Upper Flying Seagull
    const hideUpperGull = hasDiff('diff_seagull_upper');
    if (!hideUpperGull) {
      Painter.seagull(ctx, 185, 75, 1.25, -0.08, true);
    }
    // Ambient companion gull
    Painter.seagull(ctx, 220, 92, 0.85, 0.05, false);
    Painter.seagull(ctx, 150, 115, 0.7, -0.12, true);

    // -------------------------------------------------------------
    // 4. DISTANT MOUNTAINS & CLIFFS
    // -------------------------------------------------------------
    // Far layer
    Painter.polygon(ctx, [
      [0, 310],
      [70, 275],
      [150, 290],
      [230, 260],
      [320, 295],
      [390, 270],
      [440, 295],
      [470, 315],
      [0, 315]
    ], '#252945');

    // Mid layer (Right Headland where Lighthouse stands)
    Painter.polygon(ctx, [
      [360, 335],
      [410, 300],
      [450, 310],
      [510, 280],
      [590, 285],
      [590, 360],
      [360, 360]
    ], '#1e2238');

    // Difference 11: Distant Horizon Sailboat
    const hideDistantShip = hasDiff('diff_distant_ship');
    if (!hideDistantShip) {
      // Silhouette of tiny cruising cutter
      Painter.polygon(ctx, [
        [350, 312],
        [368, 312],
        [364, 316],
        [353, 316]
      ], '#1a1f33');
      Painter.line(ctx, 359, 312, 359, 298, '#1a1f33', 1.2);
      Painter.polygon(ctx, [
        [359, 299],
        [366, 310],
        [359, 310]
      ], 'rgba(235, 240, 255, 0.55)');
    }

    // -------------------------------------------------------------
    // 5. HARBOR WATER & SPECULAR GLOW
    // -------------------------------------------------------------
    const waterGrad = Painter.linearGradient(ctx, 0, 310, 0, H, [
      [0.0, PALETTE.harbor.waterMid],
      [0.35, '#15243d'],
      [1.0, PALETTE.harbor.waterDeep],
    ]);
    Painter.roundedRect(ctx, 0, 310, W, H - 310, 0, waterGrad);

    // Golden specular reflection lane from setting sun
    const sunReflect = Painter.linearGradient(ctx, 240, 310, 380, 310, [
      [0.0, 'rgba(251, 211, 141, 0.0)'],
      [0.5, 'rgba(251, 211, 141, 0.38)'],
      [1.0, 'rgba(251, 211, 141, 0.0)'],
    ]);
    Painter.roundedRect(ctx, 240, 310, 140, 90, 0, sunReflect);

    // Ambient horizontal wave lines
    const waveRows = [
      { y: 325, amp: 1.2, freq: 0.06, color: 'rgba(251, 211, 141, 0.45)', w: 160, x: 230 },
      { y: 345, amp: 1.5, freq: 0.05, color: 'rgba(251, 211, 141, 0.35)', w: 220, x: 200 },
      { y: 375, amp: 2.0, freq: 0.04, color: 'rgba(99, 179, 237, 0.28)', w: 320, x: 100 },
      { y: 410, amp: 2.5, freq: 0.035, color: 'rgba(99, 179, 237, 0.22)', w: 380, x: 60 },
      { y: 450, amp: 3.0, freq: 0.03, color: 'rgba(99, 179, 237, 0.18)', w: 350, x: 30 },
    ];
    for (const row of waveRows) {
      Painter.wave(ctx, row.x, row.y, row.w, row.amp, row.freq, row.color, 1.4);
    }

    // Difference 8: Floating Channel Buoy
    const buoyDiff = hasDiff('diff_floating_buoy');
    const buoyColor = buoyDiff ? '#ecc94b' : '#e53e3e'; // yellow on mutated right, red on left
    const buoyLightColor = buoyDiff ? '#fff' : '#fed7d7';
    // Buoy base & cage
    Painter.ellipse(ctx, 275, 372, 14, 5, 0, '#101726');
    Painter.polygon(ctx, [
      [267, 372],
      [283, 372],
      [279, 356],
      [271, 356]
    ], buoyColor, '#1a202c', 1.2);
    // Mast & lantern atop buoy
    Painter.line(ctx, 275, 356, 275, 344, '#2d3748', 1.6);
    Painter.circle(ctx, 275, 343, 3, buoyLightColor);
    Painter.circle(ctx, 275, 343, 8, hexToRgba(buoyLightColor, 0.4));

    // -------------------------------------------------------------
    // 6. ROCKY CLIFF & LIGHTHOUSE PROMONTORY (Right side)
    // -------------------------------------------------------------
    Painter.polygon(ctx, [
      [420, 360],
      [445, 320],
      [475, 310],
      [525, 295],
      [590, 305],
      [590, 420],
      [450, 410],
      [420, 360]
    ], '#2d3748', '#1a202c', 1.5);

    // Cliff ledge highlights
    Painter.polygon(ctx, [
      [445, 320],
      [475, 310],
      [525, 295],
      [540, 310],
      [480, 325],
      [445, 320]
    ], '#4a5568');

    // -------------------------------------------------------------
    // 7. THE GRAND LIGHTHOUSE
    // -------------------------------------------------------------
    const lhX = 488; // Lighthouse centerline
    const lhBaseY = 300;

    // Stone masonry octagonal foundation
    Painter.polygon(ctx, [
      [lhX - 38, lhBaseY],
      [lhX + 38, lhBaseY],
      [lhX + 32, lhBaseY - 24],
      [lhX - 32, lhBaseY - 24]
    ], '#374151', '#1f2937', 1.5);
    // Foundation arched doorway
    Painter.roundedRect(ctx, lhX - 6, lhBaseY - 20, 12, 18, 5, '#111827', '#4b5563', 1);

    // Tapered Tower Shaft (White with Red Bands)
    // Lower Tower Section
    const towerPts = [
      [lhX - 28, lhBaseY - 24],
      [lhX + 28, lhBaseY - 24],
      [lhX + 18, lhBaseY - 200],
      [lhX - 18, lhBaseY - 200]
    ];
    Painter.polygon(ctx, towerPts, '#edf2f7', '#cbd5e0', 1.5);

    // Tower shading (curved cylindrical gradient feel)
    Painter.polygon(ctx, [
      [lhX + 6, lhBaseY - 24],
      [lhX + 28, lhBaseY - 24],
      [lhX + 18, lhBaseY - 200],
      [lhX + 4, lhBaseY - 200]
    ], 'rgba(160, 174, 192, 0.45)');

    // Difference 3: Lighthouse Red Masonry Band Color
    const bandDiff = hasDiff('diff_lighthouse_band');
    const bandColor = bandDiff ? '#2b4c7e' : PALETTE.harbor.lighthouseRed; // Navy blue if mutated, else Red

    // Primary lower red band
    Painter.polygon(ctx, [
      [lhX - 25, lhBaseY - 60],
      [lhX + 25, lhBaseY - 60],
      [lhX + 23, lhBaseY - 95],
      [lhX - 23, lhBaseY - 95]
    ], bandColor, '#9b2c2c', 1);

    // Upper red band (Subject of difference)
    Painter.polygon(ctx, [
      [lhX - 21, lhBaseY - 145],
      [lhX + 21, lhBaseY - 145],
      [lhX + 19, lhBaseY - 175],
      [lhX - 19, lhBaseY - 175]
    ], bandColor, '#742a2a', 1);

    // Difference 2: Lighthouse Tower Window
    const winDiff = hasDiff('diff_lighthouse_window');
    const winColor = winDiff ? '#1a202c' : '#f6ad55'; // Dark unlit vs warm golden lit
    Painter.roundedRect(ctx, lhX - 4, lhBaseY - 78, 8, 14, 4, winColor, '#2d3748', 1);
    if (!winDiff) {
      // Glow aura around window
      Painter.circle(ctx, lhX, lhBaseY - 71, 10, 'rgba(246, 173, 85, 0.4)');
    }

    // Gallery Balcony Platform & Railing
    Painter.roundedRect(ctx, lhX - 24, lhBaseY - 206, 48, 6, 2, '#2d3748', '#1a202c', 1.2);
    // Railing posts
    for (let rx = lhX - 22; rx <= lhX + 22; rx += 7) {
      Painter.line(ctx, rx, lhBaseY - 206, rx, lhBaseY - 216, '#4a5568', 1.2);
    }
    Painter.line(ctx, lhX - 23, lhBaseY - 216, lhX + 23, lhBaseY - 216, '#2d3748', 1.5);

    // Lantern Room (Glass chamber)
    Painter.roundedRect(ctx, lhX - 15, lhBaseY - 232, 30, 26, 2, '#fffaf0', '#2d3748', 1.5);
    // Glass panes & interior prism lens
    Painter.circle(ctx, lhX, lhBaseY - 220, 7, '#fbd38d');
    Painter.line(ctx, lhX - 7, lhBaseY - 232, lhX - 7, lhBaseY - 206, '#4a5568', 1);
    Painter.line(ctx, lhX + 7, lhBaseY - 232, lhX + 7, lhBaseY - 206, '#4a5568', 1);

    // Sweeping Volumetric Beacon Light Beam
    Painter.polygon(ctx, [
      [lhX - 8, lhBaseY - 220],
      [0, lhBaseY - 260],
      [0, lhBaseY - 160],
      [lhX - 8, lhBaseY - 218]
    ], PALETTE.harbor.beaconBeam);

    // Conical Copper Dome Roof
    Painter.polygon(ctx, [
      [lhX - 17, lhBaseY - 232],
      [lhX + 17, lhBaseY - 232],
      [lhX, lhBaseY - 254]
    ], '#2c5282', '#1a365d', 1.5);

    // Difference 4: Weathervane Arrow Spire
    const spireDiff = hasDiff('diff_weathervane_arrow');
    const spireY = lhBaseY - 254;
    Painter.line(ctx, lhX, spireY, lhX, spireY - 14, '#2d3748', 1.8);
    Painter.circle(ctx, lhX, spireY - 14, 2.5, '#ecc94b');
    // Arrow direction: points right (+1) on left panel, points left (-1) if mutated on right panel
    const arrowDir = spireDiff ? -1 : 1;
    Painter.line(ctx, lhX - 10 * arrowDir, spireY - 14, lhX + 10 * arrowDir, spireY - 14, '#cbd5e0', 1.5);
    Painter.polygon(ctx, [
      [lhX + 10 * arrowDir, spireY - 14],
      [lhX + 6 * arrowDir, spireY - 17],
      [lhX + 6 * arrowDir, spireY - 11]
    ], '#cbd5e0');

    // -------------------------------------------------------------
    // 8. MOORED FISHING CUTTER BOAT (Midground Left)
    // -------------------------------------------------------------
    const boatX = 140;
    const boatY = 380;

    // Wooden Hull
    Painter.polygon(ctx, [
      [boatX - 55, boatY],
      [boatX + 65, boatY],
      [boatX + 50, boatY + 22],
      [boatX - 42, boatY + 22]
    ], PALETTE.harbor.boatWood, '#2d1b0d', 1.5);

    // Painted waterline stripe
    Painter.polygon(ctx, [
      [boatX - 51, boatY + 12],
      [boatX + 60, boatY + 12],
      [boatX + 56, boatY + 17],
      [boatX - 47, boatY + 17]
    ], '#3182ce', '#1a365d', 0.8);

    // Small Cabin on deck
    Painter.roundedRect(ctx, boatX - 25, boatY - 16, 45, 16, 2, '#4a332a', '#1a1412', 1.2);
    // Brass Porthole Window
    Painter.circle(ctx, boatX - 4, boatY - 8, 4, '#ecc94b', '#744210', 1.2);
    Painter.circle(ctx, boatX - 4, boatY - 8, 2.5, '#63b3ed');

    // Mast and Rigging
    const mastTopY = boatY - 95;
    Painter.line(ctx, boatX + 2, boatY - 16, boatX + 2, mastTopY, '#3e271a', 2.5); // Mast
    Painter.line(ctx, boatX + 2, mastTopY + 10, boatX - 50, boatY, '#718096', 0.9); // Forestay
    Painter.line(ctx, boatX + 2, mastTopY + 10, boatX + 50, boatY, '#718096', 0.9); // Backstay
    Painter.line(ctx, boatX + 2, boatY - 10, boatX + 45, boatY - 28, '#4a332a', 1.8); // Boom

    // Furled Sail Canvas along boom
    Painter.roundedRect(ctx, boatX + 4, boatY - 24, 38, 7, 3, '#f7fafc', '#cbd5e0', 1);

    // Difference 7: Masthead Pennant Flag
    const pennantDiff = hasDiff('diff_cutter_pennant');
    const pennantColor = pennantDiff ? '#38a169' : '#dd6b20'; // Emerald green vs Golden amber
    Painter.polygon(ctx, [
      [boatX + 2, mastTopY],
      [boatX + 22, mastTopY + 5],
      [boatX + 2, mastTopY + 10]
    ], pennantColor, '#1a202c', 0.8);

    // Mooring rope from cutter bow to pier piling
    Painter.line(ctx, boatX + 62, boatY + 4, 180, 480, '#b7791f', 1.4);

    // -------------------------------------------------------------
    // 9. THE WOODEN PIER & PILINGS (Foreground)
    // -------------------------------------------------------------
    const pierTopY = 470;

    // Heavy wooden pilings submerged in water with barnacle/moss bases
    const pilings = [
      { x: 70, y: 450, w: 16, h: 146 },
      { x: 180, y: 460, w: 18, h: 136 },
      { x: 290, y: 465, w: 18, h: 131 },
      { x: 400, y: 460, w: 20, h: 136 },
      { x: 520, y: 455, w: 22, h: 141 },
    ];
    for (const p of pilings) {
      Painter.roundedRect(ctx, p.x, p.y, p.w, p.h, 2, PALETTE.harbor.pierWoodDark, '#120d0b', 1.5);
      // Wood grain highlights
      Painter.line(ctx, p.x + 4, p.y, p.x + 4, p.y + p.h, PALETTE.harbor.pierWoodMid, 1.2);
      // Green mossy waterline band
      Painter.roundedRect(ctx, p.x - 1, p.y + 45, p.w + 2, 12, 1, 'rgba(40, 116, 70, 0.65)');
    }

    // Difference 9: Perched Seagull on Leftmost Piling
    const hidePerchedGull = hasDiff('diff_perched_bird');
    if (!hidePerchedGull) {
      // Perched resting gull
      Painter.circle(ctx, 74, 442, 6, '#f7fafc', '#cbd5e0', 1);
      Painter.ellipse(ctx, 77, 445, 9, 5, 0.2, '#f7fafc', '#cbd5e0', 1);
      Painter.polygon(ctx, [
        [70, 442],
        [65, 443],
        [70, 445]
      ], '#ed8936'); // yellow beak
      Painter.circle(ctx, 73, 440, 1, '#111'); // eye
    }

    // Crossbeams supporting pier deck
    Painter.roundedRect(ctx, 50, pierTopY + 12, W - 40, 14, 2, PALETTE.harbor.pierWoodMid, '#1a1412', 1.5);

    // Pier Deck Planks (Perspective angled wood planks)
    for (let py = pierTopY; py < H; py += 16) {
      Painter.woodPlank(ctx, 20, py, W - 20, 14, PALETTE.harbor.pierWoodLight, PALETTE.harbor.pierWoodDark);
    }

    // Mooring Bollards (Cast Iron dock posts)
    const bollards = [
      { x: 235, y: 486 },
      { x: 375, y: 480 },
    ];
    for (const b of bollards) {
      Painter.roundedRect(ctx, b.x - 7, b.y, 14, 22, 3, '#2d3748', '#111827', 1.5);
      Painter.circle(ctx, b.x, b.y, 8, '#374151', '#111827', 1.5);
    }

    // Difference 12: Coiled Hemp Rope beside bollard
    const hideRopeCoil = hasDiff('diff_coiled_rope');
    if (!hideRopeCoil) {
      const rx = 236;
      const ry = 514;
      Painter.ellipse(ctx, rx, ry, 15, 8, 0, null, '#d69e2e', 2.8);
      Painter.ellipse(ctx, rx, ry, 10, 5, 0, null, '#b7791f', 2.5);
      Painter.ellipse(ctx, rx, ry, 5, 3, 0, null, '#975a16', 2.0);
    }

    // -------------------------------------------------------------
    // 10. DOCK CLUTTER: CRATES, BARRELS, LANTERN
    // -------------------------------------------------------------
    // Stack of Cargo Crates (Right foreground)
    const crateX = 420;
    const crateY = 470;
    // Lower large crate
    Painter.roundedRect(ctx, crateX, crateY, 52, 46, 2, PALETTE.harbor.crateWood, '#3e271a', 1.5);
    Painter.line(ctx, crateX + 4, crateY + 4, crateX + 48, crateY + 42, '#5b3a29', 2);
    Painter.line(ctx, crateX + 4, crateY + 42, crateX + 48, crateY + 4, '#5b3a29', 2);

    // Difference 10: Cargo Crate Stencil Emblem
    const crateDiff = hasDiff('diff_crate_marking');
    if (crateDiff) {
      // Star emblem mutated
      Painter.star(ctx, crateX + 26, crateY + 23, 5, 9, 4, '#ecc94b');
    } else {
      // Anchor emblem standard
      Painter.circle(ctx, crateX + 26, crateY + 18, 4, null, '#1a1412', 1.6);
      Painter.line(ctx, crateX + 26, crateY + 22, crateX + 26, crateY + 32, '#1a1412', 2);
      Painter.arc = Painter.wave; // Curved bottom anchor stock
      Painter.line(ctx, crateX + 18, crateY + 24, crateX + 34, crateY + 24, '#1a1412', 1.8);
      Painter.circle(ctx, crateX + 26, crateY + 28, 7, null, '#1a1412', 1.8);
    }

    // Upper smaller crate stacked on top
    Painter.roundedRect(ctx, crateX + 10, crateY - 32, 34, 32, 2, PALETTE.harbor.cratePlank, '#3e271a', 1.5);
    Painter.line(ctx, crateX + 12, crateY - 30, crateX + 42, crateY - 2, '#744210', 1.5);

    // Difference 6: Fish Barrel Stack
    const barrelDiff = hasDiff('diff_stacked_barrel');
    const barrelX = 520;
    const barrelY = 480;
    // Base barrel
    Painter.ellipse(ctx, barrelX, barrelY + 20, 16, 22, 0, PALETTE.harbor.barrelWood, '#1a1412', 1.5);
    // Iron barrel hoops
    Painter.ellipse(ctx, barrelX, barrelY + 12, 15, 4, 0, null, '#2d3748', 2);
    Painter.ellipse(ctx, barrelX, barrelY + 28, 15, 4, 0, null, '#2d3748', 2);
    Painter.ellipse(ctx, barrelX, barrelY + 4, 14, 5, 0, '#4a332a', '#1a1412', 1.2); // Lid

    if (!barrelDiff) {
      // Left panel has second smaller barrel stacked atop
      Painter.ellipse(ctx, barrelX - 2, barrelY - 18, 12, 16, 0.1, '#6e4c3e', '#1a1412', 1.4);
      Painter.ellipse(ctx, barrelX - 2, barrelY - 24, 10, 3, 0.1, '#583e33', '#1a1412', 1);
    }

    // Dock Wooden Stanchion Post with Hanging Brass Lantern
    const postX = 345;
    const postY = 410;
    // Vertical post
    Painter.roundedRect(ctx, postX, postY, 8, 90, 2, '#3e271a', '#1a1412', 1.5);
    // Curved iron lantern hanger arm extending right
    Painter.line(ctx, postX + 4, postY + 10, postX + 24, postY + 10, '#1a1412', 2.5);
    Painter.line(ctx, postX + 24, postY + 10, postX + 24, postY + 18, '#1a1412', 2);

    // Difference 5: Dock Hanging Lantern (Lit vs Unlit)
    const lanternDiff = hasDiff('diff_dock_lantern');
    const isLanternLit = !lanternDiff;
    Painter.lantern(ctx, postX + 24, postY + 28, 1.15, '#f6ad55', isLanternLit);

    ctx.restore();
  }
}
