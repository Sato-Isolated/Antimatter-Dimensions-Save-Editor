import { BankedInfinitiesClass } from './CommonStruct';
import { BestAmSet } from './CelestialsStruct';

export interface AntimatterDimensionsStructRecords {
    bestReality:          BestReality;
    fullGameCompletions:  number;
    gameCreatedTime:      number;
    pastTenEternities:    PastTenNity[];
    pastTenInfinities:    PastTenNity[];
    pastTenRealities:     PastTenReality[];
    previousRunRealTime:  number;
    realTimeDoomed:       number;
    realTimePlayed:       number;
    thisEternity:         ThisEternity;
    thisInfinity:         ThisInfinity;
    thisReality:          ThisReality;
    timePlayedAtBHUnlock: number;
    totalAntimatter:      BankedInfinitiesClass;
    totalTimePlayed:      number;
}

export interface BestReality {
    bestEP:        BankedInfinitiesClass;
    bestEPSet:     BestAmSet[];
    bestRM:        BankedInfinitiesClass;
    bestRMSet:     BestAmSet[];
    bestRMmin:     BankedInfinitiesClass;
    bestRMminSet:  BestAmSet[];
    glyphLevel:    number;
    glyphLevelSet: BestAmSet[];
    glyphRarity:   number;
    iMCapSet:      BestAmSet[];
    laitelaSet:    BestAmSet[];
    realTime:      number;
    speedSet:      BestAmSet[];
    time:          number;
}

export interface PastTenNity {
    gainedTP?:         BankedInfinitiesClass;
    challenge:         string;
    currencyGain:      BankedInfinitiesClass;
    prestigeCountGain: BankedInfinitiesClass;
    realTime:          number;
    time:              number;
}

export interface PastTenReality {
    glyphLevel:        number;
    shards:            number;
    challenge:         string;
    currencyGain:      BankedInfinitiesClass;
    prestigeCountGain: BankedInfinitiesClass;
    realTime:          number;
    time:              number;
}

export interface ThisEternity {
    bestEPmin:              BankedInfinitiesClass;
    bestEPminVal:           BankedInfinitiesClass;
    bestIPmin:              BankedInfinitiesClass;
    bestIPminWithoutMaxAll: BankedInfinitiesClass;
    bestInfinitiesPerMs:    BankedInfinitiesClass;
    bestInfinityRealTime:   number;
    bestInfinityTime:       number;
    maxAM:                  BankedInfinitiesClass;
    maxIP:                  BankedInfinitiesClass;
    realTime:               number;
    time:                   number;
}

export interface ThisInfinity {
    bestIPmin:    BankedInfinitiesClass;
    bestIPminVal: BankedInfinitiesClass;
    lastBuyTime:  number;
    maxAM:        BankedInfinitiesClass;
    realTime:     number;
    time:         number;
}

export interface ThisReality {
    bestEPmin:           BankedInfinitiesClass;
    bestEternitiesPerMs: BankedInfinitiesClass;
    bestEternityTime:    number;
    bestGlyphLevel:      number;
    bestRMmin:           BankedInfinitiesClass;
    bestRSmin:           number;
    bestRSminVal:        number;
    maxAM:               BankedInfinitiesClass;
    maxDT:               BankedInfinitiesClass;
    maxEP:               BankedInfinitiesClass;
    maxIP:               BankedInfinitiesClass;
    maxReplicanti:       BankedInfinitiesClass;
    realTime:            number;
    time:                number;
} 