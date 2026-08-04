import { describe, expect, it } from 'vitest';
import {
  readFieldValue,
  resolveRegisteredFieldPath,
  resolveFieldPath,
  saveEditorFields,
  resolveStructuredEditPath,
  validateRegisteredFields,
} from './fields';
import { SaveType } from '../model';

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

  it('resolves the Android Reality requirement-bit alias from the real fixture shape', () => {
    const androidSave = {
      reality: { upgradeRequirementBits: 1048575 },
    };

    expect(resolveRegisteredFieldPath(androidSave, 'realityUpgradeRequirements', SaveType.Android))
      .toBe('reality.upgradeRequirementBits');
    expect(readFieldValue(androidSave, saveEditorFields.find((field) => field.id === 'realityUpgradeRequirements')!, SaveType.Android))
      .toBe(1048575);
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
    expect(issues.filter((issue) => issue.path === 'dimensionBoosts')[0]?.severity).toBe('error');
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

  it('resolves Android upgrade masks and Eternity Challenge completion arrays', () => {
    const androidSave = {
      infinityUpgradeBits: 0,
      eternityUpgradeBits: 6,
      dilation: {
        upgradeBits: 16,
        rebuyables: [2, 3, 4, 0, 1, 0],
      },
      challenge: {
        eternity: {
          current: 0,
          unlocked: 3,
          requirementBits: 0,
          completions: [1, 0, 2],
        },
      },
    };

    const eternityUpgrades = saveEditorFields.find((field) => field.id === 'eternityUpgrades');
    const dilationUpgrades = saveEditorFields.find((field) => field.id === 'dilationUpgrades');
    const infinityUpgrades = saveEditorFields.find((field) => field.id === 'infinityUpgradeBitsLegacy');
    const eternityCompletions = saveEditorFields.find((field) => field.id === 'eternityChallengeCompletions');

    expect(resolveFieldPath(androidSave, eternityUpgrades!, SaveType.Android)).toBe('eternityUpgradeBits');
    expect(readFieldValue(androidSave, eternityUpgrades!, SaveType.Android)).toBe(6);
    expect(resolveFieldPath(androidSave, dilationUpgrades!, SaveType.Android)).toBe('dilation.upgradeBits');
    expect(readFieldValue(androidSave, dilationUpgrades!, SaveType.Android)).toBe(16);
    expect(resolveFieldPath(androidSave, infinityUpgrades!, SaveType.Android)).toBe('infinityUpgradeBits');
    expect(readFieldValue(androidSave, infinityUpgrades!, SaveType.Android)).toBe(0);
    expect(resolveFieldPath(androidSave, eternityCompletions!, SaveType.Android)).toBe('challenge.eternity.completions');
    expect(readFieldValue(androidSave, eternityCompletions!, SaveType.Android)).toEqual([1, 0, 2]);
  });

  it('keeps absent optional controls as warnings', () => {
    const issues = validateRegisteredFields({
      antimatter: '10',
      dimensionBoosts: 0,
      galaxies: 0,
      version: 14,
    }, SaveType.PC);

    expect(issues.some((issue) => issue.code === 'optional-field-missing' && issue.severity === 'warning')).toBe(true);
    expect(issues.some((issue) => issue.code === 'required-field' && issue.severity === 'error')).toBe(false);
  });

  it('keeps every field definition rooted in its platform path catalog', () => {
    for (const field of saveEditorFields) {
      expect(field.nativePaths[SaveType.PC].length, field.id).toBeGreaterThan(0);
      if (field.support[SaveType.Android] === 'unsupported') {
        expect(field.nativePaths[SaveType.Android], field.id).toEqual([]);
      } else {
        expect(field.nativePaths[SaveType.Android].length, field.id).toBeGreaterThan(0);
      }
      expect(field.sectionId, field.id).toBeTruthy();
      expect(field.support[SaveType.PC], field.id).toBe('supported');
      expect(['supported', 'unsupported', 'discovered']).toContain(field.support[SaveType.Android]);
    }
  });

  it('keeps field ids and platform candidate paths unique', () => {
    expect(new Set(saveEditorFields.map((field) => field.id)).size).toBe(saveEditorFields.length);

    for (const saveType of [SaveType.PC, SaveType.Android]) {
      const paths = saveEditorFields.flatMap((field) => field.nativePaths[saveType]);
      expect(new Set(paths).size, saveType).toBe(paths.length);
    }
  });

  it('covers the upstream PC v25 priority groups and legacy record aliases', () => {
    const ids = new Set(saveEditorFields.map((field) => field.id));
    for (const id of [
      'glyphInventory',
      'automatorScripts',
      'automatorConstants',
      'automatorRepeat',
      'blackHole0Phase',
      'blackHole1Phase',
      'raUnlockBits',
      'laitelaEntropy',
      'pelleDoomed',
      'normalChallengeCompletedBits',
      'infinityChallengeCompletedBits',
      'eternityChallengeRequirementBits',
      'eternityChallengeCompletions',
      'speedrunRecords',
      'recordsRecentInfinities',
      'recordsRecentEternities',
      'recordsRecentRealities',
    ]) {
      expect(ids.has(id), id).toBe(true);
    }

    const recentInfinities = saveEditorFields.find((field) => field.id === 'recordsRecentInfinities');
    expect(recentInfinities?.nativePaths[SaveType.PC]).toEqual([
      'records.recentInfinities',
      'records.lastTenInfinities',
    ]);

    expect(resolveRegisteredFieldPath({ blackHole: [{ phase: 4 }] }, 'blackHole0Phase', SaveType.PC))
      .toBe('blackHole[0].phase');

    expect(resolveStructuredEditPath({ records: { recentInfinities: [] } }, 'records.lastTenInfinities', SaveType.PC))
      .toMatchObject({ path: 'records.recentInfinities', registered: true });
    expect(resolveStructuredEditPath({}, 'dimensions.antimatter[0].amount', SaveType.PC))
      .toMatchObject({ registered: false, exemptionReason: expect.stringContaining('indexed paths') });
  });

  it('treats challenge bitfields as blocking integer fields', () => {
    const issues = validateRegisteredFields({
      challenge: {
        normal: { current: 0, completedBits: -1, bestTimes: [] },
        infinity: { current: 0, completedBits: 1.5, bestTimes: [] },
        eternity: { current: 0, unlocked: 0, requirementBits: 0 },
      },
      eternityChalls: {},
    }, SaveType.PC);

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'challenge.normal.completedBits', code: 'minimum-value', severity: 'error' }),
      expect.objectContaining({ path: 'challenge.infinity.completedBits', code: 'integer-required', severity: 'error' }),
    ]));
  });
});
