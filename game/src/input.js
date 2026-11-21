// Unified Input Controller: Mouse, Touch, and Virtual Keyboard Reticle Navigation

import { VIEW } from './config.js';
import { Painter } from './painter.js';

export class InputManager {
  /**
   * @param {HTMLCanvasElement} canvas 
   * @param {Object} callbacks Event callback handlers
   */
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.callbacks = callbacks;

    // Virtual keyboard reticle cursor
    this.reticleX = VIEW.WIDTH / 2;
    this.reticleY = VIEW.HEIGHT / 2;
    this.reticleSpeed = 450; // pixels per second
    this.keyboardActive = false;

    // Key states
    this.keys = new Map();

    this.bindEvents();
  }

  bindEvents() {
    // 1. Mouse & Touch down
    const handlePointerDown = (e) => {
      e.preventDefault();
      this.keyboardActive = false;
      const [screenX, screenY] = this.clientToScreen(e);
      if (this.callbacks.onClick) {
        this.callbacks.onClick(screenX, screenY);
      }
    };

    this.canvas.addEventListener('mousedown', handlePointerDown);
    this.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });

    // 2. Keyboard Keydown
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      this.keys.set(key, true);

      // Actions on key press
      if (key === 'h') {
        if (this.callbacks.onHint) this.callbacks.onHint();
      } else if (key === 'p') {
        if (this.callbacks.onPause) this.callbacks.onPause();
      } else if (key === 'm') {
        if (this.callbacks.onMute) this.callbacks.onMute();
      } else if (key === 'r') {
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      } else if (key === 'enter' || key === ' ') {
        e.preventDefault();
        if (this.callbacks.onSelect) {
          this.callbacks.onSelect(this.reticleX, this.reticleY);
        }
      }

      // Check if directional key activated
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        this.keyboardActive = true;
      }
    });

    // 3. Keyboard Keyup
    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys.set(key, false);
    });
  }

  /**
   * Converts client DOM mouse/touch coordinates to internal 1280x720 canvas coordinates
   */
  clientToScreen(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

    const screenX = (clientX - rect.left) * scaleX;
    const screenY = (clientY - rect.top) * scaleY;

    return [
      Math.max(0, Math.min(VIEW.WIDTH, screenX)),
      Math.max(0, Math.min(VIEW.HEIGHT, screenY)),
    ];
  }

  /**
   * Updates virtual reticle position based on arrow keys / WASD
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    let dx = 0;
    let dy = 0;

    if (this.keys.get('arrowleft') || this.keys.get('a')) dx -= 1;
    if (this.keys.get('arrowright') || this.keys.get('d')) dx += 1;
    if (this.keys.get('arrowup') || this.keys.get('w')) dy -= 1;
    if (this.keys.get('arrowdown') || this.keys.get('s')) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 || dy !== 0) {
      this.keyboardActive = true;
      this.reticleX = Math.max(VIEW.PANEL_LEFT_X, Math.min(VIEW.WIDTH - VIEW.PANEL_LEFT_X, this.reticleX + dx * this.reticleSpeed * dt));
      this.reticleY = Math.max(VIEW.PANEL_Y, Math.min(VIEW.PANEL_Y + VIEW.PANEL_H, this.reticleY + dy * this.reticleSpeed * dt));
    }
  }

  /**
   * Renders the virtual keyboard crosshair reticle when keyboard navigation is active
   */
  renderReticle(ctx, timeElapsed = 0) {
    if (!this.keyboardActive) return;

    const rx = this.reticleX;
    const ry = this.reticleY;
    const pulse = Math.sin(timeElapsed * 6) * 1.5;
    const radius = 18 + pulse;

    ctx.save();
    // Glowing ring
    Painter.circle(ctx, rx, ry, radius + 2, null, 'rgba(236, 201, 75, 0.45)', 3);
    Painter.circle(ctx, rx, ry, radius, null, '#ecc94b', 2);

    // 4 crosshair tick marks
    const tickLen = 6;
    Painter.line(ctx, rx - radius - tickLen, ry, rx - radius + 2, ry, '#ecc94b', 2);
    Painter.line(ctx, rx + radius - 2, ry, rx + radius + tickLen, ry, '#ecc94b', 2);
    Painter.line(ctx, rx, ry - radius - tickLen, rx, ry - radius + 2, '#ecc94b', 2);
    Painter.line(ctx, rx, ry + radius - 2, rx, ry + radius + tickLen, '#ecc94b', 2);

    // Center precision dot
    Painter.circle(ctx, rx, ry, 2.5, '#ffffff');
    ctx.restore();
  }
}
