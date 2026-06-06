import pako from 'pako';
import {
  SaveDataRecord,
  SaveDecodeResult,
  SaveProgressionStage,
  SaveType,
  SaveValidationIssue,
  SaveValidationSummary,
} from './types';

interface EncodingStep<T, U> {
  encode: (input: T, type?: string) => U;
  decode: (input: U, type?: string) => T;
  condition?: (version: string) => boolean;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const startingString = {
  savefile: 'AntimatterDimensionsSavefileFormat',
  'automator script': 'AntimatterDimensionsAutomatorScriptFormat',
  'automator data': 'AntimatterDimensionsAutomatorDataFormat',
  'glyph filter': 'AntimatterDimensionsGlyphFilterFormat',
  android: 'AntimatterDimensionsAndroidSaveFormat',
};

const endingString = {
  savefile: 'EndOfSavefile',
  'automator script': 'EndOfAutomatorScript',
  'automator data': 'EndOfAutomatorData',
  'glyph filter': 'EndOfGlyphFilter',
  android: 'EndOfSavefile',
};

const versions = {
  pc: 'AAB',
  android: 'AAA',
};

const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const encodeBase64Bytes = (bytes: Uint8Array): string => {
  let output = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const byte1 = bytes[index] ?? 0;
    const byte2 = bytes[index + 1] ?? 0;
    const byte3 = bytes[index + 2] ?? 0;
    const combined = (byte1 << 16) | (byte2 << 8) | byte3;

    output += base64Alphabet[(combined >> 18) & 63];
    output += base64Alphabet[(combined >> 12) & 63];
    output += index + 1 < bytes.length ? base64Alphabet[(combined >> 6) & 63] : '=';
    output += index + 2 < bytes.length ? base64Alphabet[combined & 63] : '=';
  }

  return output;
};

const decodeBase64Bytes = (value: string): Uint8Array => {
  const sanitized = value.replace(/\s+/gu, '');
  const bytes: number[] = [];

  for (let index = 0; index < sanitized.length; index += 4) {
    const chunk = sanitized.slice(index, index + 4);
    const sextets = chunk.split('').map((character) => {
      if (character === '=') {
        return 0;
      }

      return base64Alphabet.indexOf(character);
    });

    const combined = (sextets[0] << 18) | (sextets[1] << 12) | (sextets[2] << 6) | sextets[3];
    bytes.push((combined >> 16) & 255);

    if (chunk[2] !== '=') {
      bytes.push((combined >> 8) & 255);
    }

    if (chunk[3] !== '=') {
      bytes.push(combined & 255);
    }
  }

  return Uint8Array.from(bytes);
};

const encodeBase64 = (value: string): string => {
  if (typeof btoa === 'function') {
    return btoa(value);
  }

  return encodeBase64Bytes(Uint8Array.from(value, (character) => character.charCodeAt(0)));
};

const decodeBase64 = (value: string): string => {
  if (typeof atob === 'function') {
    return atob(value);
  }

  return Array.from(decodeBase64Bytes(value)).map((entry) => String.fromCharCode(entry)).join('');
};

