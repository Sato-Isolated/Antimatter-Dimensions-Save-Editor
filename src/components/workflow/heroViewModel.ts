type HeroStatusChipVariant = 'neutral' | 'success' | 'warning' | 'danger';

export type HeroStatusChip = {
  variant: HeroStatusChipVariant;
  label: string;
};

type CreateHeroStatusChipsArgs = {
  isLoaded: boolean;
  isDirty: boolean;
  saveTypeLabel: string;
  validationIssueCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
};

export const createHeroStatusChips = ({
  isLoaded,
  isDirty,
  saveTypeLabel,
  validationIssueCount,
  validationErrorCount,
  validationWarningCount,
}: CreateHeroStatusChipsArgs): HeroStatusChip[] => {
  const validationVariant: HeroStatusChipVariant = validationErrorCount > 0
    ? 'danger'
    : validationWarningCount > 0
      ? 'warning'
      : 'success';

  const validationLabel = validationIssueCount > 0
    ? `${validationIssueCount} validation issue${validationIssueCount === 1 ? '' : 's'}`
    : 'Validation clear';

  return [
    {
      variant: isLoaded ? 'success' : 'neutral',
      label: isLoaded ? 'Save loaded' : 'Awaiting import',
    },
    {
      variant: isDirty ? 'warning' : 'success',
      label: isDirty ? 'Dirty edits' : 'Clean workspace',
    },
    {
      variant: 'neutral',
      label: `Format: ${isLoaded ? saveTypeLabel : 'Unknown'}`,
    },
    {
      variant: validationVariant,
      label: validationLabel,
    },
  ];
};
