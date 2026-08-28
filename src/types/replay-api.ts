/**
 * Tracks usage and damage metrics for a single skill as recorded in a replay.
 *
 * @property skillId - Numeric skill ID represented as a string.
 * @property skillDamageDealt - Total damage dealt across all casts of this skill.
 * @property skillUsageCount - Total number of times the skill was cast.
 * @property maxDamageDealt - Highest single-hit damage recorded for this skill.
 * @property maxDamageMonsterId - ID of the monster that received the highest hit.
 * @property maxDamageMonsterName - Display name of that monster.
 */
export interface ISkillUsage {
  skillId: string;
  skillName?: string;
  skillDamageDealt?: number;
  skillUsageCount: number;
  maxDamageDealt?: number;
  maxDamageMonsterId?: string;
  maxDamageMonsterName?: string;
  maxDamageMonsterIsMvp?: boolean;
}

/**
 * Categorises a player's skill usage into offensive and support buckets.
 *
 * - `offensive` contains damage-dealing skills with hit/damage statistics.
 * - `support` contains non-damaging or buff/heal skills tracked only by cast count.
 *
 * @property offensive - Skills that dealt damage during the replay.
 * @property support - Non-damaging skills cast during the replay.
 */
export interface ISkillInfo {
  offensive: ISkillUsage[];
  support: ISkillUsage[];
}

/** Tracks how many times a specific item was used. */
export interface IItemUsage {
  itemId: string;
  itemName?: string;
  itemUsageCount: number;
}

/**
 * Full player data as returned by the replay parser API.
 *
 * @property AID - Account ID uniquely identifying the player character.
 * @property name - In-game character name.
 * @property jobId - Numeric job/class ID.
 * @property totalDamageDealt - Sum of all damage dealt to monsters.
 * @property totalDamageTaken - Sum of all damage received from monsters.
 * @property totalSkillUsageCount - Total number of skill casts recorded.
 * @property totalItemUsageCount - Total number of item uses recorded.
 * @property MVPCount - Number of MVP kills credited to this player.
 * @property deathCount - Number of times the player died during the replay.
 * @property skillInfo - Offensive and support skill breakdown.
 * @property itemInfo - List of items used with usage counts.
 */
export interface IPlayer {
  AID: string;
  name: string;
  jobId: number;
  jobName?: string;
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalSkillUsageCount: number;
  totalItemUsageCount: number;
  MVPCount: number;
  deathCount: number;
  skillInfo: ISkillInfo;
  itemInfo: IItemUsage[];
}

/** Minimal player identifier used as a reference in other structures. */
export interface IPlayerRef {
  playerId: string;
  playerName: string;
}

/** Links a player reference to a specific skill damage event. */
export interface IDamageInfo extends IPlayerRef {
  skillId: string;
  skillName?: string;
  damage?: number;
  damageDealt?: number;
}

/** Aggregated damage and skill breakdown for one player against one monster. */
export interface IBattleInfo extends IPlayerRef {
  damageDealt: number;
  skills: IPlayerSkillMonsterInfo[];
  highestDamageInfo: IDamageInfo;
}

/** Damage dealt by a player using a specific skill against a monster. */
export interface IPlayerSkillMonsterInfo {
  skillId: string;
  skillName?: string;
  skillCount: number;
  damageDealt: number;
}

/**
 * Monster encounter record including all per-player battle info.
 *
 * @property monsterId - Unique instance identifier for this monster encounter.
 * @property monsterName - Display name of the monster.
 * @property battleDuration - Total fight duration in milliseconds.
 * @property battleStartTime - Unix timestamp (ms) when the fight began.
 * @property battleEndTime - Unix timestamp (ms) when the fight ended.
 * @property taker - The player credited with the MVP kill on this monster.
 * @property highestDamageInfo - Player and skill responsible for the top single hit.
 * @property battleInfo - Per-player damage and skill breakdown for this encounter.
 */
export interface IMonster {
  monsterId: string;
  monsterName: string;
  isMvp?: boolean;
  battleDuration: number;
  battleStartTime: number;
  battleEndTime: number;
  taker: IPlayerRef;
  highestDamageInfo: IDamageInfo;
  battleInfo: IBattleInfo[];
}

/**
 * Top-level replay data returned by the parser API.
 *
 * This is the root object stored in state and passed to breakdown components.
 *
 * @property outputId - Server-assigned ID for the stored parsed output (used in share links).
 * @property replayFileName - Original filename of the uploaded `.grf` replay.
 * @property replayVersion - Parser version string used to produce this output.
 * @property players - All players present in the replay.
 * @property monsters - All monster encounters recorded in the replay.
 */
export interface IReplayData {
  outputId?: string;
  replayFileName?: string;
  replayVersion: string;
  players: IPlayer[];
  monsters: IMonster[];
}
