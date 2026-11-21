// Clockwork Attic Scene (Scene 4)
// Master horologist’s observatory with giant interlocking brass gears, grandfather clock, celestial astrolabe and skylight moonbeam.

import { Painter } from '../painter.js';
import { PALETTE, hexToRgba } from '../palette.js';
import { VIEW } from '../config.js';

export const ATTIC_CANDIDATE_DIFFERENCES = [
  {
    id: 'diff_clock_hand_time',
    name: 'Clock Face Minute Hand Position',
    description: 'Minute hand pointing straight up at XII vs shifted to XI',
    x: 105,
    y: 215,
    radius: 26,
    type: 'rotation', // 12:00 straight up on left, 11:55 angled on right
  },
  {
    id: 'diff_gear_missing_tooth',
    name: 'Master Cogwheel Tooth Integrity',
    description: 'Intact perimeter teeth on the giant primary brass gear',
    x: 290,
    y: 185,
    radius: 28,
    type: 'detail', // complete gear teeth on left, one missing notched tooth on right
  },
  {
    id: 'diff_hourglass_sand',
    name: 'Brass Hourglass Flowing Sand',
    description: 'Golden stream of trickle sand flowing through the glass waist',
    x: 485,
    y: 440,
    radius: 26,
    type: 'state', // active falling sand stream on left, upper chamber empty on right
  },
  {
    id: 'diff_telescope_brass_band',
    name: 'Brass Telescope Engraved Collar',
    description: 'Engraved silver collar band circling the telescope barrel',
    x: 395,
    y: 270,
    radius: 26,
    type: 'detail', // silver collar on left, solid plain brass on right
  },
  {
    id: 'diff_astrolabe_pointer',
    name: 'Celestial Armillary Pointer Needle',
    description: 'Planetary indicator arm oriented toward the zenith meridian',
    x: 495,
    y: 310,
    radius: 28,
    type: 'rotation', // tilted toward upper-right on left, upper-left on right
  },
  {
    id: 'diff_pendulum_bob',
    name: 'Grandfather Clock Pendulum Bob Metal',
    description: 'Heavy circular pendulum bob swinging in the wooden case',
    x: 105,
    y: 360,
    radius: 26,
    type: 'color', // polished gold brass on left, brushed silver steel on right
  },
  {
    id: 'diff_skylight_star',
    name: 'Skylight Constellation Star',
    description: 'Brilliant northern star visible through the circular glass skylight',
    x: 320,
    y: 55,
    radius: 24,
    type: 'visibility', // visible through glass on left, missing on right
  },
  {
    id: 'diff_blueprint_gear_sketch',
    name: 'Horological Blueprint Technical Drawing',
    description: 'Parchment schematic showing gear teeth vs spiral balance spring',
    x: 230,
    y: 490,
    radius: 26,
    type: 'detail', // intermeshing gear schematic on left, spiral hairspring on right
  },
  {
    id: 'diff_pocket_watch_chain',
    name: 'Pocket Watch Gold Curb Chain',
    description: 'Curb link fob chain draped from the exposed pocket watch',
    x: 335,
    y: 465,
    radius: 26,
    type: 'visibility', // gold chain link draped on left, absent on right
  },
  {
    id: 'diff_steel_pinion_gear',
    name: 'Drivetrain Pinion Gear Spoke Count',
    description: 'Six-spoked steel pinion gear meshed into the reduction train',
    x: 205,
    y: 255,
    radius: 26,
    type: 'object', // 6 curved spokes on left, 4 cross spokes on right
  },
  {
    id: 'diff_horologist_loupe',
    name: 'Watchmaker Jeweler Loupe',
    description: 'Brass inspection loupe eyepiece resting beside the balance cock',
    x: 420,
    y: 485,
    radius: 24,
    type: 'visibility', // jeweler loupe present on left, missing on right
  },
  {
    id: 'diff_attic_key',
    name: 'Skeleton Key on Timber Nail',
    description: 'Antique wrought-iron cabinet key hanging from the timber beam',
    x: 60,
    y: 135,
    radius: 24,
    type: 'visibility', // hanging skeleton key visible on left, absent on right
  },
];

