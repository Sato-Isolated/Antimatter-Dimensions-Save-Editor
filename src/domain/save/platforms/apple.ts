import { SavePlatformAdapter, SavePlatformCatalogField, createSavePlatformAdapter } from './adapter';
import { mobileSaveAliases } from './mobile';
import { SaveType } from '../model';

export const createAppleSavePlatformAdapter = (
  fields: readonly SavePlatformCatalogField[],
): SavePlatformAdapter => createSavePlatformAdapter(
  SaveType.Apple,
  fields,
  {
    transportVersions: ['AAA'],
    supportsBitfields: true,
    supportsCollections: true,
    supportsSetTransport: true,
    compatibility: 'fixture-transport',
  },
  mobileSaveAliases,
);
