import pako from 'pako';
import { editorJsonReplacer, editorJsonReviver } from './editorJsonCodec';
import { SAVE_TRANSPORT_LIMITS } from './limits';
import {
  SaveObject,
  SaveDataShape,
  SaveDecodeResult,
  SaveProgressionStage,
  SaveTransportVersion,
  SaveType,
  SaveValidationIssue,
  SaveValidationSummary,
  isMobileSaveType,
} from '../model';

type UnknownRecord = Record<string, unknown>;

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

const startingString = {
  savefile: 'AntimatterDimensionsSavefileFormat',
  android: 'AntimatterDimensionsAndroidSaveFormat',
  apple: 'AntimatterDimensionsAppleSaveFormat',
};

const endingString = 'EndOfSavefile';
const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const pcVersions = new Set<SaveTransportVersion>(['AAA', 'AAB']);

class SaveTransportError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'SaveTransportError';
    this.code = code;
  }
}

const assertTransportLimit = (
  actual: number,
  maximum: number,
  code: string,
  message: string,
): void => {
  if (actual > maximum) {
    throw new SaveTransportError(code, message);
  }
};

const issue = (
  code: string,
  message: string,
  severity: SaveValidationIssue['severity'],
  path?: string,
): SaveValidationIssue => ({ code, message, severity, ...(path ? { path } : {}) });

const isObjectRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

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

const normalizeBase64 = (value: string): string => {
  if (!/^[A-Za-z0-9+/]*={0,2}$/u.test(value)) {
    throw new SaveTransportError('invalid-base64', 'Save payload contains invalid Base64 characters.');
  }

  const firstPadding = value.indexOf('=');
  const unpaddedLength = firstPadding === -1 ? value.length : firstPadding;
  if (unpaddedLength % 4 === 1 || value.length % 4 === 1) {
    throw new SaveTransportError('invalid-base64', 'Save payload has an invalid Base64 length.');
  }

  const padding = (4 - (value.length % 4)) % 4;
  return `${value}${'='.repeat(padding)}`;
};

