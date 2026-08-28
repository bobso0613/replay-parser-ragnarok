import { describe, it, expect } from 'vitest';
import * as utils from './index';

describe('src/utils/index', () => {
  it('should export utilities correctly', () => {
    expect(utils).toBeDefined();
  });

  it('should have exported members', () => {
    const exported = Object.keys(utils);
    expect(exported.length).toBeGreaterThan(0);
  });

  it('formats MVP and non-MVP monster names', () => {
    expect(utils.getMonsterName('Poring', true)).toBe('Poring (MVP)');
    expect(utils.getMonsterName('Poring', false)).toBe('Poring ');
  });
});
