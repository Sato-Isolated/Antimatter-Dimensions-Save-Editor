import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSave, useSaveSelector } from '../contexts/SaveContext';
import CommandBarActions from './workflow/CommandBarActions';
import ExportReviewStepSection from './workflow/ExportReviewStepSection';
import ImportStepSection from './workflow/ImportStepSection';
import SaveInspector from './workflow/SaveInspector';
import WorkflowAnnouncements from './workflow/WorkflowAnnouncements';
import WorkflowRail from './workflow/WorkflowRail';
import WorkflowStatusBanners from './workflow/WorkflowStatusBanners';
import WorkflowWorkspaceStepSection from './workflow/WorkflowWorkspaceStepSection';
import ValidationStepSection from './workflow/ValidationStepSection';
import { WorkspaceView } from './workflow/workspaceView';
import { WorkflowStepId, workflowSteps } from './workflow/workflowSteps';
import { useShellAnnouncements } from './workflow/useShellAnnouncements';
import { useShellKeyboardShortcuts } from './workflow/useShellKeyboardShortcuts';

const formatChangeTime = (timestamp: number | null): string => {
  if (!timestamp) {
    return 'No changes yet';
  }

  return new Date(timestamp).toLocaleString();
};

const Main: React.FC = () => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<WorkflowStepId>('import');
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
  const wasLoadedRef = useRef(false);
  const tabIdForView = useCallback((view: WorkspaceView): string => `workspace-tab-${view}`, []);
  const panelIdForView = useCallback((view: WorkspaceView): string => `workspace-panel-${view}`, []);

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
  const saveTypeLabel = saveType.toUpperCase();
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

  useEffect(() => {
    if (isLoaded && !wasLoadedRef.current) {
      setActiveWorkflowStep('edit');
    }

    wasLoadedRef.current = isLoaded;
  }, [isLoaded]);

  const focusAfterStepChange = useCallback((focusCallback: () => void): void => {
    window.setTimeout(focusCallback, 0);
  }, []);

  const focusImportInput = useCallback(() => {
    setActiveWorkflowStep('import');
    focusAfterStepChange(() => importInputRef.current?.focus());
  }, [focusAfterStepChange]);

  const focusRunValidationButton = useCallback(() => {
    setActiveWorkflowStep('validate');
    focusAfterStepChange(() => runStructureTestButtonRef.current?.focus());
  }, [focusAfterStepChange]);

  const focusCurrentWorkspaceTab = useCallback(() => {
    setActiveWorkflowStep('edit');
    focusAfterStepChange(() => {
      const tabElement = globalThis.document.getElementById(tabIdForView(workspaceView));
      if (tabElement instanceof HTMLButtonElement) {
        tabElement.focus();
      }
    });
  }, [focusAfterStepChange, tabIdForView, workspaceView]);

  const focusExportOutput = useCallback(() => {
    setActiveWorkflowStep('export');
    focusAfterStepChange(() => exportOutputRef.current?.focus());
  }, [focusAfterStepChange]);

  const focusEncryptButton = useCallback(() => {
    setActiveWorkflowStep('export');
    focusAfterStepChange(() => encryptButtonRef.current?.focus());
  }, [focusAfterStepChange]);

  const focusCopyButton = useCallback(() => {
    setActiveWorkflowStep('export');
    focusAfterStepChange(() => copyButtonRef.current?.focus());
  }, [focusAfterStepChange]);

  const handleWorkspaceViewChange = (nextView: WorkspaceView) => {
    setActiveWorkflowStep('edit');
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
    setActiveWorkflowStep('import');
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
    setActiveWorkflowStep('validate');
    decryptSave();
    announceStatus('Decrypting the imported save.');
  };

  const handleRunStructureTest = () => {
    setActiveWorkflowStep('validate');
    testSave();
    announceStatus('Running the structure test.');
  };
  
  const handleEncrypt = () => {
    setActiveWorkflowStep('export');
    encryptSave();
    announceStatus('Generating the encrypted export string.');
  };
  
  const handleCopy = async () => {
    setActiveWorkflowStep('export');
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

  const stepStatusById = useMemo(() => ({
    import: isLoaded
      ? { label: 'Decoded', variant: 'success' as const }
      : rawSaveData.trim()
        ? { label: 'Input ready', variant: 'warning' as const }
        : { label: 'Awaiting import', variant: 'neutral' as const },
    validate: !isLoaded
      ? { label: 'No save', variant: 'neutral' as const }
      : validationErrors.length > 0
        ? { label: `${validationErrors.length} errors`, variant: 'danger' as const }
        : validationWarnings.length > 0
          ? { label: `${validationWarnings.length} warnings`, variant: 'warning' as const }
          : { label: 'Clear', variant: 'success' as const },
    edit: !isLoaded
      ? { label: 'Locked', variant: 'neutral' as const }
      : isDirty
        ? { label: 'Unsaved', variant: 'warning' as const }
        : { label: 'Ready', variant: 'success' as const },
    export: encodedOutputData
      ? { label: 'Ready', variant: 'success' as const }
      : isDirty
        ? { label: 'Pending', variant: 'warning' as const }
        : { label: 'Not generated', variant: 'neutral' as const },
  }), [
    encodedOutputData,
    isDirty,
    isLoaded,
    rawSaveData,
    validationErrors.length,
    validationWarnings.length,
  ]);

  useShellKeyboardShortcuts({
    onPaste: handlePaste,
    onDecrypt: handleDecrypt,
    onRunStructureTest: handleRunStructureTest,
    onEncrypt: handleEncrypt,
    onCopy: handleCopy,
    canRunStructureTest: isLoaded,
    canEncrypt: isLoaded,
    canCopy: Boolean(encodedOutputData),
    focusCurrentWorkspaceTab,
    focusImportInput,
    focusRunValidationButton,
    focusExportOutput,
    focusEncryptButton,
    focusCopyButton,
  });
  
  return (
    <main className="editor-container workflow-shell" id="save-editor">
      <WorkflowAnnouncements statusMessage={statusAnnouncement} alertMessage={alertAnnouncement} />

      <div className="compact-tool-shell">
        <CommandBarActions
          activeStep={activeWorkflowStep}
          isLoaded={isLoaded}
          isDirty={isDirty}
          saveTypeLabel={saveTypeLabel}
          encodedOutputData={encodedOutputData}
          onPaste={handlePaste}
          onDecrypt={handleDecrypt}
          onRunStructureTest={handleRunStructureTest}
          onEncrypt={handleEncrypt}
          onCopy={handleCopy}
        />

        <div className="compact-tool-layout">
          <WorkflowRail
            steps={workflowSteps}
            activeStep={activeWorkflowStep}
            statusByStep={stepStatusById}
            onStepSelect={setActiveWorkflowStep}
          />

          <div className="tool-workspace">
            <WorkflowStatusBanners errorMessage={errorMessage} />
            
            {activeWorkflowStep === 'import' && (
              <ImportStepSection
                rawSaveData={rawSaveData}
                onRawSaveDataChange={setRawSaveData}
                onPaste={handlePaste}
                onDecrypt={handleDecrypt}
                importInputRef={importInputRef}
              />
            )}
            
            {activeWorkflowStep === 'validate' && (
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
            )}

            {activeWorkflowStep === 'edit' && (
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
            )}
            
            {activeWorkflowStep === 'export' && (
              <ExportReviewStepSection
                isLoaded={isLoaded}
                saveTypeLabel={saveTypeLabel}
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
            )}
          </div>

          <SaveInspector
            activeStep={activeWorkflowStep}
            isLoaded={isLoaded}
            isDirty={isDirty}
            saveTypeLabel={saveTypeLabel}
            validationIssueCount={validationIssues.length}
            validationErrorCount={validationErrors.length}
            validationWarningCount={validationWarnings.length}
            errorMessage={errorMessage}
            testResults={testResults}
            formattedLastChange={formatChangeTime(lastChange?.timestamp ?? null)}
            lastChangePath={lastChange?.path || 'Root document'}
            encodedOutputData={encodedOutputData}
          />
        </div>
      </div>
    </main>
  );
};

export default Main; 