const decodeBase64Bytes = (value: string): Uint8Array => {
  const normalized = normalizeBase64(value);
  const bytes: number[] = [];

  for (let index = 0; index < normalized.length; index += 4) {
    const chunk = normalized.slice(index, index + 4);
    const sextets = chunk.split('').map((character) => character === '=' ? 0 : base64Alphabet.indexOf(character));
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
  return encodeBase64Bytes(Uint8Array.from(value, (character) => character.charCodeAt(0)));
};

const decodeBase64 = (value: string): string => {
  return Array.from(decodeBase64Bytes(value)).map((entry) => String.fromCharCode(entry)).join('');
};

const encodePrintableBinary = (value: Uint8Array): string => {
  const binary = Array.from(value).map((entry) => String.fromCharCode(entry)).join('');
  return encodeBase64(binary)
    .replace(/=+$/gu, '')
    .replace(/0/gu, '0a')
    .replace(/\+/gu, '0b')
    .replace(/\//gu, '0c');
};

const decodePrintableBinary = (value: string): Uint8Array => {
  const base64 = value.replace(/0b/gu, '+').replace(/0c/gu, '/').replace(/0a/gu, '0');
  const binary = decodeBase64(base64);
  const bytes = Uint8Array.from(Array.from(binary).map((entry) => entry.charCodeAt(0)));
  assertTransportLimit(
    bytes.length,
    SAVE_TRANSPORT_LIMITS.maxCompressedBytes,
    'compressed-payload-too-large',
    'Save payload is too large to decompress safely.',
  );
  return bytes;
};

const encodePcText = (text: string): string => {
  const compressed = pako.deflate(encoder.encode(text));
  return `${startingString.savefile}AAB${encodePrintableBinary(compressed)}${endingString}`;
};

const encodeMobileText = (prefix: string, text: string): string => {
  const compressed = pako.gzip(encoder.encode(text));
  return `${prefix}AAA${encodePrintableBinary(compressed)}${endingString}`;
};

const decodeModernText = (
  payload: string,
  transportVersion: Exclude<SaveTransportVersion, 'legacy' | 'unknown'>,
  saveType: SaveType,
): string => {
  let encodedPayload = payload;
  const hasSuffix = isMobileSaveType(saveType) || transportVersion === 'AAB';

  if (hasSuffix) {
    if (!encodedPayload.endsWith(endingString)) {
      throw new SaveTransportError('invalid-suffix', `Save payload must end with ${endingString}.`);
    }
    encodedPayload = encodedPayload.slice(0, -endingString.length);
  }

  assertTransportLimit(
    encodedPayload.length,
    SAVE_TRANSPORT_LIMITS.maxEncodedCharacters,
    'encoded-payload-too-large',
    'Save payload is too large to decode safely.',
  );

  const compressed = decodePrintableBinary(encodedPayload);
  const inflated = isMobileSaveType(saveType) ? pako.ungzip(compressed) : pako.inflate(compressed);
  assertTransportLimit(
    inflated.length,
    SAVE_TRANSPORT_LIMITS.maxInflatedBytes,
    'inflated-payload-too-large',
    'Decompressed save payload is too large to process safely.',
  );
  return decoder.decode(inflated);
};

interface DecodedTransport {
  decoded: string;
  saveType: SaveType;
  transportVersion: SaveTransportVersion;
}

const unknownTransportVersion = (prefix: string, version: string): never => {
  throw new SaveTransportError(
    'unknown-transport-version',
    `Unsupported ${prefix} transport version: ${version || '(missing)'}. Expected AAA or AAB.`,
  );
};

const decodeText = (text: string): DecodedTransport => {
  if (text.startsWith(startingString.savefile)) {
    const version = text.slice(startingString.savefile.length, startingString.savefile.length + 3) as SaveTransportVersion;
    if (!pcVersions.has(version)) {
      unknownTransportVersion('PC', version);
    }

    return {
      decoded: decodeModernText(text.slice(startingString.savefile.length + 3), version as 'AAA' | 'AAB', SaveType.PC),
      saveType: SaveType.PC,
      transportVersion: version,
    };
  }

  if (text.startsWith(startingString.android)) {
    const version = text.slice(startingString.android.length, startingString.android.length + 3) as SaveTransportVersion;
    if (version !== 'AAA') {
      unknownTransportVersion('Android', version);
    }

    return {
      decoded: decodeModernText(text.slice(startingString.android.length + 3), 'AAA', SaveType.Android),
      saveType: SaveType.Android,
      transportVersion: 'AAA',
    };
  }

  if (text.startsWith(startingString.apple)) {
    const version = text.slice(startingString.apple.length, startingString.apple.length + 3) as SaveTransportVersion;
    if (version !== 'AAA') {
      unknownTransportVersion('Apple', version);
    }

    return {
      decoded: decodeModernText(text.slice(startingString.apple.length + 3), 'AAA', SaveType.Apple),
      saveType: SaveType.Apple,
      transportVersion: 'AAA',
    };
  }

  if (text.startsWith('AntimatterDimensions')) {
    throw new SaveTransportError('unknown-transport-marker', 'Save payload has an unknown Antimatter Dimensions transport marker.');
  }

  const legacyDecoded = decodeBase64(text);
  assertTransportLimit(
    legacyDecoded.length,
    SAVE_TRANSPORT_LIMITS.maxInflatedBytes,
    'inflated-payload-too-large',
    'Decoded legacy save payload is too large to process safely.',
  );

  return {
    decoded: legacyDecoded,
    saveType: SaveType.PC,
    transportVersion: 'legacy',
  };
};

const determineProgressionStage = (saveData: SaveObject): SaveProgressionStage => {
  if (
    saveData.reality
    || saveData.celestials
    || saveData.blackHole
    || saveData.realities
    || (isObjectRecord(saveData.reality) && Object.keys(saveData.reality).length > 3)
  ) {
    return 'reality';
  }

  if (
    saveData.eternityPoints
    || saveData.eternities
    || saveData.dilation
    || saveData.timeShards
    || saveData.totalTickGained
  ) {
    return 'eternity';
  }

  if (
    saveData.infinityPoints
    || saveData.infinities
    || saveData.replicanti
    || saveData.break === true
    || saveData.brake === true
  ) {
    return 'infinity';
  }

  return 'early';
};

const bigNumberPattern = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/iu;

const isBigNumberValue = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return value === Number.POSITIVE_INFINITY || Number.isFinite(value);
  }

  if (typeof value === 'string') {
    return value === 'Infinity' || bigNumberPattern.test(value.trim());
  }

  if (isObjectRecord(value)) {
    return Number.isFinite(value.mantissa) && Number.isInteger(value.exponent);
  }

  return false;
};

