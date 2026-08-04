import { describe, expect, it } from 'vitest';
import {
  dimensionFamilyDefinitions,
  dilationCollectionUpgradeDefinitions,
  dilationRebuyableUpgradeDefinitions,
  eternityChallengeDefinitions,
  eternityMilestoneDefinitions,
  eternityUpgradeDefinitions,
  infinityCollectionUpgradeDefinitions,
  infinityRebuyableUpgradeDefinitions,
} from './progression';

describe('progression catalog', () => {
  it('keeps the upstream Dilation storage split explicit', () => {
    expect(dilationRebuyableUpgradeDefinitions.map((definition) => definition.id)).toEqual([1, 2, 3, 11, 12, 13]);
    expect(dilationCollectionUpgradeDefinitions.map((definition) => definition.id)).toEqual([4, 5, 6, 7, 8, 9, 10, 14, 15]);
    expect(dilationRebuyableUpgradeDefinitions.map((definition) => definition.androidRebuyableIndex)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('names every Eternity upgrade and challenge with its game meaning', () => {
    expect(eternityUpgradeDefinitions).toHaveLength(6);
    expect(eternityUpgradeDefinitions.every((definition) => definition.description.length > 20)).toBe(true);
    expect(eternityChallengeDefinitions).toHaveLength(12);
    expect(eternityChallengeDefinitions.every((definition) => definition.goal.startsWith('1e'))).toBe(true);
    expect(eternityChallengeDefinitions[11]?.restriction).toContain('10 in-game seconds');
  });

  it('names the shared Infinity and Break Infinity storage', () => {
    expect(infinityCollectionUpgradeDefinitions).toHaveLength(27);
    expect(infinityCollectionUpgradeDefinitions.every((definition) => definition.description.length > 20)).toBe(true);
    expect(infinityRebuyableUpgradeDefinitions.map((definition) => definition.maximum)).toEqual([8, 7, 10]);
  });

  it('models milestones as thresholds and dimensions as the three upstream families', () => {
    expect(eternityMilestoneDefinitions.map((definition) => definition.eternities)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      25, 30, 40, 50, 60, 80, 100, 200, 1000,
    ]);
    expect(dimensionFamilyDefinitions.map((definition) => definition.id)).toEqual(['antimatter', 'infinity', 'time']);
    expect(dimensionFamilyDefinitions.every((definition) => definition.fields.includes('amount') && definition.fields.includes('bought'))).toBe(true);
  });
});
