import { BankedInfinitiesClass } from './CommonStruct';

export interface Auto {
    achTimer:           number;
    achievements:       boolean;
    annihilation:       Annihilation;
    ascension:          Ascension;
    bigCrunch:          BigCrunch;
    blackHolePower:     Singularity[];
    darkMatterDims:     Ascension;
    dilationUpgrades:   Ascension[];
    dimBoost:           DimBoost;
    dimensions:         Tickspeed[];
    disableContinuum:   boolean;
    ec:                 boolean;
    ecTimer:            number;
    epMult:             boolean;
    eternity:           AutoEternity;
    galaxy:             Galaxy;
    glyphAutoClean:     boolean;
    glyphCollapse:      boolean;
    glyphSort:          number;
    imaginaryUpgrades:  Singularity[];
    infinityDims:       Ascension[];
    ipMult:             boolean;
    reality:            AutoReality;
    realityUpgrades:    Singularity[];
    replicantiUpgrades: Ascension[];
    sacrifice:          Sacrifice;
    singularity:        Singularity;
    tickspeed:          Tickspeed;
    timeDims:           Ascension[];
    timeTheorems:       Singularity;
}

export interface Annihilation {
    multiplier: number;
    isActive:   boolean;
}

export interface Ascension {
    lastTick: number;
    isActive: boolean;
}

export interface BigCrunch {
    amount:           BankedInfinitiesClass;
    increaseWithMult: boolean;
    mode:             number;
    time:             number;
    xHighest:         BankedInfinitiesClass;
    cost:             number;
    interval:         number;
    lastTick:         number;
    isActive:         boolean;
}

export interface Singularity {
    isActive: boolean;
}

export interface DimBoost {
    buyMaxInterval:     number;
    galaxies:           number;
    limitDimBoosts:     boolean;
    limitUntilGalaxies: boolean;
    maxDimBoosts:       number;
    cost:               number;
    interval:           number;
    lastTick:           number;
    isActive:           boolean;
}

export interface Tickspeed {
    bulk?:         number;
    isUnlocked:    boolean;
    mode:          number;
    readyToUnlock: boolean;
    cost:          number;
    interval:      number;
    lastTick:      number;
    isActive:      boolean;
}

export interface AutoEternity {
    amount:           BankedInfinitiesClass;
    increaseWithMult: boolean;
    mode:             number;
    time:             number;
    xHighest:         BankedInfinitiesClass;
    isActive:         boolean;
}

export interface Galaxy {
    buyMaxInterval: number;
    limitGalaxies:  boolean;
    maxGalaxies:    number;
    cost:           number;
    interval:       number;
    lastTick:       number;
    isActive:       boolean;
}

export interface AutoReality {
    glyph:    number;
    mode:     number;
    rm:       BankedInfinitiesClass;
    shard:    number;
    time:     number;
    isActive: boolean;
}

export interface Sacrifice {
    multiplier: BankedInfinitiesClass;
    isActive:   boolean;
} 