const findInvalidNumberPath = (value: unknown, currentPath = ''): string | null => {
  if (typeof value === 'number') {
    return Number.isNaN(value) || value === Number.NEGATIVE_INFINITY ? currentPath || '<root>' : null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const invalidPath = findInvalidNumberPath(value[index], `${currentPath}[${index}]`);
      if (invalidPath) {
        return invalidPath;
      }
    }
    return null;
  }

  if (value instanceof Set) {
    let index = 0;
    for (const entry of value) {
      const invalidPath = findInvalidNumberPath(entry, `${currentPath}[${index}]`);
      if (invalidPath) {
        return invalidPath;
      }
      index += 1;
    }
    return null;
  }

  if (isObjectRecord(value)) {
    for (const [key, entry] of Object.entries(value)) {
      const path = currentPath ? `${currentPath}.${key}` : key;
      const invalidPath = findInvalidNumberPath(entry, path);
      if (invalidPath) {
        return invalidPath;
      }
    }
  }

  return null;
};

const detectSaveShape = (saveData: unknown): SaveDataShape => {
  if (!isObjectRecord(saveData)) {
    return 'unknown';
  }

  if ('antimatter' in saveData) {
    return 'player';
  }

  if ('current' in saveData && 'saves' in saveData) {
    return 'storage-container';
  }

  return 'unknown';
};

const getDataVersion = (saveData: unknown): number | null => {
  if (!isObjectRecord(saveData) || typeof saveData.version !== 'number' || !Number.isInteger(saveData.version)) {
    return null;
  }

  return saveData.version;
};

const buildValidationSummary = (
  saveData: SaveObject | null,
  additionalIssues: SaveValidationIssue[] = [],
): SaveValidationSummary => {
  const issues = [...additionalIssues];

  if (!isObjectRecord(saveData)) {
    issues.push(issue('invalid-root', 'Save data must be an object.', 'error'));
    return { success: false, stage: 'early', issues };
  }

  const shape = detectSaveShape(saveData);
  if (shape === 'storage-container') {
    issues.push(issue(
      'unsupported-save-container',
      'This is an upstream storage container, not a direct player export.',
      'error',
    ));
  } else if (shape !== 'player') {
    issues.push(issue('invalid-save-shape', 'Save data must contain a direct player antimatter field.', 'error'));
  }

  if (!('antimatter' in saveData)) {
    issues.push(issue('missing-antimatter', 'Save data must contain antimatter.', 'error', 'antimatter'));
  } else if (!isBigNumberValue(saveData.antimatter)) {
    issues.push(issue('invalid-antimatter', 'Antimatter must be a valid large numeric value.', 'error', 'antimatter'));
  }

  if (!('version' in saveData)) {
    issues.push(issue('missing-version', 'Save data must contain an integer version.', 'error', 'version'));
  } else if (typeof saveData.version !== 'number' || !Number.isFinite(saveData.version) || !Number.isInteger(saveData.version)) {
    issues.push(issue('invalid-version', 'Save version must be a finite integer.', 'error', 'version'));
  }

  if (!('lastUpdate' in saveData)) {
    issues.push(issue('missing-core-property', 'Missing optional core property: lastUpdate.', 'warning', 'lastUpdate'));
  } else if (typeof saveData.lastUpdate !== 'number' || !Number.isFinite(saveData.lastUpdate)) {
    issues.push(issue('invalid-last-update', 'lastUpdate must be a finite number.', 'error', 'lastUpdate'));
  }

  const invalidNumberPath = findInvalidNumberPath(saveData);
  if (invalidNumberPath) {
    issues.push(issue('invalid-number', 'Save data contains NaN or negative infinity.', 'error', invalidNumberPath));
  }

  if ('blackHole' in saveData) {
    if (!Array.isArray(saveData.blackHole)) {
      issues.push(issue('invalid-structure', 'blackHole must be an array in PC saves.', 'error', 'blackHole'));
    } else {
      saveData.blackHole.forEach((entry, index) => {
        if (!isObjectRecord(entry)) {
          issues.push(issue('invalid-structure', 'Each black hole must be an object.', 'error', `blackHole[${index}]`));
        }
      });
    }
  }

  for (const path of ['records', 'celestials', 'reality']) {
    if (path in saveData && !isObjectRecord(saveData[path])) {
      issues.push(issue('invalid-structure', `${path} must be an object when present.`, 'error', path));
    }
  }

  return {
    success: issues.every((validationIssue) => validationIssue.severity !== 'error'),
    stage: determineProgressionStage(saveData as SaveObject),
    issues,
  };
};

