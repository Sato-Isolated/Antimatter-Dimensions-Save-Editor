export interface Speedrun {
    isUnlocked:           boolean;
    isActive:             boolean;
    isSegmented:          boolean;
    usedSTD:              boolean;
    hasStarted:           boolean;
    hideInfo:             boolean;
    displayAllMilestones: boolean;
    startDate:            number;
    name:                 string;
    offlineTimeUsed:      number;
    records:              unknown[] | Record<string, number>;
    milestones:           unknown[];
    achievementTimes:     Record<string, unknown>;
}
