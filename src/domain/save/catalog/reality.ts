/**
 * Human-readable names and meanings copied from the pinned upstream game
 * snapshot. These values are deliberately kept as editor data: importing the
 * game runtime would make the save editor depend on the upstream build.
 */
export const UPSTREAM_GAME_SNAPSHOT = '5409e320cecef96a917cca1dfb68f1f183e499ca';

export interface RealityUpgradeDefinition {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly storage: 'rebuyable' | 'bitfield';
  readonly bitIndex?: number;
}

export const realityUpgradeDefinitions: readonly RealityUpgradeDefinition[] = [
  { id: 1, name: 'Temporal Amplifier', description: 'Gain Dilated Time faster; the stored value is a rebuyable purchase count.', storage: 'rebuyable' },
  { id: 2, name: 'Replicative Amplifier', description: 'Gain Replicanti faster; the stored value is a rebuyable purchase count.', storage: 'rebuyable' },
  { id: 3, name: 'Eternal Amplifier', description: 'Gain more Eternities; the stored value is a rebuyable purchase count.', storage: 'rebuyable' },
  { id: 4, name: 'Superluminal Amplifier', description: 'Gain more Tachyon Particles; the stored value is a rebuyable purchase count.', storage: 'rebuyable' },
  { id: 5, name: 'Boundless Amplifier', description: 'Gain more Infinities; the stored value is a rebuyable purchase count.', storage: 'rebuyable' },
  { id: 6, name: 'Cosmically Duplicate', description: 'Replicanti speed is multiplied based on Replicanti Galaxies.', storage: 'bitfield', bitIndex: 6 },
  { id: 7, name: 'Innumerably Construct', description: 'Infinity gain is boosted from Antimatter Galaxy count.', storage: 'bitfield', bitIndex: 7 },
  { id: 8, name: 'Paradoxically Attain', description: 'Tachyon Particle gain is boosted based on the Achievement multiplier.', storage: 'bitfield', bitIndex: 8 },
  { id: 9, name: 'Linguistically Expand', description: 'Gain another Glyph slot.', storage: 'bitfield', bitIndex: 9 },
  { id: 10, name: 'Existentially Prolong', description: 'Start every Reality with 100 Eternities.', storage: 'bitfield', bitIndex: 10 },
  { id: 11, name: 'The Boundless Flow', description: 'Every second, gain 10% of the Infinities normally gained by Infinitying.', storage: 'bitfield', bitIndex: 11 },
  { id: 12, name: 'The Knowing Existence', description: 'Eternity Point multiplier based on Reality and Time Theorem count.', storage: 'bitfield', bitIndex: 12 },
  { id: 13, name: 'The Telemechanical Process', description: 'Improves the Eternity Autobuyer and unlocks Time Dimension autobuyers.', storage: 'bitfield', bitIndex: 13 },
  { id: 14, name: 'The Eternal Flow', description: 'Gain Eternities per second equal to the Reality count.', storage: 'bitfield', bitIndex: 14 },
  { id: 15, name: 'The Paradoxical Forever', description: 'Boost Tachyon Particle gain based on the 5x Eternity Point multiplier.', storage: 'bitfield', bitIndex: 15 },
  { id: 16, name: 'Disparity of Rarity', description: 'Improves the Glyph rarity formula.', storage: 'bitfield', bitIndex: 16 },
  { id: 17, name: 'Duplicity of Potency', description: 'Adds a 50% chance to get an additional Glyph effect.', storage: 'bitfield', bitIndex: 17 },
  { id: 18, name: 'Measure of Forever', description: 'Eternity count boosts Glyph level.', storage: 'bitfield', bitIndex: 18 },
  { id: 19, name: 'Scour to Empower', description: 'Allows sacrificing Glyphs for permanent bonuses.', storage: 'bitfield', bitIndex: 19 },
  { id: 20, name: 'Parity of Singularity', description: 'Unlocks another Black Hole.', storage: 'bitfield', bitIndex: 20 },
  { id: 21, name: 'Cosmic Conglomerate', description: 'Moves remote Antimatter Galaxy scaling to 100,000 galaxies.', storage: 'bitfield', bitIndex: 21 },
  { id: 22, name: 'Temporal Transcendence', description: 'Time Dimension multiplier based on days spent in this Reality.', storage: 'bitfield', bitIndex: 22 },
  { id: 23, name: 'Replicative Rapidity', description: 'Replicanti speed is boosted based on the fastest game-time Reality.', storage: 'bitfield', bitIndex: 23 },
  { id: 24, name: 'Synthetic Symbolism', description: 'Gain another Glyph slot.', storage: 'bitfield', bitIndex: 24 },
  { id: 25, name: 'Effortless Existence', description: 'Unlocks the Reality Autobuyer and the Reality Automator command.', storage: 'bitfield', bitIndex: 25 },
];

