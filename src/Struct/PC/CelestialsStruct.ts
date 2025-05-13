import { BestAmSet } from './RecordsStruct';
import { EternityChalls } from './EternityStruct';
import { HighestRefinementValue } from './RealityStruct';

export interface Celestials {
    teresa:   Teresa;
    effarig:  CelestialsEffarig;
    enslaved: Enslaved;
    v:        V;
    ra:       Ra;
    laitela:  Laitela;
    pelle:    Pelle;
}

export interface CelestialsEffarig {
    relicShards:            number;
    unlockBits:             number;
    run:                    boolean;
    quoteBits:              number;
    glyphWeights:           GlyphWeights;
    autoAdjustGlyphWeights: boolean;
    glyphScoreSettings:     GlyphScoreSettings;
    glyphTrashMode:         number;
}

export interface GlyphScoreSettings {
    mode:              number;
    simpleEffectCount: number;
    types:             Types;
}

export interface Types {
    power:       Power;
    infinity:    TypesInfinity;
    replication: Replication;
    time:        TypesTime;
    dilation:    TypesDilation;
    effarig:     TypesEffarig;
    reality:     TypesReality;
    cursed:      Cursed;
    companion:   Companion;
}

export interface Companion {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   CompanionEffectChoices;
    effectScores:    CompanionEffectScores;
}

export interface CompanionEffectChoices {
    companiondescription: boolean;
    companionEP:          boolean;
}

export interface CompanionEffectScores {
    companiondescription: number;
    companionEP:          number;
}

export interface Cursed {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   CursedEffectChoices;
    effectScores:    CursedEffectScores;
}

export interface CursedEffectChoices {
    cursedgalaxies:   boolean;
    curseddimensions: boolean;
    cursedtickspeed:  boolean;
    cursedEP:         boolean;
}

export interface CursedEffectScores {
    cursedgalaxies:   number;
    curseddimensions: number;
    cursedtickspeed:  number;
    cursedEP:         number;
}

export interface TypesDilation {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   DilationEffectChoices;
    effectScores:    DilationEffectScores;
}

export interface DilationEffectChoices {
    dilationDT:              boolean;
    dilationgalaxyThreshold: boolean;
    dilationTTgen:           boolean;
    dilationpow:             boolean;
}

export interface DilationEffectScores {
    dilationDT:              number;
    dilationgalaxyThreshold: number;
    dilationTTgen:           number;
    dilationpow:             number;
}

export interface TypesEffarig {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   EffarigEffectChoices;
    effectScores:    EffarigEffectScores;
}

export interface EffarigEffectChoices {
    effarigblackhole:   boolean;
    effarigrm:          boolean;
    effarigglyph:       boolean;
    effarigachievement: boolean;
    effarigforgotten:   boolean;
    effarigdimensions:  boolean;
    effarigantimatter:  boolean;
}

export interface EffarigEffectScores {
    effarigblackhole:   number;
    effarigrm:          number;
    effarigglyph:       number;
    effarigachievement: number;
    effarigforgotten:   number;
    effarigdimensions:  number;
    effarigantimatter:  number;
}

export interface TypesInfinity {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   InfinityEffectChoices;
    effectScores:    InfinityEffectScores;
}

export interface InfinityEffectChoices {
    infinitypow:     boolean;
    infinityrate:    boolean;
    infinityIP:      boolean;
    infinityinfmult: boolean;
}

export interface InfinityEffectScores {
    infinitypow:     number;
    infinityrate:    number;
    infinityIP:      number;
    infinityinfmult: number;
}

export interface Power {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   PowerEffectChoices;
    effectScores:    PowerEffectScores;
}

export interface PowerEffectChoices {
    powerpow:      boolean;
    powermult:     boolean;
    powerdimboost: boolean;
    powerbuy10:    boolean;
}

export interface PowerEffectScores {
    powerpow:      number;
    powermult:     number;
    powerdimboost: number;
    powerbuy10:    number;
}

export interface TypesReality {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   RealityEffectChoices;
    effectScores:    RealityEffectScores;
}

export interface RealityEffectChoices {
    realityglyphlevel: boolean;
    realitygalaxies:   boolean;
    realityrow1pow:    boolean;
    realityDTglyph:    boolean;
}

export interface RealityEffectScores {
    realityglyphlevel: number;
    realitygalaxies:   number;
    realityrow1pow:    number;
    realityDTglyph:    number;
}

export interface Replication {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   ReplicationEffectChoices;
    effectScores:    ReplicationEffectScores;
}

export interface ReplicationEffectChoices {
    replicationspeed:      boolean;
    replicationpow:        boolean;
    replicationdtgain:     boolean;
    replicationglyphlevel: boolean;
}

export interface ReplicationEffectScores {
    replicationspeed:      number;
    replicationpow:        number;
    replicationdtgain:     number;
    replicationglyphlevel: number;
}

export interface TypesTime {
    rarityThreshold: number;
    scoreThreshold:  number;
    effectCount:     number;
    effectChoices:   TimeEffectChoices;
    effectScores:    TimeEffectScores;
}

