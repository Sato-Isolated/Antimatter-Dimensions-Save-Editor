import React from 'react';
import { FaPaste, FaUnlock } from 'react-icons/fa';
import StatusChip from './StatusChip';
import WorkflowActionRow from './WorkflowActionRow';
import WorkflowPanel from './WorkflowPanel';

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
    <WorkflowPanel
      step="Step 1"
      title="Import save"
      summary="Paste encrypted save data, then decode it locally into the shared document store."
      headerAside={<StatusChip variant="neutral">Raw input</StatusChip>}
    >
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
          <FaPaste aria-hidden="true" /> Paste
        </button>
        <button id="decryptButton" className="btn secondary" onClick={onDecrypt}>
          <FaUnlock aria-hidden="true" /> Decrypt
        </button>
      </WorkflowActionRow>
    </WorkflowPanel>
  );
};

export default ImportStepSection;
