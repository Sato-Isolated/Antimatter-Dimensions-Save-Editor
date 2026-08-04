import { describe, expect, it } from 'vitest';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import { collectDiscoveredSaveFields, validateDiscoveredSaveFields } from './fieldExplorer';
import { setValueAtPath } from '../document/path';
import { SaveObject, SaveType } from '../model';

const findField = (path: string, fixture: SaveObject) => {
  return collectDiscoveredSaveFields(fixture, SaveType.PC).find((field) => field.path === path);
};

describe('discovered save field explorer', () => {
  it('enumerates the nested PC v14 and v25 values with stable paths', () => {
    const pcFields = collectDiscoveredSaveFields(pcFixture, SaveType.PC);
    const v25Fields = collectDiscoveredSaveFields(newsaveFixture, SaveType.PC);

    expect(pcFields.length).toBeGreaterThan(500);
    expect(v25Fields.length).toBeGreaterThan(500);
    expect(new Set(v25Fields.map((field) => field.path)).size).toBe(v25Fields.length);

    expect(findField('antimatter', pcFixture)).toMatchObject({
      kind: 'string',
      registered: true,
      group: 'Core resources',
      description: 'Main antimatter pool.',
    });
    expect(findField('reality.automator.scripts.1.content', newsaveFixture)).toMatchObject({
      kind: 'string',
      registered: false,
      group: 'Reality',
      description: expect.stringContaining('player.reality.automator.scripts.1.content'),
    });
    expect(findField('options.glyphBG', newsaveFixture)).toMatchObject({
      kind: 'number',
      registered: false,
      group: 'Options',
    });
  });

  it('keeps composite values editable and identifies exact registry definitions', () => {
    const fields = collectDiscoveredSaveFields(newsaveFixture, SaveType.PC);

    expect(fields.find((field) => field.path === 'reality.glyphs.active')).toMatchObject({
      kind: 'array',
      registered: true,
    });
    expect(fields.find((field) => field.path === 'eternityChalls.eterc1')).toMatchObject({
      kind: 'number',
      registered: false,
      group: 'Eternity challenges',
    });
    expect(fields.find((field) => field.path === 'reality.glyphs.active[0].type')).toMatchObject({
      kind: 'string',
      registered: false,
    });
  });

  it('blocks incompatible edits to discovered fields while preserving new unknown keys', () => {
    const baseline = JSON.parse(JSON.stringify(newsaveFixture)) as SaveObject;
    const changed = setValueAtPath(baseline, 'reality.automator.scripts.1.content', 123);
    const withUnknownKey = setValueAtPath(changed, 'futureUpstreamField.enabled', true);
    const issues = validateDiscoveredSaveFields(withUnknownKey, baseline, SaveType.PC);

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: 'discovered-type-mismatch',
        path: 'reality.automator.scripts.1.content',
        severity: 'error',
      }),
    ]));
    expect(issues.some((issue) => issue.path === 'futureUpstreamField.enabled')).toBe(false);
  });
});
