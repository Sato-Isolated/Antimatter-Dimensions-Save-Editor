import { getValueAtPath } from '../document/path';
import { createAndroidSavePlatformAdapter } from '../platforms/android';
import { createAppleSavePlatformAdapter } from '../platforms/apple';
import { SavePlatformAdapter } from '../platforms/adapter';
import { createPcSavePlatformAdapter } from '../platforms/pc';
import {
  BigNumberLike,
  DocumentPath,
  SaveObject,
  SaveType,
  SaveValidationIssue,
} from '../model';
import {
  BITFIELD_MAX,
  bitfieldCollectionFieldSpecs,
  validateBitfieldCollections,
} from './bitfields';
import { validateAutomatorSave } from './automator';

export type SaveFieldKind = 'big-number' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'object-or-array' | 'collection';
export type SaveFieldSupport = 'supported' | 'unsupported' | 'discovered';

export interface SaveFieldRule {
  required?: boolean;
  minimum?: number;
  maximum?: number;
  integer?: boolean;
}

export interface SaveFieldDefinition {
  id: string;
  sectionId: string;
  label: string;
  description: string;
  group: string;
  kind: SaveFieldKind;
  platformKinds?: Partial<Record<SaveType, SaveFieldKind>>;
  nativePaths: Record<SaveType, DocumentPath[]>;
  support: Record<SaveType, SaveFieldSupport>;
  rule?: SaveFieldRule;
  platformRules?: Partial<Record<SaveType, SaveFieldRule>>;
  parser?: (value: string, saveType: SaveType) => unknown;
}

export interface SaveFieldGroupDefinition {
  id: string;
  title: string;
  description: string;
  fields: SaveFieldDefinition[];
}

export interface StructuredPathResolution {
  path: DocumentPath;
  registered: boolean;
  exemptionReason?: string;
}

export const discoveredFieldExemptionReason =
  'Loaded-save paths are exposed by the recursive All values explorer with an inferred kind; add a dedicated rule when the upstream shape is stable.';

export const structuredPathExemptions: Array<{ prefix: string; reason: string }> = [
  { prefix: 'dimensions.', reason: 'Dimension controls use indexed paths whose length varies by save version.' },
  { prefix: 'auto.', reason: 'Autobuyer subtrees vary between PC and Android player versions.' },
  { prefix: 'challenge.', reason: 'Challenge bitfields and records are versioned game internals.' },
  { prefix: 'dilation.', reason: 'Dilation subtrees have platform-specific numeric representations.' },
  { prefix: 'eternity.', reason: 'Legacy eternity controls are retained pending a versioned schema split.' },
  { prefix: 'timestudy.', reason: 'Time-study controls are represented by versioned arrays and bitfields.' },
  { prefix: 'replicanti.', reason: 'Replicanti controls have PC/Android path and numeric variants.' },
  { prefix: 'infinity.', reason: 'Infinity subtrees contain versioned bitfields and upgrade arrays.' },
  { prefix: 'reality.', reason: 'Reality controls include dynamic glyph and automator subtrees.' },
  { prefix: 'celestials.', reason: 'Celestial subtrees contain versioned collections and optional fields.' },
  { prefix: 'records.', reason: 'Record entries differ between v14 lastTen and v25 recent arrays.' },
  { prefix: 'options.', reason: 'Options are user-preference data with release-specific additions.' },
  { prefix: 'buyUntil10', reason: 'Legacy top-level option retained until its v25 rule is proven.' },
  { prefix: 'sacrificed', reason: 'Sacrifice has platform-specific numeric representations.' },
  { prefix: 'partInfinityPoint', reason: 'Legacy fractional prestige field retained as an explicit compatibility exemption.' },
  { prefix: 'partInfinitied', reason: 'Legacy fractional prestige field retained as an explicit compatibility exemption.' },
  { prefix: 'tickspeed', reason: 'Tickspeed is represented differently across platform schemas.' },
  { prefix: 'eternityPoints', reason: 'Top-level prestige field is shared but has platform-specific numeric values.' },
  { prefix: 'eternities', reason: 'Top-level prestige field is shared but has platform-specific numeric values.' },
  { prefix: 'timeShards', reason: 'Top-level prestige field is shared but has platform-specific numeric values.' },
  { prefix: 'totalTickGained', reason: 'Legacy tick counter retained until the full v25 record rule is proven.' },
  { prefix: 'totalTickBought', reason: 'Legacy tick counter retained until the full v25 record rule is proven.' },
  { prefix: 'eternityUpgrades', reason: 'Upgrade arrays are versioned and preserved without automatic migration.' },
  { prefix: 'epmultUpgrades', reason: 'Upgrade count is versioned and preserved without automatic migration.' },
  { prefix: 'eternityChalls', reason: 'Challenge collection is versioned and preserved without automatic migration.' },
  { prefix: 'ic2Count', reason: 'Legacy challenge counter retained as an explicit compatibility exemption.' },
  { prefix: 'eterc8', reason: 'Legacy challenge counters retained as explicit compatibility exemptions.' },
  { prefix: 'chall', reason: 'Legacy challenge values retained until per-version rules are proven.' },
  { prefix: 'infinityUpgrades', reason: 'Upgrade arrays are versioned and preserved without automatic migration.' },
  { prefix: 'infinityUpgradeBits', reason: 'Upgrade bitfields are versioned and preserved without automatic migration.' },
  { prefix: 'IPMultPurchases', reason: 'Legacy purchase counter retained as an explicit compatibility exemption.' },
  { prefix: 'partSimulatedReality', reason: 'PC and Android use different partial-reality paths.' },
  { prefix: 'realities', reason: 'Reality count has platform-specific numeric representations.' },
  { prefix: 'break', reason: 'PC/Android use different top-level break-infinity keys.' },
  { prefix: 'brake', reason: 'PC/Android use different top-level break-infinity keys.' },
];

type SaveFieldDefinitionInput = Omit<SaveFieldDefinition, 'sectionId' | 'support' | 'nativePaths'> & {
  sectionId?: string;
  support?: Partial<Record<SaveType, SaveFieldSupport>>;
  nativePaths: {
    [SaveType.PC]: DocumentPath[];
    [SaveType.Android]: DocumentPath[];
    [SaveType.Apple]?: DocumentPath[];
  };
};

