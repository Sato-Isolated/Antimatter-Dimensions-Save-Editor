import { afterEach, describe, expect, it, vi } from 'vitest';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import { getValueAtPath, hasPath, setValueAtPath } from './path';
import { createSaveEditorStore } from './store';
import { decodeSaveString, encodeSaveData } from '../transport/codec';
import { SaveType } from '../model';

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

  it('loads both pinned PC fixture generations without migration or data loss', () => {
    for (const fixture of [pcFixture, newsaveFixture]) {
      const store = createSaveEditorStore();
      const encoded = encodeSaveData(fixture, SaveType.PC)!;

      expect(store.loadFromEncoded(encoded)).toEqual({ success: true, errorMessage: null });
      expect(store.getState().document).toMatchObject({
        transportVersion: 'AAB',
        dataVersion: fixture.version,
        shape: 'player',
        revision: 0,
      });
    }
  });

  it('imports and round-trips saves with an unrecognized zero Automator mode', () => {
    const store = createSaveEditorStore();
    const source = {
      ...createPcSave(),
      reality: { automator: { state: { mode: 0 } } },
    };
    const encoded = encodeSaveData(source, SaveType.PC)!;

    expect(store.loadFromEncoded(encoded)).toEqual({ success: true, errorMessage: null });
    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({
        code: 'automator-mode',
        path: 'reality.automator.state.mode',
        severity: 'warning',
      })]),
    );

    const reencoded = store.encodeWorkingData();
    expect(decodeSaveString(reencoded).data?.reality).toEqual(source.reality);
  });

  it('preserves unknown nested fields after a structured edit', () => {
    const store = createSaveEditorStore();
    const source = {
      ...createPcSave(),
      unknownFeature: {
        nested: [{ keep: true, value: 'untouched' }],
      },
    };
    const encoded = encodeSaveData(source, SaveType.PC)!;

    expect(store.loadFromEncoded(encoded).success).toBe(true);
    store.updateDocumentAtPath('antimatter', '123');
    const reencoded = store.encodeWorkingData();
    const decoded = decodeSaveString(reencoded);

    expect(decoded.data?.unknownFeature).toEqual(source.unknownFeature);
  });

  it('revalidates edits automatically and resets the complete session', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData(createPcSave(), SaveType.PC)!;

    store.loadFromEncoded(encoded);
    store.updateDocumentAtPath('version', 'invalid');

    expect(store.getState().document?.validation.success).toBe(false);
    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'version', severity: 'error' })]),
    );
    expect(store.encodeWorkingData()).toBe('');

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

  it('revalidates programmatic NaN and malformed structures before export', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData({
      ...createPcSave(),
      blackHole: [{ unlocked: true }],
    }, SaveType.PC)!;

    expect(store.loadFromEncoded(encoded).success).toBe(true);
    store.updateDocumentAtPath('matter', Number.NaN);
    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-number', severity: 'error' })]),
    );
    expect(store.encodeWorkingData()).toBe('');

    store.updateDocumentAtPath('matter', '0');
    store.updateDocumentAtPath('blackHole', { invalid: true });
    expect(store.encodeWorkingData()).toBe('');
    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'blackHole', code: 'invalid-structure', severity: 'error' })]),
    );
  });

  it('blocks programmatic challenge bitfield values before export', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData({
      ...createPcSave(),
      challenge: {
        normal: { current: 0, completedBits: 0, bestTimes: [] },
        infinity: { current: 0, completedBits: 0, bestTimes: [] },
        eternity: { current: 0, unlocked: 0, requirementBits: 0 },
      },
      eternityChalls: {},
    }, SaveType.PC)!;

    expect(store.loadFromEncoded(encoded).success).toBe(true);
    store.updateDocumentAtPath('challenge.infinity.completedBits', 1.5);

    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({
        path: 'challenge.infinity.completedBits',
        code: 'integer-required',
        severity: 'error',
      })]),
    );
    expect(store.encodeWorkingData()).toBe('');
  });

  it('blocks incompatible edits to discovered fields before export', () => {
    const store = createSaveEditorStore();
    const encoded = encodeSaveData(newsaveFixture, SaveType.PC)!;

    expect(store.loadFromEncoded(encoded).success).toBe(true);
    store.updateDocumentAtPath('reality.automator.scripts.1.content', 123);

    expect(store.getState().document?.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({
        path: 'reality.automator.scripts.1.content',
        code: 'discovered-type-mismatch',
        severity: 'error',
      })]),
    );
    expect(store.encodeWorkingData()).toBe('');
  });
});
