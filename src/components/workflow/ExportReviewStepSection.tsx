import React from 'react';
import { FaCopy, FaLock } from 'react-icons/fa';
import StatusChip from './StatusChip';
import WorkflowActionRow from './WorkflowActionRow';
import WorkflowPanel from './WorkflowPanel';

type ExportReviewStepSectionProps = {
  isLoaded: boolean;
  saveTypeLabel: string;
  isDirty: boolean;
  lastChangePath: string;
  reviewMessage: string;
  encodedOutputData: string;
  onEncrypt: () => void;
  onCopy: () => void | Promise<void>;
  canEncrypt: boolean;
  canCopy: boolean;
  exportOutputRef: React.RefObject<HTMLTextAreaElement | null>;
  encryptButtonRef: React.RefObject<HTMLButtonElement | null>;
  copyButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const ExportReviewStepSection: React.FC<ExportReviewStepSectionProps> = ({
  isLoaded,
  saveTypeLabel,
  isDirty,
  lastChangePath,
  reviewMessage,
  encodedOutputData,
  onEncrypt,
  onCopy,
  canEncrypt,
  canCopy,
  exportOutputRef,
  encryptButtonRef,
  copyButtonRef,
}) => {
  return (
    <WorkflowPanel
      step="Step 4"
      title="Export review"
      summary="Review dirty state and generate the encrypted save output."
      headerAside={<StatusChip variant={encodedOutputData ? 'success' : 'neutral'}>{encodedOutputData ? 'Ready to copy' : 'Not generated'}</StatusChip>}
    >
      <div className="export-review-grid">
        <div className="export-review-card">
          <span className="summary-label">Format</span>
          <strong>{isLoaded ? saveTypeLabel : 'Unknown'}</strong>
        </div>
        <div className="export-review-card">
          <span className="summary-label">Dirty state</span>
          <strong>{isDirty ? 'Pending export' : 'Matches imported snapshot'}</strong>
        </div>
        <div className="export-review-card">
          <span className="summary-label">Last path</span>
          <strong>{lastChangePath}</strong>
        </div>
        <div className="export-review-card">
          <span className="summary-label">Export status</span>
          <strong>{reviewMessage}</strong>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="save-export-output">Encoded export</label>
        <textarea
          id="save-export-output"
          ref={exportOutputRef}
          className="save-textarea"
          placeholder="Your encrypted save will appear here..."
          spellCheck="false"
          readOnly
          value={encodedOutputData}
        />
      </div>
      <WorkflowActionRow ariaLabel="Export actions">
        <button ref={encryptButtonRef} id="encryptButton" className="btn primary" onClick={onEncrypt} disabled={!canEncrypt}>
          <FaLock aria-hidden="true" /> Encrypt
        </button>
        <button ref={copyButtonRef} id="copyButton" className="btn secondary" onClick={onCopy} disabled={!canCopy}>
          <FaCopy aria-hidden="true" /> Copy
        </button>
      </WorkflowActionRow>
    </WorkflowPanel>
  );
};

export default ExportReviewStepSection;
