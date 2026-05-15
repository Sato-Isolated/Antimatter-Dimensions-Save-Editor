import React from 'react';
import WorkflowStepCard from './WorkflowStepCard';
import WorkspacePanels from './WorkspacePanels';
import WorkspaceViewTabs from './WorkspaceViewTabs';
import { WorkspaceView, workspaceViews } from './workspaceView';

type WorkflowWorkspaceStepSectionProps = {
  workspaceView: WorkspaceView;
  onWorkspaceViewChange: (view: WorkspaceView) => void;
  hasMountedJsonEditor: boolean;
  isDirty: boolean;
  isLoaded: boolean;
  saveType: string;
  errorMessage: string | null;
  lastChangeSource: string;
  structuredPanelRef: React.RefObject<HTMLElement | null>;
  jsonPanelRef: React.RefObject<HTMLElement | null>;
  settingsPanelRef: React.RefObject<HTMLElement | null>;
  tabIdForView: (view: WorkspaceView) => string;
  panelIdForView: (view: WorkspaceView) => string;
};

const WorkflowWorkspaceStepSection: React.FC<WorkflowWorkspaceStepSectionProps> = ({
  workspaceView,
  onWorkspaceViewChange,
  hasMountedJsonEditor,
  isDirty,
  isLoaded,
  saveType,
  errorMessage,
  lastChangeSource,
  structuredPanelRef,
  jsonPanelRef,
  settingsPanelRef,
  tabIdForView,
  panelIdForView,
}) => {
  return (
    <WorkflowStepCard
      step="Step 3"
      title="Edit workspace"
      summary="Use the structured editor for safe field-level changes, switch to JSON for expert edits, or open preferences to adjust the shell."
      headerAside={(
        <WorkspaceViewTabs
          views={workspaceViews}
          activeView={workspaceView}
          onViewChange={onWorkspaceViewChange}
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
        lastChangeSource={lastChangeSource}
        errorMessage={errorMessage}
        structuredPanelRef={structuredPanelRef}
        jsonPanelRef={jsonPanelRef}
        settingsPanelRef={settingsPanelRef}
        tabIdForView={tabIdForView}
        panelIdForView={panelIdForView}
      />
    </WorkflowStepCard>
  );
};

export default WorkflowWorkspaceStepSection;
