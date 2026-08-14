/**
 * Human-readable progression data copied from the pinned upstream game
 * snapshot. The save contains IDs and counters; this catalog gives those
 * values their game meaning without importing the game runtime into the UI.
 */
export const PROGRESSION_UPSTREAM_SNAPSHOT = '5409e320cecef96a917cca1dfb68f1f183e499ca';

export type InfinityUpgradeStorage = 'collection' | 'rebuyable';

export interface InfinityUpgradeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly storage: InfinityUpgradeStorage;
}

/**
 * Infinity and Break Infinity IDs share the PC/Web infinityUpgrades Set.
 * The separate rebuyable counters are listed below because they are not Set entries.
 */
export const infinityUpgradeDefinitions: readonly InfinityUpgradeDefinition[] = [
  { id: 'timeMult', name: 'Time played multiplier', description: 'Antimatter Dimensions gain a multiplier based on total time played.', storage: 'collection' },
  { id: '18Mult', name: 'AD1/AD8 Infinity multiplier', description: '1st and 8th Antimatter Dimensions gain a multiplier based on total Infinities.', storage: 'collection' },
  { id: '27Mult', name: 'AD2/AD7 Infinity multiplier', description: '2nd and 7th Antimatter Dimensions gain a multiplier based on total Infinities.', storage: 'collection' },
  { id: '36Mult', name: 'AD3/AD6 Infinity multiplier', description: '3rd and 6th Antimatter Dimensions gain a multiplier based on total Infinities.', storage: 'collection' },
  { id: '45Mult', name: 'AD4/AD5 Infinity multiplier', description: '4th and 5th Antimatter Dimensions gain a multiplier based on total Infinities.', storage: 'collection' },
  { id: 'resetBoost', name: 'Dimension Boost/Galaxy requirement reduction', description: 'Reduces the number of Dimensions required for Dimension Boosts and Antimatter Galaxies by 9.', storage: 'collection' },
  { id: 'dimMult', name: 'Buy-10 Antimatter Dimension multiplier', description: 'Increases the multiplier applied when buying 10 Antimatter Dimensions.', storage: 'collection' },
  { id: 'galaxyBoost', name: 'Galaxy strength', description: 'All Galaxies are twice as strong.', storage: 'collection' },
  { id: 'timeMult2', name: 'Current Infinity time multiplier', description: 'Antimatter Dimensions gain a multiplier based on time spent in the current Infinity.', storage: 'collection' },
  { id: 'unspentBonus', name: 'Unspent Infinity Points → AD1', description: 'Multiplies the 1st Antimatter Dimension based on unspent Infinity Points.', storage: 'collection' },
  { id: 'resetMult', name: 'Dimension Boost multiplier', description: 'Increases the Dimension Boost multiplier.', storage: 'collection' },
  { id: 'passiveGen', name: 'Passive Infinity Point generation', description: 'Passively generates Infinity Points based on the fastest Infinity.', storage: 'collection' },
  { id: 'skipReset1', name: 'Start with 1 Boost and unlock AD5', description: 'Starts every reset with 1 Dimension Boost and automatically unlocks the 5th Antimatter Dimension.', storage: 'collection' },
  { id: 'skipReset2', name: 'Start with 2 Boosts and unlock AD6', description: 'Starts every reset with 2 Dimension Boosts and automatically unlocks the 6th Antimatter Dimension.', storage: 'collection' },
  { id: 'skipReset3', name: 'Start with 3 Boosts and unlock AD7', description: 'Starts every reset with 3 Dimension Boosts and automatically unlocks the 7th Antimatter Dimension.', storage: 'collection' },
  { id: 'skipResetGalaxy', name: 'Start with 4 Boosts, AD8 and a Galaxy', description: 'Starts every reset with 4 Dimension Boosts, unlocks the 8th Antimatter Dimension, and grants an Antimatter Galaxy.', storage: 'collection' },
  { id: 'ipOffline', name: 'Offline Infinity Point generation', description: 'While offline, generates 50% of the best Infinity Points per minute without using Max All.', storage: 'collection' },
  { id: 'ipMult', name: 'Infinity Point multiplier', description: 'Each IP multiplier purchase multiplies Infinity Points from all sources by 2; the purchase count is stored separately.', storage: 'collection' },
  { id: 'totalMult', name: 'Total antimatter multiplier', description: 'Antimatter Dimensions gain a multiplier based on total antimatter produced.', storage: 'collection' },
  { id: 'currentMult', name: 'Current antimatter multiplier', description: 'Antimatter Dimensions gain a multiplier based on current antimatter.', storage: 'collection' },
  { id: 'postGalaxy', name: 'Post-Break Galaxy strength', description: 'All Galaxies are 50% stronger after Break Infinity.', storage: 'collection' },
  { id: 'infinitiedMult', name: 'Infinity count multiplier', description: 'Antimatter Dimensions gain a multiplier based on total Infinities.', storage: 'collection' },
  { id: 'challengeMult', name: 'Slowest challenge multiplier', description: 'Antimatter Dimensions gain a multiplier based on the fastest completion time among the slowest challenge records.', storage: 'collection' },
  { id: 'infinitiedGeneration', name: 'Passive Infinity generation', description: 'Passively generates Infinities based on the fastest Infinity.', storage: 'collection' },
  { id: 'achievementMult', name: 'Achievement multiplier', description: 'Antimatter Dimensions gain a multiplier based on completed Achievements.', storage: 'collection' },
  { id: 'autobuyMaxDimboosts', name: 'Buy-max Dimension Boost autobuyer', description: 'Unlocks the buy-max mode for the Dimension Boost autobuyer.', storage: 'collection' },
  { id: 'autoBuyerUpgrade', name: 'Challenge autobuyer speed', description: 'Autobuyers unlocked or improved by Normal Challenges work twice as fast.', storage: 'collection' },
];

