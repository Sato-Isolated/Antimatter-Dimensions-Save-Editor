import React, { useEffect, useRef, useState } from 'react';
import { useSave, useSaveSelector } from '../contexts/SaveContext';
import 'font-awesome/css/font-awesome.min.css';
import ExportReviewStepSection from './workflow/ExportReviewStepSection';
import ImportStepSection from './workflow/ImportStepSection';
import WorkflowAnnouncements from './workflow/WorkflowAnnouncements';
import WorkflowHeroSection from './workflow/WorkflowHeroSection';
import WorkflowStatusBanners from './workflow/WorkflowStatusBanners';
import WorkflowWorkspaceStepSection from './workflow/WorkflowWorkspaceStepSection';
import ValidationStepSection from './workflow/ValidationStepSection';
import { WorkspaceView } from './workflow/workspaceView';
import { useShellAnnouncements } from './workflow/useShellAnnouncements';
import { useShellKeyboardShortcuts } from './workflow/useShellKeyboardShortcuts';

const formatChangeTime = (timestamp: number | null): string => {
  if (!timestamp) {
    return 'No changes yet';
  }

  return new Date(timestamp).toLocaleString();
};

const Main: React.FC = () => {
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('structured');
  const [hasMountedJsonEditor, setHasMountedJsonEditor] = useState(false);
  const structuredPanelRef = useRef<HTMLElement | null>(null);
  const jsonPanelRef = useRef<HTMLElement | null>(null);
  const settingsPanelRef = useRef<HTMLElement | null>(null);
  const importInputRef = useRef<HTMLTextAreaElement | null>(null);
  const runStructureTestButtonRef = useRef<HTMLButtonElement | null>(null);
  const encryptButtonRef = useRef<HTMLButtonElement | null>(null);
  const copyButtonRef = useRef<HTMLButtonElement | null>(null);
  const exportOutputRef = useRef<HTMLTextAreaElement | null>(null);
  const hasFocusedWorkspacePanel = useRef(false);
  const tabIdForView = (view: WorkspaceView): string => `workspace-tab-${view}`;
  const panelIdForView = (view: WorkspaceView): string => `workspace-panel-${view}`;

  useEffect(() => {
    if (!hasFocusedWorkspacePanel.current) {
      hasFocusedWorkspacePanel.current = true;
      return;
    }

    const nextPanel = workspaceView === 'structured'
      ? structuredPanelRef.current
      : workspaceView === 'json'
        ? jsonPanelRef.current
        : settingsPanelRef.current;
    nextPanel?.focus();
  }, [workspaceView]);

  const { 
    rawSaveData, 
    setRawSaveData, 
    decryptSave, 
    encryptSave, 
    encodedOutputData,
    errorMessage,
    isLoaded,
    saveType,
    testResults,
    testSave,
  } = useSave();
  const saveDocument = useSaveSelector((state) => state.document);
  const lastChange = useSaveSelector((state) => state.lastChange);
  const isDirty = useSaveSelector((state) => state.isDirty);

  const validationIssues = saveDocument?.validation.issues ?? [];
  const validationErrors = validationIssues.filter((issue) => issue.severity === 'error');
  const validationWarnings = validationIssues.filter((issue) => issue.severity === 'warning');
  const reviewMessage = !isLoaded
    ? 'Import and decode a save before generating an export string.'
    : encodedOutputData
      ? 'Encoded export is ready to copy.'
      : isDirty
        ? 'Changes are pending encryption.'
        : 'No encoded export has been generated yet.';

  const {
    statusAnnouncement,
    alertAnnouncement,
    announceStatus,
    announceAlert,
    clearAlert,
  } = useShellAnnouncements({
    errorMessage,
    isLoaded,
    isDirty,
    encodedOutputData,
    testResults,
  });

  const handleWorkspaceViewChange = (nextView: WorkspaceView) => {
    setWorkspaceView(nextView);
    if (nextView === 'json') {
      setHasMountedJsonEditor(true);
    }

    const workspaceLabelByView: Record<WorkspaceView, string> = {
      structured: 'Structured',
      json: 'JSON',
      settings: 'Preferences',
    };
    announceStatus(`Opened the ${workspaceLabelByView[nextView]} workspace.`);
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawSaveData(text);
      announceStatus('Encrypted save pasted into the import field.');
      clearAlert();
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
      announceAlert('Unable to read the clipboard. Paste the save manually instead.');
    }
  };
  
  const handleDecrypt = () => {
    decryptSave();
    announceStatus('Decrypting the imported save.');
  };

  const handleRunStructureTest = () => {
    testSave();
    announceStatus('Running the structure test.');
  };
  
  const handleEncrypt = () => {
    encryptSave();
    announceStatus('Generating the encrypted export string.');
  };
  
  const handleCopy = async () => {
    try {
      if (encodedOutputData) {
        await navigator.clipboard.writeText(encodedOutputData);
        announceStatus('Encrypted save copied to the clipboard.');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      announceAlert('Unable to copy the encrypted save to the clipboard.');
    }
  };

  const focusCurrentWorkspaceTab = () => {
    const tabElement = globalThis.document.getElementById(tabIdForView(workspaceView));
    if (tabElement instanceof HTMLButtonElement) {
      tabElement.focus();
    }
  };

  useShellKeyboardShortcuts({
    onPaste: handlePaste,
    onDecrypt: handleDecrypt,
    onRunStructureTest: handleRunStructureTest,
    onEncrypt: handleEncrypt,
    onCopy: handleCopy,
    canRunStructureTest: isLoaded,
    canEncrypt: isLoaded,
    canCopy: Boolean(encodedOutputData),
    importInputRef,
    runStructureTestButtonRef,
    encryptButtonRef,
    copyButtonRef,
    focusCurrentWorkspaceTab,
    exportOutputRef,
  });
  
  return (
    <main className="editor-container workflow-shell" id="save-editor">
      <WorkflowAnnouncements statusMessage={statusAnnouncement} alertMessage={alertAnnouncement} />

      <div className="main-content">
        <WorkflowHeroSection
          isLoaded={isLoaded}
          isDirty={isDirty}
          saveTypeLabel={saveType.toUpperCase()}
          validationIssueCount={validationIssues.length}
          validationErrorCount={validationErrors.length}
          validationWarningCount={validationWarnings.length}
        />

        <WorkflowStatusBanners errorMessage={errorMessage} />
        
        <ImportStepSection
          rawSaveData={rawSaveData}
          onRawSaveDataChange={setRawSaveData}
          onPaste={handlePaste}
          onDecrypt={handleDecrypt}
          importInputRef={importInputRef}
        />
        
        <ValidationStepSection
          isLoaded={isLoaded}
          document={saveDocument}
          validationIssues={validationIssues}
          validationErrorCount={validationErrors.length}
          validationWarningCount={validationWarnings.length}
          testResults={testResults}
          formattedLastChange={formatChangeTime(lastChange?.timestamp ?? null)}
          onRunStructureTest={handleRunStructureTest}
          runStructureTestButtonRef={runStructureTestButtonRef}
        />

        <WorkflowWorkspaceStepSection
          workspaceView={workspaceView}
          onWorkspaceViewChange={handleWorkspaceViewChange}
          hasMountedJsonEditor={hasMountedJsonEditor}
          isDirty={isDirty}
          isLoaded={isLoaded}
          saveType={saveType}
          errorMessage={errorMessage}
          lastChangeSource={lastChange?.source ?? 'none'}
          structuredPanelRef={structuredPanelRef}
          jsonPanelRef={jsonPanelRef}
          settingsPanelRef={settingsPanelRef}
          tabIdForView={tabIdForView}
          panelIdForView={panelIdForView}
        />
        
        <ExportReviewStepSection
          isLoaded={isLoaded}
          saveTypeLabel={saveType.toUpperCase()}
          isDirty={isDirty}
          lastChangePath={lastChange?.path || 'Root document'}
          reviewMessage={reviewMessage}
          encodedOutputData={encodedOutputData}
          onEncrypt={handleEncrypt}
          onCopy={handleCopy}
          canEncrypt={isLoaded}
          canCopy={Boolean(encodedOutputData)}
          exportOutputRef={exportOutputRef}
          encryptButtonRef={encryptButtonRef}
          copyButtonRef={copyButtonRef}
        />
      </div>
    </main>
  );
};

export default Main; 