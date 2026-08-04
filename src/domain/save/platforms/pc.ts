import { SavePlatformAdapter, SavePlatformCatalogField, createSavePlatformAdapter } from './adapter';
import { SaveType } from '../model';

export const createPcSavePlatformAdapter = (
  fields: readonly SavePlatformCatalogField[],
): SavePlatformAdapter => createSavePlatformAdapter(
  SaveType.PC,
  fields,
  {
    transportVersions: ['legacy', 'AAA', 'AAB'],
    supportsBitfields: true,
    supportsCollections: true,
    supportsSetTransport: true,
    compatibility: 'fixture-transport',
  },
);
