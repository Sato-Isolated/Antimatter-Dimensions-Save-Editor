import { DocumentPath, SaveValidationIssue } from '../model';

export const createValidationIssue = (
  code: string,
  message: string,
  severity: SaveValidationIssue['severity'],
  path?: DocumentPath,
): SaveValidationIssue => ({
  code,
  message,
  severity,
  ...(path ? { path } : {}),
});

export const hasBlockingIssues = (issues: readonly SaveValidationIssue[]): boolean => {
  return issues.some((issue) => issue.severity === 'error');
};
