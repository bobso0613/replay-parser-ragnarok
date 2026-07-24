import { describe, it, expect, beforeEach } from 'vitest';
import { parseReplayOutput } from './parse-replay-json';
import type { IReplayData, ISkill, IMob } from '@/types';

describe('parse-replay-json', () => {
  describe('parseReplayOutput', () => {
    let mockReplayData: IReplayData;
    let mockSkillDb: ISkill[];
    let mockMobDb: IMob[];

    beforeEach(() => {
      mockReplayData = {
        replayVersion: '1.0',
        players: [
          {
            AID: 'player1',
            name: 'TestPlayer',
            jobId: 0,
            totalDamageDealt: 1000,
            totalDamageTaken: 0,
            totalSkillUsageCount: 0,
            totalItemUsageCount: 0,
            MVPCount: 0,
            deathCount: 0,
            skillInfo: { offensive: [], support: [] },
            itemInfo: [],
          },
        ],
        monsters: [],
      } as IReplayData;

      mockSkillDb = [
        {
          Id: 1,
          Name: 'Slash',
          Description: 'Basic slash attack',
          MaxLevel: 10,
        },
        {
          Id: 2,
          Name: 'Heal',
          Description: 'Healing spell',
          MaxLevel: 10,
        },
      ];
      mockMobDb = [
        {
          Id: 1001,
          AegisName: 'poring',
          Name: 'Poring',
          Modes: { Mvp: false },
        },
        {
          Id: 1002,
          AegisName: 'mvp_dragon',
          Name: 'Dragon Lord',
          Modes: { Mvp: true },
        },
      ];
    });

    it('should return a valid parsed replay structure', () => {
      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('breakdownPerMonsterUnique');
      expect(result).toHaveProperty('breakdownPerPlayer');
      expect(result).toHaveProperty('skillUsage');
      expect(result).toHaveProperty('deathBreakdown');
      expect(result).toHaveProperty('mvpBreakdown');
      expect(result).toHaveProperty('skillUsageBreakdown');
    });

    it('should handle null replay data', () => {
      const result = parseReplayOutput(null, mockSkillDb, mockMobDb);

      expect(result).toBeDefined();
      expect(result.breakdownPerPlayer).toEqual([]);
    });

    it('should handle null skill database', () => {
      const result = parseReplayOutput(mockReplayData, null, mockMobDb);

      expect(result).toBeDefined();
    });

    it('should handle null mob database', () => {
      const result = parseReplayOutput(mockReplayData, mockSkillDb, null);

      expect(result).toBeDefined();
    });

    it('should process multiple players', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Player1',
          jobId: 0,
          totalDamageDealt: 1000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
        {
          AID: 'player2',
          name: 'Player2',
          jobId: 1,
          totalDamageDealt: 2000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result).toBeDefined();
      expect(result.breakdownPerPlayer).toBeDefined();
    });

    it('should track player deaths', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'TestPlayer',
          jobId: 2,
          totalDamageDealt: 500,
          totalDamageTaken: 1000,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 3,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.deathBreakdown).toHaveLength(1);
      expect(result.deathBreakdown[0].deathCount).toBe(3);
      expect(result.deathBreakdown[0].playerName).toBe('TestPlayer');
    });

    it('should track player MVPs', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'TestPlayer',
          jobId: 0,
          totalDamageDealt: 5000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 5,
          deathCount: 0,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.mvpBreakdown).toHaveLength(1);
      expect(result.mvpBreakdown[0].mvpCount).toBe(5);
    });

    it('should track offensive skill usage and damage', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Warrior',
          jobId: 0,
          totalDamageDealt: 3000,
          totalDamageTaken: 100,
          totalSkillUsageCount: 50,
          totalItemUsageCount: 0,
          MVPCount: 2,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 25,
                skillDamageDealt: 2500,
                maxDamageDealt: 500,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      expect(result.breakdownPerPlayer[0].skillDamages).toHaveLength(1);
      expect(result.breakdownPerPlayer[0].skillDamages[0].skillId).toBe('1');
      expect(result.breakdownPerPlayer[0].skillDamages[0].damage).toBe(2500);
      expect(result.breakdownPerPlayer[0].highestDamage.damage).toBe(500);
    });

    it('should track support skill usage', () => {
      mockReplayData.players = [
        {
          AID: 'priest1',
          name: 'Priest',
          jobId: 4,
          totalDamageDealt: 100,
          totalDamageTaken: 0,
          totalSkillUsageCount: 30,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: {
            offensive: [],
            support: [
              {
                skillId: '2',
                skillUsageCount: 30,
                skillDamageDealt: 0,
                maxDamageDealt: 0,
                maxDamageMonsterName: '',
                maxDamageMonsterId: '',
              },
            ],
          },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.skillUsage).toHaveLength(1);
      expect(result.skillUsage[0].skillId).toBe('2');
      expect(result.skillUsage[0].skillUsageCount).toBe(30);
      expect(result.skillUsageBreakdown).toHaveLength(1);
      expect(result.skillUsageBreakdown[0].skillUsageCount).toBe(30);
    });

    it('should sort results by damage/count', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Weak Attacker',
          jobId: 0,
          totalDamageDealt: 500,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 1,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
        {
          AID: 'player2',
          name: 'Strong Attacker',
          jobId: 1,
          totalDamageDealt: 5000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 2,
          deathCount: 3,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.deathBreakdown[0].deathCount).toBe(3);
      expect(result.mvpBreakdown[0].mvpCount).toBe(2);
    });

    it('should process monster battles', () => {
      mockReplayData.monsters = [
        {
          monsterId: '1001',
          monsterName: 'Poring',
          battleDuration: 60,
          battleStartTime: 0,
          battleEndTime: 60,
          taker: {
            playerId: 'player1',
            playerName: 'Warrior',
          },
          highestDamageInfo: {
            playerId: 'player1',
            playerName: 'Warrior',
            skillId: '1',
            damage: 500,
          },
          battleInfo: [
            {
              playerId: 'player1',
              playerName: 'Warrior',
              damageDealt: 1000,
              highestDamageInfo: {
                playerId: 'player1',
                playerName: 'Warrior',
                skillId: '1',
                damageDealt: 500,
              },
              skills: [
                {
                  skillId: '1',
                  skillCount: 10,
                  damageDealt: 1000,
                },
              ],
            },
          ],
        },
      ];

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerMonsterUnique).toHaveLength(1);
      expect(result.breakdownPerMonsterUnique[0].name).toBe('Poring');
      expect(result.breakdownPerMonsterUnique[0].damage).toBe(1000);
    });

    it('should track MVP monster battles', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Warrior',
          jobId: 0,
          totalDamageDealt: 5000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 1,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 50,
                skillDamageDealt: 5000,
                maxDamageDealt: 1000,
                maxDamageMonsterName: 'Dragon Lord',
                maxDamageMonsterId: '1002',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;
      mockReplayData.monsters = [
        {
          monsterId: '1002',
          monsterName: 'Dragon Lord',
          battleDuration: 120,
          battleStartTime: 0,
          battleEndTime: 120,
          taker: {
            playerId: 'player1',
            playerName: 'Warrior',
          },
          highestDamageInfo: {
            playerId: 'player1',
            playerName: 'Warrior',
            skillId: '1',
            damage: 1000,
          },
          battleInfo: [
            {
              playerId: 'player1',
              playerName: 'Warrior',
              damageDealt: 5000,
              highestDamageInfo: {
                playerId: 'player1',
                playerName: 'Warrior',
                skillId: '1',
                damageDealt: 1000,
              },
              skills: [
                {
                  skillId: '1',
                  skillCount: 50,
                  damageDealt: 5000,
                },
              ],
            },
          ],
        },
      ];

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerMonsterUnique[0].isMvp).toBe(true);
      expect(result.breakdownPerPlayer[0].totalDamageDealthMvps).toBe(5000);
    });

    it('should handle multiple skill damage per battle', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Swordsman',
          jobId: 0,
          totalDamageDealt: 3000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 30,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 30,
                skillDamageDealt: 3000,
                maxDamageDealt: 300,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;
      mockReplayData.monsters = [
        {
          monsterId: '1001',
          monsterName: 'Poring',
          battleDuration: 30,
          battleStartTime: 0,
          battleEndTime: 30,
          taker: {
            playerId: 'player1',
            playerName: 'Swordsman',
          },
          highestDamageInfo: {
            playerId: 'player1',
            playerName: 'Swordsman',
            skillId: '1',
            damage: 300,
          },
          battleInfo: [
            {
              playerId: 'player1',
              playerName: 'Swordsman',
              damageDealt: 3000,
              highestDamageInfo: {
                playerId: 'player1',
                playerName: 'Swordsman',
                skillId: '1',
                damageDealt: 300,
              },
              skills: [
                {
                  skillId: '1',
                  skillCount: 30,
                  damageDealt: 3000,
                },
              ],
            },
          ],
        },
      ];

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerMonsterUnique[0].skillDamages).toHaveLength(1);
      expect(result.breakdownPerMonsterUnique[0].playerDamages).toHaveLength(1);
    });

    it('should filter players with no damage', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Active',
          jobId: 0,
          totalDamageDealt: 1000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 10,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 10,
                skillDamageDealt: 1000,
                maxDamageDealt: 200,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
        {
          AID: 'player2',
          name: 'Inactive',
          jobId: 1,
          totalDamageDealt: 0,
          totalDamageTaken: 0,
          totalSkillUsageCount: 0,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: { offensive: [], support: [] },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      expect(result.breakdownPerPlayer[0].playerName).toBe('Active');
    });

    it('should handle existing player with multiple skill damages', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Attacker',
          jobId: 0,
          totalDamageDealt: 2000,
          totalDamageTaken: 100,
          totalSkillUsageCount: 10,
          totalItemUsageCount: 0,
          MVPCount: 1,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 5,
                skillDamageDealt: 1000,
                maxDamageDealt: 300,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
              {
                skillId: '2',
                skillUsageCount: 5,
                skillDamageDealt: 1000,
                maxDamageDealt: 250,
                maxDamageMonsterName: 'Lunatic',
                maxDamageMonsterId: '1002',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;

      mockMobDb.push({
        Id: 1002,
        AegisName: 'lunatic',
        Name: 'Lunatic',
        Modes: { Mvp: false },
      } as any);

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      expect(result.breakdownPerPlayer[0].skillDamages.length).toBeGreaterThan(0);
    });

    it('should process replay with skill description fallback', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'TestPlayer',
          jobId: 0,
          totalDamageDealt: 100,
          totalDamageTaken: 0,
          totalSkillUsageCount: 1,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '999',
                skillUsageCount: 1,
                skillDamageDealt: 100,
                maxDamageDealt: 100,
                maxDamageMonsterName: 'Unknown',
                maxDamageMonsterId: '9999',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      const skillDamage = result.breakdownPerPlayer[0].skillDamages[0];
      expect(skillDamage?.skillInfo).toBe('');
    });

    it('should accumulate skill damages for multiple battles', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'Damage Dealer',
          jobId: 0,
          totalDamageDealt: 2000,
          totalDamageTaken: 0,
          totalSkillUsageCount: 10,
          totalItemUsageCount: 0,
          MVPCount: 0,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 10,
                skillDamageDealt: 2000,
                maxDamageDealt: 400,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      expect(result.breakdownPerPlayer[0].totalDamageDealt).toBe(2000);
    });

    it('should handle skill damage with MVP monster classification', () => {
      mockReplayData.players = [
        {
          AID: 'player1',
          name: 'MVP Killer',
          jobId: 0,
          totalDamageDealt: 500,
          totalDamageTaken: 0,
          totalSkillUsageCount: 5,
          totalItemUsageCount: 0,
          MVPCount: 1,
          deathCount: 0,
          skillInfo: {
            offensive: [
              {
                skillId: '1',
                skillUsageCount: 5,
                skillDamageDealt: 500,
                maxDamageDealt: 200,
                maxDamageMonsterName: 'Poring',
                maxDamageMonsterId: '1001',
              },
            ],
            support: [],
          },
          itemInfo: [],
        },
      ] as any;

      const result = parseReplayOutput(mockReplayData, mockSkillDb, mockMobDb);

      expect(result.breakdownPerPlayer).toHaveLength(1);
      expect(result.breakdownPerMonsterUnique).toBeDefined();
    });
  });
});
