// Main index file for Struct module
// Exports all type structures for both platforms

// Export common structures
export * from './CommonStruct';

// Import types
import type { AntimatterDimensionsStruct as PCStructType } from './AntimatterDimensionsStruct';
import type { AntimatterDimensionsStructAndroid as AndroidStructType } from './Android/AndroidStruct';

// Export PC and Android modules
export * from './PC';
export * from './Android';

// Export the main struct types without conflicts
export type PCStruct = PCStructType;
export type AndroidStruct = AndroidStructType;

// Create a union type for use throughout the application
export type AntimatterDimensionsStruct = PCStructType | AndroidStructType;
export type AntimatterDimensionsStructAndroid = AndroidStructType;

// Import/export the BankedInfinitiesClass
import type { BankedInfinitiesClass } from './CommonStruct';
export type { BankedInfinitiesClass };

// Type helper for components
export type AntimatterDimensionsStructType = PCStructType | AndroidStructType;

type StructBigNumber = string | number | { mantissa: number; exponent: number };

interface StructDimension {
  amount?: StructBigNumber;
  bought?: number;
  cost?: StructBigNumber;
  costBumps?: number;
  baseAmount?: number;
  isUnlocked?: boolean;
}

interface StructDimensions {
  antimatter?: StructDimension[];
  infinity?: StructDimension[];
  time?: StructDimension[];
}

interface StructChallengeState {
  current?: number;
  bestTimes?: number[];
  completedBits?: number;
  unlocked?: number;
  requirementBits?: number;
}

interface StructChallenge {
  normal?: StructChallengeState;
  infinity?: StructChallengeState;
  eternity?: StructChallengeState;
}

// Type declaration to handle common properties accessed across both platforms
declare global {
  interface CommonPlatformProps {
    dimensions?: StructDimensions;
    challenge?: StructChallenge;
    antimatter?: unknown;
    break?: boolean;
    infinityPoints?: string | { mantissa: number; exponent: number };
    infinities?: string | { mantissa: number; exponent: number };
    infinitiesBanked?: string | { mantissa: number; exponent: number };
    infinityPower?: string | { mantissa: number; exponent: number };
    IPMultPurchases?: number;
    infinityUpgrades?: unknown[];
    matter?: StructBigNumber;
    dimensionBoosts?: number;
    galaxies?: number;
    sacrificed?: StructBigNumber;
    partInfinityPoint?: number | string;
    partInfinitied?: number | string;
    eternityPoints?: StructBigNumber;
    eternities?: StructBigNumber;
    timeShards?: StructBigNumber;
    totalTickGained?: StructBigNumber;
    totalTickBought?: StructBigNumber;
    realities?: StructBigNumber;
    ic2Count?: number;
    eterc8ids?: number;
    eterc8repl?: number;
    chall2Pow?: number;
    chall3Pow?: StructBigNumber;
    chall8TotalSacrifice?: StructBigNumber;
    chall9TickspeedCostBumps?: number;
    tickspeed?: string | { mantissa: number; exponent: number };
    eternityUpgrades?: unknown[];
    epmultUpgrades?: number;
    timestudies?: {
      studies?: number[];
      theorem?: string;
      eternityChalls?: number[];
    };
    partSimulatedReality?: number;
  }
}

// Augment the AntimatterDimensionsStruct type
declare module './AntimatterDimensionsStruct' {
  interface AntimatterDimensionsStruct extends CommonPlatformProps {}
}

// Augment the AndroidStruct type
declare module './Android/AndroidStruct' {
  interface AntimatterDimensionsStructAndroid extends CommonPlatformProps {}
}
