// game/src/rng.js
// Deterministic pseudorandom number generator (Mulberry32) and utility sampling helpers.

export class RNG {
  constructor(seed = 1) {
    this.initialSeed = seed;
    this.state = this._normalizeSeed(seed);
  }

  _normalizeSeed(seed) {
    if (typeof seed === 'string') {
      let hash = 2166136261 >>> 0;
      for (let i = 0; i < seed.length; i++) {
        hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619) >>> 0;
      }
      return hash || 1;
    }
    return (Number(seed) >>> 0) || 1;
  }

  // Returns float in [0, 1)
  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Integer in [min, max] inclusive
  int(min, max) {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  // Float in [min, max)
  float(min, max) {
    return min + this.next() * (max - min);
  }

  // Boolean with probability p
  bool(p = 0.5) {
    return this.next() < p;
  }

  // Random item from array
  choice(array) {
    if (!array || array.length === 0) return null;
    return array[this.int(0, array.length - 1)];
  }

  // Fisher-Yates shuffle returning a new shuffled array
  shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  // Sample k distinct elements without replacement
  sample(array, k) {
    if (k >= array.length) return this.shuffle(array);
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, k);
  }

  // Gaussian distributed random number (Box-Muller)
  gaussian(mean = 0, stdDev = 1) {
    let u = 0;
    let v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
  }

  // Reset to initial seed
  reset() {
    this.state = this._normalizeSeed(this.initialSeed);
  }

  // Set brand new seed
  setSeed(seed) {
    this.initialSeed = seed;
    this.state = this._normalizeSeed(seed);
  }
}

// Global default PRNG instance
export const defaultRNG = new RNG(1337);
