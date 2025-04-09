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

// Type declaration to handle common properties accessed across both platforms
declare global {
  interface CommonPlatformProps {
    dimensions?: any;
    challenge?: any;
    antimatter?: any;
    break?: boolean;
    infinityPoints?: string | { mantissa: number; exponent: number };
    infinities?: string | { mantissa: number; exponent: number };
    infinitiesBanked?: string | { mantissa: number; exponent: number };
    infinityPower?: string | { mantissa: number; exponent: number };
    IPMultPurchases?: number;
    infinityUpgrades?: any[];
    matter?: any;
    dimensionBoosts?: number;
    galaxies?: number;
    sacrificed?: any;
    partInfinityPoint?: any;
    partInfinitied?: any;
    eternityPoints?: any;
    eternities?: any;
    timeShards?: any;
    totalTickGained?: any;
    totalTickBought?: any;
    realities?: any;
    ic2Count?: number;
    eterc8ids?: any;
    eterc8repl?: any;
    chall2Pow?: any;
    chall3Pow?: any;
    chall8TotalSacrifice?: any;
    chall9TickspeedCostBumps?: any;
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