const sectionIdByGroup: Readonly<Record<string, string>> = {
  overview: 'general',
  prestige: 'general',
  replicanti: 'replicanti',
  automation: 'autobuyers',
  automator: 'automator',
  dilation: 'dilation',
  challenges: 'challenges',
  'black-holes': 'black-holes',
  glyphs: 'glyphs',
  celestials: 'celestials',
  speedrun: 'records',
  records: 'records',
  'bits-collections': 'bits-collections',
};

/**
 * iOS is a port of the Android save model, so a field's Apple entry mirrors its
 * Android entry unless the field declares an Apple-specific value.
 */
const mirrorAppleFromAndroid = <T,>(
  values: Partial<Record<SaveType, T>> | undefined,
): Partial<Record<SaveType, T>> | undefined => {
  if (!values || values[SaveType.Apple] !== undefined || values[SaveType.Android] === undefined) {
    return values;
  }

  return { ...values, [SaveType.Apple]: values[SaveType.Android] };
};

const buildField = (field: SaveFieldDefinitionInput): SaveFieldDefinition => ({
  ...field,
  sectionId: field.sectionId ?? sectionIdByGroup[field.group] ?? 'all-fields',
  nativePaths: {
    [SaveType.PC]: field.nativePaths[SaveType.PC],
    [SaveType.Android]: field.nativePaths[SaveType.Android],
    [SaveType.Apple]: field.nativePaths[SaveType.Apple] ?? field.nativePaths[SaveType.Android],
  },
  platformKinds: mirrorAppleFromAndroid(field.platformKinds),
  platformRules: mirrorAppleFromAndroid(field.platformRules),
  support: {
    [SaveType.PC]: field.support?.[SaveType.PC] ?? (field.nativePaths[SaveType.PC].length > 0 ? 'supported' : 'unsupported'),
    [SaveType.Android]: field.support?.[SaveType.Android] ?? (field.nativePaths[SaveType.Android].length > 0 ? 'supported' : 'unsupported'),
    [SaveType.Apple]: field.support?.[SaveType.Apple] ??
      ((field.nativePaths[SaveType.Apple] ?? field.nativePaths[SaveType.Android]).length > 0 ? 'supported' : 'unsupported'),
  },
});

