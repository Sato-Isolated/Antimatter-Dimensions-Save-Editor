import React from 'react';
import { SaveTestResults } from '../../core/save/types';
import StatusChip from './StatusChip';
import { WorkflowStepId, workflowStepLabelById } from './workflowSteps';

type InspectorMetric = {
  label: string;
  value: React.ReactNode;
};

type SaveInspectorProps = {
  activeStep: WorkflowStepId;
  isLoaded: boolean;
  isDirty: boolean;
  saveTypeLabel: string;
  validationIssueCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
  errorMessage: string | null;
  testResults: SaveTestResults | null;
  formattedLastChange: string;
  lastChangePath: string;
  encodedOutputData: string;
};

const SaveInspector: React.FC<SaveInspectorProps> = ({
  activeStep,
  isLoaded,
  isDirty,
  saveTypeLabel,
  validationIssueCount,
  validationErrorCount,
  validationWarningCount,
  errorMessage,
  testResults,
  formattedLastChange,
  lastChangePath,
  encodedOutputData,
}) => {
  const saveInfo: InspectorMetric[] = [
    { label: 'Platform', value: isLoaded ? saveTypeLabel : 'Unknown' },
    { label: 'Loaded', value: isLoaded ? 'Yes' : '-' },
    { label: 'Last change', value: formattedLastChange },
    { label: 'Last path', value: lastChangePath },
  ];

  const validationStatus = !isLoaded
    ? 'No save loaded'
    : validationErrorCount > 0
      ? `${validationErrorCount} errors`
      : validationWarningCount > 0
        ? `${validationWarningCount} warnings`
        : validationIssueCount > 0
          ? `${validationIssueCount} findings`
          : 'Clear';

  const testStatus = !testResults
    ? 'Not run'
    : testResults.success
      ? 'Passed'
      : `${testResults.errors.length} issues`;

  return (
    <aside className="save-inspector" aria-label="Save inspector">
      <section className="inspector-section">
        <div className="inspector-heading-row">
          <p className="rail-heading">Save info</p>
          <StatusChip variant={isLoaded ? 'success' : 'neutral'} className="compact">
            {isLoaded ? 'Loaded' : 'Empty'}
          </StatusChip>
        </div>
        <dl className="inspector-metrics">
          {saveInfo.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="inspector-section">
        <div className="inspector-heading-row">
          <p className="rail-heading">Validation</p>
          <StatusChip
            variant={validationErrorCount > 0 ? 'danger' : validationWarningCount > 0 ? 'warning' : isLoaded ? 'success' : 'neutral'}
            className="compact"
          >
            {validationStatus}
          </StatusChip>
        </div>
        <dl className="inspector-metrics">
          <div>
            <dt>Structure check</dt>
            <dd>{testStatus}</dd>
          </div>
          <div>
            <dt>Store</dt>
            <dd>{errorMessage ? 'Error present' : 'Healthy'}</dd>
          </div>
        </dl>
      </section>

      <section className="inspector-section">
        <p className="rail-heading">Status</p>
        <dl className="inspector-metrics">
          <div>
            <dt>Workspace</dt>
            <dd>{isDirty ? 'Unsaved edits' : 'Clean'}</dd>
          </div>
          <div>
            <dt>Export</dt>
            <dd>{encodedOutputData ? 'Ready to copy' : 'Not generated'}</dd>
          </div>
          <div>
            <dt>Active panel</dt>
            <dd>{workflowStepLabelById[activeStep]}</dd>
          </div>
        </dl>
      </section>

      <section className="inspector-section">
        <p className="rail-heading">Shortcuts</p>
        <ul className="inspector-shortcut-list">
          <li><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>V</kbd><span>Paste</span></li>
          <li><kbd>Ctrl</kbd><kbd>Enter</kbd><span>Decrypt</span></li>
          <li><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>E</kbd><span>Encrypt</span></li>
          <li><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>C</kbd><span>Copy</span></li>
        </ul>
      </section>
    </aside>
  );
};

export default SaveInspector;
