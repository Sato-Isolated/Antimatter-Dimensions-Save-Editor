export interface Dimensions {
    antimatter: Antimatter[];
    infinity:   InfinityElement[];
    time:       TimeElement[];
}

export interface Antimatter {
    bought:    number;
    costBumps: number;
    amount:    string;
}

export interface InfinityElement {
    isUnlocked: boolean;
    bought:     number;
    amount:     string;
    cost:       string;
    baseAmount: number;
}

export interface TimeElement {
    cost:   string;
    amount: string;
    bought: number;
}

export interface EternityDimension {
    amount:     string;
    bought:     number;
    baseAmount: number;
    cost?:      string;
    isUnlocked?: boolean;
}

export interface RealityDimension {
    amount:     string;
    bought:     number;
    isUnlocked: boolean;
} 