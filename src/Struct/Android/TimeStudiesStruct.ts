import { BankedInfinitiesClass } from "../CommonStruct";

export interface TimeStudiesStruct {
  studies: number[];
  tree: TimeStudyTree;
  rebuyable: Record<string, number>;
  background: boolean;
  mastered: number[];
  masterystudies: number[];
  thisMastery: number;
  totalMastery: number;
  unlocked: boolean;
  theorem?: string;
  eternityChalls?: number[];
}

export interface TimeStudyTree {
  initialRespec: boolean;
  normal: TimeStudyTreeNormal;
  reality: TimeStudyTreeReality;
  usedTS: number;
}

export interface TimeStudyTreeNormal {
  activeStudies: number[];
  autoBuy: boolean;
  autoBuyMode: string;
  buyMode: string;
  initialized: boolean;
  lastExport: string;
  presets: TimeStudyPreset[];
  respec: boolean;
  spentTT: BankedInfinitiesClass;
  totalTT: BankedInfinitiesClass;
}

export interface TimeStudyTreeReality {
  activeStudies: number[];
  autoBuy: boolean;
  autoBuyMode: string;
  buyMode: string;
  initialized: boolean;
  lastExport: string;
  presets: TimeStudyPreset[];
  respec: boolean;
  spentTT: BankedInfinitiesClass;
  totalTT: BankedInfinitiesClass;
}

export interface TimeStudyPreset {
  id: number;
  name: string;
  studies: number[];
  ec?: number;
} 