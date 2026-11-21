// Greenhouse Lab Scene (Scene 3)
// Victorian botanical alchemical conservatory with exotic flora, glowing glassware, brass apparatus and specimens.

import { Painter } from '../painter.js';
import { PALETTE, hexToRgba } from '../palette.js';
import { VIEW } from '../config.js';

export const GREENHOUSE_CANDIDATE_DIFFERENCES = [
  {
    id: 'diff_flask_liquid_color',
    name: 'Alchemical Potion Color',
    description: 'Bioluminescent reagent in the central Florence boiling flask',
    x: 235,
    y: 395,
    radius: 28,
    type: 'color', // emerald green reagent on left, amethyst purple on right
  },
  {
    id: 'diff_butterfly_spots',
    name: 'Blue Morpho Butterfly Wing Spots',
    description: 'Delicate white margin spots along the butterfly wings',
    x: 105,
    y: 220,
    radius: 26,
    type: 'detail', // white decorative wing spots on left, plain blue wings on right
  },
  {
    id: 'diff_microscope_objective',
    name: 'Brass Microscope Objective Lens',
    description: 'Triple rotating objective nosepiece on the antique microscope',
    x: 435,
    y: 380,
    radius: 26,
    type: 'detail', // 3 objective brass barrels on left, 2 barrels on right
  },
  {
    id: 'diff_bell_jar_spore',
    name: 'Glass Bell Jar Specimen',
    description: 'Bioluminescent golden lotus blossom preserved under glass',
    x: 345,
    y: 360,
    radius: 28,
    type: 'color', // golden glowing blossom on left, electric cyan spore on right
  },
  {
    id: 'diff_grimoire_bookmark',
    name: 'Grimoire Silk Ribbon Bookmark',
    description: 'Braided ribbon marker draped over the open botanical folio',
    x: 505,
    y: 465,
    radius: 24,
    type: 'color', // crimson red ribbon on left, golden amber ribbon on right
  },
  {
    id: 'diff_flytrap_lobe',
    name: 'Carnivorous Flytrap Jaws',
    description: 'Toothed snapping trap lobe of the potted Venus flytrap',
    x: 165,
    y: 430,
    radius: 26,
    type: 'state', // open jaws with needle teeth on left, closed bulb trap on right
  },
  {
    id: 'diff_hanging_orchid',
    name: 'Conservatory Hanging Orchid Blossom',
    description: 'Magenta orchid flowers in the wrought-iron hanging basket',
    x: 475,
    y: 150,
    radius: 28,
    type: 'object', // 3 blooming orchid flowers on left, 2 flowers on right
  },
  {
    id: 'diff_glass_condenser_coil',
    name: 'Distillation Cooling Coil Spiral',
    description: 'Amber alchemical vapor spiral winding through the glass tube',
    x: 285,
    y: 340,
    radius: 26,
    type: 'color', // glowing amber vapor spiral on left, turquoise vapor on right
  },
  {
    id: 'diff_ivy_tendril',
    name: 'Vaulted Muntin Ivy Leaf Tendril',
    description: 'Sprouting green ivy leaf along the central iron greenhouse arch',
    x: 300,
    y: 65,
    radius: 22,
    type: 'visibility', // leaf tendril present on left, missing on right
  },
  {
    id: 'diff_amber_reagent_bottle',
    name: 'Apothecary Dropper Stopper',
    description: 'Faceted glass dropper bulb on the amber tincture vial',
    x: 395,
    y: 435,
    radius: 24,
    type: 'detail', // rubber bulb dropper on left, tapered cork on right
  },
  {
    id: 'diff_bench_brass_gauge',
    name: 'Distillation Boiler Pressure Gauge',
    description: 'Indicator needle on the miniature brass boiler manometer',
    x: 190,
    y: 340,
    radius: 24,
    type: 'rotation', // needle pointing to high red zone on left, zero on right
  },
  {
    id: 'diff_boiling_bubbles',
    name: 'Effervescent Reaction Bubbles',
    description: 'Fizzy bubbles rising within the spherical potion chamber',
    x: 235,
    y: 412,
    radius: 24,
    type: 'visibility', // active effervescent bubbles on left, still liquid on right
  },
];

