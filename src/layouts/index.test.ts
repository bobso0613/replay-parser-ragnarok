import { describe, it, expect } from 'vitest';
import * as layouts from './index';

describe('src/layouts/index', () => {
  it('should export layouts correctly', () => {
    expect(layouts).toBeDefined();
  });

  it('should have exported members', () => {
    expect(layouts.BaseLayout).toBeDefined();
  });
});
