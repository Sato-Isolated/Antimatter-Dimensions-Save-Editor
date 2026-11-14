import { describe, expect, it, vi } from 'vitest';
import * as pako from 'pako';
import { SAVE_TRANSPORT_LIMITS } from './limits';
import { readFileSync } from 'node:fs';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import appleFixture from '../../../../tests/fixtures/save/apple.json';
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

vi.mock('pako', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pako')>();
  return { ...actual, deflate: vi.fn(actual.deflate), gzip: vi.fn(actual.gzip) };
});

const cloneFixture = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const readTransportFixture = (name: string): string => {
  return readFileSync(new URL(`../../../../tests/fixtures/save/${name}`, import.meta.url), 'utf8').trim();
};

describe('save serialization', () => {
  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])('stops inflation at the byte limit for %s', (saveType) => {
    const compressed = saveType === SaveType.PC
      ? pako.deflate('x'.repeat(32_000_000)) : pako.gzip('x'.repeat(32_000_000));
    const payload = Buffer.from(compressed).toString('base64').replace(/=+$/gu, '')
      .replace(/0/gu, '0a').replace(/\+/gu, '0b').replace(/\//gu, '0c');
    const prefix = saveType === SaveType.PC ? 'AntimatterDimensionsSavefileFormatAAB'
      : saveType === SaveType.Android ? 'AntimatterDimensionsAndroidSaveFormatAAA' : 'AntimatterDimensionsAppleSaveFormatAAA';
    let emittedBytes = 0;
    const originalPush = pako.Inflate.prototype.push;
    const spy = vi.spyOn(pako.Inflate.prototype, 'push').mockImplementation(function (this: pako.Inflate, ...args: Parameters<typeof originalPush>) {
      const onData = this.onData;
      this.onData = (chunk: Uint8Array<ArrayBuffer>) => { emittedBytes += chunk.length; onData.call(this, chunk); };
      return originalPush.apply(this, args);
    });
    try {
      const result = decodeSaveString(`${prefix}${payload}EndOfSavefile`);
      expect(result.validation.issues.some((issue) => issue.code === 'inflated-payload-too-large')).toBe(true);
      expect(emittedBytes).toBeGreaterThan(SAVE_TRANSPORT_LIMITS.maxInflatedBytes);
      expect(emittedBytes).toBeLessThanOrEqual(SAVE_TRANSPORT_LIMITS.maxInflatedBytes + 64 * 1024);
    } finally { spy.mockRestore(); }
  });

  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])('rejects oversized UTF-8 documents before compressing for %s', (saveType) => {
    const deflate = vi.mocked(pako.deflate).mockClear();
    const gzip = vi.mocked(pako.gzip).mockClear();
    try {
      expect(encodeSaveData({ antimatter: '10', version: 25, future: 'é'.repeat(8_000_000) }, saveType)).toBeNull();
      expect(deflate).not.toHaveBeenCalled();
      expect(gzip).not.toHaveBeenCalled();
    } finally { deflate.mockClear(); gzip.mockClear(); }
  });

  it.each([SaveType.PC, SaveType.Android, SaveType.Apple])('rejects incomplete compressed streams for %s', (saveType) => {
    const json = JSON.stringify({ antimatter: '10', version: 25 });
    const compressed = saveType === SaveType.PC ? pako.deflate(json) : pako.gzip(json);
    const payload = Buffer.from(compressed.slice(0, -1)).toString('base64').replace(/=+$/gu, '')
      .replace(/0/gu, '0a').replace(/\+/gu, '0b').replace(/\//gu, '0c');
    const prefix = saveType === SaveType.PC ? 'AntimatterDimensionsSavefileFormatAAB'
      : saveType === SaveType.Android ? 'AntimatterDimensionsAndroidSaveFormatAAA' : 'AntimatterDimensionsAppleSaveFormatAAA';
    expect(decodeSaveString(`${prefix}${payload}EndOfSavefile`).validation.issues)
      .toEqual(expect.arrayContaining([expect.objectContaining({ code: 'invalid-compression' })]));
  });

  it('round-trips the checked-in PC and Android transport text fixtures', () => {
    for (const [name, saveType] of [
      ['pc.txt', SaveType.PC],
      ['android.txt', SaveType.Android],
      ['apple.txt', SaveType.Apple],
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

  it('round-trips the Apple fixture', () => {
    const encoded = encodeSaveData(cloneFixture(appleFixture), SaveType.Apple);

    expect(encoded).toBeTruthy();
    expect(encoded!.startsWith('AntimatterDimensionsAppleSaveFormatAAA')).toBe(true);
    expect(encoded!.endsWith('EndOfSavefile')).toBe(true);
    expect(detectSaveType(encoded!)).toBe(SaveType.Apple);

    const decoded = decodeSaveString(encoded!);
    expect(decoded.saveType).toBe(SaveType.Apple);
    expect(decoded.transportVersion).toBe('AAA');
    expect(decoded.dataVersion).toBe(30110503);
    expect(decoded.shape).toBe('player');
    expect(decoded.validation.success).toBe(true);
    expect(decoded.data?.brake).toBe(appleFixture.brake);
    expect(decoded.data).toEqual(appleFixture);
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

    const appleEncoded = readTransportFixture('apple.txt');
    const unknownAppleVersion = appleEncoded.replace('FormatAAA', 'FormatAAB');
    const unknownAppleResult = decodeSaveString(unknownAppleVersion);
    expect(unknownAppleResult.validation.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unknown-transport-version',
          severity: 'error',
          message: expect.stringContaining('Apple'),
        }),
      ]),
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

  it('blocks invalid roots, NaN, nonnumeric versions, and malformed black holes', () => {
    const missingAntimatter = validateDecodedSave({ version: 14, lastUpdate: 1 });
    expect(missingAntimatter.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-antimatter', severity: 'error' })]),
    );

    const invalidValues = validateDecodedSave({
      antimatter: '10',
      version: 'invalid',
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