export class GreenhouseScene {
  constructor() {
    this.key = 'greenhouse';
    this.title = 'Greenhouse Lab';
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
    // 1. NIGHT SKY & GLASS VAULTED CONSERVATORY DOME
    // -------------------------------------------------------------
    const skyGrad = Painter.linearGradient(ctx, 0, 0, 0, H * 0.5, [
      [0.0, PALETTE.greenhouse.skyTwilight],
      [0.5, '#0c2233'],
      [1.0, '#133544'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H * 0.55, 0, skyGrad);

    // Distant stars outside glass
    const stars = [[80, 40], [150, 70], [220, 30], [380, 50], [450, 35], [520, 65]];
    for (const [sx, sy] of stars) {
      Painter.circle(ctx, sx, sy, 1.2, '#bae6fd');
    }

    // Glass Panes Translucent Tint
    Painter.roundedRect(ctx, 0, 0, W, H * 0.55, 0, PALETTE.greenhouse.glassDome);

    // Wrought Iron Architectural Framework (Gothic arched conservatory ribs)
    // Vertical iron muntins
    for (let ix = 60; ix < W; ix += 95) {
      Painter.line(ctx, ix, 0, ix, H * 0.55, PALETTE.greenhouse.ironFrame, 2.5);
      Painter.line(ctx, ix + 1, 0, ix + 1, H * 0.55, PALETTE.greenhouse.ironFrameHighlight, 1);
    }
    // Grand overarching curved iron ribs
    ctx.save();
    ctx.strokeStyle = PALETTE.greenhouse.ironFrame;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(W / 2, 280, 260, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, 340, 220, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Difference 9: Ivy Tendril Sprouting on Central Arch Rib
    const hideIvyTendril = hasDiff('diff_ivy_tendril');
    if (!hideIvyTendril) {
      Painter.circle(ctx, 300, 65, 4.5, '#22c55e', '#052e16', 1);
      Painter.polygon(ctx, [[300, 63], [306, 56], [304, 65]], '#4ade80');
      Painter.line(ctx, 296, 68, 300, 65, '#15803d', 1.5);
    }

    // Creeping ivy vines framing top corners
    Painter.ellipse(ctx, 40, 30, 45, 20, 0.3, PALETTE.greenhouse.fernGreen, '#052e16', 1);
    Painter.ellipse(ctx, 550, 35, 45, 20, -0.3, PALETTE.greenhouse.fernGreen, '#052e16', 1);

    // -------------------------------------------------------------
    // 2. HANGING BOTANICAL BASKETS & FERNS (Upper Layer)
    // -------------------------------------------------------------
    // Left Hanging Fern Basket
    Painter.line(ctx, 110, 0, 110, 110, '#334155', 1.5); // Chain
    Painter.roundedRect(ctx, 90, 110, 40, 20, 4, '#1c1917', '#334155', 1.2); // Wire basket
    // Cascading lush fern fronds
    for (let f = 0; f < 5; f++) {
      const fx = 85 + f * 10;
      Painter.ellipse(ctx, fx, 125 + (f % 2) * 8, 8, 16, 0.2 * (f - 2), PALETTE.greenhouse.fernBright, '#052e16', 0.8);
    }

    // Difference 2: Exotic Blue Morpho Butterfly perched on lower fern frond
    const butterflyDiff = hasDiff('diff_butterfly_spots');
    const bflyX = 105;
    const bflyY = 220;
    // Fern frond perch
    Painter.ellipse(ctx, bflyX, bflyY + 8, 32, 7, -0.2, PALETTE.greenhouse.fernGreen, '#052e16', 1);
    // Butterfly wings
    Painter.ellipse(ctx, bflyX - 8, bflyY - 4, 11, 14, -0.35, PALETTE.greenhouse.butterflyWing, '#082f49', 1.2);
    Painter.ellipse(ctx, bflyX + 8, bflyY - 4, 11, 14, 0.35, PALETTE.greenhouse.butterflyWing, '#082f49', 1.2);
    Painter.ellipse(ctx, bflyX - 7, bflyY + 6, 8, 10, -0.2, PALETTE.greenhouse.butterflySpot, '#082f49', 1);
    Painter.ellipse(ctx, bflyX + 7, bflyY + 6, 8, 10, 0.2, PALETTE.greenhouse.butterflySpot, '#082f49', 1);
    Painter.line(ctx, bflyX, bflyY - 10, bflyX, bflyY + 12, '#0f172a', 2); // Body thorax

    if (!butterflyDiff) {
      // White decorative edge margin dots on left panel
      Painter.circle(ctx, bflyX - 16, bflyY - 8, 1.2, '#ffffff');
      Painter.circle(ctx, bflyX - 18, bflyY - 3, 1.2, '#ffffff');
      Painter.circle(ctx, bflyX + 16, bflyY - 8, 1.2, '#ffffff');
      Painter.circle(ctx, bflyX + 18, bflyY - 3, 1.2, '#ffffff');
    }

    // Difference 7: Right Hanging Orchid Basket
    const orchidDiff = hasDiff('diff_hanging_orchid');
    const orcX = 475;
    const orcY = 150;
    Painter.line(ctx, orcX, 0, orcX, orcY - 15, '#334155', 1.5);
    Painter.ellipse(ctx, orcX, orcY, 22, 10, 0, '#292524', '#44403c', 1.2);

    const bloomCount = orchidDiff ? 2 : 3;
    const bloomOffsets = [
      { dx: -12, dy: -4 },
      { dx: 10, dy: -2 },
      { dx: 0, dy: 8 }
    ];
    for (let bi = 0; bi < bloomCount; bi++) {
      const bx = orcX + bloomOffsets[bi].dx;
      const by = orcY + bloomOffsets[bi].dy;
      Painter.circle(ctx, bx, by, 6.5, PALETTE.greenhouse.orchidMagenta, '#701a75', 1);
      Painter.circle(ctx, bx, by, 3, PALETTE.greenhouse.orchidPetal);
      Painter.circle(ctx, bx, by, 1.2, '#fde047'); // Yellow pistil
    }

    // -------------------------------------------------------------
    // 3. GREENHOUSE BRICKWORK & CONSERVATORY FLOOR
    // -------------------------------------------------------------
    const floorY = 440;
    Painter.roundedRect(ctx, 0, floorY, W, H - floorY, 0, '#1c1917');
    // Terracotta hexagonal tile lines
    for (let tx = 0; tx < W; tx += 48) {
      Painter.line(ctx, tx, floorY, tx, H, '#292524', 1.5);
    }

    // -------------------------------------------------------------
    // 4. ALCHEMICAL WORKBENCH (Rich Walnut & Brass)
    // -------------------------------------------------------------
    const benchY = 385;
    Painter.roundedRect(ctx, 25, benchY, W - 50, 85, 4, PALETTE.greenhouse.benchWood, '#1c0a01', 2);
    Painter.roundedRect(ctx, 15, benchY - 14, W - 30, 16, 3, PALETTE.greenhouse.benchWoodLight, '#291104', 1.8);

    // Difference 6: Potted Venus Flytrap on left workbench corner
    const flytrapDiff = hasDiff('diff_flytrap_lobe');
    const flyX = 165;
    const flyY = 425;
    // Terracotta pot
    Painter.polygon(ctx, [
      [flyX - 16, flyY - 14],
      [flyX + 16, flyY - 14],
      [flyX + 12, flyY + 12],
      [flyX - 12, flyY + 12]
    ], '#c2410c', '#7c2d12', 1.5);
    // Green stem
    Painter.line(ctx, flyX, flyY - 14, flyX, flyY - 32, '#16a34a', 3);

    if (!flytrapDiff) {
      // Open toothy trap jaws
      Painter.ellipse(ctx, flyX - 6, flyY - 36, 10, 6, -0.4, '#22c55e', '#14532d', 1.2);
      Painter.ellipse(ctx, flyX + 6, flyY - 36, 10, 6, 0.4, '#22c55e', '#14532d', 1.2);
      // Crimson interior
      Painter.circle(ctx, flyX, flyY - 36, 4, '#dc2626');
      // Interlocking needle teeth
      for (let ti = -8; ti <= 8; ti += 4) {
        Painter.line(ctx, flyX + ti, flyY - 42, flyX + ti, flyY - 38, '#fef08a', 1.2);
      }
    } else {
      // Closed bulbous trap
      Painter.ellipse(ctx, flyX, flyY - 34, 8, 12, 0.1, '#15803d', '#052e16', 1.5);
    }

    // Difference 11: Distillation Boiler Manometer Gauge
    const gaugeDiff = hasDiff('diff_bench_brass_gauge');
    const boilerX = 190;
    const boilerY = 345;
    // Copper distillation vessel
    Painter.ellipse(ctx, boilerX, boilerY + 14, 16, 14, 0, '#b45309', '#451a03', 1.5);
    // Brass pressure gauge
    Painter.circle(ctx, boilerX, boilerY - 6, 9, '#fef3c7', '#78350f', 1.8);
    // Needle pointer
    const needleAngle = gaugeDiff ? -Math.PI * 0.75 : Math.PI * 0.25; // zero vs high pressure
    Painter.line(
      ctx,
      boilerX,
      boilerY - 6,
      boilerX + Math.cos(needleAngle) * 6,
      boilerY - 6 + Math.sin(needleAngle) * 6,
      '#dc2626',
      1.5
    );

    // -------------------------------------------------------------
    // 5. LABORATORY GLASSWARE, RETORTS & GLOWING POTIONS
    // -------------------------------------------------------------
    // Difference 1: Central Florence Boiling Flask Potion Color
    const potionDiff = hasDiff('diff_flask_liquid_color');
    const flaskX = 235;
    const flaskY = 390;
    const potionColor = potionDiff ? PALETTE.greenhouse.potionAmethyst : PALETTE.greenhouse.potionEmerald;
    const potionGlow = potionDiff ? PALETTE.greenhouse.potionAmethystGlow : PALETTE.greenhouse.potionEmeraldGlow;

    // Glowing aura behind flask
    Painter.circle(ctx, flaskX, flaskY + 6, 32, potionGlow);

    // Spherical Glass Flask Body
    Painter.circle(ctx, flaskX, flaskY + 6, 20, null, PALETTE.greenhouse.glassFlask, 1.8);
    // Cylindrical Neck
    Painter.roundedRect(ctx, flaskX - 5, flaskY - 26, 10, 22, 1, null, PALETTE.greenhouse.glassFlask, 1.8);
    // Flask rim lip
    Painter.ellipse(ctx, flaskX, flaskY - 26, 7, 2.5, 0, null, PALETTE.greenhouse.glassFlask, 1.5);

    // Liquid inside flask
    Painter.circle(ctx, flaskX, flaskY + 8, 17, potionColor);

    // Difference 12: Rising Boiling Bubbles
    const hideBubbles = hasDiff('diff_boiling_bubbles');
    if (!hideBubbles) {
      Painter.circle(ctx, flaskX - 6, flaskY + 6, 2.5, '#ffffff');
      Painter.circle(ctx, flaskX + 4, flaskY + 2, 2.0, '#ffffff');
      Painter.circle(ctx, flaskX - 1, flaskY - 6, 1.8, '#ffffff');
      Painter.circle(ctx, flaskX + 5, flaskY + 12, 1.5, '#ffffff');
    }

    // Difference 8: Glass Condenser Vapor Coil
    const coilDiff = hasDiff('diff_glass_condenser_coil');
    const coilColor = coilDiff ? '#06b6d4' : '#f59e0b'; // Turquoise vs Amber
    const coilX = 285;
    const coilY = 345;
    // Outer glass jacket tube
    Painter.roundedRect(ctx, coilX - 7, coilY - 30, 14, 52, 3, 'rgba(224, 242, 254, 0.4)', '#94a3b8', 1.2);
    // Spiraling vapor spiral
    for (let cy = coilY - 24; cy <= coilY + 16; cy += 8) {
      Painter.ellipse(ctx, coilX, cy, 5, 2.5, 0.2, null, coilColor, 2);
    }

    // Difference 4: Specimen under Glass Bell Jar
    const jarDiff = hasDiff('diff_bell_jar_spore');
    const jarX = 345;
    const jarY = 360;
    // Dark mahogany plinth base
    Painter.roundedRect(ctx, jarX - 20, jarY + 22, 40, 8, 2, '#451a03', '#1c0a01', 1.5);
    // Glass dome bell jar
    Painter.roundedRect(ctx, jarX - 16, jarY - 24, 32, 46, 12, 'rgba(224, 242, 254, 0.35)', '#bae6fd', 1.5);
    Painter.circle(ctx, jarX, jarY - 26, 4, 'rgba(224, 242, 254, 0.6)', '#bae6fd', 1.2); // Knob handle

    // Glowing Specimen inside
    if (!jarDiff) {
      // Golden luminous lotus
      Painter.circle(ctx, jarX, jarY + 6, 14, 'rgba(250, 204, 21, 0.35)');
      Painter.star(ctx, jarX, jarY + 6, 6, 9, 5, '#facc15');
      Painter.circle(ctx, jarX, jarY + 6, 3, '#ffffff');
    } else {
      // Electric cyan alchemical spore
      Painter.circle(ctx, jarX, jarY + 6, 14, 'rgba(6, 182, 212, 0.4)');
      Painter.circle(ctx, jarX, jarY + 6, 7, '#06b6d4');
      Painter.circle(ctx, jarX, jarY + 6, 3, '#ffffff');
    }

    // Difference 10: Apothecary Dropper Stopper
    const dropDiff = hasDiff('diff_amber_reagent_bottle');
    const vialX = 395;
    const vialY = 432;
    Painter.roundedRect(ctx, vialX - 6, vialY - 12, 12, 20, 2, '#78350f', '#451a03', 1.2); // Amber glass
    Painter.line(ctx, vialX - 6, vialY, vialX + 6, vialY, '#fef08a', 0.8); // Paper label
    if (!dropDiff) {
      // Black rubber dropper bulb
      Painter.ellipse(ctx, vialX, vialY - 16, 4, 6, 0, '#1e293b', '#0f172a', 1.2);
    } else {
      // Tapered cork stopper
      Painter.polygon(ctx, [
        [vialX - 4, vialY - 12],
        [vialX + 4, vialY - 12],
        [vialX + 3, vialY - 18],
        [vialX - 3, vialY - 18]
      ], '#d97706');
    }

    // -------------------------------------------------------------
    // 6. BRASS MICROSCOPE & BOTANICAL GRIMOIRE
    // -------------------------------------------------------------
    // Difference 3: Antique Brass Microscope
    const microDiff = hasDiff('diff_microscope_objective');
    const micX = 435;
    const micY = 380;
    // Horseshoe base
    Painter.ellipse(ctx, micX, micY + 36, 18, 6, 0, '#b45309', '#451a03', 1.5);
    Painter.line(ctx, micX, micY + 36, micX, micY + 16, '#d97706', 4); // Pillar
    // Specimen stage table
    Painter.roundedRect(ctx, micX - 14, micY + 14, 28, 4, 1, '#1e293b', '#451a03', 1);
    // Curved brass arm
    Painter.line(ctx, micX, micY + 16, micX + 12, micY, '#d97706', 4);
    Painter.line(ctx, micX + 12, micY, micX, micY - 14, '#d97706', 4);
    // Eyepiece optical tube
    Painter.line(ctx, micX, micY - 14, micX - 4, micY - 32, '#f59e0b', 5);
    Painter.ellipse(ctx, micX - 4, micY - 32, 5, 2, -0.2, '#fde047', '#78350f', 1);

    // Revolving Nosepiece Objective lenses
    const objCount = microDiff ? 2 : 3;
    for (let oi = 0; oi < objCount; oi++) {
      const ox = micX - 6 + oi * 5;
      Painter.line(ctx, ox, micY - 8, ox - 1, micY + 4, '#d97706', 2.5);
    }

    // Difference 5: Open Botanical Grimoire & Silk Ribbon Bookmark
    const bookDiff = hasDiff('diff_grimoire_bookmark');
    const bookX = 505;
    const bookY = 460;
    // Open leather binding
    Painter.polygon(ctx, [
      [bookX - 32, bookY + 12],
      [bookX, bookY + 6],
      [bookX + 32, bookY + 12],
      [bookX + 28, bookY + 22],
      [bookX, bookY + 16],
      [bookX - 28, bookY + 22]
    ], '#451a03', '#1c0a01', 1.5);

    // Yellowed parchment open pages
    Painter.polygon(ctx, [
      [bookX - 30, bookY + 8],
      [bookX, bookY + 3],
      [bookX - 2, bookY + 15],
      [bookX - 26, bookY + 18]
    ], '#fef3c7', '#d97706', 0.8);
    Painter.polygon(ctx, [
      [bookX, bookY + 3],
      [bookX + 30, bookY + 8],
      [bookX + 26, bookY + 18],
      [bookX + 2, bookY + 15]
    ], '#fef3c7', '#d97706', 0.8);

    // Botanical illustration sketch on left page
    Painter.line(ctx, bookX - 16, bookY + 8, bookX - 16, bookY + 15, '#15803d', 1.2);
    Painter.circle(ctx, bookX - 16, bookY + 7, 2, '#c026d3');

    // Ribbon Bookmark
    const ribbonColor = bookDiff ? '#d97706' : '#dc2626'; // Gold vs Crimson
    Painter.line(ctx, bookX, bookY + 4, bookX + 6, bookY + 28, ribbonColor, 2.5);
    Painter.polygon(ctx, [[bookX + 4, bookY + 28], [bookX + 8, bookY + 28], [bookX + 6, bookY + 32]], ribbonColor);

    ctx.restore();
  }
}
