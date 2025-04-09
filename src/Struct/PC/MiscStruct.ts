export interface SecretUnlocks {
    themes:             string[];
    viewSecretTS:       boolean;
    cancerAchievements: boolean;
}

export interface ShownRuns {
    Reality:  boolean;
    Eternity: boolean;
    Infinity: boolean;
}

export interface RequirementChecks {
    infinity:  RequirementChecksInfinity;
    eternity:  RequirementChecksEternity;
    reality:   RequirementChecksReality;
    permanent: Permanent;
}

export interface RequirementChecksEternity {
    onlyAD1: boolean;
    onlyAD8: boolean;
    noAD1:   boolean;
    noRG:    boolean;
}

export interface RequirementChecksInfinity {
    maxAll:      boolean;
    noSacrifice: boolean;
    noAD8:       boolean;
}

export interface Permanent {
    emojiGalaxies:    number;
    singleTickspeed:  number;
    perkTreeDragging: number;
}

export interface RequirementChecksReality {
    noAM:          boolean;
    noTriads:      boolean;
    noPurchasedTT: boolean;
    noInfinities:  boolean;
    noEternities:  boolean;
    noContinuum:   boolean;
    maxID1:        string;
    maxStudies:    number;
    maxGlyphs:     number;
    slowestBH:     number;
} 