export class AtticScene {
  constructor() {
    this.key = 'attic';
    this.title = 'Clockwork Attic';
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
    // 1. ATTIC TIMBER WALLS & ROOF RAFTERS
    // -------------------------------------------------------------
    // Dark timber plank background
    const wallGrad = Painter.linearGradient(ctx, 0, 0, 0, H, [
      [0.0, PALETTE.attic.wallWoodDark],
      [0.5, PALETTE.attic.wallWoodMid],
      [1.0, '#141210'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H, 0, wallGrad);

    // Slanted attic ceiling beams (Gabled roofline)
    Painter.polygon(ctx, [[0, 0], [W, 0], [W, 60], [0, 140]], PALETTE.attic.rafterBeam, '#0a0908', 2);
    // Vertical beam trusses
    Painter.roundedRect(ctx, 40, 0, 18, H, 2, PALETTE.attic.rafterBeam, '#0a0908', 1.5);
    Painter.roundedRect(ctx, 530, 0, 18, H, 2, PALETTE.attic.rafterBeam, '#0a0908', 1.5);
    Painter.roundedRect(ctx, 0, 140, W, 14, 2, '#211d1a', '#0a0908', 1.5); // Collar beam

    // Difference 12: Wrought-iron Skeleton Key hanging on left timber
    const hideKey = hasDiff('diff_attic_key');
    if (!hideKey) {
      Painter.circle(ctx, 60, 130, 3, '#1c1917'); // Nail
      Painter.circle(ctx, 60, 137, 5, null, '#475569', 2); // Key bow
      Painter.line(ctx, 60, 142, 60, 154, '#475569', 2.5); // Key bit shank
      Painter.line(ctx, 60, 151, 64, 151, '#475569', 2);
      Painter.line(ctx, 60, 154, 63, 154, '#475569', 2);
    } else {
      // Dashed ghost outline of missing key
      Painter.circle(ctx, 60, 130, 3, '#1c1917'); // Nail stays
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.circle(ctx, 60, 137, 5, null, '#94a3b8', 1.5);
      Painter.line(ctx, 60, 142, 60, 154, '#94a3b8', 1.5);
      Painter.line(ctx, 60, 151, 64, 151, '#94a3b8', 1.5);
      Painter.line(ctx, 60, 154, 63, 154, '#94a3b8', 1.5);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 2. CIRCULAR SKYLIGHT & VOLUMETRIC MOONBEAM
    // -------------------------------------------------------------
    const skyX = 320;
    const skyY = 65;
    const skyR = 38;

    // Circular skylight frame
    Painter.circle(ctx, skyX, skyY, skyR + 4, null, '#292524', 3.5);
    // Night sky glass
    Painter.circle(ctx, skyX, skyY, skyR, PALETTE.attic.skylightGlass);
    // Brass glazing mullions (cross)
    Painter.line(ctx, skyX - skyR, skyY, skyX + skyR, skyY, '#44403c', 2);
    Painter.line(ctx, skyX, skyY - skyR, skyX, skyY + skyR, '#44403c', 2);

    // Difference 7: Brilliant Star through Skylight
    const hideSkylightStar = hasDiff('diff_skylight_star');
    if (!hideSkylightStar) {
      Painter.star(ctx, skyX, skyY - 12, 4, 6, 2.5, '#bae6fd');
      Painter.circle(ctx, skyX, skyY - 12, 8, 'rgba(186, 230, 253, 0.45)');
    } else {
      // Dashed ghost circle of the missing star
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.circle(ctx, skyX, skyY - 12, 5, null, '#bae6fd', 1.2);
      ctx.restore();
    }

    // Volumetric Angled Moonbeam casting across the attic
    Painter.polygon(ctx, [
      [skyX - 25, skyY + 25],
      [skyX + 25, skyY + 25],
      [W - 40, H],
      [140, H]
    ], PALETTE.attic.moonbeam);

    // Inner brighter core of the beam
    Painter.polygon(ctx, [
      [skyX - 10, skyY + 30],
      [skyX + 10, skyY + 30],
      [W - 120, H],
      [240, H]
    ], PALETTE.attic.moonbeamCore);

    // Floating atmospheric dust motes
    for (let m = 0; m < 20; m++) {
      const mx = 200 + ((m * 37) % 320);
      const my = 120 + ((m * 49) % 360);
      Painter.circle(ctx, mx, my, 1.2, 'rgba(254, 240, 138, 0.45)');
    }

    // -------------------------------------------------------------
    // 3. GIANT INTERLOCKING WALL GEARS (Back Wall Mechanism)
    // -------------------------------------------------------------
    // Helper to draw a gear with teeth
    const drawGear = (gx, gy, r, teeth, color, rimColor, spokeType = 'cutout') => {
      ctx.save();
      // Outer teeth
      ctx.fillStyle = color;
      ctx.strokeStyle = rimColor;
      ctx.lineWidth = 1.5;
      const step = (Math.PI * 2) / teeth;
      for (let i = 0; i < teeth; i++) {
        const ang = i * step;
        const tx = gx + Math.cos(ang) * (r + 4);
        const ty = gy + Math.sin(ang) * (r + 4);
        Painter.circle(ctx, tx, ty, 3.5, color, rimColor, 1);
      }
      // Main Gear Rim & Body
      Painter.circle(ctx, gx, gy, r, color, rimColor, 2);
      // Hub and spokes
      if (spokeType === 'cutout') {
        Painter.circle(ctx, gx, gy, r * 0.72, '#1c1917', rimColor, 1.5);
        for (let s = 0; s < 4; s++) {
          const sang = (Math.PI / 2) * s;
          Painter.line(ctx, gx, gy, gx + Math.cos(sang) * r, gy + Math.sin(sang) * r, color, 3.5);
        }
      } else if (spokeType === 'six_spoke') {
        Painter.circle(ctx, gx, gy, r * 0.68, '#1c1917', rimColor, 1.5);
        for (let s = 0; s < 6; s++) {
          const sang = (Math.PI / 3) * s;
          Painter.line(ctx, gx, gy, gx + Math.cos(sang) * r, gy + Math.sin(sang) * r, color, 3);
        }
      } else if (spokeType === 'four_cross') {
        Painter.circle(ctx, gx, gy, r * 0.68, '#1c1917', rimColor, 1.5);
        for (let s = 0; s < 4; s++) {
          const sang = (Math.PI / 2) * s;
          Painter.line(ctx, gx, gy, gx + Math.cos(sang) * r, gy + Math.sin(sang) * r, color, 4);
        }
      }
      Painter.circle(ctx, gx, gy, r * 0.28, rimColor);
      Painter.circle(ctx, gx, gy, 4, '#0f172a'); // Axle shaft
      ctx.restore();
    };

    // Upper Bronze Gear
    drawGear(370, 130, 36, 16, PALETTE.attic.bronzeGear, '#451a03');

    // Difference 2: Master Primary Brass Gear (Intact vs Missing Tooth)
    const gearDiff = hasDiff('diff_gear_missing_tooth');
    const masterGX = 290;
    const masterGY = 185;
    const masterR = 52;
    const masterTeeth = 20;

    ctx.save();
    const toothStep = (Math.PI * 2) / masterTeeth;
    for (let i = 0; i < masterTeeth; i++) {
      const ang = i * toothStep;
      const tx = masterGX + Math.cos(ang) * (masterR + 5);
      const ty = masterGY + Math.sin(ang) * (masterR + 5);
      if (gearDiff && i === 5) {
        // Missing tooth on right panel - draw faint dashed ghost silhouette!
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.setLineDash([2, 2]);
        Painter.circle(ctx, tx, ty, 4.5, null, PALETTE.attic.brassGearLight, 1.2);
        ctx.restore();
        continue;
      }
      Painter.circle(ctx, tx, ty, 4.5, PALETTE.attic.brassGearLight, PALETTE.attic.brassGear, 1.2);
    }
    Painter.circle(ctx, masterGX, masterGY, masterR, PALETTE.attic.brassGearLight, PALETTE.attic.brassGear, 2.5);
    Painter.circle(ctx, masterGX, masterGY, masterR * 0.75, '#1c1917', PALETTE.attic.brassGear, 1.8);
    for (let s = 0; s < 5; s++) {
      const sang = ((Math.PI * 2) / 5) * s;
      Painter.line(
        ctx,
        masterGX,
        masterGY,
        masterGX + Math.cos(sang) * masterR,
        masterGY + Math.sin(sang) * masterR,
        PALETTE.attic.brassGearLight,
        4.5
      );
    }
    Painter.circle(ctx, masterGX, masterGY, 16, PALETTE.attic.brassGear);
    Painter.circle(ctx, masterGX, masterGY, 5, '#0f172a');
    ctx.restore();

    // Difference 10: Steel Pinion Gear Spoke Configuration
    const pinionDiff = hasDiff('diff_steel_pinion_gear');
    const pinSpoke = pinionDiff ? 'four_cross' : 'six_spoke';
    drawGear(205, 255, 30, 14, PALETTE.attic.steelGear, PALETTE.attic.steelGearHighlight, pinSpoke);

    // -------------------------------------------------------------
    // 4. GRANDFATHER CLOCK (Left Hand Chamber)
    // -------------------------------------------------------------
    const clkX = 105;
    const clkY = 150;
    const clkW = 70;
    const clkH = 340;

    // Carved Mahogany Case
    Painter.roundedRect(ctx, clkX - clkW / 2, clkY, clkW, clkH, 6, PALETTE.attic.clockWood, '#1c0a01', 2.5);
    // Pediment top hood
    Painter.polygon(ctx, [
      [clkX - clkW / 2 - 6, clkY],
      [clkX + clkW / 2 + 6, clkY],
      [clkX, clkY - 24]
    ], '#451a03', '#1c0a01', 2);
    Painter.circle(ctx, clkX, clkY - 24, 5, PALETTE.attic.clockGoldRim); // Brass finial

    // Clock Face Dial (Dial housing)
    Painter.circle(ctx, clkX, clkY + 65, 28, PALETTE.attic.clockFace, PALETTE.attic.clockGoldRim, 2.5);
    // Roman Numeral hour marks
    for (let h = 0; h < 12; h++) {
      const hang = (Math.PI / 6) * h - Math.PI / 2;
      const hx1 = clkX + Math.cos(hang) * 22;
      const hy1 = clkY + 65 + Math.sin(hang) * 22;
      const hx2 = clkX + Math.cos(hang) * 25;
      const hy2 = clkY + 65 + Math.sin(hang) * 25;
      Painter.line(ctx, hx1, hy1, hx2, hy2, '#0f172a', 1.8);
    }

    // Difference 1: Clock Face Minute Hand Position (12:00 vs 11:55)
    const timeDiff = hasDiff('diff_clock_hand_time');
    const handAngle = timeDiff ? -Math.PI / 2 - 0.45 : -Math.PI / 2; // Angled vs Straight up
    Painter.line(
      ctx,
      clkX,
      clkY + 65,
      clkX + Math.cos(handAngle) * 19,
      clkY + 65 + Math.sin(handAngle) * 19,
      PALETTE.attic.clockHands,
      2.5
    ); // Minute hand
    Painter.line(ctx, clkX, clkY + 65, clkX + 11, clkY + 65, PALETTE.attic.clockHands, 3.2); // Hour hand (at 3)
    Painter.circle(ctx, clkX, clkY + 65, 3, PALETTE.attic.clockGoldRim);

    // Lower Trunk Glass Window (showing Pendulum)
    Painter.roundedRect(ctx, clkX - 18, clkY + 110, 36, 180, 4, '#0f172a', '#291104', 1.8);
    // Pendulum Brass Rod
    Painter.line(ctx, clkX, clkY + 110, clkX, clkY + 210, PALETTE.attic.pendulumRod, 2.5);

    // Difference 6: Pendulum Bob Metal (Polished Gold vs Silver Steel)
    const bobDiff = hasDiff('diff_pendulum_bob');
    const bobColor = bobDiff ? '#94a3b8' : PALETTE.attic.pendulumBob;
    const bobRim = bobDiff ? '#cbd5e0' : PALETTE.attic.clockGoldRim;
    Painter.circle(ctx, clkX, clkY + 210, 13, bobColor, bobRim, 2);
    Painter.circle(ctx, clkX, clkY + 210, 5, bobRim);

    // -------------------------------------------------------------
    // 5. HOROLOGIST’S WORKBENCH & BRASS TELESCOPE (Right side)
    // -------------------------------------------------------------
    const benchY = 430;
    Painter.roundedRect(ctx, 190, benchY, W - 200, 130, 4, '#3b1d11', '#170b06', 2);
    Painter.roundedRect(ctx, 180, benchY - 14, W - 180, 16, 3, '#5c2406', '#291104', 1.8);

    // Difference 4: Antique Brass Telescope on Tripod
    const scopeDiff = hasDiff('diff_telescope_brass_band');
    const scopeX = 395;
    const scopeY = 270;
    // Cast iron tripod legs
    Painter.line(ctx, scopeX, scopeY + 40, scopeX - 26, scopeY + 145, '#334155', 2.8);
    Painter.line(ctx, scopeX, scopeY + 40, scopeX + 6, scopeY + 145, '#334155', 2.8);
    Painter.line(ctx, scopeX, scopeY + 40, scopeX + 34, scopeY + 145, '#334155', 2.8);
    Painter.circle(ctx, scopeX, scopeY + 40, 5, '#b45309'); // Mount swivel

    // Angled Telescope Optical Barrel pointing toward skylight
    const ang = -0.58; // pointing up-left
    const len = 95;
    const bx1 = scopeX - Math.cos(ang) * 40;
    const by1 = scopeY - Math.sin(ang) * 40;
    const bx2 = scopeX + Math.cos(ang) * 55;
    const by2 = scopeY + Math.sin(ang) * 55;
    Painter.line(ctx, bx1, by1, bx2, by2, PALETTE.attic.telescopeBrass, 11);
    Painter.line(ctx, bx1 - 6, by1 - 3, bx1, by1, '#fde047', 7); // Eyepiece
    Painter.circle(ctx, bx2, by2, 8, '#f59e0b', '#78350f', 1.5); // Objective bell

    if (!scopeDiff) {
      // Engraved silver collar band around mid-barrel
      Painter.circle(ctx, scopeX, scopeY, 7, null, '#cbd5e0', 2.5);
    }

    // Difference 5: Celestial Armillary Sphere / Astrolabe
    const astroDiff = hasDiff('diff_astrolabe_pointer');
    const astX = 495;
    const astY = 310;
    // Brass pedestal base
    Painter.roundedRect(ctx, astX - 14, astY + 44, 28, 8, 2, '#b45309', '#451a03', 1.5);
    Painter.line(ctx, astX, astY + 44, astX, astY + 22, '#d97706', 4);
    // Concentric brass celestial rings
    Painter.circle(ctx, astX, astY, 22, null, '#d97706', 2.5);
    Painter.ellipse(ctx, astX, astY, 21, 10, 0.4, null, '#f59e0b', 2);
    Painter.circle(ctx, astX, astY, 6, '#fde047'); // Center Sun sphere

    // Pointer needle direction
    const ptrAngle = astroDiff ? -Math.PI * 0.75 : -Math.PI * 0.25;
    Painter.line(
      ctx,
      astX,
      astY,
      astX + Math.cos(ptrAngle) * 26,
      astY + Math.sin(ptrAngle) * 26,
      '#ef4444',
      2
    );

    // Difference 3: Two-tier Brass Hourglass
    const hgDiff = hasDiff('diff_hourglass_sand');
    const hgX = 485;
    const hgY = 440;
    // Wooden top and bottom plates
    Painter.roundedRect(ctx, hgX - 14, hgY - 26, 28, 5, 1, '#78350f', '#451a03', 1.2);
    Painter.roundedRect(ctx, hgX - 14, hgY + 21, 28, 5, 1, '#78350f', '#451a03', 1.2);
    // Brass support pillars
    Painter.line(ctx, hgX - 11, hgY - 24, hgX - 11, hgY + 22, '#d97706', 1.8);
    Painter.line(ctx, hgX + 11, hgY - 24, hgX + 11, hgY + 22, '#d97706', 1.8);

    // Glass globes
    Painter.circle(ctx, hgX, hgY - 11, 10, 'rgba(224, 242, 254, 0.4)', '#94a3b8', 1);
    Painter.circle(ctx, hgX, hgY + 11, 10, 'rgba(224, 242, 254, 0.4)', '#94a3b8', 1);

    if (!hgDiff) {
      // Golden sand streaming down
      Painter.ellipse(ctx, hgX, hgY - 10, 7, 5, 0, PALETTE.attic.hourglassSand); // Upper sand
      Painter.line(ctx, hgX, hgY - 5, hgX, hgY + 12, '#fde047', 1.5); // Flowing trickle
      Painter.ellipse(ctx, hgX, hgY + 15, 8, 4, 0, PALETTE.attic.hourglassSand); // Bottom pile
    } else {
      // Upper chamber empty, all sand settled at bottom
      Painter.ellipse(ctx, hgX, hgY + 14, 9, 6, 0, PALETTE.attic.hourglassSand);
    }

    // Difference 8: Horological Technical Blueprint
    const bpDiff = hasDiff('diff_blueprint_gear_sketch');
    const bpX = 230;
    const bpY = 490;
    // Yellowed parchment sheet
    Painter.roundedRect(ctx, bpX - 28, bpY - 18, 56, 36, 2, PALETTE.attic.parchment, '#d97706', 1.2);
    if (!bpDiff) {
      // Intermeshing gear teeth ink schematic
      Painter.circle(ctx, bpX - 8, bpY, 9, null, '#1e293b', 1.5);
      Painter.circle(ctx, bpX + 10, bpY + 2, 7, null, '#1e293b', 1.5);
      Painter.line(ctx, bpX - 18, bpY - 10, bpX + 18, bpY - 10, '#0284c7', 1); // Blue dimension line
    } else {
      // Spiral clock hairspring schematic
      for (let sp = 2; sp <= 10; sp += 2.5) {
        Painter.circle(ctx, bpX, bpY, sp, null, '#1e293b', 1.2);
      }
    }

    // Difference 9: Open Pocket Watch with Gold Curb Chain
    const watchDiff = hasDiff('diff_pocket_watch_chain');
    const watX = 335;
    const watY = 465;
    // Circular gold watch case
    Painter.circle(ctx, watX, watY, 14, '#fef08a', '#d97706', 1.8);
    // Exposed ticking movement balance wheel
    Painter.circle(ctx, watX, watY, 9, '#d97706', '#b45309', 1.2);
    Painter.circle(ctx, watX, watY, 4, '#ef4444'); // Ruby pivot jewel
    Painter.line(ctx, watX, watY - 14, watX, watY - 18, '#d97706', 2.5); // Stem crown

    if (!watchDiff) {
      // Gold curb chain draped onto workbench
      for (let ci = 0; ci < 5; ci++) {
        Painter.ellipse(ctx, watX + 8 + ci * 6, watY + 6 + ci * 2, 3.5, 2, 0.3, null, '#f59e0b', 1.6);
      }
    } else {
      // Dashed ghost chain links
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      for (let ci = 0; ci < 5; ci++) {
        Painter.ellipse(ctx, watX + 8 + ci * 6, watY + 6 + ci * 2, 3.5, 2, 0.3, null, '#f59e0b', 1.2);
      }
      ctx.restore();
    }

    // Difference 11: Watchmaker Jeweler Loupe
    const hideLoupe = hasDiff('diff_horologist_loupe');
    const lpX = 420;
    const lpY = 485;
    if (!hideLoupe) {
      Painter.roundedRect(ctx, lpX - 6, lpY - 6, 12, 12, 3, '#1c1917', '#d97706', 1.8);
      Painter.circle(ctx, lpX, lpY, 4, '#38bdf8'); // Loupe lens
    } else {
      // Dashed ghost loupe
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.setLineDash([2, 2]);
      Painter.roundedRect(ctx, lpX - 6, lpY - 6, 12, 12, 3, null, '#d97706', 1.4);
      Painter.circle(ctx, lpX, lpY, 4, null, '#38bdf8', 1.2);
      ctx.restore();
    }

    ctx.restore();
  }
}
