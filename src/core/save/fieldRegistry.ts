import { getValueAtPath, hasPath } from '../document/path';
import {
  BigNumberLike,
  DocumentPath,
  SaveDataRecord,
  SaveType,
  SaveValidationIssue,
} from './types';

export type SaveFieldKind = 'big-number' | 'number' | 'integer' | 'boolean';

export interface SaveFieldRule {
  required?: boolean;
  minimum?: number;
  maximum?: number;
  integer?: boolean;
}

export interface SaveFieldDefinition {
  id: string;
  label: string;
  description: string;
  group: string;
  kind: SaveFieldKind;
  path?: DocumentPath;
  platformPath?: Partial<Record<SaveType, DocumentPath>>;
  platformKinds?: Partial<Record<SaveType, SaveFieldKind>>;
  nativePaths: Record<SaveType, DocumentPath[]>;
  rule?: SaveFieldRule;
  validationRule?: SaveFieldRule;
  platformRules?: Partial<Record<SaveType, SaveFieldRule>>;
  parser?: (value: string, saveType: SaveType) => unknown;
}

export interface SaveFieldSectionDefinition {
  id: string;
  title: string;
  description: string;
  fields: SaveFieldDefinition[];
}

const buildField = (field: SaveFieldDefinition): SaveFieldDefinition => ({
  ...field,
  path: field.path ?? field.nativePaths[SaveType.PC][0],
  platformPath: field.platformPath ?? {
    [SaveType.PC]: field.nativePaths[SaveType.PC][0],
    [SaveType.Android]: field.nativePaths[SaveType.Android][0],
  },
  validationRule: field.validationRule ?? field.rule,
});

export const saveEditorSections: SaveFieldSectionDefinition[] = [
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
        description: 'Current number of dimension boosts.',
        group: 'overview',
        kind: 'integer',
        nativePaths: {
          [SaveType.PC]: ['dimensionBoosts'],
          [SaveType.Android]: ['dimensionBoosts'],
        },
        rule: { required: true, minimum: 0, integer: true },
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
    ],
  },
];

export const saveEditorFields = saveEditorSections.flatMap((section) => section.fields);

const bigNumberPattern = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i;

export const isBigNumberLike = (value: unknown): value is BigNumberLike => {
  return typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value;
};

export const getCandidatePaths = (field: SaveFieldDefinition, saveType: SaveType): DocumentPath[] => {
  return field.nativePaths[saveType];
};

const getFieldKind = (field: SaveFieldDefinition, saveType: SaveType): SaveFieldKind => {
  return field.platformKinds?.[saveType] ?? field.kind;
};

const getFieldRule = (field: SaveFieldDefinition, saveType: SaveType): SaveFieldRule | undefined => {
  return field.platformRules?.[saveType] ?? field.rule;
};

export const resolveFieldPath = (
  saveData: SaveDataRecord,
  field: SaveFieldDefinition,
  saveType: SaveType
): DocumentPath => {
  const candidates = getCandidatePaths(field, saveType);
  return candidates.find((candidate) => hasPath(saveData, candidate)) ?? candidates[0];
};

export const readFieldValue = (
  saveData: SaveDataRecord,
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
    return Number.isFinite(value);
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
      severity: 'warning',
    });
    return issues;
  }

  if (kind === 'boolean' && typeof value !== 'boolean') {
    issues.push({
      code: 'invalid-boolean',
      message: `${field.label} must be a boolean.`,
      path: resolvedPath,
      severity: 'warning',
    });
    return issues;
  }

  if ((kind === 'number' || kind === 'integer') && typeof value !== 'number') {
    issues.push({
      code: 'invalid-number',
      message: `${field.label} must be a number.`,
      path: resolvedPath,
      severity: 'warning',
    });
    return issues;
  }

  if ((kind === 'number' || kind === 'integer') && typeof value === 'number') {
    if (rule?.integer && !Number.isInteger(value)) {
      issues.push({
        code: 'integer-required',
        message: `${field.label} must be an integer.`,
        path: resolvedPath,
        severity: 'warning',
      });
    }

    if (rule?.minimum !== undefined && value < rule.minimum) {
      issues.push({
        code: 'minimum-value',
        message: `${field.label} must be at least ${rule.minimum}.`,
        path: resolvedPath,
        severity: 'warning',
      });
    }

    if (rule?.maximum !== undefined && value > rule.maximum) {
      issues.push({
        code: 'maximum-value',
        message: `${field.label} must be at most ${rule.maximum}.`,
        path: resolvedPath,
        severity: 'warning',
      });
    }
  }

  return issues;
};

export const validateRegisteredFields = (
  saveData: SaveDataRecord,
  saveType: SaveType
): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];

  for (const field of saveEditorFields) {
    const path = resolveFieldPath(saveData, field, saveType);
    const value = readFieldValue(saveData, field, saveType);
    issues.push(...validateFieldValue(field, value, path, saveType));
  }

  return issues;
};
