import React from 'react';
import StatusChip from './StatusChip';
import WorkflowActionRow from './WorkflowActionRow';
import WorkflowStepCard from './WorkflowStepCard';

type ImportStepSectionProps = {
  rawSaveData: string;
  onRawSaveDataChange: (value: string) => void;
  onPaste: () => void | Promise<void>;
  onDecrypt: () => void;
  importInputRef: React.RefObject<HTMLTextAreaElement | null>;
};

const ImportStepSection: React.FC<ImportStepSectionProps> = ({
  rawSaveData,
  onRawSaveDataChange,
  onPaste,
  onDecrypt,
  importInputRef,
}) => {
  return (
    <WorkflowStepCard
      step="Step 1"
      title="Import save"
      headerAside={<StatusChip variant="neutral">Raw input</StatusChip>}
    >
      <p className="section-summary">Paste encrypted save data, then decode it into the shared document store.</p>
      <div className="input-group">
        <label htmlFor="save-import-input">Encrypted save</label>
        <textarea
          id="save-import-input"
          ref={importInputRef}
          className="save-textarea"
          placeholder="Paste your encrypted save data here..."
          spellCheck="false"
          value={rawSaveData}
          onChange={(event) => onRawSaveDataChange(event.target.value)}
        />
      </div>
      <WorkflowActionRow ariaLabel="Import actions">
        <button id="pasteButton" className="btn primary" onClick={onPaste}>
          <i className="fa fa-paste"></i> Paste
        </button>
        <button id="decryptButton" className="btn secondary" onClick={onDecrypt}>
          <i className="fa fa-unlock"></i> Decrypt
        </button>
      </WorkflowActionRow>
    </WorkflowStepCard>
  );
};

export default ImportStepSection;
