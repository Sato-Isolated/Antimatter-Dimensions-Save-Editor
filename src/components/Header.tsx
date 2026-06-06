import React from 'react';
import { FaAtom, FaGithub } from 'react-icons/fa';
import { APP_VERSION } from '../appMetadata';

const Header: React.FC = () => {
  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <div className="header-brand">
          <h1>
            <FaAtom className="spin" aria-hidden="true" />
            <span>Antimatter Dimensions Editor</span>
          </h1>
          <span className="header-version">v{APP_VERSION}</span>
        </div>

        <div className="header-meta">
          <span className="header-platform">PC / Android</span>
          <div className="header-actions">
            <a
              href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor"
              className="github-button"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project on GitHub"
            >
              <FaGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
