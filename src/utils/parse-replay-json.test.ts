import { describe, expect, it } from 'vitest';
import { parseReplayOutput } from './parse-replay-json';

const basePlayer = {
  AID: 'player-1',
  name: 'Alice',
  jobId: 1,
  jobName: 'Swordman',
  totalDamageDealt: 100,
  totalDamageTaken: 0,
  totalSkillUsageCount: 1,
  totalItemUsageCount: 1,
  MVPCount: 1,
  deathCount: 1,
  skillInfo: { offensive: [], support: [] },
  itemInfo: [],
};

describe('parseReplayOutput', () => {
  it('returns empty breakdowns for null input', () => {
    expect(parseReplayOutput(null)).toEqual({
      breakdownPerMonsterUnique: [],
      breakdownPerPlayer: [],
      skillUsage: [],
      deathBreakdown: [],
      mvpBreakdown: [],
      skillUsageBreakdown: [],
      itemBreakdown: [],
    });
  });

  it('uses enriched player, skill, item, and monster names', () => {
    const result = parseReplayOutput({
      replayVersion: '1.0',
      players: [
        {
          ...basePlayer,
          skillInfo: {
            offensive: [
              {
                skillId: '10',
                skillName: 'Strike',
                skillDamageDealt: 100,
                skillUsageCount: 1,
                maxDamageDealt: 100,
                maxDamageMonsterId: '20',
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterIsMvp: true,
              },
            ],
            support: [{ skillId: '11', skillName: 'Heal', skillUsageCount: 2 }],
          },
          itemInfo: [{ itemId: '30', itemName: 'Potion', itemUsageCount: 1 }],
        },
      ],
      monsters: [],
    });
    expect(result.breakdownPerPlayer[0]).toMatchObject({
      jobName: 'Swordman',
      skillDamages: [{ skillInfo: 'Strike', highestMonsterName: 'Poring', highestIsMvp: true }],
    });
    expect(result.itemBreakdown[0]).toMatchObject({ itemName: 'Potion' });
    expect(result.deathBreakdown[0]).toMatchObject({ jobName: 'Swordman' });
    expect(result.mvpBreakdown[0]).toMatchObject({ jobName: 'Swordman' });
    expect(result.skillUsage[0]).toMatchObject({ skillInfo: 'Heal' });
  });

  it('aggregates monster battles using enriched skill and job names', () => {
    const result = parseReplayOutput({
      replayVersion: '1.0',
      players: [basePlayer],
      monsters: [
        {
          monsterId: '20',
          monsterName: 'Poring',
          isMvp: true,
          battleDuration: 10,
          battleStartTime: 1,
          battleEndTime: 2,
          taker: { playerId: 'player-1', playerName: 'Alice' },
          highestDamageInfo: {
            playerId: 'player-1',
            playerName: 'Alice',
            skillId: '10',
            skillName: 'Strike',
            damage: 100,
          },
          battleInfo: [
            {
              playerId: 'player-1',
              playerName: 'Alice',
              damageDealt: 100,
              skills: [{ skillId: '10', skillName: 'Strike', skillCount: 1, damageDealt: 100 }],
              highestDamageInfo: {
                playerId: 'player-1',
                playerName: 'Alice',
                skillId: '10',
                skillName: 'Strike',
                damageDealt: 100,
              },
            },
          ],
        },
      ],
    });
    expect(result.breakdownPerMonsterUnique[0]).toMatchObject({
      name: 'Poring',
      isMvp: true,
      highestDamage: { jobName: 'Swordman', skillName: 'Strike' },
    });
  });
});
