import { BankedInfinitiesClass } from "../CommonStruct";

export interface AntimatterStruct {
  money: BankedInfinitiesClass;
  tickSpeedCost: BankedInfinitiesClass;
  tickspeed: BankedInfinitiesClass;
  totalAntimatter: BankedInfinitiesClass;
  shopPurchases: ShopPurchases;
  newsArray: string[];
  aarexModifications: AarexModifications;
  dimensionMultDecrease: number;
  dimensionMultDecreaseCost: number;
  tickSpeedMultDecrease: number;
  tickSpeedMultDecreaseCost: number;
  firstAmount: number[];
  firstBought: number[];
  firstCost: BankedInfinitiesClass[];
  firstPow: number[];
  secondAmount: number[];
  secondBought: number[];
  secondCost: BankedInfinitiesClass[];
  secondPow: number[];
  thirdAmount: number[];
  thirdBought: number[];
  thirdCost: BankedInfinitiesClass[];
  thirdPow: number[];
  fourthAmount: number[];
  fourthBought: number[];
  fourthCost: BankedInfinitiesClass[];
  fourthPow: number[];
  fifthAmount: number[];
  fifthBought: number[];
  fifthCost: BankedInfinitiesClass[];
  fifthPow: number[];
  sixthAmount: number[];
  sixthBought: number[];
  sixthCost: BankedInfinitiesClass[];
  sixthPow: number[];
  seventhAmount: number[];
  seventhBought: number[];
  seventhCost: BankedInfinitiesClass[];
  seventhPow: number[];
  eighthAmount: number[];
  eighthBought: number[];
  eighthCost: BankedInfinitiesClass[];
  eighthPow: number[];
  sacrificed: BankedInfinitiesClass;
  achievements: boolean[];
  challenges: Record<string, boolean>;
  currentChallenge: string;
  infinityUpgrades: string[];
  infinityPoints: BankedInfinitiesClass;
  infinitied: number;
  totalTimePlayed: number;
  bestInfinityTime: number;
  thisInfinityTime: number;
  lastUpdate: number;
  achPow: number;
  autobuyers: AutobuyerMinimal[];
  costMultipliers: BankedInfinitiesClass[];
  partInfinityPoint: number;
  tickDecrease: number;
  totalmoney: BankedInfinitiesClass;
  interval: number;
  lastTenRuns: LastTenRuns[];
  infMult: number;
}

export interface ShopPurchases {
  dimPow1: string;
  dimPow2: string;
  dimPow3: string;
  dimPow4: string;
  dimPow5: string;
  dimPow6: string;
  dimPow7: string;
  dimPow8: string;
  tickSpd1: string;
  tickSpd2: string;
  tickSpd3: string;
  dimCost: string;
  tickSpeedCost: string;
  allDimCost: string;
  inf1: string;
  inf2: string;
}

export interface AarexModifications {
  ngmX: number;
  ngmm: number;
  newGame3Minus: boolean;
  newGame3PlusVersion: number;
  ngp4: number;
  newGameExpVersion: number;
  ngudpV: number;
  newGamePlusVersion: number;
}

export interface AutobuyerMinimal {
  isOn?: boolean;
  interval?: number;
  priority?: number;
  target?: number;
  ticks?: number;
  bulk?: number;
  tier?: number;
}

export interface LastTenRuns {
  infinityPoints: BankedInfinitiesClass;
  objects: Record<string, AutobuyerMinimal>;
  prestige: number;
  time: number;
} 