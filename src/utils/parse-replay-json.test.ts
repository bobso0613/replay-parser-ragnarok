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
      playerDetails: {
        playerId: 'player-1',
        playerName: 'Alice',
        jobId: 1,
        jobName: 'Swordman',
        offensiveSkills: [
          { skillId: '10', name: 'Strike', totalDamage: 100, hitCount: 1, highestDamage: 100 },
        ],
        defensiveSkills: [{ skillId: '11', name: 'Heal', totalUsage: 2 }],
        itemsUsed: [{ itemId: '30', name: 'Potion', amount: 1 }],
        monstersKilled: [],
      },
    });
    expect(result.itemBreakdown[0]).toMatchObject({ itemName: 'Potion' });
    expect(result.deathBreakdown[0]).toMatchObject({ jobName: 'Swordman' });
    expect(result.mvpBreakdown[0]).toMatchObject({ jobName: 'Swordman' });
    expect(result.skillUsage[0]).toMatchObject({ skillInfo: 'Heal' });
    expect(
      result.breakdownPerPlayer[0]?.playerDetails.statistics.find(
        (statistic) => statistic.label === 'Highest Burst'
      )
    ).toMatchObject({
      value: { skillId: '10', skillName: 'Strike', monsterName: 'Poring', damage: 100 },
    });
  });

  it('aggregates monster battles using enriched skill and job names', () => {
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
            support: [],
          },
        },
      ],
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
        {
          monsterId: '20',
          monsterName: 'Poring',
          isMvp: true,
          battleDuration: 10,
          battleStartTime: 3,
          battleEndTime: 4,
          taker: { playerId: 'player-1', playerName: 'Alice' },
          highestDamageInfo: {
            playerId: 'player-1',
            playerName: 'Alice',
            skillId: '10',
            skillName: 'Strike',
            damage: 250,
          },
          battleInfo: [
            {
              playerId: 'player-1',
              playerName: 'Alice',
              damageDealt: 250,
              skills: [{ skillId: '10', skillName: 'Strike', skillCount: 1, damageDealt: 250 }],
              highestDamageInfo: {
                playerId: 'player-1',
                playerName: 'Alice',
                skillId: '10',
                skillName: 'Strike',
                damage: 250,
              },
            },
          ],
        },
        {
          monsterId: '21',
          monsterName: 'Lunatic',
          isMvp: false,
          battleDuration: 10,
          battleStartTime: 5,
          battleEndTime: 6,
          taker: { playerId: 'player-1', playerName: 'Alice' },
          highestDamageInfo: {
            playerId: 'player-1',
            playerName: 'Alice',
            skillId: '10',
            skillName: 'Strike',
            damage: 50,
          },
          battleInfo: [
            {
              playerId: 'player-1',
              playerName: 'Alice',
              damageDealt: 50,
              skills: [{ skillId: '10', skillName: 'Strike', skillCount: 1, damageDealt: 50 }],
              highestDamageInfo: {
                playerId: 'player-1',
                playerName: 'Alice',
                skillId: '10',
                skillName: 'Strike',
                damage: 50,
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
    expect(
      result.breakdownPerPlayer[0]?.playerDetails.statistics.find(
        (statistic) => statistic.label === 'MVP Damage'
      )
    ).toMatchObject({ value: 350 });
    expect(
      result.breakdownPerPlayer[0]?.playerDetails.statistics.find(
        (statistic) => statistic.label === 'Monsters Killed'
      )
    ).toMatchObject({ value: 3 });
    expect(
      result.breakdownPerPlayer[0]?.playerDetails.statistics.find(
        (statistic) => statistic.label === 'MVPs Killed'
      )
    ).toMatchObject({ value: 1 });
    expect(result.breakdownPerPlayer[0]?.playerDetails.monstersKilled).toEqual([
      {
        monsterId: '20',
        name: 'Poring',
        isMvp: true,
        amount: 2,
        damage: 350,
        highestBurst: {
          monsterId: '20',
          monsterName: 'Poring',
          isMvp: true,
          skillId: '10',
          skillName: 'Strike',
          damage: 250,
        },
        skillBreakdown: [
          {
            skillId: '10',
            name: 'Strike',
            totalDamage: 350,
            hitCount: 2,
            highestDamage: 250,
          },
        ],
      },
      {
        monsterId: '21',
        name: 'Lunatic',
        isMvp: false,
        amount: 1,
        damage: 50,
        highestBurst: {
          monsterId: '21',
          monsterName: 'Lunatic',
          isMvp: false,
          skillId: '10',
          skillName: 'Strike',
          damage: 50,
        },
        skillBreakdown: [
          {
            skillId: '10',
            name: 'Strike',
            totalDamage: 50,
            hitCount: 1,
            highestDamage: 50,
          },
        ],
      },
    ]);
  });
});
