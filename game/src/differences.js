// Difference generator, mutation manager, and hit-testing engine

import { VIEW } from './config.js';

export class DifferenceEngine {
  /**
   * Selects differences for a level based on candidate pool and target count.
   * @param {Array} candidatePool Array of difference definitions
   * @param {number} count Number of differences to pick
   * @param {import('./rng.js').PRNG} rng Seeded PRNG
   * @returns {Array} Selected differences
   */
  static selectDifferences(candidatePool, count, rng) {
    if (!candidatePool || candidatePool.length === 0) return [];
    const poolCopy = [...candidatePool];
    // If we have a specific target count, sample distinct differences
    return rng.sample(poolCopy, Math.min(count, poolCopy.length));
  }

  /**
   * Tests whether a local panel coordinate hits any active, unfound difference.
   * @param {number} localX Coordinate relative to panel (0..PANEL_W)
   * @param {number} localY Coordinate relative to panel (0..PANEL_H)
   * @param {Array} differences List of level differences
   * @param {Set<string>} foundIds Set of already found difference IDs
   * @param {number} tolerance Additional leeway in pixels
   * @returns {Object|null} The hit difference definition or null
   */
  static checkHit(localX, localY, differences, foundIds, tolerance = 16) {
    for (const diff of differences) {
      if (foundIds.has(diff.id)) continue;

      const dx = localX - diff.x;
      const dy = localY - diff.y;
      const dist = Math.hypot(dx, dy);
      const hitRadius = (diff.radius || VIEW.HIT_RADIUS) + tolerance;

      if (dist <= hitRadius) {
        return diff;
      }
    }
    return null;
  }

  /**
   * Maps global screen coordinates (1280x720 space) to panel local coordinates.
   * @param {number} screenX 
   * @param {number} screenY 
   * @returns {{ panel: 'left'|'right'|null, localX: number, localY: number }}
   */
  static screenToPanel(screenX, screenY) {
    // Check if within vertical bounds of play panels
    if (screenY < VIEW.PANEL_Y || screenY > VIEW.PANEL_Y + VIEW.PANEL_H) {
      return { panel: null, localX: 0, localY: 0 };
    }

    // Left panel check
    if (screenX >= VIEW.PANEL_LEFT_X && screenX <= VIEW.PANEL_LEFT_X + VIEW.PANEL_W) {
      return {
        panel: 'left',
        localX: screenX - VIEW.PANEL_LEFT_X,
        localY: screenY - VIEW.PANEL_Y,
      };
    }

    // Right panel check
    if (screenX >= VIEW.PANEL_RIGHT_X && screenX <= VIEW.PANEL_RIGHT_X + VIEW.PANEL_W) {
      return {
        panel: 'right',
        localX: screenX - VIEW.PANEL_RIGHT_X,
        localY: screenY - VIEW.PANEL_Y,
      };
    }

    return { panel: null, localX: 0, localY: 0 };
  }

  /**
   * Gets absolute screen coordinates for a difference on both left and right panels.
   * @param {Object} diff Difference object
   * @returns {{ left: {x: number, y: number}, right: {x: number, y: number} }}
   */
  static getScreenPositions(diff) {
    return {
      left: {
        x: VIEW.PANEL_LEFT_X + diff.x,
        y: VIEW.PANEL_Y + diff.y,
      },
      right: {
        x: VIEW.PANEL_RIGHT_X + diff.x,
        y: VIEW.PANEL_Y + diff.y,
      },
    };
  }
}