export const saveEditorFieldGroups: SaveFieldGroupDefinition[] = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Core progression values shared by PC and Android saves.',
    fields: [
      buildField({
        id: 'antimatter',
        label: 'Antimatter',
        description: 'Main antimatter pool.',
        group: 'overview',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['antimatter'],
          [SaveType.Android]: ['antimatter'],
        },
        rule: { required: true },
      }),
      buildField({
        id: 'matter',
        label: 'Matter',
        description: 'Matter resource used in challenge progress.',
        group: 'overview',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['matter'],
          [SaveType.Android]: ['matter'],
        },
      }),
      buildField({
        id: 'dimensionBoosts',
        label: 'Dimension Boosts',
        description: 'Current dimension boost value; the game floors it when calculating purchased boosts.',
        group: 'overview',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['dimensionBoosts'],
          [SaveType.Android]: ['dimensionBoosts'],
        },
        rule: { required: true, minimum: 0 },
      }),
      buildField({
        id: 'galaxies',
        label: 'Galaxies',
        description: 'Current antimatter galaxies.',
        group: 'overview',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['galaxies'],
          [SaveType.Android]: ['galaxies'],
        },
        rule: { required: true, minimum: 0, integer: true },
      }),
      buildField({
        id: 'breakInfinity',
        label: 'Break Infinity',
        description: 'Whether break infinity is enabled.',
        group: 'overview',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['break'],
          [SaveType.Android]: ['brake'],
        },
      }),
      buildField({
        id: 'version',
        label: 'Version',
        description: 'Save version marker.',
        group: 'overview',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['version'],
          [SaveType.Android]: ['version'],
        },
        rule: { required: true, minimum: 0, integer: true },
      }),
    ],
  },
  {
    id: 'prestige',
    title: 'Prestige',
    description: 'Infinity, eternity and reality values that define progression.',
    fields: [
      buildField({
        id: 'infinityPoints',
        label: 'Infinity Points',
        description: 'Current infinity points.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['infinityPoints'],
          [SaveType.Android]: ['infinityPoints'],
        },
      }),
      buildField({
        id: 'infinities',
        label: 'Infinities',
        description: 'Total infinity count.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['infinities'],
          [SaveType.Android]: ['infinities'],
        },
      }),
      buildField({
        id: 'infinityPower',
        label: 'Infinity Power',
        description: 'Infinity power resource.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['infinityPower'],
          [SaveType.Android]: ['infinityPower'],
        },
      }),
      buildField({
        id: 'eternityPoints',
        label: 'Eternity Points',
        description: 'Current eternity points.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['eternityPoints'],
          [SaveType.Android]: ['eternityPoints'],
        },
      }),
      buildField({
        id: 'eternities',
        label: 'Eternities',
        description: 'Total eternity count.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['eternities'],
          [SaveType.Android]: ['eternities'],
        },
      }),
      buildField({
        id: 'timeShards',
        label: 'Time Shards',
        description: 'Time shard pool.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['timeShards'],
          [SaveType.Android]: ['timeShards'],
        },
      }),
      buildField({
        id: 'realities',
        label: 'Realities',
        description: 'Total reality count.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['realities'],
          [SaveType.Android]: ['realities'],
        },
      }),
      buildField({
        id: 'realityMachines',
        label: 'Reality Machines',
        description: 'Current reality machine pool.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['reality.realityMachines'],
          [SaveType.Android]: ['reality.realityMachines'],
        },
      }),
      buildField({
        id: 'imaginaryMachines',
        label: 'Imaginary Machines',
        description: 'Imaginary machines cap progression.',
        group: 'prestige',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['reality.imaginaryMachines'],
          [SaveType.Android]: ['reality.imaginaryMachines'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'infinitiesBanked',
        sectionId: 'infinity',
        label: 'Banked Infinities',
        description: 'Infinities kept in the bank for later prestige use. PC/Web only in the current fixture schema.',
        group: 'prestige',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['infinitiesBanked'],
          [SaveType.Android]: [],
        },
        support: { [SaveType.Android]: 'unsupported' },
      }),
      buildField({
        id: 'infinityMultiplierPurchases',
        sectionId: 'infinity',
        label: 'Infinity multiplier purchases',
        description: 'Number of purchases of the IP multiplier; each purchase doubles Infinity Points.',
        group: 'prestige',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['IPMultPurchases'],
          [SaveType.Android]: ['ipMultUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'infinityRebuyables',
        sectionId: 'infinity',
        label: 'Break Infinity rebuyable counters',
        description: 'PC/Web array of the three Break Infinity rebuyable purchase counts: Tickspeed scaling, Antimatter Dimension scaling, and passive IP generation.',
        group: 'prestige',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['infinityRebuyables'],
          [SaveType.Android]: [],
        },
        support: { [SaveType.Android]: 'unsupported' },
      }),
    ],
  },
  {
    id: 'replicanti',
    title: 'Replicanti',
    description: 'Replicanti state and growth parameters.',
    fields: [
      buildField({
        id: 'replicantiUnlocked',
        label: 'Replicanti Unlocked',
        description: 'Unlock state for replicanti.',
        group: 'replicanti',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['replicanti.unl'],
          [SaveType.Android]: ['replicanti.unl'],
        },
      }),
      buildField({
        id: 'replicantiAmount',
        label: 'Replicanti Amount',
        description: 'Current replicanti amount.',
        group: 'replicanti',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['replicanti.amount'],
          [SaveType.Android]: ['replicanti.amount'],
        },
      }),
      buildField({
        id: 'replicantiChance',
        label: 'Replicanti Chance',
        description: 'Replication chance on PC, upgrade count on Android.',
        group: 'replicanti',
        kind: 'number',
        platformKinds: {
          [SaveType.Android]: 'integer',
        },
        nativePaths: {
          [SaveType.PC]: ['replicanti.chance'],
          [SaveType.Android]: ['replicanti.chanceUpgrades'],
        },
        rule: { minimum: 0, maximum: 1 },
        platformRules: {
          [SaveType.Android]: { minimum: 0, integer: true },
        },
      }),
      buildField({
        id: 'replicantiInterval',
        label: 'Replicanti Interval',
        description: 'Replication interval on PC, interval upgrade count on Android.',
        group: 'replicanti',
        kind: 'number',
        platformKinds: {
          [SaveType.Android]: 'integer',
        },
        nativePaths: {
          [SaveType.PC]: ['replicanti.interval'],
          [SaveType.Android]: ['replicanti.intervalUpgrades'],
        },
        rule: { minimum: 0 },
        platformRules: {
          [SaveType.Android]: { minimum: 0, integer: true },
        },
      }),
      buildField({
        id: 'replicantiGalaxies',
        label: 'Replicanti Galaxies',
        description: 'Replicanti galaxies spent or gained.',
        group: 'replicanti',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['replicanti.galaxies'],
          [SaveType.Android]: ['replicanti.galaxies'],
        },
        rule: { minimum: 0, integer: true },
      }),
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'High impact autobuyer toggles and thresholds.',
    fields: [
      buildField({
        id: 'autoBigCrunchEnabled',
        label: 'Auto Big Crunch',
        description: 'Enable automatic big crunch.',
        group: 'automation',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['auto.bigCrunch.isActive'],
          [SaveType.Android]: ['auto.bigCrunch.isActive'],
        },
      }),
      buildField({
        id: 'autoBigCrunchAmount',
        label: 'Auto Big Crunch Amount',
        description: 'Target amount for auto big crunch.',
        group: 'automation',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['auto.bigCrunch.amount'],
          [SaveType.Android]: ['auto.bigCrunch.amount'],
        },
      }),
      buildField({
        id: 'autoGalaxyEnabled',
        label: 'Auto Galaxy',
        description: 'Enable automatic galaxy purchases.',
        group: 'automation',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['auto.galaxy.isActive'],
          [SaveType.Android]: ['auto.galaxy.isActive'],
        },
      }),
      buildField({
        id: 'autoGalaxyMax',
        label: 'Galaxy Cap',
        description: 'Maximum galaxies for the auto buyer.',
        group: 'automation',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['auto.galaxy.maxGalaxies'],
          [SaveType.Android]: ['auto.galaxy.maxGalaxies'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'autoDimBoostEnabled',
        label: 'Auto Dimension Boost',
        description: 'Enable automatic dimension boosts.',
        group: 'automation',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['auto.dimBoost.isActive'],
          [SaveType.Android]: ['auto.dimBoost.isActive'],
        },
      }),
      buildField({
        id: 'autoDimBoostMax',
        label: 'Dimension Boost Cap',
        description: 'Maximum dimension boosts for the auto buyer.',
        group: 'automation',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['auto.dimBoost.maxDimBoosts'],
          [SaveType.Android]: ['auto.dimBoost.maxDimBoosts'],
        },
        rule: { minimum: 0, integer: true },
      }),
    ],
  },
  {
    id: 'dilation',
    title: 'Dilation',
    description: 'Dilation state and core resources.',
    fields: [
      buildField({
        id: 'dilationActive',
        label: 'Dilation Active',
        description: 'Current dilation activation flag.',
        group: 'dilation',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['dilation.active'],
          [SaveType.Android]: ['dilation.active'],
        },
      }),
      buildField({
        id: 'tachyonParticles',
        label: 'Tachyon Particles',
        description: 'Current tachyon particle amount.',
        group: 'dilation',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['dilation.tachyonParticles'],
          [SaveType.Android]: ['dilation.tachyonParticles'],
        },
      }),
      buildField({
        id: 'dilatedTime',
        label: 'Dilated Time',
        description: 'Current dilated time amount.',
        group: 'dilation',
        kind: 'big-number',
        nativePaths: {
          [SaveType.PC]: ['dilation.dilatedTime'],
          [SaveType.Android]: ['dilation.dilatedTime'],
        },
      }),
      buildField({
        id: 'dilationRebuyables',
        label: 'Dilation Rebuyable Upgrade Counters',
        description: 'Purchase counts for Dilation rebuyables 1–3 and Pelle-only rebuyables 11–13; Android stores them in a compact array.',
        group: 'dilation',
        kind: 'object-or-array',
        nativePaths: {
          [SaveType.PC]: ['dilation.rebuyables'],
          [SaveType.Android]: ['dilation.rebuyables'],
        },
      }),
    ],
  },
  {
    id: 'upstream-pc',
    title: 'Upstream PC v14-v25',
    description: 'Versioned PC fields introduced or reshaped by the upstream player model.',
    fields: [
      buildField({
        id: 'normalChallengeCurrent',
        label: 'Current Normal Challenge',
        description: 'Currently running Normal Challenge id; zero means none.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.normal.current'],
          [SaveType.Android]: ['challenge.normal.current'],
        },
        rule: { minimum: 0, maximum: 12, integer: true },
      }),
      buildField({
        id: 'normalChallengeCompletedBits',
        label: 'Normal Challenge Completion Bits',
        description: 'Upstream one-based completion bitfield for the twelve Normal Challenges.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.normal.completedBits'],
          [SaveType.Android]: ['challenge.normal.completedBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'normalChallengeBestTimes',
        label: 'Normal Challenge Best Times',
        description: 'Best-time array for Normal Challenges.',
        group: 'challenges',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['challenge.normal.bestTimes'],
          [SaveType.Android]: ['challenge.normal.bestTimes'],
        },
      }),
      buildField({
        id: 'infinityChallengeCurrent',
        label: 'Current Infinity Challenge',
        description: 'Currently running Infinity Challenge id; zero means none.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.infinity.current'],
          [SaveType.Android]: ['challenge.infinity.current'],
        },
        rule: { minimum: 0, maximum: 8, integer: true },
      }),
      buildField({
        id: 'infinityChallengeCompletedBits',
        label: 'Infinity Challenge Completion Bits',
        description: 'Upstream one-based completion bitfield for the eight Infinity Challenges.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.infinity.completedBits'],
          [SaveType.Android]: ['challenge.infinity.completedBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'infinityChallengeBestTimes',
        label: 'Infinity Challenge Best Times',
        description: 'Best-time array for Infinity Challenges.',
        group: 'challenges',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['challenge.infinity.bestTimes'],
          [SaveType.Android]: ['challenge.infinity.bestTimes'],
        },
      }),
      buildField({
        id: 'eternityChallengeCurrent',
        label: 'Current Eternity Challenge',
        description: 'Currently running Eternity Challenge id; zero means none.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.eternity.current'],
          [SaveType.Android]: ['challenge.eternity.current'],
        },
        rule: { minimum: 0, maximum: 12, integer: true },
      }),
      buildField({
        id: 'eternityChallengeUnlocked',
        label: 'Unlocked Eternity Challenge ID',
        description: 'Upstream stores the currently unlocked Eternity Challenge as an id, not a completion bitfield.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.eternity.unlocked'],
          [SaveType.Android]: ['challenge.eternity.unlocked'],
        },
        rule: { minimum: 0, maximum: 12, integer: true },
      }),
      buildField({
        id: 'eternityChallengeRequirementBits',
        label: 'Eternity Challenge Requirement Bits',
        description: 'Upstream one-based requirement bitfield for Eternity Challenge unlock state.',
        group: 'challenges',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['challenge.eternity.requirementBits'],
          [SaveType.Android]: ['challenge.eternity.requirementBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'eternityChallengeCompletions',
        label: 'Eternity Challenge Completions',
        description: 'Per-challenge completion counts: PC/Web uses eternityChalls.eterc1 through eterc12; Android uses challenge.eternity.completions[0..11].',
        group: 'challenges',
        kind: 'object',
        nativePaths: {
          [SaveType.PC]: ['eternityChalls'],
          [SaveType.Android]: ['challenge.eternity.completions'],
        },
        platformKinds: {
          [SaveType.Android]: 'array',
        },
      }),
      buildField({
        id: 'blackHole0Unlocked',
        label: 'Black Hole 1 Unlocked',
        description: 'Unlock flag for the first black hole.',
        group: 'black-holes',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].unlocked'],
          [SaveType.Android]: ['blackHole[0].unlocked'],
        },
      }),
      buildField({
        id: 'blackHole0Phase',
        label: 'Black Hole 1 Phase',
        description: 'Current phase for the first black hole.',
        group: 'black-holes',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].phase'],
          [SaveType.Android]: ['blackHole[0].phase'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'blackHole0Active',
        label: 'Black Hole 1 Active',
        description: 'Active flag for the first black hole.',
        group: 'black-holes',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].active'],
          [SaveType.Android]: ['blackHole[0].active'],
        },
      }),
      buildField({
        id: 'blackHole0Activations',
        label: 'Black Hole 1 Activations',
        description: 'Activation count for the first black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].activations'],
          [SaveType.Android]: ['blackHole[0].activations'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole0Id',
        label: 'Black Hole 1 ID',
        description: 'Stable identifier for the first black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].id'],
          [SaveType.Android]: ['blackHole[0].id'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole0PowerUpgrades',
        label: 'Black Hole 1 Power Upgrades',
        description: 'Power upgrade count for the first black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].powerUpgrades'],
          [SaveType.Android]: ['blackHole[0].powerUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole0IntervalUpgrades',
        label: 'Black Hole 1 Interval Upgrades',
        description: 'Interval upgrade count for the first black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].intervalUpgrades'],
          [SaveType.Android]: ['blackHole[0].intervalUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole0DurationUpgrades',
        label: 'Black Hole 1 Duration Upgrades',
        description: 'Duration upgrade count for the first black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[0].durationUpgrades'],
          [SaveType.Android]: ['blackHole[0].durationUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole1Unlocked',
        label: 'Black Hole 2 Unlocked',
        description: 'Unlock flag for the second black hole.',
        group: 'black-holes',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].unlocked'],
          [SaveType.Android]: ['blackHole[1].unlocked'],
        },
      }),
      buildField({
        id: 'blackHole1Phase',
        label: 'Black Hole 2 Phase',
        description: 'Current phase for the second black hole.',
        group: 'black-holes',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].phase'],
          [SaveType.Android]: ['blackHole[1].phase'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'blackHole1Active',
        label: 'Black Hole 2 Active',
        description: 'Active flag for the second black hole.',
        group: 'black-holes',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].active'],
          [SaveType.Android]: ['blackHole[1].active'],
        },
      }),
      buildField({
        id: 'blackHole1Activations',
        label: 'Black Hole 2 Activations',
        description: 'Activation count for the second black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].activations'],
          [SaveType.Android]: ['blackHole[1].activations'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole1Id',
        label: 'Black Hole 2 ID',
        description: 'Stable identifier for the second black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].id'],
          [SaveType.Android]: ['blackHole[1].id'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole1PowerUpgrades',
        label: 'Black Hole 2 Power Upgrades',
        description: 'Power upgrade count for the second black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].powerUpgrades'],
          [SaveType.Android]: ['blackHole[1].powerUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole1IntervalUpgrades',
        label: 'Black Hole 2 Interval Upgrades',
        description: 'Interval upgrade count for the second black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].intervalUpgrades'],
          [SaveType.Android]: ['blackHole[1].intervalUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHole1DurationUpgrades',
        label: 'Black Hole 2 Duration Upgrades',
        description: 'Duration upgrade count for the second black hole.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHole[1].durationUpgrades'],
          [SaveType.Android]: ['blackHole[1].durationUpgrades'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'blackHolePause',
        label: 'Black Hole Pause',
        description: 'Global black hole pause flag.',
        group: 'black-holes',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['blackHolePause'],
          [SaveType.Android]: ['blackHolePause'],
        },
      }),
      buildField({
        id: 'blackHoleAutoPauseMode',
        label: 'Black Hole Auto Pause Mode',
        description: 'Global black hole auto-pause mode.',
        group: 'black-holes',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['blackHoleAutoPauseMode'],
          [SaveType.Android]: ['blackHoleAutoPauseMode'],
        },
        rule: { minimum: 0, maximum: 2, integer: true },
      }),
      buildField({
        id: 'blackHolePauseTime',
        label: 'Black Hole Pause Time',
        description: 'Global black hole pause timer.',
        group: 'black-holes',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['blackHolePauseTime'],
          [SaveType.Android]: ['blackHolePauseTime'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'blackHoleNegative',
        label: 'Black Hole Negative',
        description: 'Global black hole negative mode.',
        group: 'black-holes',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['blackHoleNegative'],
          [SaveType.Android]: ['blackHoleNegative'],
        },
        rule: { minimum: 1e-300, maximum: 1 },
      }),
      buildField({
        id: 'glyphInventory',
        label: 'Glyph Inventory',
        description: 'Glyph inventory retained by the PC player model.',
        group: 'glyphs',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['reality.glyphs.inventory'],
          [SaveType.Android]: ['reality.glyphs.inventory'],
        },
      }),
      buildField({
        id: 'glyphActive',
        label: 'Active Glyphs',
        description: 'Glyphs currently equipped by the player.',
        group: 'glyphs',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['reality.glyphs.active'],
          [SaveType.Android]: ['reality.glyphs.active'],
        },
      }),
      buildField({
        id: 'glyphProtectedRows',
        label: 'Protected Glyph Rows',
        description: 'Number of glyph inventory rows protected from purge.',
        group: 'glyphs',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.glyphs.protectedRows'],
          [SaveType.Android]: ['reality.glyphs.protectedRows'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'createdRealityGlyph',
        label: 'Created Reality Glyph',
        description: 'Whether the special reality glyph has been created.',
        group: 'glyphs',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['reality.glyphs.createdRealityGlyph'],
          [SaveType.Android]: ['reality.glyphs.createdRealityGlyph'],
        },
      }),
      buildField({
        id: 'automatorExecTimer',
        label: 'Automator Execution Timer',
        description: 'Runtime execution accumulator in milliseconds; the game resets it when Automator execution starts.',
        group: 'automator',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.execTimer'],
          [SaveType.Android]: ['reality.automator.execTimer'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'automatorForceUnlock',
        label: 'Automator Force Unlock',
        description: 'Whether the automator is force-unlocked.',
        group: 'automator',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.forceUnlock'],
          [SaveType.Android]: ['reality.automator.forceUnlock'],
        },
      }),
      buildField({
        id: 'automatorMode',
        label: 'Automator Mode',
        description: 'Persisted Automator execution mode. Current upstream values are paused, running, or single step; a zero value is preserved without normalization.',
        group: 'automator',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.mode'],
          [SaveType.Android]: ['reality.automator.state.mode'],
        },
        rule: { minimum: 0, maximum: 3, integer: true },
      }),
      buildField({
        id: 'automatorTopLevelScript',
        label: 'Automator Top-Level Script',
        description: 'Selected top-level automator script identifier.',
        group: 'automator',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.topLevelScript'],
          [SaveType.Android]: ['reality.automator.state.topLevelScript'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'automatorEditorScript',
        label: 'Automator Editor Script',
        description: 'Script currently selected in the automator editor.',
        group: 'automator',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.editorScript'],
          [SaveType.Android]: ['reality.automator.state.editorScript'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'automatorRepeat',
        label: 'Automator Repeat',
        description: 'Whether the selected script starts again after reaching its end.',
        group: 'automator',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.repeat'],
          [SaveType.Android]: ['reality.automator.state.repeat'],
        },
      }),
      buildField({
        id: 'automatorForceRestart',
        label: 'Automator Force Restart',
        description: 'Whether the automator should restart its script.',
        group: 'automator',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.forceRestart'],
          [SaveType.Android]: ['reality.automator.state.forceRestart'],
        },
      }),
      buildField({
        id: 'automatorFollowExecution',
        label: 'Automator Follow Execution',
        description: 'Whether the editor follows automator execution.',
        group: 'automator',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.state.followExecution'],
          [SaveType.Android]: ['reality.automator.state.followExecution'],
        },
      }),
      buildField({
        id: 'automatorScripts',
        label: 'Automator Scripts',
        description: 'Saved Automator scripts: an ID-keyed object on PC and an array on Android.',
        group: 'automator',
        kind: 'object-or-array',
        platformKinds: {
          [SaveType.PC]: 'object',
          [SaveType.Android]: 'array',
        },
        nativePaths: {
          [SaveType.PC]: ['reality.automator.scripts'],
          [SaveType.Android]: ['reality.automator.scripts'],
        },
      }),
      buildField({
        id: 'automatorConstants',
        label: 'Automator Constants',
        description: 'Named string values referenced by Automator conditions and durations.',
        group: 'automator',
        kind: 'object',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.constants'],
          [SaveType.Android]: ['reality.automator.constants'],
        },
      }),
      buildField({
        id: 'automatorConstantSortOrder',
        label: 'Automator Constant Order',
        description: 'The in-game display order for Automator constants.',
        group: 'automator',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.constantSortOrder'],
          [SaveType.Android]: ['reality.automator.constantSortOrder'],
        },
      }),
      buildField({
        id: 'automatorEditorType',
        label: 'Automator Editor Type',
        description: 'Whether the game opens the script in text mode or block mode.',
        group: 'automator',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.type'],
          [SaveType.Android]: ['reality.automator.type'],
        },
        rule: { minimum: 0, maximum: 1, integer: true },
      }),
      buildField({
        id: 'automatorCurrentInfoPane',
        label: 'Automator Information Panel',
        description: 'The last Automator documentation panel open in the game.',
        group: 'automator',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['reality.automator.currentInfoPane'],
          [SaveType.Android]: ['reality.automator.currentInfoPane'],
        },
        rule: { minimum: 0, maximum: 7, integer: true },
      }),
      buildField({
        id: 'teresaPouredAmount',
        label: 'Teresa Poured Amount',
        description: 'Teresa reality-matter amount poured into the container.',
        group: 'celestials',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['celestials.teresa.pouredAmount'],
          [SaveType.Android]: ['celestials.teresa.pouredAmount'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'effarigRelicShards',
        label: 'Effarig Relic Shards',
        description: 'Effarig relic shards; PC stores a number and Android stores mantissa/exponent data.',
        group: 'celestials',
        kind: 'number',
        platformKinds: {
          [SaveType.Android]: 'big-number',
        },
        nativePaths: {
          [SaveType.PC]: ['celestials.effarig.relicShards'],
          [SaveType.Android]: ['celestials.effarig.relicShards'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'raUnlockBits',
        label: 'Ra Unlock Bits',
        description: 'Ra unlock bit field.',
        group: 'celestials',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['celestials.ra.unlockBits'],
          [SaveType.Android]: ['celestials.ra.unlockBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'raQuoteBits',
        label: 'Ra Quote Bits',
        description: 'Ra quote bit field.',
        group: 'celestials',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['celestials.ra.quoteBits'],
          [SaveType.Android]: ['celestials.ra.quoteBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'raMomentumTime',
        label: 'Ra Momentum Time',
        description: 'Ra momentum time accumulator.',
        group: 'celestials',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['celestials.ra.momentumTime'],
          [SaveType.Android]: ['celestials.ra.momentumTime'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'raCharged',
        label: 'Ra Charged Effects',
        description: 'Charged Ra effects collection.',
        group: 'celestials',
        kind: 'collection',
        nativePaths: {
          [SaveType.PC]: ['celestials.ra.charged'],
          [SaveType.Android]: ['celestials.ra.charged'],
        },
      }),
      buildField({
        id: 'laitelaEntropy',
        label: 'Laitela Entropy',
        description: 'Laitela entropy progress; -1 is the upstream completion sentinel.',
        group: 'celestials',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['celestials.laitela.entropy'],
          [SaveType.Android]: ['celestials.laitela.entropy'],
        },
        rule: { minimum: -1, maximum: 1 },
      }),
      buildField({
        id: 'laitelaSingularities',
        label: 'Laitela Singularities',
        description: 'Laitela singularity count.',
        group: 'celestials',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['celestials.laitela.singularities'],
          [SaveType.Android]: ['celestials.laitela.singularities'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'pelleDoomed',
        label: 'Pelle Doomed',
        description: 'Whether the player is in Pelle doomed mode.',
        group: 'celestials',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['celestials.pelle.doomed'],
          [SaveType.Android]: ['celestials.pelle.doomed'],
        },
      }),
      buildField({
        id: 'pelleRemnants',
        label: 'Pelle Remnants',
        description: 'Pelle remnants resource.',
        group: 'celestials',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['celestials.pelle.remnants'],
          [SaveType.Android]: ['celestials.pelle.remnants'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'pelleQuoteBits',
        label: 'Pelle Quote Bits',
        description: 'Pelle quote bit field.',
        group: 'celestials',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['celestials.pelle.quoteBits'],
          [SaveType.Android]: ['celestials.pelle.quoteBits'],
        },
        rule: { minimum: 0, integer: true },
      }),
      buildField({
        id: 'pelleUpgrades',
        label: 'Pelle Upgrades',
        description: 'Pelle upgrade bit/list representation.',
        group: 'celestials',
        kind: 'collection',
        nativePaths: {
          [SaveType.PC]: ['celestials.pelle.upgrades'],
          [SaveType.Android]: ['celestials.pelle.upgrades'],
        },
      }),
      buildField({
        id: 'speedrunUnlocked',
        label: 'Speedrun Unlocked',
        description: 'Speedrun feature unlock state.',
        group: 'speedrun',
        kind: 'boolean',
        nativePaths: {
          [SaveType.PC]: ['speedrun.isUnlocked'],
          [SaveType.Android]: ['speedrun.isUnlocked'],
        },
      }),
      buildField({
        id: 'speedrunRecords',
        label: 'Speedrun Records',
        description: 'Speedrun records map in v14 saves and an indexed array in v25 saves.',
        group: 'speedrun',
        kind: 'object-or-array',
        nativePaths: {
          [SaveType.PC]: ['speedrun.records'],
          [SaveType.Android]: ['speedrun.records'],
        },
      }),
      buildField({
        id: 'speedrunAchievementTimes',
        label: 'Speedrun Achievement Times',
        description: 'Achievement completion times collected by speedrun mode.',
        group: 'speedrun',
        kind: 'object',
        nativePaths: {
          [SaveType.PC]: ['speedrun.achievementTimes'],
          [SaveType.Android]: ['speedrun.achievementTimes'],
        },
      }),
      buildField({
        id: 'recordsTotalTimePlayed',
        label: 'Total Time Played',
        description: 'Total time played record.',
        group: 'records',
        kind: 'number',
        nativePaths: {
          [SaveType.PC]: ['records.totalTimePlayed'],
          [SaveType.Android]: ['records.totalTimePlayed'],
        },
        rule: { minimum: 0 },
      }),
      buildField({
        id: 'recordsRecentInfinities',
        label: 'Recent Infinities',
        description: 'v25 recent infinity records, with the v14 lastTenInfinities fallback.',
        group: 'records',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['records.recentInfinities', 'records.lastTenInfinities'],
          [SaveType.Android]: ['records.recentInfinities', 'records.lastTenInfinities'],
        },
      }),
      buildField({
        id: 'recordsRecentEternities',
        label: 'Recent Eternities',
        description: 'v25 recent eternity records, with the v14 lastTenEternities fallback.',
        group: 'records',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['records.recentEternities', 'records.lastTenEternities'],
          [SaveType.Android]: ['records.recentEternities', 'records.lastTenEternities'],
        },
      }),
      buildField({
        id: 'recordsRecentRealities',
        label: 'Recent Realities',
        description: 'v25 recent reality records, with the v14 lastTenRealities fallback.',
        group: 'records',
        kind: 'array',
        nativePaths: {
          [SaveType.PC]: ['records.recentRealities', 'records.lastTenRealities'],
          [SaveType.Android]: ['records.recentRealities', 'records.lastTenRealities'],
        },
      }),
    ],
  },
];

