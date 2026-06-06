import React from 'react';
import StatusChip, { StatusChipVariant } from './StatusChip';
import { WorkflowStepDefinition, WorkflowStepId } from './workflowSteps';

type WorkflowStepStatus = {
  label: string;
  variant: StatusChipVariant;
};

type WorkflowRailProps = {
  steps: WorkflowStepDefinition[];
  activeStep: WorkflowStepId;
  statusByStep: Record<WorkflowStepId, WorkflowStepStatus>;
  onStepSelect: (step: WorkflowStepId) => void;
};

const shortcutItems = [
  ['Alt', '1', 'Import'],
  ['Alt', '2', 'Validate'],
  ['Alt', '3', 'Workspace'],
  ['Alt', '4', 'Export'],
];

const WorkflowRail: React.FC<WorkflowRailProps> = ({
  steps,
  activeStep,
  statusByStep,
  onStepSelect,
}) => {
  return (
    <aside className="workflow-rail" aria-label="Workflow">
      <div className="workflow-rail-section">
        <p className="rail-heading">Workflow</p>
        <ol className="workflow-step-list">
          {steps.map((step) => {
            const isActive = step.id === activeStep;
            const status = statusByStep[step.id];
            const StepIcon = step.Icon;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  className={`workflow-step-button ${isActive ? 'active' : ''}`}
                  onClick={() => onStepSelect(step.id)}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="workflow-step-index">{step.index}</span>
                  <span className="workflow-step-copy">
                    <span className="workflow-step-title">
                      <StepIcon aria-hidden="true" />
                      {step.title}
                    </span>
                    <span className="workflow-step-summary">{step.summary}</span>
                    <StatusChip variant={status.variant} className="compact">{status.label}</StatusChip>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="workflow-rail-section workflow-rail-shortcuts">
        <p className="rail-heading">Shortcuts</p>
        <ul>
          {shortcutItems.map(([modifier, key, label]) => (
            <li key={`${modifier}-${key}`}>
              <kbd>{modifier}</kbd>
              <kbd>{key}</kbd>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default WorkflowRail;