const pcSteps: EncodingStep<any, any>[] = [
  {
    encode: (value: string): Uint8Array => encoder.encode(value),
    decode: (value: Uint8Array): string => decoder.decode(value),
  },
  {
    encode: (value: Uint8Array): Uint8Array => pako.deflate(value),
    decode: (value: Uint8Array): Uint8Array => pako.inflate(value),
  },
  {
    encode: (value: Uint8Array): string => Array.from(value).map((entry) => String.fromCharCode(entry)).join(''),
    decode: (value: string): Uint8Array => Uint8Array.from(Array.from(value).map((entry) => entry.charCodeAt(0))),
  },
  {
    encode: (value: string): string => encodeBase64(value),
    decode: (value: string): string => decodeBase64(value),
  },
  {
    encode: (value: string): string => value.replace(/=+$/gu, '').replace(/0/gu, '0a').replace(/\+/gu, '0b').replace(/\//gu, '0c'),
    decode: (value: string): string => value.replace(/0b/gu, '+').replace(/0c/gu, '/').replace(/0a/gu, '0'),
  },
  {
    encode: (value: string, type: string): string => value + endingString[type as keyof typeof endingString],
    decode: (value: string, type: string): string => value.slice(0, value.length - endingString[type as keyof typeof endingString].length),
    condition: (version: string): boolean => version >= 'AAB',
  },
];

const androidSteps: EncodingStep<any, any>[] = [
  {
    encode: (value: string): Uint8Array => encoder.encode(value),
    decode: (value: Uint8Array): string => decoder.decode(value),
  },
  {
    encode: (value: Uint8Array): Uint8Array => pako.gzip(value),
    decode: (value: Uint8Array): Uint8Array => pako.ungzip(value),
  },
  {
    encode: (value: Uint8Array): string => Array.from(value).map((entry) => String.fromCharCode(entry)).join(''),
    decode: (value: string): Uint8Array => Uint8Array.from(Array.from(value).map((entry) => entry.charCodeAt(0))),
  },
  {
    encode: (value: string): string => encodeBase64(value),
    decode: (value: string): string => decodeBase64(value),
  },
  {
    encode: (value: string): string => value.replace(/=+$/gu, '').replace(/0/gu, '0a').replace(/\+/gu, '0b').replace(/\//gu, '0c'),
    decode: (value: string): string => value.replace(/0b/gu, '+').replace(/0c/gu, '/').replace(/0a/gu, '0'),
  },
  {
    encode: (value: string, type: string): string => value + endingString[type as keyof typeof endingString],
    decode: (value: string, type: string): string => value.slice(0, value.length - endingString[type as keyof typeof endingString].length),
  },
];

const jsonConverter = (_key: string, value: unknown): unknown => {
  if (value === Number.POSITIVE_INFINITY) {
    return 'Infinity';
  }

  if (value instanceof Set) {
    return Array.from(value.keys());
  }

  return value;
};

const isObjectRecord = (value: unknown): value is SaveDataRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const determineProgressionStage = (saveData: SaveDataRecord): SaveProgressionStage => {
  if (
    saveData.reality ||
    saveData.celestials ||
    saveData.blackHole ||
    saveData.realities ||
    (isObjectRecord(saveData.reality) && Object.keys(saveData.reality).length > 3)
  ) {
    return 'reality';
  }

  if (
    saveData.eternityPoints ||
    saveData.eternities ||
    saveData.dilation ||
    saveData.timeShards ||
    saveData.totalTickGained
  ) {
    return 'eternity';
  }

  if (
    saveData.infinityPoints ||
    saveData.infinities ||
    saveData.replicanti ||
    saveData.break === true ||
    saveData.brake === true
  ) {
    return 'infinity';
  }

  return 'early';
};

const buildValidationSummary = (saveData: SaveDataRecord | null): SaveValidationSummary => {
  const issues: SaveValidationIssue[] = [];

  if (!isObjectRecord(saveData)) {
    issues.push({
      code: 'invalid-root',
      message: 'Save data must be an object',
      severity: 'error',
    });

    return {
      success: false,
      stage: 'early',
      issues,
    };
  }

  const coreProperties = ['version', 'lastUpdate'];
  for (const property of coreProperties) {
    if (!(property in saveData)) {
      issues.push({
        code: 'missing-core-property',
        message: `Missing core property: ${property}`,
        path: property,
        severity: 'warning',
      });
    }
  }

  return {
    success: issues.every((issue) => issue.severity !== 'error'),
    stage: determineProgressionStage(saveData),
    issues,
  };
};

const getSteps = (type: string, version: string, saveType: SaveType): EncodingStep<any, any>[] => {
  const steps = saveType === SaveType.Android ? androidSteps : pcSteps;
  const filteredSteps = steps.filter((step) => !step.condition || step.condition(version));
  const startKey = saveType === SaveType.Android ? 'android' : type;
  const versionValue = saveType === SaveType.Android ? versions.android : versions.pc;

  return filteredSteps.concat({
    encode: (value: string): string => `${startingString[startKey as keyof typeof startingString]}${versionValue}${value}`,
    decode: (value: string): string => value.slice(startingString[startKey as keyof typeof startingString].length + 3),
  });
};

const encodeText = (text: string, type: string, saveType: SaveType): string => {
  let result: any = text;
  const steps = getSteps(type, saveType === SaveType.Android ? versions.android : versions.pc, saveType);

  for (const step of steps) {
    result = step.encode(result, type);
  }

  return result as string;
};

const decodeText = (text: string, type: string): { decoded: string; saveType: SaveType } => {
  let saveType = SaveType.PC;
  let actualType = type;

  if (text.startsWith(startingString.android)) {
    saveType = SaveType.Android;
    actualType = 'android';
  }

  if (text.startsWith(startingString[actualType as keyof typeof startingString])) {
    const startLength = startingString[actualType as keyof typeof startingString].length;
    const version = text.slice(startLength, startLength + 3);
    const steps = getSteps(actualType, version, saveType);

    let result: any = text;
    for (let index = steps.length - 1; index >= 0; index -= 1) {
      result = steps[index].decode(result, actualType);
    }

    return { decoded: result as string, saveType };
  }

  return { decoded: decodeBase64(text), saveType: SaveType.PC };
};

export const detectSaveType = (encodedSaveData: string): SaveType => {
  if (typeof encodedSaveData !== 'string') {
    return SaveType.PC;
  }

  const cleanedData = encodedSaveData.trim().replace(/\\r/g, '');
  return cleanedData.startsWith(startingString.android) ? SaveType.Android : SaveType.PC;
};

export const validateDecodedSave = (saveData: SaveDataRecord | null): SaveValidationSummary => {
  return buildValidationSummary(saveData);
};

export const encodeSaveData = (saveData: SaveDataRecord, saveType: SaveType = SaveType.PC): string | null => {
  try {
    const json = JSON.stringify(saveData, jsonConverter);
    return encodeText(json, 'savefile', saveType);
  } catch (error) {
    console.error('Error during encryption:', error);
    return null;
  }
};

export const decodeSaveString = (encodedSaveData: string): SaveDecodeResult => {
  if (typeof encodedSaveData !== 'string') {
    return {
      data: null,
      saveType: SaveType.PC,
      validation: buildValidationSummary(null),
    };
  }

  try {
    const cleanedData = encodedSaveData.trim().replace(/\\r/g, '');
    const { decoded, saveType } = decodeText(cleanedData, 'savefile');
    const parsed = JSON.parse(decoded, (_key, value) => (value === 'Infinity' ? Number.POSITIVE_INFINITY : value)) as SaveDataRecord;

    return {
      data: parsed,
      saveType,
      validation: buildValidationSummary(parsed),
    };
  } catch (error) {
    console.error('Error during decryption:', error);
    return {
      data: null,
      saveType: detectSaveType(encodedSaveData),
      validation: buildValidationSummary(null),
    };
  }
};

const cloneSpecialJsonValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneSpecialJsonValue(entry)) as T;
  }

  if (value instanceof Set) {
    return new Set([...value].map((entry) => cloneSpecialJsonValue(entry))) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (isObjectRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneSpecialJsonValue(entry)])
    ) as T;
  }

  return value;
};

export const cloneSaveDataPreservingSpecialValues = <T extends SaveDataRecord>(value: T): T => {
  return cloneSpecialJsonValue(value);
};

export const cloneSaveData = cloneSaveDataPreservingSpecialValues;
