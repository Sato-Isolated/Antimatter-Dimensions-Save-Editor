import { describe, expect, it } from 'vitest';
import { SaveType } from '../model';
import { createAndroidSavePlatformAdapter } from './android';
import { createAppleSavePlatformAdapter } from './apple';
import { createPcSavePlatformAdapter } from './pc';

const catalogFields = [
  { id: 'recordsRecentInfinities', paths: ['records.recentInfinities'] as const },
  { id: 'recordsRecentEternities', paths: ['records.recentEternities'] as const },
  { id: 'realityUpgradeRequirements', paths: ['reality.upgReqs'] as const },
];

describe('save platform adapters', () => {
  it('resolves Android record aliases without changing the document shape', () => {
    const adapter = createAndroidSavePlatformAdapter(catalogFields);
    const save = { records: { pastTenInfinities: [], pastTenEternities: [] } };

    expect(adapter.type).toBe(SaveType.Android);
    expect(adapter.resolveFieldPath(save, 'recordsRecentInfinities', catalogFields[0].paths))
      .toBe('records.pastTenInfinities');
    expect(adapter.getFieldPaths('recordsRecentEternities', catalogFields[1].paths))
      .toEqual(['records.recentEternities', 'records.pastTenEternities']);
  });

  it('resolves Apple record and reality-upgrade aliases without changing the document shape', () => {
    const adapter = createAppleSavePlatformAdapter(catalogFields);
    const save = { records: { pastTenInfinities: [] }, reality: { upgradeRequirementBits: 0 } };

    expect(adapter.type).toBe(SaveType.Apple);
    expect(adapter.resolveFieldPath(save, 'recordsRecentInfinities', catalogFields[0].paths))
      .toBe('records.pastTenInfinities');
    expect(adapter.resolveFieldPath(save, 'realityUpgradeRequirements', catalogFields[2].paths))
      .toBe('reality.upgradeRequirementBits');
  });

  it('keeps PC and Android capabilities explicit', () => {
    const pc = createPcSavePlatformAdapter(catalogFields);
    const android = createAndroidSavePlatformAdapter(catalogFields);

    expect(pc.capabilities.transportVersions).toEqual(['legacy', 'AAA', 'AAB']);
    expect(android.capabilities.transportVersions).toEqual(['AAA']);
    expect(pc.capabilities.compatibility).toBe('fixture-transport');
    expect(android.capabilities.compatibility).toBe('fixture-transport');
    expect(pc.supportsField('recordsRecentInfinities')).toBe(true);
    expect(android.supportsField('notInCatalog')).toBe(false);
  });
});
