import { hasPath } from '../document/path';
import { DocumentPath, SaveObject, SaveType } from '../model';

export interface SavePlatformCapabilities {
  readonly transportVersions: readonly string[];
  readonly supportsBitfields: boolean;
  readonly supportsCollections: boolean;
  readonly supportsSetTransport: boolean;
  readonly compatibility: 'fixture-transport' | 'live-verified';
}

export interface SavePlatformCatalogField {
  readonly id: string;
  readonly paths: readonly DocumentPath[];
}

export interface SavePlatformAdapter {
  readonly type: SaveType;
  readonly capabilities: SavePlatformCapabilities;
  readonly supportedFieldIds: ReadonlySet<string>;
  readonly aliases: ReadonlyMap<string, readonly DocumentPath[]>;
  getFieldPaths(fieldId: string, declaredPaths: readonly DocumentPath[]): readonly DocumentPath[];
  resolveFieldPath(
    data: SaveObject,
    fieldId: string,
    declaredPaths: readonly DocumentPath[],
  ): DocumentPath;
  supportsField(fieldId: string): boolean;
}

export const createSavePlatformAdapter = (
  type: SaveType,
  fields: readonly SavePlatformCatalogField[],
  capabilities: SavePlatformCapabilities,
  aliases: Readonly<Record<string, readonly DocumentPath[]>> = {},
): SavePlatformAdapter => {
  const supportedFieldIds = new Set(fields.map((field) => field.id));
  const aliasMap = new Map(Object.entries(aliases));

  return {
    type,
    capabilities,
    supportedFieldIds,
    aliases: aliasMap,
    getFieldPaths: (fieldId, declaredPaths) => {
      const paths = [...declaredPaths, ...(aliasMap.get(fieldId) ?? [])];
      return [...new Set(paths)];
    },
    resolveFieldPath: (data, fieldId, declaredPaths) => {
      const paths = [...declaredPaths, ...(aliasMap.get(fieldId) ?? [])];
      return paths.find((path) => hasPath(data, path)) ?? paths[0] ?? '';
    },
    supportsField: (fieldId) => supportedFieldIds.has(fieldId),
  };
};
