export interface IMobDrop {
  Item: string;
  Rate: number;
  StealProtected?: boolean;
  RandomOptionGroup?: string;
  Index?: number;
}

export interface IMobMvpDrop {
  Item: string;
  Rate: number;
  RandomOptionGroup?: string;
  Index?: number;
}

export interface IMobModes {
  Detector?: boolean;
  Escort?: boolean;
  Changeable?: boolean;
  Aggressive?: boolean;
  Assist?: boolean;
  CastSensor?: boolean;
  Boss?: boolean;
  Plant?: boolean;
  CanAttack?: boolean;
  Immobile?: boolean;
  rideable?: boolean;
  Warp?: boolean;
  Mvp?: boolean;
}

export interface IRaceGroups {
  [key: string]: boolean;
}

export interface IMob {
  Id: number;
  AegisName: string;
  Name: string;
  JapaneseName?: string;
  Level?: number;
  Hp?: number;
  Sp?: number;
  BaseExp?: number;
  JobExp?: number;
  MvpExp?: number;
  Attack?: number;
  Attack2?: number;
  Defense?: number;
  MagicDefense?: number;
  Resistance?: number;
  MagicResistance?: number;
  Str?: number;
  Agi?: number;
  Vit?: number;
  Int?: number;
  Dex?: number;
  Luk?: number;
  AttackRange?: number;
  SkillRange?: number;
  ChaseRange?: number;
  Size?: string;
  Race?: string;
  RaceGroups?: IRaceGroups;
  Element?: string;
  ElementLevel?: number;
  WalkSpeed?: number;
  AttackDelay?: number;
  AttackMotion?: number;
  ClientAttackMotion?: number;
  DamageMotion?: number;
  DamageTaken?: number;
  GroupId?: number;
  Title?: string;
  Ai?: string;
  Class?: string;
  Modes?: IMobModes;
  MvpDrops?: IMobMvpDrop[];
  Drops?: IMobDrop[];
}

export interface IMobDBHeader {
  Type: string;
  Version: number;
}

export interface IMobDB {
  Header: IMobDBHeader;
  Body: IMob[];
}
