import { describe, expect, it } from 'vitest';
import { hasDraftConflict } from './draftConflict';

describe('JSON draft conflict detection', () => {
  it('does not conflict when the draft is untouched', () => {
    expect(hasDraftConflict({ draft: '{ }', baseline: '{ }', draftRevision: 2, currentRevision: 3 })).toBe(false);
  });

  it('does not conflict when structured changes have not occurred', () => {
    expect(hasDraftConflict({ draft: '{"version":15}', baseline: '{"version":14}', draftRevision: 2, currentRevision: 2 })).toBe(false);
  });

  it('detects a dirty draft made stale by a structured edit', () => {
    expect(hasDraftConflict({ draft: '{"version":15}', baseline: '{"version":14}', draftRevision: 2, currentRevision: 3 })).toBe(true);
  });
});
