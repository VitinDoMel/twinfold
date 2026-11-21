// game/src/level.js
// Manages the state, timer, differences, scoring, and interaction logic for a single level.

import { GAMEPLAY } from './config.js';
import { DifferenceEngine } from './differences.js';

export class Level {
  constructor(config, sceneData, rng) {
    this.config = config;
    this.levelIndex = config.index;
    this.name = config.name;
    this.subtitle = config.subtitle;
    this.sceneData = sceneData;
    this.rng = rng;

    this.timeTotal = config.timeLimit;
    this.timeLeft = config.timeLimit;

    // Deterministically pick differences
    this.differences = DifferenceEngine.selectDifferences(
      sceneData.candidateDifferences,
      config.differencesCount,
      rng
    );

    this.foundCount = 0;
    this.foundIds = new Set();

    this.hintsRemaining = GAMEPLAY.maxHintsPerLevel;
    this.activeHint = null;
    this.hintTimer = 0;

    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;

    this.mistakesCount = 0;
    this.isCompleted = false;
    this.isFailed = false;
  }

  update(dt) {
    if (this.isCompleted || this.isFailed) return;

    // Decrement timer
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.isFailed = true;
      return;
    }

    // Combo timer decay
    if (this.combo > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // Active hint timer decay
    if (this.activeHint) {
      this.hintTimer -= dt;
      if (this.hintTimer <= 0) {
        this.activeHint = null;
      }
    }
  }

  handleClick(panelLocalX, panelLocalY) {
    if (this.isCompleted || this.isFailed) return null;

    const hitDiff = DifferenceEngine.testHit(this.differences, panelLocalX, panelLocalY);

    if (hitDiff) {
      // SUCCESSFUL HIT
      hitDiff.found = true;
      hitDiff.foundTime = this.timeTotal - this.timeLeft;
      this.foundIds.add(hitDiff.id);
      this.foundCount++;

      // If active hint was pointing here, dismiss hint
      if (this.activeHint && this.activeHint.id === hitDiff.id) {
        this.activeHint = null;
      }

      // Calculate score with combo
      const gainedScore = GAMEPLAY.baseHitScore * this.combo;
      this.score += gainedScore;

      // Update combo
      const prevCombo = this.combo;
      this.combo = Math.min(GAMEPLAY.maxComboMultiplier, this.combo + 1);
      this.comboTimer = GAMEPLAY.comboWindowSeconds;

      // Check level completion
      if (this.foundCount >= this.differences.length) {
        this.isCompleted = true;
        // Time bonus
        const timeBonus = Math.floor(this.timeLeft) * GAMEPLAY.timeBonusPerSecond;
        this.score += timeBonus;
      }

      return {
        type: 'hit',
        difference: hitDiff,
        scoreGained: gainedScore,
        combo: prevCombo,
        completed: this.isCompleted,
      };
    } else {
      // MISS / ERROR
      this.mistakesCount++;
      this.combo = 1;
      this.comboTimer = 0;
      this.timeLeft = Math.max(0, this.timeLeft - GAMEPLAY.errorPenaltySeconds);

      if (this.timeLeft <= 0) {
        this.isFailed = true;
      }

      return {
        type: 'miss',
        x: panelLocalX,
        y: panelLocalY,
        penalty: GAMEPLAY.errorPenaltySeconds,
        failed: this.isFailed,
      };
    }
  }

  useHint() {
    if (this.hintsRemaining <= 0 || this.activeHint || this.isCompleted || this.isFailed) {
      return null;
    }

    // Find all currently unfound differences
    const unfound = this.differences.filter((d) => !d.found);
    if (unfound.length === 0) return null;

    // Pick one
    const target = this.rng.choice(unfound);
    this.hintsRemaining--;
    this.activeHint = target;
    this.hintTimer = GAMEPLAY.hintDurationSeconds;

    return target;
  }
}