export const realityUpgradeById = new Map(
  realityUpgradeDefinitions.map((definition) => [definition.id, definition]),
);

export const realityUpgradeBitDefinitions = realityUpgradeDefinitions
  .filter((definition): definition is RealityUpgradeDefinition & { readonly bitIndex: number } => definition.storage === 'bitfield' && definition.bitIndex !== undefined);

export interface RealityPerkDefinition {
  readonly id: number;
  readonly label: string;
  readonly description: string;
}

export const realityPerkLabels: Readonly<Record<number, string>> = {
  0: 'START', 10: 'SAM', 12: 'SIP1', 13: 'SIP2', 14: 'SEP1', 15: 'SEP2', 16: 'SEP3', 17: 'STP',
  30: 'ANR', 31: 'PASS', 40: 'EU1', 41: 'EU2', 42: 'DU1', 43: 'DU2', 44: 'ATT', 45: 'ATD', 46: 'REAL',
  51: 'IDR', 52: 'TGR', 53: 'DILR', 54: 'EC1R', 55: 'EC2R', 56: 'EC3R', 57: 'EC5R',
  60: 'PEC1', 61: 'PEC2', 62: 'PEC3', 70: 'ACT', 71: 'IDL', 72: 'ECR', 73: 'ECB',
  80: 'TP1', 81: 'TP2', 82: 'TP3', 83: 'TP4', 100: 'DAU', 101: 'IDAS', 102: 'REPAS',
  103: 'DAS', 104: 'TTS', 105: 'TTF', 106: 'TTM', 107: 'DAB', 201: 'ACH1', 202: 'ACH2',
  203: 'ACH3', 204: 'ACH4', 205: 'ACHNR',
};

const realityPerkDescriptions: Readonly<Record<number, string>> = {
  0: 'Removes the Reality Study achievement requirement and offers four Glyph choices on Reality.',
  10: 'Start every reset with a large amount of antimatter.',
  12: 'Start every Eternity and Reality with 5e15 Infinity Points.',
  13: 'Start every Eternity and Reality with 5e130 Infinity Points.',
  14: 'Start every Reality with 10 Eternity Points.',
  15: 'Start every Reality with 5,000 Eternity Points.',
  16: 'Start every Reality with 5e9 Eternity Points.',
  17: 'After unlocking Dilation, gain 10 Tachyon Particles.',
  30: 'Dimension Boosts and Antimatter Galaxies no longer reset early-game resources.',
  31: 'Improves the passive Time Study path.',
  40: 'Automatically unlocks the first row of Eternity Upgrades once Eternities are available.',
  41: 'Automatically purchases the second row of Eternity Upgrades at a greatly reduced price.',
  42: 'Automatically unlocks the second row of Dilation Upgrades.',
  43: 'Automatically unlocks the third row of Dilation Upgrades.',
  44: 'Automatically purchases the passive Time Theorem generation upgrade.',
  45: 'Automatically unlocks Time Dimensions 5–8 when affordable.',
  46: 'Automatically unlocks Reality when its upstream requirements are met.',
  51: 'Removes antimatter requirements from Infinity Dimensions.',
  52: 'The second rebuyable Dilation Upgrade no longer resets Dilated Time.',
  53: 'Removes secondary requirements from unlocking Dilation.',
  54: 'Removes the Eternity Challenge 1 requirement from Time Study 181.',
  55: 'Removes the Eternity Challenge 2 requirement from Time Study 181.',
  56: 'Removes the Eternity Challenge 3 requirement from Time Study 181.',
  57: 'Removes the Eternity Challenge 5 requirement from Time Study 62.',
  60: 'Automatically completes one Eternity Challenge every 60 real-time minutes.',
  61: 'Automatically completes one Eternity Challenge every 40 real-time minutes.',
  62: 'Automatically completes one Eternity Challenge every 20 real-time minutes.',
  70: 'Active Eternity Study path multipliers are always maximized.',
  71: 'Idle Eternity Study path multipliers start as if time has already passed.',
  72: 'Removes non-Time Theorem requirements for unlocking Eternity Challenges.',
  73: 'Allows bulk completion of multiple Eternity Challenge tiers.',
};

export const realityPerkDefinitions: readonly RealityPerkDefinition[] = Object.keys(realityPerkLabels)
  .map(Number)
  .sort((left, right) => left - right)
  .map((id) => ({
    id,
    label: realityPerkLabels[id],
    description: realityPerkDescriptions[id] ?? 'Known upstream Reality perk; its persisted value is this numeric ID.',
  }));

export const realityPerkById = new Map(
  realityPerkDefinitions.map((definition) => [definition.id, definition]),
);
