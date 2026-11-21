// Core Game State Machine & Coordinator

import { VIEW, LEVELS } from './config.js';
import { LevelState } from './level.js';
import { HarborScene } from './scenes/harbor.js';
import { BazaarScene } from './scenes/bazaar.js';
import { GreenhouseScene } from './scenes/greenhouse.js';
import { AtticScene } from './scenes/attic.js';
import { EffectsManager } from './effects.js';
import { SoundSystem } from './audio.js';
import { HudRenderer } from './hud.js';
import { InputManager } from './input.js';
import { ScreenRenderer } from './screens.js';
import { Painter } from './painter.js';
import { PALETTE } from './palette.js';

export class TwinfoldGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Subsystems
    this.sound = new SoundSystem();
    this.effects = new EffectsManager();

    // Scene registry
    this.scenes = {
      harbor: new HarborScene(),
      bazaar: new BazaarScene(),
      greenhouse: new GreenhouseScene(),
      attic: new AtticScene(),
    };

    // Game state
    this.state = 'title'; // 'title' | 'playing' | 'paused' | 'cleared' | 'game_over' | 'game_won'
    this.currentLevelIndex = 0;
    this.level = null;
    this.scene = null;

    // Campaign totals
    this.campaignScore = 0;
    this.campaignStars = 0;

    this.timeElapsed = 0;

    // Input Manager setup
    this.input = new InputManager(this.canvas, {
      onClick: (sx, sy) => this.handleActionClick(sx, sy),
      onSelect: (sx, sy) => this.handleActionClick(sx, sy),
      onHint: () => this.triggerHint(),
      onPause: () => this.togglePause(),
      onMute: () => this.toggleMute(),
      onRestart: () => this.restartLevel(),
    });
  }

  startGame(levelIndex = 0) {
    this.campaignScore = 0;
    this.campaignStars = 0;
    this.startLevel(levelIndex);
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    const def = LEVELS[index];
    this.level = new LevelState(def, index + 1);
    this.scene = this.scenes[def.key] || this.scenes.harbor;
    this.effects.reset();
    this.state = 'playing';
  }

  restartLevel() {
    if (this.state === 'title') return;
    this.startLevel(this.currentLevelIndex);
  }

  nextLevel() {
    const nextIdx = this.currentLevelIndex + 1;
    if (nextIdx < LEVELS.length) {
      this.startLevel(nextIdx);
    } else {
      this.state = 'game_won';
      this.sound.playLevelClear();
    }
  }

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'playing';
    }
  }

  toggleMute() {
    this.sound.toggleMute();
  }

  triggerHint() {
    if (this.state !== 'playing' || !this.level) return;
    const hinted = this.level.useHint();
    if (hinted) {
      this.sound.playHint();
    }
  }

  handleActionClick(screenX, screenY) {
    // 1. Title Screen
    if (this.state === 'title') {
      this.sound.ensureContext();
      this.startGame(0);
      return;
    }

    // 2. Level Cleared Screen
    if (this.state === 'cleared') {
      this.nextLevel();
      return;
    }

    // 3. Game Over Screen
    if (this.state === 'game_over') {
      this.restartLevel();
      return;
    }

    // 4. Game Won Screen
    if (this.state === 'game_won') {
      this.state = 'title';
      return;
    }

    // 5. Paused Screen
    if (this.state === 'paused') {
      this.state = 'playing';
      return;
    }

    // 6. Active Playing State
    if (this.state === 'playing') {
      // Check HUD Button Clicks
      // Mute toggle (x: 1085, y: 20, w: 36, h: 36)
      if (screenX >= 1085 && screenX <= 1121 && screenY >= 20 && screenY <= 56) {
        this.toggleMute();
        return;
      }

      // Hint button (x: 1135, y: 18, w: 112, h: 38)
      if (screenX >= 1135 && screenX <= 1247 && screenY >= 18 && screenY <= 56) {
        this.triggerHint();
        return;
      }

      // Panel Gameplay Hit-Test
      const res = this.level.handleClick(screenX, screenY);
      if (!res.handled) return;

      if (res.hit) {
        // HIT
        this.sound.playHit(this.level.combo);
        this.effects.addHitEvent(res.screenPositions, res.points, res.difference.radius || VIEW.HIT_RADIUS, screenX, screenY);

        if (this.level.status === 'cleared') {
          this.state = 'cleared';
          this.campaignScore += this.level.score;
          this.campaignStars += this.level.getStarsEarned();
          this.sound.playLevelClear();
        }
      } else {
        // MISS
        this.sound.playMiss();
        this.effects.addMissEvent(screenX, screenY);

        if (this.level.status === 'failed') {
          this.state = 'game_over';
          this.sound.playGameOver();
        }
      }
    }
  }

  update(dt) {
    this.timeElapsed += dt;
    this.input.update(dt);

    if (this.state === 'playing' && this.level) {
      this.level.update(dt);
      if (this.level.status === 'failed') {
        this.state = 'game_over';
        this.sound.playGameOver();
      }
    }

    this.effects.update(dt);
  }

  render() {
    const ctx = this.ctx;
    const W = VIEW.WIDTH;
    const H = VIEW.HEIGHT;

    // Apply screen shake displacement
    const [shakeX, shakeY] = this.effects.getShakeOffset();
    ctx.save();
    if (shakeX !== 0 || shakeY !== 0) {
      ctx.translate(shakeX, shakeY);
    }

    if (this.state === 'title') {
      ScreenRenderer.renderTitle(ctx, this.timeElapsed);
      this.input.renderReticle(ctx, this.timeElapsed);
      ctx.restore();
      return;
    }

    // 1. Clear background
    ctx.fillStyle = PALETTE.ui.bgDark;
    ctx.fillRect(0, 0, W, H);

    // 2. Render Top HUD
    if (this.level) {
      HudRenderer.render(ctx, this.level, this.timeElapsed, this.sound.isMuted);
    }

    // 3. Render Left Panel
    this.renderPanel(ctx, 'left');

    // 4. Center Divider Line
    Painter.line(ctx, VIEW.DIVIDER_X, VIEW.PANEL_Y - 4, VIEW.DIVIDER_X, VIEW.PANEL_Y + VIEW.PANEL_H + 4, '#1e2430', 2);

    // 5. Render Right Panel
    this.renderPanel(ctx, 'right');

    // 6. Dual Found Markers on both panels
    if (this.level) {
      this.effects.renderFoundMarkers(ctx, this.level.differences, this.level.foundIds, this.timeElapsed);
      this.effects.renderActiveHint(ctx, this.level.activeHint);
    }

    // 7. Visual Effects & Particles
    this.effects.renderEffects(ctx);

    // 8. Virtual Keyboard Crosshair Reticle
    this.input.renderReticle(ctx, this.timeElapsed);

    // 9. Overlays
    if (this.state === 'paused') {
      ScreenRenderer.renderPause(ctx);
    } else if (this.state === 'cleared') {
      const isLast = this.currentLevelIndex >= LEVELS.length - 1;
      ScreenRenderer.renderLevelClear(ctx, this.level, this.campaignScore, isLast, this.timeElapsed);
    } else if (this.state === 'game_over') {
      ScreenRenderer.renderGameOver(ctx, this.level, this.timeElapsed);
    } else if (this.state === 'game_won') {
      ScreenRenderer.renderGameWon(ctx, this.campaignScore, this.campaignStars, this.timeElapsed);
    }

    ctx.restore();
  }

  renderPanel(ctx, side) {
    const isLeft = side === 'left';
    const panelX = isLeft ? VIEW.PANEL_LEFT_X : VIEW.PANEL_RIGHT_X;
    const panelY = VIEW.PANEL_Y;
    const panelW = VIEW.PANEL_W;
    const panelH = VIEW.PANEL_H;

    // Panel border frame & shadow
    Painter.withShadow(ctx, 'rgba(0, 0, 0, 0.75)', 18, 0, 8, () => {
      Painter.roundedRect(ctx, panelX - 2, panelY - 2, panelW + 4, panelH + 4, 8, '#141822', '#273142', 2);
    });

    // Render Scene into panel
    ctx.save();
    ctx.translate(panelX, panelY);
    if (this.scene && this.level) {
      this.scene.render(ctx, side, this.level.activeMutations, this.timeElapsed);
    }
    ctx.restore();
  }
}
