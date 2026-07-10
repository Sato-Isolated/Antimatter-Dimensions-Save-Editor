import { describe, expect, it } from 'vitest';
import { SaveValidationIssue } from '../core/save/types';
import { formatExportBlockMessage, getBlockingValidationErrors } from './editorValidation';

describe('editor validation helpers', () => {
  it('blocks export only for validation errors', () => {
    const issues: SaveValidationIssue[] = [
      { code: 'warning', message: 'Optional value is missing', severity: 'warning', path: 'optional' },
      { code: 'error', message: 'Version must be numeric', severity: 'error', path: 'version' },
    ];

    expect(getBlockingValidationErrors(issues)).toEqual([issues[1]]);
    expect(formatExportBlockMessage(1)).toBe('Fix 1 validation error before exporting.');
    expect(formatExportBlockMessage(2)).toBe('Fix 2 validation errors before exporting.');
  });
});
