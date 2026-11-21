// game/src/screens.js
// Standalone screens: Title screen (with real scene vector thumbnails), Pause, Stage Clear, Game Over, and Grand Victory.

import { CANVAS_WIDTH, CANVAS_HEIGHT, LEVELS } from './config.js';
import { UI_COLORS } from './palette.js';
import { buildHarborScene } from './scenes/harbor.js';
import { buildBazaarScene } from './scenes/bazaar.js';
import { buildGreenhouseScene } from './scenes/greenhouse.js';
import { buildAtticScene } from './scenes/attic.js';
import { defaultRNG } from './rng.js';

export class ScreenManager {
  constructor() {
    // Cache procedural scenes for instant vector thumbnail rendering
    this.thumbnailScenes = [
      buildHarborScene(defaultRNG),
      buildBazaarScene(defaultRNG),
      buildGreenhouseScene(defaultRNG),
      buildAtticScene(defaultRNG),
    ];
  }

  /**
   * Title screen rendering with 4 real miniaturized scene vector cards.
   */
  renderTitle(ctx, selectedStageIndex = 0, stageRecords = []) {
    const c = UI_COLORS;
    ctx.save();

    // Deep atmospheric gradient backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#090b10');
    bgGrad.addColorStop(0.5, '#121620');
    bgGrad.addColorStop(1, '#080a0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle background grid glow
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // --- GAME HEADER ---
    ctx.textAlign = 'center';

    // Glowing title
    ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
    ctx.shadowBlur = 18;
    ctx.font = '900 48px system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('TWINFOLD', CANVAS_WIDTH / 2, 72);

    ctx.shadowBlur = 0;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = c.accentCyanLight;
    ctx.letterSpacing = '3px';
    ctx.fillText('A JOURNEY OF KEEN PERCEPTION', CANVAS_WIDTH / 2, 98);
    ctx.letterSpacing = '0px';

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = c.textMuted;
    ctx.fillText('Four Hand-Crafted Realms · Dual Procedural Panes · Subtle Optical Variations', CANVAS_WIDTH / 2, 120);

    // --- 4 STAGE SELECTION CARDS (WITH REAL VECTOR THUMBNAILS) ---
    const cardW = 270;
    const cardH = 370;
    const gap = 24;
    const totalW = 4 * cardW + 3 * gap;
    const startX = (CANVAS_WIDTH - totalW) / 2;
    const cardY = 150;

    for (let i = 0; i < LEVELS.length; i++) {
      const lvl = LEVELS[i];
      const cx = startX + i * (cardW + gap);
      const isSelected = i === selectedStageIndex;
      const sceneData = this.thumbnailScenes[i];
      const record = stageRecords[i] || { stars: 0, highScore: 0 };

      ctx.save();

      // Card outer shadow & glow
      if (isSelected) {
        ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        ctx.shadowBlur = 20;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
      }

      // Card body
      ctx.fillStyle = isSelected ? '#1c2230' : '#141822';
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 12);
      ctx.fill();

      // Card border
      ctx.strokeStyle = isSelected ? c.accentGold : '#283142';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Real Scene Vector Thumbnail
      const thumbW = cardW - 20;
      const thumbH = 200;
      const thumbX = cx + 10;
      const thumbY = cardY + 10;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 8);
      ctx.clip();

      // Render actual scene objects scaled down
      ctx.translate(thumbX, thumbY);
      ctx.scale(thumbW / 586, thumbH / 624);
      if (sceneData && sceneData.objects) {
        for (const obj of sceneData.objects) {
          obj.render(ctx);
        }
      }
      ctx.restore();

      // Thumbnail border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 8);
      ctx.stroke();

      // Stage Badge
      ctx.fillStyle = isSelected ? c.accentAmber : '#334155';
      ctx.beginPath();
      ctx.roundRect(cx + 14, cardY + 220, 68, 20, 5);
      ctx.fill();

      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`STAGE ${i + 1}`, cx + 48, cardY + 234);

      // Stars
      ctx.textAlign = 'right';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = record.stars > 0 ? '#fbbf24' : '#475569';
      const starText = '★'.repeat(record.stars) + '☆'.repeat(Math.max(0, 3 - record.stars));
      ctx.fillText(starText, cx + cardW - 14, cardY + 234);

