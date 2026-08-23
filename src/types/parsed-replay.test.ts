import { describe, it, expect } from 'vitest';
import type { IParsedReplay } from './parsed-replay';

describe('parsed-replay types', () => {
  it('should define IParsedReplay interface', () => {
    const replayExample: IParsedReplay = {
      breakdownPerMonsterUnique: [],
      breakdownPerPlayer: [],
      skillUsage: [],
      deathBreakdown: [],
      mvpBreakdown: [],
      skillUsageBreakdown: [],
      itemBreakdown: [],
    };

    expect(replayExample).toHaveProperty('breakdownPerMonsterUnique');
    expect(replayExample).toHaveProperty('breakdownPerPlayer');
    expect(replayExample).toHaveProperty('skillUsage');
    expect(replayExample).toHaveProperty('deathBreakdown');
    expect(replayExample).toHaveProperty('mvpBreakdown');
    expect(replayExample).toHaveProperty('skillUsageBreakdown');
    expect(replayExample).toHaveProperty('itemBreakdown');
  });

  it('should have proper array structures', () => {
    const replay: IParsedReplay = {
      breakdownPerMonsterUnique: [],
      breakdownPerPlayer: [],
      skillUsage: [],
      deathBreakdown: [],
      mvpBreakdown: [],
      skillUsageBreakdown: [],
      itemBreakdown: [],
    };

    expect(Array.isArray(replay.breakdownPerMonsterUnique)).toBe(true);
    expect(Array.isArray(replay.breakdownPerPlayer)).toBe(true);
    expect(Array.isArray(replay.skillUsage)).toBe(true);
    expect(Array.isArray(replay.deathBreakdown)).toBe(true);
    expect(Array.isArray(replay.mvpBreakdown)).toBe(true);
    expect(Array.isArray(replay.skillUsageBreakdown)).toBe(true);
    expect(Array.isArray(replay.itemBreakdown)).toBe(true);
  });
});
