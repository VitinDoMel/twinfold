// Application Bootloader & Loop Orchestrator for Twinfold

import { TwinfoldGame } from './game.js';

class Application {
  static boot() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Canvas element #game-canvas not found.');
      return;
    }

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
