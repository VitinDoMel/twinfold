// Visual Effects Engine: Dual-panel Markers, Particles, Screen Shake & Hit/Miss Feedback

import { Painter } from './painter.js';
import { VIEW } from './config.js';
import { hexToRgba } from './palette.js';

export class EffectsManager {
  constructor() {
    this.particles = [];
    this.visualEvents = []; // hit rings, miss cross, floating text
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
  }

  reset() {
    this.particles = [];
    this.visualEvents = [];
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
  }

  /**
   * Triggers screen shake
   * @param {number} intensity Max pixel displacement
   * @param {number} duration Seconds
   */
  triggerShake(intensity = 6, duration = 0.35) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
  }

  /**
   * Spawns sparkle burst particles around a coordinate
   */
  spawnSparkles(x, y, count = 18, baseColor = '#48bb78') {
    const colors = [baseColor, '#ecc94b', '#ffffff', '#68d391', '#f6ad55'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        gravity: 120,
        size: 2.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.6 + Math.random() * 0.4,
        maxLife: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 10,
      });
    }
  }

  /**
   * Adds a successful hit event (dual markers & floating score)
   */
  addHitEvent(screenPositions, points, radius = VIEW.HIT_RADIUS, clickX, clickY) {
    const lx = screenPositions.left.x;
    const ly = screenPositions.left.y;
    const rx = screenPositions.right.x;
    const ry = screenPositions.right.y;

    // Dual expanding shockwave rings
    this.visualEvents.push({
      type: 'hit_shockwave',
      x1: lx,
      y1: ly,
      x2: rx,
      y2: ry,
      baseRadius: radius,
      duration: 0.65,
      elapsed: 0,
    });

    // Sparkle bursts on both panels
    this.spawnSparkles(lx, ly, 14, '#48bb78');
    this.spawnSparkles(rx, ry, 14, '#48bb78');

    // Floating score text at clicked position
    this.visualEvents.push({
      type: 'floating_text',
      x: clickX,
      y: clickY - 12,
      text: `+${points}`,
      color: '#48bb78',
      fontSize: 20,
      duration: 1.1,
      elapsed: 0,
    });
  }

  /**
   * Adds a miss event (red cross, penalty text, screen shake)
   */
  addMissEvent(clickX, clickY) {
    this.triggerShake(5, 0.3);

    // Red X Cross
    this.visualEvents.push({
      type: 'miss_cross',
      x: clickX,
      y: clickY,
      duration: 0.75,
      elapsed: 0,
    });

    // Floating -5s penalty text
    this.visualEvents.push({
      type: 'floating_text',
      x: clickX,
      y: clickY - 14,
      text: `-${VIEW.MISS_PENALTY_SEC}s`,
      color: '#e53e3e',
      fontSize: 22,
      duration: 1.0,
      elapsed: 0,
    });
  }

  update(dt) {
    // Update screen shake
    if (this.shakeElapsed < this.shakeDuration) {
      this.shakeElapsed += dt;
      if (this.shakeElapsed >= this.shakeDuration) {
        this.shakeIntensity = 0;
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.rotation += p.vrot * dt;
    }

    // Update visual events
    for (let i = this.visualEvents.length - 1; i >= 0; i--) {
      const ev = this.visualEvents[i];
      ev.elapsed += dt;
      if (ev.elapsed >= ev.duration) {
        this.visualEvents.splice(i, 1);
      }
    }
  }

  /**
   * Computes current screen shake offset [dx, dy]
   */
  getShakeOffset() {
    if (this.shakeIntensity <= 0 || this.shakeElapsed >= this.shakeDuration) {
      return [0, 0];
    }
    const decay = 1.0 - this.shakeElapsed / this.shakeDuration;
    const mag = this.shakeIntensity * decay;
    const dx = (Math.random() - 0.5) * 2 * mag;
    const dy = (Math.random() - 0.5) * 2 * mag;
    return [dx, dy];
  }

  /**
   * Renders persistent found markers on both panels
   */
  renderFoundMarkers(ctx, differences, foundIds, timeElapsed = 0) {
    for (const diff of differences) {
      if (!foundIds.has(diff.id)) continue;

      const lx = VIEW.PANEL_LEFT_X + diff.x;
      const rx = VIEW.PANEL_RIGHT_X + diff.x;
      const y = VIEW.PANEL_Y + diff.y;
      const r = diff.radius || VIEW.HIT_RADIUS;

      // Subtle resting pulse
      const pulse = Math.sin(timeElapsed * 3 + diff.x) * 1.5;
      const curR = r + pulse;

      // Outer radial glow
      Painter.circle(ctx, lx, y, curR + 6, null, 'rgba(72, 187, 120, 0.35)', 4);
      Painter.circle(ctx, rx, y, curR + 6, null, 'rgba(72, 187, 120, 0.35)', 4);

      // Sharp primary circle
      Painter.circle(ctx, lx, y, curR, null, '#48bb78', 2.5);
      Painter.circle(ctx, rx, y, curR, null, '#48bb78', 2.5);

      // Target tick marks (crosshair pips)
      const tickLen = 5;
      for (const cx of [lx, rx]) {
        Painter.line(ctx, cx - curR - tickLen, y, cx - curR + 2, y, '#48bb78', 1.8);
        Painter.line(ctx, cx + curR - 2, y, cx + curR + tickLen, y, '#48bb78', 1.8);
        Painter.line(ctx, cx, y - curR - tickLen, cx, y - curR + 2, '#48bb78', 1.8);
        Painter.line(ctx, cx, y + curR - 2, cx, y + curR + tickLen, '#48bb78', 1.8);
        Painter.circle(ctx, cx, y, 2.5, '#ffffff');
      }
    }
  }

  /**
   * Renders active hint beacon rings
   */
  renderActiveHint(ctx, activeHint) {
    if (!activeHint) return;

    const { diff, elapsed } = activeHint;
    const lx = VIEW.PANEL_LEFT_X + diff.x;
    const rx = VIEW.PANEL_RIGHT_X + diff.x;
    const y = VIEW.PANEL_Y + diff.y;
    const baseR = diff.radius || VIEW.HIT_RADIUS;

    // Expanding and contracting golden sonar rings
    const pulse = (Math.sin(elapsed * 7) + 1) * 0.5;
    const outerR = baseR + 8 + pulse * 18;
    const innerR = baseR + 2;

    const outerAlpha = 0.5 + pulse * 0.45;
    const colorOuter = hexToRgba('#ecc94b', outerAlpha);
    const colorInner = 'rgba(236, 201, 75, 0.95)';

    for (const cx of [lx, rx]) {
      // Outer ping ring
      Painter.circle(ctx, cx, y, outerR, null, colorOuter, 2.8);
      // Inner focused ring
      Painter.circle(ctx, cx, y, innerR, null, colorInner, 2.2);
      // Center golden target pip
      Painter.circle(ctx, cx, y, 4, '#ecc94b');
      Painter.circle(ctx, cx, y, 2, '#ffffff');
    }
  }

  /**
   * Renders animated feedback effects (shockwaves, miss cross, floating text, particles)
   */
  renderEffects(ctx) {
    // 1. Render particles
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      Painter.star(ctx, 0, 0, 4, p.size, p.size * 0.45, hexToRgba(p.color, alpha));
      ctx.restore();
    }

    // 2. Render visual events
    for (const ev of this.visualEvents) {
      const progress = ev.elapsed / ev.duration;
      const alpha = Math.max(0, 1.0 - progress);

      if (ev.type === 'hit_shockwave') {
        const r = ev.baseRadius + progress * 36;
        const col = hexToRgba('#48bb78', alpha * 0.9);
        Painter.circle(ctx, ev.x1, ev.y1, r, null, col, 3.5);
        Painter.circle(ctx, ev.x2, ev.y2, r, null, col, 3.5);
      } else if (ev.type === 'miss_cross') {
        const size = 14 + progress * 8;
        const col = hexToRgba('#e53e3e', alpha);
        Painter.line(ctx, ev.x - size, ev.y - size, ev.x + size, ev.y + size, col, 3.5);
        Painter.line(ctx, ev.x + size, ev.y - size, ev.x - size, ev.y + size, col, 3.5);
      } else if (ev.type === 'floating_text') {
        const curY = ev.y - progress * 32;
        Painter.text(ctx, ev.text, ev.x, curY, {
          font: `bold ${ev.fontSize || 18}px system-ui, sans-serif`,
          color: hexToRgba(ev.color, alpha),
          align: 'center',
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 5, x: 0, y: 1 },
        });
      }
    }
  }
}
