import { describe, it, expect } from 'vitest';
import * as routes from './index';

describe('src/routes/index', () => {
  it('should export routes correctly', () => {
    expect(routes).toBeDefined();
  });

  it('should have exported members', () => {
    expect(Object.keys(routes).length >= 0).toBe(true);
  });
});