const existingStructuredPaths = new Set(
  saveEditorFieldGroups.flatMap((group) => group.fields).flatMap((field) => field.nativePaths[SaveType.PC]),
);

/**
 * Mobile (Android/iOS) names for upstream PC bitfield/collection paths. `kind`
 * is set only where the mobile model replaces a PC Set/array with a bitfield.
 */
const mobileBitfieldOverrides: Readonly<Record<string, { path: DocumentPath; kind?: SaveFieldKind }>> = {
  achievementBits: { path: 'achievements' },
  secretAchievementBits: { path: 'secretAchievements' },
  eternityUpgrades: { path: 'eternityUpgradeBits', kind: 'integer' },
  dilationUpgrades: { path: 'dilation.upgradeBits', kind: 'integer' },
  infinityUpgradeBitsLegacy: { path: 'infinityUpgradeBits', kind: 'integer' },
};

const bitfieldCollectionFields: SaveFieldDefinition[] = bitfieldCollectionFieldSpecs
  .filter((spec) => !existingStructuredPaths.has(spec.path))
  .map((spec) => {
    const override = mobileBitfieldOverrides[spec.id];

    return buildField({
      id: spec.id,
      label: spec.label,
      description: spec.description,
      group: 'bits-collections',
      kind: spec.kind,
      nativePaths: {
        [SaveType.PC]: [spec.path],
        [SaveType.Android]: [override?.path ?? spec.path],
      },
      platformKinds: override?.kind ? { [SaveType.Android]: override.kind } : undefined,
      platformRules: override?.kind ? { [SaveType.Android]: { minimum: 0, integer: true } } : undefined,
      rule: spec.kind === 'integer'
        ? {
          minimum: spec.minimum ?? 0,
          maximum: spec.maximum ?? BITFIELD_MAX,
          integer: spec.integer ?? true,
        }
        : undefined,
    });
  });

