// Import interfaces directly
import { Achievements } from './AchievementsStruct';
import { Auto } from './AutoStruct';
import { BlackHole } from './BlackHoleStruct';
import { Celestials } from './CelestialsStruct';
import { Challenge } from './ChallengeStruct';
import { AntimatterDimensionsStructDilation } from './DilationStruct';
import { Dimensions } from './DimensionsStruct';
import { Iap } from './IAPStruct';
import { 
  AntimatterDimensionsStructNews,
  Speedrun,
  RequirementChecks,
  SecretUnlocks,
  ShownRuns
} from './MiscStruct';
import { Options } from './OptionsStruct';
import { AntimatterDimensionsStructReality } from './RealityStruct';
import { AntimatterDimensionsStructRecords } from './RecordsStruct';
import { Replicanti } from './ReplicantiStruct';
import { AntimatterDimensionsStructAndroid } from './AndroidStruct';

// Export main Android structure
export type AntimatterDimensionsAndroidStructure = AntimatterDimensionsStructAndroid;

// Re-export all interfaces with namespaces to avoid conflicts
export * as AchievementsTypes from './AchievementsStruct';
export * as AntimatterTypes from './AntimatterStruct';
export * as AutomatorTypes from './AutomatorStruct';
export * as CelestialsTypes from './CelestialsStruct';
export * as CommonTypes from './CommonStruct';
export * as DilationTypes from './DilationStruct';
export * as EternityTypes from './EternityStruct';
export * as GlyphTypes from './GlyphStruct';
export * as InfinityTypes from './InfinityStruct';
export * as PerkTypes from './PerkStruct';
export * as RealityTypes from './RealityStruct';
export * as RecordsTypes from './RecordsStruct';
export * as ReplicantiTypes from './ReplicantiStruct';
export * as TimeStudiesTypes from './TimeStudiesStruct'; 