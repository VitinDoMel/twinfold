// Level state machine and progression logic

import { DifferenceEngine } from './differences.js';
import { PRNG } from './rng.js';
import { SCORING, VIEW } from './config.js';
import { HARBOR_CANDIDATE_DIFFERENCES } from './scenes/harbor.js';

export class LevelState {
  /**
   * @param {Object} levelDef Definition from config LEVELS
   * @param {number} seed Deterministic seed
   */
  constructor(levelDef, seed = 1) {
    this.levelDef = levelDef;
    this.seed = seed;
    this.rng = new PRNG(seed);

    this.timeLimit = levelDef.timeLimit || 90;
    this.timeRemaining = this.timeLimit;
    this.hintCharges = levelDef.hintCharges !== undefined ? levelDef.hintCharges : 3;
    
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.mistakes = 0;
    
    this.status = 'playing'; // 'playing' | 'cleared' | 'failed' | 'paused'
    this.foundIds = new Set();
    this.foundHistory = []; // Array of { diff, timestamp }
    this.activeHint = null; // { diff, duration, elapsed }

    // Resolve candidates based on level key
    let candidatePool = [];
    if (levelDef.key === 'harbor') {
      candidatePool = HARBOR_CANDIDATE_DIFFERENCES;
    } else {
      candidatePool = HARBOR_CANDIDATE_DIFFERENCES; // Fallback for testing
    }

    // Select differences deterministically
    const count = levelDef.differencesCount || 5;
    this.differences = DifferenceEngine.selectDifferences(candidatePool, count, this.rng);

    // Build active mutations map for the scene renderer
    this.activeMutations = new Map();
    for (const diff of this.differences) {
      this.activeMutations.set(diff.id, diff);
    }
  }

  /**
   * Updates timers and active effects
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    if (this.status !== 'playing') return;

    // Countdown timer
    this.timeRemaining -= dt;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.status = 'failed';
      return;
    }

    // Combo timer decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboTimer = 0;
        this.combo = 0;
      }
    }

    // Hint active duration decay
    if (this.activeHint) {
      this.activeHint.elapsed += dt;
      if (this.activeHint.elapsed >= this.activeHint.duration) {
        this.activeHint = null;
      }
    }
  }

  /**
   * Handles user click at global screen coordinates (1280x720)
   * @param {number} screenX 
   * @param {number} screenY 
   * @returns {Object} Event result
   */
  handleClick(screenX, screenY) {
    if (this.status !== 'playing') {
      return { handled: false, reason: 'not_playing' };
    }

    const { panel, localX, localY } = DifferenceEngine.screenToPanel(screenX, screenY);
    if (!panel) {
      return { handled: false, reason: 'outside_panels' };
    }

    // Hit test against unfound differences
    const hitDiff = DifferenceEngine.checkHit(localX, localY, this.differences, this.foundIds);

    if (hitDiff) {
      // SUCCESS HIT
      this.foundIds.add(hitDiff.id);
      this.foundHistory.push({
        id: hitDiff.id,
        diff: hitDiff,
        time: this.timeRemaining,
      });

      // Clear hint if this was the hinted one
      if (this.activeHint && this.activeHint.diff.id === hitDiff.id) {
        this.activeHint = null;
      }

      // Combo and scoring
      this.combo += 1;
      this.comboTimer = SCORING.COMBO_WINDOW_SEC;
      const points = Math.round(SCORING.BASE_FIND_POINTS * (1 + (this.combo - 1) * SCORING.COMBO_BONUS_MULTIPLIER));
      this.score += points;

      // Check win condition
      if (this.foundIds.size >= this.differences.length) {
        this.status = 'cleared';
        // Add time bonus
        const timeBonus = Math.round(this.timeRemaining * SCORING.TIME_BONUS_PER_SEC);
        this.score += timeBonus;
      }

      const screenPositions = DifferenceEngine.getScreenPositions(hitDiff);

      return {
        handled: true,
        hit: true,
        difference: hitDiff,
        panel,
        localX,
        localY,
        screenPositions,
        points,
        combo: this.combo,
        totalFound: this.foundIds.size,
        totalRemaining: this.differences.length - this.foundIds.size,
        cleared: this.status === 'cleared',
      };
    } else {
      // MISS / PENALTY
      this.combo = 0;
      this.comboTimer = 0;
      this.mistakes += 1;
      this.timeRemaining = Math.max(0, this.timeRemaining - VIEW.MISS_PENALTY_SEC);

      if (this.timeRemaining <= 0) {
        this.status = 'failed';
      }

      return {
        handled: true,
        hit: false,
        panel,
        localX,
        localY,
        screenX,
        screenY,
        penaltySec: VIEW.MISS_PENALTY_SEC,
        failed: this.status === 'failed',
      };
    }
  }

  /**
   * Activates a hint revealing one unfound difference
   * @returns {Object|null} Hinted difference or null if none available
   */
  useHint() {
    if (this.status !== 'playing') return null;
    if (this.hintCharges <= 0) return null;
    if (this.activeHint) return this.activeHint.diff; // Already active

    // Find all unfound differences
    const unfound = this.differences.filter(d => !this.foundIds.has(d.id));
    if (unfound.length === 0) return null;

    // Pick one
    const target = this.rng.pick(unfound);
    this.hintCharges -= 1;
    this.activeHint = {
      diff: target,
      duration: 6.0, // 6 seconds of pulsing locator
      elapsed: 0,
      screenPositions: DifferenceEngine.getScreenPositions(target),
    };

    return target;
  }

  /**
   * Computes star rating earned (1, 2, or 3 stars)
   */
  getStarsEarned() {
    if (this.status !== 'cleared') return 0;
    const ratio = this.timeRemaining / this.timeLimit;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.3) return 2;
    return 1;
  }

  /**
   * Returns formatted time "MM:SS"
   */
  getTimeString() {
    const totalSec = Math.ceil(this.timeRemaining);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
