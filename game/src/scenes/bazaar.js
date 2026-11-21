// game/src/scenes/bazaar.js
// Stage 2: Night Bazaar (Lantern Alley) — vibrant desert spice & silk market at night.

import { Painter } from '../painter.js';

export function buildBazaarScene(rng) {
  const objects = [
    // --- LAYER 0: Starry Desert Sky ---
    {
      id: 'bazaar_sky',
      layer: 0,
      render(ctx) {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
        skyGrad.addColorStop(0, '#090a1a');
        skyGrad.addColorStop(0.4, '#151433');
        skyGrad.addColorStop(0.8, '#261b47');
        skyGrad.addColorStop(1.0, '#3d204a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 586, 320);

        // Twinkling desert stars
        ctx.fillStyle = '#ffffff';
        const stars = [
          [40, 30, 1.2], [95, 65, 1.5], [140, 25, 1.0], [210, 50, 1.8],
          [280, 20, 1.0], [330, 45, 1.4], [390, 35, 1.6], [450, 70, 1.2],
          [510, 25, 1.5], [550, 60, 1.0], [70, 100, 1.0], [480, 110, 1.2]
        ];
        for (const [sx, sy, sr] of stars) {
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    },

    // --- LAYER 1: Crescent Moon ---
    {
      id: 'bazaar_moon',
      layer: 1,
      render(ctx) {
        ctx.save();
        ctx.translate(460, 60);

        // Moon glow
        const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, 50);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
        glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();

        // Crescent shape
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#151433';
        ctx.beginPath();
        ctx.arc(7, -4, 17, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },
    },

    // --- LAYER 2: Adobe Domes & Desert Minarets ---
    {
      id: 'bazaar_minarets',
      layer: 2,
      render(ctx) {
        ctx.save();
        // Distant terracotta silhouetted minaret and dome
        ctx.fillStyle = '#261730';
        // Left minaret tower
        ctx.fillRect(50, 110, 28, 180);
        ctx.beginPath();
        ctx.arc(64, 110, 18, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(62, 80, 4, 15);

        // Central great dome
        ctx.beginPath();
        ctx.arc(260, 220, 75, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(258, 135, 4, 12);

        // Right mosque dome
        ctx.beginPath();
        ctx.arc(430, 240, 60, Math.PI, 0);
        ctx.fill();

        ctx.restore();
      },
    },

    // --- LAYER 3: Hanging Bunting & Pennants ---
    {
      id: 'bazaar_bunting',
      layer: 3,
      render(ctx) {
        ctx.save();
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 1.5;

        // Swag string 1
        ctx.beginPath();
        ctx.moveTo(0, 130);
        ctx.quadraticCurveTo(150, 180, 300, 140);
        ctx.quadraticCurveTo(440, 185, 586, 135);
        ctx.stroke();

        // Hanging triangular flags
        const flagColors = ['#f59e0b', '#06b6d4', '#e11d48', '#10b981', '#8b5cf6'];
        for (let i = 20; i < 570; i += 32) {
          const t = i / 586;
          const y = t < 0.5 ? 130 + Math.sin(t * Math.PI) * 45 : 140 + Math.sin((t - 0.5) * Math.PI * 2) * 40;
          ctx.fillStyle = flagColors[(i / 32) % flagColors.length];
          ctx.beginPath();
          ctx.moveTo(i, y);
          ctx.lineTo(i + 14, y);
          ctx.lineTo(i + 7, y + 16);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      },
    },

    // --- LAYER 4: Bazaar Adobe Archway & Walls ---
    {
      id: 'bazaar_walls',
      layer: 4,
      render(ctx) {
        ctx.save();
        // Warm sandstone walls
        ctx.fillStyle = '#92400e';
        ctx.fillRect(0, 180, 586, 444);

        // Adobe wall texture gradient
        const wallGrad = ctx.createLinearGradient(0, 180, 0, 480);
        wallGrad.addColorStop(0, '#b45309');
        wallGrad.addColorStop(0.6, '#78350f');
        wallGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 180, 586, 300);

        // Horseshoe arch doorways in background
        Painter.arch(ctx, 35, 230, 95, 140, { interiorColor: '#1e1124', borderColor: '#d97706', borderWidth: 3 });
        Painter.arch(ctx, 245, 220, 110, 150, { interiorColor: '#1e1124', borderColor: '#d97706', borderWidth: 3 });
        Painter.arch(ctx, 455, 235, 95, 135, { interiorColor: '#1e1124', borderColor: '#d97706', borderWidth: 3 });

        // Wall decorative stucco frieze band
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, 205, 586, 6);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        for (let fx = 8; fx < 586; fx += 16) {
          ctx.strokeRect(fx, 202, 10, 10);
        }

        ctx.restore();
      },
    },

    // --- LAYER 5: Cobblestone Pavement & Tile Ground ---
    {
      id: 'bazaar_floor',
      layer: 5,
      render(ctx) {
        ctx.save();
        const floorGrad = ctx.createLinearGradient(0, 460, 0, 624);
        floorGrad.addColorStop(0, '#592910');
        floorGrad.addColorStop(1, '#2b1206');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, 460, 586, 164);

        // Pavement flagstones
        ctx.strokeStyle = '#3d1a08';
        ctx.lineWidth = 1.5;
        for (let py = 475; py < 624; py += 28) {
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(586, py);
          ctx.stroke();

          const offset = (py % 56 === 0) ? 0 : 25;
          for (let px = offset; px < 586; px += 50) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + 28);
            ctx.stroke();
          }
        }
        ctx.restore();
      },
    },

    // --- LAYER 6: Stall Striped Awnings & Canopy ---
    {
      id: 'bazaar_canopies',
      layer: 6,
      render(ctx) {
        ctx.save();
        // Left stall awning (Crimson & Gold stripes)
        ctx.save();
        ctx.translate(15, 270);
        const stripeW = 18;
        for (let s = 0; s < 12; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#b91c1c' : '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(s * stripeW, 0);
          ctx.lineTo((s + 1) * stripeW, 0);
          ctx.lineTo((s + 1) * stripeW + 10, 55);
          ctx.lineTo(s * stripeW + 10, 55);
          ctx.closePath();
          ctx.fill();
        }
        // Scalloped valance edge
        for (let s = 0; s < 12; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#b91c1c' : '#fbbf24';
          ctx.beginPath();
          ctx.arc(s * stripeW + 10 + stripeW / 2, 55, stripeW / 2, 0, Math.PI);
          ctx.fill();
        }
        ctx.restore();

        // Right stall awning (Teal & Cream stripes)
        ctx.save();
        ctx.translate(340, 275);
        for (let s = 0; s < 12; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#0d9488' : '#fef3c7';
          ctx.beginPath();
          ctx.moveTo(s * stripeW, 0);
          ctx.lineTo((s + 1) * stripeW, 0);
          ctx.lineTo((s + 1) * stripeW - 10, 55);
          ctx.lineTo(s * stripeW - 10, 55);
          ctx.closePath();
          ctx.fill();
        }
        for (let s = 0; s < 12; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#0d9488' : '#fef3c7';
          ctx.beginPath();
          ctx.arc(s * stripeW - 10 + stripeW / 2, 55, stripeW / 2, 0, Math.PI);
          ctx.fill();
        }
        ctx.restore();

        // Wood timber poles supporting canopies
        ctx.fillStyle = '#451a03';
        ctx.fillRect(25, 325, 10, 160);
        ctx.fillRect(225, 325, 10, 160);
        ctx.fillRect(345, 330, 10, 155);
        ctx.fillRect(545, 330, 10, 155);

        ctx.restore();
      },
    },

    // --- LAYER 7: Hanging Persian Rug / Kilim Carpet ---
    {
      id: 'bazaar_carpet',
      layer: 7,
      render(ctx) {
        ctx.save();
        ctx.translate(240, 250);
        // Rich woven carpet
        ctx.fillStyle = '#831843';
        ctx.fillRect(0, 0, 105, 155);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, 105, 155);

        // Inner ornate border
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, 89, 139);

        // Fringes on bottom
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        for (let fx = 3; fx < 102; fx += 5) {
          ctx.beginPath();
          ctx.moveTo(fx, 155);
          ctx.lineTo(fx, 168);
          ctx.stroke();
        }
        ctx.restore();
      },
    },

    // --- LAYER 8: Spice Baskets & Market Counters ---
    {
      id: 'bazaar_counters',
      layer: 8,
      render(ctx) {
        ctx.save();
        // Wooden stall tables
        ctx.fillStyle = '#78350f';
        ctx.fillRect(15, 460, 230, 30);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(15, 460, 230, 30);

        ctx.fillRect(335, 460, 235, 30);
        ctx.strokeRect(335, 460, 235, 30);

        // Woven wicker baskets for spices (base bowls)
        const baskets = [
          { x: 45, y: 460, r: 22, color: '#eab308' },  // Turmeric
          { x: 100, y: 460, r: 24, color: '#dc2626' }, // Paprika
          { x: 155, y: 460, r: 22, color: '#7c2d12' }, // Cumin
          { x: 375, y: 460, r: 22, color: '#15803d' }, // Dried mint
          { x: 430, y: 460, r: 24, color: '#831843' }, // Sumac
          { x: 485, y: 460, r: 22, color: '#ea580c' }, // Curry
        ];

        for (const b of baskets) {
          // Basket bowl
          ctx.fillStyle = '#a16207';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Conical spice mound
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.moveTo(b.x - b.r + 2, b.y);
          ctx.lineTo(b.x, b.y - b.r * 1.15);
          ctx.lineTo(b.x + b.r - 2, b.y);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      },
    },

    // --- LAYER 9: Hanging Moroccan Lanterns ---
    {
      id: 'bazaar_ambient_lanterns',
      layer: 9,
      render(ctx) {
        // Brass hanging filigree lamps
        Painter.lantern(ctx, 80, 250, 1.25, true, '#f59e0b');
        Painter.lantern(ctx, 500, 255, 1.25, true, '#f59e0b');
        Painter.lantern(ctx, 292, 190, 1.4, true, '#fbbf24');
      },
    },

    // --- LAYER 10: Ground Sacks of Nuts & Brass Urns ---
    {
      id: 'bazaar_ground_props',
      layer: 10,
      render(ctx) {
        ctx.save();
        // Hessian sack of dates on ground
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.ellipse(80, 545, 24, 18, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Tied neck
        ctx.fillRect(66, 526, 12, 6);

        // Tall brass water pitcher on floor
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(490, 580);
        ctx.lineTo(520, 580);
        ctx.lineTo(514, 525);
        ctx.lineTo(496, 525);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Pitcher handle
        ctx.beginPath();
        ctx.arc(493, 550, 12, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();

        ctx.restore();
      },
    },
  ];

  // --- CANDIDATE DIFFERENCES FOR NIGHT BAZAAR (Stage 2: 7 differences) ---
  const candidateDifferences = [
    // 1. Central Brass Lamp Crown Crescent
    {
      id: 'diff_bazaar_lamp_finial',
      name: 'Central Lamp Crescent Finial',
      x: 292,
      y: 168,
      radius: 24,
      mutationType: 'swap',
      description: 'Golden crescent finial vs star finial on hanging brass lantern',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(292, 168);
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        if (isMutated) {
          // 5-pointed star
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? 8 : 4;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Crescent
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#261b47';
          ctx.beginPath();
          ctx.arc(3, -2, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      },
    },

    // 2. Saffron Spice Basket (Center Left)
    {
      id: 'diff_bazaar_saffron',
      name: 'Saffron Spice Mound Color',
      x: 210,
      y: 450,
      radius: 25,
      mutationType: 'color',
      description: 'Deep royal saffron yellow vs vivid sunset orange',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(210, 460);
        // Basket
        ctx.fillStyle = '#a16207';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Spice cone
        ctx.fillStyle = isMutated ? '#f97316' : '#eab308';
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(0, -26);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
    },

    // 3. Hanging Kilim Carpet Medallion (Center)
    {
      id: 'diff_bazaar_carpet_medallion',
      name: 'Hanging Kilim Medallion',
      x: 292,
      y: 325,
      radius: 24,
      mutationType: 'swap',
      description: 'Diamond star medallion vs octagonal floral medallion',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(292, 325);
        ctx.fillStyle = isMutated ? '#06b6d4' : '#fbbf24';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        if (isMutated) {
          // Octagonal floral
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Diamond star
          ctx.beginPath();
          ctx.moveTo(0, -16);
          ctx.lineTo(14, 0);
          ctx.lineTo(0, 16);
          ctx.lineTo(-14, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      },
    },

    // 4. Glazed Ceramic Tajine on Right Stall
    {
      id: 'diff_bazaar_tajine',
      name: 'Glazed Tajine Lid Pattern',
      x: 360,
      y: 435,
      radius: 22,
      mutationType: 'color',
      description: 'Cobalt blue glazed tajine vs emerald green glazed tajine',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(360, 442);
        // Base plate
        ctx.fillStyle = isMutated ? '#047857' : '#1d4ed8';
        ctx.beginPath();
        ctx.ellipse(0, 4, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Conical dome lid
        ctx.fillStyle = isMutated ? '#059669' : '#2563eb';
        ctx.beginPath();
        ctx.moveTo(-16, 4);
        ctx.quadraticCurveTo(-4, -14, 0, -22);
        ctx.quadraticCurveTo(4, -14, 16, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Knob
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, -23, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    },

    // 5. Moroccan Brass Teapot on Left Stall
    {
      id: 'diff_bazaar_teapot',
      name: 'Moroccan Teapot Handle',
      x: 180,
      y: 435,
      radius: 22,
      mutationType: 'swap',
      description: 'Curved brass scroll handle vs high arch loop handle',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(180, 442);
        // Teapot body
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Spout
        ctx.beginPath();
        ctx.moveTo(8, 2);
        ctx.quadraticCurveTo(16, 0, 18, -12);
        ctx.stroke();

        // Handle
        ctx.beginPath();
        if (isMutated) {
          ctx.arc(-8, -4, 9, Math.PI * 0.4, Math.PI * 1.5);
        } else {
          ctx.arc(-8, 0, 7, Math.PI * 0.5, Math.PI * 1.5);
        }
        ctx.stroke();

        // Conical lid
        ctx.beginPath();
        ctx.moveTo(-6, -11);
        ctx.lineTo(0, -17);
        ctx.lineTo(6, -11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      },
    },

    // 6. Hookah / Shisha Glass Vase on Floor
    {
      id: 'diff_bazaar_hookah',
      name: 'Hookah Glass Vase',
      x: 275,
      y: 535,
      radius: 25,
      mutationType: 'color',
      description: 'Ruby red crystal base vs emerald green crystal base',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(275, 545);

        // Glass vase
        ctx.fillStyle = isMutated ? '#059669' : '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-12, 16);
        ctx.quadraticCurveTo(-18, 0, -6, -14);
        ctx.lineTo(6, -14);
        ctx.quadraticCurveTo(18, 0, 12, 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Brass stem
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-2, -38, 4, 24);
        // Charcoal tray
        ctx.fillRect(-10, -40, 20, 3);
        // Ceramic bowl
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-6, -46, 12, 6);

        // Flexible hose
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, -10);
        ctx.quadraticCurveTo(24, 0, 18, 14);
        ctx.stroke();

        ctx.restore();
      },
    },

    // 7. Desert Cat Resting on Carpet
    {
      id: 'diff_bazaar_cat',
      name: 'Resting Desert Cat',
      x: 330,
      y: 560,
      radius: 22,
      mutationType: 'disappear',
      description: 'Sleeping calico cat curled by the carpet (missing in right panel)',
      render(ctx, isMutated) {
        if (!isMutated) {
          Painter.cat(ctx, 330, 560, 0.95, '#d97706');
        }
      },
    },

    // 8. Hanging Garlic / Dried Pepper String
    {
      id: 'diff_bazaar_peppers',
      name: 'Hanging Dried Chili String',
      x: 135,
      y: 350,
      radius: 20,
      mutationType: 'color',
      description: 'Fiery red dried chilies vs green pickled peppers',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(135, 350);
        ctx.fillStyle = isMutated ? '#16a34a' : '#dc2626';
        for (let p = 0; p < 4; p++) {
          ctx.beginPath();
          ctx.ellipse(0, p * 8, 4, 6, 0.2 * (p % 2 ? 1 : -1), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      },
    },

    // 9. Right Awning Hanging Lantern Glow
    {
      id: 'diff_bazaar_awning_lantern',
      name: 'Stall Lantern Flame',
      x: 435,
      y: 335,
      radius: 22,
      mutationType: 'color',
      description: 'Warm amber lantern glow vs purple mystic lantern glow',
      render(ctx, isMutated) {
        Painter.lantern(ctx, 435, 335, 0.95, true, isMutated ? '#a855f7' : '#f59e0b');
      },
    },

    // 10. Mosaic Tile Medallion on Cobblestone Pavement
    {
      id: 'diff_bazaar_mosaic',
      name: 'Pavement Mosaic Tile Star',
      x: 440,
      y: 550,
      radius: 22,
      mutationType: 'color',
      description: 'Turquoise pavement rosette vs lapis blue rosette',
      render(ctx, isMutated) {
        ctx.save();
        ctx.translate(440, 550);
        ctx.fillStyle = isMutated ? '#1d4ed8' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      },
    },
  ];

  return {
    id: 'bazaar',
    name: 'Night Bazaar',
    subtitle: 'Lantern Alley',
    objects,
    candidateDifferences,
  };
}
