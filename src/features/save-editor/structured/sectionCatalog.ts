import type { ComponentType } from 'react';
import { bitfieldCatalog, collectionCatalog } from '../../../domain/save/catalog/bitfields';
import { getFieldDefinition } from '../../../domain/save/catalog/fields';
import { SaveType } from '../../../domain/save/model';
import SaveFieldExplorerSection from './sections/SaveFieldExplorerSection';
import AutoBuyersSection from './sections/AutoBuyersSection';
import AutomatorSection from './sections/AutomatorSection';
import BitsCollectionsSection from './sections/BitsCollectionsSection';
import BlackHolesSection from './sections/BlackHolesSection';
import CelestialsSection from './sections/CelestialsSection';
import ChallengesSection from './sections/ChallengesSection';
import DilationSection from './sections/DilationSection';
import DimensionsSection from './sections/DimensionsSection';
import EternitySection from './sections/EternitySection';
import GeneralSection from './sections/GeneralSection';
import GlyphsSection from './sections/GlyphsSection';
import InfinitySection from './sections/InfinitySection';
import RealitySection from './sections/RealitySection';
import RecordsSection from './sections/RecordsSection';
import ReplicantiSection from './sections/ReplicantiSection';
import SettingsSection from './sections/SettingsSection';
import type { SectionProps } from './sections/types';

export type StructuredSectionGroup = 'Progression' | 'Systems' | 'History & options';

export interface StructuredSectionDefinition {
  readonly id: string;
  readonly group: StructuredSectionGroup;
  readonly title: string;
  readonly description: string;
  readonly Component: ComponentType<SectionProps>;
  readonly issuePrefixes: readonly string[];
}

export const structuredSectionGroups: readonly StructuredSectionGroup[] = [
  'Progression',
  'Systems',
  'History & options',
];

const catalogEntryPrefixes = (entryId: string, declaredPath: string): string[] => {
  const field = getFieldDefinition(entryId);
  if (!field) return [declaredPath];

  return [...new Set([
    ...field.nativePaths[SaveType.PC],
    ...field.nativePaths[SaveType.Android],
    ...field.nativePaths[SaveType.Apple],
  ])];
};

const bitsCollectionsIssuePrefixes = [
  ...bitfieldCatalog.filter((field) => !field.dedicatedSectionId).flatMap((field) => catalogEntryPrefixes(field.id, field.path)),
  ...collectionCatalog.filter((field) => !field.dedicatedSectionId).flatMap((field) => catalogEntryPrefixes(field.id, field.path)),
  'dilation.upgradeBits',
  'eternityUpgradeBits',
];

