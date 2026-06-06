import React, { Suspense, lazy } from 'react';
import StructuredEditor from '../StructuredEditor';
import ThemeSelector from '../ThemeSelector';
import StatusChip from './StatusChip';
import { WorkspaceView } from './workspaceView';

const JsonEditor = lazy(() => import('../JsonEditor'));

type WorkspacePanelsProps = {
  workspaceView: WorkspaceView;
  hasMountedJsonEditor: boolean;
  isDirty: boolean;
  isLoaded: boolean;
  saveType: string;
  lastChangeSource: string;
  errorMessage: string | null;
  structuredPanelRef: React.RefObject<HTMLElement | null>;
  jsonPanelRef: React.RefObject<HTMLElement | null>;
  settingsPanelRef: React.RefObject<HTMLElement | null>;
  tabIdForView: (view: WorkspaceView) => string;
  panelIdForView: (view: WorkspaceView) => string;
};

const WorkspacePanels: React.FC<WorkspacePanelsProps> = ({
  workspaceView,
  hasMountedJsonEditor,
  isDirty,
  isLoaded,
  saveType,
  lastChangeSource,
  errorMessage,
  structuredPanelRef,
  jsonPanelRef,
  settingsPanelRef,
  tabIdForView,
  panelIdForView,
}) => {
  return (
    <>
      <div className="workspace-meta-bar">
        <StatusChip variant={isDirty ? 'warning' : 'success'}>{isDirty ? 'Unsaved edits in memory' : 'No staged edits'}</StatusChip>
        <StatusChip variant={errorMessage ? 'danger' : 'neutral'}>{errorMessage ? 'Store error present' : 'Store healthy'}</StatusChip>
        <StatusChip variant="neutral">Format: {isLoaded ? saveType.toUpperCase() : 'Unknown'}</StatusChip>
        <StatusChip variant="neutral">Last source: {lastChangeSource}</StatusChip>
      </div>

      <div className="workspace-panel">
        <section
          id={panelIdForView('structured')}
          ref={structuredPanelRef}
          role="tabpanel"
          aria-labelledby={tabIdForView('structured')}
          hidden={workspaceView !== 'structured'}
          tabIndex={-1}
        >
          {workspaceView === 'structured' && <StructuredEditor isActive={workspaceView === 'structured'} />}
        </section>

        {(workspaceView === 'json' || hasMountedJsonEditor) && (
          <section
            id={panelIdForView('json')}
            ref={jsonPanelRef}
            className="json-workspace-shell"
            role="tabpanel"
            aria-labelledby={tabIdForView('json')}
            hidden={workspaceView !== 'json'}
            tabIndex={-1}
          >
            {!hasMountedJsonEditor ? (
              <div className="editor-empty-state compact">
                <h3>JSON editor will mount on demand</h3>
                <p>Open the JSON workspace once to load the heavy editor only when you need it.</p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="editor-empty-state compact">
                    <h3>Loading JSON workspace</h3>
                    <p>Preparing the tree and text editor for the current save snapshot.</p>
                  </div>
                }
              >
                <JsonEditor isActive={workspaceView === 'json'} />
              </Suspense>
            )}
          </section>
        )}

        <section
          id={panelIdForView('settings')}
          ref={settingsPanelRef}
          role="tabpanel"
          aria-labelledby={tabIdForView('settings')}
          hidden={workspaceView !== 'settings'}
          tabIndex={-1}
        >
          {workspaceView === 'settings' && (
            <div className="workspace-settings-panel">
              <div className="settings-block">
                <h3>Theme</h3>
                <p>Theme preferences stay compatible with the existing selector and local storage behavior.</p>
                <ThemeSelector />
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default WorkspacePanels;
