// Main AntimatterDimensionsStruct file for PC version

import { Auto } from './PC/AutoStruct';
import { BlackHole } from './PC/BlackHoleStruct';
import { Challenge } from './PC/ChallengeStruct';
import { Celestials } from './PC/CelestialsStruct';
import { AntimatterDimensionsStructDilation } from './PC/DilationStruct';
import { Dimensions } from './PC/DimensionsStruct';
import { EternityChalls } from './PC/EternityStruct';
import { Iap } from './PC/IAPStruct';
import { AntimatterDimensionsStructInfinity } from './PC/InfinityStruct';
import { AntimatterDimensionsStructNews } from './PC/NewsStruct';
import { Options } from './PC/OptionsStruct';
import { AntimatterDimensionsStructReality } from './PC/RealityStruct';
import { AntimatterDimensionsStructRecords } from './PC/RecordsStruct';
import { Replicanti } from './PC/ReplicantiStruct';
import { Speedrun } from './PC/SpeedrunStruct';
import { Timestudy } from './PC/TimestudyStruct';

export interface AntimatterDimensionsStruct {
  auto: Auto;
  blackHole: BlackHole[];
  break: boolean;
  challenge: Challenge;
  celestials: Celestials;
  dilation: AntimatterDimensionsStructDilation;
  dimensions: Dimensions;
  eternity: {
    upgrades: string[];
    challs: EternityChalls;
    current: number;
    respec: boolean;
    studies: number[];
  };
  /** PC saves keep Eternity Challenge completion counts at the root. */
  eternityChalls?: EternityChalls;
  IAP: Iap;
  infinity: AntimatterDimensionsStructInfinity;
  infinityPoints: { mantissa: number; exponent: number } | string;
  infinities: { mantissa: number; exponent: number } | string;
  infinitiesBanked: { mantissa: number; exponent: number } | string;
  infinityPower: { mantissa: number; exponent: number } | string;
  IPMultPurchases: number;
  infinityUpgrades: string[];
  news: AntimatterDimensionsStructNews;
  options: Options;
  reality: AntimatterDimensionsStructReality;
  records: AntimatterDimensionsStructRecords;
  replicanti: Replicanti;
  speedrun: Speedrun;
  timestudy: Timestudy;
  buyUntil10?: boolean;
  sacrificed?: string | number;
  achievementBits?: number;
  secretAchievementBits?: number;
  infinityRebuyables?: number[];
  backupTimer?: number;
  secretUnlocks?: number;
  shownRuns?: number;
  requirementChecks?: Record<string, boolean>;
  blackHolePause?: boolean;
  blackHoleAutoPauseMode?: number;
  blackHolePauseTime?: number;
  blackHoleNegative?: number;
  isGameEnd?: boolean;
  tabNotifications?: Record<string, boolean>;
  triggeredTabNotificationBits?: number;
  tutorialState?: Record<string, unknown>;
  tutorialActive?: boolean;
  version: number;
}
