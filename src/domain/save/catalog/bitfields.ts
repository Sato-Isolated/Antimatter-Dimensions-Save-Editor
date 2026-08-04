import { getValueAtPath } from '../document/path';
import { SaveObject, SaveValidationIssue } from '../model';
import { infinityChallengeBits, normalChallengeBits } from './challenges';
import {
  dilationCollectionUpgradeDefinitions,
  eternityUpgradeDefinitions,
  infinityCollectionUpgradeDefinitions,
} from './progression';
import { realityPerkLabels, realityUpgradeDefinitions } from './reality';

/**
 * Snapshot of the upstream bit/Set conventions.
 *
 * This file intentionally contains data, rather than importing the upstream game at runtime. The
 * editor must remain useful when the game checkout is not present and must keep newer values which
 * are not in this snapshot.
 */
export const UPSTREAM_BITFIELD_SNAPSHOT = '5409e320cecef96a917cca1dfb68f1f183e499ca';
export const BITFIELD_MAX = 0x7fffffff;
export const NEWS_BITS_PER_SEGMENT = 31;

export type BitfieldValueShape = 'number' | 'array' | 'map';
export type BitfieldSection = 'progression' | 'celestials' | 'glyphs' | 'interface';
export type CollectionValueType = 'string' | 'number' | 'mixed';
export type StructuredCatalogFieldKind = 'integer' | 'array' | 'object' | 'collection';
export type DedicatedSectionId = 'infinity' | 'eternity' | 'dilation' | 'reality' | 'challenges' | 'celestials';

export interface BitDefinition {
  bit: number;
  label: string;
  description: string;
  segment?: number;
}

export interface BitfieldCatalogEntry {
  id: string;
  path: string;
  label: string;
  description: string;
  section: BitfieldSection;
  shape: BitfieldValueShape;
  segmentCount?: number;
  width: number;
  knownBits: BitDefinition[];
  knownBitsFor?: (segment: number, context?: string) => BitDefinition[];
  rawOnly?: boolean;
  /**
   * The structured section which owns editing this value. Systems only shows
   * entries without an owner so a raw catalog cannot become a second editor.
   */
  dedicatedSectionId?: DedicatedSectionId;
}

export interface CollectionCatalogEntry {
  id: string;
  path: string;
  label: string;
  description: string;
  section: 'collections';
  valueType: CollectionValueType;
  entries: CollectionEntry[];
  /** The structured section which owns editing this collection. */
  dedicatedSectionId?: DedicatedSectionId;
}

export interface CollectionEntry {
  value: string | number;
  label: string;
  description: string;
}

export interface StructuredCatalogFieldSpec {
  id: string;
  path: string;
  label: string;
  description: string;
  kind: StructuredCatalogFieldKind;
  minimum?: number;
  maximum?: number;
  integer?: boolean;
  dedicatedSectionId?: DedicatedSectionId;
}

export interface GlyphMaskTarget {
  path: string;
  label: string;
  glyphType: string;
  kind: 'effects' | 'specifiedMask';
  value: unknown;
  knownBits: BitDefinition[];
}

const bit = (bitIndex: number, label: string, description: string, segment?: number): BitDefinition => ({
  bit: bitIndex,
  label,
  description,
  ...(segment === undefined ? {} : { segment }),
});

const numberedBits = (
  ids: number[],
  label: (id: number) => string,
  description: (id: number) => string,
): BitDefinition[] => ids.map((id) => bit(id, label(id), description(id)));

const achievementLabels: Record<number, string> = {
  11: 'You gotta start somewhere',
  12: '100 antimatter is a lot',
  13: 'Half life 3 CONFIRMED',
  14: 'L4D: Left 4 Dimensions',
  15: '5 Dimension Antimatter Punch',
  16: "We couldn't afford 9",
  17: 'Not a luck related achievement',
  18: '90 degrees to infinity',
  21: 'To infinity!',
  22: 'FAKE NEWS!',
  23: 'The 9th Dimension is a lie',
  24: 'Antimatter Apocalypse',
  25: 'Boosting to the max',
  26: 'You got past The Big Wall',
  27: 'Double Galaxy',
  28: "There's no point in doing that...",
  31: 'I forgot to nerf that',
  32: 'The Gods are pleased',
  33: "That's a lot of infinites",
  34: "You didn't need it anyway",
  35: "Don't you dare sleep",
  36: 'Claustrophobic',
  37: "That's FAST!",
  38: "I don't believe in Gods",
  41: 'No DLC required',
  42: 'Super Sanic',
  43: 'How the antitables have turned..',
  44: 'Over in 30 Seconds',
  45: 'Faster than a potato',
  46: 'Multidimensional',
  47: 'Daredevil',
  48: 'Antichallenged',
  51: 'Limit Break',
  61: 'Bulked Up',
  63: 'A new beginning',
  64: 'Zero Deaths',
  67: 'Infinitely Challenging',
  71: 'ERROR 909: Dimension not found',
  72: "Can't hold all these infinities",
  73: "THIS ACHIEVEMENT DOESN'T EXIST",
  74: 'Not a second lost',
  75: 'NEW DIMENSIONS???',
  76: 'One for each dimension',
  77: '1 Million is a lot',
  78: 'Blink of an eye',
  81: 'Game Design Is My Passion',
  82: 'Anti-antichallenged',
  83: 'YOU CAN GET 50 GALAXIES?!?!',
  84: 'I got a few to spare',
  85: 'ALL YOUR IP ARE BELONG TO US',
  86: 'Do you even bend time bro?',
  87: '2 MILLION INFINITIES',
  91: 'Ludicrous Speed',
  92: 'I brake for NOBODY!',
  93: 'MAXIMUM OVERDRIVE',
  94: '4.3333 minutes of Infinity',
  95: 'Is this safe?',
  96: 'Time is relative',
  101: '8 nobody got time for that',
  102: 'This mile took an eternity',
  103: 'Tätä saavutusta ei ole olemassa II',
  104: "That wasn't an eternity",
  105: 'Infinite Time',
  106: 'The swarm',
  107: 'Do you really need a guide for this?',
  108: 'We COULD afford 9',
  111: 'Yo dawg, I heard you liked infinities...',
  112: 'Never again',
  113: 'Eternities are the new infinity',
  114: "You're a mistake",
  121: 'Can you get infinite IP?',
  122: "You're already dead.",
  123: '5 more eternities until the update',
  124: 'Long lasting relationship',
  131: 'No ethical consumption',
  132: 'Unique snowflakes',
  133: 'I never liked this infinity stuff anyway',
  134: 'When will it be enough?',
  135: 'Faster than a potato^286078',
  136: 'I told you already, time is relative',
  137: "Now you're thinking with dilation!",
  141: 'Snap back to reality',
  142: 'How does this work?',
  143: 'Yo dawg, I heard you liked reskins...',
  144: 'Is this an Interstellar reference?',
  145: 'Are you sure these are the right way around?',
  146: 'Perks of living',
  147: 'Master of Reality',
  148: 'Royal flush',
};

