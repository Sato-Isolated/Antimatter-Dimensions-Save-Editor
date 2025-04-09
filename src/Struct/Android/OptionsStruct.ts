export interface Options {
    animations:                   Animations;
    autoRealityForFilter:         boolean;
    autobuyersOn:                 boolean;
    automaticTabSwitching:        boolean;
    automatorEvents:              AutomatorEvents;
    autosaveInterval:             number;
    awayProgress:                 { [key: string]: boolean };
    cloudEnabled:                 boolean;
    commas:                       boolean;
    confirmations:                { [key: string]: boolean };
    exportedFileCount:            number;
    forceCloudOverwrite:          boolean;
    glyphBG:                      number;
    glyphBorders:                 boolean;
    glyphTextColors:              boolean;
    headerTextColored:            boolean;
    hibernationCatchup:           boolean;
    hiddenSubtabBits:             number[];
    hiddenTabBits:                number;
    hideAlterationEffects:        boolean;
    hideCompletedAchievementRows: boolean;
    hideGoogleName:               boolean;
    highContrastRarity:           boolean;
    hotkeys:                      boolean;
    icons:                        number;
    ignoreGlyphEffects:           boolean;
    ignoreGlyphLevel:             boolean;
    ignoreGlyphRarity:            boolean;
    invertTTgenDisplay:           boolean;
    lastOpenSubtab:               number[];
    lastOpenTab:                  number;
    loadBackupWithoutOffline:     boolean;
    multiplierTab:                MultiplierTab;
    newUI:                        boolean;
    news:                         OptionsNews;
    notation:                     string;
    notationDigits:               NotationDigits;
    offlineProgress:              string;
    offlineTicks:                 number;
    perkLayout:                   number;
    perkPhysicsEnabled:           boolean;
    respecIntoProtected:          boolean;
    retryCelestial:               boolean;
    retryChallenge:               boolean;
    saveFileName:                 string;
    showAllChallenges:            boolean;
    showCloudModal:               boolean;
    showHintText:                 ShowHintText;
    showLastTenRunsPrestigeCount: boolean;
    showNewGlyphIcon:             boolean;
    showTimeSinceSave:            boolean;
    showUnequippedGlyphIcon:      boolean;
    statTabResources:             number;
    swapGlyphColors:              boolean;
    syncSaveIntervals:            boolean;
    themeClassic:                 string;
    themeModern:                  string;
    updateRate:                   number;
}

export interface Animations {
    alchemy:          boolean;
    background:       boolean;
    bigCrunch:        boolean;
    blobSnowflakes:   number;
    dilation:         boolean;
    eternity:         boolean;
    reality:          boolean;
    tachyonParticles: boolean;
}

export interface AutomatorEvents {
    clearOnReality: boolean;
    clearOnRestart: boolean;
    maxEntries:     number;
    newestFirst:    boolean;
    timestampType:  number;
}

export interface MultiplierTab {
    currTab:       number;
    replacePowers: boolean;
    showAltGroup:  boolean;
}

export interface OptionsNews {
    AIChance:        number;
    enabled:         boolean;
    includeAnimated: boolean;
    repeatBuffer:    number;
    speed:           number;
}

export interface NotationDigits {
    comma:    number;
    notation: number;
}

export interface ShowHintText {
    achievementUnlockStates: boolean;
    achievements:            boolean;
    alchemy:                 boolean;
    challenges:              boolean;
    glyphEffectDots:         boolean;
    glyphInfoType:           number;
    perks:                   boolean;
    realityUpgrades:         boolean;
    showGlyphInfoByDefault:  boolean;
    showPercentage:          boolean;
    studies:                 boolean;
} 