// game/src/audio.js
// Procedural WebAudio sound effects synthesizer (zero external sound files).

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this._initialized = false;
  }

  init() {
    if (this._initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this._initialized = true;
      }
    } catch {
      // AudioContext unavailable or restricted in non-interactive environment
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.28, this.ctx.currentTime);
    }
    return this.muted;
  }

  // Ascending cheerful dual-chime arpeggio on hit
  playSuccess(combo = 1) {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const baseFreq = 523.25 * Math.min(1 + (combo - 1) * 0.1, 1.8); // C5 upwards with combo

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.25, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.0, now + 0.22);

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start(now);
    osc1.stop(now + 0.36);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.46);
  }

  // Low dull error thud / buzzer
  playError() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  // Magical celestial twinkle for hint
  playHint() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const freqs = [880, 1108.73, 1318.51, 1760];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.31);
    });
  }

  // Triumphant fanfare when completing level
  playLevelClear() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.5, d: 0.5, t: 0.36 },
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + n.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.d + 0.01);
    });
  }

  // Descending minor chord for timeout
  playGameOver() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const chords = [392.0, 311.13, 261.63];

    chords.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 0.85, now + 0.8);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.86);
    });
  }

  // Subtle clock tick warning
  playTick() {
    if (this.muted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

export const sound = new SoundManager();
