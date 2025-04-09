import { AchievementTimes } from './CommonStruct';

export interface Achievements {
    achievementBits: number[];
    secretUnlocks:   SecretUnlocks;
    dark:            Ach;
    noLimits:        Ach;
    noRoomNoPoint:   Ach;
    r84:             Ach;
    r86:             Ach;
    r88:             Ach;
    r95:             Ach;
    standard:        Ach;
    timeAndDimension: Ach;
    zeroPoints:      Ach;
    zero:            Ach;
}

export interface Ach {
    unlockBits: number;
    hintBits:   number;
}

export interface SecretUnlocks {
    cancerAchievements: boolean;
    h2pPagesOpened:     number;
    themes:             number;
    viewSecretTS:       number;
}

export interface AntimatterDimensionsStructAchievements {
    achievementBits: number[];
    normalAchievements: string[];
    secretAchievementBits: number;
    secretAchievements: string[];
    isSecretAchievementUnlocked: string[];
    notifications: boolean;
    maxAchievementsForETTR: number;
    shadowAchievement: string[];
    delayedAchievements: AchievementTimeProgressData[];
}

export interface AchievementTimeProgressData {
    id: string;
    isValid: boolean;
    progress: number;
    isFinished: boolean;
    timeout: number;
    oldTimeStamp: number;
    name: string;
    description: string;
} 