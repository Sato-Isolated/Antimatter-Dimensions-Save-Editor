import { describe, expect, it } from 'vitest';
import androidFixture from '../../../android.json';
import pcFixture from '../../../pc.json';
import {
  cloneSaveDataPreservingSpecialValues,
  decodeSaveString,
  detectSaveType,
  encodeSaveData,
} from './serialization';
import { SaveType } from './types';

const cloneFixture = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('save serialization', () => {
  it('round-trips the PC fixture', () => {
    const encoded = encodeSaveData(cloneFixture(pcFixture), SaveType.PC);

    expect(encoded).toBeTruthy();
    expect(detectSaveType(encoded!)).toBe(SaveType.PC);

    const decoded = decodeSaveString(encoded!);
    expect(decoded.saveType).toBe(SaveType.PC);
    expect(decoded.validation.success).toBe(true);
    expect(decoded.data?.version).toBe(pcFixture.version);
    expect(decoded.data?.lastUpdate).toBe(pcFixture.lastUpdate);
    expect(decoded.data?.antimatter).toEqual(pcFixture.antimatter);
    expect(decoded.data).toEqual(pcFixture);
  });

  it('round-trips the Android fixture', () => {
    const encoded = encodeSaveData(cloneFixture(androidFixture), SaveType.Android);

    expect(encoded).toBeTruthy();
    expect(detectSaveType(encoded!)).toBe(SaveType.Android);

    const decoded = decodeSaveString(encoded!);
    expect(decoded.saveType).toBe(SaveType.Android);
    expect(decoded.validation.success).toBe(true);
    expect(decoded.data?.version).toBe(androidFixture.version);
    expect(decoded.data?.lastUpdate).toBe(androidFixture.lastUpdate);
    expect(decoded.data?.brake).toBe(androidFixture.brake);
    expect(decoded.data).toEqual(androidFixture);
  });

  it('preserves Infinity through cloning and PC round-trip', () => {
    const saveWithInfinity = {
      antimatter: Number.POSITIVE_INFINITY,
      version: 14,
      lastUpdate: 1700000000000,
      nested: {
        cap: Number.POSITIVE_INFINITY,
      },
    };

    const cloned = cloneSaveDataPreservingSpecialValues(saveWithInfinity);
    expect(cloned).not.toBe(saveWithInfinity);
    expect(cloned.antimatter).toBe(Number.POSITIVE_INFINITY);
    expect(cloned.nested).not.toBe(saveWithInfinity.nested);
    expect(cloned.nested.cap).toBe(Number.POSITIVE_INFINITY);

    const encoded = encodeSaveData(cloned, SaveType.PC);
    expect(encoded).toBeTruthy();

    const decoded = decodeSaveString(encoded!);
    expect(decoded.data?.antimatter).toBe(Number.POSITIVE_INFINITY);
    expect(decoded.data?.nested.cap).toBe(Number.POSITIVE_INFINITY);
  });

  it('clones Set and Date values without sharing references', () => {
    const savedAt = new Date('2026-06-06T00:00:00.000Z');
    const source = {
      version: 14,
      lastUpdate: 1700000000000,
      unlocked: new Set([1, 2, 3]),
      savedAt,
    };

    const cloned = cloneSaveDataPreservingSpecialValues(source);
    expect(cloned.unlocked).toBeInstanceOf(Set);
    expect(cloned.unlocked).not.toBe(source.unlocked);
    expect([...cloned.unlocked]).toEqual([1, 2, 3]);
    expect(cloned.savedAt).toBeInstanceOf(Date);
    expect(cloned.savedAt).not.toBe(savedAt);
    expect(cloned.savedAt.getTime()).toBe(savedAt.getTime());
  });
});
