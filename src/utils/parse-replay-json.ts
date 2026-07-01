import { JOB_LIST } from '@/constants';
import type {
  IMob,
  IMonster,
  IMonsterBreakdown,
  IParsedReplay,
  IPlayer,
  IPlayerBreakdown,
  IPlayerDamage,
  IReplayData,
  ISkill,
  ISkillDamage,
} from '@/types';

export const parseReplayOutput = (
  apiResponse: IReplayData | null,
  skillDb: ISkill[] | null,
  mobDb: IMob[] | null
) => {
  const finalOutput: IParsedReplay = {
    breakdownPerMonsterUnique: [] as IMonsterBreakdown[],
    breakdownPerPlayer: [] as IPlayerBreakdown[],
  };

  apiResponse?.players.forEach((player: IPlayer) => {
    finalOutput.breakdownPerPlayer.push({
      playerId: player.AID,
      playerName: player.name,
      jobId: player.jobId,
      jobName: JOB_LIST[player.jobId],
      totalDamageDealt: player.totalDamageDealt,
      highestDamage: {
        monsterId: '',
        monsterName: '',
        isMvp: false,
        skillId: '',
        skillName: '',
        damage: 0,
      },
      skillDamages: [],
    });

    const existingPlayer = finalOutput.breakdownPerPlayer.find(
      (p: IPlayerBreakdown) => p.playerId === player.AID
    );
    if (existingPlayer) {
      player.skillInfo.offensive.forEach((skillUsage) => {
        const skillInfo = skillDb?.find((s: ISkill) => s.Id === Number(skillUsage.skillId));
        existingPlayer.skillDamages.push({
          skillId: skillUsage.skillId,
          skillInfo: skillInfo?.Description ?? '',
          damage: skillUsage.skillDamageDealt ?? 0,
          noOfHits: skillUsage.skillUsageCount ?? 0,
          noOfHitsUnique: skillUsage.skillUsageCount ?? 0,
          highestDamage: 0,
          highestMonsterName: '',
          highestIsMvp: false,
          highestMonsterId: '',
        });
      });
    }
  });

  apiResponse?.monsters.forEach((monster: IMonster) => {
    const {
      monsterId,
      monsterName,
      battleDuration,
      highestDamageInfo,
      battleInfo,
      battleStartTime,
      battleEndTime,
    } = monster;
    const monsterFromMobDb = mobDb?.find((m: IMob) => m.Id === Number(monsterId));
    const mobIsMvp = Boolean(monsterFromMobDb?.Modes?.Mvp) || false;

    const highestDamageInfoJob =
      JOB_LIST[
        Number(
          apiResponse?.players?.find((p: IPlayer) => p.AID === highestDamageInfo.playerId)?.jobId
        )
      ];
    const highestDamageInfoJobId = apiResponse?.players?.find(
      (p: IPlayer) => p.AID === highestDamageInfo.playerId
    )?.jobId;
    const highestDamageInfoSkillName = skillDb?.find(
      (s: ISkill) => s.Id === Number(highestDamageInfo.skillId)
    )?.Description;

    if (
      !finalOutput.breakdownPerMonsterUnique.find(
        (m: IMonsterBreakdown) => m.monsterId === monsterId
      )
    ) {
      finalOutput.breakdownPerMonsterUnique.push({
        name: monsterName ?? monsterFromMobDb?.Name,
        monsterId,
        isMvp: mobIsMvp,
        amount: 0, // default 1
        damage: 0,
        skillId: highestDamageInfo.skillId,
        skillInfo: highestDamageInfoSkillName ?? '',
        highestDamage: {
          playerName: highestDamageInfo.playerName,
          jobName: highestDamageInfoJob,
          skillName: highestDamageInfoSkillName ?? '',
          damage: highestDamageInfo.damage,
          playerId: highestDamageInfo.playerId,
          jobId: highestDamageInfoJobId ?? 0,
          skillId: highestDamageInfo.skillId,
        },
        playerDamages: [],
        skillDamages: [],
        fightDuration: { from: battleStartTime, to: battleEndTime },
        battleDuration: battleDuration,
      }); // , listOfDids:[did]
    }

    const existing = finalOutput.breakdownPerMonsterUnique.find(
      (m: IMonsterBreakdown) => m.monsterId === monsterId
    );
    if (!existing) {
      return;
    }
    existing.damage += Number(
      battleInfo.reduce((sum, battleInfoEntry) => sum + battleInfoEntry.damageDealt, 0)
    );
    existing.amount++;

    if (battleEndTime >= existing.fightDuration.to) {
      existing.fightDuration.to = battleEndTime;
    }

    // playerDamages
    battleInfo.forEach((battleInfoEntry) => {
      if (
        !existing.playerDamages.find((p: IPlayerDamage) => p.playerId === battleInfoEntry.playerId)
      ) {
        existing.playerDamages.push({
          playerId: battleInfoEntry.playerId,
          skillId: '', // to be filled up below
          skillInfo: '', // to be filled up below
          playerName: battleInfoEntry.playerName,
          noOfHits: 0, // to be filled up below,
          noOfHitsUnique: 0, // to be filled up below,
          damage: 0, // to be filled up below,
          highestDamage: {
            skillName: '',
            damage: 0,
            skillId: '',
          },
        });
      }

      const existingPlayer = existing.playerDamages.find(
        (p: IPlayerDamage) => p.playerId === battleInfoEntry.playerId
      );

      if (existingPlayer) {
        existingPlayer.damage += Number(
          battleInfoEntry.skills.reduce((sum, skillEntry) => sum + skillEntry.damageDealt, 0)
        );

        existingPlayer.noOfHits += Number(
          battleInfoEntry.skills.reduce((sum, skillEntry) => sum + skillEntry.skillCount, 0)
        );
        existingPlayer.noOfHitsUnique += Number(
          battleInfoEntry.skills.reduce((sum, skillEntry) => sum + skillEntry.skillCount, 0)
        );
        existingPlayer.skillId = battleInfoEntry.skills.reduce((max, skillEntry) =>
          skillEntry.damageDealt > max.damageDealt ? skillEntry : max
        ).skillId;
        existingPlayer.skillInfo =
          skillDb?.find((s) => s.Id === Number(existingPlayer.skillId))?.Description ?? '';

        existingPlayer.highestDamage = battleInfoEntry.skills.reduce(
          (max, skillEntry) =>
            skillEntry.damageDealt > max.damage
              ? {
                  skillName:
                    skillDb?.find((s) => s.Id === Number(skillEntry.skillId))?.Description ?? '',
                  damage: skillEntry.damageDealt,
                  skillId: skillEntry.skillId,
                }
              : max,
          { skillName: '', damage: 0, skillId: '' }
        );

        const existingPlayerBreakdown = finalOutput.breakdownPerPlayer.find(
          (p: IPlayerBreakdown) => p.playerId === existingPlayer.playerId
        );
        if (existingPlayerBreakdown) {
          // breakdownPerPlayer.highestDamage
          if (
            existing.highestDamage.damage > existingPlayerBreakdown.highestDamage.damage &&
            existing.highestDamage.playerId === existingPlayerBreakdown.playerId
          ) {
            existingPlayerBreakdown.highestDamage = {
              monsterId: existing.monsterId,
              monsterName: existing.name,
              isMvp: existing.isMvp,
              skillId: existing.highestDamage.skillId,
              skillName: existing.highestDamage.skillName,
              damage: existing.highestDamage.damage,
            };
          }

          // breakdownPerPlayer.skillDamages
          const existingSkillDamage = existingPlayerBreakdown.skillDamages.find(
            (s: ISkillDamage) => s.skillId === existingPlayer.highestDamage.skillId
          );
          if (existingSkillDamage) {
            if (
              existing.highestDamage.damage > existingSkillDamage.highestDamage &&
              existing.highestDamage.playerId === existingPlayerBreakdown.playerId
            ) {
              existingSkillDamage.highestMonsterId = existing.monsterId;
              existingSkillDamage.highestDamage = existing.highestDamage.damage;
              existingSkillDamage.highestMonsterName = existing.name;
              existingSkillDamage.highestIsMvp = existing.isMvp;
            }
          }
        }
      }

      battleInfoEntry.skills.forEach((skillEntry) => {
        const existingSkill = existing.skillDamages.find(
          (s: ISkillDamage) => s.skillId === skillEntry.skillId
        );
        if (existingSkill) {
          existingSkill.damage += skillEntry.damageDealt;
          existingSkill.noOfHits += skillEntry.skillCount;
          existingSkill.noOfHitsUnique += skillEntry.skillCount;
        } else {
          existing.skillDamages.push({
            skillId: skillEntry.skillId,
            skillInfo: skillDb?.find((s) => s.Id === Number(skillEntry.skillId))?.Description ?? '',
            damage: skillEntry.damageDealt,
            noOfHits: skillEntry.skillCount,
            noOfHitsUnique: skillEntry.skillCount,
          });
        }
      });
    });
  });

  finalOutput.breakdownPerPlayer.sort((a, b) => b.totalDamageDealt - a.totalDamageDealt);
  finalOutput.breakdownPerPlayer.forEach((player) => {
    player.skillDamages.sort((a, b) => b.damage - a.damage);
  });
  finalOutput.breakdownPerMonsterUnique.forEach((monster) => {
    monster.playerDamages.sort((a, b) => b.damage - a.damage);
    monster.skillDamages.sort((a, b) => b.damage - a.damage);
  });

  return finalOutput;
};
