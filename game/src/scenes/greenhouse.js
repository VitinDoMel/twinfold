// Greenhouse Lab Scene (Scene 3)
// Dense Victorian botanical alchemical conservatory with lush exotic flora, glassware, brass instruments, and subtle differences.

import { Painter } from '../painter.js';
import { PALETTE, hexToRgba } from '../palette.js';
import { VIEW } from '../config.js';

export const GREENHOUSE_CANDIDATE_DIFFERENCES = [
  {
    id: 'diff_flask_liquid_color',
    name: 'Florence Boiling Flask Reagent',
    description: 'Subtle shift from emerald green to jade-teal in the central reaction flask',
    x: 235,
    y: 360,
    radius: 28,
    type: 'color', // Emerald #10b981 on left vs Jade-Teal #0d9488 on right (subtle)
  },
  {
    id: 'diff_butterfly_spots',
    name: 'Blue Morpho Wing Margin Dots',
    description: 'Delicate white margin dots on the wing of the perched blue morpho butterfly',
    x: 105,
    y: 200,
    radius: 26,
    type: 'detail', // 4 white margin dots on left vs 2 dots on right
  },
  {
    id: 'diff_microscope_objective',
    name: 'Brass Microscope Objective Turret',
    description: 'Triple brass objective nosepiece on the antique monocular microscope',
    x: 435,
    y: 350,
    radius: 26,
    type: 'detail', // 3 objective barrels on left vs 2 barrels on right
  },
  {
    id: 'diff_bell_jar_spore',
    name: 'Preserved Specimen Petal Count',
    description: 'Rare glowing nocturnal botanical flower under the glass bell jar',
    x: 345,
    y: 335,
    radius: 28,
    type: 'detail', // 6 luminous petals on left vs 5 petals on right
  },
  {
    id: 'diff_grimoire_bookmark',
    name: 'Botanical Folio Silk Ribbon Marker',
    description: 'Braided ribbon marker draped over the open botanical herbarium book',
    x: 505,
    y: 435,
    radius: 24,
    type: 'color', // Crimson #b91c1c on left vs Rust-Orange #c2410c on right (subtle shift)
  },
  {
    id: 'diff_flytrap_lobe',
    name: 'Carnivorous Venus Flytrap Jaws',
    description: 'Open toothy trap jaw on the potted specimen plant',
    x: 165,
    y: 395,
    radius: 26,
    type: 'state', // Open needle-toothed jaws on left vs half-closed jaws on right
  },
  {
    id: 'diff_hanging_orchid',
    name: 'Conservatory Hanging Orchid Bloom',
    description: 'Blossoming orchid flower count in the upper wrought-iron wire basket',
    x: 475,
    y: 135,
    radius: 28,
    type: 'object', // 3 magenta blooms on left vs 2 blooms on right (with ghost on right)
  },
  {
    id: 'diff_glass_condenser_coil',
    name: 'Liebig Condenser Spiral Turns',
    description: 'Spiraling internal vapor coil winding through the glass condenser jacket',
    x: 285,
    y: 315,
    radius: 26,
    type: 'detail', // 5 spiral turns on left vs 4 turns on right
  },
  {
    id: 'diff_ivy_tendril',
    name: 'Gothic Muntin Creeping Ivy Sprout',
    description: 'Curling green ivy tendril sprouting from the central structural iron arch',
    x: 300,
    y: 55,
    radius: 22,
    type: 'visibility', // Tender leaf tendril on left vs ghost outline on right
  },
  {
    id: 'diff_amber_reagent_bottle',
    name: 'Apothecary Dropper Vial Fluid Level',
    description: 'Liquid fill level within the amber medicinal tincture vial',
    x: 395,
    y: 405,
    radius: 24,
    type: 'detail', // 80% liquid fill on left vs 40% fill on right
  },
  {
    id: 'diff_bench_brass_gauge',
    name: 'Distillation Boiler Manometer Needle',
    description: 'Brass boiler pressure gauge indicator needle orientation',
    x: 190,
    y: 315,
    radius: 24,
    type: 'rotation', // Needle at 2 o clock green sector on left vs 10 o clock on right
  },
  {
    id: 'diff_watering_can_rose',
    name: 'Brass Watering Can Rose Head',
    description: 'Perforated sprinkler rose head on the long spout of the watering can',
    x: 95,
    y: 525,
    radius: 26,
    type: 'detail', // Brass perforated rosette head on left vs plain open spout on right
  },
  {
    id: 'diff_floor_terracotta_pot',
    name: 'Floor Terracotta Pot Seedling Count',
    description: 'Small fresh green botanical sprouts in the lower floor pot',
    x: 275,
    y: 540,
    radius: 26,
    type: 'detail', // 3 sprouts on left vs 2 sprouts on right
  },
  {
    id: 'diff_fern_frond_lower',
    name: 'Giant Floor Fern Frond Leaflet',
    description: 'Arching fern leaf extending from the large floor pottery urn',
    x: 480,
    y: 535,
    radius: 28,
    type: 'detail', // Full serrated frond on left vs shorter frond on right
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
    // 1. SKY GRADIENT & VAULTED GLASS CONSERVATORY CEILING
    // -------------------------------------------------------------
    const skyGrad = Painter.linearGradient(ctx, 0, 0, 0, H * 0.6, [
      [0.0, '#061523'],
      [0.4, '#0e2b3d'],
      [0.8, '#143c4a'],
      [1.0, '#1a4e58'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H * 0.6, 0, skyGrad);

    // Subtle moonlit stars through glass
    const stars = [
      [65, 35], [140, 60], [215, 25], [290, 45], [370, 30], [440, 55], [515, 40],
      [100, 95], [240, 80], [390, 90], [530, 85]
    ];
    for (const [sx, sy] of stars) {
      Painter.circle(ctx, sx, sy, 1.2, '#c7d2fe');
    }

    // Diagonal atmospheric moonlight shafts / condensation sheen
    Painter.polygon(ctx, [[120, 0], [200, 0], [380, H * 0.7], [260, H * 0.7]], 'rgba(186, 230, 253, 0.08)');
    Painter.polygon(ctx, [[300, 0], [370, 0], [550, H * 0.7], [450, H * 0.7]], 'rgba(186, 230, 253, 0.06)');

    // Wrought Iron Gothic Arch Muntins & Conservatory Framework
    // Vertical ribs
    for (let ix = 45; ix < W; ix += 72) {
      Painter.line(ctx, ix, 0, ix, H * 0.58, '#1e293b', 2.8);
      Painter.line(ctx, ix + 1, 0, ix + 1, H * 0.58, '#334155', 1.2);
    }
    // Grand concentric arched ribs
    ctx.save();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(W / 2, 270, 275, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, 330, 230, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, 390, 185, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Translucent glass pane highlights
    for (let px = 55; px < W - 50; px += 72) {
      Painter.line(ctx, px, 40, px + 35, 95, 'rgba(255, 255, 255, 0.12)', 1.5);
    }

    // Difference 9: Ivy Tendril on Central Iron Rib
    const diffIvy = hasDiff('diff_ivy_tendril');
    if (!diffIvy) {
      Painter.circle(ctx, 300, 55, 4.5, '#22c55e', '#052e16', 1);
      Painter.polygon(ctx, [[300, 53], [306, 46], [304, 55]], '#4ade80');
      Painter.line(ctx, 296, 58, 300, 55, '#15803d', 1.5);
    } else {
      // Subtle ghost outline of the tendril
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.circle(ctx, 300, 55, 4, null, '#4ade80', 1);
      ctx.restore();
    }

    // Lush creeping ivy draping across top arches
    const ivyPacks = [
      { x: 30, y: 25, r: 35 }, { x: 90, y: 35, r: 28 }, { x: 180, y: 20, r: 25 },
      { x: 420, y: 20, r: 25 }, { x: 500, y: 35, r: 28 }, { x: 560, y: 25, r: 35 },
    ];
    for (const ip of ivyPacks) {
      Painter.ellipse(ctx, ip.x, ip.y, ip.r, ip.r * 0.6, 0.1, '#15803d', '#052e16', 1);
      Painter.ellipse(ctx, ip.x + 4, ip.y + 2, ip.r * 0.75, ip.r * 0.45, -0.1, '#22c55e');
    }

    // -------------------------------------------------------------
    // 2. SUSPENDED FERNS & ORCHID WIRE BASKETS (Upper Layer)
    // -------------------------------------------------------------
    // Left Hanging Fern Basket & Perched Morpho Butterfly
    Painter.line(ctx, 110, 0, 110, 110, '#334155', 1.5); // Chain
    Painter.roundedRect(ctx, 88, 110, 44, 20, 5, '#1c1917', '#475569', 1.4); // Wire basket
    // Cascading fern fronds
    for (let f = 0; f < 6; f++) {
      const fx = 82 + f * 9;
      Painter.ellipse(ctx, fx, 126 + (f % 2) * 8, 7, 18, 0.22 * (f - 2.5), '#16a34a', '#052e16', 0.8);
      Painter.ellipse(ctx, fx, 130 + (f % 2) * 8, 5, 14, 0.22 * (f - 2.5), '#4ade80');
    }

    // Difference 2: Blue Morpho Butterfly perched on lower fern frond
    const diffBfly = hasDiff('diff_butterfly_spots');
    const bflyX = 105;
    const bflyY = 200;
    // Arching fern leaf perch
    Painter.ellipse(ctx, bflyX, bflyY + 8, 38, 7, -0.2, '#15803d', '#052e16', 1);
    Painter.line(ctx, bflyX - 30, bflyY + 12, bflyX + 30, bflyY + 4, '#22c55e', 1.2);

    // Butterfly wings
    Painter.ellipse(ctx, bflyX - 9, bflyY - 4, 12, 15, -0.35, '#0284c7', '#082f49', 1.2);
    Painter.ellipse(ctx, bflyX + 9, bflyY - 4, 12, 15, 0.35, '#0284c7', '#082f49', 1.2);
    Painter.ellipse(ctx, bflyX - 7, bflyY + 6, 8, 10, -0.2, '#38bdf8', '#082f49', 1);
    Painter.ellipse(ctx, bflyX + 7, bflyY + 6, 8, 10, 0.2, '#38bdf8', '#082f49', 1);
    Painter.line(ctx, bflyX, bflyY - 11, bflyX, bflyY + 12, '#0f172a', 2.2); // Thorax body
    // Antennae
    Painter.line(ctx, bflyX, bflyY - 10, bflyX - 5, bflyY - 16, '#0f172a', 1);
    Painter.line(ctx, bflyX, bflyY - 10, bflyX + 5, bflyY - 16, '#0f172a', 1);

    // White decorative margin dots (4 on left, 2 on right — subtle fair difference)
    const dotCount = diffBfly ? 2 : 4;
    const dotCoords = [
      [-17, -8], [-19, -3], [17, -8], [19, -3]
    ];
    for (let di = 0; di < dotCount; di++) {
      const [dx, dy] = dotCoords[di];
      Painter.circle(ctx, bflyX + dx, bflyY + dy, 1.3, '#ffffff');
    }

    // Difference 7: Right Hanging Orchid Wire Basket
    const diffOrchid = hasDiff('diff_hanging_orchid');
    const orcX = 475;
    const orcY = 135;
    Painter.line(ctx, orcX, 0, orcX, orcY - 14, '#334155', 1.5);
    Painter.ellipse(ctx, orcX, orcY, 24, 11, 0, '#292524', '#44403c', 1.4);

    const bloomCount = diffOrchid ? 2 : 3;
    const bloomOffsets = [
      { dx: -13, dy: -4 },
      { dx: 11, dy: -2 },
      { dx: 0, dy: 9 }
    ];
    for (let bi = 0; bi < bloomCount; bi++) {
      const bx = orcX + bloomOffsets[bi].dx;
      const by = orcY + bloomOffsets[bi].dy;
      Painter.circle(ctx, bx, by, 7, '#c026d3', '#701a75', 1);
      Painter.circle(ctx, bx, by, 3.5, '#f472b6');
      Painter.circle(ctx, bx, by, 1.4, '#fde047');
    }
    if (diffOrchid) {
      // Ghost outline for the missing 3rd orchid bloom
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.circle(ctx, orcX, orcY + 9, 6.5, null, '#f472b6', 1);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 3. MIDGROUND ALCHEMICAL WORKBENCH & SHELVING
    // -------------------------------------------------------------
    const benchY = 355;
    // Heavy carved mahogany & walnut laboratory table
    Painter.roundedRect(ctx, 24, benchY, W - 48, 80, 4, '#3b1d11', '#180a04', 2.2);
    // Beveled tabletop lip
    Painter.roundedRect(ctx, 16, benchY - 14, W - 32, 16, 3, '#5c2406', '#291104', 1.8);
    // Table drawer handles (Brass pull rings)
    Painter.circle(ctx, 120, benchY + 30, 4, null, '#d97706', 1.5);
    Painter.circle(ctx, 280, benchY + 30, 4, null, '#d97706', 1.5);
    Painter.circle(ctx, 440, benchY + 30, 4, null, '#d97706', 1.5);

    // Difference 6: Potted Venus Flytrap on Workbench
    const diffFlytrap = hasDiff('diff_flytrap_lobe');
    const flyX = 165;
    const flyY = 395;
    // Terracotta pot
    Painter.polygon(ctx, [
      [flyX - 16, flyY - 12],
      [flyX + 16, flyY - 12],
      [flyX + 12, flyY + 14],
      [flyX - 12, flyY + 14]
    ], '#c2410c', '#7c2d12', 1.5);
    Painter.line(ctx, flyX, flyY - 12, flyX, flyY - 30, '#16a34a', 3);

    if (!diffFlytrap) {
      // Wide open toothy jaws
      Painter.ellipse(ctx, flyX - 6, flyY - 34, 10, 6, -0.4, '#22c55e', '#14532d', 1.2);
      Painter.ellipse(ctx, flyX + 6, flyY - 34, 10, 6, 0.4, '#22c55e', '#14532d', 1.2);
      Painter.circle(ctx, flyX, flyY - 34, 4, '#dc2626');
      for (let ti = -8; ti <= 8; ti += 4) {
        Painter.line(ctx, flyX + ti, flyY - 40, flyX + ti, flyY - 36, '#fef08a', 1.2);
      }
    } else {
      // Half-closed jaws (subtle difference)
      Painter.ellipse(ctx, flyX, flyY - 32, 8, 10, 0.05, '#15803d', '#052e16', 1.5);
      Painter.line(ctx, flyX, flyY - 37, flyX, flyY - 27, '#fef08a', 1.2);
    }

    // Difference 11: Distillation Boiler Manometer Gauge
    const diffGauge = hasDiff('diff_bench_brass_gauge');
    const boilerX = 190;
    const boilerY = 315;
    // Copper distillation vessel
    Painter.ellipse(ctx, boilerX, boilerY + 14, 16, 14, 0, '#b45309', '#451a03', 1.5);
    // Brass pressure gauge
    Painter.circle(ctx, boilerX, boilerY - 6, 9, '#fef3c7', '#78350f', 1.8);
    // Needle pointer: 2 o clock (green sector) vs 10 o clock (neutral sector)
    const needleAngle = diffGauge ? -Math.PI * 0.75 : -Math.PI * 0.15;
    Painter.line(
      ctx,
      boilerX,
      boilerY - 6,
      boilerX + Math.cos(needleAngle) * 6,
      boilerY - 6 + Math.sin(needleAngle) * 6,
      '#dc2626',
      1.5
    );

    // Difference 1: Central Florence Boiling Flask (Subtle tone: Emerald vs Jade-Teal)
    const diffPotion = hasDiff('diff_flask_liquid_color');
    const flaskX = 235;
    const flaskY = 360;
    const potionColor = diffPotion ? '#0d9488' : '#10b981'; // Jade-teal vs Emerald green (subtle & harmonious)
    const potionGlow = diffPotion ? 'rgba(13, 148, 136, 0.4)' : 'rgba(16, 185, 129, 0.4)';

    // Soft radial glow aura
    Painter.circle(ctx, flaskX, flaskY + 6, 28, potionGlow);

    // Glass spherical chamber
    Painter.circle(ctx, flaskX, flaskY + 6, 19, null, 'rgba(224, 242, 254, 0.65)', 1.8);
    Painter.roundedRect(ctx, flaskX - 5, flaskY - 24, 10, 20, 1, null, 'rgba(224, 242, 254, 0.65)', 1.8);
    Painter.ellipse(ctx, flaskX, flaskY - 24, 6.5, 2.5, 0, null, 'rgba(224, 242, 254, 0.65)', 1.5);

    // Liquid inside flask
    Painter.circle(ctx, flaskX, flaskY + 7, 16, potionColor);
    // Bubbles
    Painter.circle(ctx, flaskX - 5, flaskY + 6, 2, '#ffffff');
    Painter.circle(ctx, flaskX + 4, flaskY + 2, 1.8, '#ffffff');
    Painter.circle(ctx, flaskX - 1, flaskY - 4, 1.5, '#ffffff');

    // Difference 8: Liebig Condenser Vapor Coil
    const diffCoil = hasDiff('diff_glass_condenser_coil');
    const coilX = 285;
    const coilY = 315;
    // Outer glass condenser tube
    Painter.roundedRect(ctx, coilX - 7, coilY - 28, 14, 50, 3, 'rgba(224, 242, 254, 0.35)', '#94a3b8', 1.2);
    // Spiral turns: 5 turns on left vs 4 turns on right (subtle technical difference)
    const turnCount = diffCoil ? 4 : 5;
    const turnSpacing = 40 / turnCount;
    for (let ti = 0; ti < turnCount; ti++) {
      const cy = coilY - 20 + ti * turnSpacing;
      Painter.ellipse(ctx, coilX, cy, 5, 2.5, 0.2, null, '#f59e0b', 1.8);
    }

    // Difference 4: Rare Specimen in Glass Bell Jar
    const diffJar = hasDiff('diff_bell_jar_spore');
    const jarX = 345;
    const jarY = 335;
    // Turned dark walnut plinth
    Painter.roundedRect(ctx, jarX - 20, jarY + 22, 40, 8, 2, '#451a03', '#1c0a01', 1.5);
    // Glass bell dome
    Painter.roundedRect(ctx, jarX - 16, jarY - 24, 32, 46, 12, 'rgba(224, 242, 254, 0.35)', '#bae6fd', 1.5);
    Painter.circle(ctx, jarX, jarY - 26, 4, 'rgba(224, 242, 254, 0.6)', '#bae6fd', 1.2);

    // Glowing Specimen flower: 6 petals on left vs 5 petals on right (subtle difference)
    const petalCount = diffJar ? 5 : 6;
    Painter.circle(ctx, jarX, jarY + 6, 14, 'rgba(250, 204, 21, 0.35)');
    Painter.star(ctx, jarX, jarY + 6, petalCount, 9, 5, '#facc15');
    Painter.circle(ctx, jarX, jarY + 6, 2.5, '#ffffff');

    // Difference 10: Apothecary Dropper Stopper Fluid Level
    const diffDropper = hasDiff('diff_amber_reagent_bottle');
    const vialX = 395;
    const vialY = 405;
    Painter.roundedRect(ctx, vialX - 6, vialY - 12, 12, 20, 2, '#78350f', '#451a03', 1.2); // Amber bottle
    Painter.line(ctx, vialX - 6, vialY, vialX + 6, vialY, '#fef08a', 0.8); // Label
    Painter.ellipse(ctx, vialX, vialY - 16, 4, 6, 0, '#1e293b', '#0f172a', 1.2); // Dropper bulb
    // Liquid fill level: 80% on left vs 40% on right
    const fillH = diffDropper ? 7 : 14;
    Painter.roundedRect(ctx, vialX - 5, vialY + 6 - fillH, 10, fillH, 1, '#1e3a8a');

    // Difference 3: Antique Brass Microscope
    const diffMicro = hasDiff('diff_microscope_objective');
    const micX = 435;
    const micY = 350;
    // Heavy base
    Painter.ellipse(ctx, micX, micY + 36, 18, 6, 0, '#b45309', '#451a03', 1.5);
    Painter.line(ctx, micX, micY + 36, micX, micY + 16, '#d97706', 4); // Pillar
    Painter.roundedRect(ctx, micX - 14, micY + 14, 28, 4, 1, '#1e293b', '#451a03', 1); // Stage
    // Curved brass arm & optical tube
    Painter.line(ctx, micX, micY + 16, micX + 12, micY, '#d97706', 4);
    Painter.line(ctx, micX + 12, micY, micX, micY - 14, '#d97706', 4);
    Painter.line(ctx, micX, micY - 14, micX - 4, micY - 32, '#f59e0b', 5);
    Painter.ellipse(ctx, micX - 4, micY - 32, 5, 2, -0.2, '#fde047', '#78350f', 1);

    // Revolving Nosepiece Objective barrels: 3 on left vs 2 on right
    const objCount = diffMicro ? 2 : 3;
    for (let oi = 0; oi < objCount; oi++) {
      const ox = micX - 6 + oi * 5;
      Painter.line(ctx, ox, micY - 8, ox - 1, micY + 4, '#d97706', 2.5);
    }
    if (diffMicro) {
      // Ghost outline of 3rd lens
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.line(ctx, micX + 4, micY - 8, micX + 3, micY + 4, '#d97706', 1.5);
      ctx.restore();
    }

    // Difference 5: Open Botanical Folio & Silk Ribbon
    const diffBook = hasDiff('diff_grimoire_bookmark');
    const bookX = 505;
    const bookY = 435;
    // Open leather binding
    Painter.polygon(ctx, [
      [bookX - 32, bookY + 12], [bookX, bookY + 6], [bookX + 32, bookY + 12],
      [bookX + 28, bookY + 22], [bookX, bookY + 16], [bookX - 28, bookY + 22]
    ], '#451a03', '#1c0a01', 1.5);

    // Parchment open pages
    Painter.polygon(ctx, [
      [bookX - 30, bookY + 8], [bookX, bookY + 3], [bookX - 2, bookY + 15], [bookX - 26, bookY + 18]
    ], '#fef3c7', '#d97706', 0.8);
    Painter.polygon(ctx, [
      [bookX, bookY + 3], [bookX + 30, bookY + 8], [bookX + 26, bookY + 18], [bookX + 2, bookY + 15]
    ], '#fef3c7', '#d97706', 0.8);

    // Botanical plant sketch on left page
    Painter.line(ctx, bookX - 16, bookY + 8, bookX - 16, bookY + 15, '#15803d', 1.2);
    Painter.circle(ctx, bookX - 16, bookY + 7, 2, '#c026d3');

    // Ribbon marker: Crimson #b91c1c vs Rust #c2410c (subtle shift)
    const ribbonColor = diffBook ? '#c2410c' : '#b91c1c';
    Painter.line(ctx, bookX, bookY + 4, bookX + 6, bookY + 28, ribbonColor, 2.5);
    Painter.polygon(ctx, [[bookX + 4, bookY + 28], [bookX + 8, bookY + 28], [bookX + 6, bookY + 32]], ribbonColor);

    // -------------------------------------------------------------
    // 4. LOWER FLOOR (~40% OF PANEL DENSELY FILLED)
    // -------------------------------------------------------------
    const floorY = 435;
    // Antique herringbone terracotta brick flooring
    Painter.roundedRect(ctx, 0, floorY, W, H - floorY, 0, '#261b17');
    for (let fx = 0; fx < W; fx += 38) {
      Painter.line(ctx, fx, floorY, fx, H, '#3b251e', 1.4);
    }
    for (let fy = floorY + 16; fy < H; fy += 28) {
      Painter.line(ctx, 0, fy, W, fy, '#1a110e', 1.2);
    }

    // Wooden lower storage shelf with seedling pots
    Painter.roundedRect(ctx, 220, 455, 170, 8, 2, '#451a03', '#1c0a01', 1.5);
    for (let potI = 0; potI < 5; potI++) {
      const px = 236 + potI * 32;
      Painter.polygon(ctx, [
        [px - 8, 443], [px + 8, 443], [px + 6, 455], [px - 6, 455]
      ], '#c2410c', '#7c2d12', 1);
      // Green sprouts
      Painter.circle(ctx, px, 439, 3, '#22c55e');
    }

    // Difference 12: Brass Watering Can on Lower Left Floor
    const diffCan = hasDiff('diff_watering_can_rose');
    const canX = 95;
    const canY = 525;
    // Cylindrical brass body
    Painter.roundedRect(ctx, canX - 18, canY - 14, 36, 28, 4, '#b45309', '#78350f', 1.5);
    Painter.circle(ctx, canX, canY, 3, '#f59e0b'); // Body sheen
    // Top handle
    Painter.circle(ctx, canX, canY - 14, 12, null, '#d97706', 2);
    // Spout extending right
    Painter.line(ctx, canX + 16, canY + 4, canX + 38, canY - 10, '#d97706', 3.5);
    if (!diffCan) {
      // Perforated rosette head on spout
      Painter.circle(ctx, canX + 41, canY - 12, 5, '#f59e0b', '#78350f', 1.2);
      Painter.circle(ctx, canX + 41, canY - 12, 1, '#1c0a01');
    } else {
      // Plain straight spout tip
      Painter.line(ctx, canX + 36, canY - 9, canX + 42, canY - 12, '#b45309', 2.5);
    }

    // Large potted Monstera (Left floor corner)
    const monX = 35;
    const monY = 510;
    Painter.polygon(ctx, [
      [monX - 22, monY], [monX + 22, monY], [monX + 16, monY + 40], [monX - 16, monY + 40]
    ], '#78350f', '#451a03', 1.5);
    // Broad Monstera leaves
    Painter.ellipse(ctx, monX - 12, monY - 25, 26, 16, -0.4, '#15803d', '#052e16', 1.2);
    Painter.ellipse(ctx, monX + 14, monY - 20, 24, 15, 0.35, '#16a34a', '#052e16', 1.2);
    Painter.ellipse(ctx, monX, monY - 40, 20, 28, -0.05, '#22c55e', '#052e16', 1.2);

    // Difference 13: Terracotta Floor Pot Sprouts (Center Floor)
    const diffFloorPot = hasDiff('diff_floor_terracotta_pot');
    const fpotX = 275;
    const fpotY = 540;
    Painter.polygon(ctx, [
      [fpotX - 18, fpotY - 14], [fpotX + 18, fpotY - 14],
      [fpotX + 14, fpotY + 16], [fpotX - 14, fpotY + 16]
    ], '#c2410c', '#7c2d12', 1.5);
    Painter.ellipse(ctx, fpotX, fpotY - 14, 17, 5, 0, '#78350f'); // Soil

    const sproutCount = diffFloorPot ? 2 : 3;
    const sproutOffsets = [-8, 0, 8];
    for (let si = 0; si < sproutCount; si++) {
      const sx = fpotX + sproutOffsets[si];
      Painter.line(ctx, sx, fpotY - 14, sx, fpotY - 26, '#15803d', 1.8);
      Painter.circle(ctx, sx - 2, fpotY - 27, 2.5, '#4ade80');
      Painter.circle(ctx, sx + 2, fpotY - 27, 2.5, '#4ade80');
    }
    if (diffFloorPot) {
      // Ghost outline for the 3rd sprout
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.line(ctx, fpotX + 8, fpotY - 14, fpotX + 8, fpotY - 26, '#4ade80', 1);
      ctx.restore();
    }

    // Difference 14: Giant Floor Fern Pottery Urn (Right floor corner)
    const diffFern = hasDiff('diff_fern_frond_lower');
    const urnX = 510;
    const urnY = 520;
    // Glazed blue ceramic urn
    Painter.ellipse(ctx, urnX, urnY + 15, 26, 32, 0, '#1e3a8a', '#0f172a', 1.8);
    Painter.ellipse(ctx, urnX, urnY - 17, 18, 5, 0, '#3b82f6', '#1e3a8a', 1.2);
    // Fan of lush fern leaves
    Painter.ellipse(ctx, urnX - 25, urnY - 32, 12, 34, -0.6, '#15803d', '#052e16', 1);
    Painter.ellipse(ctx, urnX + 22, urnY - 28, 11, 30, 0.5, '#15803d', '#052e16', 1);
    Painter.ellipse(ctx, urnX, urnY - 45, 10, 36, -0.1, '#22c55e', '#052e16', 1);

    // Specific arching frond leaflet
    if (!diffFern) {
      Painter.ellipse(ctx, urnX - 42, urnY - 12, 8, 28, -0.85, '#16a34a', '#052e16', 1);
    } else {
      // Ghost outline of missing frond
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.ellipse(ctx, urnX - 42, urnY - 12, 8, 28, -0.85, null, '#16a34a', 1);
      ctx.restore();
    }

    // Scattered clay pots and pruning shears
    Painter.polygon(ctx, [[400, 545], [418, 545], [414, 562], [404, 562]], '#9a3412', '#431407', 1.2);
    Painter.line(ctx, 424, 555, 436, 562, '#475569', 2); // Shears

    ctx.restore();
  }
}
