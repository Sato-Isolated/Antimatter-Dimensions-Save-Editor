import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSave, useSaveSelector } from '../contexts/SaveContext';
import { SaveValidationIssue } from '../core/save/types';
import { copyTextToClipboard } from '../utils/clipboard';
import { formatExportBlockMessage, getBlockingValidationErrors } from '../utils/editorValidation';
import DiscardChangesDialog from './DiscardChangesDialog';
import EditorShell, { EditorShellHandle } from './EditorShell';
import { EditorMode } from './EditorModeTabs';
import ExportDialog from './ExportDialog';
import Header from './Header';
import ImportScreen from './ImportScreen';
import PreferencesDialog from './PreferencesDialog';

const EMPTY_VALIDATION_ISSUES: SaveValidationIssue[] = [];

const Main: React.FC = () => {
  const {
    rawSaveData,
    setRawSaveData,
    decryptSave,
    encryptSave,
    resetSave,
    isLoaded,
    errorMessage,
  } = useSave();
  const isDirty = useSaveSelector((state) => state.isDirty);
  const validationIssues = useSaveSelector((state) => state.document?.validation.issues ?? EMPTY_VALIDATION_ISSUES);
  const validationErrors = useMemo(() => getBlockingValidationErrors(validationIssues), [validationIssues]);

  const [editorMode, setEditorMode] = useState<EditorMode>('structured');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [exportOutput, setExportOutput] = useState('');
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'error'>('ready');
  const [announcement, setAnnouncement] = useState('');
  const editorShellRef = useRef<EditorShellHandle | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (validationErrors.length === 0) {
      setValidationMessage(null);
    }
  }, [validationErrors.length]);

  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);
  const closeExport = useCallback(() => setIsExportOpen(false), []);
  const closeDiscard = useCallback(() => setIsDiscardOpen(false), []);

  const handlePaste = useCallback(async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      setRawSaveData(text);
      setClipboardError(null);
      setAnnouncement('Encrypted save pasted.');
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
      setClipboardError('Clipboard access failed. Paste the save manually instead.');
    }
  }, [setRawSaveData]);

  const handleOpenEditor = useCallback((): void => {
    setClipboardError(null);
    setValidationMessage(null);
    decryptSave();
  }, [decryptSave]);

  const resetToImport = useCallback((): void => {
    resetSave();
    setEditorMode('structured');
    setIsDiscardOpen(false);
    setIsExportOpen(false);
    setClipboardError(null);
    setValidationMessage(null);
    setExportOutput('');
    setAnnouncement('Ready to import another save.');
  }, [resetSave]);

  const handleImportAnother = useCallback((): void => {
    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }

    resetToImport();
  }, [isDirty, resetToImport]);

  const handleExport = useCallback((): void => {
    if (validationErrors.length > 0) {
      setValidationMessage(formatExportBlockMessage(validationErrors.length));
      editorShellRef.current?.focusFirstError();
      return;
    }

    const output = encryptSave();
    if (!output) {
      setValidationMessage('The save could not be encrypted. Review the current document and try again.');
      return;
    }

    setExportOutput(output);
    setCopyState('ready');
    setValidationMessage(null);
    setIsExportOpen(true);
  }, [encryptSave, validationErrors.length]);

  const handleCopy = useCallback(async (): Promise<void> => {
    setCopyState('copied');
    setAnnouncement('Encrypted save copied.');
    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = window.setTimeout(() => setCopyState('ready'), 4000);

    try {
      await copyTextToClipboard(exportOutput);
    } catch (error) {
      console.error('Failed to copy encrypted save:', error);
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      setCopyState('error');
    }
  }, [exportOutput]);

  return (
    <>
      <Header
        isLoaded={isLoaded}
        onImportAnother={handleImportAnother}
        onExport={handleExport}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      {isLoaded ? (
        <EditorShell
          ref={editorShellRef}
          mode={editorMode}
          validationMessage={validationMessage}
          onModeChange={setEditorMode}
        />
      ) : (
        <ImportScreen
          value={rawSaveData}
          errorMessage={clipboardError ?? errorMessage}
          onChange={setRawSaveData}
          onPaste={handlePaste}
          onOpen={handleOpenEditor}
        />
      )}

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <PreferencesDialog isOpen={isPreferencesOpen} onClose={closePreferences} />
      <ExportDialog
        isOpen={isExportOpen}
        output={exportOutput}
        copyState={copyState}
        onClose={closeExport}
        onCopy={handleCopy}
      />
      <DiscardChangesDialog
        isOpen={isDiscardOpen}
        onCancel={closeDiscard}
        onConfirm={resetToImport}
      />
    </>
  );
};

export default Main;
