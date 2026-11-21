// game/src/game.js
// Main gameplay state machine: rendering, panel clipping, update loop, screens, and campaign progression.

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
import { sound } from './audio.js';
import { DifferenceEngine } from './differences.js';
import { ScreenManager } from './screens.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed') || '1337';
    this.rng = new RNG(seedParam);

    this.effects = new EffectsManager();
    this.screens = new ScreenManager();

    this.currentLevelIndex = 0;
    this.selectedStageIndex = 0;
    this.state = 'title'; // 'title' | 'playing' | 'paused' | 'level_clear' | 'game_over' | 'victory'
    this.isPaused = false;

    this.campaignScore = 0;
    this.stageRecords = [
      { stars: 0, highScore: 0 },
      { stars: 0, highScore: 0 },
      { stars: 0, highScore: 0 },
      { stars: 0, highScore: 0 },
    ];

    this.level = null;
    this.lastTickWarning = 0;

    // Check if URL has direct stage param (e.g. ?stage=2)
    const stageParam = params.get('stage');
    if (stageParam !== null) {
      const parsedStage = parseInt(stageParam, 10) - 1;
      if (parsedStage >= 0 && parsedStage < LEVELS.length) {
        this.startLevel(parsedStage);
      }
    }
  }

  _buildSceneForLevel(levelIndex) {
    switch (levelIndex) {
      case 0:
        return buildHarborScene(this.rng);
      case 1:
        return buildBazaarScene(this.rng);
      case 2:
        return buildGreenhouseScene(this.rng);
      case 3:
        return buildAtticScene(this.rng);
      default:
        return buildHarborScene(this.rng);
    }
  }

  startLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.selectedStageIndex = levelIndex;
    const levelConfig = LEVELS[levelIndex] || LEVELS[0];

    const sceneData = this._buildSceneForLevel(levelIndex);
    this.level = new Level(levelConfig, sceneData, this.rng);
    this.state = 'playing';
    this.isPaused = false;
  }

  handleAction(action) {
    sound.init();

    if (action === 'pause') {
      if (this.state === 'playing') {
        this.isPaused = !this.isPaused;
      } else if (this.isPaused) {
        this.isPaused = false;
      }
    } else if (action === 'mute') {
      sound.toggleMute();
    } else if (action === 'hint') {
      if (this.state === 'playing' && !this.isPaused) {
        const hint = this.level.useHint();
        if (hint) {
          sound.playHint();
        }
      }
    } else if (action === 'confirm') {
      // Enter or Space pressed
      if (this.state === 'title') {
        this.startLevel(this.selectedStageIndex);
      } else if (this.state === 'paused') {
        this.isPaused = false;
      } else if (this.state === 'level_clear') {
        this.advanceNext();
      } else if (this.state === 'game_over') {
        this.startLevel(this.currentLevelIndex);
      } else if (this.state === 'victory') {
        this.state = 'title';
      }
    } else if (action === 'quit') {
      this.state = 'title';
      this.isPaused = false;
    } else if (action.startsWith('stage_')) {
      const idx = parseInt(action.replace('stage_', ''), 10);
      if (idx >= 0 && idx < LEVELS.length) {
        this.selectedStageIndex = idx;
        if (this.state === 'title') {
          this.startLevel(idx);
        }
      }
    }
  }

  advanceNext() {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.startLevel(this.currentLevelIndex + 1);
    } else {
      this.state = 'victory';
      sound.playLevelClear();
    }
  }

  handleClick(cx, cy) {
    sound.init();

    // 1. Title Screen card clicks
    if (this.state === 'title') {
      const cardW = 270;
      const cardH = 370;
      const gap = 24;
      const totalW = 4 * cardW + 3 * gap;
      const startX = (CANVAS_WIDTH - totalW) / 2;
      const cardY = 150;

      for (let i = 0; i < LEVELS.length; i++) {
        const cardX = startX + i * (cardW + gap);
        if (cx >= cardX && cx <= cardX + cardW && cy >= cardY && cy <= cardY + cardH) {
          this.selectedStageIndex = i;
          this.startLevel(i);
          return;
        }
      }

      // Anywhere else on title screen starts selected stage
      this.startLevel(this.selectedStageIndex);
      return;
    }

    // 2. Victory Screen click returns to title
    if (this.state === 'victory') {
      this.state = 'title';
      return;
    }

    // 3. Level Clear click advances to next level
    if (this.state === 'level_clear') {
      this.advanceNext();
      return;
    }

    // 4. Game Over click restarts current level
    if (this.state === 'game_over') {
      this.startLevel(this.currentLevelIndex);
      return;
    }

    // 5. HUD clicks during gameplay
    if (cy <= 72) {
      // Hint button pill click [H] (x: 905..1020, y: 20..52)
      if (cx >= 900 && cx <= 1025 && cy >= 18 && cy <= 54) {
        this.handleAction('hint');
        return;
      }
      // Mute toggle pill click [M] (x: 1035..1130, y: 20..52)
      if (cx >= 1030 && cx <= 1130 && cy >= 18 && cy <= 54) {
        this.handleAction('mute');
        return;
      }
      // Pause toggle pill click [P] (x: 1140..1235, y: 20..52)
      if (cx >= 1135 && cx <= 1240 && cy >= 18 && cy <= 54) {
        this.handleAction('pause');
        return;
      }
    }

    if (this.isPaused || this.state !== 'playing') return;

    // 6. Panel Clicks
    const inLeft = DifferenceEngine.isInsidePanel(cx, cy, PANELS.left);
    const inRight = DifferenceEngine.isInsidePanel(cx, cy, PANELS.right);

    if (inLeft || inRight) {
      const panel = inLeft ? PANELS.left : PANELS.right;
      const local = DifferenceEngine.toPanelLocal(cx, cy, panel);

      const result = this.level.handleClick(local.x, local.y);
      if (result) {
        if (result.type === 'hit') {
          sound.playSuccess(result.combo);
          this.effects.triggerHit(result.difference, result.scoreGained, result.combo);

          if (result.completed) {
            sound.playLevelClear();
            this.campaignScore += this.level.score;

            // Update stage record stars
            const timeRatio = this.level.timeLeft / this.level.timeTotal;
            let stars = 1;
            if (timeRatio > 0.4 && this.level.mistakesCount <= 2) stars = 3;
            else if (timeRatio > 0.15 && this.level.mistakesCount <= 4) stars = 2;

            const rec = this.stageRecords[this.currentLevelIndex];
            rec.stars = Math.max(rec.stars, stars);
            rec.highScore = Math.max(rec.highScore, this.level.score);

            this.state = 'level_clear';
          }
        } else if (result.type === 'miss') {
          sound.playError();
          this.effects.triggerError(local.x, local.y);

          if (result.failed) {
            sound.playGameOver();
            this.state = 'game_over';
          }
        }
      }
    }
  }

  update(dt) {
    if (this.isPaused) return;

    if (this.state === 'playing' && this.level) {
      this.level.update(dt);

      // Warning audio ticking under 10 seconds
      if (this.level.timeLeft <= 10 && this.level.timeLeft > 0) {
        const currentSec = Math.floor(this.level.timeLeft);
        if (currentSec !== this.lastTickWarning) {
          this.lastTickWarning = currentSec;
          sound.playTick();
        }
      }

      if (this.level.isFailed) {
        sound.playGameOver();
        this.state = 'game_over';
      }
    }

    this.effects.update(dt);
  }

  render(cursorX = -1, cursorY = -1, isKeyboard = false) {
    const ctx = this.ctx;
    ctx.save();

    // Screen shake from effects
    ctx.translate(this.effects.shakeOffsetX, this.effects.shakeOffsetY);

    if (this.state === 'title') {
      this.screens.renderTitle(ctx, this.selectedStageIndex, this.stageRecords);
      HUD.renderCrosshair(ctx, cursorX, cursorY, isKeyboard);
      ctx.restore();
      return;
    }

    if (this.state === 'victory') {
      const totalStars = this.stageRecords.reduce((acc, r) => acc + r.stars, 0);
      this.screens.renderVictory(ctx, this.campaignScore, totalStars);
      HUD.renderCrosshair(ctx, cursorX, cursorY, isKeyboard);
      ctx.restore();
      return;
    }

    // Normal gameplay canvas background
    ctx.fillStyle = UI_COLORS.backdrop;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render Left and Right Panels
    this._renderScenePanel(PANELS.left, false);
    this._renderScenePanel(PANELS.right, true);

    // Panel Frames and aesthetic brass brackets
    HUD.renderPanelFrames(ctx);

    // Top HUD Status Bar
    HUD.render(ctx, this.level, sound.muted, this.isPaused);

    // Overlays
    if (this.isPaused) {
      this.screens.renderPause(ctx);
    } else if (this.state === 'level_clear') {
      const nextAvailable = this.currentLevelIndex < LEVELS.length - 1;
      this.screens.renderLevelClear(ctx, this.level, nextAvailable);
    } else if (this.state === 'game_over') {
      this.screens.renderGameOver(ctx, this.level);
    }

    // Crosshair cursor
    HUD.renderCrosshair(ctx, cursorX, cursorY, isKeyboard);

    ctx.restore();
  }

  _renderScenePanel(panel, isRightPanel) {
    const ctx = this.ctx;
    ctx.save();

    ctx.beginPath();
    ctx.roundRect(panel.x, panel.y, panel.width, panel.height, 8);
    ctx.clip();

    ctx.translate(panel.x, panel.y);

    // Render background scene objects in layer order
    for (const obj of this.level.sceneData.objects) {
      obj.render(ctx);
    }

    // Render interactive differences (left = original, right = mutated)
    for (const diff of this.level.differences) {
      if (typeof diff.render === 'function') {
        diff.render(ctx, isRightPanel);
      }
    }

    // Render found markers and ghost outlines
    this.effects.renderFoundMarkers(ctx, this.level.differences, isRightPanel);

    // Render ripples, sparkles, and error indicators
    this.effects.renderPanelOverlays(ctx);

    // Render active hint target on both panels
    if (this.level.activeHint) {
      this.effects.renderActiveHint(ctx, this.level.activeHint);
    }

    ctx.restore();
  }
}
