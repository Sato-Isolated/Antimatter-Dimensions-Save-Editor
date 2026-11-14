import { describe, expect, it } from 'vitest';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import modernFixture from '../../../../tests/fixtures/save/newsave.json';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import appleFixture from '../../../../tests/fixtures/save/apple.json';
import { createSaveEditorStore } from '../document/store';
import { getValueAtPath } from '../document/path';
import { encodeSaveData, decodeSaveString } from '../transport/codec';
import { isJsonObject, SaveObject, SaveType } from '../model';
import { resolveRegisteredFieldPath } from './fields';
import { getClearedRecentRecords, RecentRecordsFieldId } from './records';

const fieldIds: RecentRecordsFieldId[] = ['recordsRecentInfinities', 'recordsRecentEternities', 'recordsRecentRealities'];

describe('clearing recent records', () => {
  it.each([
    ['PC v14', pcFixture, SaveType.PC], ['PC v25', modernFixture, SaveType.PC],
    ['Android', androidFixture, SaveType.Android], ['Apple', appleFixture, SaveType.Apple],
  ] as const)('clears all three %s histories and exports valid layouts', (_name, fixture, saveType) => {
    const store = createSaveEditorStore();
    expect(store.loadFromEncoded(encodeSaveData(fixture as SaveObject, saveType)!).success).toBe(true);
    for (const fieldId of fieldIds) {
      const data = store.getState().document!.workingData;
      const path = resolveRegisteredFieldPath(data, fieldId, saveType);
      const before = getValueAtPath<unknown[]>(data, path)!;
      const cleared = getClearedRecentRecords(data, fieldId, saveType);
      expect(cleared).toHaveLength(before.length);
      expect(cleared[0]).not.toBe(cleared[1]);
      if (Array.isArray(cleared[0])) {
        expect(cleared[0]).toHaveLength((before[0] as unknown[]).length);
        expect(cleared[0][0]).toBe(Number.MAX_VALUE);
      } else {
        expect(isJsonObject(cleared[0])).toBe(true);
        if (isJsonObject(cleared[0])) expect(cleared[0].time).toBe(Number.MAX_VALUE);
      }
      store.updateDocumentAtPath(path, cleared);
      expect(store.getState().document!.validation.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.path)).toEqual([]);
      const encoded = store.encodeWorkingData();
      expect(Boolean(encoded)).toBe(true);
      expect(decodeSaveString(encoded).validation.success).toBe(true);
    }
  });

  it('preserves future columns, records and mobile decimal metadata', () => {
    const futureRow = [5, 6, '7', '8', 'challenge', { future: true }];
    const rows = Array.from({ length: 11 }, () => [...futureRow]);
    const cleared = getClearedRecentRecords({ records: { recentInfinities: rows } }, 'recordsRecentInfinities', SaveType.PC);
    expect((cleared[0] as unknown[])[5]).toBe(futureRow[5]);
    expect(cleared[10]).toBe(rows[10]);
    const decimal = { mantissa: 5, exponent: 4, future: true };
    const mobile = getClearedRecentRecords({ records: { pastTenInfinities: [{ time: 5, realTime: 4, currencyGain: decimal, prestigeCountGain: decimal, challenge: '', future: true }] } }, 'recordsRecentInfinities', SaveType.Android);
    expect(mobile[0]).toMatchObject({ future: true, currencyGain: { mantissa: 1, exponent: 0, future: true } });
    expect(decimal.mantissa).toBe(5);
  });
});
