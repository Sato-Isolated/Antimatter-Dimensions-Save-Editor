import React from 'react';
import StatusChip from './StatusChip';
import { createHeroStatusChips } from './heroViewModel';

type WorkflowHeroSectionProps = {
  isLoaded: boolean;
  isDirty: boolean;
  saveTypeLabel: string;
  validationIssueCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
};

const WorkflowHeroSection: React.FC<WorkflowHeroSectionProps> = ({
  isLoaded,
  isDirty,
  saveTypeLabel,
  validationIssueCount,
  validationErrorCount,
  validationWarningCount,
}) => {
  const statusChips = createHeroStatusChips({
    isLoaded,
    isDirty,
    saveTypeLabel,
    validationIssueCount,
    validationErrorCount,
    validationWarningCount,
  });

  return (
    <section className="card workflow-hero">
      <div className="card-body">
        <div className="workflow-hero-header">
          <div>
            <p className="workflow-kicker">Phase 3 workflow</p>
            <h2>Import, validate, edit, then review the export</h2>
            <p className="workflow-summary">
              The shell now tracks format, validation, and dirty state directly from the centralized document store.
            </p>
            <p className="workflow-summary">
              Keyboard shortcuts: Alt+1 import input, Alt+2 validate, Alt+3 workspace tabs, Alt+4 export output, Ctrl/Cmd+Shift+V paste, Ctrl/Cmd+Shift+T test, Ctrl/Cmd+Shift+E encrypt, Ctrl/Cmd+Shift+C copy.
            </p>
          </div>
          <div className="workflow-status-strip" aria-label="Save status overview">
            {statusChips.map((chip) => (
              <StatusChip key={chip.label} variant={chip.variant}>
                {chip.label}
              </StatusChip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowHeroSection;
