// Deterministic Pseudo-Random Number Generator (Mulberry32)
// Allows reproducible procedural scene layouts and differences generation for screenshots.

export class PRNG {
  /**
   * @param {number} seed 32-bit unsigned integer
   */
  constructor(seed = 1) {
    this.initialSeed = seed >>> 0;
    this.s = this.initialSeed;
  }

  reset(seed = this.initialSeed) {
    this.initialSeed = seed >>> 0;
    this.s = this.initialSeed;
  }

  /**
   * Generates a floating point number in [0, 1)
   * @returns {number}
   */
  next() {
    this.s |= 0;
    this.s = (this.s + 0x6d2b79f5) | 0;
    let t = Math.imul(this.s ^ (this.s >>> 15), 1 | this.s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Float between min and max
   */
  range(min, max) {
    return min + this.next() * (max - min);
  }

  /**
   * Integer between min (inclusive) and max (inclusive)
   */
  int(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(lo + this.next() * (hi - lo + 1));
  }

  /**
   * Pick one random element from an array
   */
  pick(array) {
    if (!array || array.length === 0) return null;
    const index = Math.floor(this.next() * array.length);
    return array[index];
  }

  /**
   * Pick K distinct elements from array
   */
  sample(array, k) {
    if (!array || array.length === 0) return [];
    const copy = [...array];
    const result = [];
    const count = Math.min(k, copy.length);
    for (let i = 0; i < count; i++) {
      const idx = this.int(0, copy.length - 1);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return result;
  }

  /**
   * Shuffles an array in place (Fisher-Yates)
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Boolean with given probability of being true
   */
  bool(chance = 0.5) {
    return this.next() < chance;
  }
}

// Global default PRNG instance
export const rng = new PRNG(1337);
