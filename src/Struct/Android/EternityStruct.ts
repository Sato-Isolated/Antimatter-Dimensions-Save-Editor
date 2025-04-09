import { BankedInfinitiesClass } from "../CommonStruct";

export interface EternityStruct {
  active: boolean;
  auto: boolean;
  autobuyer: EternityAutobuyer;
  autoIP: AutoIP;
  break: boolean;
  breakEternity: BreakEternity;
  challenge: EternityChallenge;
  chall31Comp: boolean;
  chall32Comp: boolean;
  challs: Record<string, boolean>;
  count: number;
  lastTenEternities: LastTenEternities[];
  milestones: number;
  rebuyables: Record<string, number>;
  respec: boolean;
  studies: number[];
  taachievs: Record<string, boolean>;
  tabs: Record<string, boolean>;
  time: number;
  upgrades: number[];
}

export interface AutoIP {
  cost: number;
  interval: number;
  lastTick: number;
  mode: string;
  on: boolean;
  target: number;
  times: number;
}

export interface BreakEternity {
  autoEC: Record<string, boolean>;
  autoUnlockEC: boolean;
  eternalMatter: number;
  timeAcceleration: number;
  upgrades: Record<string, number>;
}

export interface EternityAutobuyer {
  dilationMode: boolean;
  dilationPerAmount: number;
  isActive: boolean;
  limit: BankedInfinitiesClass;
  mode: string;
  newLimit: number;
  peakIPSet: number;
  timeCondUnlock: boolean;
  timeCondEnabled: boolean;
  timeCondMax: number;
  waitForDilation: boolean;
  waitForECSetup: boolean;
  waitForEC: number;
  waitTimes: number;
}

export interface EternityChallenge {
  candidate: number;
  current: number;
  done: number;
  nextUnlockCost: number;
  rerunning: number;
  records: Record<string, number>;
  unlocked: number[];
}

export interface LastTenEternities {
  actualTime: number;
  EPGain: number;
  IPGain: BankedInfinitiesClass;
  realTime: number;
  thisEternity: number;
  thisReality: number;
} 