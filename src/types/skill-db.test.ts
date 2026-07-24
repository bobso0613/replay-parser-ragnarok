import { describe, it, expect } from 'vitest';
import type { ISkill } from './skill-db';

describe('skill-db types', () => {
  it('should define ISkill interface', () => {
    const skillExample: ISkill = {
      Id: 1,
      Name: 'Basic Attack',
      Description: 'Basic attack',
      MaxLevel: 1,
    };

    expect(skillExample.Id).toBe(1);
    expect(skillExample.Name).toBe('Basic Attack');
  });

  it('should have proper type definitions', () => {
    const skillData: ISkill = {
      Id: 2,
      Name: 'Fireball',
      Description: 'Fireball spell',
      MaxLevel: 5,
    };

    expect(typeof skillData.Id).toBe('number');
    expect(typeof skillData.Name).toBe('string');
  });
});