const secretAchievementLabels: Record<number, string> = {
  11: "The first one's always free",
  12: 'Just in case',
  13: 'It pays to have respect',
  14: 'So do I',
  15: 'Do a barrel roll!',
  16: 'Do you enjoy pain?',
  17: '30 Lives',
  18: 'Do you feel lucky? Well do ya punk?',
  21: 'Go study in real life instead',
  22: 'Deep fried',
  23: 'Stop right there criminal scum!',
  24: 'Real news',
  25: "Shhh... It's a secret",
  26: "You're a failure",
  27: "It's not called matter dimensions is it?",
  28: 'Nice.',
  31: 'You should download some more RAM',
  32: 'Less than or equal to 0.001',
  33: 'A sound financial decision',
  34: 'You do know how these work, right?',
  35: 'Should we tell them about buy max...',
  36: 'While you were away... Nothing happened.',
  37: 'You followed the instructions',
  38: "Knife's edge",
  41: "That dimension doesn’t exist",
  42: 'SHAME ON ME',
  43: 'A cacophonous chorus',
  44: 'Are you statisfied now?',
  45: 'This dragging is dragging on',
  46: 'For a rainy day',
  47: 'ALT+',
  48: 'Stack overflow',
};

const achievementBits = (secret: boolean): BitDefinition[] => {
  const labels = secret ? secretAchievementLabels : achievementLabels;
  const rows = secret ? 4 : 18;
  const definitions: BitDefinition[] = [];

  for (let row = 1; row <= rows; row += 1) {
    for (let column = 1; column <= 8; column += 1) {
      const id = row * 10 + column;
      definitions.push(bit(
        column - 1,
        labels[id] ?? `${secret ? 'Secret ' : ''}Achievement ${id}`,
        `Upstream ${secret ? 'secret ' : ''}achievement ${id}; row ${row}, column ${column}.`,
        row - 1,
      ));
    }
  }

  return definitions;
};

const challengeBits = (kind: 'normal' | 'infinity'): BitDefinition[] => {
  const definitions = kind === 'normal' ? normalChallengeBits : infinityChallengeBits;
  return definitions.map((definition) => bit(
    definition.bitIndex,
    definition.label,
    `Completion bit ${definition.id}; bit 0 is unused by upstream.`,
  ));
};

const realityUpgradeNames: Record<number, string> = Object.fromEntries(
  realityUpgradeDefinitions.map((definition) => [definition.id, definition.name]),
);

const imaginaryUpgradeNames: Record<number, string> = {
  11: 'Suspicion of Interference',
  12: 'Consequences of Illusions',
  13: 'Transience of Information',
  14: 'Recollection of Intrusion',
  15: 'Fabrication of Ideals',
  16: 'Massless Momentum',
  17: 'Chiral Oscillation',
  18: 'Dimensional Symmetry',
  19: 'Deterministic Radiation',
  20: 'Vacuum Acceleration',
  21: 'Existential Elimination',
  22: 'Total Termination',
  23: 'Planar Purification',
  24: 'Absolute Annulment',
  25: 'Omnipresent Obliteration',
};

const upgradeBits = (names: Record<number, string>, start: number, end: number, prefix: string): BitDefinition[] =>
  Array.from({ length: end - start + 1 }, (_, offset) => {
    const id = start + offset;
    const realityDefinition = prefix === 'Reality'
      ? realityUpgradeDefinitions.find((definition) => definition.id === id)
      : undefined;
    return bit(
      id,
      names[id] ?? `${prefix} Upgrade ${id}`,
      realityDefinition?.description ?? `Single-purchase ${prefix.toLowerCase()} upgrade ${id}.`,
    );
  });

const celestialBits = (ids: number[], label: string, description: string): BitDefinition[] =>
  ids.map((id) => bit(id, `${label} ${id}`, `${description} (upstream bit ${id}).`));

const quoteBits = (celestial: string, ids: number[]): BitDefinition[] =>
  ids.map((id) => bit(id, `${celestial} quote ${id}`, `Quote ${id} from the ${celestial} quote catalog.`));

const tabBits = [
  'Dimensions', 'Options', 'Statistics', 'Achievements', 'Automation', 'Challenges',
  'Infinity', 'Eternity', 'Reality', 'Celestials', 'Shop',
].map((label, id) => bit(id, label, `Hide or show the upstream ${label} tab.`));

