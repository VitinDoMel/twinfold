// Night Bazaar Scene (Scene 2)
// Atmospheric Silk Road night market with illuminated lanterns, rich textiles, spices and ceramics.

import { Painter } from '../painter.js';
import { PALETTE, hexToRgba } from '../palette.js';
import { VIEW } from '../config.js';

export const BAZAAR_CANDIDATE_DIFFERENCES = [
  {
    id: 'diff_bazaar_star',
    name: 'Crescent Moon Companion Star',
    description: 'Bright twinkling star beside the slender crescent moon',
    x: 95,
    y: 55,
    radius: 26,
    type: 'visibility', // visible star on left, missing on right
  },
  {
    id: 'diff_tent_tassel',
    name: 'Awning Gold Fringe Tassel',
    description: 'Braided golden tassel dangling from the maroon canopy scallop',
    x: 295,
    y: 168,
    radius: 24,
    type: 'visibility', // tassel present on left, absent on right
  },
  {
    id: 'diff_moroccan_lantern',
    name: 'Pierced Brass Lantern Glow',
    description: 'Ornate pierced tin lantern glowing turquoise vs warm amber',
    x: 435,
    y: 185,
    radius: 28,
    type: 'color', // turquoise glass on left, amber flame glass on right
  },
  {
    id: 'diff_carpet_medallion',
    name: 'Persian Rug Central Medallion',
    description: 'Intricate 8-pointed floral medallion in the hanging wall carpet',
    x: 140,
    y: 255,
    radius: 30,
    type: 'detail', // 8-pointed star on left, floral diamond on right
  },
  {
    id: 'diff_spice_sack_color',
    name: 'Sack of Exotic Spice',
    description: 'Open burlap sack filled with vivid ground spice powder',
    x: 215,
    y: 445,
    radius: 28,
    type: 'color', // golden saffron on left, ruby paprika on right
  },
  {
    id: 'diff_teapot_steam',
    name: 'Brass Samovar Vapor',
    description: 'Spirals of fragrant spiced tea vapor rising from the brass pot',
    x: 375,
    y: 365,
    radius: 26,
    type: 'visibility', // steam swirls visible on left, missing on right
  },
  {
    id: 'diff_pomegranate_slice',
    name: 'Carved Pomegranate Fruit',
    description: 'Cut open pomegranate exposing ruby aril seeds on the brass dish',
    x: 495,
    y: 435,
    radius: 26,
    type: 'detail', // cut open showing seeds on left, uncut round fruit on right
  },
  {
    id: 'diff_mosaic_tile',
    name: 'Plaza Star Mosaic Tile',
    description: 'Decorative ceramic tile inlay set into the stone pavement',
    x: 280,
    y: 540,
    radius: 26,
    type: 'color', // turquoise glaze on left, terracotta brown on right
  },
  {
    id: 'diff_clay_amphora_band',
    name: 'Earthenware Jar Painted Stripe',
    description: 'Painted white ornamental slip band circling the clay water amphora',
    x: 75,
    y: 475,
    radius: 28,
    type: 'detail', // double white zigzag band on left, single straight band on right
  },
  {
    id: 'diff_hanging_silk_scarf',
    name: 'Draped Purple Silk Scarf',
    description: 'Delicate embroidered purple scarf hanging from the awning timber',
    x: 520,
    y: 265,
    radius: 26,
    type: 'visibility', // draped scarf visible on left, missing on right
  },
  {
    id: 'diff_bazaar_cat',
    name: 'Tent Roof Sleek Black Cat',
    description: 'Black bazaar feline perched atop the awning ridge pole',
    x: 370,
    y: 125,
    radius: 24,
    type: 'visibility', // sleek cat sitting on left, absent on right
  },
  {
    id: 'diff_tea_glasses_count',
    name: 'Mint Tea Glass on Brass Tray',
    description: 'Gilded glass of fresh mint tea resting on the round tray',
    x: 445,
    y: 505,
    radius: 26,
    type: 'object', // 3 tea glasses on left, 2 glasses on right
  },
];

