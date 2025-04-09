export interface AntimatterDimensionsStruct {
    antimatter:                   string;
    dimensions:                   Dimensions;
    buyUntil10:                   boolean;
    sacrificed:                   string;
    achievementBits:              number[];
    secretAchievementBits:        number[];
    infinityUpgrades:             any[];
    infinityRebuyables:           number[];
    challenge:                    Challenge;
    infinity:                     AntimatterDimensionsStructInfinity;
    auto:                         Auto;
    infinityPoints:               string;
    infinities:                   string;
    infinitiesBanked:             string;
    dimensionBoosts:              number;
    galaxies:                     number;
    news:                         AntimatterDimensionsStructNews;
    lastUpdate:                   number;
    chall2Pow:                    number;
    chall3Pow:                    string;
    matter:                       string;
    chall9TickspeedCostBumps:     number;
    chall8TotalSacrifice:         string;
    ic2Count:                     number;
    partInfinityPoint:            number;
    partInfinitied:               number;
    break:                        boolean;
    secretUnlocks:                SecretUnlocks;
    shownRuns:                    ShownRuns;
    requirementChecks:            RequirementChecks;
    records:                      AntimatterDimensionsStructRecords;
    speedrun:                     Speedrun;
    IPMultPurchases:              number;
    version:                      number;
    infinityPower:                string;
    postC4Tier:                   number;
    eternityPoints:               string;
    eternities:                   string;
    eternityUpgrades:             any[];
    epmultUpgrades:               number;
    timeShards:                   string;
    totalTickGained:              number;
    totalTickBought:              number;
    replicanti:                   Replicanti;
    timestudy:                    Timestudy;
    eternityChalls:               EternityChalls;
    respec:                       boolean;
    eterc8ids:                    number;
    eterc8repl:                   number;
    dilation:                     AntimatterDimensionsStructDilation;
    realities:                    number;
    partSimulatedReality:         number;
    reality:                      AntimatterDimensionsStructReality;
    blackHole:                    BlackHole[];
    blackHolePause:               boolean;
    blackHoleAutoPauseMode:       number;
    blackHolePauseTime:           number;
    blackHoleNegative:            number;
    celestials:                   Celestials;
    isGameEnd:                    boolean;
    tabNotifications:             any[];
    triggeredTabNotificationBits: number;
    tutorialState:                number;
    tutorialActive:               boolean;
    options:                      Options;
    IAP:                          Iap;
    eternityDimensions:           EternityDimension[];
    realityDimensions:            RealityDimension[];
}

export interface Iap {
    enabled:         boolean;
    checkoutSession: CheckoutSession;
}

export interface CheckoutSession {
    id: boolean;
}

export interface Auto {
    autobuyersOn:       boolean;
    disableContinuum:   boolean;
    reality:            AutoReality;
    eternity:           AutoEternity;
    bigCrunch:          BigCrunch;
    galaxy:             Galaxy;
    dimBoost:           DimBoost;
    tickspeed:          Tickspeed;
    sacrifice:          Sacrifice;
    antimatterDims:     AntimatterDims;
    infinityDims:       DilationUpgrades;
    timeDims:           DilationUpgrades;
    replicantiGalaxies: EpMultBuyer;
    replicantiUpgrades: DilationUpgrades;
    timeTheorems:       EpMultBuyer;
    dilationUpgrades:   DilationUpgrades;
    blackHolePower:     BlackHolePower;
    realityUpgrades:    BlackHolePower;
    imaginaryUpgrades:  BlackHolePower;
    darkMatterDims:     Ascension;
    ascension:          Ascension;
    annihilation:       Annihilation;
    singularity:        EpMultBuyer;
    ipMultBuyer:        EpMultBuyer;
    epMultBuyer:        EpMultBuyer;
}

export interface Annihilation {
    isActive:   boolean;
    multiplier: number;
}

export interface AntimatterDims {
    all:      Tickspeed[];
    isActive: boolean;
}

export interface Tickspeed {
    isUnlocked: boolean;
    cost:       number;
    interval:   number;
    bulk?:      number;
    mode:       number;
    isActive:   boolean;
    lastTick:   number;
    isBought:   boolean;
}

export interface Ascension {
    isActive: boolean;
    lastTick: number;
}

