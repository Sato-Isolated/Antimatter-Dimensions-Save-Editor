export interface AntimatterDimensionsStructRecords {
    gameCreatedTime:      number;
    totalTimePlayed:      number;
    timePlayedAtBHUnlock: number;
    realTimePlayed:       number;
    realTimeDoomed:       number;
    fullGameCompletions:  number;
    totalAntimatter:      string;
    lastTenInfinities:    Array<Array<number | string>>;
    lastTenEternities:    Array<Array<number | string>>;
    lastTenRealities:     Array<Array<number | RealityMachines>>;
    thisInfinity:         ThisInfinity;
    bestInfinity:         BestInfinity;
    thisEternity:         ThisEternity;
    bestEternity:         BestEternity;
    thisReality:          ThisReality;
    bestReality:          BestReality;
}

export enum RealityMachines {
    The1335330436433 = "1335330436433",
    The1E1500 = "1e+1500",
}

export interface BestEternity {
    time:             number;
    realTime:         number;
    bestEPminReality: string;
}

export interface BestInfinity {
    time:              number;
    realTime:          number;
    bestIPminEternity: string;
    bestIPminReality:  string;
}

export interface BestReality {
    time:          number;
    realTime:      number;
    glyphStrength: number;
    RM:            RealityMachines;
    RMSet:         BestAmSet[];
    RMmin:         string;
    RMminSet:      BestAmSet[];
    glyphLevel:    number;
    glyphLevelSet: BestAmSet[];
    bestEP:        string;
    bestEPSet:     BestAmSet[];
    speedSet:      BestAmSet[];
    iMCapSet:      BestAmSet[];
    laitelaSet:    BestAmSet[];
}

export interface BestAmSet {
    type:     Type;
    level:    number;
    strength: number;
    effects:  number;
}

export enum Type {
    Companion = "companion",
    Cursed = "cursed",
    Dilation = "dilation",
    Effarig = "effarig",
    Infinity = "infinity",
    Power = "power",
    Reality = "reality",
    Replication = "replication",
    Time = "time",
}

export interface ThisEternity {
    time:                  number;
    realTime:              number;
    maxAM:                 string;
    maxIP:                 string;
    bestIPMsWithoutMaxAll: string;
    bestEPmin:             string;
    bestInfinitiesPerMs:   string;
}

export interface ThisInfinity {
    time:        number;
    realTime:    number;
    lastBuyTime: number;
    maxAM:       string;
    bestIPmin:   string;
}

export interface ThisReality {
    time:                number;
    realTime:            number;
    maxAM:               string;
    maxIP:               string;
    maxEP:               string;
    bestEternitiesPerMs: string;
    maxReplicanti:       string;
    maxDT:               string;
} 