const subtabNames: string[][] = [
  ['Antimatter Dimensions', 'Infinity Dimensions', 'Time Dimensions'],
  ['Saving', 'Visual', 'Gameplay'],
  ['Statistics', 'Challenge records', 'Past Prestige Runs', 'Multiplier Breakdown', 'Glyph Set Records', 'Speedrun Milestones', 'Speedrun Records'],
  ['Achievements', 'Secret Achievements'],
  ['Autobuyers', 'Automator'],
  ['Challenges', 'Infinity Challenges', 'Eternity Challenges'],
  ['Infinity Upgrades', 'Break Infinity', 'Replicanti'],
  ['Time Studies', 'Eternity Upgrades', 'Eternity Milestones', 'Time Dilation'],
  ['Glyphs', 'Reality Upgrades', 'Imaginary Upgrades', 'Perks', 'Black Hole', 'Glyph Alchemy'],
  ['Celestial Navigation', 'Teresa', 'Effarig', 'The Nameless Ones', 'V', 'Ra', "Lai'tela", 'Pelle'],
  ['Shop'],
];

const subtabBits = subtabNames.flatMap((names, segment) => names.map((name, bitIndex) => bit(
  bitIndex,
  name,
  `Hide or show the ${name} subtab under upstream tab ${segment}.`,
  segment,
)));

const notificationLabels: Record<number, string> = {
  0: 'First Infinity',
  1: 'Break Infinity',
  2: 'Infinity Dimension unlock',
  3: 'Infinity Challenge unlock',
  4: 'Replicanti',
  5: 'First Eternity',
  6: 'Dilation after unlock',
  7: 'Reality unlock',
  8: 'Black Hole unlock',
  9: 'Automator unlock',
  10: 'Teresa unlock',
  11: 'Alchemy unlock',
  12: 'New autobuyer',
  13: 'Imaginary Machine unlock',
  14: "Lai'tela unlock",
  15: 'Pelle unlock',
  16: 'New glyph cosmetic',
};

const notificationBits = Object.keys(notificationLabels).map(Number).map((id) => bit(
  id,
  notificationLabels[id],
  `Whether upstream notification ${id} has already been triggered.`,
));

const newsMaximumId: Record<string, number> = { a: 390, ai: 997, l: 88, p: 2, r: 1 };

const newsBitsFor = (segment: number, context?: string): BitDefinition[] => {
  if (!context || newsMaximumId[context] === undefined) return [];
  const firstId = segment * NEWS_BITS_PER_SEGMENT;
  const maximum = newsMaximumId[context];
  return Array.from({ length: NEWS_BITS_PER_SEGMENT }, (_, bitIndex) => {
    const id = firstId + bitIndex;
    if (id === 0 || id > maximum) return null;
    return bit(
      bitIndex,
      `News ${context}${id}`,
      `Upstream ${context}${id} ticker entry; segment ${segment}, bit ${bitIndex}.`,
    );
  }).filter((entry): entry is BitDefinition => entry !== null);
};

const knownBitsBySegment = (definitions: BitDefinition[], segment: number): BitDefinition[] =>
  definitions.filter((definition) => (definition.segment ?? 0) === segment);

const fixed = (
  id: string,
  path: string,
  label: string,
  description: string,
  section: BitfieldSection,
  knownBits: BitDefinition[],
  extra: Partial<BitfieldCatalogEntry> = {},
): BitfieldCatalogEntry => ({
  id,
  path,
  label,
  description,
  section,
  shape: 'number',
  width: 31,
  knownBits,
  ...extra,
});

const segmented = (
  id: string,
  path: string,
  label: string,
  description: string,
  section: BitfieldSection,
  segmentCount: number,
  knownBits: BitDefinition[],
  extra: Partial<BitfieldCatalogEntry> = {},
): BitfieldCatalogEntry => ({
  ...fixed(id, path, label, description, section, knownBits, extra),
  shape: 'array',
  segmentCount,
});

