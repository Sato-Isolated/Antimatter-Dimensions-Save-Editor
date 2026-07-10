import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { SaveType } from '../services/SaveService';
import { createSaveEditorStore, SaveEditorStore } from '../core/document/store';
import { SaveDataRecord, SaveEditorState } from '../core/save/types';
import { getValueAtPath } from '../core/document/path';

// Interface for save context
export interface SaveContextType {
  originalSaveData: SaveDataRecord | null;
  modifiedSaveData: SaveDataRecord | null;
  encryptedSave: string;
  rawSaveData: string;
  encodedOutputData: string;
  isLoaded: boolean;
  saveType: SaveType;
  errorMessage: string | null;
  decryptSave: () => void;
  encryptSave: () => string;
  resetSave: () => void;
  updateSaveData: (path: string, value: unknown) => void;
  setRawSaveData: (data: string) => void;
}

interface SaveActions {
  setRawSaveData: (data: string) => void;
  decryptSave: () => void;
  encryptSave: () => string;
  resetSave: () => void;
  updateSaveData: (path: string, value: unknown) => void;
  replaceSaveData: (data: SaveDataRecord) => void;
}

const SaveStoreContext = createContext<SaveEditorStore | null>(null);
const SaveActionsContext = createContext<SaveActions | null>(null);

const useSaveStore = (): SaveEditorStore => {
  const store = useContext(SaveStoreContext);
  if (!store) {
    throw new Error('useSaveStore must be used within a SaveProvider');
  }

  return store;
};

export const useSaveSelector = <T,>(selector: (state: SaveEditorState) => T): T => {
  const store = useSaveStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
};

export const useSaveActions = (): SaveActions => {
  const actions = useContext(SaveActionsContext);
  if (!actions) {
    throw new Error('useSaveActions must be used within a SaveProvider');
  }

  return actions;
};

export const useSaveFieldValue = <T = unknown,>(path: string): T | undefined => {
  return useSaveSelector((state) => {
    if (!state.document) {
      return undefined;
    }

    return getValueAtPath<T>(state.document.workingData, path);
  });
};

export const useSave = (): SaveContextType => {
  const originalSaveData = useSaveSelector((state) => state.document?.originalData ?? null);
  const modifiedSaveData = useSaveSelector((state) => state.document?.workingData ?? null);
  const encryptedSave = useSaveSelector((state) => state.encryptedSave);
  const rawSaveData = useSaveSelector((state) => state.rawSaveData);
  const encodedOutputData = useSaveSelector((state) => state.encodedOutputData);
  const isLoaded = useSaveSelector((state) => state.isLoaded);
  const saveType = useSaveSelector((state) => state.saveType);
  const errorMessage = useSaveSelector((state) => state.errorMessage);
  const actions = useSaveActions();

  return {
    originalSaveData,
    modifiedSaveData,
    encryptedSave,
    rawSaveData,
    encodedOutputData,
    isLoaded,
    saveType,
    errorMessage,
    decryptSave: actions.decryptSave,
    encryptSave: actions.encryptSave,
    resetSave: actions.resetSave,
    updateSaveData: actions.updateSaveData,
    setRawSaveData: actions.setRawSaveData,
  };
};

// Props for the context provider
interface SaveProviderProps {
  children: ReactNode;
}

// Save context provider
export const SaveProvider: React.FC<SaveProviderProps> = ({ children }) => {
  const storeRef = useRef<SaveEditorStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSaveEditorStore();
  }

  const actions = useMemo<SaveActions>(() => {
    const store = storeRef.current!;

    return {
      setRawSaveData: (data: string) => store.setRawSaveData(data),
      decryptSave: () => {
        store.loadFromEncoded();
      },
      encryptSave: () => store.encodeWorkingData(),
      resetSave: () => store.reset(),
      updateSaveData: (path: string, value: unknown) => {
        if (!path) {
          store.replaceWorkingData(value as SaveDataRecord, 'json');
          return;
        }

        store.updateDocumentAtPath(path, value, 'structured');
      },
      replaceSaveData: (data: SaveDataRecord) => store.replaceWorkingData(data, 'json'),
    };
  }, []);

  return (
    <SaveStoreContext.Provider value={storeRef.current}>
      <SaveActionsContext.Provider value={actions}>
        {children}
      </SaveActionsContext.Provider>
    </SaveStoreContext.Provider>
  );
};
