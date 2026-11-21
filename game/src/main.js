// game/src/main.js
// Bootstraps canvas, manages inputs, and runs requestAnimationFrame game loop.

import { Game } from './game.js';
import { InputManager } from './input.js';

const canvas = document.getElementById('game-canvas');
const game = new Game(canvas);
const input = new InputManager(canvas);

window.__game = game;

input.on('click', (cx, cy) => game.handleClick(cx, cy));
input.on('action', (act) => game.handleAction(act));

let lastTime = performance.now();

function loop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  input.update(dt);
  game.update(dt);
  game.render(input.cursorX, input.cursorY, input.isKeyboardDriven);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
