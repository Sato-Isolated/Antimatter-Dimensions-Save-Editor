import { describe, expect, it } from 'vitest';
import {
  readFieldValue,
  resolveFieldPath,
  saveEditorFields,
  validateRegisteredFields,
} from './fieldRegistry';
import { SaveType } from './types';

const breakInfinityField = saveEditorFields.find((field) => field.id === 'breakInfinity');
const replicantiChanceField = saveEditorFields.find((field) => field.id === 'replicantiChance');
const replicantiIntervalField = saveEditorFields.find((field) => field.id === 'replicantiInterval');

describe('field registry', () => {
  it('resolves Android-native paths through the central adapter', () => {
    const androidSave = {
      antimatter: { mantissa: 1, exponent: 3 },
      matter: { mantissa: 0, exponent: 0 },
      dimensionBoosts: 0,
      galaxies: 0,
      brake: false,
      version: 30100100,
      lastUpdate: 1744164003113,
    };

    expect(breakInfinityField).toBeDefined();
    expect(resolveFieldPath(androidSave, breakInfinityField!, SaveType.Android)).toBe('brake');
    expect(readFieldValue(androidSave, breakInfinityField!, SaveType.Android)).toBe(false);
  });

  it('reports declarative validation issues for invalid registered values', () => {
    const invalidPcSave = {
      antimatter: '10',
      matter: '0',
      dimensionBoosts: -2,
      galaxies: 0,
      break: false,
      version: -1,
      lastUpdate: 1700000000000,
    };

    const issues = validateRegisteredFields(invalidPcSave, SaveType.PC);
    const codes = issues.map((issue) => issue.code);

    expect(codes).toContain('minimum-value');
    expect(issues.some((issue) => issue.path === 'dimensionBoosts')).toBe(true);
    expect(issues.some((issue) => issue.path === 'version')).toBe(true);
  });

  it('uses Android-specific replicanti upgrade paths and rules', () => {
    const androidSave = {
      replicanti: {
        unl: false,
        amount: { mantissa: 0, exponent: 0 },
        chanceUpgrades: 3,
        intervalUpgrades: 5,
        galaxies: 1,
      },
    };

    expect(replicantiChanceField).toBeDefined();
    expect(replicantiIntervalField).toBeDefined();
    expect(resolveFieldPath(androidSave, replicantiChanceField!, SaveType.Android)).toBe('replicanti.chanceUpgrades');
    expect(readFieldValue(androidSave, replicantiChanceField!, SaveType.Android)).toBe(3);
    expect(resolveFieldPath(androidSave, replicantiIntervalField!, SaveType.Android)).toBe('replicanti.intervalUpgrades');
    expect(readFieldValue(androidSave, replicantiIntervalField!, SaveType.Android)).toBe(5);

    const issues = validateRegisteredFields({
      antimatter: { mantissa: 1, exponent: 3 },
      matter: { mantissa: 0, exponent: 0 },
      dimensionBoosts: 0,
      galaxies: 0,
      brake: false,
      version: 30100100,
      lastUpdate: 1744164003113,
      infinityPoints: { mantissa: 0, exponent: 0 },
      infinities: { mantissa: 0, exponent: 0 },
      infinityPower: { mantissa: 0, exponent: 0 },
      eternityPoints: { mantissa: 0, exponent: 0 },
      eternities: { mantissa: 0, exponent: 0 },
      timeShards: { mantissa: 0, exponent: 0 },
      realities: { mantissa: 0, exponent: 0 },
      reality: {
        realityMachines: { mantissa: 0, exponent: 0 },
        imaginaryMachines: 0,
      },
      replicanti: {
        unl: false,
        amount: { mantissa: 0, exponent: 0 },
        chanceUpgrades: 3,
        intervalUpgrades: 5,
        galaxies: 0,
      },
      auto: {
        bigCrunch: { isActive: false, amount: { mantissa: 0, exponent: 0 } },
        galaxy: { isActive: false, maxGalaxies: 0 },
        dimBoost: { isActive: false, maxDimBoosts: 0 },
      },
      dilation: { active: false, tachyonParticles: { mantissa: 0, exponent: 0 }, dilatedTime: { mantissa: 0, exponent: 0 } },
    }, SaveType.Android);

    expect(issues.some((issue) => issue.path === 'replicanti.chanceUpgrades')).toBe(false);
    expect(issues.some((issue) => issue.path === 'replicanti.intervalUpgrades')).toBe(false);
  });

  it('derives normalized metadata for every registered field', () => {
    for (const field of saveEditorFields) {
      expect(field.path, field.id).toBe(field.nativePaths[SaveType.PC][0]);
      expect(field.platformPath?.[SaveType.PC], field.id).toBe(field.nativePaths[SaveType.PC][0]);
      expect(field.platformPath?.[SaveType.Android], field.id).toBe(field.nativePaths[SaveType.Android][0]);
      expect(field.validationRule, field.id).toBe(field.rule);
    }
  });
});
