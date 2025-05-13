import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-info">
          <p>Version <span>v2.0.0-BETA-4</span></p>
        </div>
        <div className="footer-links">
          <a 
            href="https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor/issues"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Report an issue on GitHub"
          >
            <i className="fa fa-bug" aria-hidden="true"></i>
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