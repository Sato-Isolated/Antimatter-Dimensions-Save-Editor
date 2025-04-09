import { BankedInfinitiesClass } from './CommonStruct';

export interface Dimensions {
    antimatter: AntimatterElement[];
    infinity:   InfinityElement[];
    time:       Time[];
}

export interface AntimatterElement {
    bought:    number;
    costBumps: number;
    amount:    BankedInfinitiesClass;
}

export interface InfinityElement {
    baseAmount: number;
    bought:     number;
    cost:       BankedInfinitiesClass;
    isUnlocked: boolean;
    amount:     BankedInfinitiesClass;
}

export interface Time {
    bought: number;
    cost:   BankedInfinitiesClass;
    amount: BankedInfinitiesClass;
} 