import { SavePlatformAdapter, SavePlatformCatalogField, createSavePlatformAdapter } from './adapter';
import { DocumentPath, SaveType } from '../model';

const androidAliases: Readonly<Record<string, readonly DocumentPath[]>> = {
  // Android's upstream model calls the v14 record arrays pastTen*, while PC
  // uses lastTen* and v25 uses recent*. Keep all known names as candidates.
  recordsRecentInfinities: ['records.pastTenInfinities'],
  recordsRecentEternities: ['records.pastTenEternities'],
  recordsRecentRealities: ['records.pastTenRealities'],
  // Android renames the PC/Web upgReqs field while keeping the same one-bit-per-upgrade model.
  realityUpgradeRequirements: ['reality.upgradeRequirementBits'],
};

export const createAndroidSavePlatformAdapter = (
  fields: readonly SavePlatformCatalogField[],
): SavePlatformAdapter => createSavePlatformAdapter(
  SaveType.Android,
  fields,
  {
    transportVersions: ['AAA'],
    supportsBitfields: true,
    supportsCollections: true,
    supportsSetTransport: true,
    compatibility: 'fixture-transport',
  },
  androidAliases,
);
