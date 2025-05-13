import React from 'react';
import { useSave } from '../contexts/SaveContext';
import 'font-awesome/css/font-awesome.min.css';

const Header: React.FC = () => {
  const { isLoaded, testResults, testSave } = useSave();

  const handleTest = () => {
    if (isLoaded) {
      testSave();
    } else {
      alert('Please decrypt a save first');
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <h1>
          <i className="fa fa-atom spin" aria-hidden="true"></i>
          <span>Antimatter Dimensions Editor</span>
        </h1>
        <div className="header-controls">
          
          <div className="test-status">
            {testResults && (
              <div className={`test-result ${testResults.success ? 'success' : 'error'}`}>
                {testResults.success ? (
                  <span>✓ Valid structure</span>
                ) : (
                  <div className="error-tooltip">
                    <span>⚠ Errors: {testResults.errors.length}</span>
                    <div className="tooltip-content">
                      <h4>Detected errors:</h4>
                      <ul>
                        {testResults.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {testResults.errors.length > 5 && (
                          <li>...and {testResults.errors.length - 5} other errors</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            className="btn test-button" 
            onClick={handleTest}
            disabled={!isLoaded}
            title="Test the save structure"
          >
            <i className="fa fa-check-circle"></i> Test
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
    </header>
  );
};

export default Header; 