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
    records:              { [key: string]: number };
    milestones:           any[];
    achievementTimes:     any;
} 