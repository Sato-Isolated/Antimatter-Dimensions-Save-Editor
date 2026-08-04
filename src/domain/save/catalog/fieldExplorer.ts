import { getFieldDefinitionForPath } from './fields';
import { getValueAtPath } from '../document/path';
import { DocumentPath, JsonValue, SaveObject, SaveType, SaveValidationIssue } from '../model';

export type DiscoveredSaveFieldKind = 'number' | 'boolean' | 'string' | 'null' | 'object' | 'array';

export interface DiscoveredSaveField {
  path: DocumentPath;
  label: string;
  group: string;
  description: string;
  kind: DiscoveredSaveFieldKind;
  value: JsonValue;
  registered: boolean;
}

const domainLabels: Record<string, string> = {
  antimatter: 'Core resources',
  dimensions: 'Dimensions',
  challenge: 'Challenges',
  infinity: 'Infinity',
  auto: 'Automation',
  news: 'News',
  records: 'Records',
  speedrun: 'Speedrun',
  replicanti: 'Replicanti',
  timestudy: 'Time studies',
  eternity: 'Eternity',
  eternityChalls: 'Eternity challenges',
  dilation: 'Dilation',
  reality: 'Reality',
  blackHole: 'Black holes',
  celestials: 'Celestials',
  options: 'Options',
  IAP: 'Purchases',
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const getDiscoveredSaveFieldKind = (value: unknown): DiscoveredSaveFieldKind => {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'object') {
    return 'object';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'string') {
    return 'string';
  }

  return 'null';
};

const getTopLevelKey = (path: DocumentPath): string => {
  const firstToken = path.match(/^[^.\[]+/u)?.[0];
  return firstToken ?? path;
};

const humanizeKey = (key: string): string => {
  const normalized = key
    .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/gu, '$1 $2')
    .replace(/[_-]+/gu, ' ')
    .trim();

  if (!normalized) {
    return key;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getPathLabel = (path: DocumentPath): string => {
  const arrayMatch = path.match(/\[(\d+)\]$/u);
  if (arrayMatch) {
    return `Item ${Number.parseInt(arrayMatch[1], 10) + 1}`;
  }

  const key = path.split('.').pop() ?? path;
  return humanizeKey(key);
};

const getGroupLabel = (path: DocumentPath): string => {
  const topLevelKey = getTopLevelKey(path);
  return domainLabels[topLevelKey] ?? humanizeKey(topLevelKey);
};

const getExactRegisteredDefinition = (path: DocumentPath, saveType: SaveType) => {
  return getFieldDefinitionForPath(path, saveType);
};

const pushField = (
  fields: DiscoveredSaveField[],
  path: DocumentPath,
  value: unknown,
  saveType: SaveType,
): void => {
  if (!path) {
    return;
  }

  const registeredDefinition = getExactRegisteredDefinition(path, saveType);

  fields.push({
    path,
    label: getPathLabel(path),
    group: getGroupLabel(path),
    description: registeredDefinition?.description
      ?? `Inferred from the loaded document; upstream player data is addressed as player.${path}.`,
    kind: getDiscoveredSaveFieldKind(value),
    value: value as JsonValue,
    registered: Boolean(registeredDefinition),
  });
};

const walkSaveValue = (
  value: unknown,
  path: DocumentPath,
  saveType: SaveType,
  fields: DiscoveredSaveField[],
): void => {
  if (Array.isArray(value)) {
    pushField(fields, path, value, saveType);

    if (value.length === 0) {
      return;
    }

    value.forEach((entry, index) => {
      walkSaveValue(entry, `${path}[${index}]`, saveType, fields);
    });
    return;
  }

  if (isRecord(value)) {
    pushField(fields, path, value, saveType);
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return;
    }

    entries.forEach(([key, entry]) => {
      walkSaveValue(entry, path ? `${path}.${key}` : key, saveType, fields);
    });
    return;
  }

  pushField(fields, path, value, saveType);
};

export const collectDiscoveredSaveFields = (
  saveData: SaveObject,
  saveType: SaveType,
): DiscoveredSaveField[] => {
  const fields: DiscoveredSaveField[] = [];
  walkSaveValue(saveData, '', saveType, fields);
  return fields.sort((left, right) => left.path.localeCompare(right.path, undefined, { numeric: true }));
};

export const isCompositeSaveField = (field: DiscoveredSaveField): boolean => {
  return field.kind === 'array' || field.kind === 'object';
};

export const validateDiscoveredSaveFields = (
  workingData: SaveObject,
  baselineData: SaveObject,
  saveType: SaveType,
): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];

  for (const baselineField of collectDiscoveredSaveFields(baselineData, saveType)) {
    const currentValue = getValueAtPath(workingData, baselineField.path);
    if (currentValue === undefined || baselineField.kind === 'null') {
      continue;
    }

    const currentKind = getDiscoveredSaveFieldKind(currentValue);
    if (currentKind === baselineField.kind) {
      continue;
    }

    issues.push({
      code: 'discovered-type-mismatch',
      message: `${baselineField.path} must remain a ${baselineField.kind} value (received ${currentKind}).`,
      path: baselineField.path,
      severity: 'error',
    });
  }

  return issues;
};

export const getDiscoveredFieldKindLabel = (kind: DiscoveredSaveFieldKind): string => {
  switch (kind) {
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    case 'null':
      return 'null';
    default:
      return kind;
  }
};
