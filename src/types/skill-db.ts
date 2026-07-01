export interface ILevelledValue {
  Level: number;
  Amount?: number;
  Time?: number;
  Size?: number;
  Area?: number;
  Count?: number;
}

export interface IDamageFlags {
  NoDamage?: boolean;
  Splash?: boolean;
  SplashSplit?: boolean;
}

export interface ISkillFlags {
  TargetTrap?: boolean;
  IsAutoShadowSpell?: boolean;
}

export interface ICopyFlags {
  Skill?: {
    Plagiarism?: boolean;
    Reproduce?: boolean;
  };
  RemoveRequirement?: string[];
}

export interface IWeaponRequirements {
  Fist?: boolean;
  Dagger?: boolean;
  '1hSword'?: boolean;
  '2hSword'?: boolean;
  '1hSpear'?: boolean;
  '2hSpear'?: boolean;
  '1hAxe'?: boolean;
  '2hAxe'?: boolean;
  Mace?: boolean;
  '2hMace'?: boolean;
  Staff?: boolean;
  Knuckle?: boolean;
  Musical?: boolean;
  Whip?: boolean;
  Book?: boolean;
  Katar?: boolean;
  Revolver?: boolean;
  Rifle?: boolean;
  Gatling?: boolean;
  Shotgun?: boolean;
  Grenade?: boolean;
  Huuma?: boolean;
}

export interface IItemCost {
  Item: string;
  Amount: number;
  Level?: number;
}

export interface ISkillRequirements {
  HpCost?: number | ILevelledValue[];
  SpCost?: number | ILevelledValue[];
  ApCost?: number | ILevelledValue[];
  HpRateCost?: number | ILevelledValue[];
  SpRateCost?: number | ILevelledValue[];
  ApRateCost?: number | ILevelledValue[];
  MaxHpTrigger?: number | ILevelledValue[];
  ZenyCost?: number | ILevelledValue[];
  Weapon?: string | IWeaponRequirements;
  Ammo?: string;
  AmmoAmount?: number | ILevelledValue[];
  State?: string;
  Status?: string;
  SpiritSphereCost?: number | ILevelledValue[];
  ItemCost?: IItemCost[];
  Equipment?: string;
}

export interface ISkillUnit {
  Id: number;
  AlternateId?: number;
  Layout?: number | ILevelledValue[];
  Range?: number | ILevelledValue[];
  Interval?: number;
  Target?: string;
  Flag?: string;
}

export interface ISkill {
  Id: number;
  Name: string;
  Description: string;
  MaxLevel: number;
  Type?: string;
  TargetType?: string;
  DamageFlags?: IDamageFlags;
  Flags?: ISkillFlags;
  Range?: number | ILevelledValue[];
  Hit?: string;
  HitCount?: number | ILevelledValue[];
  Element?: string | ILevelledValue[];
  SplashArea?: number | ILevelledValue[];
  ActiveInstance?: number | ILevelledValue[];
  Knockback?: number | ILevelledValue[];
  GiveAp?: number | ILevelledValue[];
  CopyFlags?: ICopyFlags;
  NoNearNPC?: {
    AdditionalRange?: number;
    Type?: string;
  };
  CastCancel?: boolean;
  CastDefenseReduction?: number;
  CastTime?: number | ILevelledValue[];
  AfterCastActDelay?: number | ILevelledValue[];
  AfterCastWalkDelay?: number | ILevelledValue[];
  Duration1?: number | ILevelledValue[];
  Duration2?: number | ILevelledValue[];
  Cooldown?: number | ILevelledValue[];
  FixedCastTime?: number | ILevelledValue[];
  CastTimeFlags?: string;
  CastDelayFlags?: string;
  Requires?: ISkillRequirements;
  Unit?: ISkillUnit;
  Status?: string;
}

export interface ISkillDBHeader {
  Type: string;
  Version: number;
}

export interface ISkillDB {
  Header: ISkillDBHeader;
  Body: ISkill[];
}
