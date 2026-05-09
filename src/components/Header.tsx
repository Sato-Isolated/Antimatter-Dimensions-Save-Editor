import React from 'react';
import { useSave } from '../contexts/SaveContext';
import 'font-awesome/css/font-awesome.min.css';

const Header: React.FC = () => {
  const { isLoaded, testResults, testSave } = useSave();

  const structureStatus = !testResults
    ? 'Run a save check after decrypting a save to confirm structure and registered field values.'
    : testResults.success
      ? 'Latest save check passed.'
      : `Latest save check found ${testResults.errors.length} issue${testResults.errors.length === 1 ? '' : 's'}.`;

  const handleTest = () => {
    if (!isLoaded) {
      return;
    }

    testSave();
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <div className="header-brand">
          <h1>
            <i className="fa fa-atom spin" aria-hidden="true"></i>
            <span>Antimatter Dimensions Editor</span>
          </h1>
          <p className="header-subtitle">Edit, validate, and re-export PC or Android saves from a single workflow shell.</p>
        </div>

        <div className="header-meta">
          <div className="header-status" aria-live="polite">
            <p className="header-status-label">Save check status</p>
            <p className={`header-status-copy ${testResults ? (testResults.success ? 'success' : 'danger') : 'neutral'}`}>
              {structureStatus}
            </p>
          </div>

          <div className="header-actions">
            <button 
              className="btn test-button" 
              onClick={handleTest}
              disabled={!isLoaded}
              title="Test the save structure and registered values"
            >
              <i className="fa fa-check-circle" aria-hidden="true"></i> Test
            </button>
            
            <a
              href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor"
              className="github-button"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project on GitHub"
            >
              <i className="fa fa-github" aria-hidden="true"></i>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 