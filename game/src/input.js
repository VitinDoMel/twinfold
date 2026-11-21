// game/src/input.js
// Input manager handling mouse clicks, movement, and full keyboard navigation.

import { CANVAS_WIDTH, CANVAS_HEIGHT, PANELS } from './config.js';

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouseX = -1;
    this.mouseY = -1;
    this.cursorX = CANVAS_WIDTH / 2;
    this.cursorY = CANVAS_HEIGHT / 2;
    this.isKeyboardDriven = false;

    this.keysDown = new Set();
    this.clickHandler = null;
    this.actionHandler = null;

    this._bindEvents();
  }

  _bindEvents() {
    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
      this.cursorX = this.mouseX;
      this.cursorY = this.mouseY;
      this.isKeyboardDriven = false;
    });

    // Mouse click
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left button only
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      if (this.clickHandler) {
        this.clickHandler(clickX, clickY);
      }
    });

    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);

      // Trigger hotkey actions
      if (e.code === 'KeyH') {
        if (this.actionHandler) this.actionHandler('hint');
      } else if (e.code === 'KeyP') {
        if (this.actionHandler) this.actionHandler('pause');
      } else if (e.code === 'KeyM') {
        if (this.actionHandler) this.actionHandler('mute');
      } else if (e.code === 'Escape' || e.code === 'KeyQ') {
        if (this.actionHandler) this.actionHandler('quit');
      } else if (e.code === 'Digit1') {
        if (this.actionHandler) this.actionHandler('stage_0');
      } else if (e.code === 'Digit2') {
        if (this.actionHandler) this.actionHandler('stage_1');
      } else if (e.code === 'Digit3') {
        if (this.actionHandler) this.actionHandler('stage_2');
      } else if (e.code === 'Digit4') {
        if (this.actionHandler) this.actionHandler('stage_3');
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        if (this.actionHandler) this.actionHandler('confirm');
        if (this.clickHandler) {
          this.clickHandler(this.cursorX, this.cursorY);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });
  }

  update(dt) {
    // Keyboard virtual cursor movement (Arrows or WASD)
    const speed = 460 * dt;
    let dx = 0;
    let dy = 0;

    if (this.keysDown.has('ArrowLeft') || this.keysDown.has('KeyA')) dx -= speed;
    if (this.keysDown.has('ArrowRight') || this.keysDown.has('KeyD')) dx += speed;
    if (this.keysDown.has('ArrowUp') || this.keysDown.has('KeyW')) dy -= speed;
    if (this.keysDown.has('ArrowDown') || this.keysDown.has('KeyS')) dy += speed;

    if (dx !== 0 || dy !== 0) {
      this.isKeyboardDriven = true;
      this.cursorX = Math.max(0, Math.min(CANVAS_WIDTH, this.cursorX + dx));
      this.cursorY = Math.max(0, Math.min(CANVAS_HEIGHT, this.cursorY + dy));
    }
  }

  on(event, callback) {
    if (event === 'click') this.clickHandler = callback;
    if (event === 'action') this.actionHandler = callback;
  }
}