export const infinityCollectionUpgradeDefinitions = infinityUpgradeDefinitions.filter(
  (definition) => definition.storage === 'collection',
);

export interface InfinityRebuyableUpgradeDefinition {
  readonly index: number;
  readonly name: string;
  readonly description: string;
  readonly maximum: number;
}

export const infinityRebuyableUpgradeDefinitions: readonly InfinityRebuyableUpgradeDefinition[] = [
  {
    index: 0,
    name: 'Tickspeed cost scaling reduction',
    description: 'Reduces post-Infinity Tickspeed upgrade cost multiplier scaling.',
    maximum: 8,
  },
  {
    index: 1,
    name: 'Antimatter Dimension cost scaling reduction',
    description: 'Reduces post-Infinity Antimatter Dimension cost multiplier scaling.',
    maximum: 7,
  },
  {
    index: 2,
    name: 'Passive Infinity Point generation',
    description: 'Generates a percentage of the best Infinity Points per minute from the last 10 Infinities.',
    maximum: 10,
  },
];

export type DilationUpgradeStorage = 'rebuyable' | 'collection' | 'android-bitfield';

export interface DilationUpgradeDefinition {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly storage: DilationUpgradeStorage;
  readonly androidRebuyableIndex?: number;
}

export const dilationUpgradeDefinitions: readonly DilationUpgradeDefinition[] = [
  {
    id: 1,
    name: 'Dilated Time gain',
    description: 'Rebuyable: each purchase doubles Dilated Time gain.',
    storage: 'rebuyable',
    androidRebuyableIndex: 0,
  },
  {
    id: 2,
    name: 'Tachyon Galaxy threshold',
    description: 'Rebuyable: resets Dilated Time and Tachyon Galaxies, while lowering the Tachyon Galaxy threshold.',
    storage: 'rebuyable',
    androidRebuyableIndex: 1,
  },
  {
    id: 3,
    name: 'Tachyon Particle gain',
    description: 'Rebuyable: triples the amount of Tachyon Particles gained per purchase.',
    storage: 'rebuyable',
    androidRebuyableIndex: 2,
  },
  {
    id: 4,
    name: 'Double Tachyon Galaxies',
    description: 'Gain twice as many Tachyon Galaxies, up to 500 base Galaxies.',
    storage: 'collection',
  },
  {
    id: 5,
    name: 'Replicanti-powered Time Dimensions',
    description: 'Time Dimensions are affected by the Replicanti multiplier, with a reduced effect above 1e9000 Replicanti.',
    storage: 'collection',
  },
  {
    id: 6,
    name: 'Dilated Time-powered Antimatter Dimensions',
    description: 'Antimatter Dimensions gain a multiplier based on Dilated Time; this effect is unaffected by Time Dilation.',
    storage: 'collection',
  },
  {
    id: 7,
    name: 'Dilated Time-powered Infinity Points',
    description: 'Gain an Infinity Point multiplier based on Dilated Time.',
    storage: 'collection',
  },
  {
    id: 8,
    name: 'Time Study Split',
    description: 'The Dimension Split lets you buy all three Time Study paths.',
    storage: 'collection',
  },
  {
    id: 9,
    name: 'Dilation penalty reduction',
    description: 'Reduces the Dilation penalty; the upstream reduced exponent is 1.05.',
    storage: 'collection',
  },
  {
    id: 10,
    name: 'Time Theorem generator',
    description: 'Generates Time Theorems from Tachyon Particles.',
    storage: 'collection',
  },
  {
    id: 11,
    name: 'Pelle: Dilated Time gain',
    description: 'Pelle-only rebuyable: multiplies Dilated Time gain by 5 per purchase.',
    storage: 'rebuyable',
    androidRebuyableIndex: 3,
  },
  {
    id: 12,
    name: 'Pelle: Tachyon Galaxy multiplier',
    description: 'Pelle-only rebuyable: multiplies Tachyon Galaxies gained after the doubling upgrade.',
    storage: 'rebuyable',
    androidRebuyableIndex: 4,
  },
  {
    id: 13,
    name: 'Pelle: Tickspeed power',
    description: 'Pelle-only rebuyable: adds power to Tickspeed.',
    storage: 'rebuyable',
    androidRebuyableIndex: 5,
  },
  {
    id: 14,
    name: 'Pelle: Tachyon Galaxy threshold',
    description: 'Pelle-only: applies a cube root to the Tachyon Galaxy threshold.',
    storage: 'collection',
  },
  {
    id: 15,
    name: 'Pelle: flat Dilation multiplier',
    description: 'Pelle-only: grants more Dilated Time based on current Eternity Points.',
    storage: 'collection',
  },
];

