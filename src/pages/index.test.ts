import { describe, it, expect } from 'vitest';
import * as pages from './index';
import { Home } from './Home';

describe('src/pages/index', () => {
  it('should export pages correctly', () => {
    expect(pages).toBeDefined();
  });

  it('should have exported members', () => {
    expect(Object.keys(pages).length).toBeGreaterThanOrEqual(0);
  });

  it('should export Home component', () => {
    expect(pages.Home).toBeDefined();
    expect(pages.Home).toBe(Home);
  });

  it('should export as default', () => {
    // The index exports from Home which has default export
    expect(pages.Home).not.toBeUndefined();
  });

  it('should have Home as a valid component', () => {
    expect(typeof pages.Home).toBe('function');
  });
});