export const bitfieldCatalog: BitfieldCatalogEntry[] = [
  segmented(
    'achievementBits',
    'achievementBits',
    'Normal achievements',
    '18 upstream row masks. The row is the array segment and the achievement column is the bit.',
    'progression',
    18,
    achievementBits(false),
  ),
  segmented(
    'secretAchievementBits',
    'secretAchievementBits',
    'Secret achievements',
    'Four upstream row masks for secret achievements.',
    'progression',
    4,
    achievementBits(true),
  ),
  fixed(
    'normalChallengeBits',
    'challenge.normal.completedBits',
    'Normal challenge completions',
    'Normal challenges use one-based bits; bit 0 is intentionally unused.',
    'progression',
    challengeBits('normal'),
    { dedicatedSectionId: 'challenges' },
  ),
  fixed(
    'infinityChallengeBits',
    'challenge.infinity.completedBits',
    'Infinity challenge completions',
    'Infinity challenges use one-based bits; bit 0 is intentionally unused.',
    'progression',
    challengeBits('infinity'),
    { dedicatedSectionId: 'challenges' },
  ),
  fixed(
    'unlockedEC',
    'reality.unlockedEC',
    'Unlocked Eternity Challenges',
    'A bit for each Eternity Challenge which has been unlocked. This is distinct from completion counts.',
    'progression',
    numberedBits(
      Array.from({ length: 12 }, (_, index) => index + 1),
      (id) => `Eternity Challenge ${id}`,
      (id) => `EC ${id} unlock bit. Completions remain in eternityChalls.eterc${id}.`,
    ),
    { dedicatedSectionId: 'reality' },
  ),
  fixed(
    'eternityUnlockedLegacy',
    'challenge.eternity.unlocked',
    'Legacy active Eternity Challenge',
    'Historical v14 field containing the currently selected Eternity Challenge ID, not the persistent unlocked-EC bitmask.',
    'progression',
    [],
    { rawOnly: true, dedicatedSectionId: 'challenges' },
  ),
  fixed(
    'realityUpgradeBits',
    'reality.upgradeBits',
    'Bought Reality upgrades',
    'Single-purchase Reality upgrades. Rebuyable IDs 1–5 are deliberately omitted from the catalog.',
    'progression',
    upgradeBits(realityUpgradeNames, 6, 25, 'Reality'),
    { dedicatedSectionId: 'reality' },
  ),
  fixed(
    'realityUpgradeRequirements',
    'reality.upgReqs',
    'Unlocked Reality upgrades',
    'Requirement-satisfied bits for Reality upgrades; this is separate from bought upgrade bits.',
    'progression',
    upgradeBits(realityUpgradeNames, 6, 25, 'Reality'),
    { dedicatedSectionId: 'reality' },
  ),
  fixed(
    'realityUpgradeLocks',
    'reality.reqLock.reality',
    'Reality upgrade locks',
    'Manual mechanic-lock bits for Reality upgrades.',
    'progression',
    upgradeBits(realityUpgradeNames, 6, 25, 'Reality'),
    { dedicatedSectionId: 'reality' },
  ),
  fixed(
    'imaginaryUpgradeBits',
    'reality.imaginaryUpgradeBits',
    'Bought Imaginary upgrades',
    'Single-purchase Imaginary upgrades. Rebuyable IDs 1–10 are deliberately omitted from the catalog.',
    'progression',
    upgradeBits(imaginaryUpgradeNames, 11, 25, 'Imaginary'),
  ),
  fixed(
    'imaginaryUpgradeRequirements',
    'reality.imaginaryUpgReqs',
    'Unlocked Imaginary upgrades',
    'Requirement-satisfied bits for Imaginary upgrades.',
    'progression',
    upgradeBits(imaginaryUpgradeNames, 11, 25, 'Imaginary'),
  ),
  fixed(
    'imaginaryUpgradeLocks',
    'reality.reqLock.imaginary',
    'Imaginary upgrade locks',
    'Manual mechanic-lock bits for Imaginary upgrades.',
    'progression',
    upgradeBits(imaginaryUpgradeNames, 11, 25, 'Imaginary'),
  ),
  fixed(
    'infinityUpgradeBitsLegacy',
    'infinity.upgradeBits',
    'Legacy Infinity bitfield',
    'Historical raw field retained for diagnostics. The current upstream game uses the Set at infinityUpgrades.',
    'progression',
    [],
    { rawOnly: true },
  ),
  fixed(
    'eternityRequirementBitsLegacy',
    'challenge.eternity.requirementBits',
    'Legacy Eternity requirement bits',
    'Historical raw field retained for diagnostics; current EC availability is reality.unlockedEC.',
    'progression',
    [],
    { rawOnly: true, dedicatedSectionId: 'challenges' },
  ),
  fixed('teresaQuoteBits', 'celestials.teresa.quoteBits', 'Teresa quotes', 'Quote-seen mask.', 'celestials', quoteBits('Teresa', [0, 1, 2, 3])),
  fixed('teresaUnlockBits', 'celestials.teresa.unlockBits', 'Teresa unlocks', 'Teresa unlock mask.', 'celestials', celestialBits([0, 1, 2, 3, 4, 5], 'Teresa unlock', 'Teresa unlock state')),
  fixed('effarigQuoteBits', 'celestials.effarig.quoteBits', 'Effarig quotes', 'Quote-seen mask.', 'celestials', quoteBits('Effarig', Array.from({ length: 8 }, (_, id) => id))),
  fixed('effarigUnlockBits', 'celestials.effarig.unlockBits', 'Effarig unlocks', 'Effarig unlock mask.', 'celestials', celestialBits([0, 1, 2, 3, 4, 5, 6], 'Effarig unlock', 'Effarig unlock state')),
  fixed('enslavedQuoteBits', 'celestials.enslaved.quoteBits', 'The Nameless Ones quotes', 'Quote-seen mask.', 'celestials', quoteBits('The Nameless Ones', Array.from({ length: 6 }, (_, id) => id))),
  fixed('enslavedProgressBits', 'celestials.enslaved.progressBits', 'The Nameless Ones progress', 'Progress events recorded by Enslaved.', 'celestials', celestialBits(Array.from({ length: 8 }, (_, id) => id), 'Enslaved progress', 'Enslaved progress state')),
  fixed('enslavedHintBits', 'celestials.enslaved.hintBits', 'The Nameless Ones hints', 'Hint events recorded by Enslaved.', 'celestials', celestialBits(Array.from({ length: 8 }, (_, id) => id), 'Enslaved hint', 'Enslaved hint state')),
  fixed('vQuoteBits', 'celestials.v.quoteBits', 'V quotes', 'Quote-seen mask.', 'celestials', quoteBits('V', Array.from({ length: 11 }, (_, id) => id))),
  fixed('vUnlockBits', 'celestials.v.unlockBits', 'V unlocks', 'V unlock mask.', 'celestials', celestialBits(Array.from({ length: 7 }, (_, id) => id), 'V unlock', 'V unlock state')),
  fixed('raQuoteBits', 'celestials.ra.quoteBits', 'Ra quotes', 'Quote-seen mask.', 'celestials', quoteBits('Ra', Array.from({ length: 14 }, (_, id) => id))),
  fixed('raUnlockBits', 'celestials.ra.unlockBits', 'Ra unlocks', 'Ra unlock mask.', 'celestials', celestialBits(Array.from({ length: 28 }, (_, id) => id), 'Ra unlock', 'Ra memory unlock state')),
  fixed('laitelaQuoteBits', 'celestials.laitela.quoteBits', "Lai'tela quotes", 'Quote-seen mask. Other Lai’tela upgrade structures remain raw.', 'celestials', quoteBits("Lai'tela", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])),
  fixed('pelleQuoteBits', 'celestials.pelle.quoteBits', 'Pelle quotes', 'Quote-seen mask.', 'celestials', quoteBits('Pelle', Array.from({ length: 12 }, (_, id) => id))),
  fixed('pelleProgressBits', 'celestials.pelle.progressBits', 'Pelle strikes', 'Pelle strike progress bits; IDs 1–5 are upstream strike IDs.', 'celestials', celestialBits([1, 2, 3, 4, 5], 'Pelle strike', 'Pelle strike progress')),
  fixed('hiddenTabBits', 'options.hiddenTabBits', 'Hidden tabs', 'One bit per upstream top-level tab.', 'interface', tabBits),
  segmented('hiddenSubtabBits', 'options.hiddenSubtabBits', 'Hidden subtabs', 'One array segment per top-level tab; each segment contains subtab visibility bits.', 'interface', 11, subtabBits),
  fixed('triggeredTabNotificationBits', 'triggeredTabNotificationBits', 'Triggered tab notifications', 'Tracks which notification definitions have already fired.', 'interface', notificationBits),
  {
    id: 'newsSeen',
    path: 'news.seen',
    label: 'Seen news',
    description: 'Category-to-array map. Each array segment has exactly 31 usable news bits upstream.',
    section: 'interface',
    shape: 'map',
    width: NEWS_BITS_PER_SEGMENT,
    knownBits: [],
    knownBitsFor: newsBitsFor,
  },
];