export const dilationUpgradeById = new Map(
  dilationUpgradeDefinitions.map((definition) => [definition.id, definition]),
);

export const dilationCollectionUpgradeDefinitions = dilationUpgradeDefinitions.filter(
  (definition) => definition.storage === 'collection',
);

export const dilationRebuyableUpgradeDefinitions = dilationUpgradeDefinitions.filter(
  (definition) => definition.storage === 'rebuyable',
);

export interface EternityUpgradeDefinition {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export const eternityUpgradeDefinitions: readonly EternityUpgradeDefinition[] = [
  { id: 1, name: 'Infinity Dimension multiplier from EP', description: 'Infinity Dimensions are multiplied based on unspent Eternity Points.' },
  { id: 2, name: 'Infinity Dimension multiplier from Eternities', description: 'Infinity Dimensions are multiplied based on Eternities, with a softcap at 100,000 Eternities.' },
  { id: 3, name: 'Infinity Dimension multiplier from IC records', description: 'Infinity Dimensions are multiplied based on the sum of Infinity Challenge times.' },
  { id: 4, name: 'Achievement bonus to Time Dimensions', description: 'Your Achievement bonus also affects Time Dimensions.' },
  { id: 5, name: 'Time Dimension multiplier from Time Theorems', description: 'Time Dimensions are multiplied by unspent Time Theorems.' },
  { id: 6, name: 'Time Dimension multiplier from play time', description: 'Time Dimensions are multiplied by days played.' },
];

export const eternityUpgradeById = new Map(
  eternityUpgradeDefinitions.map((definition) => [definition.id, definition]),
);

export interface EternityMilestoneDefinition {
  readonly eternities: number;
  readonly name: string;
  readonly reward: string;
}

export const eternityMilestoneDefinitions: readonly EternityMilestoneDefinition[] = [
  { eternities: 1, name: 'Infinity Point multiplier autobuyer', reward: 'Unlock the Infinity Point multiplier autobuyer.' },
  { eternities: 2, name: 'Keep early Infinity progress', reward: 'Start Eternity with Normal Challenges complete, normal autobuyers, and Infinity broken.' },
  { eternities: 3, name: 'Replicanti Galaxy autobuyer', reward: 'Unlock the Replicanti Galaxy autobuyer.' },
  { eternities: 4, name: 'Keep Infinity upgrades', reward: 'Start Eternity with all Infinity Upgrades.' },
  { eternities: 5, name: 'Big Crunch modes', reward: 'Unlock more Big Crunch autobuyer options.' },
  { eternities: 6, name: 'Offline Eternity Points', reward: 'While offline, generate 25% of your best Eternity Points per minute from previous Eternities.' },
  { eternities: 7, name: 'Automatic Infinity Challenges', reward: 'Complete Infinity Challenges as soon as they unlock and keep the Dimensional Sacrifice autobuyer.' },
  { eternities: 8, name: 'Keep Break Infinity upgrades', reward: 'Start Eternity with all Break Infinity upgrades.' },
  { eternities: 9, name: 'Buy max Antimatter Galaxies', reward: 'Unlock the buy-max Antimatter Galaxies autobuyer mode.' },
  { eternities: 10, name: 'Replicanti unlock', reward: 'Start with Replicanti unlocked.' },
  { eternities: 11, name: 'Infinity Dimension 1 autobuyer', reward: 'Unlock the 1st Infinity Dimension autobuyer.' },
  { eternities: 12, name: 'Infinity Dimension 2 autobuyer', reward: 'Unlock the 2nd Infinity Dimension autobuyer.' },
  { eternities: 13, name: 'Infinity Dimension 3 autobuyer', reward: 'Unlock the 3rd Infinity Dimension autobuyer.' },
  { eternities: 14, name: 'Infinity Dimension 4 autobuyer', reward: 'Unlock the 4th Infinity Dimension autobuyer.' },
  { eternities: 15, name: 'Infinity Dimension 5 autobuyer', reward: 'Unlock the 5th Infinity Dimension autobuyer.' },
  { eternities: 16, name: 'Infinity Dimension 6 autobuyer', reward: 'Unlock the 6th Infinity Dimension autobuyer.' },
  { eternities: 17, name: 'Infinity Dimension 7 autobuyer', reward: 'Unlock the 7th Infinity Dimension autobuyer.' },
  { eternities: 18, name: 'Infinity Dimension 8 autobuyer', reward: 'Unlock the 8th Infinity Dimension autobuyer.' },
  { eternities: 25, name: 'Automatic Infinity Dimension unlocks', reward: 'Automatically unlock Infinity Dimensions when their requirement is reached.' },
  { eternities: 30, name: 'All Antimatter Dimensions', reward: 'Start with all Antimatter Dimensions available for purchase.' },
  { eternities: 40, name: 'Replicanti Galaxy persistence', reward: 'Replicanti Galaxies no longer reset Antimatter, Antimatter Dimensions, Tickspeed, Sacrifice, or Dimension Boosts.' },
  { eternities: 50, name: 'Replicanti Chance autobuyer', reward: 'Unlock the Replicanti Chance upgrade autobuyer.' },
  { eternities: 60, name: 'Replicanti Interval autobuyer', reward: 'Unlock the Replicanti Interval upgrade autobuyer.' },
  { eternities: 80, name: 'Max Replicanti Galaxies autobuyer', reward: 'Unlock the Max Replicanti Galaxies upgrade autobuyer.' },
  { eternities: 100, name: 'Eternity autobuyer', reward: 'Unlock the Eternity autobuyer.' },
  { eternities: 200, name: 'Offline Eternities', reward: 'While offline, gain Eternities at 50% of the rate of your fastest Eternity.' },
  { eternities: 1000, name: 'Offline Infinities', reward: 'While offline, gain Infinities equal to 50% of your best Infinities per hour this Eternity.' },
];

export interface EternityChallengeDefinition {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly goal: string;
  readonly reward: string;
  readonly restriction?: string;
}

export const eternityChallengeDefinitions: readonly EternityChallengeDefinition[] = [
  { id: 1, name: 'EC1 — Time Dimensions disabled', description: 'Time Dimensions are disabled.', goal: '1e1800', reward: 'Time Dimension multiplier based on time spent this Eternity.' },
  { id: 2, name: 'EC2 — Infinity Dimensions disabled', description: 'Infinity Dimensions are disabled.', goal: '1e975', reward: '1st Infinity Dimension multiplier based on Infinity Power.' },
  { id: 3, name: 'EC3 — Sacrifice disabled', description: 'Antimatter Dimensions 5–8 do not produce anything; Dimensional Sacrifice is disabled.', goal: '1e600', reward: 'Increases the multiplier for buying 10 Antimatter Dimensions.' },
  { id: 4, name: 'EC4 — Infinity production disabled', description: 'All Infinity multipliers and generators are disabled.', goal: '1e2750', restriction: 'Must reach the goal in 16 or fewer Infinities; the limit drops with completions.', reward: 'Infinity Dimension multiplier based on unspent Infinity Points.' },
  { id: 5, name: 'EC5 — Immediate Galaxy scaling', description: 'Antimatter Galaxy cost scaling starts immediately and Dimension Boost scaling is massively increased.', goal: '1e750', reward: 'Distant Galaxy cost scaling starts later.' },
  { id: 6, name: 'EC6 — No normal Antimatter Galaxies', description: 'You cannot gain Antimatter Galaxies normally; Max Replicanti Galaxy upgrades are massively cheaper.', goal: '1e850', reward: 'Further reduces Antimatter Dimension cost multiplier growth.' },
  { id: 7, name: 'EC7 — Cross-dimension production', description: 'The 1st Time Dimension produces 8th Infinity Dimensions and the 1st Infinity Dimension produces 7th Antimatter Dimensions. Tickspeed also directly affects Infinity and Time Dimensions.', goal: '1e2000', reward: 'The 1st Time Dimension produces 8th Infinity Dimensions.' },
  { id: 8, name: 'EC8 — Upgrade limits', description: 'You can only upgrade Infinity Dimensions 50 times and Replicanti upgrades 40 times; their upgrade autobuyers are disabled.', goal: '1e1300', reward: 'Infinity Power strengthens Replicanti Galaxies.' },
  { id: 9, name: 'EC9 — Tickspeed disabled', description: 'Tickspeed upgrades are disabled. Infinity Power instead multiplies Time Dimensions with greatly reduced effect.', goal: '1e1750', reward: 'Infinity Dimension multiplier based on Time Shards.' },
  { id: 10, name: 'EC10 — Infinity boost', description: 'Time and Infinity Dimensions are disabled; Infinities give an immense boost to Antimatter Dimensions.', goal: '1e3000', reward: 'Time Dimension multiplier based on Infinities.' },
  { id: 11, name: 'EC11 — Dimension multipliers disabled', description: 'All Dimension multipliers and powers are disabled except Infinity Power and Dimension Boost multipliers to Antimatter Dimensions.', goal: '1e450', reward: 'Further reduces Tickspeed cost multiplier growth.' },
  { id: 12, name: 'EC12 — 1000× slower', description: 'The game runs 1000× slower and other game-speed effects are disabled.', goal: '1e110000', restriction: 'Must reach the goal within 10 in-game seconds; the limit drops with completions.', reward: 'Infinity Dimension cost multipliers are reduced.' },
];

export const eternityChallengeById = new Map(
  eternityChallengeDefinitions.map((definition) => [definition.id, definition]),
);

export const replicantiFieldDescriptions = {
  unlocked: 'Whether Replicanti is available. The 10 Eternities milestone can keep this unlocked through Eternity resets.',
  amount: 'Current Replicanti count. Each Replicanti tick grows this amount using the stored chance.',
  timer: 'Milliseconds accumulated toward the next Replicanti tick; leftover time rolls over between game ticks.',
  chancePc: 'Actual chance per Replicanti unit to reproduce on each tick, stored as a fraction from 0 to 1 on PC/Web.',
  chanceMobile: 'Mobile saves store the number of +1% Replicanti Chance purchases here; it is not the final probability.',
  chanceCost: 'Current Infinity Point price of the next Replicanti Chance purchase.',
  intervalPc: 'Milliseconds between Replicanti ticks on PC/Web. Lower is faster; the game applies further speed modifiers at runtime.',
  intervalMobile: 'Mobile saves store the number of Replicanti Interval upgrade purchases here; it is not milliseconds.',
  intervalCost: 'Current Infinity Point price of the next Replicanti Interval purchase.',
  galaxies: 'Replicanti Galaxies already earned. This is separate from the maximum Galaxy upgrade count.',
  galaxyCapPc: 'Number of Max Replicanti Galaxy upgrades bought on PC/Web; extra bonuses can raise the effective cap.',
  galaxyCapMobile: 'Mobile saves store the number of Max Replicanti Galaxy upgrade purchases here.',
  galaxyCost: 'Current Infinity Point price of the next Max Replicanti Galaxy upgrade.',
  galaxyBuyer: 'Mobile Replicanti Galaxy autobuyer toggle.',
} as const;

export type DimensionId = 'antimatter' | 'infinity' | 'time';

export interface DimensionFamilyDefinition {
  readonly id: DimensionId;
  readonly name: string;
  readonly description: string;
  readonly fields: readonly ('amount' | 'bought' | 'costBumps' | 'cost' | 'baseAmount' | 'isUnlocked')[];
}

export const dimensionFamilyDefinitions: readonly DimensionFamilyDefinition[] = [
  {
    id: 'antimatter',
    name: 'Antimatter Dimensions',
    description: 'Eight tiers producing Antimatter. A normal purchase buys ten at once when the game is in Buy ×10 mode.',
    fields: ['amount', 'bought', 'costBumps'],
  },
  {
    id: 'infinity',
    name: 'Infinity Dimensions',
    description: 'Eight tiers producing Infinity Power. Base Amount is the purchased production base before multipliers; Cost is the current Antimatter price.',
    fields: ['amount', 'bought', 'cost', 'baseAmount', 'isUnlocked'],
  },
  {
    id: 'time',
    name: 'Time Dimensions',
    description: 'Eight tiers producing Time Shards. Cost is the current Eternity Point price; there is no unlock flag in the upstream model.',
    fields: ['amount', 'bought', 'cost'],
  },
];

export const dimensionFieldDescriptions = {
  amount: 'Current stock of this dimension tier. It is consumed or reset by some prestige actions.',
  bought: 'Number of individual dimensions purchased for this tier; Buy ×10 increases this by ten.',
  costBumps: 'Extra Antimatter Dimension cost steps, primarily used by Normal Challenge 9 cost-scaling rules.',
  cost: 'Current price for the next purchase of this dimension tier, in its upstream currency.',
  baseAmount: 'Base production amount used by Infinity Dimensions before multipliers and challenge effects.',
  isUnlocked: 'Whether this Infinity Dimension tier is currently available to buy.',
} as const;
