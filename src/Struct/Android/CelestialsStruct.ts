import { BankedInfinitiesClass, AchievementTimes, Type } from './CommonStruct';

export interface Celestials {
    effarig:  CelestialsEffarig;
    enslaved: Enslaved;
    laitela:  Laitela;
    pelle:    Pelle;
    ra:       Ra;
    teresa:   Teresa;
    v:        V;
}

export interface CelestialsEffarig {
    autoAdjustGlyphWeights: boolean;
    glyphWeights:           GlyphWeights;
    quoteBits:              number;
    relicShards:            BankedInfinitiesClass;
    run:                    boolean;
    unlockBits:             number;
}

export interface GlyphWeights {
    dt:         number;
    ep:         number;
    eternities: number;
    repl:       number;
}

export interface Enslaved {
    autoStoreReal:      boolean;
    boostReality:       boolean;
    completed:          boolean;
    feltEternity:       boolean;
    glyphHintsGiven:    number;
    hasSecretStudy:     boolean;
    hintBits:           number;
    hintUnlockProgress: number;
    isAutoReleasing:    boolean;
    isStoring:          boolean;
    isStoringReal:      boolean;
    progressBits:       number;
    quoteBits:          number;
    run:                boolean;
    stored:             number;
    storedReal:         number;
    tesseracts:         number;
    unlocks:            number[];
    zeroHintTime:       number;
}

export interface Laitela {
    darkEnergy:              number;
    darkMatter:              BankedInfinitiesClass;
    darkMatterMult:          number;
    difficultyTier:          number;
    dimensions:              Dimension[];
    entropy:                 number;
    fastestCompletion:       number;
    lastCheckedMilestones:   number;
    maxDarkMatter:           BankedInfinitiesClass;
    milestoneGlow:           boolean;
    quoteBits:               number;
    run:                     boolean;
    singularities:           number;
    singularityCapIncreases: number;
    singularitySorting:      SingularitySorting;
    thisCompletion:          number;
}

export interface Dimension {
    ascensions:          number;
    intervalUpgrades:    number;
    powerDEUpgrades:     number;
    powerDMUpgrades:     number;
    timeSinceLastUpdate: number;
    amount:              BankedInfinitiesClass;
}

export interface SingularitySorting {
    displayResource: number;
    showCompleted:   number;
    sortOrder:       number;
    sortResource:    number;
}

export interface Pelle {
    collapsed:       Collapsed;
    doomed:          boolean;
    galaxyGenerator: GalaxyGenerator;
    progressBits:    number;
    quoteBits:       number;
    realityShards:   BankedInfinitiesClass;
    rebuyables:      number[];
    records:         PelleRecords;
    remnants:        number;
    rifts:           Rifts;
    showBought:      boolean;
    upgrades:        any[];
}

export interface Collapsed {
    galaxies: boolean;
    rifts:    boolean;
    upgrades: boolean;
}

export interface GalaxyGenerator {
    generatedGalaxies: number;
    phase:             number;
    sacrificeActive:   boolean;
    spentGalaxies:     number;
    unlocked:          boolean;
}

export interface PelleRecords {
    totalAntimatter:     BankedInfinitiesClass;
    totalEternityPoints: BankedInfinitiesClass;
    totalInfinityPoints: BankedInfinitiesClass;
}

export interface Rifts {
    chaos:     Chaos;
    decay:     Chaos;
    paradox:   Chaos;
    recursion: Chaos;
    vacuum:    Chaos;
}

export interface Chaos {
    active:          boolean;
    fill:            BankedInfinitiesClass;
    percentageSpent: number;
    reducedTo:       number;
}

export interface Ra {
    alchemy:                Alchemy[];
    chargedBits:            number;
    discharge:              boolean;
    highestRefinementValue: HighestRefinementValue;
    momentumTime:           number;
    peakGamespeed:          number;
    petWithRemembrance:     number;
    pets:                   Pets;
    quoteBits:              number;
    run:                    boolean;
    unlockBits:             number;
}

export interface Alchemy {
    amount:   number;
    reaction: boolean;
}

export interface Pets {
    effarig:  EnslavedClass;
    enslaved: EnslavedClass;
    teresa:   EnslavedClass;
    v:        EnslavedClass;
}

export interface EnslavedClass {
    chunkUpgrades:  number;
    level:          number;
    memories:       number;
    memoryChunks:   number;
    memoryUpgrades: number;
}

export interface Teresa {
    bestAMSet:            BestAmSet[];
    bestRunAM:            BankedInfinitiesClass;
    lastRepeatedMachines: BankedInfinitiesClass;
    perkShop:             number[];
    pouredAmount:         number;
    quoteBits:            number;
    run:                  boolean;
    unlockBits:           number;
}

export interface BestAmSet {
    effects: number;
    idx:     number;
    level:   number;
    rarity:  number;
    type:    Type;
    id?:     number;
}

export interface V {
    STSpent:            number;
    goalReductionSteps: number[];
    quoteBits:          number;
    run:                boolean;
    runGlyphs:          Array<BestAmSet[]>;
    runRecords:         number[];
    runUnlocks:         number[];
    unlockBits:         number;
    wantsFlipped:       boolean;
}

export interface HighestRefinementValue {
    value: number;
    sources: HighestRefinementValueSource;
}

export interface HighestRefinementValueSource {
    "teresa1"?: boolean;
    "teresa2"?: boolean;
    "teresa3"?: boolean;
    "teresa4"?: boolean;
    "v"?: boolean;
    "ra1"?: boolean;
    "ra2"?: boolean;
    "ra3"?: boolean;
    "ra4"?: boolean;
    [key: string]: boolean | undefined;
} 