export const saveEditorFields = [
  ...saveEditorFieldGroups.flatMap((group) => group.fields),
  ...bitfieldCollectionFields,
] satisfies SaveFieldDefinition[];

const platformCatalogFields = saveEditorFields.map((field) => ({
  id: field.id,
  paths: field.nativePaths[SaveType.PC],
}));

export const savePlatformAdapters: Readonly<Record<SaveType, SavePlatformAdapter>> = {
  [SaveType.PC]: createPcSavePlatformAdapter(platformCatalogFields),
  [SaveType.Android]: createAndroidSavePlatformAdapter(platformCatalogFields),
  [SaveType.Apple]: createAppleSavePlatformAdapter(platformCatalogFields),
};

export const getSavePlatformAdapter = (saveType: SaveType): SavePlatformAdapter => {
  return savePlatformAdapters[saveType];
};

const saveEditorFieldById = new Map(saveEditorFields.map((field) => [field.id, field]));
const saveEditorFieldByPath = new Map<string, SaveFieldDefinition>();

for (const field of saveEditorFields) {
  for (const saveType of [SaveType.PC, SaveType.Android, SaveType.Apple]) {
    for (const path of getSavePlatformAdapter(saveType).getFieldPaths(field.id, field.nativePaths[saveType])) {
      saveEditorFieldByPath.set(`${saveType}:${path}`, field);
    }
  }
}

