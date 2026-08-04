import {
  SaveObject,
  SaveType,
  SaveValidationIssue,
  SaveValidationSummary,
} from '../model';
import { hasBlockingIssues } from './issues';

export interface DocumentValidationDependencies {
  validateBase: (data: SaveObject) => SaveValidationSummary;
  validateCatalog: (data: SaveObject, saveType: SaveType) => SaveValidationIssue[];
  validateDiscovered?: (
    data: SaveObject,
    baselineData: SaveObject,
    saveType: SaveType,
  ) => SaveValidationIssue[];
}

/**
 * The one validation composition point used by import, structured edits and
 * JSON edits. Individual validators remain small and domain-focused, but no
 * caller is allowed to invent a second export policy.
 */
export const validateDocument = (
  data: SaveObject,
  saveType: SaveType,
  baselineData: SaveObject | undefined,
  dependencies: DocumentValidationDependencies,
): SaveValidationSummary => {
  const baseValidation = dependencies.validateBase(data);
  const catalogIssues = dependencies.validateCatalog(data, saveType);
  const discoveredIssues = baselineData && dependencies.validateDiscovered
    ? dependencies.validateDiscovered(data, baselineData, saveType)
    : [];
  const issues = [...baseValidation.issues, ...catalogIssues, ...discoveredIssues];

  return {
    ...baseValidation,
    issues,
    success: !hasBlockingIssues(issues),
  };
};
