import { AntimatterDimensionsStruct, RealityMachines } from '../Struct/AntimatterDimensionsStruct';

/**
 * Default empty save data structure that follows the AntimatterDimensionsStruct interface
 */
export const defaultSaveData: AntimatterDimensionsStruct = {
  antimatter: '0',
  infinities: '0',
  eternities: '0',
  realities: 0,
  infinityPoints: '0',
  eternityPoints: '0',
  dimensionBoosts: 0,
  galaxies: 0,
  buyUntil10: false,
  sacrificed: '0',
  achievementBits: [],
  secretAchievementBits: [],
  infinityUpgrades: [],
  infinityRebuyables: [],
  infinitiesBanked: '0',
  chall2Pow: 1,
  IPMultPurchases: 0,
  version: 1,
  eternityUpgrades: [],
  dimensions: {
    antimatter: Array(8).fill(null).map(() => ({ amount: '0', bought: 0, costBumps: 0 })),
    infinity: Array(8).fill(null).map(() => ({ isUnlocked: false, bought: 0, amount: '0', cost: '0', baseAmount: 0 })),
    time: Array(8).fill(null).map(() => ({ amount: '0', bought: 0, cost: '0' }))
  },
  eternityDimensions: Array(8).fill(null).map(() => ({ amount: '0', bought: 0, baseAmount: 0, isUnlocked: false })),
  realityDimensions: Array(4).fill(null).map(() => ({ amount: '0', bought: 0, isUnlocked: false })),
  challenge: {
    normal: { current: 0, bestTimes: [], completedBits: 0 },
    infinity: { current: 0, bestTimes: [], completedBits: 0 },
    eternity: { current: 0, unlocked: 0, requirementBits: 0 }
  },
  infinity: {
    upgradeBits: 0
  },
  auto: {
    autobuyersOn: true,
    disableContinuum: false,
    reality: {
      isActive: false,
      mode: 0,
      rm: '0',
      glyph: 0
    },
    eternity: {
      isActive: false,
      mode: 0,
      amount: '0',
      increaseWithMult: false,
      time: 0,
      xHighest: '0'
    },
    bigCrunch: {
      isActive: false,
      cost: 0,
      interval: 0,
      mode: 0,
      amount: '0',
      increaseWithMult: false,
      time: 0,
      xHighest: '0',
      lastTick: 0
    },
    galaxy: {
      isActive: false,
      cost: 0,
      interval: 0,
      limitGalaxies: false,
      maxGalaxies: 0,
      buyMax: false,
      buyMaxInterval: 0,
      lastTick: 0
    },
    dimBoost: {
      isActive: false,
      cost: 0,
      interval: 0,
      limitDimBoosts: false,
      maxDimBoosts: 0,
      limitUntilGalaxies: false,
      galaxies: 0,
      buyMaxInterval: 0,
      lastTick: 0
    },
    tickspeed: {
      isActive: false,
      cost: 0,
      interval: 0,
      mode: 0,
      lastTick: 0,
      isBought: false,
      isUnlocked: false,
      bulk: 0
    },
    sacrifice: {
      isActive: false,
      multiplier: '0'
    },
    antimatterDims: {
      isActive: false,
      all: []
    },
    infinityDims: {
      isActive: false,
      all: []
    },
    timeDims: {
      isActive: false,
      all: []
    },
    replicantiGalaxies: {
      isActive: false
    },
    replicantiUpgrades: {
      isActive: false,
      all: []
    },
    timeTheorems: {
      isActive: false
    },
    dilationUpgrades: {
      isActive: false,
      all: []
    },
    blackHolePower: {
      isActive: false,
      all: []
    },
    realityUpgrades: {
      isActive: false,
      all: []
    },
    imaginaryUpgrades: {
      isActive: false,
      all: []
    },
    darkMatterDims: {
      isActive: false,
      lastTick: 0
    },
    ascension: {
      isActive: false,
      lastTick: 0
    },
    annihilation: {
      isActive: false,
      multiplier: 0
    },
    singularity: {
      isActive: false
    },
    ipMultBuyer: {
      isActive: false
    },
    epMultBuyer: {
      isActive: false
    }
  },
  replicanti: {
    unl: false,
    amount: '0',
    timer: 0,
    chance: 0.01,
    chanceCost: '1e+150',
    interval: 1000,
    intervalCost: '1e+140',
    galaxies: 0,
    boughtGalaxyCap: 0,
    galCost: '1e+170'
  },
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: '0',
    dilatedTime: '0',
    nextThreshold: '1000',
    baseTachyonGalaxies: 0,
    totalTachyonGalaxies: 0,
    upgrades: [],
    rebuyables: {
      '1': 0, '2': 0, '3': 0, '4': 0
    },
    lastEP: '0'
  },
  timestudy: {
    theorem: '0',
    maxTheorem: '0',
    amBought: 0,
    ipBought: 0,
    epBought: 0,
    studies: [],
    shopMinimized: false,
    preferredPaths: [],
    presets: []
  },
  eternityChalls: {},
  respec: false,
  eterc8ids: 0,
  eterc8repl: 0,
  reality: {
    realityMachines: RealityMachines.The1335330436433,
    imaginaryMachines: 0,
    iMCap: 0,
    glyphs: {
      active: [],
      inventory: [],
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0,
        reality: 0
      },
      undo: [],
      sets: [],
      protectedRows: 0,
      createdRealityGlyph: false,
      cosmetics: {
        active: false,
        glowNotification: false,
        unlockedFromNG: [],
        symbolMap: {},
        colorMap: {}
      }
    },
    seed: 0,
    secondGaussian: 0,
    musicSeed: 0,
    musicSecondGaussian: 0,
    rebuyables: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    upgradeBits: 0,
    upgReqs: 0,
    imaginaryUpgradeBits: 0,
    imaginaryUpgReqs: 0,
    imaginaryRebuyables: {},
    perks: [],
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: 0,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: false,
    applyFilterToPurge: false,
    moveGlyphsOnProtection: false,
    perkPoints: 0,
    autoEC: false,
    lastAutoEC: 0,
    partEternitied: '0',
    autoAchieve: false,
    gainedAutoAchievements: false,
    achTimer: 0,
    automator: {
      state: {
        mode: 0,
        topLevelScript: 0,
        editorScript: 0,
        repeat: false,
        forceRestart: false,
        followExecution: false,
        stack: []
      },
      scripts: {},
      constants: {
        TSEarlyGame: '0',
        TSADActive: '0',
        TSTDActive: '0',
        TSFirstDil: '0',
        TSIDActive: '0',
        TSTDPassive: '0',
        TSTDIdle: '0',
        TSEC11: '0',
        TS2PathFull: '0',
        TS2PathFullIdle: '0',
        TSFull: '0'
      },
      execTimer: 0,
      type: 0,
      forceUnlock: false,
      currentInfoPane: 0
    }
  },
  blackHole: [{
    id: 0,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0
  }],
  blackHolePause: false,
  blackHoleAutoPauseMode: 0,
  blackHolePauseTime: 0,
  blackHoleNegative: 0,
  celestials: {
    teresa: {
      pouredAmount: 0,
      quoteBits: 0,
      unlockBits: 0,
      run: false,
      bestRunAM: '0',
      bestAMSet: [],
      perkShop: [],
      lastRepeatedMachines: '0'
    },
    effarig: {
      relicShards: 0,
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      glyphWeights: {
        ep: 0,
        repl: 0,
        dt: 0,
        eternities: 0
      },
      autoAdjustGlyphWeights: false,
      glyphScoreSettings: {
        mode: 0,
        simpleEffectCount: 0,
        types: {
          power: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              powerpow: false,
              powermult: false,
              powerdimboost: false,
              powerbuy10: false
            },
            effectScores: {
              powerpow: 0,
              powermult: 0,
              powerdimboost: 0,
              powerbuy10: 0
            }
          },
          infinity: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              infinitypow: false,
              infinityrate: false,
              infinityIP: false,
              infinityinfmult: false
            },
            effectScores: {
              infinitypow: 0,
              infinityrate: 0,
              infinityIP: 0,
              infinityinfmult: 0
            }
          },
          replication: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              replicationspeed: false,
              replicationpow: false,
              replicationdtgain: false,
              replicationglyphlevel: false
            },
            effectScores: {
              replicationspeed: 0,
              replicationpow: 0,
              replicationdtgain: 0,
              replicationglyphlevel: 0
            }
          },
          time: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              timepow: false,
              timespeed: false,
              timeetermult: false,
              timeEP: false
            },
            effectScores: {
              timepow: 0,
              timespeed: 0,
              timeetermult: 0,
              timeEP: 0
            }
          },
          dilation: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              dilationDT: false,
              dilationgalaxyThreshold: false,
              dilationTTgen: false,
              dilationpow: false
            },
            effectScores: {
              dilationDT: 0,
              dilationgalaxyThreshold: 0,
              dilationTTgen: 0,
              dilationpow: 0
            }
          },
          effarig: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              effarigblackhole: false,
              effarigrm: false,
              effarigglyph: false,
              effarigachievement: false,
              effarigforgotten: false,
              effarigdimensions: false,
              effarigantimatter: false
            },
            effectScores: {
              effarigblackhole: 0,
              effarigrm: 0,
              effarigglyph: 0,
              effarigachievement: 0,
              effarigforgotten: 0,
              effarigdimensions: 0,
              effarigantimatter: 0
            }
          },
          reality: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              realityglyphlevel: false,
              realitygalaxies: false,
              realityrow1pow: false,
              realityDTglyph: false
            },
            effectScores: {
              realityglyphlevel: 0,
              realitygalaxies: 0,
              realityrow1pow: 0,
              realityDTglyph: 0
            }
          },
          cursed: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              cursedgalaxies: false,
              curseddimensions: false,
              cursedtickspeed: false,
              cursedEP: false
            },
            effectScores: {
              cursedgalaxies: 0,
              curseddimensions: 0,
              cursedtickspeed: 0,
              cursedEP: 0
            }
          },
          companion: {
            rarityThreshold: 0,
            scoreThreshold: 0,
            effectCount: 0,
            effectChoices: {
              companiondescription: false,
              companionEP: false
            },
            effectScores: {
              companiondescription: 0,
              companionEP: 0
            }
          }
        }
      },
      glyphTrashMode: 0
    },
    enslaved: {
      isStoring: false,
      stored: 0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      isAutoReleasing: false,
      quoteBits: 0,
      unlocks: [],
      run: false,
      completed: false,
      tesseracts: 0,
      hasSecretStudy: false,
      feltEternity: false,
      progressBits: 0,
      hintBits: 0,
      hintUnlockProgress: 0,
      glyphHintsGiven: 0,
      zeroHintTime: 0,
      storedFraction: 0
    },
    v: {
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      runUnlocks: [],
      goalReductionSteps: [],
      STSpent: 0,
      runGlyphs: [],
      runRecords: [],
      wantsFlipped: false
    },
    ra: {
      pets: {
        teresa: {
          level: 0,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        effarig: {
          level: 0,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        enslaved: {
          level: 0,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        v: {
          level: 0,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        }
      },
      alchemy: [],
      highestRefinementValue: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0,
        reality: 0
      },
      quoteBits: 0,
      momentumTime: 0,
      unlockBits: 0,
      run: false,
      charged: [],
      disCharge: false,
      peakGamespeed: 0,
      petWithRemembrance: ''
    },
    laitela: {
      darkMatter: '0',
      maxDarkMatter: '0',
      run: false,
      quoteBits: 0,
      dimensions: [],
      entropy: 0,
      thisCompletion: 0,
      fastestCompletion: 0,
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: 0,
      darkEnergy: 0,
      singularitySorting: {
        displayResource: 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0
      },
      singularities: 0,
      singularityCapIncreases: 0,
      lastCheckedMilestones: 0
    },
    pelle: {
      doomed: false,
      upgrades: [],
      remnants: 0,
      realityShards: '0',
      records: {
        totalAntimatter: '0',
        totalInfinityPoints: '0',
        totalEternityPoints: '0'
      },
      rebuyables: {
        antimatterDimensionMult: 0,
        timeSpeedMult: 0,
        glyphLevels: 0,
        infConversion: 0,
        galaxyPower: 0,
        galaxyGeneratorAdditive: 0,
        galaxyGeneratorMultiplicative: 0,
        galaxyGeneratorAntimatterMult: 0,
        galaxyGeneratorIPMult: 0,
        galaxyGeneratorEPMult: 0
      },
      rifts: {
        vacuum: {
          fill: '0',
          active: false,
          reducedTo: 0
        },
        decay: {
          fill: '0',
          active: false,
          reducedTo: 0
        },
        chaos: {
          fill: 0,
          active: false,
          reducedTo: 0
        },
        recursion: {
          fill: '0',
          active: false,
          reducedTo: 0
        },
        paradox: {
          fill: '0',
          active: false,
          reducedTo: 0
        }
      },
      progressBits: 0,
      galaxyGenerator: {
        unlocked: false,
        spentGalaxies: 0,
        generatedGalaxies: 0,
        phase: 0,
        sacrificeActive: false
      },
      quoteBits: 0,
      collapsed: {
        upgrades: false,
        rifts: false,
        galaxies: false
      },
      showBought: false
    }
  },
  isGameEnd: false,
  tabNotifications: [],
  triggeredTabNotificationBits: 0,
  tutorialState: 0,
  tutorialActive: false,
  options: {
    news: {
      enabled: true,
      repeatBuffer: 0,
      AIChance: 0,
      speed: 0,
      includeAnimated: true
    },
    notation: 'Scientific',
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    cloudEnabled: false,
    hideGoogleName: false,
    showCloudModal: false,
    forceCloudOverwrite: false,
    syncSaveIntervals: false,
    hotkeys: true,
    themeClassic: 'Normal',
    themeModern: 'Normal',
    commas: true,
    updateRate: 50,
    newUI: true,
    offlineProgress: true,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 0,
    showLastTenResourceGain: true,
    autosaveInterval: 30,
    showTimeSinceSave: true,
    saveFileName: '',
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: true,
    showNewGlyphIcon: true,
    hideAlterationEffects: false,
    ignoreGlyphEffects: false,
    ignoreGlyphLevel: false,
    ignoreGlyphRarity: false,
    lightGlyphs: false,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      perks: true,
      alchemy: true,
      glyphInfoType: 0,
      showGlyphInfoByDefault: true
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
      tachyonParticles: true,
      reality: true,
      background: true,
      blobSnowflakes: 0
    },
    confirmations: {
      sacrifice: true,
      challenges: true,
      eternity: true,
      reality: true,
      dilation: true
    },
    awayProgress: {},
    hiddenTabBits: 0,
    hiddenSubtabBits: [],
    lastOpenTab: 0,
    lastOpenSubtab: [],
    currentMultiplierSubtab: 0,
    fixedPerkStartingPos: false,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 0,
      clearOnReality: false,
      clearOnRestart: false
    },
    repeatBuffer: 0,
    speed: 0
  },
  IAP: {
    enabled: false,
    checkoutSession: {
      id: false
    }
  },
  news: {
    seen: {
      a: [],
      p: [],
      l: []
    },
    specialTickerData: {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 0,
      eiffelTowerChapter: 0
    },
    totalSeen: 0
  },
  secretUnlocks: {
    themes: [],
    viewSecretTS: false,
    cancerAchievements: false
  },
  shownRuns: {
    Reality: false,
    Eternity: false,
    Infinity: false
  },
  requirementChecks: {
    infinity: {
      maxAll: false,
      noSacrifice: false,
      noAD8: false
    },
    eternity: {
      onlyAD1: false,
      onlyAD8: false,
      noAD1: false,
      noRG: false
    },
    reality: {
      noAM: false,
      noTriads: false,
      noPurchasedTT: false,
      noInfinities: false,
      noEternities: false,
      noContinuum: false,
      maxID1: '0',
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: 0
    },
    permanent: {
      emojiGalaxies: 0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: 0,
    totalTimePlayed: 0,
    timePlayedAtBHUnlock: 0,
    realTimePlayed: 0,
    realTimeDoomed: 0,
    fullGameCompletions: 0,
    totalAntimatter: '0',
    lastTenInfinities: [],
    lastTenEternities: [],
    lastTenRealities: [],
    thisInfinity: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxAM: '0',
      bestIPmin: '0'
    },
    bestInfinity: {
      time: 0,
      realTime: 0,
      bestIPminEternity: '0',
      bestIPminReality: '0'
    },
    thisEternity: {
      time: 0,
      realTime: 0,
      maxAM: '0',
      maxIP: '0',
      bestIPMsWithoutMaxAll: '0',
      bestEPmin: '0',
      bestInfinitiesPerMs: '0'
    },
    bestEternity: {
      time: 0,
      realTime: 0,
      bestEPminReality: '0'
    },
    thisReality: {
      time: 0,
      realTime: 0,
      maxAM: '0',
      maxIP: '0',
      maxEP: '0',
      bestEternitiesPerMs: '0',
      maxReplicanti: '0',
      maxDT: '0'
    },
    bestReality: {
      time: 0,
      realTime: 0,
      glyphStrength: 0,
      RM: RealityMachines.The1335330436433,
      RMSet: [],
      RMmin: '0',
      RMminSet: [],
      glyphLevel: 0,
      glyphLevelSet: [],
      bestEP: '0',
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: []
    }
  },
  speedrun: {
    isUnlocked: false,
    isActive: false,
    isSegmented: false,
    usedSTD: false,
    hasStarted: false,
    hideInfo: false,
    displayAllMilestones: false,
    startDate: 0,
    name: '',
    offlineTimeUsed: 0,
    records: {},
    milestones: [],
    achievementTimes: {}
  },
  lastUpdate: Date.now(),
  matter: '0',
  chall3Pow: '0.01',
  chall9TickspeedCostBumps: 0,
  chall8TotalSacrifice: '0',
  ic2Count: 0,
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  epmultUpgrades: 0,
  partSimulatedReality: 0,
  totalTickGained: 0,
  totalTickBought: 0,
  infinityPower: '1',
  postC4Tier: 0,
  timeShards: '0'
}; 