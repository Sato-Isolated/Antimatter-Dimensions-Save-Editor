import { SaveValidationIssue } from '../core/save/types';

export const getBlockingValidationErrors = (issues: SaveValidationIssue[]): SaveValidationIssue[] => {
  return issues.filter((issue) => issue.severity === 'error');
};

export const formatExportBlockMessage = (errorCount: number): string => {
  return `Fix ${errorCount} validation error${errorCount === 1 ? '' : 's'} before exporting.`;
};
