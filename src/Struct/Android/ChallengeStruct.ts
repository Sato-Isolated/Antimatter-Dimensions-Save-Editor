import { BankedInfinitiesClass } from './CommonStruct';

export interface Challenge {
    eternity: ChallengeEternity;
    infinity: ChallengeInfinity;
    normal:   Normal;
}

export interface ChallengeEternity {
    completions:                       number[];
    current:                           number;
    ec8InfinityDimensionPurchasesLeft: number;
    ec8ReplicantiPurchasesLeft:        number;
    requirementBits:                   number;
    unlocked:                          number;
}

export interface ChallengeInfinity {
    bestTimes:     number[];
    completedBits: number;
    current:       number;
    ic2Count:      number;
    ic4Tier:       number;
    unlocked:      number;
}

export interface Normal {
    bestTimes:            number[];
    c2Pow:                BankedInfinitiesClass;
    c3Pow:                BankedInfinitiesClass;
    c8TotalSacrifice:     BankedInfinitiesClass;
    c9TickspeedCostBumps: number;
    completedBits:        number;
    current:              number;
} 