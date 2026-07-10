import React from 'react';
import { FaAtom, FaCog, FaGithub } from 'react-icons/fa';

type HeaderProps = {
  isLoaded: boolean;
  onImportAnother: () => void;
  onExport: () => void;
  onOpenPreferences: () => void;
};

const Header: React.FC<HeaderProps> = ({
  isLoaded,
  onImportAnother,
  onExport,
  onOpenPreferences,
}) => {
  return (
    <header className="app-header">
      <a className="brand" href="#save-editor" aria-label="Antimatter Dimensions Editor home">
        <FaAtom aria-hidden="true" />
        <span className="brand-full">Antimatter Dimensions Editor</span>
        <span className="brand-compact">Antimatter Editor</span>
      </a>

      <nav className="header-actions" aria-label="Application actions">
        {isLoaded ? (
          <>
            <button
              type="button"
              className="text-button import-another"
              aria-label="Import another save"
              onClick={onImportAnother}
            >
              <span className="import-full">Import another save</span>
              <span className="import-compact" aria-hidden="true">Import</span>
            </button>
            <button type="button" className="primary-button export-action" onClick={onExport}>
              <span className="export-full">Export save</span>
              <span className="export-compact">Export</span>
            </button>
          </>
        ) : null}

        <button type="button" className="icon-button" onClick={onOpenPreferences} aria-label="Open preferences">
          <FaCog aria-hidden="true" />
        </button>

        <a
          href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View project on GitHub"
        >
          <FaGithub aria-hidden="true" />
          <span>GitHub</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
