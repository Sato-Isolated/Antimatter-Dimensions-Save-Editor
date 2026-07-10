import React from 'react';
import AppDialog from './AppDialog';

type ExportDialogProps = {
  isOpen: boolean;
  output: string;
  copyState: 'ready' | 'copied' | 'error';
  onClose: () => void;
  onCopy: () => void;
};

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, output, copyState, onClose, onCopy }) => {
  const statusMessage = copyState === 'copied'
    ? 'Copied'
    : copyState === 'error'
      ? 'Clipboard access failed. Select and copy the save manually.'
      : 'Ready to copy';

  return (
    <AppDialog
      isOpen={isOpen}
      title="Export save"
      description="Copy the encrypted save and import it back into Antimatter Dimensions."
      className="export-dialog"
      onClose={onClose}
    >
      <div className="dialog-body">
        <label htmlFor="encrypted-output">Encrypted save</label>
        <textarea id="encrypted-output" value={output} readOnly spellCheck={false} />
        <p className={`export-copy-state ${copyState}`} role="status" aria-live="polite">
          {copyState !== 'error' ? <span aria-hidden="true">✓</span> : null}
          {statusMessage}
        </p>
      </div>
      <footer className="dialog-actions">
        <button type="button" className="text-button" onClick={onClose}>Close</button>
        <button type="button" className="primary-button" data-autofocus onClick={onCopy}>Copy save</button>
      </footer>
    </AppDialog>
  );
};

export default ExportDialog;
