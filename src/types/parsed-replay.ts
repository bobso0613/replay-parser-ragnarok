/** Highest single-hit damage record for a skill. */
export interface IHighestDamage {
  skillId: string;
  skillName: string;
  damage: number;
}

/** Full context of the player who dealt the highest damage with a skill. */
export interface IHighestDamageInfo {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  skillId: string;
  skillName: string;
  damage: number;
}

/** Highest damage a player dealt to a specific monster. */
export interface IPlayerHighestDamage {
  monsterId: string;
  monsterName: string;
  isMvp: boolean;
  skillId: string;
  skillName: string;
  damage: number;
}

/**
 * Aggregated damage statistics for a single skill used by a player against a monster.
 *
 * @property skillId - Numeric skill ID as a string.
 * @property skillInfo - Human-readable skill description from the skill database.
 * @property damage - Total damage dealt with this skill.
 * @property noOfHits - Total number of skill activations recorded.
 * @property noOfHitsUnique - Number of distinct hit events (may differ from casts for multi-hit skills).
 * @property highestMonsterId - ID of the monster that received the single highest hit.
 * @property highestDamage - Highest single-hit damage value.
 * @property highestMonsterName - Display name of that monster.
 * @property highestIsMvp - Whether the highest-hit monster is an MVP.
 */
export interface IPlayerSkillDamage {
  skillId: string;
  skillInfo: string;
  damage: number;
  noOfHits: number;
  noOfHitsUnique: number;
  highestMonsterId: string;
  highestDamage: number;
  highestMonsterName: string;
  highestIsMvp: boolean;
}

/**
 * Full damage and skill breakdown for a single player across all monster encounters.
 *
 * @property playerId - Account ID of the player.
 * @property playerName - In-game character name.
 * @property jobId - Numeric job/class ID.
 * @property jobName - Resolved job name from `JOB_LIST`.
 * @property totalDamageDealt - Sum of all damage dealt to all monsters.
 * @property totalDamageDealthMvps - Subset of `totalDamageDealt` directed at MVP monsters.
 * @property highestDamage - The single best hit this player landed, with monster context.
 * @property skillDamages - Per-skill breakdown of damage, hit counts, and highest-hit info.
 */
export interface IPlayerBreakdown {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  totalDamageDealt: number;
  totalDamageDealthMvps: number;
  highestDamage: IPlayerHighestDamage;
  skillDamages: IPlayerSkillDamage[];
}

/** Per-player damage contribution for a single skill. */
export interface IPlayerDamage {
  playerId: string;
  skillId: string;
  skillInfo: string;
  playerName: string;
  jobId: number;
  jobName: string;
  noOfHits: number;
  noOfHitsUnique: number;
  damage: number;
  highestDamage: IHighestDamage;
}

/** Aggregated damage dealt with a specific skill to a monster. */
export interface ISkillDamage {
  skillId: string;
  skillInfo: string;
  damage: number;
  noOfHits: number;
  noOfHitsUnique: number;
}

/**
 * Full damage breakdown for a single unique monster encounter.
 *
 * One entry exists per unique monster type seen in the replay (duplicates are merged).
 *
 * @property name - Monster display name.
 * @property monsterId - Numeric monster ID as a string.
 * @property isMvp - Whether this monster is an MVP.
 * @property amount - Number of individual monsters of this type killed.
 * @property damage - Total damage dealt to all instances of this monster.
 * @property highestDamage - Full info on the player and skill with the single highest hit.
 * @property playerDamages - Per-player damage contributions.
 * @property skillDamages - Per-skill damage contributions.
 * @property fightDuration - Absolute start/end timestamps of the encounter.
 * @property battleDuration - Total fight time in milliseconds.
 */
export interface IMonsterBreakdown {
  name: string;
  monsterId: string;
  isMvp: boolean;
  amount: number;
  damage: number;
  skillId: string;
  skillInfo: string;
  highestDamage: IHighestDamageInfo;
  playerDamages: IPlayerDamage[];
  skillDamages: ISkillDamage[];
  fightDuration: IFightDuration;
  battleDuration: number;
}

/**
 * Timestamps marking the start and end of a monster fight.
 *
 * Both values are Unix timestamps in milliseconds as recorded in the replay.
 *
 * @property from - Timestamp when the fight started.
 * @property to - Timestamp when the fight ended.
 */
export interface IFightDuration {
  from: number;
  to: number;
}

/**
 * Aggregated usage count and top-user info for a single support skill across all players.
 *
 * @property skillId - Numeric skill ID as a string.
 * @property skillInfo - Human-readable skill description from the skill database.
 * @property skillUsageCount - Total casts across all players.
 * @property highestSkillUsageCount - Cast count of the player who used the skill most.
 * @property highestSkillUsagePlayerId - Account ID of that top user.
 * @property highestSkillUsagePlayerName - Character name of that top user.
 * @property highestSkillUsagePlayerJobId - Job ID of that top user.
 * @property highestSkillUsagePlayerJobName - Resolved job name of that top user.
 * @property playerSkills - Per-player usage counts for this skill.
 */
export interface ISkillUsageBreakdown {
  skillId: string;
  skillInfo: string;
  skillUsageCount: number;

  highestSkillUsageCount: number;
  highestSkillUsagePlayerId: string;
  highestSkillUsagePlayerName: string;
  highestSkillUsagePlayerJobId: number;
  highestSkillUsagePlayerJobName: string;

  playerSkills: IPlayerSkillUsage[];
}

/** Usage count for a specific skill by a single player. */
export interface IPlayerSkillUsage {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  skillUsageCount: number;
}

/** Death count for a single player. */
export interface IDeathBreakdown {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  deathCount: number;
}

/** MVP kill count for a single player. */
export interface IMVPBreakdown {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  mvpCount: number;
}

/** Total skill usage count across all skills for a single player. */
export interface IPlayerSkillUsageBreakdown {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  skillUsageCount: number;
}

/**
 * Final parsed output containing all replay breakdown sections.
 *
 * Produced by `parseReplayOutput` and passed directly to `ReplayBreakdown`.
 *
 * @property breakdownPerMonsterUnique - Damage stats grouped by unique monster type.
 * @property breakdownPerPlayer - Damage and skill stats grouped by player.
 * @property skillUsage - Support-skill usage summary across all players.
 * @property deathBreakdown - Death counts per player.
 * @property mvpBreakdown - MVP kill counts per player.
 * @property skillUsageBreakdown - Total skill usage counts per player.
 */
export interface IParsedReplay {
  breakdownPerMonsterUnique: IMonsterBreakdown[];
  breakdownPerPlayer: IPlayerBreakdown[];
  skillUsage: ISkillUsageBreakdown[];
  deathBreakdown: IDeathBreakdown[];
  mvpBreakdown: IMVPBreakdown[];
  skillUsageBreakdown: IPlayerSkillUsageBreakdown[];
}
