import {
  SaveDocumentSnapshot,
  SaveTestResults,
  SaveValidationIssue,
} from '../../core/save/types';

const MAX_VISIBLE_ISSUES = 8;

export type ValidationSummaryMetric = {
  label: string;
  value: string | number;
};

export type ValidationIssueItem = {
  key: string;
  severityLabel: string;
  message: string;
  path?: string;
};

export type ValidationTestResultItem = {
  summary: string;
  severityClassName: 'success' | 'danger';
  visibleErrors: string[];
};

export type ValidationSummaryViewModel = {
  showEmptyState: boolean;
  metrics: ValidationSummaryMetric[];
  issueItems: ValidationIssueItem[];
  testResult: ValidationTestResultItem | null;
};

type CreateValidationSummaryViewModelArgs = {
  isLoaded: boolean;
  document: SaveDocumentSnapshot | null;
  validationIssues: SaveValidationIssue[];
  validationErrorCount: number;
  validationWarningCount: number;
  testResults: SaveTestResults | null;
  formattedLastChange: string;
};

export const createValidationSummaryViewModel = ({
  isLoaded,
  document,
  validationIssues,
  validationErrorCount,
  validationWarningCount,
  testResults,
  formattedLastChange,
}: CreateValidationSummaryViewModelArgs): ValidationSummaryViewModel => {
  const showEmptyState = !isLoaded || !document;

  const metrics: ValidationSummaryMetric[] = showEmptyState
    ? []
    : [
        {
          label: 'Progress stage',
          value: document.validation.stage,
        },
        {
          label: 'Errors',
          value: validationErrorCount,
        },
        {
          label: 'Warnings',
          value: validationWarningCount,
        },
        {
          label: 'Last change',
          value: formattedLastChange,
        },
      ];

  const issueItems: ValidationIssueItem[] = validationIssues.slice(0, MAX_VISIBLE_ISSUES).map((issue) => ({
    key: `${issue.code}-${issue.path ?? issue.message}`,
    severityLabel: issue.severity.toUpperCase(),
    message: issue.message,
    path: issue.path,
  }));

  const testResult: ValidationTestResultItem | null = testResults
    ? {
        summary: testResults.success
          ? 'External save check passed.'
          : `External save check found ${testResults.errors.length} issue${testResults.errors.length === 1 ? '' : 's'}.`,
        severityClassName: testResults.success ? 'success' : 'danger',
        visibleErrors: testResults.errors.slice(0, MAX_VISIBLE_ISSUES),
      }
    : null;

  return {
    showEmptyState,
    metrics,
    issueItems,
    testResult,
  };
};
