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