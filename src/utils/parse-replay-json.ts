import type {
  IDeathBreakdown,
  IItemBreakdown,
  IMonster,
  IMonsterBreakdown,
  IMVPBreakdown,
  IParsedReplay,
  IPlayer,
  IPlayerBreakdown,
  IPlayerDamage,
  IPlayerSkillUsageBreakdown,
  IReplayData,
  ISkillDamage,
  ISkillUsageBreakdown,
} from '@/types';

/**
 * Transforms raw replay API data into structured breakdown sections ready
 * for display in the `ReplayBreakdown` component.
 *
 * The function iterates over every player and every monster encounter in the
 * raw API response and builds six parallel breakdown arrays:
 *
 * - **`breakdownPerMonsterUnique`** — merges all encounters of the same monster
 *   type into one entry with combined damage and participant info.
 * - **`breakdownPerPlayer`** — accumulates each player's total damage, highest
 *   hit, and per-skill damage statistics.
 * - **`skillUsage`** — aggregates support-skill cast counts across all players.
 * - **`deathBreakdown`** — lists players who died at least once.
 * - **`mvpBreakdown`** — lists players who earned at least one MVP kill.
 * - **`skillUsageBreakdown`** — total skill-cast counts per player.
 *
 * @param apiResponse - Raw replay data from the parser API, or `null` if unavailable.
 * @returns A fully populated `IParsedReplay` object. Returns an empty structure when `apiResponse` is `null`.
 */
