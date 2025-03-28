/**
 * Main entry point for the application
 */

import { initThemeManager } from './modules/themeManager.js';
import { initGithubStats } from './modules/githubStats.js';
import { initJsonEditor } from './modules/jsonEditor.js';
import { initSaveManager } from './modules/saveManager.js';
import { initStructuredEditor } from './modules/structuredEditor.js';
import { tabManager } from './modules/tabManager.js';
import { initUI } from './modules/ui.js';
import { changelogModal } from './modules/changelog.js';
import { settingsManager } from './modules/settings.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeManager();
  initGithubStats();
  initJsonEditor();
  initSaveManager();
  initStructuredEditor();
  initUI();

  // Le modal changelog est auto-initialisé lors de l'importation

  // Initialize tooltips and other UI enhancements if needed
  document.querySelectorAll('[title]').forEach(element => {
    // Add tooltip functionality if needed
  });

  // Make settings manager available globally
  window.settingsManager = settingsManager;

  // Initialize tab system globally
  window.tabManager = tabManager;

  // Log initialization completion
  console.log('Application initialized successfully');
});