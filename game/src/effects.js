// game/src/effects.js
// Visual effects: hit marker rings, ghost outlines, error indicators, particles, hints, and screen shake.

import { Painter } from './painter.js';
import { PANELS } from './config.js';

export class EffectsManager {
  constructor() {
    this.particles = [];
    this.errorMarkers = [];
    this.hitRipples = [];
    this.floatingTexts = [];
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  triggerHit(diff, scoreAmount, comboMultiplier) {
    // Generate celebratory sparkles
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x: diff.x,
        y: diff.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        radius: 2.5 + Math.random() * 2.5,
        color: i % 2 === 0 ? '#fbbf24' : '#34d399',
      });
    }

    // Ripple wave
    this.hitRipples.push({
      x: diff.x,
      y: diff.y,
      radius: diff.radius,
      maxRadius: diff.radius + 38,
      life: 0.6,
      maxLife: 0.6,
    });

    // Floating score popup
    let text = `+${scoreAmount}`;
    if (comboMultiplier > 1) {
      text += ` (x${comboMultiplier} COMBO!)`;
    }
    this.floatingTexts.push({
      x: diff.x,
      y: diff.y - 15,
      text,
      color: '#34d399',
      life: 1.2,
      maxLife: 1.2,
      vy: -35,
    });
  }

  triggerError(panelX, panelY) {
    // Screen shake trigger
    this.shakeIntensity = 8.5;

    // Error X marker
    this.errorMarkers.push({
      x: panelX,
      y: panelY,
      life: 0.75,
      maxLife: 0.75,
    });

    // Penalty floating text
    this.floatingTexts.push({
      x: panelX,
      y: panelY - 10,
      text: '-5 SECONDS',
      color: '#ef4444',
      life: 1.0,
      maxLife: 1.0,
      vy: -40,
    });
  }

  update(dt) {
    // Update screen shake
    if (this.shakeIntensity > 0) {
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 25);
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt; // gravity
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update ripples
    for (let i = this.hitRipples.length - 1; i >= 0; i--) {
      const r = this.hitRipples[i];
      r.life -= dt;
      if (r.life <= 0) {
        this.hitRipples.splice(i, 1);
      }
    }

    // Update error markers
    for (let i = this.errorMarkers.length - 1; i >= 0; i--) {
      const e = this.errorMarkers[i];
      e.life -= dt;
      if (e.life <= 0) {
        this.errorMarkers.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy * dt;
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  /**
   * Render permanent found markers and ghost outlines on a specific panel.
   */
  renderFoundMarkers(ctx, differences, isRightPanel) {
    for (const diff of differences) {
      if (!diff.found) continue;

      ctx.save();
      ctx.translate(diff.x, diff.y);

      // Outer glowing success ring
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, diff.radius + 6, 0, Math.PI * 2);
      ctx.stroke();

      // Soft emerald interior tint
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.beginPath();
      ctx.arc(0, 0, diff.radius + 6, 0, Math.PI * 2);
      ctx.fill();

      // Number badge
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(diff.radius + 6, -(diff.radius + 6), 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${diff.index + 1}`, diff.radius + 6, -(diff.radius + 6));

      ctx.restore();

      // Ghost outline: if mutation is disappearance, draw dashed ghost on the panel where it disappeared
      if (diff.mutationType === 'disappear' && isRightPanel) {
        Painter.ghostOutline(ctx, diff.x, diff.y, diff.radius + 4);
      }
    }
  }

  /**
   * Render dynamic animations (ripples, particles, error markers) on a panel.
   */
  renderPanelOverlays(ctx) {
    // Ripples
    for (const r of this.hitRipples) {
      const progress = 1 - r.life / r.maxLife;
      const currentRadius = r.radius + (r.maxRadius - r.radius) * progress;
      const alpha = (1 - progress) * 0.8;

      ctx.save();
      ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Error Red X markers
    for (const e of this.errorMarkers) {
      const progress = 1 - e.life / e.maxLife;
      const alpha = (1 - progress);
      const size = 18 + progress * 6;

      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-size, -size);
      ctx.lineTo(size, size);
      ctx.moveTo(size, -size);
      ctx.lineTo(-size, size);
      ctx.stroke();

      // Expanding red halo ring
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // Floating text
    for (const t of this.floatingTexts) {
      const alpha = Math.max(0, t.life / t.maxLife);
      ctx.save();
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillStyle = t.color;
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }

  /**
   * Render hint pulsing focus ring pointing to an unfound difference.
   */
  renderActiveHint(ctx, hint) {
    if (!hint) return;

    const pulse = (Math.sin(Date.now() / 150) + 1) * 0.5; // 0 to 1
    const r = hint.radius + 18 + pulse * 14;

    ctx.save();
    ctx.translate(hint.x, hint.y);

    // Glowing golden target ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 4 cardinal target cross-hairs
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r - 8);
    ctx.lineTo(0, -r + 4);
    ctx.moveTo(0, r - 4);
    ctx.lineTo(0, r + 8);
    ctx.moveTo(-r - 8, 0);
    ctx.lineTo(-r + 4, 0);
    ctx.moveTo(r - 4, 0);
    ctx.lineTo(r + 8, 0);
    ctx.stroke();

    ctx.restore();
  }
}
