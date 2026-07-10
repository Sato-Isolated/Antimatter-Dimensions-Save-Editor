import React from 'react';
import { APP_VERSION } from '../appMetadata';
import AppDialog from './AppDialog';
import ThemeSelector from './ThemeSelector';

type PreferencesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({ isOpen, onClose }) => {
  return (
    <AppDialog
      isOpen={isOpen}
      title="Preferences"
      description="Choose how the editor looks on this device."
      className="preferences-dialog"
      onClose={onClose}
    >
      <div className="dialog-body preferences-content">
        <ThemeSelector />
        <section className="about-editor" aria-labelledby="about-editor-title">
          <h3 id="about-editor-title">About</h3>
          <p>Antimatter Dimensions Editor v{APP_VERSION}</p>
          <p>Independent save editor. Not affiliated with Antimatter Dimensions.</p>
          <a href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor/issues" target="_blank" rel="noopener noreferrer">
            Report an issue
          </a>
        </section>
      </div>
      <footer className="dialog-actions">
        <button type="button" className="primary-button" data-autofocus onClick={onClose}>Done</button>
      </footer>
    </AppDialog>
  );
};

export default PreferencesDialog;