const collection = (
  id: string,
  path: string,
  label: string,
  description: string,
  valueType: CollectionValueType,
  entries: CollectionEntry[],
  extra: Partial<CollectionCatalogEntry> = {},
): CollectionCatalogEntry => ({ id, path, label, description, section: 'collections', valueType, entries, ...extra });

const entriesFromIds = (ids: Array<string | number>, description: (id: string | number) => string): CollectionEntry[] =>
  ids.map((id) => ({ value: id, label: String(id), description: description(id) }));

const infinityCollectionEntries = infinityCollectionUpgradeDefinitions.map((definition) => ({
  value: definition.id,
  label: definition.name,
  description: definition.description,
}));

const perkLabels: Record<number, string> = { ...realityPerkLabels };

const perkIds = Object.keys(perkLabels).map(Number);
const raChargedIds = ['timeMult', '18Mult', '27Mult', '36Mult', '45Mult', 'resetBoost', 'dimMult', 'galaxyBoost', 'timeMult2', 'unspentBonus', 'resetMult', 'passiveGen'];
const pelleNumericLabels: Record<number, string> = {
  0: 'Antimatter Dimension autobuyers 1–4', 1: 'Dimension Boost autobuyer', 2: 'Keep autobuyers', 3: 'Antimatter Dimension autobuyers 5–8',
  4: 'Galaxy autobuyer', 5: 'Tickspeed autobuyer', 6: 'Keep Infinity upgrades', 7: 'Dimension Boosts reset nothing',
  8: 'Keep Break Infinity upgrades', 9: 'Infinity Dimension autobuyers', 10: 'Keep Infinity Challenges', 11: 'Galaxies do not reset Dimension Boosts',
  12: 'Replicanti autobuyers', 13: 'Replicanti Galaxies do not reset on Infinity', 14: 'Eternities do not reset on Armageddon',
  15: 'Keep Time Studies and Theorems', 16: 'Replicanti permanently unlocked', 17: 'Keep Eternity upgrades', 18: 'Time Dimension autobuyers',
  19: 'Keep Eternity Challenge completions', 20: 'Keep Dilation upgrades', 21: 'Keep Tachyon Particles', 22: 'Replicanti Galaxy EM40',
};
const notificationCollectionEntries = [
  'infinityupgrades', 'challengesnormal', 'statisticsmultipliers', 'infinitybreak', 'dimensionsinfinity', 'challengesinfinity',
  'infinityreplicanti', 'eternitystudies', 'eternitymilestones', 'eternityupgrades', 'dimensionstime', 'eternitydilation',
  'realityhole', 'realityglyphs', 'realityalchemy', 'realityimag_upgrades', 'automationautobuyers', 'celestialscelestial-navigation',
  'celestialsteresa', 'celestialslaitela', 'celestialspelle',
];

