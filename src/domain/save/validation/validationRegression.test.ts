import { describe, expect, it } from 'vitest';
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
    store.updateDocumentAtPath('antimatter', '20');
    expect(decodeSaveString(store.encodeWorkingData()).data).toEqual({ ...data, antimatter: '20' });
  });
});
