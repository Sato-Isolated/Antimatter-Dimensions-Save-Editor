import { BankedInfinitiesClass } from "../CommonStruct";

export interface InfinityStruct {
  autobuyers: Autobuyer[];
  autobuyer25Speed: number;
  autobuyerOn: boolean;
  autobuyerUpgrades: number;
  bankedInfinities: BankedInfinitiesClass;
  break: boolean;
  bulk: boolean;
  challenge: InfinityChallenge;
  dimboosts: number;
  dimension: InfinityDimension;
  galaxies: number;
  generatorMode: number;
  IDCounter: number;
  IPMultPurchases: number;
  IPMultBuyer: boolean;
  infMultCost: number;
  lastCreate: number;
  maxBulk: boolean;
  partInfinityPoint: number;
  points: BankedInfinitiesClass;
  presets: IDPreset[];
  replicanti: Replicanti;
  respec: boolean;
  sacPos: number;
  sacrificed: BankedInfinitiesClass;
  selected: null | number;
  upgrades: number[];
}

export interface Autobuyer {
  bulk: number;
  cost: number;
  interval: number;
  isActive: boolean;
  mode: string;
  priority: number;
  target: number;
  ticks: number;
  time: number;
  tier: number;
}

export interface InfinityChallenge {
  breakEternity: boolean;
  cashGrab: boolean;
  current: number;
  disruptive: boolean;
  finalityUnlock: boolean;
  ics: Record<string, boolean>;
  icr: Record<string, ICREntry>;
  lastCompletion: null | number;
  presetLines: null | number;
  retrying: boolean;
  save: IDPreset | null;
  studying: null | number;
  studyTree: null | number[];
  unlocked: boolean[];
}

export interface ICREntry {
  ant: null | number;
  comp: number;
  diffComp: number;
}

export interface InfinityDimension {
  amount: BankedInfinitiesClass[];
  baseAmount: number[];
  bought: number[];
  cost: BankedInfinitiesClass[];
  power: number[];
}

export interface IDPreset {
  cost: IDPresetCost;
  id: number;
  name: string;
  studies: number[];
}

export interface IDPresetCost {
  EP: BankedInfinitiesClass;
  TP: BankedInfinitiesClass;
}

export interface Replicanti {
  amount: BankedInfinitiesClass;
  chance: number;
  chanceCost: number;
  galaxies: number;
  galCost: number;
  gal: number;
  interval: number;
  intervalCost: number;
  limit: BankedInfinitiesClass;
  on: boolean;
  unl: boolean;
} 