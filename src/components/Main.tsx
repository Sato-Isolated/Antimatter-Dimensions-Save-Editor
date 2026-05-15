import React, { useEffect, useRef, useState } from 'react';
import { useSave, useSaveSelector } from '../contexts/SaveContext';
import 'font-awesome/css/font-awesome.min.css';
import WorkspaceViewTabs from './workflow/WorkspaceViewTabs';
import WorkspacePanels from './workflow/WorkspacePanels';
import ExportReviewStepSection from './workflow/ExportReviewStepSection';
import ImportStepSection from './workflow/ImportStepSection';
import WorkflowAnnouncements from './workflow/WorkflowAnnouncements';
import StatusChip from './workflow/StatusChip';
import ValidationSummarySection from './workflow/ValidationSummarySection';
import WorkflowStepCard from './workflow/WorkflowStepCard';
import { WorkspaceView, workspaceViews } from './workflow/workspaceView';
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

    announceStatus(`Opened the ${workspaceViews.find((view) => view.id === nextView)?.label ?? nextView} workspace.`);
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
        <section className="card workflow-hero">
          <div className="card-body">
            <div className="workflow-hero-header">
              <div>
                <p className="workflow-kicker">Phase 3 workflow</p>
                <h2>Import, validate, edit, then review the export</h2>
                <p className="workflow-summary">
                  The shell now tracks format, validation, and dirty state directly from the centralized document store.
                </p>
                <p className="workflow-summary">
                  Keyboard shortcuts: Alt+1 import input, Alt+2 validate, Alt+3 workspace tabs, Alt+4 export output, Ctrl/Cmd+Shift+V paste, Ctrl/Cmd+Shift+T test, Ctrl/Cmd+Shift+E encrypt, Ctrl/Cmd+Shift+C copy.
                </p>
              </div>
              <div className="workflow-status-strip" aria-label="Save status overview">
                <StatusChip variant={isLoaded ? 'success' : 'neutral'}>{isLoaded ? 'Save loaded' : 'Awaiting import'}</StatusChip>
                <StatusChip variant={isDirty ? 'warning' : 'success'}>{isDirty ? 'Dirty edits' : 'Clean workspace'}</StatusChip>
                <StatusChip variant="neutral">Format: {isLoaded ? saveType.toUpperCase() : 'Unknown'}</StatusChip>
                <StatusChip variant={validationErrors.length > 0 ? 'danger' : validationWarnings.length > 0 ? 'warning' : 'success'}>
                  {validationIssues.length > 0 ? `${validationIssues.length} validation issue${validationIssues.length === 1 ? '' : 's'}` : 'Validation clear'}
                </StatusChip>
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        
        <div className="alert alert-info">
          <strong><i className="fa fa-android pulse-subtle" aria-hidden="true"></i> Save support:</strong> PC and Android saves share the same workflow now. Import a save, verify the summary, then choose the structured workspace or JSON editor for deeper edits.
        </div>
        
        <ImportStepSection
          rawSaveData={rawSaveData}
          onRawSaveDataChange={setRawSaveData}
          onPaste={handlePaste}
          onDecrypt={handleDecrypt}
          importInputRef={importInputRef}
        />
        
        <WorkflowStepCard
          step="Step 2"
          title="Validation summary"
          headerAside={(
            <button ref={runStructureTestButtonRef} className="btn secondary" onClick={handleRunStructureTest} disabled={!isLoaded}>
              <i className="fa fa-check-circle"></i> Run structure test
            </button>
          )}
        >
          <ValidationSummarySection
            isLoaded={isLoaded}
            document={saveDocument}
            validationIssues={validationIssues}
            validationErrorCount={validationErrors.length}
            validationWarningCount={validationWarnings.length}
            testResults={testResults}
            formattedLastChange={formatChangeTime(lastChange?.timestamp ?? null)}
          />
        </WorkflowStepCard>

        <WorkflowStepCard
          step="Step 3"
          title="Edit workspace"
          summary="Use the structured editor for safe field-level changes, switch to JSON for expert edits, or open preferences to adjust the shell."
          headerAside={(
            <WorkspaceViewTabs
              views={workspaceViews}
              activeView={workspaceView}
              onViewChange={handleWorkspaceViewChange}
              isJsonDisabled={!isLoaded}
              tabIdForView={tabIdForView}
              panelIdForView={panelIdForView}
            />
          )}
        >
            <WorkspacePanels
              workspaceView={workspaceView}
              hasMountedJsonEditor={hasMountedJsonEditor}
              isDirty={isDirty}
              isLoaded={isLoaded}
              saveType={saveType}
              lastChangeSource={lastChange?.source ?? 'none'}
              errorMessage={errorMessage}
              structuredPanelRef={structuredPanelRef}
              jsonPanelRef={jsonPanelRef}
              settingsPanelRef={settingsPanelRef}
              tabIdForView={tabIdForView}
              panelIdForView={panelIdForView}
            />
        </WorkflowStepCard>
        
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