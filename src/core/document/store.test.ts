import { afterEach, describe, expect, it, vi } from 'vitest';
import { getValueAtPath, hasPath, setValueAtPath } from './path';
import { createSaveEditorStore } from './store';
import { decodeSaveString, encodeSaveData } from '../save/serialization';
import { SaveType } from '../save/types';

const createPcSave = () => ({
  antimatter: '10',
  matter: '0',
  dimensionBoosts: 0,
  galaxies: 0,
  break: false,
  version: 14,
  lastUpdate: 1700000000000,
  records: {
    totalAntimatter: '10',
  },
  dimensions: {
    antimatter: [{ amount: '1' }],
  },
});

describe('document path utilities', () => {
  it('updates nested values with structural sharing', () => {
    const source = createPcSave();
    const updated = setValueAtPath(source, 'dimensions.antimatter[0].amount', '25');

    expect(updated).not.toBe(source);
    expect(updated.records).toBe(source.records);
    expect(getValueAtPath(updated, 'dimensions.antimatter[0].amount')).toBe('25');
    expect(hasPath(updated, 'dimensions.antimatter[0].amount')).toBe(true);
  });
});

describe('save editor store', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads, edits, and re-encodes a save', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData(createPcSave(), SaveType.PC);

    expect(encoded).toBeTruthy();
    expect(store.loadFromEncoded(encoded!).success).toBe(true);
    expect(store.getState().isDirty).toBe(false);

    store.updateDocumentAtPath('antimatter', '42');

    expect(store.getState().isDirty).toBe(true);
    expect(store.getState().document?.validation.success).toBe(true);

    const reencoded = store.encodeWorkingData();
    const decoded = decodeSaveString(reencoded);
    expect(decoded.data?.antimatter).toBe('42');
  });

  it('drops stale export output when the workspace changes or load fails', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const store = createSaveEditorStore();
    const encoded = encodeSaveData(createPcSave(), SaveType.PC)!;

    store.loadFromEncoded(encoded);
    expect(store.encodeWorkingData()).toBeTruthy();
    expect(store.getState().encodedOutputData).toBeTruthy();

    store.updateDocumentAtPath('antimatter', '99');
    expect(store.getState().encodedOutputData).toBe('');

    const failed = store.loadFromEncoded('not-a-save');
    expect(failed.success).toBe(false);
    expect(store.getState().encodedOutputData).toBe('');
    expect(store.getState().encryptedSave).toBe('');
  });

  it('revalidates edits automatically and resets the complete session', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData(createPcSave(), SaveType.PC)!;

    store.loadFromEncoded(encoded);
    store.updateDocumentAtPath('version', 'invalid');

    expect(store.getState().document?.validation.success).toBe(true);
    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'version', severity: 'warning' })]),
    );

    store.reset();

    expect(store.getState()).toMatchObject({
      rawSaveData: '',
      encodedOutputData: '',
      encryptedSave: '',
      errorMessage: null,
      isLoaded: false,
      isDirty: false,
      document: null,
      lastChange: null,
    });
  });
});
