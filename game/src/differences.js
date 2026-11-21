// game/src/differences.js
// Difference mutation engine, candidate selection, hit testing, and state verification.

import { GAMEPLAY } from './config.js';

export class DifferenceEngine {
  /**
   * Selects N differences deterministically using the provided RNG
   * and prepares their operational runtime structures.
   */
  static selectDifferences(candidates, count, rng) {
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidate differences provided to DifferenceEngine');
    }
    const safeCount = Math.min(count, candidates.length);
    const chosen = rng.sample(candidates, safeCount);

    return chosen.map((c, index) => ({
      index,
      id: c.id,
      name: c.name,
      x: c.x,
      y: c.y,
      radius: c.radius || 24,
      mutationType: c.mutationType || 'color', // 'color' | 'swap' | 'disappear' | 'size' | 'rotate'
      description: c.description || '',
      render: c.render,
      found: false,
      foundTime: null,
    }));
  }

  /**
   * Hit test a click coordinate against all unfound differences.
   * Returns matching difference or null.
   */
  static testHit(differences, clickX, clickY) {
    const margin = GAMEPLAY.hitToleranceRadiusMargin;

    for (const diff of differences) {
      if (diff.found) continue;

      const dx = clickX - diff.x;
      const dy = clickY - diff.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const effectiveRadius = diff.radius + margin;

      if (dist <= effectiveRadius) {
        return diff;
      }
    }
    return null;
  }

  /**
   * Helper to check if a point is within panel bounds.
   */
  static isInsidePanel(x, y, panel) {
    return (
      x >= panel.x &&
      x <= panel.x + panel.width &&
      y >= panel.y &&
      y <= panel.y + panel.height
    );
  }

  /**
   * Convert global canvas coordinates (cx, cy) to panel-local coordinates (px, py).
   */
  static toPanelLocal(cx, cy, panel) {
    return {
      x: cx - panel.x,
      y: cy - panel.y,
    };
  }
}
