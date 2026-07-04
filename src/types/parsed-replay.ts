export interface IHighestDamage {
  skillId: string;
  skillName: string;
  damage: number;
}

export interface IHighestDamageInfo {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  skillId: string;
  skillName: string;
  damage: number;
}

export interface IPlayerHighestDamage {
  monsterId: string;
  monsterName: string;
  isMvp: boolean;
  skillId: string;
  skillName: string;
  damage: number;
}

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

export interface IPlayerBreakdown {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  totalDamageDealt: number;
  highestDamage: IPlayerHighestDamage;
  skillDamages: IPlayerSkillDamage[];
}

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

export interface ISkillDamage {
  skillId: string;
  skillInfo: string;
  damage: number;
  noOfHits: number;
  noOfHitsUnique: number;
}

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

export interface IFightDuration {
  from: number;
  to: number;
}

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

export interface IPlayerSkillUsage {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  skillUsageCount: number;
}

export interface IParsedReplay {
  breakdownPerMonsterUnique: IMonsterBreakdown[];
  breakdownPerPlayer: IPlayerBreakdown[];
  skillUsage: ISkillUsageBreakdown[];
}
