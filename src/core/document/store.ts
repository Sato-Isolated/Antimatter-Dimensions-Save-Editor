import { setValueAtPath } from './path';
import {
  cloneSaveDataPreservingSpecialValues,
  decodeSaveString,
  encodeSaveData,
  validateDecodedSave,
} from '../save/serialization';
import { validateRegisteredFields } from '../save/fieldRegistry';
import {
  DocumentPath,
  SaveChangeMeta,
  SaveDataRecord,
  SaveDocumentSnapshot,
  SaveEditorState,
  SaveType,
} from '../save/types';

type Listener = () => void;

const buildDocumentValidation = (workingData: SaveDataRecord, saveType: SaveType) => {
  const baseValidation = validateDecodedSave(workingData);
  const fieldIssues = validateRegisteredFields(workingData, saveType);

  return {
    ...baseValidation,
    issues: [...baseValidation.issues, ...fieldIssues],
    success: baseValidation.success && fieldIssues.every((issue) => issue.severity !== 'error'),
  };
};

const createInitialState = (): SaveEditorState => ({
  rawSaveData: '',
  encodedOutputData: '',
  encryptedSave: '',
  errorMessage: null,
  isLoaded: false,
  isDirty: false,
  saveType: SaveType.PC,
  document: null,
  lastChange: null,
});

export class SaveEditorStore {
  private state: SaveEditorState = createInitialState();

  private readonly listeners = new Set<Listener>();

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = (): SaveEditorState => this.state;

  setRawSaveData = (rawSaveData: string): void => {
    this.patch({ rawSaveData, errorMessage: null });
  };

  loadFromEncoded = (rawSaveData: string = this.state.rawSaveData): { success: boolean; errorMessage: string | null } => {
    const decryptResult = decodeSaveString(rawSaveData);

    if (!decryptResult.data || !decryptResult.validation.success) {
      const errorMessage = decryptResult.validation.issues.find((issue) => issue.severity === 'error')?.message
        ?? 'Save data is invalid or corrupted';

      this.patch({
        rawSaveData,
        encryptedSave: '',
        encodedOutputData: '',
        errorMessage,
        isLoaded: false,
        isDirty: false,
        saveType: decryptResult.saveType,
        document: null,
      });

      return { success: false, errorMessage };
    }

    const originalData = cloneSaveDataPreservingSpecialValues(decryptResult.data);
    const workingData = cloneSaveDataPreservingSpecialValues(decryptResult.data);
    const document: SaveDocumentSnapshot = {
      sourceType: decryptResult.saveType,
      originalData,
      workingData,
      validation: buildDocumentValidation(workingData, decryptResult.saveType),
    };

    this.patch({
      rawSaveData,
      encryptedSave: rawSaveData,
      encodedOutputData: '',
      errorMessage: null,
      isLoaded: true,
      isDirty: false,
      saveType: decryptResult.saveType,
      document,
      lastChange: {
        path: '',
        timestamp: Date.now(),
        source: 'import',
      },
    });

    return { success: true, errorMessage: null };
  };

  replaceWorkingData = (workingData: SaveDataRecord, source: SaveChangeMeta['source'] = 'json'): void => {
    if (!this.state.document) {
      return;
    }

    const document: SaveDocumentSnapshot = {
      ...this.state.document,
      workingData,
      validation: buildDocumentValidation(workingData, this.state.document.sourceType),
    };

    this.patch({
      document,
      encodedOutputData: '',
      errorMessage: null,
      isDirty: true,
      lastChange: {
        path: '',
        timestamp: Date.now(),
        source,
      },
    });
  };

  updateDocumentAtPath = (path: DocumentPath, value: unknown, source: SaveChangeMeta['source'] = 'structured'): void => {
    if (!this.state.document) {
      return;
    }

    const workingData = setValueAtPath(this.state.document.workingData, path, value);
    const document: SaveDocumentSnapshot = {
      ...this.state.document,
      workingData,
      validation: buildDocumentValidation(workingData, this.state.document.sourceType),
    };

    this.patch({
      document,
      encodedOutputData: '',
      isDirty: true,
      lastChange: {
        path,
        timestamp: Date.now(),
        source,
      },
    });
  };

  encodeWorkingData = (): string => {
    if (!this.state.document) {
      this.patch({ errorMessage: 'No save data to encrypt' });
      return '';
    }

    const encoded = encodeSaveData(this.state.document.workingData, this.state.document.sourceType);
    if (!encoded) {
      this.patch({ errorMessage: 'Encryption failed' });
      return '';
    }

    this.patch({
      encodedOutputData: encoded,
      encryptedSave: encoded,
      errorMessage: null,
    });

    return encoded;
  };

  setErrorMessage = (errorMessage: string | null): void => {
    this.patch({ errorMessage });
  };

  reset = (): void => {
    this.state = createInitialState();
    this.emit();
  };

  private patch(partialState: Partial<SaveEditorState>): void {
    this.state = {
      ...this.state,
      ...partialState,
    };
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const createSaveEditorStore = (): SaveEditorStore => new SaveEditorStore();