export const parseReplayOutput = (apiResponse: IReplayData | null) => {
  const finalOutput: IParsedReplay = {
    breakdownPerMonsterUnique: [] as IMonsterBreakdown[],
    breakdownPerPlayer: [] as IPlayerBreakdown[],
    skillUsage: [] as ISkillUsageBreakdown[],
    deathBreakdown: [] as IDeathBreakdown[],
    mvpBreakdown: [] as IMVPBreakdown[],
    skillUsageBreakdown: [] as IPlayerSkillUsageBreakdown[],
    itemBreakdown: [] as IItemBreakdown[],
    playerDetails: [] as IParsedReplay['playerDetails'],
  };

  apiResponse?.players.forEach((player: IPlayer) => {
    const highestDamage = {
      monsterId: '',
      monsterName: '',
      isMvp: false,
      skillId: '',
      skillName: '',
      damage: 0,
    };

    finalOutput.breakdownPerPlayer.push({
      playerId: player.AID,
      playerName: player.name,
      jobId: player.jobId,
      jobName: player.jobName ?? '',
      totalDamageDealt: player.totalDamageDealt,
      totalDamageDealthMvps: 0,
      highestDamage,
      skillDamages: [],
    });

    finalOutput.playerDetails.push({
      playerId: player.AID,
      playerName: player.name,
      jobId: player.jobId,
      jobName: player.jobName ?? '',
      statistics: [
        { label: 'Total Damage', value: player.totalDamageDealt },
        { label: 'Monsters Killed', value: 0 },
        { label: 'MVP Damage', value: 0 },
        { label: 'MVPs Killed', value: player.MVPCount },
        { label: 'Highest Burst', value: highestDamage },
        { label: 'Deaths', value: player.deathCount },
        { label: 'Spam Count', value: player.totalSkillUsageCount },
        { label: 'Items Consumed', value: player.totalItemUsageCount },
      ],
      offensiveSkills: player.skillInfo.offensive.map((skill) => ({
        skillId: skill.skillId,
        name: skill.skillName ?? '',
        totalDamage: skill.skillDamageDealt ?? 0,
        hitCount: skill.skillUsageCount,
        highestDamage: skill.maxDamageDealt ?? 0,
      })),
      defensiveSkills: player.skillInfo.support.map((skill) => ({
        skillId: skill.skillId,
        name: skill.skillName ?? '',
        totalUsage: skill.skillUsageCount,
      })),
      itemsUsed: player.itemInfo.map((item) => ({
        itemId: item.itemId,
        name: item.itemName ?? '',
        amount: item.itemUsageCount,
      })),
      monstersKilled: [],
    });

    if (player.deathCount > 0) {
      finalOutput.deathBreakdown.push({
        playerId: player.AID,
        playerName: player.name,
        jobId: player.jobId,
        jobName: player.jobName ?? '',
        deathCount: player.deathCount,
      });
    }

    if (player.MVPCount > 0) {
      finalOutput.mvpBreakdown.push({
        playerId: player.AID,
        playerName: player.name,
        jobId: player.jobId,
        jobName: player.jobName ?? '',
        mvpCount: player.MVPCount,
      });
    }

    if (player.skillInfo.offensive.length > 0 || player.skillInfo.support?.length > 0) {
      finalOutput.skillUsageBreakdown.push({
        playerId: player.AID,
        playerName: player.name,
        jobId: player.jobId,
        jobName: player.jobName ?? '',
        skillUsageCount: player.totalSkillUsageCount,
      });
    }

    const existingPlayer = finalOutput.breakdownPerPlayer.find(
      (p: IPlayerBreakdown) => p.playerId === player.AID
    );
    if (existingPlayer) {
      player.skillInfo.offensive.forEach((skillUsage) => {
        const mobIsMvp = skillUsage.maxDamageMonsterIsMvp ?? false;
        existingPlayer.skillDamages.push({
          skillId: skillUsage.skillId,
          skillInfo: skillUsage.skillName ?? '',
          damage: skillUsage.skillDamageDealt ?? 0,
          noOfHits: skillUsage.skillUsageCount ?? 0,
          noOfHitsUnique: skillUsage.skillUsageCount ?? 0,
          highestDamage: skillUsage.maxDamageDealt ?? 0,
          highestMonsterName: skillUsage.maxDamageMonsterName ?? '',
          highestIsMvp: mobIsMvp ?? false,
          highestMonsterId: skillUsage.maxDamageMonsterId ?? '',
        });

        if (existingPlayer.highestDamage.damage < (skillUsage.maxDamageDealt ?? 0)) {
          existingPlayer.highestDamage = {
            monsterId: skillUsage.maxDamageMonsterId ?? '',
            monsterName: skillUsage.maxDamageMonsterName ?? '',
            isMvp: mobIsMvp ?? false,
            skillId: skillUsage.skillId,
            skillName: skillUsage.skillName ?? '',
            damage: skillUsage.maxDamageDealt ?? 0,
          };
          const existingPlayerDetails = finalOutput.playerDetails.find(
            (details) => details.playerId === player.AID
          );
          const highestBurstStatistic = existingPlayerDetails?.statistics.find(
            (statistic) => statistic.label === 'Highest Burst'
          );
          if (highestBurstStatistic) {
            highestBurstStatistic.value = existingPlayer.highestDamage;
          }
        }
      });
    }

    player.skillInfo.support?.forEach((skillUsage) => {
      if (
        !finalOutput.skillUsage.find((s: ISkillUsageBreakdown) => s.skillId === skillUsage.skillId)
      ) {
        finalOutput.skillUsage.push({
          skillId: skillUsage.skillId,
          skillInfo: skillUsage.skillName ?? '',
          skillUsageCount: 0,
          highestSkillUsageCount: 0,
          highestSkillUsagePlayerId: '',
          highestSkillUsagePlayerName: '',
          highestSkillUsagePlayerJobId: 0,
          highestSkillUsagePlayerJobName: '',
          playerSkills: [],
        });
      }

      const existingSkill = finalOutput.skillUsage.find(
        (s: ISkillUsageBreakdown) => s.skillId === skillUsage.skillId
      );

      if (existingSkill) {
        existingSkill.skillUsageCount += skillUsage.skillUsageCount;

        existingSkill.playerSkills.push({
          playerId: player.AID,
          playerName: player.name,
          jobId: player.jobId,
          jobName: player.jobName ?? '',
          skillUsageCount: skillUsage.skillUsageCount,
        });

        if (existingSkill.highestSkillUsageCount < skillUsage.skillUsageCount) {
          existingSkill.highestSkillUsageCount = skillUsage.skillUsageCount;
          existingSkill.highestSkillUsagePlayerId = player.AID;
          existingSkill.highestSkillUsagePlayerName = player.name;
          existingSkill.highestSkillUsagePlayerJobId = player.jobId;
          existingSkill.highestSkillUsagePlayerJobName = player.jobName ?? '';
        }
      }
    });

    if (player.itemInfo.length > 0) {
      player.itemInfo.forEach((itemUsage) => {
        const existingItem = finalOutput.itemBreakdown.find(
          (i: IItemBreakdown) => i.itemId === itemUsage.itemId
        );

        if (existingItem) {
          existingItem.totalAmount += itemUsage.itemUsageCount;

          const existingPlayerUsage = existingItem.playerUsages.find(
            (p) => p.playerId === player.AID
          );
          if (existingPlayerUsage) {
            existingPlayerUsage.itemUsageCount += itemUsage.itemUsageCount;
          } else {
            existingItem.playerUsages.push({
              playerId: player.AID,
              playerName: player.name,
              jobId: player.jobId,
              jobName: player.jobName ?? '',
              itemUsageCount: itemUsage.itemUsageCount,
            });
          }
        } else {
          finalOutput.itemBreakdown.push({
            itemId: itemUsage.itemId,
            itemName: itemUsage.itemName ?? '',
            totalAmount: itemUsage.itemUsageCount,
            playerUsages: [
              {
                playerId: player.AID,
                playerName: player.name,
                jobId: player.jobId,
                jobName: player.jobName ?? '',
                itemUsageCount: itemUsage.itemUsageCount,
              },
            ],
          });
        }
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
    const mobIsMvp = monster.isMvp ?? false;

    const highestDamageInfoPlayer = apiResponse?.players?.find(
      (p: IPlayer) => p.AID === highestDamageInfo.playerId
    );
    const highestDamageInfoJob = highestDamageInfoPlayer?.jobName ?? '';
    const highestDamageInfoJobId = highestDamageInfoPlayer?.jobId;
    const highestDamageInfoSkillName = highestDamageInfo.skillName ?? '';

    if (
      !finalOutput.breakdownPerMonsterUnique.find(
        (m: IMonsterBreakdown) => m.monsterId === monsterId
      )
    ) {
      finalOutput.breakdownPerMonsterUnique.push({
        name: monsterName,
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
          damage: highestDamageInfo.damage ?? 0,
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

    if (existing.highestDamage.damage < (highestDamageInfo.damage ?? 0)) {
      existing.highestDamage = {
        playerName: highestDamageInfo.playerName,
        jobName: highestDamageInfoJob,
        skillName: highestDamageInfoSkillName ?? '',
        damage: highestDamageInfo.damage ?? 0,
        playerId: highestDamageInfo.playerId,
        jobId: highestDamageInfoJobId ?? 0,
        skillId: highestDamageInfo.skillId,
      };
    }

    // playerDamages
    battleInfo.forEach((battleInfoEntry) => {
      const highestBurstDamage =
        battleInfoEntry.highestDamageInfo.damageDealt ??
        battleInfoEntry.highestDamageInfo.damage ??
        0;
      const jobId = apiResponse?.players?.find(
        (p: IPlayer) => p.AID === battleInfoEntry.playerId
      )?.jobId;
      const jobName =
        apiResponse?.players?.find((p: IPlayer) => p.AID === battleInfoEntry.playerId)?.jobName ??
        '';

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
          jobId: jobId ?? 0,
          jobName: jobName,
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
          battleInfoEntry.skills.find((skill) => skill.skillId === existingPlayer.skillId)
            ?.skillName ?? '';

        if (
          existingPlayer.highestDamage.damage < (battleInfoEntry.highestDamageInfo.damageDealt ?? 0)
        ) {
          existingPlayer.highestDamage = {
            skillName: battleInfoEntry.highestDamageInfo.skillName ?? '',
            damage: battleInfoEntry.highestDamageInfo.damageDealt ?? 0,
            skillId: battleInfoEntry.highestDamageInfo.skillId ?? '',
          };
        }

        // add mvp only damage
        const existingPlayerFromBreakdown = finalOutput.breakdownPerPlayer.find(
          (p: IPlayerBreakdown) => p.playerId === battleInfoEntry.playerId
        );
        const existingPlayerDetails = finalOutput.playerDetails.find(
          (details) => details.playerId === battleInfoEntry.playerId
        );
        if (existingPlayerFromBreakdown && existingPlayerDetails) {
          existingPlayerFromBreakdown.totalDamageDealthMvps += mobIsMvp
            ? battleInfoEntry.damageDealt
            : 0;

          const existingPlayerMonster = existingPlayerDetails.monstersKilled.find(
            (playerMonster) => playerMonster.monsterId === monsterId
          );
          if (existingPlayerMonster) {
            existingPlayerMonster.amount += 1;
            existingPlayerMonster.damage =
              Number(existingPlayerMonster.damage) + battleInfoEntry.damageDealt;
            if (existingPlayerMonster.highestBurst.damage < highestBurstDamage) {
              existingPlayerMonster.highestBurst = {
                monsterId,
                monsterName,
                isMvp: mobIsMvp,
                skillId: battleInfoEntry.highestDamageInfo.skillId ?? '',
                skillName: battleInfoEntry.highestDamageInfo.skillName ?? '',
                damage: highestBurstDamage,
              };
            }
          } else {
            existingPlayerDetails.monstersKilled.push({
              monsterId,
              name: monsterName,
              isMvp: mobIsMvp,
              amount: 1,
              damage: battleInfoEntry.damageDealt,
              highestBurst: {
                monsterId,
                monsterName,
                isMvp: mobIsMvp,
                skillId: battleInfoEntry.highestDamageInfo.skillId ?? '',
                skillName: battleInfoEntry.highestDamageInfo.skillName ?? '',
                damage: highestBurstDamage,
              },
              skillBreakdown: [],
            });
          }

          const playerMonster = existingPlayerDetails.monstersKilled.find(
            (playerMonsterEntry) => playerMonsterEntry.monsterId === monsterId
          );
          if (playerMonster) {
            battleInfoEntry.skills.forEach((skillEntry) => {
              const existingPlayerMonsterSkill = playerMonster.skillBreakdown.find(
                (playerMonsterSkill) => playerMonsterSkill.skillId === skillEntry.skillId
              );
              const skillHighestDamage =
                skillEntry.skillId === battleInfoEntry.highestDamageInfo.skillId
                  ? highestBurstDamage
                  : 0;

              if (existingPlayerMonsterSkill) {
                existingPlayerMonsterSkill.totalDamage =
                  Number(existingPlayerMonsterSkill.totalDamage) + skillEntry.damageDealt;
                existingPlayerMonsterSkill.hitCount =
                  Number(existingPlayerMonsterSkill.hitCount) + skillEntry.skillCount;
                existingPlayerMonsterSkill.highestDamage = Math.max(
                  Number(existingPlayerMonsterSkill.highestDamage),
                  skillHighestDamage
                );
              } else {
                playerMonster.skillBreakdown.push({
                  skillId: skillEntry.skillId,
                  name: skillEntry.skillName ?? '',
                  totalDamage: skillEntry.damageDealt,
                  hitCount: skillEntry.skillCount,
                  highestDamage: skillHighestDamage,
                });
              }
            });
          }

          const totalMonstersStatistic = existingPlayerDetails.statistics.find(
            (statistic) => statistic.label === 'Monsters Killed'
          );
          if (totalMonstersStatistic && typeof totalMonstersStatistic.value === 'number') {
            totalMonstersStatistic.value += 1;
          }

          const mvpDamageStatistic = existingPlayerDetails.statistics.find(
            (statistic) => statistic.label === 'MVP Damage'
          );
          if (mvpDamageStatistic) {
            mvpDamageStatistic.value = existingPlayerFromBreakdown.totalDamageDealthMvps;
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
            skillInfo: skillEntry.skillName ?? '',
            damage: skillEntry.damageDealt,
            noOfHits: skillEntry.skillCount,
            noOfHitsUnique: skillEntry.skillCount,
          });
        }
      });
    });
  });

  finalOutput.itemBreakdown.sort((a, b) => a.itemName.localeCompare(b.itemName));
  finalOutput.itemBreakdown.forEach((item) => {
    item.playerUsages.sort((a, b) => b.itemUsageCount - a.itemUsageCount);
  });
  finalOutput.skillUsageBreakdown.sort((a, b) => b.skillUsageCount - a.skillUsageCount);
  finalOutput.deathBreakdown.sort((a, b) => b.deathCount - a.deathCount);
  finalOutput.mvpBreakdown.sort((a, b) => b.mvpCount - a.mvpCount);
  finalOutput.breakdownPerPlayer = finalOutput.breakdownPerPlayer.filter(
    (player) =>
      player.skillDamages.length > 0 &&
      player.totalDamageDealt > 0 &&
      player.highestDamage.monsterId !== ''
  );
  finalOutput.breakdownPerPlayer.sort((a, b) => b.totalDamageDealt - a.totalDamageDealt);
  finalOutput.breakdownPerPlayer.forEach((player) => {
    player.skillDamages.sort((a, b) => b.damage - a.damage);
  });
  finalOutput.playerDetails.forEach((details) => {
    details.monstersKilled.sort(
      (firstMonster, secondMonster) =>
        Number(secondMonster.damage) - Number(firstMonster.damage) ||
        firstMonster.name.localeCompare(secondMonster.name)
    );
  });
  finalOutput.breakdownPerMonsterUnique.forEach((monster) => {
    monster.playerDamages.sort((a, b) => b.damage - a.damage);
    monster.skillDamages.sort((a, b) => b.damage - a.damage);
  });
  finalOutput.skillUsage.sort((a, b) => a.skillInfo.localeCompare(b.skillInfo));
  finalOutput.skillUsage.forEach((skill) => {
    skill.playerSkills.sort((a, b) => b.skillUsageCount - a.skillUsageCount);
  });
  return finalOutput;
};
