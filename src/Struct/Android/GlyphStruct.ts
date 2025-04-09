export interface GlyphStruct {
  active: number[];
  inventory: GlyphInfo[];
  sets: GlyphSets;
  undo: GlyphUndoData;
  filter: GlyphFilterState;
  sac: GlyphSacrificeValues;
  cosmetics: GlyphCosmetics;
  protectedRows: boolean[];
  autoClean: AutoCleanSettings;
  autoSort: AutoSortSettings;
}

export interface GlyphInfo {
  id: number;
  type: number;
  level: number;
  strength: number;
  rarity: number;
  effects: Record<string, number>;
  sacrifice?: number;
  color?: string;
  cosmetic?: string;
  symbol?: string;
  alchemyResource?: number;
}

export interface GlyphSets {
  sets: Record<string, GlyphSetInfo>;
  active: string;
  numericIndex: number;
}

export interface GlyphSetInfo {
  name: string;
  glyphs: number[];
}

export interface GlyphUndoData {
  inventory: GlyphInfo[][];
  active: number[][];
  usedAt: number;
}

export interface GlyphFilterState {
  simple: SimpleGlyphFilter;
  advanced: AdvancedGlyphFilter;
  presets: Record<string, FilterPreset>;
  currentPreset: string;
}

export interface SimpleGlyphFilter {
  types: boolean[];
  effects: Record<string, boolean>;
}

export interface AdvancedGlyphFilter {
  enabled: boolean;
  mode: string;
  customCount: number;
  scoreConfig: Record<string, number>;
  typeLevelMult: number[];
  effectCount: number;
  types: boolean[];
  effects: Record<string, boolean>;
  rarities: boolean[];
  requirements: FilterRequirement[];
}

export interface FilterRequirement {
  type: string;
  specType?: string;
  value: number;
  exclusive?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  filter: SimpleGlyphFilter | AdvancedGlyphFilter;
  isAdvanced: boolean;
}

export interface GlyphSacrificeValues {
  power: number;
  infinity: number;
  time: number;
  replication: number;
  dilation: number;
  effarig: number;
  reality: number;
  cursed: number;
  companion: number;
}

export interface GlyphCosmetics {
  unlockedPatterns: string[];
  unlockedColors: string[];
  unlockedSymbols: string[];
  currentPatternIdx: number;
  currentColorIdx: number;
  currentSymbolIdx: number;
}

export interface AutoCleanSettings {
  enabled: boolean;
  keepShardsFor: boolean;
  minRarity: number;
  maxRarity: number;
  types: boolean[];
  effectCount: number;
  minLevel: number;
  maxLevel: number;
  excludeEffect: Record<string, boolean>;
}

export interface AutoSortSettings {
  enabled: boolean;
  primarySort: string;
  primaryReverse: boolean;
  secondarySort: string;
  secondaryReverse: boolean;
} 