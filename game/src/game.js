// game/src/game.js
// Main gameplay state machine: rendering, panel clipping, update loop, and screen overlays.

import { CANVAS_WIDTH, CANVAS_HEIGHT, PANELS, LEVELS } from './config.js';
import { UI_COLORS } from './palette.js';
import { RNG } from './rng.js';
import { Level } from './level.js';
import { buildHarborScene } from './scenes/harbor.js';
import { HUD } from './hud.js';
import { EffectsManager } from './effects.js';
import { sound } from './audio.js';
import { DifferenceEngine } from './differences.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Parse URL seed parameter if given
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed') || '1337';
    this.rng = new RNG(seedParam);

    this.effects = new EffectsManager();
    this.currentLevelIndex = 0;
    this.state = 'playing'; // 'title' | 'playing' | 'paused' | 'level_clear' | 'game_over'
    this.isPaused = false;

    this.level = null;
    this.lastTickWarning = 0;

    this._startLevel(0);
  }

  _startLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const levelConfig = LEVELS[levelIndex] || LEVELS[0];

    // For Level 1, build harbor scene
    const sceneData = buildHarborScene(this.rng);
    this.level = new Level(levelConfig, sceneData, this.rng);
    this.state = 'playing';
    this.isPaused = false;
  }

  handleAction(action) {
    sound.init();

    if (action === 'pause') {
      if (this.state === 'playing') {
        this.isPaused = !this.isPaused;
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
    }
  }

  handleClick(cx, cy) {
    sound.init();

    // Check HUD Hint Button click
    if (cx >= 995 && cx <= 1110 && cy >= 22 && cy <= 52) {
      this.handleAction('hint');
      return;
    }
    // Check HUD Mute click
    if (cx >= 1120 && cx <= 1190 && cy >= 10 && cy <= 45) {
      this.handleAction('mute');
      return;
    }
    // Check HUD Pause click
    if (cx >= 1195 && cx <= 1260 && cy >= 10 && cy <= 45) {
      this.handleAction('pause');
      return;
    }

    if (this.state === 'level_clear' || this.state === 'game_over') {
      // Click restarts or advances
      this._startLevel(0);
      return;
    }

    if (this.isPaused || this.state !== 'playing') return;

    // Check if clicked in Left Panel
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

    if (this.state === 'playing') {
      this.level.update(dt);

      // Audio tick warning under 10 seconds
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

    // Screen shake offset from effects
    ctx.translate(this.effects.shakeOffsetX, this.effects.shakeOffsetY);

    // Canvas background
    ctx.fillStyle = UI_COLORS.backdrop;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render Left and Right Panels
    this._renderScenePanel(PANELS.left, false);
    this._renderScenePanel(PANELS.right, true);

    // Render Panel Frames and brass corner brackets
    HUD.renderPanelFrames(ctx);

    // Render Top HUD Status Bar
    HUD.render(ctx, this.level, sound.muted, this.isPaused);

    // Overlays (Paused, Level Clear, Game Over)
    if (this.isPaused) {
      this._renderPauseOverlay();
    } else if (this.state === 'level_clear') {
      this._renderLevelClearOverlay();
    } else if (this.state === 'game_over') {
      this._renderGameOverOverlay();
    }

    // Render crosshair cursor
    HUD.renderCrosshair(ctx, cursorX, cursorY, isKeyboard);

    ctx.restore();
  }

  _renderScenePanel(panel, isRightPanel) {
    const ctx = this.ctx;
    ctx.save();

    // Clip to panel geometry
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

    // Render dynamic ripples, sparkles, and error indicators
    this.effects.renderPanelOverlays(ctx);

    // Render active hint target on both panels
    if (this.level.activeHint) {
      this.effects.renderActiveHint(ctx, this.level.activeHint);
    }

    ctx.restore();
  }

  _renderPauseOverlay() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(11, 13, 19, 0.75)';
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = UI_COLORS.textSecondary;
    ctx.fillText('Press [P] or Space to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    ctx.restore();
  }

  _renderLevelClearOverlay() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(11, 13, 19, 0.45)'; // Soft darkening keeping scene visible
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    // Dialog card
    const cardW = 460;
    const cardH = 240;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2 + 20;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('STAGE COMPLETE!', CANVAS_WIDTH / 2, cardY + 45);

    // Stars
    ctx.fillStyle = '#fbbf24';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText('★ ★ ★', CANVAS_WIDTH / 2, cardY + 80);

    // Stats
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`Final Score: ${this.level.score.toLocaleString()}`, CANVAS_WIDTH / 2, cardY + 120);
    ctx.fillStyle = UI_COLORS.textSecondary;
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(`All ${this.level.differences.length} differences spotted!`, CANVAS_WIDTH / 2, cardY + 148);

    // Prompt
    ctx.fillStyle = UI_COLORS.accentAmber;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('Press Enter or Click to Replay Stage', CANVAS_WIDTH / 2, cardY + 195);

    ctx.restore();
  }

  _renderGameOverOverlay() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(11, 13, 19, 0.65)';
    ctx.fillRect(0, 72, CANVAS_WIDTH, CANVAS_HEIGHT - 72);

    const cardW = 440;
    const cardH = 220;
    const cardX = (CANVAS_WIDTH - cardW) / 2;
    const cardY = (CANVAS_HEIGHT - cardH) / 2 + 20;

    ctx.fillStyle = 'rgba(21, 25, 34, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('TIME EXPIRED', CANVAS_WIDTH / 2, cardY + 45);

    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`Found: ${this.level.foundCount}/${this.level.differences.length} differences`, CANVAS_WIDTH / 2, cardY + 95);
    ctx.fillText(`Score: ${this.level.score.toLocaleString()}`, CANVAS_WIDTH / 2, cardY + 122);

    ctx.fillStyle = UI_COLORS.accentAmber;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('Press Enter or Click to Try Again', CANVAS_WIDTH / 2, cardY + 175);

    ctx.restore();
  }
}