export interface BigCrunch {
    cost:             number;
    interval:         number;
    mode:             number;
    amount:           string;
    increaseWithMult: boolean;
    time:             number;
    xHighest:         string;
    isActive:         boolean;
    lastTick:         number;
}

export interface BlackHolePower {
    all:      EpMultBuyer[];
    isActive: boolean;
}

export interface EpMultBuyer {
    isActive: boolean;
}

export interface DilationUpgrades {
    all:      Ascension[];
    isActive: boolean;
}

export interface DimBoost {
    cost:               number;
    interval:           number;
    limitDimBoosts:     boolean;
    maxDimBoosts:       number;
    limitUntilGalaxies: boolean;
    galaxies:           number;
    buyMaxInterval:     number;
    isActive:           boolean;
    lastTick:           number;
}

export interface AutoEternity {
    mode:             number;
    amount:           string;
    increaseWithMult: boolean;
    time:             number;
    xHighest:         string;
    isActive:         boolean;
}

export interface Galaxy {
    cost:           number;
    interval:       number;
    limitGalaxies:  boolean;
    maxGalaxies:    number;
    buyMax:         boolean;
    buyMaxInterval: number;
    isActive:       boolean;
    lastTick:       number;
}

export interface AutoReality {
    mode:     number;
    rm:       string;
    glyph:    number;
    isActive: boolean;
}

export interface Sacrifice {
    multiplier: string;
    isActive:   boolean;
}

export interface BlackHole {
    id:               number;
    intervalUpgrades: number;
    powerUpgrades:    number;
    durationUpgrades: number;
    phase:            number;
    active:           boolean;
    unlocked:         boolean;
    activations:      number;
}

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

