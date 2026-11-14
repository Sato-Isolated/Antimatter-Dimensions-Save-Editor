import { describe, expect, it } from 'vitest';
import { isDeepStrictEqual } from 'node:util';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import currentPcFixture from '../../../../tests/fixtures/save/newsave.json';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import appleFixture from '../../../../tests/fixtures/save/apple.json';
import { saveEditorFields, validateFieldValue, validateRegisteredFields } from '../catalog/fields';
import { createSaveEditorStore } from '../document/store';
import { SaveObject, SaveType } from '../model';
import { decodeSaveString, encodeSaveData } from '../transport/codec';

const player = (): SaveObject => ({
  antimatter: '10', version: 14, dimensionBoosts: 0, galaxies: 0,
});

describe('validation compatibility regressions', () => {
  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])(
    'preserves negative phases for both black holes through import/edit/export (%s)',
    (saveType) => {
      const data = {
        ...player(),
        blackHole: [{ phase: -0.00000000001 }, { phase: -12.5 }],
        future: { untouched: ['unknown', 42] },
      };
      const store = createSaveEditorStore();
      expect(store.loadFromEncoded(encodeSaveData(data, saveType)!)).toEqual({ success: true, errorMessage: null });
      expect(store.getState().document?.originalData).toEqual(data);
      store.updateDocumentAtPath('antimatter', '20');
      expect(decodeSaveString(store.encodeWorkingData()).data).toEqual({ ...data, antimatter: '20' });
    },
  );

  it.each([9.5, 12.1])('preserves historical PC version %s without migration', (version) => {
    const data = { ...player(), version };
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(data)!)).toEqual({ success: true, errorMessage: null });
    expect(store.getState().document?.originalData).toEqual(data);
    expect(store.getState().document?.dataVersion).toBe(version);
    store.updateDocumentAtPath('antimatter', '20');
    expect(decodeSaveString(store.encodeWorkingData()).data).toEqual({ ...data, antimatter: '20' });
  });

  it('accepts the historical resets path without adding dimensionBoosts', () => {
    const data = { antimatter: '10', version: 9.5, resets: 4 };
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(data)! ).success).toBe(true);
    expect(decodeSaveString(store.encodeWorkingData()).data).toEqual(data);
  });

  it('preserves future collection IDs and warns about inferred unknown-field type changes', () => {
    const data = { ...player(), infinityUpgrades: ['futureUpgrade', 42.5], future: { value: 1 } };
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(data)! ).success).toBe(true);
    store.updateDocumentAtPath('future.value', 'new representation');
    expect(store.getState().document?.validation.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'discovered-type-mismatch', severity: 'warning' }),
      expect.objectContaining({ code: 'invalid-collection-entry', severity: 'warning' }),
    ]));
    expect(decodeSaveString(store.encodeWorkingData()).data).toEqual({
      ...data, future: { value: 'new representation' },
    });
  });

  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])(
    'warns about gameplay assumptions without rewriting atypical values (%s)', (saveType) => {
      const script = { id: 1, name: 'Long historical script name', content: '' };
      const data: SaveObject = {
        ...player(), galaxies: -0.5,
        blackHoleAutoPauseMode: 7, blackHoleNegative: 0,
        challenge: { normal: { current: 99 } },
        celestials: { laitela: { entropy: 1.01 }, pelle: { remnants: 0.5 } },
        reality: { automator: {
          scripts: saveType === SaveType.PC ? { 1: script } : [script],
          state: { mode: 9, editorScript: 2, topLevelScript: 3 },
          type: 4, currentInfoPane: 12,
        } },
      };
      const store = createSaveEditorStore();
      expect(store.loadFromEncoded(encodeSaveData(data, saveType)! ).success).toBe(true);
      expect(store.getState().document?.validation.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'integer-required', path: 'galaxies', severity: 'warning' }),
        expect.objectContaining({ code: 'maximum-value', path: 'blackHoleAutoPauseMode', severity: 'warning' }),
        expect.objectContaining({ code: 'automator-mode', severity: 'warning' }),
        expect.objectContaining({ code: 'automator-script-reference', severity: 'warning' }),
      ]));
      expect(isDeepStrictEqual(decodeSaveString(store.encodeWorkingData()).data, data)).toBe(true);
    },
  );

  it.each([
    ['PC legacy', pcFixture, SaveType.PC], ['PC current', currentPcFixture, SaveType.PC],
    ['Android', androidFixture, SaveType.Android], ['iOS', appleFixture, SaveType.Apple],
  ] as const)('imports and round-trips the %s fixture without normalization', (_, fixture, saveType) => {
    const data = fixture as unknown as SaveObject;
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(data, saveType)! ).success).toBe(true);
    // Compare silently: failure output must never dump a fixture or script text.
    expect(isDeepStrictEqual(store.getState().document?.originalData, data)).toBe(true);
    expect(isDeepStrictEqual(decodeSaveString(store.encodeWorkingData()).data, data)).toBe(true);
  });

  it('keeps invalid numeric representations and bitfields blocking', () => {
    for (const saveType of [SaveType.PC, SaveType.Android, SaveType.Apple]) {
      for (const phase of [NaN, -Infinity, Infinity, 'invalid', {}]) {
        expect(validateRegisteredFields({ ...player(), blackHole: [{ phase }] }, saveType)
          .some((issue) => issue.path === 'blackHole[0].phase' && issue.severity === 'error')).toBe(true);
      }
      expect(validateRegisteredFields({ ...player(), challenge: { normal: { completedBits: 1.5 } } }, saveType)
        .some((issue) => issue.path === 'challenge.normal.completedBits' && issue.severity === 'error')).toBe(true);
    }
  });

  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])('rejects lossy JSON export numbers (%s)', (saveType) => {
    for (const value of [NaN, -Infinity]) {
      expect(encodeSaveData({ ...player(), future: { value } }, saveType)).toBeNull();
    }
  });

  it.each([SaveType.Android, SaveType.Apple])('does not impose PC bit widths on %s saves', (saveType) => {
    const data = { ...player(), options: { hiddenTabBits: 2 ** 40 + 1 } };
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(data, saveType)! ).success).toBe(true);
    store.updateDocumentAtPath('antimatter', '20');
    expect(decodeSaveString(store.encodeWorkingData()).data?.options).toEqual(data.options);
    expect(validateRegisteredFields(data, SaveType.PC)
      .some((issue) => issue.path === 'options.hiddenTabBits' && issue.severity === 'error')).toBe(true);
  });

  it('audits every catalog numeric constraint and type on each platform', () => {
    for (const saveType of [SaveType.PC, SaveType.Android, SaveType.Apple]) {
      for (const field of saveEditorFields) {
        const kind = field.platformKinds?.[saveType] ?? field.kind;
        const rule = field.platformRules?.[saveType] ?? field.rule;
        const path = field.nativePaths[saveType][0];
        const invalidType = kind === 'object' || kind === 'object-or-array' ? false : {};
        expect(validateFieldValue(field, undefined, path, saveType))
          .toEqual([expect.objectContaining({
            code: rule?.required ? 'required-field' : 'optional-field-missing',
            severity: rule?.required ? 'error' : 'warning',
          })]);
        expect(validateFieldValue(field, invalidType, path, saveType)
          .some((issue) => issue.severity === 'error'), `${saveType}:${field.id}:type`).toBe(true);
        if (kind !== 'number' && kind !== 'integer') continue;
        for (const value of [NaN, -Infinity, Infinity]) {
          expect(validateFieldValue(field, value, path, saveType)
            .some((issue) => issue.severity === 'error'), `${saveType}:${field.id}:finite`).toBe(true);
        }
        const severity = rule?.constraintSeverity ?? 'warning';
        for (const [value, code] of [
          [rule?.minimum === undefined ? undefined : rule.minimum - 1, 'minimum-value'],
          [rule?.maximum === undefined ? undefined : rule.maximum + 1, 'maximum-value'],
          [rule?.integer ? 0.5 : undefined, 'integer-required'],
        ] as const) {
          if (value === undefined) continue;
          expect(validateFieldValue(field, value, path, saveType), `${saveType}:${field.id}:${code}`)
            .toEqual(expect.arrayContaining([expect.objectContaining({ code, severity })]));
        }
      }
    }
  });
});
