import { Type } from './RecordsStruct';
import { EternityChalls } from './EternityStruct';

export interface AntimatterDimensionsStructReality {
    realityMachines:        string;
    imaginaryMachines:      number;
    iMCap:                  number;
    glyphs:                 Glyphs;
    seed:                   number;
    secondGaussian:         number;
    musicSeed:              number;
    musicSecondGaussian:    number;
    rebuyables:             { [key: string]: number };
    upgradeBits:            number;
    upgReqs:                number;
    imaginaryUpgradeBits:   number;
    imaginaryUpgReqs:       number;
    imaginaryRebuyables:    { [key: string]: number };
    perks:                  number[];
    respec:                 boolean;
    showGlyphSacrifice:     boolean;
    showSidebarPanel:       number;
    autoSort:               number;
    autoCollapse:           boolean;
    autoAutoClean:          boolean;
    applyFilterToPurge:     boolean;
    moveGlyphsOnProtection: boolean;
    perkPoints:             number;
    autoEC:                 boolean;
    lastAutoEC:             number;
    partEternitied:         string;
    autoAchieve:            boolean;
    gainedAutoAchievements: boolean;
    automator:              Automator;
    achTimer:               number;
}

export interface Automator {
    state:           State;
    scripts:         { [key: string]: Script };
    constants:       Record<string, string>;
    constantSortOrder: string[];
    execTimer:       number;
    type:            number;
    forceUnlock:     boolean;
    currentInfoPane: number;
}

export interface Script {
    id:      number;
    name:    string;
    content: string;
}

export interface State {
    mode:            number;
    topLevelScript:  number;
    editorScript:    number;
    repeat:          boolean;
    forceRestart:    boolean;
    followExecution: boolean;
    stack:           unknown[];
}

export interface Glyphs {
    active:              unknown[];
    inventory:           Inventory[];
    sac:                 HighestRefinementValue;
    undo:                unknown[];
    sets:                Set[];
    protectedRows:       number;
    createdRealityGlyph: boolean;
    cosmetics:           Cosmetics;
}

export interface Cosmetics {
    active:           boolean;
    glowNotification: boolean;
    unlockedFromNG:   unknown[];
    symbolMap:        EternityChalls;
    colorMap:         EternityChalls;
}

export interface Inventory {
    id:        number;
    idx:       number;
    type:      Type;
    strength:  number;
    level:     number;
    rawLevel:  number;
    effects:   number;
    cosmetic?: string;
}

export interface Set {
    name:   string;
    glyphs: Inventory[];
}

export interface HighestRefinementValue {
    power:       number;
    infinity:    number;
    time:        number;
    replication: number;
    dilation:    number;
    effarig:     number;
    reality?:    number;
} 
