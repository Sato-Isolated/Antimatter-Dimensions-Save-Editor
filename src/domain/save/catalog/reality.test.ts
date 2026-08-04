import { describe, expect, it } from 'vitest';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import { getValueAtPath } from '../document/path';
import { SaveObject, SaveType } from '../model';
import { resolveRegisteredFieldPath } from './fields';
import {
  realityPerkById,
  realityUpgradeBitDefinitions,
  realityUpgradeDefinitions,
} from './reality';
import { automatorModeDefinitions } from './automator';

describe('upstream Reality catalog', () => {
  it('keeps the five rebuyables separate from one-time upgrade bits', () => {
    expect(realityUpgradeDefinitions).toHaveLength(25);
    expect(realityUpgradeDefinitions.filter((definition) => definition.storage === 'rebuyable')).toHaveLength(5);
    expect(realityUpgradeBitDefinitions.map((definition) => definition.bitIndex)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 6),
    );
    expect(new Set(realityUpgradeDefinitions.map((definition) => definition.id)).size).toBe(25);
  });

  it('resolves Android requirement bits to the field name used by the fixture', () => {
    const android = androidFixture as unknown as SaveObject;
    expect(resolveRegisteredFieldPath(android, 'realityUpgradeRequirements', SaveType.Android))
      .toBe('reality.upgradeRequirementBits');
    expect(getValueAtPath(android, 'reality.upgradeRequirementBits')).toBe(1048575);
    expect(getValueAtPath(newsaveFixture as unknown as SaveObject, 'reality.upgReqs')).toBe(67108800);
  });

  it('documents the upstream Automator modes and known perk IDs', () => {
    expect(automatorModeDefinitions.map((definition) => definition.value)).toEqual([1, 2, 3]);
    expect(automatorModeDefinitions.map((definition) => definition.label)).toEqual(['Paused', 'Running', 'Single step']);
    expect(realityPerkById.get(0)).toMatchObject({ label: 'START' });
    expect(realityPerkById.get(205)).toMatchObject({ label: 'ACHNR' });
  });
});
