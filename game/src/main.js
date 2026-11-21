// Application Bootloader, Game Loop & Deterministic Screenshot Stager for Twinfold

import { TwinfoldGame } from './game.js';
import { ShotManager } from './shots.js';

class Application {
  static boot() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Canvas element #game-canvas not found.');
      return;
    }

    // Check if launched in headless deterministic screenshot mode (?shot=...)
    const params = new URLSearchParams(window.location.search);
    const shot = params.get('shot');
    const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
    const seed = Number.isInteger(seedParam) ? seedParam : 1;

    if (shot) {
      // Deterministic screenshot staging: paint twice to settle and signal readiness
      let frames = 0;
      const paintShot = () => {
        ShotManager.renderShot(shot, seed, canvas);
        frames += 1;
        if (frames < 2) {
          requestAnimationFrame(paintShot);
        } else {
          window.__shotReady = true;
        }
      };
      paintShot();
      return;
    }

    // Interactive game loop
    const game = new TwinfoldGame(canvas);

    let lastTime = performance.now();
    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      game.update(dt);
      game.render();

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Application.boot);
} else {
  Application.boot();
}