const bigNumberPattern = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i;

export const isBigNumberLike = (value: unknown): value is BigNumberLike => {
  return typeof value === 'object'
    && value !== null
    && 'mantissa' in value
    && 'exponent' in value
    && typeof value.mantissa === 'number'
    && typeof value.exponent === 'number';
};

export const getCandidatePaths = (field: SaveFieldDefinition, saveType: SaveType): DocumentPath[] => {
  return [...getSavePlatformAdapter(saveType).getFieldPaths(field.id, field.nativePaths[saveType])];
};

const getFieldKind = (field: SaveFieldDefinition, saveType: SaveType): SaveFieldKind => {
  return field.platformKinds?.[saveType] ?? field.kind;
};

const getFieldRule = (field: SaveFieldDefinition, saveType: SaveType): SaveFieldRule | undefined => {
  return field.platformRules?.[saveType] ?? field.rule;
};

export const resolveFieldPath = (
  saveData: SaveObject,
  field: SaveFieldDefinition,
  saveType: SaveType
): DocumentPath => {
  const candidates = getCandidatePaths(field, saveType);
  return getSavePlatformAdapter(saveType).resolveFieldPath(saveData, field.id, candidates);
};

export const getFieldDefinition = (fieldId: string): SaveFieldDefinition | undefined => {
  return saveEditorFieldById.get(fieldId);
};

