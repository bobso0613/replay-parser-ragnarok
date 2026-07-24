import { describe, it, expect } from 'vitest';
import * as constants from './index';

describe('src/constants/index', () => {
  it('should export constants correctly', () => {
    expect(constants).toBeDefined();
  });

  it('should have exported constants', () => {
    const exported = Object.keys(constants);
    expect(exported.length).toBeGreaterThan(0);
  });
});
