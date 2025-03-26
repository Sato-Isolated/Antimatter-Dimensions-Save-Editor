/**
 * Main entry point for the application
 */

import { initThemeManager } from './modules/themeManager.js';
import { initGithubStats } from './modules/githubStats.js';
import { initJsonEditor } from './modules/jsonEditor.js';
import { initSaveManager } from './modules/saveManager.js';
import { initStructuredEditor } from './modules/structuredEditor.js';
import { initTabManager } from './modules/tabManager.js';
import { initUI } from './modules/ui.js';
import { initializeTabs } from './modules/tabs.js';
import { changelogModal } from './modules/changelog.js'; // Mise à jour de l'import
import { settingsManager } from './modules/settings.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeManager();
  initGithubStats();
  initJsonEditor();
  initSaveManager();
  initStructuredEditor();
  initTabManager();
  initUI();

  // Initialiser les onglets
  initializeTabs();

  // Le modal changelog est auto-initialisé lors de l'importation

  // Initialize tooltips and other UI enhancements if needed
  document.querySelectorAll('[title]').forEach(element => {
    // Add tooltip functionality if needed
  });

  // Make settings manager available globally
  window.settingsManager = settingsManager;

  // Log initialization completion
  console.log('Application initialized successfully');
});