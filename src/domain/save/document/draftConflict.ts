export interface DraftConflictState {
  draft: string;
  baseline: string;
  draftRevision: number | null;
  currentRevision: number;
}

export const hasDraftConflict = ({
  draft,
  baseline,
  draftRevision,
  currentRevision,
}: DraftConflictState): boolean => {
  return draft !== baseline && draftRevision !== null && draftRevision !== currentRevision;
};
