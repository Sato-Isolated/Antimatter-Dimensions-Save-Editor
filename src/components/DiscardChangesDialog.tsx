import React from 'react';
import AppDialog from './AppDialog';

type DiscardChangesDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DiscardChangesDialog: React.FC<DiscardChangesDialogProps> = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <AppDialog
      isOpen={isOpen}
      title="Discard changes?"
      description="Your current edits have not been exported. Importing another save will remove them."
      className="confirm-dialog"
      onClose={onCancel}
    >
      <footer className="dialog-actions">
        <button type="button" className="text-button" onClick={onCancel}>Cancel</button>
        <button type="button" className="danger-button" data-autofocus onClick={onConfirm}>Import another save</button>
      </footer>
    </AppDialog>
  );
};

export default DiscardChangesDialog;