export const getFieldDefinitionForPath = (
  path: DocumentPath,
  saveType: SaveType,
): SaveFieldDefinition | undefined => {
  return saveEditorFieldByPath.get(`${saveType}:${path}`);
};

export const resolveRegisteredFieldPath = (
  saveData: SaveObject,
  fieldId: string,
  saveType: SaveType,
): DocumentPath => {
  const field = getFieldDefinition(fieldId);
  if (!field) {
    throw new Error(`Unknown structured save field: ${fieldId}`);
  }

  return resolveFieldPath(saveData, field, saveType);
};

export const resolveStructuredEditPath = (
  saveData: SaveObject,
  requestedPath: DocumentPath,
  saveType: SaveType,
): StructuredPathResolution => {
  const field = saveEditorFieldByPath.get(`${saveType}:${requestedPath}`);
  if (field) {
    return {
      path: resolveFieldPath(saveData, field, saveType),
      registered: true,
    };
  }

  return {
    path: requestedPath,
    registered: false,
    exemptionReason: structuredPathExemptions.find(({ prefix }) => requestedPath.startsWith(prefix))?.reason
      ?? discoveredFieldExemptionReason,
  };
};

export const readFieldValue = (
  saveData: SaveObject,
  field: SaveFieldDefinition,
  saveType: SaveType
): unknown => {
  const candidates = getCandidatePaths(field, saveType);

  for (const candidate of candidates) {
    const value = getValueAtPath(saveData, candidate);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const validateBigNumber = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return value === Number.POSITIVE_INFINITY || Number.isFinite(value);
  }

  if (typeof value === 'string') {
    return value === 'Infinity' || bigNumberPattern.test(value.trim());
  }

  if (isBigNumberLike(value)) {
    return Number.isFinite(value.mantissa) && Number.isInteger(value.exponent);
  }

  return false;
};