export const collectionCatalog: CollectionCatalogEntry[] = [
  collection('infinityUpgrades', 'infinityUpgrades', 'Infinity and Break Infinity upgrades', 'PC/Web serializes bought one-time Infinity and Break Infinity upgrades as string IDs in one Set/array. The three Break Infinity rebuyables are counters in infinityRebuyables.', 'string', infinityCollectionEntries, { dedicatedSectionId: 'infinity' }),
  collection(
    'eternityUpgrades',
    'eternityUpgrades',
    'Eternity upgrades',
    'One-time Eternity upgrades stored as numeric IDs. Their effects are listed below instead of exposing only an array length.',
    'number',
    eternityUpgradeDefinitions.map((definition) => ({
      value: definition.id,
      label: `${definition.id}. ${definition.name}`,
      description: definition.description,
    })),
    { dedicatedSectionId: 'eternity' },
  ),
  collection(
    'dilationUpgrades',
    'dilation.upgrades',
    'Dilation upgrades',
    'One-time Dilation upgrades stored in the PC/Web Set; rebuyable IDs are counters elsewhere. Android uses a separate bitfield.',
    'number',
    dilationCollectionUpgradeDefinitions.map((definition) => ({
      value: definition.id,
      label: `${definition.id}. ${definition.name}`,
      description: definition.description,
    })),
    { dedicatedSectionId: 'dilation' },
  ),
  collection('realityPerks', 'reality.perks', 'Reality perks', 'Purchased perk IDs serialized from an upstream Set.', 'number', entriesFromIds(perkIds, (id) => `${perkLabels[Number(id)] ?? 'Reality perk'} (ID ${id}).`), { dedicatedSectionId: 'reality' }),
  collection('themes', 'secretUnlocks.themes', 'Secret themes', 'Unlocked theme names serialized from the upstream Set. Custom/future names remain unknown entries.', 'string', entriesFromIds(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'], (id) => `Secret theme family ${id}.`)),
  collection('raCharged', 'celestials.ra.charged', 'Charged Infinity upgrades', 'Charged Infinity upgrade IDs serialized from an upstream Set.', 'string', entriesFromIds(raChargedIds, (id) => `Charged effect for Infinity upgrade ${id}.`)),
  collection('pelleUpgrades', 'celestials.pelle.upgrades', 'Pelle upgrades', 'Permanent numeric IDs serialized from the upstream Set; rebuyable Pelle values live in celestials.pelle.rebuyables.', 'number', [
    ...Object.keys(pelleNumericLabels).map(Number).map((id) => ({ value: id, label: `Pelle ${id}`, description: pelleNumericLabels[id] })),
  ], { dedicatedSectionId: 'celestials' }),
  collection('tabNotifications', 'tabNotifications', 'Tab notifications', 'Concatenated parent-tab keys stored in an upstream Set.', 'string', entriesFromIds(notificationCollectionEntries, (id) => `Notification target ${id}.`)),
];

const spec = (
  id: string,
  path: string,
  label: string,
  description: string,
  kind: StructuredCatalogFieldKind,
  rule: Pick<StructuredCatalogFieldSpec, 'minimum' | 'maximum' | 'integer'> = {},
  extra: Pick<StructuredCatalogFieldSpec, 'dedicatedSectionId'> = {},
): StructuredCatalogFieldSpec => ({ id, path, label, description, kind, ...rule, ...extra });

export const bitfieldCollectionFieldSpecs: StructuredCatalogFieldSpec[] = [
  ...bitfieldCatalog.map((entry) => spec(
    entry.id,
    entry.path,
    entry.label,
    entry.description,
    entry.shape === 'number' ? 'integer' : entry.shape === 'array' ? 'array' : 'object',
    entry.shape === 'number' ? { minimum: 0, maximum: BITFIELD_MAX, integer: true } : {},
    { dedicatedSectionId: entry.dedicatedSectionId },
  )),
  ...collectionCatalog.map((entry) => spec(
    entry.id,
    entry.path,
    entry.label,
    entry.description,
    'collection',
    {},
    { dedicatedSectionId: entry.dedicatedSectionId },
  )),
];

export const getBitfieldValue = (value: unknown, bitIndex: number): boolean => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > BITFIELD_MAX || bitIndex < 0 || bitIndex > 30) {
    return false;
  }

  return (value & (1 << bitIndex)) !== 0;
};

export const setBitfieldBit = (value: number, bitIndex: number, enabled: boolean): number => {
  if (!Number.isInteger(value) || value < 0 || value > BITFIELD_MAX || bitIndex < 0 || bitIndex > 30) {
    return value;
  }

  const mask = 1 << bitIndex;
  return enabled ? value | mask : value & ~mask;
};

export const getKnownBitDefinitions = (
  definition: BitfieldCatalogEntry,
  segment = 0,
  context?: string,
): BitDefinition[] => definition.knownBitsFor?.(segment, context)
  ?? knownBitsBySegment(definition.knownBits, segment);

export const getUnknownSetBits = (value: unknown, knownBits: BitDefinition[]): number[] => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > BITFIELD_MAX) {
    return [];
  }

  const known = new Set(knownBits.map((definition) => definition.bit));
  return Array.from({ length: 31 }, (_, bitIndex) => bitIndex)
    .filter((bitIndex) => getBitfieldValue(value, bitIndex) && !known.has(bitIndex));
};

export const setAllKnownBits = (value: number, knownBits: BitDefinition[]): number =>
  knownBits.reduce((current, definition) => setBitfieldBit(current, definition.bit, true), value);

export const clearAllKnownBits = (value: number, knownBits: BitDefinition[]): number =>
  knownBits.reduce((current, definition) => setBitfieldBit(current, definition.bit, false), value);

export const setSegmentBit = (segments: readonly number[], segment: number, bitIndex: number, enabled: boolean): number[] => {
  const next = [...segments];
  next[segment] = setBitfieldBit(next[segment] ?? 0, bitIndex, enabled);
  return next;
};

export const setAllKnownSegmentBits = (segments: readonly number[], segment: number, knownBits: BitDefinition[]): number[] => {
  const next = [...segments];
  next[segment] = setAllKnownBits(next[segment] ?? 0, knownBits);
  return next;
};

export const clearAllKnownSegmentBits = (segments: readonly number[], segment: number, knownBits: BitDefinition[]): number[] => {
  const next = [...segments];
  next[segment] = clearAllKnownBits(next[segment] ?? 0, knownBits);
  return next;
};

export const hasCollectionEntry = (collectionValue: unknown, entry: string | number): boolean =>
  Array.isArray(collectionValue) && collectionValue.some((value) => value === entry);

