// game/src/scenes/attic.js
// Stage 4: Clockwork Attic (Gear & Pendulum Loft) — inventor's horology workshop loft.
// High difficulty, subtle mechanical mutations (10 differences, 120s).

import { Painter } from '../painter.js';

export function buildAtticScene(rng) {
  const objects = [
    // --- LAYER 0: Sloping Timber Rafters & Skylight Night Sky ---
    {
      id: 'attic_sky_and_rafters',
      layer: 0,
      render(ctx) {
        // Deep midnight loft backdrop
        const loftGrad = ctx.createLinearGradient(0, 0, 0, 320);
        loftGrad.addColorStop(0, '#0c0a09');
        loftGrad.addColorStop(0.6, '#1c1917');
        loftGrad.addColorStop(1, '#292524');
        ctx.fillStyle = loftGrad;
        ctx.fillRect(0, 0, 586, 320);

        // Sloping Victorian skylight window
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(160, 20);
        ctx.lineTo(420, 20);
        ctx.lineTo(480, 150);
        ctx.lineTo(100, 150);
        ctx.closePath();
        ctx.fill();

        // Skylight glass panes & stars
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(240, 50, 1.5, 1.5);
        ctx.fillRect(320, 75, 1.5, 1.5);
        ctx.fillRect(380, 40, 2, 2);

        // Window iron muntin bars
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(290, 20);
        ctx.lineTo(290, 150);
        ctx.moveTo(130, 85);
        ctx.lineTo(450, 85);
        ctx.stroke();

        // Heavy dark oak roof truss beams
        ctx.fillStyle = '#27170a';
        ctx.strokeStyle = '#140c05';
        ctx.lineWidth = 3;
        // Left diagonal truss
        ctx.beginPath();
        ctx.moveTo(0, 160);
        ctx.lineTo(293, 10);
        ctx.lineTo(293, 35);
        ctx.lineTo(0, 195);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right diagonal truss
        ctx.beginPath();
        ctx.moveTo(586, 160);
        ctx.lineTo(293, 10);
        ctx.lineTo(293, 35);
        ctx.lineTo(586, 195);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Horizontal tie beam
        ctx.fillRect(0, 150, 586, 25);
        ctx.strokeRect(0, 150, 586, 25);

        ctx.restore();
      },
    },

    // --- LAYER 1: Hanging Pulleys & Counterweights ---
    {
      id: 'attic_pulleys',
      layer: 1,
      render(ctx) {
        ctx.save();
        // Iron chains and pulleys hanging from tie beam
        ctx.strokeStyle = '#57534e';
        ctx.lineWidth = 1.5;

        // Pulley 1 (left)
        ctx.beginPath();
        ctx.moveTo(110, 175);
        ctx.lineTo(110, 240);
        ctx.stroke();
        Painter.gear(ctx, 110, 240, 14, 8, 3, { color: '#78716c', strokeColor: '#292524', spokes: 3 });

        // Pulley 2 (right)
        ctx.beginPath();
        ctx.moveTo(480, 175);
        ctx.lineTo(480, 230);
        ctx.stroke();
        Painter.gear(ctx, 480, 230, 16, 10, 4, { color: '#78716c', strokeColor: '#292524', spokes: 4 });

        // Hanging brass counterweight cylinder
        ctx.fillStyle = '#d97706';
        ctx.fillRect(474, 245, 12, 35);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(474, 245, 12, 35);

        ctx.restore();
      },
    },

    // --- LAYER 2: Wooden Floorboards & Loft Sawdust ---
    {
      id: 'attic_floor',
      layer: 2,
      render(ctx) {
        ctx.save();
        const floorGrad = ctx.createLinearGradient(0, 470, 0, 624);
        floorGrad.addColorStop(0, '#44230d');
        floorGrad.addColorStop(1, '#1b0e05');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, 470, 586, 154);

        // Wide plank joints
        ctx.strokeStyle = '#180d05';
        ctx.lineWidth = 2;
        for (let y = 485; y < 624; y += 26) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(586, y);
          ctx.stroke();

          // Iron floor nail heads
          ctx.fillStyle = '#0f172a';
          for (let nx = 35; nx < 586; nx += 75) {
            ctx.fillRect(nx, y - 2, 2, 2);
          }
        }
        ctx.restore();
      },
    },

    // --- LAYER 2.5: Dense Loft Floor Props & Artifacts ---
    {
      id: 'attic_floor_props',
      layer: 2.5,
      render(ctx) {
        ctx.save();

        // 1. Ornate Persian Rug Runner under Pendulum Bob (Center)
        ctx.save();
        ctx.translate(225, 570);
        ctx.fillStyle = '#7f1d1d'; // Crimson rug
        ctx.fillRect(0, 0, 135, 48);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 135, 48);

        // Inner decorative border
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(4, 4, 127, 40);

        // Diamond medallions
        ctx.fillStyle = '#f59e0b';
        for (let mx = 20; mx <= 115; mx += 28) {
          ctx.beginPath();
          ctx.moveTo(mx, 14);
          ctx.lineTo(mx + 8, 24);
          ctx.lineTo(mx, 34);
          ctx.lineTo(mx - 8, 24);
          ctx.closePath();
          ctx.fill();
        }

        // Fringes on ends
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.2;
        for (let fy = 2; fy <= 46; fy += 4) {
          ctx.beginPath();
          ctx.moveTo(0, fy);
          ctx.lineTo(-6, fy);
          ctx.moveTo(135, fy);
          ctx.lineTo(141, fy);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Brass-Bound Inventor's Trunk / Sea Chest (Far Left)
        ctx.save();
        ctx.translate(35, 540);
        // Chest body
        ctx.fillStyle = '#451a03';
        ctx.fillRect(0, 15, 95, 55);
        ctx.strokeStyle = '#270e02';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 15, 95, 55);

        // Curved chest lid
        ctx.fillStyle = '#5c2406';
        ctx.beginPath();
        ctx.arc(47.5, 15, 47.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Brass reinforcement straps and corner brackets
        ctx.fillStyle = '#d97706';
        ctx.fillRect(15, -4, 8, 74);
        ctx.fillRect(72, -4, 8, 74);
        ctx.strokeRect(15, -4, 8, 74);
        ctx.strokeRect(72, -4, 8, 74);

        // Center brass keyhole hasp plate
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(41, 10, 13, 16);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.strokeRect(41, 10, 13, 16);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(47.5, 16, 2, 0, Math.PI * 2);
        ctx.rect(46.5, 16, 2, 5);
        ctx.fill();

        // Glowing brass oil lamp resting on chest
        Painter.lantern(ctx, 47.5, -18, 0.9, true, '#f59e0b');
        ctx.restore();

        // 3. Stack of Leather Horology Books & Parchment (Left-Center)
        ctx.save();
        ctx.translate(145, 565);
        // Book 1 (bottom crimson)
        ctx.fillStyle = '#881337';
        ctx.fillRect(0, 32, 65, 14);
        ctx.strokeStyle = '#4c0519';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 32, 65, 14);
        // Book 2 (middle dark blue)
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(4, 18, 58, 14);
        ctx.strokeRect(4, 18, 58, 14);
        // Book 3 (top forest green)
        ctx.fillStyle = '#14532d';
        ctx.fillRect(8, 6, 52, 12);
        ctx.strokeRect(8, 6, 52, 12);

        // Gold foil spine ribs
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(12, 8, 2, 8);
        ctx.fillRect(20, 8, 2, 8);
        ctx.fillRect(8, 20, 2, 10);
        ctx.fillRect(18, 20, 2, 10);

        // Rolled parchment scroll leaning on books
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(65, 24, 7, 18, 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.stroke();
        ctx.restore();

        // 4. Machinist's Steel Cantilever Toolbox (Center-Right)
        ctx.save();
        ctx.translate(375, 555);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 15, 75, 45);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 15, 75, 45);

        // Open lid tray angled up
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(-12, -4);
        ctx.lineTo(63, -4);
        ctx.lineTo(75, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Oil can with long curved spout in tray
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(20, 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(34, -14);
        ctx.stroke();

        // Scattered brass gear wheels on floor
        Painter.gear(ctx, -14, 50, 10, 8, 2, { color: '#f59e0b', strokeColor: '#78350f', spokes: 3 });
        Painter.gear(ctx, 88, 52, 12, 10, 3, { color: '#d97706', strokeColor: '#78350f', spokes: 4 });
        ctx.restore();

        // 5. Wooden Crate with Mantel Clock (Far Right)
        ctx.save();
        ctx.translate(475, 535);
        // Wood crate
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 20, 85, 52);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 20, 85, 52);

        // Slats
        ctx.fillStyle = '#3b1c09';
        ctx.fillRect(4, 34, 77, 3);
        ctx.fillRect(4, 52, 77, 3);

        // Vintage mantel clock sitting on crate
        ctx.fillStyle = '#5c2406';
        ctx.beginPath();
        ctx.moveTo(18, 20);
        ctx.lineTo(25, -12);
        ctx.lineTo(60, -12);
        ctx.lineTo(67, 20);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#270e02';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // White clock dial
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(42.5, 3, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Hands
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(42.5, 3);
        ctx.lineTo(42.5, -4);
        ctx.moveTo(42.5, 3);
        ctx.lineTo(48, 3);
        ctx.stroke();

        // Brass top finial
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(42.5, -14, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.restore();
      },
    },

    // --- LAYER 3: Workshop Workbench & Wall Shelves ---
    {
      id: 'attic_bench',
      layer: 3,
      render(ctx) {
        ctx.save();
        // Heavy joiner workbench
        ctx.fillStyle = '#593215';
        ctx.fillRect(30, 395, 526, 32);
        ctx.strokeStyle = '#2d1406';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(30, 395, 526, 32);

        // Legs
        ctx.fillStyle = '#3a1e0b';
        ctx.fillRect(50, 427, 24, 130);
        ctx.strokeRect(50, 427, 24, 130);
        ctx.fillRect(500, 427, 24, 130);
        ctx.strokeRect(500, 427, 24, 130);

        // Wall tool rack behind bench
        ctx.fillStyle = '#291206';
        ctx.fillRect(60, 240, 466, 14);
        ctx.strokeStyle = '#120702';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(60, 240, 466, 14);

        // Hanging precision tools (wrenches, calipers, saws)
        const toolXs = [80, 115, 155, 395, 435, 475];
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        for (const tx of toolXs) {
          ctx.beginPath();
          ctx.moveTo(tx, 254);
          ctx.lineTo(tx, 285);
          ctx.stroke();
        }

        ctx.restore();
      },
    },

    // --- LAYER 4: Giant Skeleton Clock Frame & Main Train ---
    {
      id: 'attic_clock_tower',
      layer: 4,
      render(ctx) {
        ctx.save();
        ctx.translate(293, 300);

        // Grand Victorian clock pillar pillars (cast bronze)
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-65, 95);
        ctx.lineTo(-65, -80);
        ctx.moveTo(65, 95);
        ctx.lineTo(65, -80);
        ctx.stroke();

        // Interlocking decorative gear train background
        Painter.gear(ctx, -38, -25, 34, 16, 5, { color: '#b45309', strokeColor: '#451a03', spokes: 5 });
        Painter.gear(ctx, 35, -15, 42, 20, 6, { color: '#d97706', strokeColor: '#78350f', spokes: 6 });
        Painter.gear(ctx, -5, 40, 36, 18, 5, { color: '#f59e0b', strokeColor: '#92400e', spokes: 5 });

        // Pendulum shaft hanging down through bench
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(0, 135);
        ctx.stroke();

        // Heavy brass pendulum bob
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, 140, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      },
    },

    // --- LAYER 5: Wall Blueprints & Steam Pipes ---
    {
      id: 'attic_blueprints_pipes',
      layer: 5,
      render(ctx) {
        ctx.save();
        // Cyanotype patent blueprint pinned to wall (left)
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(70, 270, 75, 95);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(70, 270, 75, 95);

        // Blueprint technical drawings in white ink
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(107, 310, 18, 0, Math.PI * 2);
        ctx.moveTo(85, 345);
        ctx.lineTo(130, 345);
        ctx.moveTo(85, 352);
        ctx.lineTo(120, 352);
        ctx.stroke();

        // Copper steam pipe running down right wall
        ctx.fillStyle = '#b45309';
        ctx.fillRect(525, 175, 16, 220);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(525, 175, 16, 220);

        // Flange ring collars
        ctx.fillStyle = '#d97706';
        ctx.fillRect(521, 230, 24, 8);
        ctx.fillRect(521, 310, 24, 8);

        ctx.restore();
      },
    },
  ];

  // --- CANDIDATE DIFFERENCES FOR CLOCKWORK ATTIC (Stage 4: 10 subtle differences) ---
  const candidateDifferences = [
    // 1. Clockwork Wall Dial Roman Numeral VII vs VIII (Subtle numeral)
    {
      id: 'diff_attic_roman_numeral',
      name: 'Dial Roman Numeral',
      x: 293,
      y: 235,
      radius: 22,
      mutationType: 'swap',
      description: 'Dial numeral reading VII vs VIII at 7 o\'clock position (subtle stroke)',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(293, 235);
        // Dial circular bezel
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Numerals
        ctx.font = 'bold 9px serif';
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isMutated ? 'VIII' : 'VII', 0, 0);

        ctx.restore();
      },
    },

    // 2. Grand Clock Minute Hand Angle (Subtle 15° rotation)
    {
      id: 'diff_attic_clock_hand',
      name: 'Minute Hand Angle',
      x: 293,
      y: 195,
      radius: 22,
      mutationType: 'rotate',
      description: 'Clock minute hand pointing at 10 past vs 13 past (subtle rotation)',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(293, 195);
        // Dial
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center pinion
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Hour hand (fixed)
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -9);
        ctx.stroke();

        // Minute hand (subtle rotation angle)
        ctx.save();
        ctx.rotate(isMutated ? 1.45 : 1.15);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -14);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      },
    },

    // 3. Brass Cog Spoke Count (Middle Left Gear)
    {
      id: 'diff_attic_gear_spokes',
      name: 'Brass Cog Spoke Count',
      x: 215,
      y: 335,
      radius: 24,
      mutationType: 'swap',
      description: 'Spur gear with 5 curved spokes vs 6 spokes (subtle geometry)',
      render(ctx, isMutated) {
        Painter.gear(ctx, 215, 335, 26, 14, 4, {
          color: '#f59e0b',
          strokeColor: '#78350f',
          spokes: isMutated ? 6 : 5,
          rotation: isMutated ? 0.2 : 0,
        });
      },
    },

    // 4. Steam Pressure Gauge Dial Needle
    {
      id: 'diff_attic_pressure_needle',
      name: 'Steam Gauge Needle Position',
      x: 533,
      y: 280,
      radius: 22,
      mutationType: 'rotate',
      description: 'Pressure indicator needle at 35 psi vs 50 psi',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(533, 280);

        // Round brass gauge
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Red indicator needle
        ctx.save();
        ctx.rotate(isMutated ? 0.75 : 0.15);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(0, -11);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      },
    },

    // 5. Hourglass Sand Level in Upper Bulb
    {
      id: 'diff_attic_hourglass',
      name: 'Hourglass Upper Sand Level',
      x: 375,
      y: 375,
      radius: 22,
      mutationType: 'size',
      description: 'Hourglass upper chamber half-full vs nearly depleted',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(375, 375);

        // Mahogany wooden top & bottom discs
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-12, -18, 24, 4);
        ctx.fillRect(-12, 14, 24, 4);

        // Glass bulbs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(-9, -14);
        ctx.lineTo(9, -14);
        ctx.quadraticCurveTo(2, 0, 9, 14);
        ctx.lineTo(-9, 14);
        ctx.quadraticCurveTo(-2, 0, -9, -14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ruby sand in upper bulb
        ctx.fillStyle = '#dc2626';
        const upperH = isMutated ? 4 : 8;
        ctx.beginPath();
        ctx.moveTo(-6, -14 + (10 - upperH));
        ctx.lineTo(6, -14 + (10 - upperH));
        ctx.lineTo(0, -2);
        ctx.closePath();
        ctx.fill();

        // Sand stream
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 10);
        ctx.stroke();

        // Sand pile in lower bulb
        ctx.beginPath();
        ctx.moveTo(-7, 14);
        ctx.lineTo(7, 14);
        ctx.lineTo(0, 7);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      },
    },

    // 6. Watchmaker Loupe Rim Knurling Ring
    {
      id: 'diff_attic_loupe',
      name: 'Watchmaker Loupe Rim Ring',
      x: 165,
      y: 382,
      radius: 20,
      mutationType: 'color',
      description: 'Brass loupe rim band vs black ebonite band',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(165, 382);
        // Loupe cone
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(8, -10);
        ctx.lineTo(12, 10);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();

        // Lens
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(0, 10, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Knurled rim band
        ctx.strokeStyle = isMutated ? '#000000' : '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-12, 7, 24, 4);

        ctx.restore();
      },
    },

    // 7. Patent Blueprint Red Wax Seal Stamp
    {
      id: 'diff_attic_seal_stamp',
      name: 'Blueprint Wax Seal Shape',
      x: 125,
      y: 285,
      radius: 20,
      mutationType: 'swap',
      description: 'Circular imperial wax seal vs octagonal guild seal',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(125, 285);
        ctx.fillStyle = '#b91c1c';
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 1.2;
        if (isMutated) {
          // Octagonal
          ctx.beginPath();
          const r = 8;
          for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Circular
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      },
    },

    // 8. Copper Pipe Valve Handwheel Spokes
    {
      id: 'diff_attic_valve_spokes',
      name: 'Valve Handwheel Spokes',
      x: 533,
      y: 350,
      radius: 22,
      mutationType: 'swap',
      description: 'Valve handwheel with 4 spokes vs 5 spokes',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(533, 350);
        // Outer wheel rim
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Center brass hub
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Spokes
        const spokeCount = isMutated ? 5 : 4;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.8;
        for (let s = 0; s < spokeCount; s++) {
          const a = (s * Math.PI * 2) / spokeCount;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
          ctx.stroke();
        }

        ctx.restore();
      },
    },

    // 9. Brass Astrolabe Armillary Ring
    {
      id: 'diff_attic_astrolabe_ring',
      name: 'Astrolabe Celestial Ring Tilt',
      x: 440,
      y: 375,
      radius: 24,
      mutationType: 'rotate',
      description: 'Armillary sphere celestial meridian ring tilted by 25°',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(440, 375);

        // Outer brass sphere ring
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Tilted meridian ring (subtle angle)
        ctx.save();
        ctx.rotate(isMutated ? 0.7 : 0.25);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Center terrestrial globe bead
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // 10. Escapement Anchor Pallet Jewel Hue
    {
      id: 'diff_attic_pallet_jewel',
      name: 'Escapement Pallet Jewel Hue',
      x: 350,
      y: 340,
      radius: 20,
      mutationType: 'color',
      description: 'Synthetic ruby pallet jewel vs sapphire blue jewel',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(350, 340);

        // Steel anchor fork
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(0, 10);
        ctx.lineTo(10, -5);
        ctx.stroke();

        // Pallet jewel impulse face (ruby vs sapphire)
        ctx.fillStyle = isMutated ? '#0284c7' : '#e11d48';
        ctx.beginPath();
        ctx.arc(-8, -4, 3, 0, Math.PI * 2);
        ctx.arc(8, -4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // 11. Workbench Brass Wood-Screw Box
    {
      id: 'diff_attic_screw_box',
      name: 'Screw Tin Compartments',
      x: 105,
      y: 382,
      radius: 20,
      mutationType: 'swap',
      description: 'Divided wooden compartment tin with 4 slots vs 3 slots',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(105, 382);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(-15, -6, 30, 12);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-15, -6, 30, 12);

        // Dividers
        ctx.strokeStyle = '#78350f';
        const slots = isMutated ? 3 : 4;
        const w = 30 / slots;
        for (let i = 1; i < slots; i++) {
          ctx.beginPath();
          ctx.moveTo(-15 + i * w, -6);
          ctx.lineTo(-15 + i * w, 6);
          ctx.stroke();
        }
        ctx.restore();
      },
    },
  ];

  return {
    id: 'attic',
    name: 'Clockwork Attic',
    subtitle: 'Gear & Pendulum Loft',
    objects,
    candidateDifferences,
  };
}