      // Title & Subtitle
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillStyle = isSelected ? '#ffffff' : '#e2e8f0';
      ctx.fillText(lvl.name, cx + 14, cardY + 265);

      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = c.accentCyan;
      ctx.fillText(lvl.subtitle, cx + 14, cardY + 285);

      // Differences & Time limits
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = c.textSecondary;
      ctx.fillText(`🎯 ${lvl.differencesCount} Differences   ⏱️ ${lvl.timeLimit}s`, cx + 14, cardY + 312);

      // Play button prompt on selected card
      ctx.fillStyle = isSelected ? c.accentGold : '#1e293b';
      ctx.beginPath();
      ctx.roundRect(cx + 14, cardY + 328, cardW - 28, 28, 6);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = isSelected ? '#1e293b' : c.textMuted;
      ctx.fillText(isSelected ? 'PLAY STAGE [ENTER]' : 'CLICK TO SELECT', cx + cardW / 2, cardY + 346);

      ctx.restore();
    }

    // --- FOOTER CONTROLS INSTRUCTIONS ---
    ctx.textAlign = 'center';
    const pulse = (Math.sin(Date.now() / 180) + 1) * 0.5;

    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillStyle = `rgba(251, 191, 36, ${0.75 + pulse * 0.25})`;
    ctx.fillText('Press [ENTER] or [SPACE] to Begin Stage', CANVAS_WIDTH / 2, 575);

    // Keyboard & Mouse guide
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText('Mouse: Click Differences · Keyboard: Arrows / WASD move crosshair · Space: Spot', CANVAS_WIDTH / 2, 620);
    ctx.fillText('H: Hint (3 charges) · P: Pause · M: Mute Sound · 1-4: Select Stage Directly', CANVAS_WIDTH / 2, 644);

    ctx.restore();
  }

  /**
   * Pause overlay.
   */
  renderPause(ctx) {
    const c = UI_COLORS;
    ctx.save();
    ctx.fillStyle = 'rgba(11, 13, 19, 0.78)';
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    const cardW = 420;
    const cardH = 220;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2 + 20;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.98)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = c.accentGold;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('PAUSED', CANVAS_WIDTH / 2, cardY + 50);

    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText('Game is paused. Differences remain frozen.', CANVAS_WIDTH / 2, cardY + 90);

    ctx.fillStyle = c.accentGoldLight;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('Press [P] or Space to Resume', CANVAS_WIDTH / 2, cardY + 135);

    ctx.fillStyle = c.textMuted;
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('Press [Q] or [ESC] to Return to Title', CANVAS_WIDTH / 2, cardY + 175);

    ctx.restore();
  }

  /**
   * Level cleared overlay (with soft 35% darkening keeping scene visible).
   */
  renderLevelClear(ctx, levelState, nextStageAvailable = true) {
    const c = UI_COLORS;
    ctx.save();

    // Spec requirement: soft darkening ~35% keeping scene visible
    ctx.fillStyle = 'rgba(11, 13, 19, 0.35)';
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    const cardW = 500;
    const cardH = 340;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2 + 20;

    // Outer glow
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 24;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.96)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 14);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = c.success;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = c.successLight;
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('STAGE COMPLETED!', CANVAS_WIDTH / 2, cardY + 45);

    // Stars calculation
    const timeRatio = levelState.timeLeft / levelState.timeTotal;
    let stars = 1;
    if (timeRatio > 0.4 && levelState.mistakesCount <= 2) stars = 3;
    else if (timeRatio > 0.15 && levelState.mistakesCount <= 4) stars = 2;

    ctx.font = '36px system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    const starsStr = '★ '.repeat(stars) + '☆ '.repeat(3 - stars);
    ctx.fillText(starsStr.trim(), CANVAS_WIDTH / 2, cardY + 92);

    // Stats grid
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`Realm: ${levelState.name} (${levelState.subtitle})`, CANVAS_WIDTH / 2, cardY + 130);

    const secondsLeft = Math.floor(levelState.timeLeft);
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText(`All ${levelState.differences.length} differences spotted!`, CANVAS_WIDTH / 2, cardY + 158);
    ctx.fillText(`Time Remaining: ${secondsLeft}s  ·  Mistakes: ${levelState.mistakesCount}`, CANVAS_WIDTH / 2, cardY + 182);

    // Score box
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(cardX + 40, cardY + 205, cardW - 80, 48, 8);
    ctx.fill();

    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = c.accentGold;
    ctx.fillText(`Stage Score: ${levelState.score.toLocaleString('en-US')}`, CANVAS_WIDTH / 2, cardY + 236);

    // Navigation prompt
    const pulse = (Math.sin(Date.now() / 150) + 1) * 0.5;
    ctx.fillStyle = `rgba(16, 185, 129, ${0.8 + pulse * 0.2})`;
    ctx.font = 'bold 16px system-ui, sans-serif';
    if (nextStageAvailable) {
      ctx.fillText('Press [ENTER] or Click to Enter Next Realm', CANVAS_WIDTH / 2, cardY + 295);
    } else {
      ctx.fillText('Press [ENTER] to View Grand Victory!', CANVAS_WIDTH / 2, cardY + 295);
    }

    ctx.restore();
  }

  /**
   * Game Over screen on timeout.
   */
  renderGameOver(ctx, levelState) {
    const c = UI_COLORS;
    ctx.save();
    ctx.fillStyle = 'rgba(11, 13, 19, 0.65)';
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    const cardW = 460;
    const cardH = 260;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2 + 20;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.96)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = c.error;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = c.errorLight;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('TIME EXPIRED', CANVAS_WIDTH / 2, cardY + 48);

    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`Realm: ${levelState.name}`, CANVAS_WIDTH / 2, cardY + 95);

    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText(`Differences Found: ${levelState.foundCount} of ${levelState.differences.length}`, CANVAS_WIDTH / 2, cardY + 125);
    ctx.fillText(`Score Accumulated: ${levelState.score.toLocaleString('en-US')}`, CANVAS_WIDTH / 2, cardY + 150);

    const pulse = (Math.sin(Date.now() / 150) + 1) * 0.5;
    ctx.fillStyle = `rgba(245, 158, 11, ${0.8 + pulse * 0.2})`;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('Press [ENTER] or Click to Try Again', CANVAS_WIDTH / 2, cardY + 210);

    ctx.restore();
  }

  /**
   * Grand Victory Screen when all 4 levels are completed.
   */
  renderVictory(ctx, totalCampaignScore = 0, totalStars = 12) {
    const c = UI_COLORS;
    ctx.save();

    // Deep royal celebration backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#0c0a1a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#090812');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Glowing victory card
    const cardW = 620;
    const cardH = 440;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2;

    ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
    ctx.shadowBlur = 30;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.98)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = c.accentGold;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.textAlign = 'center';

    // Grand laurel / trophy
    ctx.font = '54px system-ui, sans-serif';
    ctx.fillText('🏆', CANVAS_WIDTH / 2, cardY + 65);

    ctx.font = '900 32px system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('GRAND MASTER DETECTIVE', CANVAS_WIDTH / 2, cardY + 115);

    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = c.accentCyanLight;
    ctx.fillText('All 31 Optical Differences Conquered Across 4 Realms!', CANVAS_WIDTH / 2, cardY + 145);

    // Stars banner
    ctx.font = '32px system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★', CANVAS_WIDTH / 2, cardY + 195);

    // Campaign summary stats
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(cardX + 40, cardY + 225, cardW - 80, 110, 10);
    ctx.fill();

    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = c.textSecondary;
    ctx.fillText('Lighthouse Harbor · Night Bazaar · Greenhouse Lab · Clockwork Attic', CANVAS_WIDTH / 2, cardY + 255);

    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`TOTAL SCORE: ${totalCampaignScore.toLocaleString('en-US')}`, CANVAS_WIDTH / 2, cardY + 295);

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = c.successLight;
    ctx.fillText('Master of Subtle Variations & Keen Perception', CANVAS_WIDTH / 2, cardY + 322);

    const pulse = (Math.sin(Date.now() / 150) + 1) * 0.5;
    ctx.fillStyle = `rgba(251, 191, 36, ${0.8 + pulse * 0.2})`;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('Press [ENTER] or Click to Return to Title', CANVAS_WIDTH / 2, cardY + 395);

    ctx.restore();
  }
}
