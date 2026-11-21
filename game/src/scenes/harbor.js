// game/src/scenes/harbor.js
// Level 1: Lighthouse Harbor (Twilight Port) — rich procedural harbor scene.

import { HARBOR_PALETTE } from '../palette.js';
import { Painter } from '../painter.js';

export function buildHarborScene(rng) {
  const p = HARBOR_PALETTE;

  // Scene objects rendered in layer order (lower z rendered first)
  const objects = [
    // --- LAYER 0: Sky and Atmospheric Glow ---
    {
      id: 'sky',
      layer: 0,
      render(ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 330);
        grad.addColorStop(0, p.skyTop);
        grad.addColorStop(0.28, p.skyUpper);
        grad.addColorStop(0.55, p.skyMid);
        grad.addColorStop(0.78, p.skyLower);
        grad.addColorStop(1.0, p.skyHorizon);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 586, 330);
      },
    },
    {
      id: 'sun_disc',
      layer: 1,
      render(ctx) {
        // Twilight sun setting near horizon
        const glow = ctx.createRadialGradient(380, 240, 10, 380, 240, 140);
        glow.addColorStop(0, 'rgba(254, 208, 137, 0.95)');
        glow.addColorStop(0.3, 'rgba(247, 151, 91, 0.5)');
        glow.addColorStop(0.7, 'rgba(196, 88, 83, 0.2)');
        glow.addColorStop(1, 'rgba(196, 88, 83, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(380, 240, 140, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(380, 240, 28, 0, Math.PI * 2);
        ctx.fill();
      },
    },

    // --- LAYER 2: Distant Clouds ---
    {
      id: 'cloud_1',
      layer: 2,
      render(ctx) {
        Painter.cloud(ctx, 90, 60, 1.1, p.cloudBase, p.cloudHighlight);
      },
    },
    {
      id: 'cloud_2',
      layer: 2,
      render(ctx) {
        Painter.cloud(ctx, 290, 95, 0.9, p.cloudBase, p.cloudHighlight);
      },
    },
    {
      id: 'cloud_3',
      layer: 2,
      render(ctx) {
        Painter.cloud(ctx, 480, 70, 1.25, p.cloudBase, p.cloudHighlight);
      },
    },
    {
      id: 'cloud_4',
      layer: 2,
      render(ctx) {
        Painter.cloud(ctx, 180, 150, 0.8, '#583c61', '#f08d81');
      },
    },
    {
      id: 'cloud_5',
      layer: 2,
      render(ctx) {
        Painter.cloud(ctx, 420, 175, 0.95, '#583c61', '#f08d81');
      },
    },

    // --- LAYER 3: Distant Soaring Seagulls ---
    {
      id: 'sky_seagull_1',
      layer: 3,
      render(ctx) {
        Painter.seagull(ctx, 160, 110, 0.75, 0.3, '#fed7aa');
      },
    },
    {
      id: 'sky_seagull_2',
      layer: 3,
      render(ctx) {
        Painter.seagull(ctx, 220, 95, 0.9, 0.8, '#fed7aa');
      },
    },
    {
      id: 'sky_seagull_3',
      layer: 3,
      render(ctx) {
        Painter.seagull(ctx, 255, 125, 0.65, 0.1, '#fed7aa');
      },
    },

    // --- LAYER 4: Distant Hills & Horizon ---
    {
      id: 'distant_hills',
      layer: 4,
      render(ctx) {
        // Far headland
        ctx.fillStyle = p.headlandFar;
        ctx.beginPath();
        ctx.moveTo(0, 310);
        ctx.quadraticCurveTo(80, 275, 170, 290);
        ctx.quadraticCurveTo(240, 305, 300, 312);
        ctx.lineTo(300, 330);
        ctx.lineTo(0, 330);
        ctx.closePath();
        ctx.fill();

        // Right far headland
        ctx.beginPath();
        ctx.moveTo(420, 315);
        ctx.quadraticCurveTo(490, 280, 586, 295);
        ctx.lineTo(586, 330);
        ctx.lineTo(420, 330);
        ctx.closePath();
        ctx.fill();
      },
    },

    // --- LAYER 5: Distant Sailboat Silhouette ---
    {
      id: 'distant_schooner',
      layer: 5,
      render(ctx) {
        ctx.save();
        ctx.translate(285, 295);
        ctx.fillStyle = '#261f3d';
        // Hull
        ctx.beginPath();
        ctx.moveTo(-16, 6);
        ctx.lineTo(16, 6);
        ctx.lineTo(12, 10);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();
        // Masts & sails
        ctx.fillRect(-2, -14, 1.5, 20);
        ctx.beginPath();
        ctx.moveTo(0, -13);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-2, -10);
        ctx.lineTo(-12, 1);
        ctx.lineTo(-2, 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
    },

    // --- LAYER 6: Water & Waves ---
    {
      id: 'sea_water',
      layer: 6,
      render(ctx) {
        const waterGrad = ctx.createLinearGradient(0, 310, 0, 624);
        waterGrad.addColorStop(0, p.waterHorizon);
        waterGrad.addColorStop(0.18, p.waterMid);
        waterGrad.addColorStop(0.65, p.waterDeep);
        waterGrad.addColorStop(1.0, '#0c1322');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 310, 586, 314);

        // Sunset reflection sheen down the center
        const sheen = ctx.createLinearGradient(320, 310, 440, 310);
        sheen.addColorStop(0, 'rgba(247, 151, 91, 0)');
        sheen.addColorStop(0.5, 'rgba(247, 151, 91, 0.28)');
        sheen.addColorStop(1, 'rgba(247, 151, 91, 0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(320, 310, 120, 314);

        // Wave crest shimmers
        Painter.waveLine(ctx, 30, 335, 120, 3, 24, p.waterHighlight, 1.5);
        Painter.waveLine(ctx, 190, 325, 160, 3, 26, p.waterHighlight, 1.5);
        Painter.waveLine(ctx, 400, 340, 150, 3, 24, p.waterHighlight, 1.5);
        Painter.waveLine(ctx, 80, 365, 180, 4, 30, '#38bdf8', 1.2);
        Painter.waveLine(ctx, 310, 375, 200, 4, 30, p.waterHighlight, 1.6);
        Painter.waveLine(ctx, 50, 410, 140, 4, 32, '#0ea5e9', 1.2);
        Painter.waveLine(ctx, 240, 435, 180, 5, 34, '#38bdf8', 1.4);
      },
    },

    // --- LAYER 7: Left Rocky Breakwater & Lighthouse Island ---
    {
      id: 'rocky_island',
      layer: 7,
      render(ctx) {
        // Dark rugged granite outcrop
        ctx.fillStyle = '#1e2430';
        ctx.strokeStyle = '#0f131a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, 440);
        ctx.lineTo(30, 370);
        ctx.lineTo(85, 355);
        ctx.lineTo(155, 385);
        ctx.lineTo(175, 430);
        ctx.lineTo(140, 490);
        ctx.lineTo(40, 500);
        ctx.lineTo(-10, 480);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rock facet highlights
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.moveTo(30, 370);
        ctx.lineTo(85, 355);
        ctx.lineTo(75, 395);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(85, 355);
        ctx.lineTo(135, 375);
        ctx.lineTo(110, 410);
        ctx.closePath();
        ctx.fill();
      },
    },

    // --- LAYER 8: Lighthouse Structure ---
    {
      id: 'lighthouse_tower',
      layer: 8,
      render(ctx) {
        ctx.save();
        ctx.translate(95, 360);

        // Lighthouse Beam light casting onto twilight
        const beam = ctx.createRadialGradient(0, -165, 10, 140, -140, 280);
        beam.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
        beam.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
        beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, -165);
        ctx.lineTo(380, -220);
        ctx.lineTo(390, -70);
        ctx.closePath();
        ctx.fill();

        // Stone Base
        ctx.fillStyle = p.lighthouseStoneShadow;
        ctx.fillRect(-32, -15, 64, 25);
        ctx.strokeStyle = '#2b2319';
        ctx.lineWidth = 2;
        ctx.strokeRect(-32, -15, 64, 25);

        // Tapered Tower body (trapezoid)
        // 4 striped bands: White, Red, White, Red
        const bands = [
          { y: -50, h: 35, color: p.lighthouseStoneLight, wBottom: 58, wTop: 52 },
          { y: -85, h: 35, color: p.lighthouseRed, wBottom: 52, wTop: 46 },
          { y: -120, h: 35, color: p.lighthouseStoneLight, wBottom: 46, wTop: 40 },
          { y: -155, h: 35, color: p.lighthouseRed, wBottom: 40, wTop: 34 },
        ];

        for (const band of bands) {
          ctx.fillStyle = band.color;
          ctx.beginPath();
          ctx.moveTo(-band.wBottom / 2, band.y + band.h);
          ctx.lineTo(-band.wTop / 2, band.y);
          ctx.lineTo(band.wTop / 2, band.y);
          ctx.lineTo(band.wBottom / 2, band.y + band.h);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Shading on right side of tower
          ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
          ctx.beginPath();
          ctx.moveTo(band.wTop * 0.15, band.y);
          ctx.lineTo(band.wTop / 2, band.y);
          ctx.lineTo(band.wBottom / 2, band.y + band.h);
          ctx.lineTo(band.wBottom * 0.15, band.y + band.h);
          ctx.closePath();
          ctx.fill();
        }

        // Tower Windows
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-4, -75, 8, 12);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1;
        ctx.strokeRect(-4, -75, 8, 12);

        ctx.fillRect(-4, -135, 8, 12);
        ctx.strokeRect(-4, -135, 8, 12);

        // Balcony walkway & iron railings
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-24, -160, 48, 6);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-24, -160, 48, 6);

        // Balcony railing bars
        ctx.beginPath();
        ctx.moveTo(-22, -160);
        ctx.lineTo(-22, -170);
        ctx.lineTo(22, -170);
        ctx.lineTo(22, -160);
        for (let bx = -18; bx <= 18; bx += 6) {
          ctx.moveTo(bx, -160);
          ctx.lineTo(bx, -170);
        }
        ctx.stroke();

        // Lantern Glass Room
        ctx.fillStyle = p.lighthouseLanternGlow;
        ctx.fillRect(-16, -188, 32, 18);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-16, -188, 32, 18);
        // Glass panes
        ctx.beginPath();
        ctx.moveTo(-6, -188);
        ctx.lineTo(-6, -170);
        ctx.moveTo(6, -188);
        ctx.lineTo(6, -170);
        ctx.stroke();

        // Conical copper/slate dome roof
        ctx.fillStyle = p.lighthouseRoof;
        ctx.beginPath();
        ctx.moveTo(-18, -188);
        ctx.lineTo(0, -210);
        ctx.lineTo(18, -188);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Top finial ball
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, -212, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // --- LAYER 9: Harbor Master Cottage ---
    {
      id: 'cottage',
      layer: 9,
      render(ctx) {
        ctx.save();
        ctx.translate(430, 410);

        // Stone Chimney behind roof
        ctx.fillStyle = p.cottageChimney;
        ctx.fillRect(45, -95, 18, 50);
        ctx.strokeStyle = '#3b1c09';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(45, -95, 18, 50);
        ctx.fillStyle = '#291206';
        ctx.fillRect(42, -99, 24, 6);

        // Smoke puffs from chimney
        ctx.fillStyle = p.smokePuff;
        ctx.beginPath();
        ctx.arc(54, -112, 9, 0, Math.PI * 2);
        ctx.arc(62, -128, 13, 0, Math.PI * 2);
        ctx.arc(56, -148, 17, 0, Math.PI * 2);
        ctx.arc(68, -172, 22, 0, Math.PI * 2);
        ctx.fill();

        // Main House walls
        ctx.fillStyle = p.cottageWall;
        ctx.fillRect(-70, -45, 140, 75);
        ctx.strokeStyle = '#33271d';
        ctx.lineWidth = 2;
        ctx.strokeRect(-70, -45, 140, 75);

        // Wood clapboard horizontal lap lines
        ctx.strokeStyle = p.cottageWallShadow;
        ctx.lineWidth = 1;
        for (let cy = -35; cy < 30; cy += 10) {
          ctx.beginPath();
          ctx.moveTo(-69, cy);
          ctx.lineTo(69, cy);
          ctx.stroke();
        }

        // Steep Gable Slate Roof
        ctx.fillStyle = p.cottageRoof;
        ctx.beginPath();
        ctx.moveTo(-82, -45);
        ctx.lineTo(0, -95);
        ctx.lineTo(82, -45);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Roof overhang trim
        ctx.fillStyle = '#334155';
        ctx.fillRect(-82, -45, 164, 5);

        // Wooden Door
        ctx.fillStyle = p.cottageDoor;
        ctx.fillRect(-45, -5, 26, 35);
        ctx.strokeStyle = '#2d1107';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-45, -5, 26, 35);
        // Brass handle
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-24, 12, 2, 0, Math.PI * 2);
        ctx.fill();

        // Cottage Window
        ctx.fillStyle = p.cottageWindowLit;
        ctx.fillRect(10, -25, 34, 30);
        ctx.strokeStyle = '#3f2e1e';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, -25, 34, 30);
        // Window mullions / cross
        ctx.beginPath();
        ctx.moveTo(27, -25);
        ctx.lineTo(27, 5);
        ctx.moveTo(10, -10);
        ctx.lineTo(44, -10);
        ctx.stroke();

        ctx.restore();
      },
    },

    // --- LAYER 10: Pier & Wooden Boardwalk ---
    {
      id: 'pier_dock',
      layer: 10,
      render(ctx) {
        ctx.save();
        ctx.translate(0, 435);

        // Dark pilings standing in sea
        ctx.fillStyle = '#3e2717';
        ctx.strokeStyle = '#1d120a';
        ctx.lineWidth = 2;
        const pilings = [210, 270, 340, 410, 480, 540];
        for (const px of pilings) {
          ctx.fillRect(px, 15, 18, 145);
          ctx.strokeRect(px, 15, 18, 145);
          // Green moss / barnacle waterline
          ctx.fillStyle = '#14532d';
          ctx.fillRect(px, 110, 18, 30);
          ctx.fillStyle = '#3e2717';
        }

        // Heavy main horizontal support beam
        ctx.fillStyle = p.pierWoodShadow;
        ctx.fillRect(180, 15, 406, 20);
        ctx.strokeStyle = '#22150c';
        ctx.lineWidth = 2;
        ctx.strokeRect(180, 15, 406, 20);

        // Deck planks (perspective trapezoids / bands)
        ctx.fillStyle = p.pierWood;
        ctx.beginPath();
        ctx.moveTo(180, 15);
        ctx.lineTo(586, 15);
        ctx.lineTo(586, 75);
        ctx.lineTo(190, 75);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Plank gaps
        ctx.strokeStyle = '#27190f';
        ctx.lineWidth = 1.5;
        for (let plx = 205; plx < 586; plx += 24) {
          ctx.beginPath();
          ctx.moveTo(plx, 15);
          ctx.lineTo(plx + 8, 75);
          ctx.stroke();
        }

        // Iron mooring bollards on dock edge
        ctx.fillStyle = p.pierIronBollard;
        ctx.fillRect(230, 5, 12, 16);
        ctx.fillRect(226, 2, 20, 5);

        ctx.fillRect(380, 5, 12, 16);
        ctx.fillRect(376, 2, 20, 5);

        ctx.fillRect(520, 5, 12, 16);
        ctx.fillRect(516, 2, 20, 5);

        ctx.restore();
      },
    },

    // --- LAYER 11: Moored Fishing Boat ---
    {
      id: 'fishing_boat',
      layer: 11,
      render(ctx) {
        ctx.save();
        ctx.translate(160, 485);

        // Boat Hull
        ctx.fillStyle = p.boatHull;
        ctx.strokeStyle = '#091322';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.quadraticCurveTo(50, 75, 140, 75);
        ctx.quadraticCurveTo(200, 75, 230, 20);
        ctx.lineTo(215, 10);
        ctx.lineTo(25, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hull red waterline stripe
        ctx.fillStyle = p.boatTrim;
        ctx.beginPath();
        ctx.moveTo(10, 36);
        ctx.quadraticCurveTo(55, 68, 140, 68);
        ctx.quadraticCurveTo(195, 68, 224, 25);
        ctx.lineTo(222, 33);
        ctx.quadraticCurveTo(195, 75, 140, 75);
        ctx.quadraticCurveTo(50, 75, 0, 30);
        ctx.closePath();
        ctx.fill();

        // Deck cabin
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(125, -15, 65, 30);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(125, -15, 65, 30);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(135, -8, 18, 12);
        ctx.fillRect(162, -8, 18, 12);

        // Mast & Rigging
        ctx.strokeStyle = p.boatMast;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(85, 15);
        ctx.lineTo(85, -115);
        ctx.stroke();

        // Boom
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(85, -20);
        ctx.lineTo(195, -20);
        ctx.stroke();

        // Furled Sail on boom
        ctx.fillStyle = p.boatSail;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(85, -22);
        ctx.quadraticCurveTo(140, -14, 195, -22);
        ctx.lineTo(195, -16);
        ctx.quadraticCurveTo(140, -8, 85, -16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rigging stays (ropes)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(85, -115);
        ctx.lineTo(15, 15);
        ctx.moveTo(85, -115);
        ctx.lineTo(220, 15);
        ctx.stroke();

        ctx.restore();
      },
    },

    // --- LAYER 12: Moored Rowboat & Harbor Props ---
    {
      id: 'props_anchor',
      layer: 12,
      render(ctx) {
        // Iron anchor leaning near cottage
        ctx.save();
        ctx.translate(350, 440);
        ctx.rotate(-0.25);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 36);
        ctx.moveTo(-16, 10);
        ctx.lineTo(16, 10);
        ctx.moveTo(-18, 28);
        ctx.quadraticCurveTo(0, 46, 18, 28);
        ctx.stroke();
        // Top ring
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -4, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'props_rope_coil',
      layer: 12,
      render(ctx) {
        // Coiled hemp rope on pier
        ctx.save();
        ctx.translate(245, 475);
        ctx.strokeStyle = p.hempRope;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'props_stacked_barrels',
      layer: 12,
      render(ctx) {
        // Two background barrels on dock
        Painter.barrel(ctx, 485, 465, 0.85, { woodColor: '#713f12', hoopColor: '#1e293b' });
        Painter.barrel(ctx, 515, 468, 0.8, { woodColor: '#854d0e', hoopColor: '#1e293b' });
      },
    },
  ];

  // --- CANDIDATE DIFFERENCES (Interactive & Mutatable Elements) ---
  // Each candidate difference is a dedicated object with clean bounds, precise coordinates,
  // radius for hit-testing, and an apply mutation handler.
  const candidateDifferences = [
    // 1. Weather Vane on Lighthouse Dome
    {
      id: 'diff_weathervane',
      name: 'Lighthouse Weather Vane',
      x: 95,
      y: 146,
      radius: 26,
      mutationType: 'swap',
      description: 'Golden rooster vane vs directional arrow pointing opposite',
      render(ctx, isMutated) {
        Painter.weatherVane(ctx, 95, 146, 1.0, {
          kind: isMutated ? 'arrow' : 'rooster',
          angle: isMutated ? Math.PI : 0,
        });
      },
    },

    // 2. Hanging Lantern by Cottage Door
    {
      id: 'diff_lantern',
      name: 'Cottage Entrance Lantern',
      x: 372,
      y: 388,
      radius: 22,
      mutationType: 'color',
      description: 'Glowing warm brass lamp vs unlit cold slate lamp',
      render(ctx, isMutated) {
        Painter.lantern(ctx, 372, 388, 1.1, !isMutated, isMutated ? '#475569' : '#f59e0b');
      },
    },

    // 3. Flower Box on Cottage Window
    {
      id: 'diff_flowers',
      name: 'Window Flower Box',
      x: 457,
      y: 418,
      radius: 24,
      mutationType: 'color',
      description: 'Crimson geraniums vs bright sunny daffodils',
      render(ctx, isMutated) {
        Painter.flowerBox(ctx, 457, 418, 1.05, isMutated ? '#eab308' : '#ef4444');
      },
    },

    // 4. Perched Seagull on Dock Bollard
    {
      id: 'diff_seagull',
      name: 'Perched Dock Seagull',
      x: 380,
      y: 432,
      radius: 22,
      mutationType: 'disappear',
      description: 'Seagull resting on the dock post (missing in right panel)',
      render(ctx, isMutated) {
        if (!isMutated) {
          Painter.seagull(ctx, 380, 432, 1.1, 0, '#ffffff');
        }
      },
    },

    // 5. Lifebuoy on Fishing Boat Cabin
    {
      id: 'diff_lifebuoy',
      name: 'Boat Cabin Lifebuoy',
      x: 320,
      y: 495,
      radius: 24,
      mutationType: 'color',
      description: 'Classic orange/white lifebuoy vs nautical blue/white lifebuoy',
      render(ctx, isMutated) {
        Painter.lifebuoy(ctx, 320, 495, 0.95, {
          primaryColor: isMutated ? '#0284c7' : '#ea580c',
          stripeColor: '#ffffff',
          angle: isMutated ? 0.35 : 0,
        });
      },
    },

    // 6. Fish Crate on Dock
    {
      id: 'diff_fish_crate',
      name: 'Dockside Fish Crate',
      x: 430,
      y: 485,
      radius: 25,
      mutationType: 'swap',
      description: 'Crate brimming with shiny fish vs empty crate with sawdust',
      render(ctx, isMutated) {
        Painter.fishCrate(ctx, 430, 485, 0.95, {
          hasFish: !isMutated,
          crateColor: '#a16207',
        });
      },
    },

    // 7. Floating Channel Buoy in Harbor Water
    {
      id: 'diff_buoy',
      name: 'Floating Channel Buoy',
      x: 235,
      y: 395,
      radius: 24,
      mutationType: 'color',
      description: 'Green starboard channel marker vs red port channel marker',
      render(ctx, isMutated) {
        Painter.buoy(ctx, 235, 395, 0.9, {
          color: isMutated ? '#dc2626' : '#059669',
          beaconLit: true,
        });
      },
    },

    // 8. Coral Starfish on Rock Outcrop
    {
      id: 'diff_starfish',
      name: 'Rock Starfish',
      x: 125,
      y: 440,
      radius: 20,
      mutationType: 'color',
      description: 'Vivid coral-pink starfish vs turquoise-blue sea star',
      render(ctx, isMutated) {
        Painter.starfish(ctx, 125, 440, 0.9, isMutated ? '#06b6d4' : '#f43f5e');
      },
    },

    // 9. Pier Barrel Marking
    {
      id: 'diff_barrel_emblem',
      name: 'Pier Barrel Stencil',
      x: 285,
      y: 472,
      radius: 22,
      mutationType: 'swap',
      description: 'Dock barrel with pirate skull stencil vs star insignia',
      render(ctx, isMutated) {
        Painter.barrel(ctx, 285, 472, 0.95, {
          woodColor: '#854d0e',
          hoopColor: '#334155',
          emblem: isMutated ? 'star' : 'skull',
        });
      },
    },

    // 10. Cat on Dock Barrel
    {
      id: 'diff_cat',
      name: 'Ginger Dock Cat',
      x: 485,
      y: 432,
      radius: 22,
      mutationType: 'disappear',
      description: 'Curled up sleeping ginger cat (missing in right panel)',
      render(ctx, isMutated) {
        if (!isMutated) {
          Painter.cat(ctx, 485, 432, 1.0, '#f97316');
        }
      },
    },
  ];

  return {
    id: 'harbor',
    name: 'Lighthouse Harbor',
    objects,
    candidateDifferences,
  };
}
