import { describe, it, expect } from 'vitest';
import type { BastionWave } from '@/types';
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

  it('folds skippable waves into the next non-skippable wave', () => {
    const waves = [
      {
        wave: 1,
        isSkippable: true,
        remindersSetup: [],
        monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }],
      },
      {
        wave: 2,
        isSkippable: true,
        remindersSetup: [],
        monsters: [{ monsterId: 2, monsterName: 'Fabre', isMvp: false }],
      },
      {
        wave: 3,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 3, monsterName: 'Lunatic', isMvp: false }],
      },
    ];

    expect(utils.mergeSkippableWaves(waves)).toEqual([
      {
        wave: 3,
        isSkippable: false,
        remindersSetup: [],
        monsters: [
          { monsterId: 1, monsterName: 'Poring', isMvp: false },
          { monsterId: 2, monsterName: 'Fabre', isMvp: false },
          { monsterId: 3, monsterName: 'Lunatic', isMvp: false },
        ],
      },
    ]);
  });

  it('folds trailing skippable waves into the last kept wave', () => {
    const waves = [
      {
        wave: 1,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }],
      },
      {
        wave: 2,
        isSkippable: true,
        remindersSetup: [],
        monsters: [{ monsterId: 2, monsterName: 'Fabre', isMvp: false }],
      },
    ];

    expect(utils.mergeSkippableWaves(waves)).toEqual([
      {
        wave: 1,
        isSkippable: false,
        remindersSetup: [],
        monsters: [
          { monsterId: 1, monsterName: 'Poring', isMvp: false },
          { monsterId: 2, monsterName: 'Fabre', isMvp: false },
        ],
      },
    ]);
  });

  it('returns waves unchanged when none are skippable', () => {
    const waves = [
      {
        wave: 1,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }],
      },
    ];

    expect(utils.mergeSkippableWaves(waves)).toEqual(waves);
  });

  it('hides waves 1-55 unless flagged isDangerousFloor', () => {
    const waves: BastionWave[] = [
      {
        wave: 30,
        isSkippable: false,
        remindersSetup: ['isDangerousFloor'],
        monsters: [{ monsterId: 1, monsterName: 'Eddga', isMvp: true }],
      },
      {
        wave: 40,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 2, monsterName: 'Poring', isMvp: false }],
      },
      {
        wave: 60,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 3, monsterName: 'Fabre', isMvp: false }],
      },
    ];

    expect(utils.hideNonDangerousEarlyWaves(waves)).toEqual([waves[0], waves[2]]);
  });

  it('keeps only waves flagged isDangerousFloor', () => {
    const waves: BastionWave[] = [
      {
        wave: 30,
        isSkippable: false,
        remindersSetup: ['isDangerousFloor'],
        monsters: [{ monsterId: 1, monsterName: 'Eddga', isMvp: true }],
      },
      {
        wave: 31,
        isSkippable: false,
        remindersSetup: [],
        monsters: [{ monsterId: 2, monsterName: 'Poring', isMvp: false }],
      },
    ];

    expect(utils.showOnlyDangerousFloorWaves(waves)).toEqual([waves[0]]);
  });

  it('reduces a wave to its MVP monsters only', () => {
    const wave: BastionWave = {
      wave: 15,
      isSkippable: false,
      remindersSetup: ['isMvpFloor'],
      monsters: [
        { monsterId: 1, monsterName: 'Moonlight Flower', isMvp: true },
        { monsterId: 2, monsterName: 'Skeleton', isMvp: false },
      ],
    };

    expect(utils.getMvpOnlyMonsters(wave)).toEqual([wave.monsters[0]]);
  });

  it("resolves to 'GENERIC' when a wave has monsters but no MVP", () => {
    const wave: BastionWave = {
      wave: 3,
      isSkippable: false,
      remindersSetup: [],
      monsters: [{ monsterId: 1, monsterName: 'Lunatic', isMvp: false }],
    };

    expect(utils.getMvpOnlyMonsters(wave)).toBe('GENERIC');
  });

  it('returns the full monster list for dangerous floors regardless of MVP status', () => {
    const wave: BastionWave = {
      wave: 30,
      isSkippable: false,
      remindersSetup: ['isDangerousFloor'],
      monsters: [{ monsterId: 1, monsterName: 'Plasma', isMvp: false }],
    };

    expect(utils.getMvpOnlyMonsters(wave)).toEqual(wave.monsters);
  });

  it('builds reminder notes with emoji and label for a wave', () => {
    const wave: BastionWave = {
      wave: 75,
      isSkippable: false,
      remindersSetup: ['isDangerousFloor', 'restockFlag', 'isMvpFloor'],
      monsters: [],
    };

    expect(utils.getWaveNotes(wave)).toEqual([
      { emoji: '⚠️', label: 'Dangerous floor' },
      { emoji: '📦', label: 'Restock' },
      { emoji: '👺', label: 'MVP floor' },
    ]);
  });

  it('returns an empty array when a wave has no notable reminders', () => {
    const wave: BastionWave = {
      wave: 1,
      isSkippable: true,
      remindersSetup: [],
      monsters: [],
    };

    expect(utils.getWaveNotes(wave)).toEqual([]);
  });
});
