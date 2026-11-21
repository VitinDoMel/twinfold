// Dedicated Top HUD Engine: Zero Overlap Layout, Pips, Color-coded Time Bar & Score

import { Painter } from './painter.js';
import { VIEW } from './config.js';
import { PALETTE } from './palette.js';

export class HudRenderer {
  /**
   * Renders the top HUD bar
   * @param {CanvasRenderingContext2D} ctx 
   * @param {import('./level.js').LevelState} level 
   * @param {number} timeElapsed 
   * @param {boolean} isMuted 
   */
  static render(ctx, level, timeElapsed = 0, isMuted = false) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEADER_HEIGHT;

    // 1. Header Background & bottom border
    const headerGrad = Painter.linearGradient(ctx, 0, 0, 0, H, [
      [0.0, '#161a24'],
      [1.0, '#0c0f16'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H, 0, headerGrad);
    Painter.line(ctx, 0, H, W, H, '#232a38', 1.5);

    // -------------------------------------------------------------
    // COLUMN 1: TITLE & LEVEL INFO (Left: x = 34 to 260)
    // -------------------------------------------------------------
    Painter.text(ctx, 'TWINFOLD', 34, 27, {
      font: 'bold 20px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'left',
    });
    Painter.text(ctx, `${level.levelDef.title.toUpperCase()} · LVL ${level.levelDef.id}`, 34, 51, {
      font: '600 12px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'left',
    });

    // -------------------------------------------------------------
    // COLUMN 2: PROGRESS & PIPS (Center-Left: x = 300 to 580)
    // -------------------------------------------------------------
    const total = level.differences.length;
    const found = level.foundIds.size;
    const left = total - found;
    const col2CenterX = 440;

    Painter.text(ctx, `Found ${found}/${total}  ·  ${left} left`, col2CenterX, 26, {
      font: 'bold 16px system-ui, sans-serif',
      color: '#f8fafc',
      align: 'center',
    });

    // Pips centered cleanly below the text without any overlap
    const pipSpacing = 18;
    const pipsStartX = col2CenterX - ((total - 1) * pipSpacing) / 2;
    const pipY = 50;

    for (let i = 0; i < total; i++) {
      const px = pipsStartX + i * pipSpacing;
      const isFound = i < found;
      if (isFound) {
        // Glowing green found pip
        Painter.circle(ctx, px, pipY, 6, '#48bb78', '#166534', 1.5);
        Painter.circle(ctx, px, pipY, 2.5, '#ffffff');
      } else {
        // Hollow muted pip
        Painter.circle(ctx, px, pipY, 5, '#1e293b', '#475569', 1.5);
      }
    }

    // -------------------------------------------------------------
    // COLUMN 3: TIME & PROGRESS BAR (Center-Right: x = 620 to 920)
    // -------------------------------------------------------------
    const timeLimit = level.timeLimit;
    const timeRemaining = Math.max(0, level.timeRemaining);
    const timeRatio = timeRemaining / timeLimit;

    const barX = 640;
    const barW = 240;
    const barH = 10;
    const barY = 46;

    // Time Label & Digital readout
    const isCritical = timeRemaining <= 15;
    let clockColor = '#f8fafc';
    let barColor = PALETTE.ui.greenBright;

    if (isCritical) {
      const flash = (Math.sin(timeElapsed * 10) + 1) * 0.5;
      clockColor = flash > 0.4 ? '#ef4444' : '#ffffff';
      barColor = flash > 0.4 ? '#ef4444' : '#b91c1c';
    } else if (timeRatio < 0.3) {
      clockColor = '#f59e0b';
      barColor = '#f59e0b';
    } else if (timeRatio < 0.6) {
      clockColor = '#fbbf24';
      barColor = '#eab308';
    }

    Painter.text(ctx, 'TIME REMAINING', barX, 26, {
      font: '600 12px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'left',
    });

    Painter.text(ctx, level.getTimeString(), barX + barW, 26, {
      font: 'bold 18px system-ui, sans-serif',
      color: clockColor,
      align: 'right',
    });

    // Time Bar container
    Painter.roundedRect(ctx, barX, barY, barW, barH, 4, '#1e293b', '#334155', 1);

    // Active Time Bar fill
    const activeBarW = Math.max(0, barW * timeRatio);
    if (activeBarW > 0) {
      Painter.roundedRect(ctx, barX, barY, activeBarW, barH, 4, barColor);
    }

    // -------------------------------------------------------------
    // COLUMN 4: SCORE, COMBO & HINT (Right: x = 940 to 1246)
    // -------------------------------------------------------------
    const scoreX = 960;
    Painter.text(ctx, `SCORE: ${level.score}`, scoreX, 26, {
      font: 'bold 16px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'left',
    });

    if (level.combo > 1) {
      Painter.roundedRect(ctx, scoreX, 42, 86, 18, 4, '#14532d', '#22c55e', 1);
      Painter.text(ctx, `COMBO x${level.combo}!`, scoreX + 43, 51, {
        font: 'bold 11px system-ui, sans-serif',
        color: '#4ade80',
        align: 'center',
      });
    }

    // Mute toggle indicator button
    const muteBtnX = 1085;
    const muteBtnY = 20;
    Painter.roundedRect(ctx, muteBtnX, muteBtnY, 36, 36, 6, isMuted ? '#331e24' : '#1e293b', '#475569', 1.2);
    Painter.text(ctx, isMuted ? '🔇' : '🔊', muteBtnX + 18, muteBtnY + 18, {
      font: '14px system-ui, sans-serif',
      color: '#ffffff',
      align: 'center',
    });

    // Hint Button
    const hintBtnX = 1135;
    const hintBtnY = 18;
    const hintBtnW = 112;
    const hintBtnH = 38;
    const hasHints = level.hintCharges > 0;

    Painter.roundedRect(
      ctx,
      hintBtnX,
      hintBtnY,
      hintBtnW,
      hintBtnH,
      6,
      hasHints ? '#243044' : '#171c26',
      hasHints ? '#ecc94b' : '#334155',
      1.5
    );

    Painter.text(ctx, `HINT (${level.hintCharges})`, hintBtnX + hintBtnW / 2, hintBtnY + 13, {
      font: 'bold 13px system-ui, sans-serif',
      color: hasHints ? '#ecc94b' : '#64748b',
      align: 'center',
    });

    Painter.text(ctx, 'Press [H]', hintBtnX + hintBtnW / 2, hintBtnY + 27, {
      font: '10px system-ui, sans-serif',
      color: hasHints ? '#cbd5e0' : '#475569',
      align: 'center',
    });
  }
}
