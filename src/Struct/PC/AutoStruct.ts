export interface Auto {
    autobuyersOn:       boolean;
    disableContinuum:   boolean;
    reality:            AutoReality;
    eternity:           AutoEternity;
    bigCrunch:          BigCrunch;
    galaxy:             Galaxy & {
        buyMax?:         boolean;
        buyMaxInterval?: boolean;
    };
    dimBoost:           DimBoost;
    tickspeed:          Tickspeed;
    sacrifice:          Sacrifice;
    antimatterDims:     AntimatterDims & {
        isActive: boolean;
    };
    infinityDims:       DilationUpgrades & {
        isActive: boolean;
    };
    timeDims:           DilationUpgrades & {
        isActive: boolean;
    };
    replicantiGalaxies: EpMultBuyer;
    replicantiUpgrades: DilationUpgrades;
    timeTheorems:       EpMultBuyer;
    dilationUpgrades:   DilationUpgrades;
    blackHolePower:     BlackHolePower;
    realityUpgrades:    BlackHolePower;
    imaginaryUpgrades:  BlackHolePower;
    darkMatterDims:     Ascension;
    ascension:          Ascension;
    annihilation:       Annihilation;
    singularity:        EpMultBuyer;
    ipMultBuyer:        EpMultBuyer;
    epMultBuyer:        EpMultBuyer;
}

export interface Annihilation {
    isActive:   boolean;
    multiplier: number;
}

export interface AntimatterDims {
    all:      Tickspeed[];
    isActive: boolean;
}

export interface Tickspeed {
    isUnlocked: boolean;
    cost:       number;
    interval:   number;
    bulk?:      number;
    mode:       number;
    isActive:   boolean;
    lastTick:   number;
    isBought:   boolean;
}

export interface Ascension {
    isActive: boolean;
    lastTick: number;
}

export interface BigCrunch {
    cost:             number;
    interval:         number;
    mode:             number;
    amount:           string;
    increaseWithMult: boolean;
    time:             number;
    xHighest:         string;
    isActive:         boolean;
    lastTick:         number;
}

export interface BlackHolePower {
    all:      EpMultBuyer[];
    isActive: boolean;
}

export interface EpMultBuyer {
    isActive: boolean;
}

export interface DilationUpgrades {
    all:      Ascension[];
    isActive: boolean;
}

export interface DimBoost {
    cost:               number;
    interval:           number;
    limitDimBoosts:     boolean;
    maxDimBoosts:       number;
    limitUntilGalaxies: boolean;
    galaxies:           number;
    buyMaxInterval:     number;
    isActive:           boolean;
    lastTick:           number;
}

export interface AutoEternity {
    mode:             number;
    amount:           string;
    increaseWithMult: boolean;
    time:             number;
    xHighest:         string;
    isActive:         boolean;
}

export interface Galaxy {
    cost:           number;
    interval:       number;
    limitGalaxies:  boolean;
    maxGalaxies:    number;
    buyMax:         boolean;
    buyMaxInterval: number;
    isActive:       boolean;
    lastTick:       number;
}

export interface AutoReality {
    mode:     number;
    rm:       string;
    glyph:    number;
    isActive: boolean;
}

export interface Sacrifice {
    multiplier: string;
    isActive:   boolean;
} 