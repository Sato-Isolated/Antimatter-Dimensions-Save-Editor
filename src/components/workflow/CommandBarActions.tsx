import React from 'react';
import { FaCheckCircle, FaCopy, FaLock, FaPaste, FaUnlock } from 'react-icons/fa';
import StatusChip from './StatusChip';
import { WorkflowStepId, workflowStepLabelById } from './workflowSteps';

type CommandBarActionsProps = {
  activeStep: WorkflowStepId;
  isLoaded: boolean;
  isDirty: boolean;
  saveTypeLabel: string;
  encodedOutputData: string;
  onPaste: () => void | Promise<void>;
  onDecrypt: () => void;
  onRunStructureTest: () => void;
  onEncrypt: () => void;
  onCopy: () => void | Promise<void>;
};

const CommandBarActions: React.FC<CommandBarActionsProps> = ({
  activeStep,
  isLoaded,
  isDirty,
  saveTypeLabel,
  encodedOutputData,
  onPaste,
  onDecrypt,
  onRunStructureTest,
  onEncrypt,
  onCopy,
}) => {
  return (
    <section className="command-bar" aria-label="Save command bar">
      <div className="command-bar-status">
        <StatusChip variant={isLoaded ? 'success' : 'neutral'}>
          {isLoaded ? `${saveTypeLabel} loaded` : 'Awaiting import'}
        </StatusChip>
        <StatusChip variant={isDirty ? 'warning' : 'success'}>
          {isDirty ? 'Unsaved edits' : 'Clean workspace'}
        </StatusChip>
        <StatusChip variant="neutral">Step: {workflowStepLabelById[activeStep]}</StatusChip>
      </div>

      <div className="command-bar-actions" role="group" aria-label="Primary save actions">
        <button type="button" className="btn ghost" onClick={onPaste}>
          <FaPaste aria-hidden="true" /> Paste
        </button>
        <button type="button" className="btn primary" onClick={onDecrypt}>
          <FaUnlock aria-hidden="true" /> Decrypt
        </button>
        <button type="button" className="btn secondary" onClick={onRunStructureTest} disabled={!isLoaded}>
          <FaCheckCircle aria-hidden="true" /> Validate
        </button>
        <button type="button" className="btn secondary" onClick={onEncrypt} disabled={!isLoaded}>
          <FaLock aria-hidden="true" /> Encrypt
        </button>
        <button type="button" className="btn ghost" onClick={onCopy} disabled={!encodedOutputData}>
          <FaCopy aria-hidden="true" /> Copy
        </button>
      </div>
    </section>
  );
};

export default CommandBarActions;
