// Vector drawing primitives for procedural 2D canvas scenes and UI

import { hexToRgba } from './palette.js';

export const Painter = {
  /**
   * Draws a rounded rectangle
   */
  roundedRect(ctx, x, y, w, h, r = 4, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    ctx.save();
    ctx.beginPath();
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    ctx.restore();
  },

  /**
   * Circle
   */
  circle(ctx, cx, cy, r, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(0.1, r), 0, Math.PI * 2);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    ctx.restore();
  },

  /**
   * Ellipse
   */
  ellipse(ctx, cx, cy, rx, ry, rotation = 0, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), rotation, 0, Math.PI * 2);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    ctx.restore();
  },

  /**
   * Straight line
   */
  line(ctx, x1, y1, x2, y2, strokeStyle = '#ffffff', strokeWidth = 1, lineCap = 'round') {
    ctx.save();
    ctx.beginPath();
    ctx.lineCap = lineCap;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  },

  /**
   * Polygon path
   */
  polygon(ctx, points, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    ctx.restore();
  },

  /**
   * Linear gradient builder
   */
  linearGradient(ctx, x1, y1, x2, y2, colorStops) {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    for (const [stop, color] of colorStops) {
      grad.addColorStop(stop, color);
    }
    return grad;
  },

  /**
   * Radial gradient builder
   */
  radialGradient(ctx, x1, y1, r1, x2, y2, r2, colorStops) {
    const grad = ctx.createRadialGradient(x1, y1, Math.max(0, r1), x2, y2, Math.max(0.1, r2));
    for (const [stop, color] of colorStops) {
      grad.addColorStop(stop, color);
    }
    return grad;
  },

  /**
   * Cloud shape
   */
  cloud(ctx, x, y, width, height, fillStyle = 'rgba(255, 255, 255, 0.4)') {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    const r = height * 0.5;
    ctx.arc(x + r, y + r, r, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + width * 0.35, y + r * 0.6, r * 1.1, Math.PI, Math.PI * 1.9);
    ctx.arc(x + width * 0.65, y + r * 0.5, r * 1.3, Math.PI * 1.1, Math.PI * 2);
    ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  /**
   * Multi-pointed star
   */
  star(ctx, cx, cy, spikes = 5, outerRadius = 8, innerRadius = 4, fillStyle = '#ecc94b') {
    ctx.save();
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  },

  /**
   * Wave ripple
   */
  wave(ctx, x, y, width, amplitude, frequency, strokeColor, strokeWidth = 1.5) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    for (let i = 0; i <= width; i += 4) {
      const curY = y + Math.sin(i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x + i, curY);
      else ctx.lineTo(x + i, curY);
    }
    ctx.stroke();
    ctx.restore();
  },

  /**
   * Wooden plank texture
   */
  woodPlank(ctx, x, y, w, h, baseColor, grainColor) {
    this.roundedRect(ctx, x, y, w, h, 2, baseColor, '#1a1412', 1);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 1, y + 1, w - 2, h - 2);
    ctx.clip();
    ctx.strokeStyle = grainColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.35);
    ctx.lineTo(x + w, y + h * 0.35);
    ctx.moveTo(x, y + h * 0.7);
    ctx.lineTo(x + w, y + h * 0.7);
    ctx.stroke();
    // Nail heads
    this.circle(ctx, x + 6, y + h / 2, 1.5, '#1a1412');
    this.circle(ctx, x + w - 6, y + h / 2, 1.5, '#1a1412');
    ctx.restore();
  },

  /**
   * Flying or perched seagull
   */
  seagull(ctx, x, y, scale = 1.0, angle = 0, wingUp = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (wingUp) {
      ctx.moveTo(-10, 2);
      ctx.quadraticCurveTo(-5, -6, 0, 0);
      ctx.quadraticCurveTo(5, -6, 10, 2);
    } else {
      ctx.moveTo(-10, -2);
      ctx.quadraticCurveTo(-5, 4, 0, 0);
      ctx.quadraticCurveTo(5, 4, 10, -2);
    }
    ctx.stroke();

    // Small yellow beak
    this.circle(ctx, 0.5, 0.5, 1.0, '#ed8936');
    ctx.restore();
  },

  /**
   * Hanging or mounted lantern with glow
   */
  lantern(ctx, x, y, scale = 1.0, glowColor = '#f6ad55', isLit = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Warm radial glow behind lantern
    if (isLit) {
      const glow = this.radialGradient(ctx, 0, 0, 2, 0, 0, 36, [
        [0, hexToRgba(glowColor, 0.75)],
        [0.4, hexToRgba(glowColor, 0.3)],
        [1, 'rgba(0,0,0,0)'],
      ]);
      this.circle(ctx, 0, 0, 36, glow);
    }

    // Top cap & ring
    this.circle(ctx, 0, -14, 3, null, '#4a332a', 1.5);
    this.roundedRect(ctx, -7, -12, 14, 4, 1, '#2c1e19', '#111', 1);

    // Glass body
    const glassColor = isLit ? 'rgba(254, 215, 122, 0.75)' : 'rgba(100, 116, 139, 0.4)';
    this.roundedRect(ctx, -6, -8, 12, 16, 2, glassColor, '#2c1e19', 1.2);

    // Interior flame
    if (isLit) {
      this.ellipse(ctx, 0, 0, 2, 4, 0, '#ffffff');
      this.ellipse(ctx, 0, 0, 3.5, 6, 0, '#fbd38d');
    }

    // Metal cage bars
    this.line(ctx, -2, -8, -2, 8, '#2c1e19', 1);
    this.line(ctx, 2, -8, 2, 8, '#2c1e19', 1);

    // Bottom base
    this.roundedRect(ctx, -8, 8, 16, 4, 1, '#2c1e19', '#111', 1);

    ctx.restore();
  },

  /**
   * Helper to execute a drawing block with a drop shadow
   */
  withShadow(ctx, color, blur, offsetX, offsetY, fn) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    fn();
    ctx.restore();
  },

  /**
   * Formatted text utility
   */
  text(ctx, str, x, y, options = {}) {
    ctx.save();
    const {
      font = "14px system-ui, sans-serif",
      color = "#ffffff",
      align = "left",
      baseline = "middle",
      shadow = null,
    } = options;

    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (shadow) {
      ctx.shadowColor = shadow.color || "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = shadow.blur || 6;
      ctx.shadowOffsetX = shadow.x || 0;
      ctx.shadowOffsetY = shadow.y || 2;
    }

    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.restore();
  },
};