export interface TimeEffectChoices {
    timepow:      boolean;
    timespeed:    boolean;
    timeetermult: boolean;
    timeEP:       boolean;
}

export interface TimeEffectScores {
    timepow:      number;
    timespeed:    number;
    timeetermult: number;
    timeEP:       number;
}

export interface GlyphWeights {
    ep:         number;
    repl:       number;
    dt:         number;
    eternities: number;
}

export interface Enslaved {
    isStoring:          boolean;
    stored:             number;
    isStoringReal:      boolean;
    storedReal:         number;
    autoStoreReal:      boolean;
    isAutoReleasing:    boolean;
    quoteBits:          number;
    unlocks:            number[];
    run:                boolean;
    completed:          boolean;
    tesseracts:         number;
    hasSecretStudy:     boolean;
    feltEternity:       boolean;
    progressBits:       number;
    hintBits:           number;
    hintUnlockProgress: number;
    glyphHintsGiven:    number;
    zeroHintTime:       number;
    storedFraction:     number;
}

export interface Laitela {
    darkMatter:              string;
    maxDarkMatter:           string;
    run:                     boolean;
    quoteBits:               number;
    dimensions:              Dimension[];
    entropy:                 number;
    thisCompletion:          number;
    fastestCompletion:       number;
    difficultyTier:          number;
    upgrades:                EternityChalls;
    darkMatterMult:          number;
    darkEnergy:              number;
    singularitySorting:      SingularitySorting;
    singularities:           number;
    singularityCapIncreases: number;
    lastCheckedMilestones:   number;
}

export interface Dimension {
    amount:              string;
    intervalUpgrades:    number;
    powerDMUpgrades:     number;
    powerDEUpgrades:     number;
    timeSinceLastUpdate: number;
    ascensionCount:      number;
}

export interface SingularitySorting {
    displayResource: number;
    sortResource:    number;
    showCompleted:   number;
    sortOrder:       number;
}

export interface Pelle {
    doomed:          boolean;
    upgrades:        any[];
    remnants:        number;
    realityShards:   string;
    records:         PelleRecords;
    rebuyables:      Rebuyables;
    rifts:           Rifts;
    progressBits:    number;
    galaxyGenerator: GalaxyGenerator;
    quoteBits:       number;
    collapsed:       Collapsed;
    showBought:      boolean;
}

export interface Collapsed {
    upgrades: boolean;
    rifts:    boolean;
    galaxies: boolean;
}

export interface GalaxyGenerator {
    unlocked:          boolean;
    spentGalaxies:     number;
    generatedGalaxies: number;
    phase:             number;
    sacrificeActive:   boolean;
}

export interface Rebuyables {
    antimatterDimensionMult:       number;
    timeSpeedMult:                 number;
    glyphLevels:                   number;
    infConversion:                 number;
    galaxyPower:                   number;
    galaxyGeneratorAdditive:       number;
    galaxyGeneratorMultiplicative: number;
    galaxyGeneratorAntimatterMult: number;
    galaxyGeneratorIPMult:         number;
    galaxyGeneratorEPMult:         number;
}

export interface PelleRecords {
    totalAntimatter:     string;
    totalInfinityPoints: string;
    totalEternityPoints: string;
}

export interface Rifts {
    vacuum:    Decay;
    decay:     Decay;
    chaos:     Chaos;
    recursion: Decay;
    paradox:   Decay;
}

export interface Chaos {
    fill:      number;
    active:    boolean;
    reducedTo: number;
}

export interface Decay {
    fill:             string;
    active:           boolean;
    percentageSpent?: number;
    reducedTo:        number;
}

export interface Ra {
    pets:                   Pets;
    alchemy:                Alchemy[];
    highestRefinementValue: HighestRefinementValue;
    quoteBits:              number;
    momentumTime:           number;
    unlockBits:             number;
    run:                    boolean;
    charged:                any[];
    disCharge:              boolean;
    peakGamespeed:          number;
    petWithRemembrance:     string;
}

export interface Alchemy {
    amount:   number;
    reaction: boolean;
}

export interface Pets {
    teresa:   EnslavedClass;
    effarig:  EnslavedClass;
    enslaved: EnslavedClass;
    v:        EnslavedClass;
}

export interface EnslavedClass {
    level:          number;
    memories:       number;
    memoryChunks:   number;
    memoryUpgrades: number;
    chunkUpgrades:  number;
}

export interface Teresa {
    pouredAmount:         number;
    quoteBits:            number;
    unlockBits:           number;
    run:                  boolean;
    bestRunAM:            string;
    bestAMSet:            BestAmSet[];
    perkShop:             number[];
    lastRepeatedMachines: string;
}

export interface V {
    unlockBits:         number;
    run:                boolean;
    quoteBits:          number;
    runUnlocks:         number[];
    goalReductionSteps: number[];
    STSpent:            number;
    runGlyphs:          Array<BestAmSet[]>;
    runRecords:         number[];
    wantsFlipped:       boolean;
} 