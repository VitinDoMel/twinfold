// Main Entry Point & Core Game Loop for Twinfold

import { VIEW, LEVELS } from './config.js';
import { LevelState } from './level.js';
import { HarborScene } from './scenes/harbor.js';
import { Painter } from './painter.js';
import { PALETTE, hexToRgba, lerpColor } from './palette.js';

class TwinfoldGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.currentLevelIndex = 0;
    this.scene = new HarborScene();
    this.level = new LevelState(LEVELS[0], 1);

    // Visual feedback animations
    this.feedbackEffects = []; // Array of { type, x, y, duration, elapsed, color, ... }
    this.lastTime = performance.now();
    this.timeElapsed = 0;

    this.setupEvents();
    this.startLoop();
  }

  setupEvents() {
    // Mouse and touch input
    const handlePointerDown = (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const screenX = (clientX - rect.left) * scaleX;
      const screenY = (clientY - rect.top) * scaleY;

      this.onScreenClick(screenX, screenY);
    };

    this.canvas.addEventListener('mousedown', handlePointerDown);
    this.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'h') {
        this.triggerHint();
      } else if (key === 'r') {
        this.restartLevel();
      } else if (key === 'enter' || key === ' ') {
        if (this.level.status === 'cleared' || this.level.status === 'failed') {
          this.restartLevel();
        }
      }
    });

    // Handle window resize cleanly
    window.addEventListener('resize', () => {
      // The CSS aspect-ratio handles containment, canvas buffer stays 1280x720
    });
  }

  triggerHint() {
    const hintDiff = this.level.useHint();
    if (hintDiff) {
      // Spawn audio/visual trigger for hint
      this.addFeedbackEffect({
        type: 'hint_activate',
        duration: 0.8,
        elapsed: 0,
      });
    }
  }

  restartLevel() {
    this.level = new LevelState(LEVELS[this.currentLevelIndex], 1);
    this.feedbackEffects = [];
  }

  onScreenClick(screenX, screenY) {
    // Check if clicked Hint button in HUD
    const hintBtnX = VIEW.WIDTH - 150;
    const hintBtnY = 22;
    const hintBtnW = 120;
    const hintBtnH = 38;
    if (
      screenX >= hintBtnX &&
      screenX <= hintBtnX + hintBtnW &&
      screenY >= hintBtnY &&
      screenY <= hintBtnY + hintBtnH
    ) {
      this.triggerHint();
      return;
    }

    // If level is completed or failed, click resets
    if (this.level.status === 'cleared' || this.level.status === 'failed') {
      this.restartLevel();
      return;
    }

    const result = this.level.handleClick(screenX, screenY);
    if (!result.handled) return;

    if (result.hit) {
      // SUCCESS HIT: Trigger visual feedback on BOTH panels
      const leftPos = result.screenPositions.left;
      const rightPos = result.screenPositions.right;

      this.addFeedbackEffect({
        type: 'hit_ring',
        x1: leftPos.x,
        y1: leftPos.y,
        x2: rightPos.x,
        y2: rightPos.y,
        radius: result.difference.radius || VIEW.HIT_RADIUS,
        duration: 0.75,
        elapsed: 0,
      });

      this.addFeedbackEffect({
        type: 'floating_text',
        x: screenX,
        y: screenY - 10,
        text: `+${result.points}`,
        color: '#48bb78',
        duration: 1.0,
        elapsed: 0,
      });
    } else {
      // MISS PENALTY
      this.addFeedbackEffect({
        type: 'miss_cross',
        x: screenX,
        y: screenY,
        duration: 0.85,
        elapsed: 0,
      });

      this.addFeedbackEffect({
        type: 'floating_text',
        x: screenX,
        y: screenY - 10,
        text: `-${VIEW.MISS_PENALTY_SEC}s`,
        color: '#e53e3e',
        duration: 1.0,
        elapsed: 0,
      });
    }
  }

  addFeedbackEffect(effect) {
    this.feedbackEffects.push(effect);
  }

  update(dt) {
    this.timeElapsed += dt;
    this.level.update(dt);

    // Update active feedback animations
    for (let i = this.feedbackEffects.length - 1; i >= 0; i--) {
      const eff = this.feedbackEffects[i];
      eff.elapsed += dt;
      if (eff.elapsed >= eff.duration) {
        this.feedbackEffects.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    // 1. Clear background
    ctx.fillStyle = PALETTE.ui.bgDark;
    ctx.fillRect(0, 0, W, H);

    // 2. Render Header HUD
    this.renderHeader(ctx);

    // 3. Render Left Panel (Original)
    this.renderPanel(ctx, 'left');

    // 4. Render Center Divider
    Painter.line(ctx, VIEW.DIVIDER_X, VIEW.PANEL_Y - 4, VIEW.DIVIDER_X, VIEW.PANEL_Y + VIEW.PANEL_H + 4, '#1f242e', 2);

    // 5. Render Right Panel (Mutation)
    this.renderPanel(ctx, 'right');

    // 6. Render Dual Found Markers on both panels
    this.renderFoundMarkers(ctx);

    // 7. Render Active Hint Rings
    this.renderActiveHint(ctx);

    // 8. Render Visual Feedback Effects (Hit rings, Miss X, floating scores)
    this.renderFeedbackEffects(ctx);

    // 9. Render Screen Overlays (Cleared / Failed)
    if (this.level.status === 'cleared') {
      this.renderClearedOverlay(ctx);
    } else if (this.level.status === 'failed') {
      this.renderFailedOverlay(ctx);
    }
  }

  renderHeader(ctx) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEADER_HEIGHT;

    // Header container gradient
    const headerGrad = Painter.linearGradient(ctx, 0, 0, 0, H, [
      [0.0, '#161a23'],
      [1.0, '#0f1219'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H, 0, headerGrad);
    Painter.line(ctx, 0, H, W, H, '#252c3b', 1.5);

    // Left Title Block
    Painter.text(ctx, 'TWINFOLD', 34, 28, {
      font: 'bold 20px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'left',
    });
    Painter.text(ctx, `${this.level.levelDef.title.toUpperCase()} · LEVEL 1`, 34, 52, {
      font: '600 13px system-ui, sans-serif',
      color: '#a0aec0',
      align: 'left',
    });

    // Center Progress: "Found X/N · Y left"
    const total = this.level.differences.length;
    const found = this.level.foundIds.size;
    const left = total - found;
    const centerX = VIEW.DIVIDER_X;

    Painter.text(ctx, `Found ${found}/${total} · ${left} left`, centerX, 26, {
      font: 'bold 18px system-ui, sans-serif',
      color: '#f7fafc',
      align: 'center',
    });

    // Pips indicators
    const pipSpacing = 20;
    const pipsStartX = centerX - ((total - 1) * pipSpacing) / 2;
    for (let i = 0; i < total; i++) {
      const px = pipsStartX + i * pipSpacing;
      const py = 48;
      const isFound = i < found;
      if (isFound) {
        Painter.circle(ctx, px, py, 6, '#48bb78', '#22543d', 1.5);
        Painter.circle(ctx, px, py, 2.5, '#ffffff');
      } else {
        Painter.circle(ctx, px, py, 5, '#1a202c', '#4a5568', 1.5);
      }
    }

    // Time bar & Countdown (between pips and right HUD)
    const timeRatio = Math.max(0, this.level.timeRemaining / this.level.timeLimit);
    const barW = 210;
    const barH = 10;
    const barX = 740;
    const barY = 46;

    // Time Bar Background
    Painter.roundedRect(ctx, barX, barY, barW, barH, 4, '#1a202c', '#2d3748', 1);

    // Time Bar Color (Green -> Amber -> Red)
    let barColor = PALETTE.ui.greenBright;
    if (timeRatio < 0.25) {
      // Pulse red if under 25%
      const pulse = (Math.sin(this.timeElapsed * 8) + 1) * 0.5;
      barColor = pulse > 0.5 ? PALETTE.ui.red : '#ff7878';
    } else if (timeRatio < 0.55) {
      barColor = PALETTE.ui.amber;
    }
    const currentBarW = Math.max(0, barW * timeRatio);
    if (currentBarW > 0) {
      Painter.roundedRect(ctx, barX, barY, currentBarW, barH, 4, barColor);
    }

    // Time digits
    Painter.text(ctx, this.level.getTimeString(), barX - 10, barY + barH / 2, {
      font: 'bold 16px system-ui, sans-serif',
      color: timeRatio < 0.25 ? PALETTE.ui.red : '#f7fafc',
      align: 'right',
    });

    // Score & Combo
    Painter.text(ctx, `SCORE: ${this.level.score}`, 980, 26, {
      font: 'bold 15px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'left',
    });
    if (this.level.combo > 1) {
      Painter.text(ctx, `COMBO x${this.level.combo}!`, 980, 48, {
        font: 'bold 13px system-ui, sans-serif',
        color: '#e2e8f0',
        align: 'left',
      });
    }

    // Hint Button
    const hintBtnX = VIEW.WIDTH - 150;
    const hintBtnY = 18;
    const hintBtnW = 116;
    const hintBtnH = 38;
    const hasHints = this.level.hintCharges > 0;

    Painter.roundedRect(
      ctx,
      hintBtnX,
      hintBtnY,
      hintBtnW,
      hintBtnH,
      6,
      hasHints ? '#2b3648' : '#1a202c',
      hasHints ? '#ecc94b' : '#4a5568',
      1.5
    );
    Painter.text(ctx, `HINT (${this.level.hintCharges})`, hintBtnX + hintBtnW / 2, hintBtnY + 14, {
      font: 'bold 13px system-ui, sans-serif',
      color: hasHints ? '#ecc94b' : '#718096',
      align: 'center',
    });
    Painter.text(ctx, 'Press [H]', hintBtnX + hintBtnW / 2, hintBtnY + 28, {
      font: '10px system-ui, sans-serif',
      color: hasHints ? '#cbd5e0' : '#4a5568',
      align: 'center',
    });
  }

  renderPanel(ctx, side) {
    const isLeft = side === 'left';
    const panelX = isLeft ? VIEW.PANEL_LEFT_X : VIEW.PANEL_RIGHT_X;
    const panelY = VIEW.PANEL_Y;
    const panelW = VIEW.PANEL_W;
    const panelH = VIEW.PANEL_H;

    // Panel border frame and shadow
    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.65)', 16, 0, 8, () => {
      Painter.roundedRect(ctx, panelX - 2, panelY - 2, panelW + 4, panelH + 4, 8, '#161b24', '#2d3748', 2);
    });

    // Render Scene contents into panel coordinate space
    ctx.save();
    ctx.translate(panelX, panelY);
    this.scene.render(ctx, side, this.level.activeMutations, this.timeElapsed);
    ctx.restore();

    // Subtle label above panel
    Painter.text(ctx, isLeft ? 'LEFT VIEW' : 'RIGHT VIEW', panelX + 16, panelY - 14, {
      font: 'bold 12px system-ui, sans-serif',
      color: '#718096',
      align: 'left',
    });
  }

  renderFoundMarkers(ctx) {
    // Render persistent green found rings on both panels
    for (const diff of this.level.differences) {
      if (!this.level.foundIds.has(diff.id)) continue;

      const lx = VIEW.PANEL_LEFT_X + diff.x;
      const rx = VIEW.PANEL_RIGHT_X + diff.x;
      const y = VIEW.PANEL_Y + diff.y;
      const r = diff.radius || VIEW.HIT_RADIUS;

      // Glow behind ring
      Painter.circle(ctx, lx, y, r + 4, null, 'rgba(72, 187, 120, 0.45)', 6);
      Painter.circle(ctx, rx, y, r + 4, null, 'rgba(72, 187, 120, 0.45)', 6);

      // Sharp marker ring
      Painter.circle(ctx, lx, y, r, null, '#48bb78', 2.8);
      Painter.circle(ctx, rx, y, r, null, '#48bb78', 2.8);

      // Center crosshair pip
      Painter.circle(ctx, lx, y, 3, '#ffffff');
      Painter.circle(ctx, rx, y, 3, '#ffffff');
    }
  }

  renderActiveHint(ctx) {
    if (!this.level.activeHint) return;

    const { diff, elapsed } = this.level.activeHint;
    const lx = VIEW.PANEL_LEFT_X + diff.x;
    const rx = VIEW.PANEL_RIGHT_X + diff.x;
    const y = VIEW.PANEL_Y + diff.y;
    const baseR = diff.radius || VIEW.HIT_RADIUS;

    // Shrinking / pulsing golden beacon ring
    const pulse = (Math.sin(elapsed * 6) + 1) * 0.5;
    const ringR = baseR + 8 + pulse * 14;

    const glowColor = 'rgba(236, 201, 75, 0.8)';
    Painter.circle(ctx, lx, y, ringR, null, glowColor, 3);
    Painter.circle(ctx, rx, y, ringR, null, glowColor, 3);

    // Inner target pip
    Painter.circle(ctx, lx, y, 4, '#ecc94b');
    Painter.circle(ctx, rx, y, 4, '#ecc94b');
  }

  renderFeedbackEffects(ctx) {
    for (const eff of this.feedbackEffects) {
      const progress = eff.elapsed / eff.duration;
      const alpha = 1.0 - progress;

      if (eff.type === 'hit_ring') {
        const r = eff.radius + progress * 28;
        const color = hexToRgba('#48bb78', alpha * 0.9);
        Painter.circle(ctx, eff.x1, eff.y1, r, null, color, 3);
        Painter.circle(ctx, eff.x2, eff.y2, r, null, color, 3);
      } else if (eff.type === 'miss_cross') {
        const size = 12 + progress * 6;
        const color = hexToRgba('#e53e3e', alpha);
        Painter.line(ctx, eff.x - size, eff.y - size, eff.x + size, eff.y + size, color, 3);
        Painter.line(ctx, eff.x + size, eff.y - size, eff.x - size, eff.y + size, color, 3);
      } else if (eff.type === 'floating_text') {
        const y = eff.y - progress * 24;
        Painter.text(ctx, eff.text, eff.x, y, {
          font: 'bold 18px system-ui, sans-serif',
          color: hexToRgba(eff.color, alpha),
          align: 'center',
          shadow: { color: 'rgba(0,0,0,0.85)', blur: 4, x: 0, y: 1 },
        });
      }
    }
  }

  renderClearedOverlay(ctx) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    // Modal backdrop
    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(10, 14, 23, 0.82)');

    const boxW = 500;
    const boxH = 320;
    const boxX = (W - boxW) / 2;
    const boxY = (H - boxH) / 2;

    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.9)', 30, 0, 10, () => {
      Painter.roundedRect(ctx, boxX, boxY, boxW, boxH, 12, '#161c28', '#38a169', 2.5);
    });

    Painter.text(ctx, 'LEVEL CLEARED!', W / 2, boxY + 54, {
      font: 'bold 32px system-ui, sans-serif',
      color: '#48bb78',
      align: 'center',
      shadow: { color: 'rgba(72, 187, 120, 0.4)', blur: 12, x: 0, y: 2 },
    });

    Painter.text(ctx, `${this.level.levelDef.title}`, W / 2, boxY + 92, {
      font: '600 18px system-ui, sans-serif',
      color: '#e2e8f0',
      align: 'center',
    });

    // Stars earned
    const stars = this.level.getStarsEarned();
    const starStartX = W / 2 - 40;
    for (let s = 0; s < 3; s++) {
      const sx = starStartX + s * 40;
      const sy = boxY + 140;
      Painter.star(ctx, sx, sy, 5, 16, 8, s < stars ? '#ecc94b' : '#2d3748');
    }

    Painter.text(ctx, `Final Score: ${this.level.score}`, W / 2, boxY + 195, {
      font: 'bold 22px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
    });

    Painter.text(ctx, `Time Remaining: ${this.level.getTimeString()} · Mistakes: ${this.level.mistakes}`, W / 2, boxY + 230, {
      font: '14px system-ui, sans-serif',
      color: '#a0aec0',
      align: 'center',
    });

    // Prompt
    const pulse = (Math.sin(this.timeElapsed * 6) + 1) * 0.5;
    const promptColor = pulse > 0.4 ? '#ffffff' : '#718096';
    Painter.text(ctx, 'Click or Press [Enter] to Play Again', W / 2, boxY + 276, {
      font: 'bold 15px system-ui, sans-serif',
      color: promptColor,
      align: 'center',
    });
  }

  renderFailedOverlay(ctx) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(15, 10, 12, 0.85)');

    const boxW = 480;
    const boxH = 280;
    const boxX = (W - boxW) / 2;
    const boxY = (H - boxH) / 2;

    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.9)', 30, 0, 10, () => {
      Painter.roundedRect(ctx, boxX, boxY, boxW, boxH, 12, '#201618', '#e53e3e', 2.5);
    });

    Painter.text(ctx, 'TIME EXPIRED!', W / 2, boxY + 58, {
      font: 'bold 32px system-ui, sans-serif',
      color: '#e53e3e',
      align: 'center',
      shadow: { color: 'rgba(229, 62, 62, 0.45)', blur: 12, x: 0, y: 2 },
    });

    const found = this.level.foundIds.size;
    const total = this.level.differences.length;
    Painter.text(ctx, `You found ${found} of ${total} differences.`, W / 2, boxY + 110, {
      font: '18px system-ui, sans-serif',
      color: '#e2e8f0',
      align: 'center',
    });

    Painter.text(ctx, `Score: ${this.level.score}`, W / 2, boxY + 155, {
      font: 'bold 20px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
    });

    Painter.text(ctx, 'Click or Press [R] to Try Again', W / 2, boxY + 225, {
      font: 'bold 16px system-ui, sans-serif',
      color: '#ffffff',
      align: 'center',
    });
  }

  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.update(dt);
      this.render();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Boot game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new TwinfoldGame();
});