export interface EternityChalls {
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

export interface HighestRefinementValue {
    power:       number;
    infinity:    number;
    time:        number;
    replication: number;
    dilation:    number;
    effarig:     number;
    reality?:    number;
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

export interface BestAmSet {
    type:     Type;
    level:    number;
    strength: number;
    effects:  number;
}

export enum Type {
    Companion = "companion",
    Cursed = "cursed",
    Dilation = "dilation",
    Effarig = "effarig",
    Infinity = "infinity",
    Power = "power",
    Reality = "reality",
    Replication = "replication",
    Time = "time",
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

export interface AntimatterDimensionsStructDilation {
    studies:              any[];
    active:               boolean;
    tachyonParticles:     string;
    dilatedTime:          string;
    nextThreshold:        string;
    baseTachyonGalaxies:  number;
    totalTachyonGalaxies: number;
    upgrades:             any[];
    rebuyables:           { [key: string]: number };
    lastEP:               string;
}

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

export interface AntimatterDimensionsStructInfinity {
    upgradeBits: number;
}

export interface AntimatterDimensionsStructNews {
    seen:              Seen;
    specialTickerData: SpecialTickerData;
    totalSeen:         number;
}

export interface Seen {
    a: number[];
    p: number[];
    l: number[];
}

export interface SpecialTickerData {
    uselessNewsClicks:  number;
    paperclips:         number;
    newsQueuePosition:  number;
    eiffelTowerChapter: number;
}

export interface Options {
    news:                         OptionsNews;
    notation:                     string;
    retryChallenge:               boolean;
    retryCelestial:               boolean;
    showAllChallenges:            boolean;
    cloudEnabled:                 boolean;
    hideGoogleName:               boolean;
    showCloudModal:               boolean;
    forceCloudOverwrite:          boolean;
    syncSaveIntervals:            boolean;
    hotkeys:                      boolean;
    themeClassic:                 string;
    themeModern:                  string;
    commas:                       boolean;
    updateRate:                   number;
    newUI:                        boolean;
    offlineProgress:              boolean;
    automaticTabSwitching:        boolean;
    respecIntoProtected:          boolean;
    offlineTicks:                 number;
    showLastTenResourceGain:      boolean;
    autosaveInterval:             number;
    showTimeSinceSave:            boolean;
    saveFileName:                 string;
    exportedFileCount:            number;
    hideCompletedAchievementRows: boolean;
    glyphTextColors:              boolean;
    headerTextColored:            boolean;
    showNewGlyphIcon:             boolean;
    hideAlterationEffects:        boolean;
    ignoreGlyphEffects:           boolean;
    ignoreGlyphLevel:             boolean;
    ignoreGlyphRarity:            boolean;
    lightGlyphs:                  boolean;
    showHintText:                 ShowHintText;
    animations:                   Animations;
    confirmations:                { [key: string]: boolean };
    awayProgress:                 { [key: string]: boolean };
    hiddenTabBits:                number;
    hiddenSubtabBits:             number[];
    lastOpenTab:                  number;
    lastOpenSubtab:               number[];
    currentMultiplierSubtab:      number;
    fixedPerkStartingPos:         boolean;
    perkPhysicsEnabled:           boolean;
    automatorEvents:              AutomatorEvents;
    repeatBuffer:                 number;
    speed:                        number;
}

export interface Animations {
    bigCrunch:        boolean;
    eternity:         boolean;
    dilation:         boolean;
    tachyonParticles: boolean;
    reality:          boolean;
    background:       boolean;
    blobSnowflakes:   number;
}

export interface AutomatorEvents {
    newestFirst:    boolean;
    timestampType:  number;
    maxEntries:     number;
    clearOnReality: boolean;
    clearOnRestart: boolean;
}

export interface OptionsNews {
    enabled:         boolean;
    repeatBuffer:    number;
    AIChance:        number;
    speed:           number;
    includeAnimated: boolean;
}

export interface ShowHintText {
    showPercentage:          boolean;
    achievements:            boolean;
    achievementUnlockStates: boolean;
    challenges:              boolean;
    studies:                 boolean;
    glyphEffectDots:         boolean;
    realityUpgrades:         boolean;
    perks:                   boolean;
    alchemy:                 boolean;
    glyphInfoType:           number;
    showGlyphInfoByDefault:  boolean;
}

export interface AntimatterDimensionsStructReality {
    realityMachines:        RealityMachines;
    imaginaryMachines:      number;
    iMCap:                  number;
    glyphs:                 Glyphs;
    seed:                   number;
    secondGaussian:         number;
    musicSeed:              number;
    musicSecondGaussian:    number;
    rebuyables:             { [key: string]: number };
    upgradeBits:            number;
    upgReqs:                number;
    imaginaryUpgradeBits:   number;
    imaginaryUpgReqs:       number;
    imaginaryRebuyables:    { [key: string]: number };
    perks:                  number[];
    respec:                 boolean;
    showGlyphSacrifice:     boolean;
    showSidebarPanel:       number;
    autoSort:               number;
    autoCollapse:           boolean;
    autoAutoClean:          boolean;
    applyFilterToPurge:     boolean;
    moveGlyphsOnProtection: boolean;
    perkPoints:             number;
    autoEC:                 boolean;
    lastAutoEC:             number;
    partEternitied:         string;
    autoAchieve:            boolean;
    gainedAutoAchievements: boolean;
    automator:              Automator;
    achTimer:               number;
}

export interface Automator {
    state:           State;
    scripts:         { [key: string]: Script };
    constants:       Constants;
    execTimer:       number;
    type:            number;
    forceUnlock:     boolean;
    currentInfoPane: number;
}

export interface Constants {
    TSEarlyGame:     string;
    TSADActive:      string;
    TSTDActive:      string;
    TSFirstDil:      string;
    TSIDActive:      string;
    TSTDPassive:     string;
    TSTDIdle:        string;
    TSEC11:          string;
    TS2PathFull:     string;
    TS2PathFullIdle: string;
    TSFull:          string;
}

export interface Script {
    id:      number;
    name:    string;
    content: string;
}

export interface State {
    mode:            number;
    topLevelScript:  number;
    editorScript:    number;
    repeat:          boolean;
    forceRestart:    boolean;
    followExecution: boolean;
    stack:           any[];
}

export interface Glyphs {
    active:              any[];
    inventory:           Inventory[];
    sac:                 HighestRefinementValue;
    undo:                any[];
    sets:                Set[];
    protectedRows:       number;
    createdRealityGlyph: boolean;
    cosmetics:           Cosmetics;
}

export interface Cosmetics {
    active:           boolean;
    glowNotification: boolean;
    unlockedFromNG:   any[];
    symbolMap:        EternityChalls;
    colorMap:         EternityChalls;
}

export interface Inventory {
    id:        number;
    idx:       number;
    type:      Type;
    strength:  number;
    level:     number;
    rawLevel:  number;
    effects:   number;
    cosmetic?: string;
}

export interface Set {
    name:   string;
    glyphs: Inventory[];
}

export enum RealityMachines {
    The1335330436433 = "1335330436433",
    The1E1500 = "1e+1500",
}

export interface AntimatterDimensionsStructRecords {
    gameCreatedTime:      number;
    totalTimePlayed:      number;
    timePlayedAtBHUnlock: number;
    realTimePlayed:       number;
    realTimeDoomed:       number;
    fullGameCompletions:  number;
    totalAntimatter:      string;
    lastTenInfinities:    Array<Array<number | string>>;
    lastTenEternities:    Array<Array<number | string>>;
    lastTenRealities:     Array<Array<number | RealityMachines>>;
    thisInfinity:         ThisInfinity;
    bestInfinity:         BestInfinity;
    thisEternity:         ThisEternity;
    bestEternity:         BestEternity;
    thisReality:          ThisReality;
    bestReality:          BestReality;
}

export interface BestEternity {
    time:             number;
    realTime:         number;
    bestEPminReality: string;
}

export interface BestInfinity {
    time:              number;
    realTime:          number;
    bestIPminEternity: string;
    bestIPminReality:  string;
}

export interface BestReality {
    time:          number;
    realTime:      number;
    glyphStrength: number;
    RM:            RealityMachines;
    RMSet:         BestAmSet[];
    RMmin:         string;
    RMminSet:      BestAmSet[];
    glyphLevel:    number;
    glyphLevelSet: BestAmSet[];
    bestEP:        string;
    bestEPSet:     BestAmSet[];
    speedSet:      BestAmSet[];
    iMCapSet:      BestAmSet[];
    laitelaSet:    BestAmSet[];
}

export interface ThisEternity {
    time:                  number;
    realTime:              number;
    maxAM:                 string;
    maxIP:                 string;
    bestIPMsWithoutMaxAll: string;
    bestEPmin:             string;
    bestInfinitiesPerMs:   string;
}

export interface ThisInfinity {
    time:        number;
    realTime:    number;
    lastBuyTime: number;
    maxAM:       string;
    bestIPmin:   string;
}

export interface ThisReality {
    time:                number;
    realTime:            number;
    maxAM:               string;
    maxIP:               string;
    maxEP:               string;
    bestEternitiesPerMs: string;
    maxReplicanti:       string;
    maxDT:               string;
}

export interface Replicanti {
    unl:             boolean;
    amount:          string;
    timer:           number;
    chance:          number;
    chanceCost:      string;
    interval:        number;
    intervalCost:    string;
    boughtGalaxyCap: number;
    galaxies:        number;
    galCost:         string;
}

export interface RequirementChecks {
    infinity:  RequirementChecksInfinity;
    eternity:  RequirementChecksEternity;
    reality:   RequirementChecksReality;
    permanent: Permanent;
}

export interface RequirementChecksEternity {
    onlyAD1: boolean;
    onlyAD8: boolean;
    noAD1:   boolean;
    noRG:    boolean;
}

export interface RequirementChecksInfinity {
    maxAll:      boolean;
    noSacrifice: boolean;
    noAD8:       boolean;
}

export interface Permanent {
    emojiGalaxies:    number;
    singleTickspeed:  number;
    perkTreeDragging: number;
}

export interface RequirementChecksReality {
    noAM:          boolean;
    noTriads:      boolean;
    noPurchasedTT: boolean;
    noInfinities:  boolean;
    noEternities:  boolean;
    noContinuum:   boolean;
    maxID1:        string;
    maxStudies:    number;
    maxGlyphs:     number;
    slowestBH:     number;
}

export interface SecretUnlocks {
    themes:             string[];
    viewSecretTS:       boolean;
    cancerAchievements: boolean;
}

export interface ShownRuns {
    Reality:  boolean;
    Eternity: boolean;
    Infinity: boolean;
}

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
    achievementTimes:     EternityChalls;
}

export interface Timestudy {
    theorem:        string;
    maxTheorem:     string;
    amBought:       number;
    ipBought:       number;
    epBought:       number;
    studies:        any[];
    shopMinimized:  boolean;
    preferredPaths: Array<number[] | number>;
    presets:        Preset[];
}

export interface Preset {
    name:    string;
    studies: string;
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