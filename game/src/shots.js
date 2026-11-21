// game/src/shots.js
// Deterministic screenshot generator for official dossier captures (?shot=hunt|title|attic|clear&seed=1).

import { CANVAS_WIDTH, CANVAS_HEIGHT, PANELS, LEVELS } from './config.js';
import { UI_COLORS } from './palette.js';
import { RNG } from './rng.js';
import { Level } from './level.js';
import { buildHarborScene } from './scenes/harbor.js';
import { buildBazaarScene } from './scenes/bazaar.js';
import { buildGreenhouseScene } from './scenes/greenhouse.js';
import { buildAtticScene } from './scenes/attic.js';
import { HUD } from './hud.js';
import { EffectsManager } from './effects.js';
import { ScreenManager } from './screens.js';

export function renderDeterministicShot(canvas, shotName, seed = 1) {
  // Lock time and pseudo-randomness for 100% deterministic pixel-perfect output
  const rng = new RNG(seed);
  Math.random = () => rng.next();
  Date.now = () => 1000000;
  performance.now = () => 1000000;

  const ctx = canvas.getContext('2d');
  const screens = new ScreenManager();
  const effects = new EffectsManager();

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  switch (shotName) {
    case 'title': {
      // 2-title.jpg: Title screen with real miniaturized scene vector cards
      const stageRecords = [
        { stars: 3, highScore: 5085 },
        { stars: 2, highScore: 7735 },
        { stars: 0, highScore: 0 },
        { stars: 0, highScore: 0 },
      ];
      screens.renderTitle(ctx, 0, stageRecords);
      HUD.renderCrosshair(ctx, CANVAS_WIDTH / 2, 575, false);
      break;
    }

    case 'hunt': {
      // 1-hunt.jpg (COVER): Level 3 Greenhouse Lab, 4/9 found, 1 hint ring, 1 error X, time ~45%
      const levelConfig = LEVELS[2]; // Greenhouse Lab
      const sceneData = buildGreenhouseScene(rng);
      const level = new Level(levelConfig, sceneData, rng);

      // Set time to exactly 45% (110s * 0.45 = 49.5s)
      level.timeLeft = 49.5;
      level.score = 3450;
      level.combo = 2;
      level.hintsRemaining = 2;

      // Mark exactly 4 differences as found
      for (let i = 0; i < 4; i++) {
        level.differences[i].found = true;
        level.differences[i].foundTime = 20 + i * 8;
        level.foundIds.add(level.differences[i].id);
        level.foundCount++;
      }

      // 1 Hint ring pointing to 5th difference (unfound)
      const hintTarget = level.differences[4];

      // 1 Error X fading on the right panel
      const errorX = 265;
      const errorY = 430;

      // Render base canvas background
      ctx.fillStyle = UI_COLORS.backdrop;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render Left and Right Panels
      renderPanelsWithState(ctx, level, effects, {
        activeHint: hintTarget,
        errorMarker: { panel: 'right', x: errorX, y: errorY },
      });

      // Panel Frames
      HUD.renderPanelFrames(ctx);

      // Top HUD
      HUD.render(ctx, level, false, false);

      // Crosshair
      HUD.renderCrosshair(ctx, PANELS.left.x + hintTarget.x, PANELS.left.y + hintTarget.y, false);
      break;
    }

    case 'attic': {
      // 3-attic.jpg: Level 4 Clockwork Attic, 7/10 found, time critical (< 15s, red bar)
      const levelConfig = LEVELS[3]; // Clockwork Attic
      const sceneData = buildAtticScene(rng);
      const level = new Level(levelConfig, sceneData, rng);

      // Critical time: 11.4s (< 15s triggers red bar)
      level.timeLeft = 11.4;
      level.score = 7850;
      level.combo = 3;
      level.hintsRemaining = 1;

      // Mark exactly 7 differences as found
      for (let i = 0; i < 7; i++) {
        level.differences[i].found = true;
        level.differences[i].foundTime = 15 + i * 12;
        level.foundIds.add(level.differences[i].id);
        level.foundCount++;
      }

      // Render base canvas background
      ctx.fillStyle = UI_COLORS.backdrop;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render Left and Right Panels
      renderPanelsWithState(ctx, level, effects, {
        activeHint: null,
        errorMarker: null,
      });

      // Panel Frames
      HUD.renderPanelFrames(ctx);

      // Top HUD
      HUD.render(ctx, level, false, false);

      // Crosshair
      HUD.renderCrosshair(ctx, PANELS.right.x + 350, PANELS.right.y + 340, false);
      break;
    }

    case 'clear': {
      // 4-clear.jpg: Level complete screen with stars (~35% darkening, scene visible)
      const levelConfig = LEVELS[1]; // Night Bazaar
      const sceneData = buildBazaarScene(rng);
      const level = new Level(levelConfig, sceneData, rng);

      level.timeLeft = 48.0;
      level.score = 7735;
      level.mistakesCount = 1;

      for (const d of level.differences) {
        d.found = true;
        level.foundCount++;
      }

      // Render base canvas background
      ctx.fillStyle = UI_COLORS.backdrop;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render Left and Right Panels
      renderPanelsWithState(ctx, level, effects, {
        activeHint: null,
        errorMarker: null,
      });

      // Panel Frames
      HUD.renderPanelFrames(ctx);

      // Top HUD
      HUD.render(ctx, level, false, false);

      // Render Level Clear Overlay
      screens.renderLevelClear(ctx, level, true);
      break;
    }

    default:
      console.warn(`Unknown shot name: ${shotName}`);
  }

  // Set official signal for screenshot harnesses
  window.__shotReady = true;
}

function renderPanelsWithState(ctx, level, effects, extra = {}) {
  const panels = [
    { config: PANELS.left, isRight: false },
    { config: PANELS.right, isRight: true },
  ];

  for (const { config: p, isRight } of panels) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, p.height, 8);
    ctx.clip();
    ctx.translate(p.x, p.y);

    // Render background scene objects in layer order
    for (const obj of level.sceneData.objects) {
      obj.render(ctx);
    }

    // Render interactive differences (left = original, right = mutated)
    for (const diff of level.differences) {
      if (typeof diff.render === 'function') {
        diff.render(ctx, isRight);
      }
    }

    // Render found markers and ghost outlines
    effects.renderFoundMarkers(ctx, level.differences, isRight);

    // Extra: Hint target ring
    if (extra.activeHint) {
      effects.renderActiveHint(ctx, extra.activeHint);
    }

    // Extra: Error X marker on specified panel
    if (extra.errorMarker) {
      const match = (extra.errorMarker.panel === 'right' && isRight) || (extra.errorMarker.panel === 'left' && !isRight);
      if (match) {
        ctx.save();
        ctx.translate(extra.errorMarker.x, extra.errorMarker.y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-16, -16);
        ctx.lineTo(16, 16);
        ctx.moveTo(16, -16);
        ctx.lineTo(-16, 16);
        ctx.stroke();

        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('-5 SECONDS', 0, -24);
        ctx.restore();
      }
    }

    ctx.restore();
  }
}
