import { BankedInfinitiesClass, AchievementTimes, Type } from './CommonStruct';

export interface BestAmSet {
    id:     string;
    level:  number;
    type:   number;
    color?: number;
    symbol?: number;
    effects?: number[];
}

export interface AntimatterDimensionsStructReality {
    applyFilterToPurge:       boolean;
    automator:                Automator;
    gainedAutoAchievements:   boolean;
    glyphs:                   Glyphs;
    hasCheckedFilter:         boolean;
    hideGlyphEffectsPanel:    boolean;
    iMCap:                    number;
    imaginaryMachines:        number;
    imaginaryRebuyables:      number[];
    imaginaryRequirementBits: number;
    imaginaryUpgradeBits:     number;
    initialSeed:              number;
    maxRM:                    BankedInfinitiesClass;
    moveGlyphsOnProtection:   boolean;
    musicSecondGaussian:      number;
    musicSeed:                number;
    partEternitied:           BankedInfinitiesClass;
    partSimulated:            number;
    perkPoints:               BankedInfinitiesClass;
    perks:                    number[];
    realityMachines:          BankedInfinitiesClass;
    rebuyables:               number[];
    reqLock:                  ReqLock;
    respec:                   boolean;
    rotateInventory:          boolean;
    secondGaussian:           number;
    seed:                     number;
    showGlyphSacrifice:       boolean;
    showSidebarPanel:         number;
    upgradeBits:              number;
    upgradeRequirementBits:   number;
}

export interface Automator {
    constantSortOrder: string[];
    constants:         Constants;
    currentInfoPane:   number;
    execTimer:         number;
    forceUnlock:       boolean;
    scripts:           Script[];
    state:             State;
    type:              number;
}

export interface Constants {
    TSEarlyGame:     string;
    TSADActive:      string;
    TSTDActive:      string;
    TSFirstDil:      string;
    TSIDActive:      string;
    TSTDPassive:     string;
    TSTDIdle:        string;
    TSEC11:          string;
    TS2PathFull:     string;
    TS2PathFullIdle: string;
    TSFull:          string;
}

export interface Script {
    content: string;
    id:      number;
    name:    string;
}

export interface State {
    editorScript:    number;
    followExecution: boolean;
    forceRestart:    boolean;
    mode:            number;
    repeat:          boolean;
    stack:           any[];
    topLevelScript:  number;
}

export interface Glyphs {
    active:              any[];
    cosmetics:           Cosmetics;
    createdRealityGlyph: boolean;
    filter:              Filter;
    inventory:           BestAmSet[];
    protectedRows:       number;
    sac:                 HighestRefinementValue;
    sets:                Set[];
    undo:                any[];
}

export interface Cosmetics {
    active:           boolean;
    colorMap:         AchievementTimes;
    glowNotification: boolean;
    symbolMap:        AchievementTimes;
    unlockedFromNG:   any[];
}

export interface Filter {
    basicEffectCount: number;
    basicRarity:      number;
    select:           number;
    trash:            number;
    types:            Types;
}

export interface Types {
    power:       EffarigClass;
    infinity:    EffarigClass;
    replication: EffarigClass;
    time:        EffarigClass;
    dilation:    EffarigClass;
    effarig:     EffarigClass;
}

export interface EffarigClass {
    effectCount:   number;
    effectScores:  number[];
    rarity:        number;
    score:         number;
    specifiedMask: number;
}

export interface Set {
    glyphs: BestAmSet[];
    name:   string;
}

export interface ReqLock {
    imaginary: number;
    reality:   number;
}

export interface HighestRefinementValue {
    dilation:    number;
    effarig:     number;
    infinity:    number;
    power:       number;
    replication: number;
    time:        number;
    reality?:    number;
} 