/** The single source of truth for structured-editor order, labels and issue routing. */
export const structuredSectionCatalog: readonly StructuredSectionDefinition[] = [
  {
    id: 'general',
    group: 'Progression',
    title: 'General',
    description: 'Core progression, currencies, and top-level save values.',
    Component: GeneralSection,
    issuePrefixes: [
      'antimatter', 'matter', 'buyUntil10', 'break', 'brake', 'dimensionBoosts', 'galaxies',
      'sacrificed', 'version', 'partInfinityPoint', 'partInfinitied', 'totalTickGained', 'totalTickBought',
    ],
  },
  {
    id: 'bits-collections',
    group: 'Systems',
    title: 'Bits & collections',
    description: 'Upstream bitfields, masks, and Set-backed collections with unknown-value preservation.',
    Component: BitsCollectionsSection,
    issuePrefixes: bitsCollectionsIssuePrefixes,
  },
  {
    id: 'dimensions',
    group: 'Progression',
    title: 'Dimensions',
    description: 'The three upstream dimension families: Antimatter, Infinity, and Time.',
    Component: DimensionsSection,
    issuePrefixes: ['dimensions.antimatter', 'dimensions.infinity', 'dimensions.time'],
  },
  {
    id: 'replicanti',
    group: 'Progression',
    title: 'Replicanti',
    description: 'Replicanti settings, upgrades, and galaxy growth.',
    Component: ReplicantiSection,
    issuePrefixes: ['replicanti'],
  },
  {
    id: 'infinity',
    group: 'Progression',
    title: 'Infinity',
    description: 'Infinity resources, upgrades, and related progression.',
    Component: InfinitySection,
    issuePrefixes: ['infinity', 'infinityPoints', 'infinities', 'infinitiesBanked', 'infinityPower', 'IPMultPurchases', 'infinityUpgrades', 'infinityRebuyables', 'infinityUpgradeBits', 'infMult', 'autoIP', 'bestInfinityTime', 'thisInfinityTime'],
  },
  {
    id: 'eternity',
    group: 'Progression',
    title: 'Eternity',
    description: 'Eternity currencies, studies, and related progression.',
    Component: EternitySection,
    issuePrefixes: ['eternity', 'eternityPoints', 'eternities', 'timeShards', 'timeDimension', 'timestudy'],
  },
  {
    id: 'dilation',
    group: 'Progression',
    title: 'Dilation',
    description: 'Time dilation resources, upgrades, and rebuyables.',
    Component: DilationSection,
    issuePrefixes: ['dilation', 'dilatedTime', 'tachyonParticles'],
  },
  {
    id: 'reality',
    group: 'Progression',
    title: 'Reality',
    description: 'Reality progression, machines, perks, and reset settings.',
    Component: RealitySection,
    issuePrefixes: [
      'realities', 'partSimulatedReality', 'reality.partSimulated', 'reality.realityMachines',
      'reality.imaginaryMachines', 'reality.iMCap', 'reality.seed', 'reality.secondGaussian',
      'reality.musicSeed', 'reality.musicSecondGaussian', 'reality.rebuyables', 'reality.upgradeBits',
      'reality.upgReqs', 'reality.upgradeRequirementBits', 'reality.reqLock', 'reality.imaginaryUpgradeBits',
      'reality.imaginaryRequirementBits', 'reality.imaginaryRebuyables', 'reality.perks', 'reality.respec',
      'reality.showGlyphSacrifice', 'reality.showSidebarPanel', 'reality.autoSort', 'reality.autoCollapse',
      'reality.autoAutoClean', 'reality.applyFilterToPurge', 'reality.moveGlyphsOnProtection',
      'reality.perkPoints', 'reality.autoEC', 'reality.lastAutoEC', 'reality.partEternitied',
      'reality.autoAchieve', 'reality.gainedAutoAchievements', 'reality.achTimer', 'reality.unlockedEC',
    ],
  },
  {
    id: 'automator',
    group: 'Systems',
    title: 'Automator',
    description: 'In-game scripts, constants, execution state, and command reference.',
    Component: AutomatorSection,
    issuePrefixes: ['reality.automator'],
  },
  {
    id: 'glyphs',
    group: 'Systems',
    title: 'Glyphs',
    description: 'Glyph inventory, filter state, and sacrifice progress.',
    Component: GlyphsSection,
    issuePrefixes: ['glyphs', 'reality.glyphs', 'sac'],
  },
  {
    id: 'celestials',
    group: 'Systems',
    title: 'Celestials',
    description: 'Celestial progression, unlocks, and run-specific data.',
    Component: CelestialsSection,
    issuePrefixes: ['celestials'],
  },
  {
    id: 'black-holes',
    group: 'Systems',
    title: 'Black Holes',
    description: 'Black hole upgrades, intervals, and state.',
    Component: BlackHolesSection,
    issuePrefixes: ['blackHole', 'blackHolePause', 'reality.blackHoleBits'],
  },
  {
    id: 'challenges',
    group: 'Systems',
    title: 'Challenges',
    description: 'Normal, Infinity, Eternity, and Reality challenge state.',
    Component: ChallengesSection,
    issuePrefixes: ['challenge', 'challenges'],
  },
  {
    id: 'autobuyers',
    group: 'Systems',
    title: 'Autobuyers',
    description: 'Automation toggles, intervals, and purchase settings.',
    Component: AutoBuyersSection,
    issuePrefixes: ['auto', 'autobuyer'],
  },
  {
    id: 'records',
    group: 'History & options',
    title: 'Records',
    description: 'Timers, best runs, and historical milestone records.',
    Component: RecordsSection,
    issuePrefixes: ['records', 'lastTen', 'pastTen', 'recent', 'best'],
  },
  {
    id: 'settings',
    group: 'History & options',
    title: 'Settings',
    description: 'Options, confirmations, UI preferences, and toggles.',
    Component: SettingsSection,
    issuePrefixes: ['options'],
  },
  {
    id: 'all-fields',
    group: 'History & options',
    title: 'All values',
    description: 'Search and edit every value present in the loaded save, including fields without a dedicated control.',
    Component: SaveFieldExplorerSection,
    issuePrefixes: ['*'],
  },
];
