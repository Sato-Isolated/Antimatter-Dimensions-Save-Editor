import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import {
  cloneSaveDataPreservingSpecialValues,
  decodeSaveString,
  detectSaveType,
  encodeSaveData,
  validateDecodedSave,
} from './codec';
import { SaveType } from '../model';

const cloneFixture = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const readTransportFixture = (name: string): string => {
  return readFileSync(new URL(`../../../../tests/fixtures/save/${name}`, import.meta.url), 'utf8').trim();
};

describe('save serialization', () => {
  it('round-trips the checked-in PC and Android transport text fixtures', () => {
    for (const [name, saveType] of [
      ['pc.txt', SaveType.PC],
      ['android.txt', SaveType.Android],
    ] as const) {
      const encoded = readTransportFixture(name);
      const decoded = decodeSaveString(encoded);

      expect(decoded.saveType, name).toBe(saveType);
      expect(decoded.shape, name).toBe('player');
      expect(decoded.validation.success, name).toBe(true);
      expect(decoded.data, name).toBeTruthy();
      const reencoded = encodeSaveData(decoded.data!, saveType);
      expect(reencoded, name).toBeTruthy();
      expect(decodeSaveString(reencoded!).data, name).toEqual(decoded.data);
    }
  });

  it('round-trips the PC fixture', () => {
    const encoded = encodeSaveData(cloneFixture(pcFixture), SaveType.PC);

    expect(encoded).toBeTruthy();
    expect(detectSaveType(encoded!)).toBe(SaveType.PC);

    const decoded = decodeSaveString(encoded!);
    expect(decoded.saveType).toBe(SaveType.PC);
    expect(decoded.transportVersion).toBe('AAB');
    expect(decoded.dataVersion).toBe(14);
    expect(decoded.shape).toBe('player');
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

  it('round-trips the upstream v25 fixture with exact transport text', () => {
    const encoded = encodeSaveData(cloneFixture(newsaveFixture), SaveType.PC);

    expect(encoded).toBeTruthy();
    const decoded = decodeSaveString(encoded!);

    expect(decoded.transportVersion).toBe('AAB');
    expect(decoded.dataVersion).toBe(25);
    expect(decoded.shape).toBe('player');
    expect(decoded.validation.success).toBe(true);
    expect(encodeSaveData(decoded.data!, SaveType.PC)).toBe(encoded);
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
    expect((decoded.data?.nested as Record<string, unknown> | undefined)?.cap).toBe(Number.POSITIVE_INFINITY);
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

  it('rejects unknown transport versions, missing suffixes, and carriage returns', () => {
    const encoded = encodeSaveData(cloneFixture(pcFixture), SaveType.PC)!;
    const unknownVersion = encoded.replace('FormatAAB', 'FormatAAC');
    const unknownResult = decodeSaveString(unknownVersion);
    expect(unknownResult.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unknown-transport-version', severity: 'error' })]),
    );

    const missingSuffix = decodeSaveString(encoded.slice(0, -'EndOfSavefile'.length));
    expect(missingSuffix.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-suffix', severity: 'error' })]),
    );

    const withCarriageReturn = decodeSaveString(`${encoded}\r\n`);
    expect(withCarriageReturn.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-line-break', severity: 'error' })]),
    );
  });

  it('decodes the unprefixed legacy Base64 transport explicitly', () => {
    const json = JSON.stringify(cloneFixture(pcFixture));
    const legacy = Buffer.from(json, 'utf8').toString('base64');
    const decoded = decodeSaveString(legacy);

    expect(decoded.transportVersion).toBe('legacy');
    expect(decoded.shape).toBe('player');
    expect(decoded.validation.success).toBe(true);
    expect(decoded.data?.version).toBe(14);
  });

  it('blocks invalid roots, NaN, non-integer versions, and malformed black holes', () => {
    const missingAntimatter = validateDecodedSave({ version: 14, lastUpdate: 1 });
    expect(missingAntimatter.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-antimatter', severity: 'error' })]),
    );

    const invalidValues = validateDecodedSave({
      antimatter: '10',
      version: 14.5,
      lastUpdate: 1,
      nested: { value: Number.NaN },
      blackHole: {},
    });
    expect(invalidValues.success).toBe(false);
    expect(invalidValues.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-version', severity: 'error', path: 'version' }),
        expect.objectContaining({ code: 'invalid-number', severity: 'error' }),
        expect.objectContaining({ code: 'invalid-structure', severity: 'error', path: 'blackHole' }),
      ]),
    );
  });

  it('recognizes upstream storage containers without treating them as player exports', () => {
    const encoded = encodeSaveData({ saves: [], current: 0 }, SaveType.PC)!;
    const decoded = decodeSaveString(encoded);

    expect(decoded.shape).toBe('storage-container');
    expect(decoded.validation.success).toBe(false);
    expect(decoded.validation.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unsupported-save-container', severity: 'error' })]),
    );
  });
});
