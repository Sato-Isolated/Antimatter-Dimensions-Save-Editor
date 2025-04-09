import { BankedInfinitiesClass } from './CommonStruct';

export interface SecretUnlocks {
    cancerAchievements: boolean;
    h2pPagesOpened:     number;
    themes:             string[];
    viewSecretTS:       boolean;
}

export interface ShownRuns {
    eternity: boolean;
    infinity: boolean;
    reality:  boolean;
}

export interface RequirementChecks {
    eternity:  RequirementChecksEternity;
    infinity:  RequirementChecksInfinity;
    permanent: Permanent;
    reality:   RequirementChecksReality;
}

export interface RequirementChecksEternity {
    noAD1:   boolean;
    noRG:    boolean;
    onlyAD1: boolean;
    onlyAD8: boolean;
}

export interface RequirementChecksInfinity {
    maxAll:      boolean;
    noAD8:       boolean;
    noSacrifice: boolean;
}

export interface Permanent {
    emojiGalaxies:    number;
    perkTreeDragging: number;
    singleTickspeed:  number;
}

export interface RequirementChecksReality {
    maxGlyphs:     number;
    maxID1:        BankedInfinitiesClass;
    maxStudies:    number;
    noAM:          boolean;
    noContinuum:   boolean;
    noEternities:  boolean;
    noInfinities:  boolean;
    noPurchasedTT: boolean;
    noTriads:      boolean;
    slowestBH:     number;
}

export interface AntimatterDimensionsStructNews {
    eiffelTowerChapter: number;
    newsQueuePosition:  number;
    paperclips:         number;
    totalSeen:          number;
    uselessNewsClicks:  number;
}

export interface Speedrun {
    achievementTimes:     AchievementTimes;
    displayAllMilestones: boolean;
    hasStarted:           boolean;
    hideInfo:             boolean;
    initialSeed:          number;
    isActive:             boolean;
    isSegmented:          boolean;
    isUnlocked:           boolean;
    name:                 string;
    offlineTimeUsed:      number;
    previousRuns:         any[];
    records:              number[];
    seedSelection:        number;
    startDate:            number;
    usedSTD:              boolean;
}

export interface AchievementTimes {
} 