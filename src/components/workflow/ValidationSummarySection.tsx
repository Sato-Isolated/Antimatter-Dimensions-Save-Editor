import React from 'react';
import {
  SaveDocumentSnapshot,
  SaveTestResults,
  SaveValidationIssue,
} from '../../core/save/types';
import {
  createValidationSummaryViewModel,
} from './validationViewModel';

type ValidationSummarySectionProps = {
  isLoaded: boolean;
  document: SaveDocumentSnapshot | null;
  validationIssues: SaveValidationIssue[];
  validationErrorCount: number;
  validationWarningCount: number;
  testResults: SaveTestResults | null;
  formattedLastChange: string;
};

const ValidationSummarySection: React.FC<ValidationSummarySectionProps> = ({
  isLoaded,
  document,
  validationIssues,
  validationErrorCount,
  validationWarningCount,
  testResults,
  formattedLastChange,
}) => {
  const viewModel = createValidationSummaryViewModel({
    isLoaded,
    document,
    validationIssues,
    validationErrorCount,
    validationWarningCount,
    testResults,
    formattedLastChange,
  });

  return (
    <>
      {viewModel.showEmptyState ? (
        <div className="editor-empty-state compact">
          <h3>No decoded save yet</h3>
          <p>Decrypt a save to populate stage detection, registry validation, and review status.</p>
        </div>
      ) : (
        <div className="validation-summary-grid">
          {viewModel.metrics.map((metric) => (
            <div key={metric.label} className="validation-summary-card">
              <span className="summary-label">{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      )}

      {viewModel.issueItems.length > 0 && (
        <div className="workflow-list-block">
          <h3>Registry validation findings</h3>
          <ul className="workflow-list">
            {viewModel.issueItems.map((issue) => (
              <li key={issue.key}>
                <strong>{issue.severityLabel}</strong> {issue.message}
                {issue.path && <span className="issue-path">{issue.path}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {viewModel.testResult && (
        <div className="workflow-list-block">
          <h3>Save check</h3>
          <p className={`structure-test-summary ${viewModel.testResult.severityClassName}`}>
            {viewModel.testResult.summary}
          </p>
          {viewModel.testResult.visibleErrors.length > 0 && (
            <ul className="workflow-list">
              {viewModel.testResult.visibleErrors.map((error, index) => (
                <li key={`${index}-${error}`}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default ValidationSummarySection;
