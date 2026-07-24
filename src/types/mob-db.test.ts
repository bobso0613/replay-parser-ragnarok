import { describe, it, expect } from 'vitest';
import type { IMob } from './mob-db';

describe('mob-db types', () => {
  it('should define IMob interface', () => {
    const mobExample: IMob = {
      Id: 1001,
      AegisName: 'Poring',
      Name: 'Poring',
    };

    expect(mobExample.Id).toBe(1001);
    expect(mobExample.Name).toBe('Poring');
  });

  it('should have proper type definitions', () => {
    const mobData: IMob = {
      Id: 1002,
      AegisName: 'Lunatic',
      Name: 'Lunatic',
    };

    expect(typeof mobData.Id).toBe('number');
    expect(typeof mobData.Name).toBe('string');
  });
});
