// game/src/painter.js
// High-grade 2D vector painting routines for procedural scenes, props, and visual effects.

export class Painter {
  static linearGradient(ctx, x1, y1, x2, y2, colorStops) {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    for (const stop of colorStops) {
      grad.addColorStop(stop.offset, stop.color);
    }
    return grad;
  }

  static radialGradient(ctx, x1, y1, r1, x2, y2, r2, colorStops) {
    const grad = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    for (const stop of colorStops) {
      grad.addColorStop(stop.offset, stop.color);
    }
    return grad;
  }

  static roundRect(ctx, x, y, w, h, radius, fillStyle = null, strokeStyle = null, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    let r = radius;
    if (typeof r === 'number') {
      r = { tl: r, tr: r, br: r, bl: r };
    } else {
      r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
    }
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  static circle(ctx, cx, cy, r, fillStyle = null, strokeStyle = null, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  static polygon(ctx, points, fillStyle = null, strokeStyle = null, lineWidth = 1) {
    if (!points || points.length < 3) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  static cloud(ctx, x, y, scale = 1, baseColor = '#50385c', rimColor = '#e07d72') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Rim highlight
    ctx.fillStyle = rimColor;
    ctx.beginPath();
    ctx.arc(0, -6, 26, 0, Math.PI * 2);
    ctx.arc(32, -4, 20, 0, Math.PI * 2);
    ctx.arc(-30, -2, 18, 0, Math.PI * 2);
    ctx.arc(58, 4, 14, 0, Math.PI * 2);
    ctx.arc(-52, 6, 13, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.arc(32, 2, 20, 0, Math.PI * 2);
    ctx.arc(-30, 4, 18, 0, Math.PI * 2);
    ctx.arc(58, 8, 14, 0, Math.PI * 2);
    ctx.arc(-52, 10, 13, 0, Math.PI * 2);
    ctx.rect(-52, 6, 110, 18);
    ctx.fill();

    ctx.restore();
  }

  static waveLine(ctx, x, y, width, crestHeight = 4, step = 28, color = '#f7a871', lineWidth = 1.8) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let curX = x; curX < x + width; curX += step) {
      ctx.quadraticCurveTo(curX + step * 0.25, y - crestHeight, curX + step * 0.5, y);
      ctx.quadraticCurveTo(curX + step * 0.75, y + crestHeight * 0.5, curX + step, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  static seagull(ctx, x, y, scale = 1, wingPose = 0, color = '#f8fafc') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const lift = Math.sin(wingPose) * 6;
    ctx.beginPath();
    ctx.moveTo(-16, -2 + lift);
    ctx.quadraticCurveTo(-8, -12 + lift, 0, 0);
    ctx.quadraticCurveTo(8, -12 + lift, 16, -2 + lift);
    ctx.stroke();

    // Beak tiny dot
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-1, 0, 2, 2);
    ctx.restore();
  }

  static lantern(ctx, x, y, scale = 1, lit = true, color = '#f59e0b') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Glow if lit
    if (lit) {
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // Metal cap & base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6, -14, 12, 3);
    ctx.fillRect(-8, -11, 16, 4);
    ctx.fillRect(-7, 10, 14, 4);

    // Glass body
    ctx.fillStyle = lit ? color : '#334155';
    ctx.fillRect(-6, -7, 12, 17);

    // Wire cage ribs
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -7, 12, 17);
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // Loop
    ctx.beginPath();
    ctx.arc(0, -16, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static barrel(ctx, x, y, scale = 1, opts = {}) {
    const { woodColor = '#854d0e', hoopColor = '#334155', emblem = null } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Barrel bulge polygon
    ctx.fillStyle = woodColor;
    ctx.strokeStyle = '#3b2507';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -20);
    ctx.quadraticCurveTo(-16, 0, -12, 20);
    ctx.lineTo(12, 20);
    ctx.quadraticCurveTo(16, 0, 12, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wood stave vertical lines
    ctx.strokeStyle = '#5a340a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, -20);
    ctx.quadraticCurveTo(-8, 0, -6, 20);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.moveTo(6, -20);
    ctx.quadraticCurveTo(8, 0, 6, 20);
    ctx.stroke();

    // Iron hoops
    ctx.strokeStyle = hoopColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-13, -13);
    ctx.lineTo(13, -13);
    ctx.moveTo(-15, -4);
    ctx.lineTo(15, -4);
    ctx.moveTo(-15, 6);
    ctx.lineTo(15, 6);
    ctx.moveTo(-13, 15);
    ctx.lineTo(13, 15);
    ctx.stroke();

    // Optional emblem (e.g. skull or star)
    if (emblem === 'skull') {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.rect(-2, 3, 4, 3);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2, -1, 1.5, 1.5);
      ctx.fillRect(1, -1, 1.5, 1.5);
    } else if (emblem === 'star') {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static lifebuoy(ctx, x, y, scale = 1, opts = {}) {
    const { primaryColor = '#ea580c', stripeColor = '#f8fafc', angle = 0 } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(2, 3, 16, 0, Math.PI * 2);
    ctx.arc(2, 3, 7, 0, Math.PI * 2, true);
    ctx.fill();

    // Main ring
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.arc(0, 0, 7, 0, Math.PI * 2, true);
    ctx.fill();

    // 4 Contrast stripes
    ctx.fillStyle = stripeColor;
    for (let a = 0; a < 4; a++) {
      ctx.save();
      ctx.rotate((a * Math.PI) / 2);
      ctx.beginPath();
      ctx.rect(-3.5, -16.5, 7, 9.5);
      ctx.fill();
      ctx.restore();
    }

    // Outer and inner rim borders
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.stroke();

    // Grab rope loop
    ctx.strokeStyle = '#c2a677';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static fishCrate(ctx, x, y, scale = 1, opts = {}) {
    const { hasFish = true, crateColor = '#a16207' } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Crate box
    ctx.fillStyle = crateColor;
    ctx.fillRect(-18, -12, 36, 24);
    ctx.strokeStyle = '#5a340a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-18, -12, 36, 24);

    // Wood slat horizontal slits
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-16, -4, 32, 2);
    ctx.fillRect(-16, 4, 32, 2);

    if (hasFish) {
      // Ice and fish inside
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -9, 14, Math.PI, 0);
      ctx.fill();

      // Shiny silver mackerel
      for (let f = 0; f < 3; f++) {
        ctx.save();
        ctx.translate(-7 + f * 7, -10 + (f % 2) * 2);
        ctx.rotate(0.3 - f * 0.25);
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-2, -1, 3, 1);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  static weatherVane(ctx, x, y, scale = 1, opts = {}) {
    const { kind = 'rooster', angle = 0 } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Vertical spindle rod
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -28);
    ctx.stroke();

    // Directional cardinals (N-S-E-W)
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, -12);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, -6);
    ctx.stroke();

    // Rotating arrow / banner
    ctx.save();
    ctx.translate(0, -26);
    ctx.rotate(angle);

    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;

    if (kind === 'rooster') {
      // Rooster silhouette
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.quadraticCurveTo(-14, -8, -6, -14); // tail
      ctx.lineTo(2, -8); // back
      ctx.lineTo(6, -14); // comb/head
      ctx.lineTo(10, -11); // beak
      ctx.lineTo(5, -6); // chest
      ctx.lineTo(2, 0); // feet
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Sleek arrow
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(6, -4);
      ctx.moveTo(10, 0);
      ctx.lineTo(6, 4);
      ctx.stroke();
      // Arrow tail fletching
      ctx.beginPath();
      ctx.moveTo(-14, -4);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-14, 4);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  static starfish(ctx, x, y, scale = 1, color = '#f43f5e') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    const points = 5;
    const outerR = 12;
    const innerR = 5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center jewel pip
    ctx.fillStyle = '#ffe4e6';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static flowerBox(ctx, x, y, scale = 1, flowerColor = '#ef4444') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Wooden planter
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-16, 0, 32, 8);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-16, 0, 32, 8);