const failureResult = (
  saveType: SaveType,
  transportVersion: SaveTransportVersion,
  additionalIssue: SaveValidationIssue,
): SaveDecodeResult => ({
  data: null,
  saveType,
  transportVersion,
  dataVersion: null,
  shape: 'unknown',
  validation: buildValidationSummary(null, [additionalIssue]),
});

export const detectSaveType = (encodedSaveData: string): SaveType => {
  if (typeof encodedSaveData !== 'string') {
    return SaveType.PC;
  }

  if (encodedSaveData.startsWith(startingString.apple)) {
    return SaveType.Apple;
  }

  return encodedSaveData.startsWith(startingString.android) ? SaveType.Android : SaveType.PC;
};

export const validateDecodedSave = (saveData: SaveObject | null): SaveValidationSummary => {
  return buildValidationSummary(saveData);
};

export const encodeSaveData = (saveData: SaveObject, saveType: SaveType = SaveType.PC): string | null => {
  try {
    const json = JSON.stringify(saveData, editorJsonReplacer);
    const encoded = isMobileSaveType(saveType)
      ? encodeMobileText(saveType === SaveType.Apple ? startingString.apple : startingString.android, json)
      : encodePcText(json);
    assertTransportLimit(
      encoded.length,
      SAVE_TRANSPORT_LIMITS.maxEncodedCharacters,
      'encoded-payload-too-large',
      'Encoded save payload is too large to export safely.',
    );
    return encoded;
  } catch {
    return null;
  }
};

export const decodeSaveString = (encodedSaveData: string): SaveDecodeResult => {
  if (typeof encodedSaveData !== 'string') {
    return failureResult(SaveType.PC, 'unknown', issue('invalid-input', 'Save data must be a string.', 'error'));
  }

  if (encodedSaveData.length > SAVE_TRANSPORT_LIMITS.maxEncodedCharacters) {
    return failureResult(
      detectSaveType(encodedSaveData),
      'unknown',
      issue('encoded-payload-too-large', 'Save payload is too large to decode safely.', 'error'),
    );
  }

  if (!encodedSaveData || /[\r\n]/u.test(encodedSaveData)) {
    return failureResult(
      detectSaveType(encodedSaveData),
      'unknown',
      issue('invalid-line-break', 'Save data must not contain carriage returns or line breaks.', 'error'),
    );
  }

  try {
    const { decoded, saveType, transportVersion } = decodeText(encodedSaveData);
    const parsed = JSON.parse(decoded, editorJsonReviver) as SaveObject;
    const shape = detectSaveShape(parsed);

    return {
      data: parsed,
      saveType,
      transportVersion,
      dataVersion: getDataVersion(parsed),
      shape,
      validation: buildValidationSummary(parsed),
    };
  } catch (error) {
    const saveType = detectSaveType(encodedSaveData);
    const matchedPrefix = [startingString.savefile, startingString.android, startingString.apple]
      .find((prefix) => encodedSaveData.startsWith(prefix));
    const versionCandidate = matchedPrefix
      ? encodedSaveData.slice(matchedPrefix.length, matchedPrefix.length + 3)
      : '';
    const transportVersion: SaveTransportVersion = versionCandidate === 'AAA' || versionCandidate === 'AAB'
      ? versionCandidate
      : (encodedSaveData.startsWith('AntimatterDimensions') ? 'unknown' : 'legacy');
    const serializationError = error instanceof SaveTransportError
      ? issue(error.code, error.message, 'error')
      : issue('invalid-json', 'Save data could not be decoded as valid JSON.', 'error');

    return failureResult(saveType, transportVersion, serializationError);
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
      Object.entries(value).map(([key, entry]) => [key, cloneSpecialJsonValue(entry)]),
    ) as T;
  }

  return value;
};

export const cloneSaveDataPreservingSpecialValues = <T extends SaveObject>(value: T): T => {
  return cloneSpecialJsonValue(value);
};

export const cloneSaveData = cloneSaveDataPreservingSpecialValues;
