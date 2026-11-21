// Deterministic Screenshot Scene Stager (?shot=hunt|title|attic|clear&seed=1)
// Produces 100% reproducible canvas states for the make.fun judge without Math.random or real clocks.

import { VIEW, LEVELS } from './config.js';
import { LevelState } from './level.js';
import { HarborScene } from './scenes/harbor.js';
import { BazaarScene } from './scenes/bazaar.js';
import { GreenhouseScene } from './scenes/greenhouse.js';
import { AtticScene } from './scenes/attic.js';
import { EffectsManager } from './effects.js';
import { HudRenderer } from './hud.js';
import { ScreenRenderer } from './screens.js';
import { Painter } from './painter.js';
import { PALETTE } from './palette.js';
import { DifferenceEngine } from './differences.js';

export class ShotManager {
  /**
   * Renders a deterministic shot directly onto the canvas
   * @param {string} shotName 'hunt' | 'title' | 'attic' | 'clear'
   * @param {number} seed Deterministic seed
   * @param {HTMLCanvasElement} canvas 
   */
  static renderShot(shotName, seed = 1, canvas) {
    const ctx = canvas.getContext('2d');
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    ctx.save();
    // Default background
    ctx.fillStyle = PALETTE.ui.bgDark;
    ctx.fillRect(0, 0, W, H);

    if (shotName === 'title') {
      // -------------------------------------------------------------
      // SHOT: TITLE SCREEN (2-title.jpg)
      // -------------------------------------------------------------
      ScreenRenderer.renderTitle(ctx, 1.5);
    } else if (shotName === 'hunt') {
      // -------------------------------------------------------------
      // SHOT: HUNT COVER (1-hunt.jpg) — DECISIVE COVER ARTIFACT
      // Spec: Level 3 Greenhouse, 4 of 9 found with dual markers,
      // 1 hint ring, 1 miss cross fading with penalty, HUD ~45% time bar
      // -------------------------------------------------------------
      const levelDef = LEVELS[2]; // Level 3: Greenhouse Lab (9 diffs, 110s)
      const scene = new GreenhouseScene();
      const level = new LevelState(levelDef, seed);
      const effects = new EffectsManager();

      // Deterministically mark exactly 4 of 9 differences as found
      for (let i = 0; i < 4; i++) {
        level.foundIds.add(level.differences[i].id);
      }
      level.score = 7500;
      level.combo = 4;
      level.timeRemaining = level.timeLimit * 0.45; // Exactly 45% remaining (~49.5s)
      level.hintCharges = 2; // 1 hint used

      // 1 Hint ring on the 5th difference
      const hintedDiff = level.differences[4];
      level.activeHint = {
        diff: hintedDiff,
        duration: 6.0,
        elapsed: 1.8,
        screenPositions: DifferenceEngine.getScreenPositions(hintedDiff),
      };

      // 1 Miss cross fading with "-5s" floating penalty text
      const missX = 410;
      const missY = 510;
      effects.visualEvents.push({
        type: 'miss_cross',
        x: missX,
        y: missY,
        duration: 0.85,
        elapsed: 0.35, // partially faded
      });
      effects.visualEvents.push({
        type: 'floating_text',
        x: missX,
        y: missY - 14,
        text: '-5s',
        color: '#e53e3e',
        fontSize: 22,
        duration: 1.0,
        elapsed: 0.35,
      });

      // 1. Render Top HUD: Found 4/9 · 5 left, pips, time ~45%
      HudRenderer.render(ctx, level, 1.8, false);

      // 2. Render Left Panel (Original)
      this.renderPanelDirect(ctx, scene, 'left', level.activeMutations);

      // 3. Center Divider
      Painter.line(ctx, VIEW.DIVIDER_X, VIEW.PANEL_Y - 4, VIEW.DIVIDER_X, VIEW.PANEL_Y + VIEW.PANEL_H + 4, '#1e2430', 2);

      // 4. Render Right Panel (Mutation)
      this.renderPanelDirect(ctx, scene, 'right', level.activeMutations);

      // 5. Render Dual Markers on both panels for all 4 found differences
      effects.renderFoundMarkers(ctx, level.differences, level.foundIds, 1.8);

      // 6. Render Active Hint Rings on both panels for the hinted difference
      effects.renderActiveHint(ctx, level.activeHint);

      // 7. Render Feedback Effects (Miss cross & floating -5s)
      effects.renderEffects(ctx);
    } else if (shotName === 'attic') {
      // -------------------------------------------------------------
      // SHOT: CLOCKWORK ATTIC (3-attic.jpg)
      // Spec: Level 4 Attic, 7 of 10 found, critical red time bar (<15s)
      // -------------------------------------------------------------
      const levelDef = LEVELS[3]; // Level 4: Clockwork Attic (10 diffs, 120s)
      const scene = new AtticScene();
      const level = new LevelState(levelDef, seed);
      const effects = new EffectsManager();

      // Mark 7 of 10 differences as found
      for (let i = 0; i < 7; i++) {
        level.foundIds.add(level.differences[i].id);
      }
      level.score = 18750;
      level.combo = 3;
      level.timeRemaining = 12.0; // Critical 12 seconds remaining (red zone!)
      level.hintCharges = 1;

      // 1. Render Top HUD: Found 7/10 · 3 left, critical red pulsating time bar
      HudRenderer.render(ctx, level, 0.4, false);

      // 2. Left Panel (Attic Original)
      this.renderPanelDirect(ctx, scene, 'left', level.activeMutations);

      // 3. Center Divider
      Painter.line(ctx, VIEW.DIVIDER_X, VIEW.PANEL_Y - 4, VIEW.DIVIDER_X, VIEW.PANEL_Y + VIEW.PANEL_H + 4, '#1e2430', 2);

      // 4. Right Panel (Attic Mutation)
      this.renderPanelDirect(ctx, scene, 'right', level.activeMutations);

      // 5. Dual Markers for all 7 found differences on both panels
      effects.renderFoundMarkers(ctx, level.differences, level.foundIds, 0.4);
    } else if (shotName === 'clear') {
      // -------------------------------------------------------------
      // SHOT: LEVEL COMPLETE (4-clear.jpg)
      // Spec: Level complete screen with 3 stars, time remaining & score
      // -------------------------------------------------------------
      const levelDef = LEVELS[1]; // Level 2: Night Bazaar (7 diffs, 100s)
      const scene = new BazaarScene();
      const level = new LevelState(levelDef, seed);
      const effects = new EffectsManager();

      // All 7 differences found
      for (let i = 0; i < 7; i++) {
        level.foundIds.add(level.differences[i].id);
      }
      level.status = 'cleared';
      level.score = 17250;
      level.timeRemaining = 68.0;

      // 1. Render HUD
      HudRenderer.render(ctx, level, 0.0, false);

      // 2. Render Left Panel
      this.renderPanelDirect(ctx, scene, 'left', level.activeMutations);

      // 3. Center Divider
      Painter.line(ctx, VIEW.DIVIDER_X, VIEW.PANEL_Y - 4, VIEW.DIVIDER_X, VIEW.PANEL_Y + VIEW.PANEL_H + 4, '#1e2430', 2);

      // 4. Render Right Panel
      this.renderPanelDirect(ctx, scene, 'right', level.activeMutations);

      // 5. Render Markers on both panels
      effects.renderFoundMarkers(ctx, level.differences, level.foundIds, 0.0);

      // 6. Overlay Level Clear Modal Screen with 3 Golden Stars
      ScreenRenderer.renderLevelClear(ctx, level, 29250, false, 0.5);
    }

    ctx.restore();
  }

  static renderPanelDirect(ctx, scene, side, activeMutations) {
    const isLeft = side === 'left';
    const panelX = isLeft ? VIEW.PANEL_LEFT_X : VIEW.PANEL_RIGHT_X;
    const panelY = VIEW.PANEL_Y;
    const panelW = VIEW.PANEL_W;
    const panelH = VIEW.PANEL_H;

    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.75)', 18, 0, 8, () => {
      Painter.roundedRect(ctx, panelX - 2, panelY - 2, panelW + 4, panelH + 4, 8, '#141822', '#273142', 2);
    });

    ctx.save();
    ctx.translate(panelX, panelY);
    scene.render(ctx, side, activeMutations, 0);
    ctx.restore();
  }
}