export const setCollectionEntry = (collectionValue: readonly (string | number)[], entry: string | number, enabled: boolean): (string | number)[] => {
  if (enabled) return hasCollectionEntry(collectionValue, entry) ? [...collectionValue] : [...collectionValue, entry];
  return collectionValue.filter((value) => value !== entry);
};

export const addAllKnownCollectionEntries = (
  collectionValue: readonly (string | number)[],
  entries: CollectionEntry[],
): (string | number)[] => entries.reduce(
  (current, entry) => setCollectionEntry(current, entry.value, true),
  [...collectionValue],
);

export const removeAllKnownCollectionEntries = (
  collectionValue: readonly (string | number)[],
  entries: CollectionEntry[],
): (string | number)[] => entries.reduce(
  (current, entry) => setCollectionEntry(current, entry.value, false),
  [...collectionValue],
);

export const getUnknownCollectionEntries = (collectionValue: unknown, definition: CollectionCatalogEntry): unknown[] => {
  if (!Array.isArray(collectionValue)) return [];
  const known = new Set(definition.entries.map((entry) => entry.value));
  return collectionValue.filter((value) => !known.has(value as string | number));
};

export const getDuplicateCollectionEntries = (collectionValue: unknown): (string | number)[] => {
  if (!Array.isArray(collectionValue)) return [];
  const seen = new Set<string | number>();
  const duplicates = new Set<string | number>();
  for (const value of collectionValue) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const invalidBitfieldIssue = (path: string, label: string): SaveValidationIssue => ({
  code: 'invalid-bitfield',
  message: `${label} must be a non-negative finite integer between 0 and ${BITFIELD_MAX}.`,
  path,
  severity: 'error',
});

const validateBitfieldNumber = (value: unknown, path: string, label: string): SaveValidationIssue[] => {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > BITFIELD_MAX) {
    return [invalidBitfieldIssue(path, label)];
  }
  return [];
};

const validateBitfieldArray = (value: unknown, path: string, label: string): SaveValidationIssue[] => {
  if (!Array.isArray(value)) {
    return [{ code: 'invalid-bitfield-array', message: `${label} must be an array of bitfield segments.`, path, severity: 'error' }];
  }

  return value.flatMap((segment, index) => validateBitfieldNumber(segment, `${path}[${index}]`, `${label} segment ${index}`));
};

const validateNewsMap = (value: unknown, path: string, label: string): SaveValidationIssue[] => {
  if (!isObjectRecord(value)) {
    return [{ code: 'invalid-bitfield-map', message: `${label} must be an object of category arrays.`, path, severity: 'error' }];
  }

  return Object.entries(value).flatMap(([category, segments]) => {
    if (!Array.isArray(segments)) {
      return [{ code: 'invalid-bitfield-array', message: `${label}.${category} must be an array of 31-bit segments.`, path: `${path}.${category}`, severity: 'error' as const }];
    }
    return segments.flatMap((segment, index) => validateBitfieldNumber(segment, `${path}.${category}[${index}]`, `${label} ${category} segment ${index}`));
  });
};

const collectionValueMatchesType = (value: unknown, type: CollectionValueType): boolean => {
  if (type === 'string') return typeof value === 'string';
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value);
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value));
};

const validateCollection = (value: unknown, definition: CollectionCatalogEntry): SaveValidationIssue[] => {
  if (!Array.isArray(value)) {
    return [{ code: 'invalid-collection', message: `${definition.label} must be an array because upstream serializes its Set as an array.`, path: definition.path, severity: 'error' }];
  }

  const issues: SaveValidationIssue[] = value.flatMap((entry, index) => collectionValueMatchesType(entry, definition.valueType)
    ? []
    : [{ code: 'invalid-collection-entry', message: `${definition.label} entry ${index} has an incompatible type.`, path: `${definition.path}[${index}]`, severity: 'error' as const }]);

  for (const duplicate of getDuplicateCollectionEntries(value)) {
    issues.push({
      code: 'duplicate-collection-entry',
      message: `${definition.label} contains duplicate entry ${String(duplicate)}; it was not removed automatically.`,
      path: definition.path,
      severity: 'warning',
    });
  }

  return issues;
};

const validateGlyphMasks = (saveData: SaveObject): SaveValidationIssue[] => {
  const glyphs = getValueAtPath(saveData, 'reality.glyphs');
  if (glyphs === undefined) return [];
  if (!isObjectRecord(glyphs)) {
    return [{ code: 'invalid-glyph-structure', message: 'reality.glyphs must be an object.', path: 'reality.glyphs', severity: 'error' }];
  }

  const issues: SaveValidationIssue[] = [];
  for (const collectionName of ['active', 'inventory'] as const) {
    const glyphCollection = glyphs[collectionName];
    if (glyphCollection === undefined) continue;
    if (!Array.isArray(glyphCollection)) {
      issues.push({ code: 'invalid-glyph-collection', message: `reality.glyphs.${collectionName} must be an array.`, path: `reality.glyphs.${collectionName}`, severity: 'error' });
      continue;
    }
    for (const [index, glyph] of glyphCollection.entries()) {
      if (!isObjectRecord(glyph) || glyph.effects === undefined) continue;
      issues.push(...validateBitfieldNumber(glyph.effects, `reality.glyphs.${collectionName}[${index}].effects`, `${collectionName} glyph effects`));
    }
  }

  const filter = glyphs.filter;
  if (filter === undefined) return issues;
  if (!isObjectRecord(filter) || !isObjectRecord(filter.types)) {
    issues.push({ code: 'invalid-glyph-filter', message: 'reality.glyphs.filter.types must be an object.', path: 'reality.glyphs.filter.types', severity: 'error' });
    return issues;
  }
  for (const [type, settings] of Object.entries(filter.types)) {
    if (!isObjectRecord(settings) || settings.specifiedMask === undefined) continue;
    issues.push(...validateBitfieldNumber(settings.specifiedMask, `reality.glyphs.filter.types.${type}.specifiedMask`, `${type} glyph filter`));
  }
  return issues;
};

