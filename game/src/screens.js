// Screen & Overlay Management: Title Screen, Level Clear, Game Over, Game Won & Pause

import { Painter } from './painter.js';
import { VIEW, LEVELS } from './config.js';
import { HarborScene } from './scenes/harbor.js';
import { BazaarScene } from './scenes/bazaar.js';
import { GreenhouseScene } from './scenes/greenhouse.js';
import { AtticScene } from './scenes/attic.js';

export class ScreenRenderer {
  /**
   * Title Screen with game logo, scene preview cards, and controls
   */
  static renderTitle(ctx, timeElapsed = 0) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    // Atmospheric deep background
    const bgGrad = Painter.linearGradient(ctx, 0, 0, 0, H, [
      [0.0, '#0a0d14'],
      [0.4, '#121722'],
      [1.0, '#080a10'],
    ]);
    Painter.roundedRect(ctx, 0, 0, W, H, 0, bgGrad);

    // Decorative background stars & subtle light beams
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137.5) % W);
      const sy = ((i * 83.2) % (H * 0.7));
      const spark = (Math.sin(timeElapsed * 2 + i) + 1) * 0.5;
      Painter.circle(ctx, sx, sy, 1 + spark * 1.5, 'rgba(254, 240, 138, 0.45)');
    }

    // Logo & Header
    Painter.text(ctx, 'TWINFOLD', W / 2, 90, {
      font: '900 64px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
      shadow: { color: 'rgba(236, 201, 75, 0.4)', blur: 24, x: 0, y: 4 },
    });

    Painter.text(ctx, 'A PROCEDURAL SPOT-THE-DIFFERENCE ODYSSEY', W / 2, 134, {
      font: '600 16px system-ui, sans-serif',
      color: '#cbd5e0',
      align: 'center',
    });

    // 4 Scene Preview Cards
    const cardW = 260;
    const cardH = 210;
    const gap = 20;
    const startX = (W - (cardW * 4 + gap * 3)) / 2;
    const cardY = 185;

    const scenesInfo = [
      { num: '01', title: 'Lighthouse Harbor', sub: 'Twilight Pier · 5 Diffs', tag: '#e07a5f' },
      { num: '02', title: 'Night Bazaar', sub: 'Silk Road Market · 7 Diffs', tag: '#d97706' },
      { num: '03', title: 'Greenhouse Lab', sub: 'Botanical Dome · 9 Diffs', tag: '#10b981' },
      { num: '04', title: 'Clockwork Attic', sub: 'Horologist Tower · 10 Diffs', tag: '#b45309' },
    ];

    scenesInfo.forEach((sc, i) => {
      const cx = startX + i * (cardW + gap);

      // Card frame
      Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.75)', 18, 0, 8, () => {
        Painter.roundedRect(ctx, cx, cardY, cardW, cardH, 10, '#151a24', '#273142', 2);
      });

      // Accent top banner
      Painter.roundedRect(ctx, cx, cardY, cardW, 6, 2, sc.tag);

      // Card number badge
      Painter.roundedRect(ctx, cx + 18, cardY + 22, 34, 20, 4, '#1e293b', '#334155', 1);
      Painter.text(ctx, sc.num, cx + 35, cardY + 32, {
        font: 'bold 11px system-ui, sans-serif',
        color: sc.tag,
        align: 'center',
      });

      // Scene Titles
      Painter.text(ctx, sc.title, cx + 18, cardY + 70, {
        font: 'bold 18px system-ui, sans-serif',
        color: '#f8fafc',
        align: 'left',
      });

      Painter.text(ctx, sc.sub, cx + 18, cardY + 95, {
        font: '13px system-ui, sans-serif',
        color: '#94a3b8',
        align: 'left',
      });

      // Real scaled scene miniature preview
      const thumbX = cx + 18;
      const thumbY = cardY + 118;
      const thumbW = cardW - 36;
      const thumbH = 74;

      ctx.save();
      ctx.beginPath();
      Painter.roundedRect(ctx, thumbX, thumbY, thumbW, thumbH, 6, '#0a0d14', '#334155', 1.5);
      ctx.clip();

      const previewScenes = [
        new HarborScene(),
        new BazaarScene(),
        new GreenhouseScene(),
        new AtticScene(),
      ];
      const scInstance = previewScenes[i];
      if (scInstance) {
        ctx.save();
        ctx.translate(thumbX, thumbY);
        const scaleX = thumbW / VIEW.PANEL_W;
        const scaleY = thumbH / VIEW.PANEL_H;
        ctx.scale(scaleX, scaleY);
        scInstance.render(ctx, 'left', new Map(), 0);
        ctx.restore();
      }

      // Glossy sheen and card border on top of miniature
      const gloss = Painter.linearGradient(ctx, thumbX, thumbY, thumbX, thumbY + thumbH, [
        [0.0, 'rgba(255, 255, 255, 0.12)'],
        [0.4, 'rgba(255, 255, 255, 0.0)'],
        [1.0, 'rgba(0, 0, 0, 0.35)'],
      ]);
      Painter.roundedRect(ctx, thumbX, thumbY, thumbW, thumbH, 6, gloss, '#334155', 1.2);
      ctx.restore();
    });

    // Control Banner (Bottom center)
    const ctrlY = 430;
    Painter.roundedRect(ctx, (W - 740) / 2, ctrlY, 740, 50, 8, '#131822', '#232c3d', 1);
    Painter.text(ctx, 'CONTROLS: [Mouse Click / WASD + Space] · [H: Hint] · [P: Pause] · [M: Mute] · [R: Restart]', W / 2, ctrlY + 25, {
      font: '600 13px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'center',
    });

    // Start Call to Action (Pulsing)
    const pulse = (Math.sin(timeElapsed * 5) + 1) * 0.5;
    const ctaY = 530;
    const ctaW = 340;
    const ctaH = 56;
    const ctaX = (W - ctaW) / 2;

    Painter.withShadow(ctx, 'rgba(236, 201, 75, 0.4)', 20, 0, 4, () => {
      Painter.roundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 28, '#ecc94b', '#f6ad55', 2);
    });

    Painter.text(ctx, 'START ADVENTURE', W / 2, ctaY + 28, {
      font: 'bold 20px system-ui, sans-serif',
      color: '#0f172a',
      align: 'center',
    });

    Painter.text(ctx, 'Press [Enter] or Click to Begin', W / 2, ctaY + 80, {
      font: 'bold 15px system-ui, sans-serif',
      color: pulse > 0.4 ? '#f8fafc' : '#64748b',
      align: 'center',
    });
  }

  /**
   * Level Cleared Screen
   */
  static renderLevelClear(ctx, level, totalScore, isCampaignLastLevel, timeElapsed = 0) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    // Dim backdrop (reduced darkening to 35% so underlying scene stays clearly visible)
    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(10, 14, 22, 0.35)');

    const boxW = 540;
    const boxH = 370;
    const boxX = (W - boxW) / 2;
    const boxY = (H - boxH) / 2;

    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.95)', 32, 0, 12, () => {
      Painter.roundedRect(ctx, boxX, boxY, boxW, boxH, 14, '#141a26', '#38a169', 2.5);
    });

    // Top Header Banner
    Painter.text(ctx, 'LEVEL COMPLETE!', W / 2, boxY + 50, {
      font: 'bold 34px system-ui, sans-serif',
      color: '#48bb78',
      align: 'center',
      shadow: { color: 'rgba(72, 187, 120, 0.5)', blur: 14, x: 0, y: 2 },
    });

    Painter.text(ctx, `${level.levelDef.title} (${level.levelDef.subtitle})`, W / 2, boxY + 88, {
      font: '600 16px system-ui, sans-serif',
      color: '#cbd5e0',
      align: 'center',
    });

    // 3 Golden Stars
    const stars = level.getStarsEarned();
    const starStartX = W / 2 - 45;
    for (let s = 0; s < 3; s++) {
      const sx = starStartX + s * 45;
      const sy = boxY + 140;
      Painter.star(ctx, sx, sy, 5, 18, 9, s < stars ? '#ecc94b' : '#1e293b');
    }

    // Stats Grid
    const statsY = boxY + 195;
    Painter.text(ctx, `Level Score: ${level.score}`, W / 2, statsY, {
      font: 'bold 22px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
    });

    Painter.text(ctx, `Time Left: ${level.getTimeString()}  ·  Mistakes: ${level.mistakes}`, W / 2, statsY + 32, {
      font: '15px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'center',
    });

    Painter.text(ctx, `Total Campaign Score: ${totalScore}`, W / 2, statsY + 62, {
      font: '600 16px system-ui, sans-serif',
      color: '#38bdf8',
      align: 'center',
    });

    // Prompt
    const pulse = (Math.sin(timeElapsed * 6) + 1) * 0.5;
    const promptText = isCampaignLastLevel
      ? 'Press [Enter] or Click to View Final Results'
      : 'Press [Enter] or Click for Next Level';

    Painter.text(ctx, promptText, W / 2, boxY + boxH - 32, {
      font: 'bold 16px system-ui, sans-serif',
      color: pulse > 0.4 ? '#ffffff' : '#64748b',
      align: 'center',
    });
  }

  /**
   * Game Over / Time Expired Screen
   */
  static renderGameOver(ctx, level, timeElapsed = 0) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(16, 10, 14, 0.88)');

    const boxW = 500;
    const boxH = 320;
    const boxX = (W - boxW) / 2;
    const boxY = (H - boxH) / 2;

    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.95)', 30, 0, 10, () => {
      Painter.roundedRect(ctx, boxX, boxY, boxW, boxH, 12, '#1e1418', '#e53e3e', 2.5);
    });

    Painter.text(ctx, "TIME'S UP!", W / 2, boxY + 56, {
      font: 'bold 36px system-ui, sans-serif',
      color: '#ef4444',
      align: 'center',
      shadow: { color: 'rgba(239, 68, 68, 0.5)', blur: 14, x: 0, y: 2 },
    });

    const found = level.foundIds.size;
    const total = level.differences.length;
    Painter.text(ctx, `You found ${found} of ${total} differences.`, W / 2, boxY + 115, {
      font: '18px system-ui, sans-serif',
      color: '#f8fafc',
      align: 'center',
    });

    Painter.text(ctx, `Score: ${level.score}`, W / 2, boxY + 160, {
      font: 'bold 22px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
    });

    Painter.text(ctx, 'Do not lose focus! Try again to beat the clock.', W / 2, boxY + 200, {
      font: '14px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'center',
    });

    const pulse = (Math.sin(timeElapsed * 6) + 1) * 0.5;
    Painter.text(ctx, 'Press [R] or Click to Retry Level', W / 2, boxY + 265, {
      font: 'bold 17px system-ui, sans-serif',
      color: pulse > 0.4 ? '#ffffff' : '#64748b',
      align: 'center',
    });
  }

  /**
   * Grand Victory Screen (Completed all 4 levels)
   */
  static renderGameWon(ctx, totalScore, totalStars, timeElapsed = 0) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(10, 12, 20, 0.92)');

    const boxW = 600;
    const boxH = 400;
    const boxX = (W - boxW) / 2;
    const boxY = (H - boxH) / 2;

    Painter.withShadow(ctx, 'rgba(236, 201, 75, 0.35)', 36, 0, 10, () => {
      Painter.roundedRect(ctx, boxX, boxY, boxW, boxH, 16, '#141824', '#ecc94b', 3);
    });

    Painter.text(ctx, 'TWINFOLD MASTER!', W / 2, boxY + 60, {
      font: 'bold 38px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
      shadow: { color: 'rgba(236, 201, 75, 0.6)', blur: 20, x: 0, y: 2 },
    });

    Painter.text(ctx, 'You have conquered all 4 procedural realms of perception!', W / 2, boxY + 105, {
      font: '600 16px system-ui, sans-serif',
      color: '#f8fafc',
      align: 'center',
    });

    // Stars summary
    Painter.text(ctx, `⭐ Total Stars Earned: ${totalStars} / 12`, W / 2, boxY + 165, {
      font: 'bold 24px system-ui, sans-serif',
      color: '#facc15',
      align: 'center',
    });

    Painter.text(ctx, `🏆 Grand Total Score: ${totalScore}`, W / 2, boxY + 215, {
      font: 'bold 28px system-ui, sans-serif',
      color: '#4ade80',
      align: 'center',
    });

    Painter.text(ctx, 'Your keen eye has revealed every concealed anomaly.', W / 2, boxY + 265, {
      font: '15px system-ui, sans-serif',
      color: '#94a3b8',
      align: 'center',
    });

    const pulse = (Math.sin(timeElapsed * 6) + 1) * 0.5;
    Painter.text(ctx, 'Press [Enter] or Click to Play Again', W / 2, boxY + 340, {
      font: 'bold 17px system-ui, sans-serif',
      color: pulse > 0.4 ? '#ffffff' : '#64748b',
      align: 'center',
    });
  }

  /**
   * Pause Overlay
   */
  static renderPause(ctx) {
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    Painter.roundedRect(ctx, 0, 0, W, H, 0, 'rgba(10, 14, 22, 0.75)');

    Painter.text(ctx, 'PAUSED', W / 2, H / 2 - 20, {
      font: 'bold 44px system-ui, sans-serif',
      color: '#f8fafc',
      align: 'center',
    });

    Painter.text(ctx, 'Press [P] or Click to Resume', W / 2, H / 2 + 30, {
      font: '600 18px system-ui, sans-serif',
      color: '#ecc94b',
      align: 'center',
    });
  }
}
