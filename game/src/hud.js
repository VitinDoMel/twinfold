// game/src/hud.js
// Top status bar HUD: scene title, found pips, time bar, score, combo, hints, and controls.

import { UI_COLORS } from './palette.js';
import { PANELS } from './config.js';

export class HUD {
  static render(ctx, levelState, audioMuted = false, isPaused = false) {
    const c = UI_COLORS;
    ctx.save();

    // Top HUD Bar Container Background
    ctx.fillStyle = c.hudBg;
    ctx.fillRect(0, 0, 1280, 72);
    ctx.strokeStyle = c.hudBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 72);
    ctx.lineTo(1280, 72);
    ctx.stroke();

    // --- LEFT SECTION: Level Title & Subtitle Badge ---
    ctx.save();
    ctx.translate(36, 16);

    // Level number badge
    ctx.fillStyle = c.accentAmber;
    ctx.beginPath();
    ctx.roundRect(0, 3, 72, 22, 6);
    ctx.fill();

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`STAGE ${levelState.levelIndex + 1}`, 36, 14);

    // Scene Name & Subtitle
    ctx.textAlign = 'left';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillStyle = c.textPrimary;
    ctx.fillText(levelState.name.toUpperCase(), 84, 16);

    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText(levelState.subtitle || 'Twinfold Spot the Difference', 84, 34);

    ctx.restore();

    // --- MID-LEFT: Found Counter & Pips ---
    // "Found 2/5 · 3 left"
    ctx.save();
    ctx.translate(330, 16);

    const found = levelState.foundCount;
    const total = levelState.differences.length;
    const remaining = total - found;

    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = c.textPrimary;
    ctx.textAlign = 'left';
    ctx.fillText(`Found ${found}/${total} · ${remaining} left`, 0, 16);

    // Pips row
    const pipSpacing = 16;
    for (let i = 0; i < total; i++) {
      const isFound = i < found;
      const px = i * pipSpacing + 6;
      const py = 30;

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      if (isFound) {
        ctx.fillStyle = c.pipActive;
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = c.pipEmpty;
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    ctx.restore();

    // --- CENTER: Time Bar & Countdown ---
    ctx.save();
    ctx.translate(535, 16);

    const timeRatio = Math.max(0, Math.min(1, levelState.timeLeft / levelState.timeTotal));
    const isCritical = levelState.timeLeft < 15;
    const isWarning = levelState.timeLeft < 35;

    // Time bar color
    let barColor = c.timerGreen;
    if (isCritical) barColor = c.timerRed;
    else if (isWarning) barColor = c.timerAmber;

    // Digital Timer text (e.g. 01:24)
    const minutes = Math.floor(Math.max(0, levelState.timeLeft) / 60);
    const seconds = Math.floor(Math.max(0, levelState.timeLeft) % 60);
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = isCritical ? '#f87171' : c.textPrimary;
    ctx.textAlign = 'left';
    ctx.fillText(`TIME: ${timeFormatted}`, 0, 16);

    // Progress bar frame
    const barW = 190;
    const barH = 12;
    const barX = 0;
    const barY = 24;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 6);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner progress fill
    const fillW = Math.max(0, barW * timeRatio);
    if (fillW > 0) {
      if (isCritical) {
        const pulse = (Math.sin(Date.now() / 120) + 1) * 0.5;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
        ctx.shadowBlur = 6 + pulse * 6;
      }
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, 5);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // --- RIGHT SECTION: Score, Combo, Hint Pill, Sound Pill, Pause Pill ---
    ctx.save();
    ctx.translate(760, 14);

    // Score display with en-US locale (e.g. 3,450)
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = c.textPrimary;
    ctx.fillText(`SCORE: ${levelState.score.toLocaleString('en-US')}`, 0, 16);

    // Combo multiplier indicator
    if (levelState.combo > 1) {
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = c.accentGoldLight;
      ctx.fillText(`x${levelState.combo} COMBO!`, 0, 32);
    } else {
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = c.textMuted;
      ctx.fillText('STREAK: 1x', 0, 32);
    }

    // Hint Button Pill [H]
    const hintCharges = levelState.hintsRemaining;
    const hintX = 145;
    ctx.fillStyle = hintCharges > 0 ? '#1e293b' : '#111827';
    ctx.strokeStyle = hintCharges > 0 ? c.accentGold : '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(hintX, 6, 115, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = hintCharges > 0 ? c.accentGoldLight : c.textMuted;
    ctx.fillText(`HINT [H] (${hintCharges})`, hintX + 57, 26);

    // Sound Toggle Button Pill [M]
    const soundX = 275;
    ctx.fillStyle = audioMuted ? '#450a0a' : '#1e293b';
    ctx.strokeStyle = audioMuted ? '#ef4444' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(soundX, 6, 95, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = audioMuted ? '#f87171' : c.textSecondary;
    ctx.fillText(audioMuted ? '[M] MUTED' : '[M] SOUND', soundX + 47, 26);

    // Pause Toggle Button Pill [P]
    const pauseX = 380;
    ctx.fillStyle = isPaused ? '#451a03' : '#1e293b';
    ctx.strokeStyle = isPaused ? c.accentGold : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pauseX, 6, 95, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPaused ? c.accentGoldLight : c.textSecondary;
    ctx.fillText(isPaused ? '[P] RESUME' : '[P] PAUSE', pauseX + 47, 26);

    ctx.restore();

    ctx.restore();
  }

  /**
   * Render wooden/brass aesthetic frames around Left & Right panels.
   */
  static renderPanelFrames(ctx) {
    const panels = [PANELS.left, PANELS.right];

    for (const p of panels) {
      ctx.save();
      // Outer drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;

      // Outer bezel border
      ctx.strokeStyle = '#2b3342';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 10);
      ctx.stroke();

      // Corner aesthetic brass brackets
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      const bl = 16;

      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(p.x + 4, p.y + 4 + bl);
      ctx.lineTo(p.x + 4, p.y + 4);
      ctx.lineTo(p.x + 4 + bl, p.y + 4);
      ctx.stroke();

      // Top-Right corner
      ctx.beginPath();
      ctx.moveTo(p.x + p.width - 4 - bl, p.y + 4);
      ctx.lineTo(p.x + p.width - 4, p.y + 4);
      ctx.lineTo(p.x + p.width - 4, p.y + 4 + bl);
      ctx.stroke();

      // Bottom-Left corner
      ctx.beginPath();
      ctx.moveTo(p.x + 4, p.y + p.height - 4 - bl);
      ctx.lineTo(p.x + 4, p.y + p.height - 4);
      ctx.lineTo(p.x + 4 + bl, p.y + p.height - 4);
      ctx.stroke();

      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(p.x + p.width - 4 - bl, p.y + p.height - 4);
      ctx.lineTo(p.x + p.width - 4, p.y + p.height - 4);
      ctx.lineTo(p.x + p.width - 4, p.y + p.height - 4 - bl);
      ctx.stroke();

      ctx.restore();
    }
  }

  /**
   * Crosshair cursor for keyboard or mouse navigation.
   */
  static renderCrosshair(ctx, x, y, isKeyboardDriven = false) {
    if (x < 0 || y < 0) return;

    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = isKeyboardDriven ? '#38bdf8' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;

    // Reticle circle
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Cross pips
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-4, 0);
    ctx.moveTo(4, 0);
    ctx.lineTo(16, 0);
    ctx.moveTo(0, -16);
    ctx.lineTo(0, -4);
    ctx.moveTo(0, 4);
    ctx.lineTo(0, 16);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