export const validateBitfieldCollections = (saveData: SaveObject): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];

  for (const definition of bitfieldCatalog) {
    const value = getValueAtPath(saveData, definition.path);
    if (value === undefined || value === null) continue;
    if (definition.shape === 'number') issues.push(...validateBitfieldNumber(value, definition.path, definition.label));
    if (definition.shape === 'array') issues.push(...validateBitfieldArray(value, definition.path, definition.label));
    if (definition.shape === 'map') issues.push(...validateNewsMap(value, definition.path, definition.label));
  }

  for (const definition of collectionCatalog) {
    const value = getValueAtPath(saveData, definition.path);
    if (value !== undefined && value !== null) issues.push(...validateCollection(value, definition));
  }

  issues.push(...validateGlyphMasks(saveData));
  return issues;
};

const glyphEffectDefinitions: Record<string, BitDefinition[]> = {
  time: [
    bit(0, 'Time Dimension power', 'timepow'), bit(1, 'Game speed', 'timespeed'), bit(2, 'Eternity gain', 'timeetermult'), bit(3, 'Eternity Point gain', 'timeEP'), bit(27, 'Time Shard power', 'timeshardpow, explicitly added to Time Glyphs after unlock'),
  ],
  dilation: [
    bit(4, 'Dilated Time gain', 'dilationDT'), bit(5, 'Tachyon Galaxy threshold', 'dilationgalaxyThreshold'), bit(6, 'Time Theorem generation', 'dilationTTgen'), bit(7, 'Dilated Antimatter Dimension power', 'dilationpow'),
  ],
  replication: [
    bit(8, 'Replication speed', 'replicationspeed'), bit(9, 'Replicanti power', 'replicationpow'), bit(10, 'Dilated Time from Replicanti', 'replicationdtgain'), bit(11, 'Replicanti Glyph level', 'replicationglyphlevel'),
  ],
  infinity: [
    bit(12, 'Infinity Dimension power', 'infinitypow'), bit(13, 'Infinity Power conversion', 'infinityrate'), bit(14, 'Infinity Point gain', 'infinityIP'), bit(15, 'Infinity gain', 'infinityinfmult'),
  ],
  power: [
    bit(16, 'Antimatter Dimension power', 'powerpow'), bit(17, 'Antimatter Dimension multiplier', 'powermult'), bit(18, 'Dimension Boost multiplier', 'powerdimboost'), bit(19, 'Buy-10 multiplier', 'powerbuy10'),
  ],
  effarig: [
    bit(20, 'Reality Machine multiplier', 'effarigrm'), bit(21, 'Glyph Instability delay', 'effarigglyph'), bit(22, 'Game speed power', 'effarigblackhole'), bit(23, 'Achievement multiplier power', 'effarigachievement'), bit(24, 'Buy-10 multiplier power', 'effarigforgotten'), bit(25, 'All Dimension power', 'effarigdimensions'), bit(26, 'Antimatter exponent power', 'effarigantimatter'),
  ],
  cursed: [bit(0, 'Galaxy strength penalty', 'cursedgalaxies'), bit(1, 'Dimension power penalty', 'curseddimensions'), bit(2, 'Tickspeed threshold', 'cursedtickspeed'), bit(3, 'Eternity Point penalty', 'cursedEP')],
  reality: [bit(4, 'Basic Glyph level', 'realityglyphlevel'), bit(5, 'Galaxy strength', 'realitygalaxies'), bit(6, 'Reality amplifier power', 'realityrow1pow'), bit(7, 'Dilated Time Glyph level power', 'realityDTglyph')],
  companion: [bit(8, 'Companion happiness', 'companiondescription'), bit(9, 'First-Reality Eternity Points', 'companionEP')],
};

export const getGlyphEffectDefinitions = (glyphType: string): BitDefinition[] => glyphEffectDefinitions[glyphType] ?? [];

export const getGlyphBitfieldTargets = (saveData: SaveObject): GlyphMaskTarget[] => {
  const glyphs = getValueAtPath(saveData, 'reality.glyphs');
  if (!isObjectRecord(glyphs)) return [];
  const targets: GlyphMaskTarget[] = [];

  for (const collectionName of ['active', 'inventory'] as const) {
    const glyphCollection = glyphs[collectionName];
    if (!Array.isArray(glyphCollection)) continue;
    for (const [index, glyph] of glyphCollection.entries()) {
      if (!isObjectRecord(glyph) || typeof glyph.type !== 'string' || glyph.effects === undefined) continue;
      targets.push({
        path: `reality.glyphs.${collectionName}[${index}].effects`,
        label: `${collectionName === 'active' ? 'Active' : 'Inventory'} glyph ${index + 1} effects`,
        glyphType: glyph.type,
        kind: 'effects',
        value: glyph.effects,
        knownBits: getGlyphEffectDefinitions(glyph.type),
      });
    }
  }

  const filter = glyphs.filter;
  if (isObjectRecord(filter) && isObjectRecord(filter.types)) {
    for (const [type, settings] of Object.entries(filter.types)) {
      if (!isObjectRecord(settings) || settings.specifiedMask === undefined) continue;
      targets.push({
        path: `reality.glyphs.filter.types.${type}.specifiedMask`,
        label: `${type} glyph filter`,
        glyphType: type,
        kind: 'specifiedMask',
        value: settings.specifiedMask,
        knownBits: getGlyphEffectDefinitions(type),
      });
    }
  }
  return targets;
};