    // Green foliage
    ctx.fillStyle = '#15803d';
    for (let i = -12; i <= 12; i += 6) {
      ctx.beginPath();
      ctx.arc(i, -3, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blossoms
    ctx.fillStyle = flowerColor;
    for (let i = -11; i <= 11; i += 5.5) {
      ctx.beginPath();
      ctx.arc(i, -6, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static buoy(ctx, x, y, scale = 1, opts = {}) {
    const { color = '#059669', beaconLit = true } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Bobbing water reflection
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Float base
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 4, 14, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tower cage
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 4);
    ctx.lineTo(-4, -18);
    ctx.lineTo(4, -18);
    ctx.lineTo(8, 4);
    ctx.stroke();

    // Beacon light
    if (beaconLit) {
      const glow = ctx.createRadialGradient(0, -22, 2, 0, -22, 16);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, -22, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -22, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static cat(ctx, x, y, scale = 1, furColor = '#f97316') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Tail
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, 6);
    ctx.quadraticCurveTo(-16, 2, -14, -4);
    ctx.stroke();

    // Body
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(-2, 4, 10, 7, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(6, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(3, -6);
    ctx.lineTo(4, -11);
    ctx.lineTo(8, -7);
    ctx.lineTo(10, -11);
    ctx.lineTo(11, -5);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(6, -3, 1.5, 1.5);
    ctx.fillRect(9, -3, 1.5, 1.5);

    ctx.restore();
  }

  // Ghost outline for disappeared objects inside hit marker
  static ghostOutline(ctx, x, y, radius = 22, label = 'REMOVED') {
    ctx.save();
    ctx.translate(x, y);

    // Dashed glowing amber/cyan boundary
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner subtle ghost tint
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fill();

    // Ghost icon cross-hatch
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.5, 0);
    ctx.lineTo(radius * 0.5, 0);
    ctx.moveTo(0, -radius * 0.5);
    ctx.lineTo(0, radius * 0.5);
    ctx.stroke();

    ctx.restore();
  }
}