export const validateFieldValue = (
  field: SaveFieldDefinition,
  value: unknown,
  resolvedPath: DocumentPath,
  saveType: SaveType
): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];
  const rule = getFieldRule(field, saveType);
  const kind = getFieldKind(field, saveType);

  if (value === undefined || value === null || value === '') {
    if (rule?.required) {
      issues.push({
        code: 'required-field',
        message: `${field.label} is required.`,
        path: resolvedPath,
        severity: 'error',
      });
    } else {
      issues.push({
        code: 'optional-field-missing',
        message: `${field.label} is absent in this save version.`,
        path: resolvedPath,
        severity: 'warning',
      });
    }

    return issues;
  }

  if (kind === 'big-number' && !validateBigNumber(value)) {
    issues.push({
      code: 'invalid-big-number',
      message: `${field.label} must be a valid large numeric value.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if (kind === 'boolean' && typeof value !== 'boolean') {
    issues.push({
      code: 'invalid-boolean',
      message: `${field.label} must be a boolean.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if (kind === 'array' && !Array.isArray(value)) {
    issues.push({
      code: 'invalid-array',
      message: `${field.label} must be an array.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if (kind === 'collection' && !Array.isArray(value)) {
    issues.push({
      code: 'invalid-collection',
      message: `${field.label} must be an array because upstream serializes Set values as arrays.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if (kind === 'object' && (typeof value !== 'object' || value === null || Array.isArray(value))) {
    issues.push({
      code: 'invalid-object',
      message: `${field.label} must be an object.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if (kind === 'object-or-array' && (typeof value !== 'object' || value === null)) {
    issues.push({
      code: 'invalid-object-or-array',
      message: `${field.label} must be an object or an array for the supported save version.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if ((kind === 'number' || kind === 'integer') && typeof value !== 'number') {
    issues.push({
      code: 'invalid-number',
      message: `${field.label} must be a number.`,
      path: resolvedPath,
      severity: 'error',
    });
    return issues;
  }

  if ((kind === 'number' || kind === 'integer') && typeof value === 'number') {
    if (!Number.isFinite(value)) {
      issues.push({
        code: 'invalid-number',
        message: `${field.label} must be finite.`,
        path: resolvedPath,
        severity: 'error',
      });
      return issues;
    }

    if (rule?.integer && !Number.isInteger(value)) {
      issues.push({
        code: 'integer-required',
        message: `${field.label} must be an integer.`,
        path: resolvedPath,
        severity: 'error',
      });
    }

    if (rule?.minimum !== undefined && value < rule.minimum) {
      issues.push({
        code: 'minimum-value',
        message: `${field.label} must be at least ${rule.minimum}.`,
        path: resolvedPath,
        severity: 'error',
      });
    }

    if (rule?.maximum !== undefined && value > rule.maximum) {
      issues.push({
        code: 'maximum-value',
        message: `${field.label} must be at most ${rule.maximum}.`,
        path: resolvedPath,
        severity: 'error',
      });
    }
  }

  return issues;
};

export const validateRegisteredFields = (
  saveData: SaveObject,
  saveType: SaveType
): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];

  for (const field of saveEditorFields) {
    const path = resolveFieldPath(saveData, field, saveType);
    const value = readFieldValue(saveData, field, saveType);
    issues.push(...validateFieldValue(field, value, path, saveType));
  }

  // Mobile glyph effect masks exceed the 31-bit model this PC mask validator
  // enforces (tests/fixtures/save/android.json has
  // reality.glyphs.inventory[21..27].effects up to 206158430208), so running
  // it on a mobile save would emit blocking invalid-bitfield issues and make
  // every Android/Apple import fail.
  if (saveType === SaveType.PC) {
    issues.push(...validateBitfieldCollections(saveData));
  }

  issues.push(...validateAutomatorSave(saveData, saveType));

  return issues;
};
