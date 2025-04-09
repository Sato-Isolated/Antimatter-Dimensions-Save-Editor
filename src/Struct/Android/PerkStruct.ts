export interface PerkStruct {
  points: number;
  upgrades: Record<string, number>;
  respec: boolean;
  respecMastery: boolean;
  rebuyables: Record<string, number>;
  autoPerks: boolean;
}

export interface RealityUpgradeStruct {
  bought: number[];
  reqLock: Record<string, boolean>;
  keepAutobuyers: boolean;
  respec: boolean;
  imaginaryUpgRespec: boolean;
  currentTS: Record<string, number[]>;
} 