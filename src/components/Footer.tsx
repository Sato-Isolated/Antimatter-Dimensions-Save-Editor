import React from 'react';
import { FaBug } from 'react-icons/fa';
import { APP_VERSION } from '../appMetadata';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-version">Version <span>v{APP_VERSION}</span></p>
          <p className="footer-disclaimer">Independent editor workflow for Antimatter Dimensions saves.</p>
        </div>
        <div className="footer-links">
          <a 
            href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor/issues"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Report an issue on GitHub"
          >
            <FaBug aria-hidden="true" />
            Report an Issue
          </a>
          <span className="separator" aria-hidden="true">|</span>
          <p>Not affiliated with Antimatter Dimensions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
