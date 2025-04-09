export interface Challenge {
    normal:   NormalClass;
    infinity: NormalClass;
    eternity: ChallengeEternity;
}

export interface ChallengeEternity {
    current:         number;
    unlocked:        number;
    requirementBits: number;
}

export interface NormalClass {
    current:       number;
    bestTimes:     number[];
    completedBits: number;
} 