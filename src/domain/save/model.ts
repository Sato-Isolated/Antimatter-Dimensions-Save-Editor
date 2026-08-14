/**
 * Canonical values used by the save editor.
 *
 * The game format is JSON-shaped, but the editor keeps a small number of
 * special values in memory until the transport boundary: Sets are useful for
 * collection controls and Date values may occur in tooling fixtures. The
 * transport codec is responsible for converting those values to the wire
 * representation.
 */
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonArray
  | Set<JsonValue>
  | Date;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = JsonValue[];
export type SaveObject = JsonObject;
export type SaveArray = JsonArray;

/** Transitional name kept for existing internal imports; it is no longer an untyped record. */
export enum SaveType {
  PC = 'pc',
  Android = 'android',
  Apple = 'apple',
}

/** Android and iOS ship the same mobile save model; only the transport marker differs. */
export const isMobileSaveType = (saveType: SaveType): boolean =>
  saveType === SaveType.Android || saveType === SaveType.Apple;

export type DocumentPath = string;

export type SaveTransportVersion = 'legacy' | 'AAA' | 'AAB' | 'unknown';
export type SaveDataShape = 'player' | 'storage-container' | 'unknown';

export type SaveProgressionStage = 'early' | 'infinity' | 'eternity' | 'reality';

export interface BigNumberLike {
  mantissa: number;
  exponent: number;
}

export interface SaveValidationIssue {
  code: string;
  message: string;
  path?: DocumentPath;
  severity: 'error' | 'warning';
}

export interface SaveValidationSummary {
  success: boolean;
  stage: SaveProgressionStage;
  issues: SaveValidationIssue[];
}

export interface SaveDocumentSnapshot {
  sourceType: SaveType;
  originalData: SaveObject;
  workingData: SaveObject;
  validation: SaveValidationSummary;
  revision: number;
  transportVersion: SaveTransportVersion;
  dataVersion: number | null;
  shape: SaveDataShape;
}

export interface SaveDecodeResult {
  data: SaveObject | null;
  saveType: SaveType;
  transportVersion: SaveTransportVersion;
  dataVersion: number | null;
  shape: SaveDataShape;
  validation: SaveValidationSummary;
}

export interface SaveChangeMeta {
  path: DocumentPath;
  timestamp: number;
  source: 'structured' | 'json' | 'import';
}

export interface SaveEditorState {
  rawSaveData: string;
  encodedOutputData: string;
  encryptedSave: string;
  errorMessage: string | null;
  isLoaded: boolean;
  isDirty: boolean;
  saveType: SaveType;
  document: SaveDocumentSnapshot | null;
  lastChange: SaveChangeMeta | null;
}

export const isJsonObject = (value: unknown): value is JsonObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && !(value instanceof Date)
    && !(value instanceof Set);
};

export const isJsonArray = (value: unknown): value is JsonArray => Array.isArray(value);