export class BazaarScene {
  constructor() {
    this.key = 'bazaar';
    this.title = 'Night Bazaar';
    this.width = VIEW.PANEL_W;
    this.height = VIEW.PANEL_H;
  }

  render(ctx, panelSide, activeMutations = new Map(), timeElapsed = 0) {
    const W = this.width;
    const H = this.height;
    const isRight = panelSide === 'right';

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.clip();

    const hasDiff = (id) => isRight && activeMutations.has(id);

    // -------------------------------------------------------------
    // 1. NIGHT SKY & SILHOUETTE ARCHITECTURE
    // -------------------------------------------------------------
    const skyGrad = Painter.linearGradient(ctx, 0, 0, 0, H * 0.5, [
      [0.0, PALETTE.bazaar.skyNight],
      [0.45, PALETTE.bazaar.skyMid],
      [1.0, PALETTE.bazaar.skyHorizon],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H * 0.55, 0, skyGrad);

    // Stars in upper sky
    const starCoords = [
      [45, 30], [130, 40], [180, 25], [240, 60], [320, 20], [390, 45], [470, 35], [540, 50],
      [70, 90], [160, 80], [290, 85], [420, 75], [510, 85]
    ];
    for (const [sx, sy] of starCoords) {
      Painter.circle(ctx, sx, sy, 1.2, '#fef08a');
    }

    // Difference 1: Companion Star next to Moon
    const hideStar = hasDiff('diff_bazaar_star');
    if (!hideStar) {
      Painter.star(ctx, 95, 55, 4, 5, 2, '#fef08a');
      Painter.circle(ctx, 95, 55, 7, 'rgba(254, 240, 138, 0.4)');
    }

    // Glowing Crescent Moon
    const moonX = 70;
    const moonY = 55;
    Painter.circle(ctx, moonX, moonY, 28, PALETTE.bazaar.moonGlow);
    // Outer golden disc
    Painter.circle(ctx, moonX, moonY, 18, PALETTE.bazaar.moon);
    // Inner cutout disc to create slender crescent
    Painter.circle(ctx, moonX + 6, moonY - 4, 16, PALETTE.bazaar.skyNight);

    // Distant Oriental Minarets & Domes Silhouette
    Painter.polygon(ctx, [
      [0, 190],
      [40, 190], [45, 140], [55, 120], [65, 140], [70, 190], // Dome 1
      [110, 190], [115, 90], [120, 80], [125, 90], [130, 190], // Minaret spire
      [180, 190], [195, 150], [215, 135], [235, 150], [250, 190], // Grand Dome
      [310, 190], [315, 95], [320, 85], [325, 95], [330, 190], // Minaret 2
      [410, 190], [430, 160], [450, 160], [470, 190],
      [590, 190], [590, 220], [0, 220]
    ], '#1e1633');

    // -------------------------------------------------------------
    // 2. BAZAAR CANOPY & STRIPED TENT AWNINGS
    // -------------------------------------------------------------
    // Wooden structural posts and support beams
    Painter.roundedRect(ctx, 30, 140, 10, 280, 2, '#451a03', '#1c0a01', 1.5);
    Painter.roundedRect(ctx, 290, 130, 12, 290, 2, '#451a03', '#1c0a01', 1.5);
    Painter.roundedRect(ctx, 550, 140, 10, 280, 2, '#451a03', '#1c0a01', 1.5);
    // Crossbar support timber
    Painter.roundedRect(ctx, 20, 160, W - 40, 10, 2, '#5c2406', '#1c0a01', 1.2);

    // Left Tent Awning (Teal & Cream stripes)
    Painter.polygon(ctx, [
      [20, 165],
      [160, 130],
      [290, 165],
      [280, 190],
      [30, 190]
    ], PALETTE.bazaar.tentTeal, '#042f2e', 1.5);
    // Stripes
    Painter.polygon(ctx, [[70, 154], [105, 145], [100, 190], [68, 190]], PALETTE.bazaar.tentCream);
    Painter.polygon(ctx, [[150, 133], [185, 140], [178, 190], [145, 190]], PALETTE.bazaar.tentCream);
    Painter.polygon(ctx, [[225, 148], [255, 156], [245, 190], [218, 190]], PALETTE.bazaar.tentCream);

    // Right Tent Awning (Maroon & Saffron Gold stripes)
    Painter.polygon(ctx, [
      [290, 165],
      [425, 125],
      [565, 165],
      [555, 190],
      [300, 190]
    ], PALETTE.bazaar.tentMaroon, '#450a0a', 1.5);
    // Stripes
    Painter.polygon(ctx, [[335, 154], [365, 143], [358, 190], [330, 190]], PALETTE.bazaar.tentGold);
    Painter.polygon(ctx, [[410, 128], [440, 133], [432, 190], [402, 190]], PALETTE.bazaar.tentGold);
    Painter.polygon(ctx, [[485, 148], [515, 157], [505, 190], [478, 190]], PALETTE.bazaar.tentGold);

    // Scalloped awning fringe along the bottom
    for (let bx = 30; bx < 550; bx += 20) {
      Painter.circle(ctx, bx + 10, 190, 10, bx < 290 ? PALETTE.bazaar.tentTeal : PALETTE.bazaar.tentMaroon);
    }

    // Difference 2: Awning Gold Fringe Tassel at center peak
    const hideTassel = hasDiff('diff_tent_tassel');
    if (!hideTassel) {
      Painter.circle(ctx, 295, 168, 3, '#f59e0b');
      Painter.polygon(ctx, [[293, 168], [297, 168], [299, 185], [291, 185]], '#f59e0b', '#78350f', 0.8);
      Painter.circle(ctx, 295, 187, 2, '#d97706');
    }

    // Difference 11: Sleek Black Cat on Awning Roof
    const hideCat = hasDiff('diff_bazaar_cat');
    if (!hideCat) {
      Painter.ellipse(ctx, 370, 127, 9, 6, 0.1, '#09090b'); // Body
      Painter.circle(ctx, 377, 123, 4.5, '#09090b'); // Head
      Painter.polygon(ctx, [[375, 120], [377, 116], [379, 120]], '#09090b'); // Ear
      Painter.circle(ctx, 378, 123, 0.8, '#facc15'); // Yellow glowing eye
      Painter.line(ctx, 362, 128, 356, 123, '#09090b', 1.8); // Tail
    }

    // -------------------------------------------------------------
    // 3. HANGING TEXTILES & ORNATE PERSIAN CARPET (Left Stall)
    // -------------------------------------------------------------
    const rugX = 70;
    const rugY = 205;
    const rugW = 140;
    const rugH = 180;
    // Outer border & fringe
    Painter.roundedRect(ctx, rugX, rugY, rugW, rugH, 2, PALETTE.bazaar.rugRed, '#450a0a', 2);
    Painter.roundedRect(ctx, rugX + 6, rugY + 6, rugW - 12, rugH - 12, 1, null, PALETTE.bazaar.rugBorder, 1.8);
    Painter.roundedRect(ctx, rugX + 14, rugY + 14, rugW - 28, rugH - 28, 1, PALETTE.bazaar.rugBlue);

    // Difference 4: Persian Carpet Center Medallion
    const medDiff = hasDiff('diff_carpet_medallion');
    const medX = rugX + rugW / 2;
    const medY = rugY + rugH / 2;
    if (!medDiff) {
      // 8-pointed golden star medallion
      Painter.star(ctx, medX, medY, 8, 22, 11, '#fbbf24');
      Painter.circle(ctx, medX, medY, 6, '#be123c');
    } else {
      // Diamond medallion on mutated right
      Painter.polygon(ctx, [
        [medX, medY - 20],
        [medX + 18, medY],
        [medX, medY + 20],
        [medX - 18, medY]
      ], '#38bdf8', '#0284c7', 1.5);
      Painter.circle(ctx, medX, medY, 5, '#fef08a');
    }
    // Carpet fringe threads bottom
    for (let fx = rugX + 4; fx <= rugX + rugW - 4; fx += 5) {
      Painter.line(ctx, fx, rugY + rugH, fx, rugY + rugH + 8, '#fef08a', 1.2);
    }

    // Difference 10: Draped Purple Silk Scarf (Right stall)
    const hideScarf = hasDiff('diff_hanging_silk_scarf');
    if (!hideScarf) {
      Painter.polygon(ctx, [
        [510, 200],
        [535, 200],
        [540, 310],
        [525, 325],
        [515, 300]
      ], PALETTE.bazaar.tentPurple, '#3b0764', 1.2);
      Painter.line(ctx, 520, 210, 528, 315, '#c084fc', 1.5);
    }

    // -------------------------------------------------------------
    // 4. HANGING PIERCED BRASS LANTERNS & WARM GLOWS
    // -------------------------------------------------------------
    // Hanging Chains
    Painter.line(ctx, 435, 160, 435, 180, '#b45309', 1.5);
    Painter.line(ctx, 230, 160, 230, 210, '#b45309', 1.5);

    // Center warm lantern
    Painter.lantern(ctx, 230, 225, 1.2, '#f59e0b', true);

    // Difference 3: Pierced Moroccan Lantern Color / Glow
    const lanternDiff = hasDiff('diff_moroccan_lantern');
    const moroccanColor = lanternDiff ? '#f59e0b' : '#0d9488'; // Turquoise vs Amber
    const moroccanGlow = lanternDiff ? PALETTE.bazaar.lanternGlowWarm : PALETTE.bazaar.lanternGlowTurquoise;

    const mLanX = 435;
    const mLanY = 195;
    // Radial color wash
    const mGlow = Painter.radialGradient(ctx, mLanX, mLanY, 4, mLanX, mLanY, 44, [
      [0.0, hexToRgba(moroccanColor, 0.7)],
      [0.5, moroccanGlow],
      [1.0, 'rgba(0,0,0,0)'],
    ]);
    Painter.circle(ctx, mLanX, mLanY, 44, mGlow);

    // Ornate faceted lantern body
    Painter.polygon(ctx, [
      [mLanX, mLanY - 18],
      [mLanX + 12, mLanY - 6],
      [mLanX + 8, mLanY + 14],
      [mLanX - 8, mLanY + 14],
      [mLanX - 12, mLanY - 6]
    ], moroccanColor, '#451a03', 1.5);
    // Intricate pierced star slits
    Painter.circle(ctx, mLanX, mLanY, 2.5, '#ffffff');
    Painter.line(ctx, mLanX - 6, mLanY + 4, mLanX + 6, mLanY + 4, '#ffffff', 1);

    // -------------------------------------------------------------
    // 5. STONE & MOSAIC TILE PAVEMENT (Foreground Ground)
    // -------------------------------------------------------------
    const groundY = 410;
    const groundGrad = Painter.linearGradient(ctx, 0, groundY, 0, H, [
      [0.0, PALETTE.bazaar.sandGround],
      [0.4, '#241416'],
      [1.0, '#150b0e'],
    ]);
    Painter.roundedRect(ctx, 0, groundY, W, H - groundY, 0, groundGrad);

    // Pavement flagstones
    for (let py = groundY + 15; py < H; py += 32) {
      Painter.line(ctx, 0, py, W, py, 'rgba(254, 243, 199, 0.08)', 1.5);
    }

    // Difference 8: Plaza Star Mosaic Tile
    const tileDiff = hasDiff('diff_mosaic_tile');
    const tileColor = tileDiff ? '#78350f' : '#0d9488'; // Terracotta vs Turquoise
    const tileX = 280;
    const tileY = 535;
    Painter.roundedRect(ctx, tileX - 15, tileY - 15, 30, 30, 2, '#1c1917', '#44403c', 1.5);
    Painter.star(ctx, tileX, tileY, 8, 11, 6, tileColor);
    Painter.circle(ctx, tileX, tileY, 3, '#fef08a');

    // -------------------------------------------------------------
    // 6. SPICE BAZAAR SACKS & EARTHENWARE AMPHORA (Midground)
    // -------------------------------------------------------------
    // Difference 9: Clay Amphora Painted Band
    const amphoraDiff = hasDiff('diff_clay_amphora_band');
    const ampX = 75;
    const ampY = 475;
    // Amphora body
    Painter.ellipse(ctx, ampX, ampY, 18, 26, 0, PALETTE.bazaar.clayJar, '#451a03', 1.5);
    Painter.ellipse(ctx, ampX, ampY - 26, 8, 3.5, 0, '#78350f', '#451a03', 1.2); // Neck rim
    // Handles
    Painter.circle(ctx, ampX - 16, ampY - 12, 7, null, '#78350f', 2.5);
    Painter.circle(ctx, ampX + 16, ampY - 12, 7, null, '#78350f', 2.5);
    // White decorative slip band
    Painter.ellipse(ctx, ampX, ampY - 4, 17, 5, 0, null, '#f8fafc', 2);
    if (!amphoraDiff) {
      // Second lower zigzag band on left panel
      Painter.ellipse(ctx, ampX, ampY + 10, 16, 5, 0, null, '#f8fafc', 1.8);
    }

    // Open Burlap Spice Sacks
    const sacks = [
      { x: 140, y: 460, color: PALETTE.bazaar.spicePaprika, label: 'Paprika' },
      { x: 215, y: 445, color: PALETTE.bazaar.spiceSaffron, label: 'Saffron' },
      { x: 285, y: 465, color: '#15803d', label: 'Cardamom' },
    ];

    sacks.forEach((s, idx) => {
      // Sack burlap bag
      Painter.ellipse(ctx, s.x, s.y + 12, 22, 16, 0, '#78350f', '#291104', 1.5);
      Painter.ellipse(ctx, s.x, s.y - 2, 20, 6, 0, '#92400e', '#291104', 1.2); // Rolled cuff

      // Difference 5: Saffron Sack Color (Saffron Gold vs Deep Indigo)
      let powderColor = s.color;
      if (idx === 1) {
        const spiceDiff = hasDiff('diff_spice_sack_color');
        powderColor = spiceDiff ? PALETTE.bazaar.spiceIndigo : PALETTE.bazaar.spiceSaffron;
      }

      // Mound of ground spice
      Painter.ellipse(ctx, s.x, s.y - 4, 17, 7, 0, powderColor);
      // Highlight crest
      Painter.ellipse(ctx, s.x - 2, s.y - 6, 8, 3, 0, 'rgba(255, 255, 255, 0.35)');
    });

    // -------------------------------------------------------------
    // 7. BRASS SAMOVAR, TEAPOT, FRUIT DISPLAY (Right Foreground)
    // -------------------------------------------------------------
    // Heavy wooden market counter table
    const tblX = 350;
    const tblY = 440;
    const tblW = 220;
    const tblH = 90;
    Painter.roundedRect(ctx, tblX, tblY, tblW, tblH, 4, '#5c2406', '#1c0a01', 1.8);
    Painter.roundedRect(ctx, tblX - 10, tblY - 10, tblW + 20, 14, 3, '#78350f', '#291104', 1.8);

    // Ornate Brass Tea Samovar
    const samX = 375;
    const samY = 385;
    // Urn body & pedestal
    Painter.roundedRect(ctx, samX - 8, samY + 22, 16, 18, 2, '#b45309', '#451a03', 1.5); // Base
    Painter.ellipse(ctx, samX, samY + 4, 18, 22, 0, PALETTE.bazaar.brassTeapot, '#78350f', 1.5);
    Painter.roundedRect(ctx, samX - 12, samY - 18, 24, 6, 2, '#d97706', '#78350f', 1.2); // Lid
    Painter.circle(ctx, samX, samY - 22, 4, '#f59e0b', '#78350f', 1.2); // Finial knob
    // Spigot
    Painter.line(ctx, samX - 16, samY + 12, samX - 24, samY + 14, '#b45309', 3);
    Painter.line(ctx, samX - 24, samY + 14, samX - 24, samY + 20, '#b45309', 2.5);

    // Difference 6: Samovar Steam Swirls
    const hideSteam = hasDiff('diff_teapot_steam');
    if (!hideSteam) {
      ctx.save();
      Painter.wave(ctx, samX - 6, samY - 32, 16, 2.5, 0.25, 'rgba(255, 255, 255, 0.45)', 1.5);
      Painter.wave(ctx, samX - 2, samY - 44, 14, 2.0, 0.3, 'rgba(255, 255, 255, 0.35)', 1.2);
      ctx.restore();
    }

    // Difference 7: Pomegranate Fruit Dish (Cut with seeds vs whole round)
    const pomDiff = hasDiff('diff_pomegranate_slice');
    const pomX = 495;
    const pomY = 430;
    // Brass footed bowl
    Painter.ellipse(ctx, pomX, pomY + 8, 24, 6, 0, '#d97706', '#78350f', 1.2);
    // Green Persian Melons behind
    Painter.circle(ctx, pomX - 14, pomY - 4, 11, PALETTE.bazaar.melonGreen, '#14532d', 1.2);
    Painter.circle(ctx, pomX + 16, pomY - 2, 10, '#eab308', '#713f12', 1.2); // Yellow fig melon

    // Pomegranate
    if (!pomDiff) {
      // Cut half exposing red ruby seeds
      Painter.circle(ctx, pomX, pomY - 2, 9, PALETTE.bazaar.pomegranate, '#4c0519', 1.2);
      Painter.circle(ctx, pomX, pomY - 2, 6.5, '#fef08a'); // pith
      // Ruby jewel seeds
      Painter.circle(ctx, pomX - 2, pomY - 3, 1.5, '#be123c');
      Painter.circle(ctx, pomX + 2, pomY - 3, 1.5, '#be123c');
      Painter.circle(ctx, pomX, pomY + 1, 1.5, '#be123c');
    } else {
      // Smooth round uncut fruit
      Painter.circle(ctx, pomX, pomY - 2, 9, PALETTE.bazaar.pomegranate, '#4c0519', 1.2);
      Painter.polygon(ctx, [[pomX - 2, pomY - 11], [pomX, pomY - 14], [pomX + 2, pomY - 11]], '#881337'); // Crown calyx
    }

    // Difference 12: Mint Tea Glasses on Brass Tray
    const trayDiff = hasDiff('diff_tea_glasses_count');
    const trayX = 445;
    const trayY = 505;
    Painter.ellipse(ctx, trayX, trayY, 28, 9, 0, '#d97706', '#78350f', 1.5); // Tray

    const glassesCount = trayDiff ? 2 : 3;
    const glassOffsets = [-12, 0, 12];
    for (let gi = 0; gi < glassesCount; gi++) {
      const gx = trayX + glassOffsets[gi];
      const gy = trayY - 4;
      // Glass body
      Painter.roundedRect(ctx, gx - 4, gy - 12, 8, 14, 1, 'rgba(224, 242, 254, 0.7)', '#0284c7', 0.8);
      // Mint green tea liquid inside
      Painter.roundedRect(ctx, gx - 3, gy - 6, 6, 8, 1, '#15803d');
      // Gold trim band
      Painter.line(ctx, gx - 4, gy - 9, gx + 4, gy - 9, '#f59e0b', 1.2);
    }

    ctx.restore();
  }
}
