export enum SaveType {
  PC = 'pc',
  Android = 'android',
}

export type DocumentPath = string;

export type SaveDataRecord = Record<string, any>;

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
  originalData: SaveDataRecord;
  workingData: SaveDataRecord;
  validation: SaveValidationSummary;
}

export interface SaveDecodeResult {
  data: SaveDataRecord | null;
  saveType: SaveType;
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
