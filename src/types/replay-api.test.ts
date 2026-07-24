import { describe, it, expect } from 'vitest';
import type { IReplayData } from './replay-api';

describe('replay-api types', () => {
  it('should define IReplayData interface', () => {
    const replayExample: IReplayData = {
      replayVersion: '1.0',
      players: [],
      monsters: [],
    };

    expect(replayExample).toHaveProperty('players');
    expect(Array.isArray(replayExample.players)).toBe(true);
  });

  it('should have proper type structure', () => {
    const replayData: IReplayData = {
      replayVersion: '1.0',
      players: [],
      monsters: [],
    };

    expect(typeof replayData).toBe('object');
  });
});
