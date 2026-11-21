// game/src/scenes/greenhouse.js
// Stage 3: Greenhouse Lab (Botanical Glasshouse) — lush Victorian conservatory & alchemical botany lab.
// Designed specifically for Cover screenshot (Hunt) and subtle perceptual differences (Level 3–4).

import { Painter } from '../painter.js';

export function buildGreenhouseScene(rng) {
  const objects = [
    // --- LAYER 0: Misty Twilight Glass Panes & Sky ---
    {
      id: 'greenhouse_sky',
      layer: 0,
      render(ctx) {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#1e293b');
        skyGrad.addColorStop(1, '#115e59');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 586, 320);

        // Outside rain / mist streaks
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let x = 15; x < 586; x += 38) {
          ctx.beginPath();
          ctx.moveTo(x, 10);
          ctx.lineTo(x + 20, 220);
          ctx.stroke();
        }
      },
    },

    // --- LAYER 1: Victorian Wrought-Iron Arch Ribs & Panes ---
    {
      id: 'greenhouse_glass_arches',
      layer: 1,
      render(ctx) {
        ctx.save();
        ctx.strokeStyle = '#042f2e';
        ctx.lineWidth = 3.5;

        // Giant curved glass dome ribs
        const archCenters = [140, 293, 446];
        for (const cx of archCenters) {
          ctx.beginPath();
          ctx.moveTo(cx - 120, 320);
          ctx.quadraticCurveTo(cx, 20, cx + 120, 320);
          ctx.stroke();
        }

        // Horizontal glass transom bars
        ctx.lineWidth = 2;
        const heights = [70, 130, 190, 250];
        for (const h of heights) {
          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.lineTo(586, h);
          ctx.stroke();
        }

        // Iron decorative cresting scrollwork at roof apex
        ctx.fillStyle = '#134e4a';
        for (let fx = 10; fx < 586; fx += 24) {
          ctx.beginPath();
          ctx.arc(fx, 40, 5, 0, Math.PI, true);
          ctx.fill();
        }

        ctx.restore();
      },
    },

    // --- LAYER 2: Hanging Baskets & Cascading Vines ---
    {
      id: 'greenhouse_hanging_vines',
      layer: 2,
      render(ctx) {
        ctx.save();
        // Wrought iron chains holding hanging pots
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        const hangingPots = [85, 215, 370, 500];

        for (const hx of hangingPots) {
          ctx.beginPath();
          ctx.moveTo(hx, 60);
          ctx.lineTo(hx - 12, 115);
          ctx.moveTo(hx, 60);
          ctx.lineTo(hx + 12, 115);
          ctx.stroke();

          // Terracotta hanging pot
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(hx - 18, 115);
          ctx.lineTo(hx + 18, 115);
          ctx.lineTo(hx + 12, 135);
          ctx.lineTo(hx - 12, 135);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.stroke();

          // Cascading English Ivy foliage
          ctx.fillStyle = '#15803d';
          for (let leaf = 0; leaf < 8; leaf++) {
            const lx = hx - 14 + (leaf % 3) * 14;
            const ly = 125 + leaf * 9;
            ctx.beginPath();
            ctx.ellipse(lx, ly, 7, 5, 0.4 * (leaf % 2 ? 1 : -1), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      },
    },

    // --- LAYER 3: Terracotta Tile Floor & Victorian Drainage Grates ---
    {
      id: 'greenhouse_floor',
      layer: 3,
      render(ctx) {
        ctx.save();
        const floorGrad = ctx.createLinearGradient(0, 470, 0, 624);
        floorGrad.addColorStop(0, '#78350f');
        floorGrad.addColorStop(0.5, '#451a03');
        floorGrad.addColorStop(1, '#1c1917');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, 470, 586, 154);

        // Tile diamond grid lines
        ctx.strokeStyle = '#291206';
        ctx.lineWidth = 1.5;
        for (let tx = -100; tx < 700; tx += 48) {
          ctx.beginPath();
          ctx.moveTo(tx, 470);
          ctx.lineTo(tx + 120, 624);
          ctx.moveTo(tx + 120, 470);
          ctx.lineTo(tx, 624);
          ctx.stroke();
        }

        // Victorian cast-iron drainage grate along floor
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 595, 506, 18);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 595, 506, 18);
        // Slits
        ctx.fillStyle = '#020617';
        for (let gx = 50; gx < 540; gx += 14) {
          ctx.fillRect(gx, 598, 6, 12);
        }

        ctx.restore();
      },
    },

    // --- LAYER 4: Potting Benches & Tiered Laboratory Tables ---
    {
      id: 'greenhouse_benches',
      layer: 4,
      render(ctx) {
        ctx.save();
        // Sturdy oak laboratory workbench
        ctx.fillStyle = '#5c3317';
        ctx.fillRect(20, 390, 546, 32);
        ctx.strokeStyle = '#2d1406';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(20, 390, 546, 32);

        // Heavy turned wooden legs
        const legs = [40, 180, 400, 530];
        for (const lx of legs) {
          ctx.fillStyle = '#3e1d08';
          ctx.fillRect(lx, 422, 22, 140);
          ctx.strokeRect(lx, 422, 22, 140);
        }

        // Lower shelf with bags of fertilizer and spare pots
        ctx.fillStyle = '#4a250c';
        ctx.fillRect(40, 510, 506, 18);
        ctx.strokeRect(40, 510, 506, 18);

        // Tiered variety of terracotta and ceramic pots on bottom shelf
        const shelfPots = [
          { x: 80, color: '#c2410c', h: 26, w: 22 },
          { x: 110, color: '#047857', h: 22, w: 20 },
          { x: 138, color: '#c2410c', h: 28, w: 24 },
          { x: 170, color: '#d97706', h: 20, w: 18 },
          { x: 196, color: '#c2410c', h: 26, w: 22 },
          { x: 410, color: '#0284c7', h: 24, w: 22 },
          { x: 440, color: '#c2410c', h: 28, w: 24 },
          { x: 472, color: '#7c2d12', h: 22, w: 20 },
        ];
        for (const p of shelfPots) {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, 510 - p.h, p.w, p.h);
          ctx.strokeStyle = '#270e02';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(p.x, 510 - p.h, p.w, p.h);
        }

        ctx.restore();
      },
    },

    // --- LAYER 4.5: Dense Botanical Floor Props, Sacks & Wheelbarrow ---
    {
      id: 'greenhouse_floor_props',
      layer: 4.5,
      render(ctx) {
        ctx.save();

        // 1. Stacked Burlap Sacks of Compost (Far Left)
        ctx.save();
        ctx.translate(35, 545);
        // Bottom sack
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.ellipse(32, 38, 32, 18, -0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Top leaning sack
        ctx.fillStyle = '#a16207';
        ctx.beginPath();
        ctx.ellipse(36, 16, 26, 16, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tied neck with twine
        ctx.fillStyle = '#713f12';
        ctx.fillRect(56, 4, 10, 6);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(56, 4, 10, 6);

        // Stencil text on sack
        ctx.font = 'bold 8px system-ui, sans-serif';
        ctx.fillStyle = '#451a03';
        ctx.textAlign = 'center';
        ctx.fillText('PEAT MOSS', 32, 40);

        // Spilled potting soil & fallen leaves
        ctx.fillStyle = '#271206';
        ctx.beginPath();
        ctx.ellipse(30, 52, 28, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Leaves
        ctx.fillStyle = '#15803d';
        ctx.fillRect(10, 48, 5, 3);
        ctx.fillRect(52, 50, 4, 3);
        ctx.restore();

        // 2. Metal Watering Can & Seedling Nursery Tray (Center-Left)
        ctx.save();
        ctx.translate(145, 545);
        // Galvanized zinc watering can
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(22, 34, 16, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Spout
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.lineTo(-8, 18);
        ctx.stroke();
        // Rose sprinkler
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(-9, 17, 5, 3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Arched handle
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(22, 20, 14, Math.PI, 0);
        ctx.stroke();

        // Seedling Flat wooden nursery box
        ctx.fillStyle = '#78350f';
        ctx.fillRect(45, 32, 44, 16);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(45, 32, 44, 16);
        // Soil inside
        ctx.fillStyle = '#271206';
        ctx.fillRect(47, 34, 40, 6);
        // Sprouted green cotyledons
        ctx.fillStyle = '#22c55e';
        for (let s = 50; s <= 82; s += 8) {
          ctx.beginPath();
          ctx.arc(s, 31, 2, 0, Math.PI * 2);
          ctx.arc(s + 2, 30, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 3. Gardener's Wooden Wheelbarrow with Potted Flora (Center-Right)
        ctx.save();
        ctx.translate(345, 540);
        // Wooden wheelbarrow body
        ctx.fillStyle = '#854d0e';
        ctx.beginPath();
        ctx.moveTo(15, 20);
        ctx.lineTo(85, 10);
        ctx.lineTo(80, 42);
        ctx.lineTo(25, 42);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wooden handle beams extending right
        ctx.strokeStyle = '#5c3317';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(70, 32);
        ctx.lineTo(105, 30);
        ctx.stroke();

        // Leg prop
        ctx.beginPath();
        ctx.moveTo(75, 42);
        ctx.lineTo(72, 54);
        ctx.stroke();

        // Spoked iron wheel on left
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(15, 42, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(15, 42, 3, 0, Math.PI * 2);
        ctx.fill();

        // Potted plants loaded inside wheelbarrow
        // Yellow pot with spiky aloe
        ctx.fillStyle = '#eab308';
        ctx.fillRect(32, 8, 16, 14);
        ctx.strokeRect(32, 8, 16, 14);
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(40, 8);
        ctx.lineTo(34, -4);
        ctx.lineTo(40, -1);
        ctx.lineTo(46, -4);
        ctx.closePath();
        ctx.fill();

        // Turquoise pot with fern
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(54, 4, 18, 16);
        ctx.strokeRect(54, 4, 18, 16);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(63, 2, 7, 0, Math.PI, true);
        ctx.fill();
        ctx.restore();

        // 4. Oak Rain Barrel & Giant Potted Boston Fern (Far Right)
        ctx.save();
        ctx.translate(470, 530);
        // Rain barrel
        ctx.fillStyle = '#713f12';
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.quadraticCurveTo(-4, 30, 2, 60);
        ctx.lineTo(48, 60);
        ctx.quadraticCurveTo(54, 30, 50, 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3b1c09';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Iron hoops
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(50, 15);
        ctx.moveTo(0, 48);
        ctx.lineTo(49, 48);
        ctx.stroke();

        // Brass spigot tap
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(49, 36, 10, 4);
        ctx.fillRect(57, 34, 3, 9);

        // Water droplet
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(58, 48, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Giant Boston fern cascading from stone pot
        ctx.fillStyle = '#15803d';
        for (let f = -12; f <= 12; f += 6) {
          ctx.beginPath();
          ctx.ellipse(f, 3, 14, 5, f * 0.08, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        ctx.restore();
      },
    },

    // --- LAYER 5: Lush Plants & Botanical Foliage ---
    {
      id: 'greenhouse_plants',
      layer: 5,
      render(ctx) {
        ctx.save();
        // Left Monstera Deliciosa (giant cheese plant)
        ctx.fillStyle = '#166534';
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1.5;

        // Big fenestrated monstera leaves
        const leaves = [
          { x: 75, y: 320, rx: 32, ry: 45, rot: -0.4 },
          { x: 125, y: 290, rx: 35, ry: 48, rot: 0.2 },
          { x: 105, y: 360, rx: 28, ry: 40, rot: -0.1 },
        ];

        for (const l of leaves) {
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, l.rx, l.ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Fenestration slits (open cuts in leaf)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(-14, -10, 3, 9, 0.3, 0, Math.PI * 2);
          ctx.ellipse(14, -8, 3, 9, -0.3, 0, Math.PI * 2);
          ctx.ellipse(-12, 12, 3, 8, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Tall Victorian potted palm in corner (right)
        ctx.save();
        ctx.translate(505, 340);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        for (let a = -0.9; a <= 0.9; a += 0.35) {
          ctx.beginPath();
          ctx.moveTo(0, 50);
          ctx.quadraticCurveTo(Math.sin(a) * 55, -20, Math.sin(a) * 90, -70);
          ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
      },
    },

    // --- LAYER 6: Alchemy Glassware & Reagent Vials on Bench ---
    {
      id: 'greenhouse_lab_glass',
      layer: 6,
      render(ctx) {
        ctx.save();
        // Wooden test tube rack on table
        ctx.fillStyle = '#78350f';
        ctx.fillRect(235, 345, 95, 45);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(235, 345, 95, 45);

        // Rack opening holes
        ctx.fillStyle = '#291206';
        ctx.fillRect(240, 362, 85, 18);

        // Reagent vials in rack
        const vials = [
          { x: 248, color: '#38bdf8', h: 32 }, // Cyan solution
          { x: 265, color: '#a855f7', h: 30 }, // Violet extract
          { x: 282, color: '#22c55e', h: 34 }, // Chlorophyll elixir
          { x: 300, color: '#f59e0b', h: 28 }, // Amber tincture
          { x: 318, color: '#ec4899', h: 31 }, // Orchid serum
        ];

        for (const v of vials) {
          // Glass tube
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(v.x - 4, 340, 8, v.h);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(v.x - 4, 340, 8, v.h);

          // Liquid
          ctx.fillStyle = v.color;
          ctx.fillRect(v.x - 3, 340 + v.h * 0.4, 6, v.h * 0.6);

          // Cork stopper
          ctx.fillStyle = '#d97706';
          ctx.fillRect(v.x - 3.5, 336, 7, 5);
        }

        // Brass distillation burner under flask
        ctx.fillStyle = '#b45309';
        ctx.fillRect(170, 375, 24, 15);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(182, 373, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // --- LAYER 7: Brass Microscope & Botanical Specimen Jars ---
    {
      id: 'greenhouse_microscope',
      layer: 7,
      render(ctx) {
        ctx.save();
        ctx.translate(415, 345);

        // Mahogany mounting block
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-18, 35, 36, 10);

        // Brass horseshoe base
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-14, 28, 28, 8);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-14, 28, 28, 8);

        // Curved limb
        ctx.beginPath();
        ctx.moveTo(0, 28);
        ctx.quadraticCurveTo(-14, 10, -4, -15);
        ctx.stroke();

        // Optical tube
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-6, -35, 12, 38);
        ctx.strokeRect(-6, -35, 12, 38);

        // Eyepiece
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-8, -42, 16, 7);

        // Specimen stage plate
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-16, 8, 32, 5);

        // Glass slide on stage
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-10, 6, 20, 2);

        ctx.restore();
      },
    },
  ];

  // --- CANDIDATE DIFFERENCES FOR GREENHOUSE LAB (Stage 3: 9 differences) ---
  // Subtler differences (subtle colors, slight rotations, small element variations)
  const candidateDifferences = [
    // 1. Exotic Purple Orchid Center Labellum (Subtle color shift)
    {
      id: 'diff_gh_orchid',
      name: 'Exotic Orchid Lip Color',
      x: 185,
      y: 285,
      radius: 22,
      mutationType: 'color',
      description: 'Magenta-violet orchid labellum vs deep crimson labellum (subtle tone)',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(185, 285);
        // White-lilac outer petals
        ctx.fillStyle = '#f3e8ff';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.2;
        for (let p = 0; p < 5; p++) {
          ctx.save();
          ctx.rotate((p * Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -12, 6, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        // Center labellum lip (subtle variation)
        ctx.fillStyle = isMutated ? '#be185d' : '#9333ea';
        ctx.beginPath();
        ctx.ellipse(0, 3, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Golden center dot
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // 2. Erlenmeyer Alembic Boiling Flask (Liquid level and bubbles)
    {
      id: 'diff_gh_flask',
      name: 'Alchemy Flask Liquid Level',
      x: 182,
      y: 350,
      radius: 24,
      mutationType: 'size',
      description: 'Alembic flask filled to 65% vs filled to 40% (subtle meniscus)',
      render(ctx, isMutated) {
        Painter.flask(ctx, 182, 350, 0.95, {
          liquidColor: '#06b6d4',
          liquidRatio: isMutated ? 0.38 : 0.65,
          bubbles: !isMutated,
        });
      },
    },

    // 3. Hanging Pitcher Plant Leaf Angle (Subtle rotation)
    {
      id: 'diff_gh_pitcher',
      name: 'Carnivorous Pitcher Cup Angle',
      x: 295,
      y: 200,
      radius: 22,
      mutationType: 'rotate',
      description: 'Hanging Nepenthes pitcher tilted left vs upright (~18° rotation)',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(295, 200);
        ctx.rotate(isMutated ? 0.32 : -0.1);

        // Vine tendril
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.quadraticCurveTo(6, -10, 0, 0);
        ctx.stroke();

        // Carnivorous pitcher trap cup
        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.quadraticCurveTo(-12, 18, 0, 24);
        ctx.quadraticCurveTo(12, 18, 7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#881337';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Peristome lip ring
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lid hood
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(0, -5, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // 4. Framed Butterfly Specimen Wings (Subtle wing spot count)
    {
      id: 'diff_gh_butterfly',
      name: 'Framed Butterfly Wing Spots',
      x: 350,
      y: 280,
      radius: 22,
      mutationType: 'swap',
      description: 'Framed Morpho butterfly with 3 golden spots per wing vs 2 spots',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(350, 280);

        // Specimen shadowbox frame
        ctx.fillStyle = '#291206';
        ctx.fillRect(-22, -18, 44, 36);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-22, -18, 44, 36);

        // Mounting parchment
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-18, -14, 36, 28);

        // Butterfly body
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-1.5, -9, 3, 18);

        // Metallic Blue Wings
        ctx.fillStyle = '#0284c7';
        // Left wings
        ctx.beginPath();
        ctx.ellipse(-9, -4, 9, 6, -0.4, 0, Math.PI * 2);
        ctx.ellipse(-8, 5, 7, 5, 0.4, 0, Math.PI * 2);
        // Right wings
        ctx.ellipse(9, -4, 9, 6, 0.4, 0, Math.PI * 2);
        ctx.ellipse(8, 5, 7, 5, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Golden spots on wing edges (3 vs 2)
        ctx.fillStyle = '#fef08a';
        const spotCount = isMutated ? 2 : 3;
        for (let s = 0; s < spotCount; s++) {
          ctx.beginPath();
          ctx.arc(-14 + s * 2, -6 + s * 5, 1.2, 0, Math.PI * 2);
          ctx.arc(14 - s * 2, -6 + s * 5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      },
    },

    // 5. Copper Watering Can on Bench
    {
      id: 'diff_gh_watering_can',
      name: 'Copper Watering Can Rose Spout',
      x: 485,
      y: 375,
      radius: 24,
      mutationType: 'swap',
      description: 'Brass sprinkler rose head on spout vs open tapered spout',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(485, 375);

        // Copper can body
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(0, 5, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Top arch handle
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -4, 14, Math.PI, 0);
        ctx.stroke();

        // Long spout
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(12, 2);
        ctx.lineTo(28, -14);
        ctx.stroke();

        // Rose sprinkler head (subtle detail)
        ctx.fillStyle = isMutated ? '#94a3b8' : '#fbbf24';
        if (isMutated) {
          // Open brass collar
          ctx.fillRect(26, -16, 4, 4);
        } else {
          // Wide perforated rose sprinkler
          ctx.beginPath();
          ctx.ellipse(29, -15, 6, 3, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      },
    },

    // 6. Terracotta Pot Engraving Lines (Left Bench)
    {
      id: 'diff_gh_pot_grooves',
      name: 'Monstera Pot Rim Grooves',
      x: 105,
      y: 405,
      radius: 22,
      mutationType: 'swap',
      description: 'Single engraved groove on terracotta rim vs double groove',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(105, 405);

        // Terracotta pot
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(18, 0);
        ctx.lineTo(14, 28);
        ctx.lineTo(-14, 28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Rim collar
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(-21, -5, 42, 8);
        ctx.strokeRect(-21, -5, 42, 8);

        // Engraved ring grooves
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-19, -1);
        ctx.lineTo(19, -1);
        if (isMutated) {
          ctx.moveTo(-19, 1);
          ctx.lineTo(19, 1);
        }
        ctx.stroke();

        ctx.restore();
      },
    },

    // 7. Botanical Seed Jar Label Glyph
    {
      id: 'diff_gh_seed_jar',
      name: 'Specimen Bottle Label Glyph',
      x: 142,
      y: 375,
      radius: 20,
      mutationType: 'swap',
      description: 'Glass jar label with botanical leaf icon vs sunburst icon',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(142, 375);

        // Glass jar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(-9, -14, 18, 22);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-9, -14, 18, 22);

        // Seeds inside
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-7, -4, 14, 10);

        // Paper label
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-7, -10, 14, 9);

        // Icon glyph on label
        ctx.strokeStyle = isMutated ? '#dc2626' : '#15803d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (isMutated) {
          // Tiny sun
          ctx.arc(0, -6, 2, 0, Math.PI * 2);
        } else {
          // Leaf
          ctx.moveTo(0, -8);
          ctx.lineTo(2, -5);
          ctx.lineTo(0, -3);
          ctx.lineTo(-2, -5);
          ctx.closePath();
        }
        ctx.stroke();

        // Cork
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-7, -18, 14, 4);

        ctx.restore();
      },
    },

    // 8. Microscope Knurled Fine Focus Knob
    {
      id: 'diff_gh_microscope_knob',
      name: 'Microscope Focus Knob Position',
      x: 415,
      y: 335,
      radius: 20,
      mutationType: 'rotate',
      description: 'Microscope knurled adjustment knob rotated by 45°',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(415, 335);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Cross slots
        ctx.save();
        ctx.rotate(isMutated ? Math.PI / 4 : 0);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      },
    },

    // 9. Potting Trowel on Bench (Wooden Handle Color)
    {
      id: 'diff_gh_trowel',
      name: 'Potting Trowel Wood Handle',
      x: 350,
      y: 382,
      radius: 20,
      mutationType: 'color',
      description: 'Steel trowel with oak handle vs mahogany dark handle',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(350, 382);
        // Steel blade
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(-4, -6);
        ctx.lineTo(14, -6);
        ctx.lineTo(20, 0);
        ctx.lineTo(14, 6);
        ctx.lineTo(-4, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Handle (subtle wood shade)
        ctx.fillStyle = isMutated ? '#451a03' : '#b45309';
        ctx.fillRect(-18, -3, 14, 6);
        ctx.strokeStyle = '#291206';
        ctx.strokeRect(-18, -3, 14, 6);

        ctx.restore();
      },
    },

    // 10. Water Lily Blossom Center (Lower Ground Basin)
    {
      id: 'diff_gh_water_lily',
      name: 'Victoria Water Lily Flower',
      x: 290,
      y: 470,
      radius: 24,
      mutationType: 'color',
      description: 'Pristine white water lily petals vs pale blush rose petals',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(290, 470);
        // Giant circular floating lily pad
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0.3, Math.PI * 2);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Blossom
        ctx.fillStyle = isMutated ? '#fbcfe8' : '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },
  ];

  return {
    id: 'greenhouse',
    name: 'Greenhouse Lab',
    subtitle: 'Botanical Glasshouse',
    objects,
    candidateDifferences,
  };
}
