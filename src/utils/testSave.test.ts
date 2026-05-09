import { describe, expect, it } from 'vitest';
import androidFixture from '../../android.json';
import newsaveFixture from '../../newsave.json';
import pcFixture from '../../pc.json';
import { encodeSaveData } from '../core/save/serialization';
import { readFieldValue, saveEditorFields } from '../core/save/fieldRegistry';
import { SaveType } from '../core/save/types';
import { checkRealitySection, compareRegisteredFieldValues, testSaveData } from './testSave';

const cloneFixture = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('testSaveData', () => {
  it('uses the Android reference shape for Android big-number fields', () => {
    const encoded = encodeSaveData(cloneFixture(androidFixture), SaveType.Android);

    expect(encoded).toBeTruthy();

    const result = testSaveData(encoded!, JSON.stringify(androidFixture));

    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for antimatter'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for sacrificed'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.reality.rm'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.eternity.amount'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.eternity.xHighest'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.bigCrunch.amount'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.bigCrunch.xHighest'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for auto.sacrifice.multiplier'));
  });

  it('still validates PC saves against the PC reference shape', () => {
    const encoded = encodeSaveData(cloneFixture(pcFixture), SaveType.PC);

    expect(encoded).toBeTruthy();

    const result = testSaveData(encoded!, JSON.stringify(pcFixture));

    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for antimatter'));
    expect(result.errors).not.toContainEqual(expect.stringContaining('Incorrect type for sacrificed'));
  });

  it('accepts Android reality-specific fields in the dedicated reality check', () => {
    const result = checkRealitySection(cloneFixture(androidFixture) as never);

    expect(result.issues).not.toContain('The "realities" property is missing');
    expect(result.issues).not.toContainEqual(expect.stringContaining('The "realities" property is of type object instead of number'));
    expect(result.issues).not.toContain('The "reality.partSimulated" property is missing');
    expect(result.issues).not.toContainEqual(expect.stringContaining('The "reality.partSimulated" property is of type'));
    expect(result.issues).not.toContainEqual(expect.stringContaining('The "reality.realityMachines" property is of type object instead of string'));
  });

  it('matches every registered PC field against newsave.json', () => {
    const comparison = compareRegisteredFieldValues(
      cloneFixture(newsaveFixture) as never,
      cloneFixture(newsaveFixture) as never,
      SaveType.PC
    );

    expect(comparison.success).toBe(true);
    expect(comparison.errors).toHaveLength(0);
  });

  it('resolves every registered PC field from newsave.json', () => {
    const missingFields = saveEditorFields
      .filter((field) => readFieldValue(cloneFixture(newsaveFixture) as never, field, SaveType.PC) === undefined)
      .map((field) => field.id);

    expect(missingFields).toHaveLength(0);
  });

  it('reports mismatched registered PC fields against newsave.json', () => {
    const modifiedSave = cloneFixture(newsaveFixture) as Record<string, unknown>;
    modifiedSave.antimatter = '123';

    const comparison = compareRegisteredFieldValues(
      modifiedSave as never,
      cloneFixture(newsaveFixture) as never,
      SaveType.PC
    );

    expect(comparison.success).toBe(false);
    expect(comparison.errors).toContainEqual(expect.stringContaining('Antimatter mismatch'));
  });
});