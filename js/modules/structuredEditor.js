/**
 * structuredEditor.js
 * Main module for the structured save editor
 */

import { getJsonEditorData, setJsonEditorData } from './jsonEditor.js';
import { populateDimensionsSection, updateDimensionFields } from './structuredEditor/dimensionEditors.js';
import { populateReplicantiSection, updateReplicantiFields } from './structuredEditor/replicantiEditor.js';
import { populateAchievementsSection, updateAchievementFields } from './structuredEditor/achievementsEditor.js';
import { populateRecordsSection, updateRecordsFields } from './structuredEditor/recordsEditor.js';
import { populateAutomatorSection, updateAutomatorFields } from './structuredEditor/automatorEditor.js';
import { populateBlackHoleSection, updateBlackHoleFields } from './structuredEditor/blackHoleEditor.js';
import { populateChallengesSection, updateChallengesFields } from './structuredEditor/challengesEditor.js';
import { populateGlyphsSection, updateGlyphFields } from './structuredEditor/glyphsEditor.js';
import { populateCelestialsSection, updateCelestialFields } from './structuredEditor/celestialsEditor.js';

// Initialize structured editor
export function initStructuredEditor() {
  // Setup save button
  setupSaveButton();
  
  // Populate sections with fields
  populateDimensionsSection();
  populateReplicantiSection();
  populateAchievementsSection();
  populateRecordsSection();
  populateAutomatorSection();
  populateBlackHoleSection();
  populateChallengesSection();
  populateGlyphsSection();
  populateCelestialsSection();
  
  // Update form with current save data
  updateStructuredEditorFields();

  // Listen for settings changes
  document.addEventListener('settingsChanged', (e) => {
    const settings = e.detail;
    // Update section visibility
    Object.entries(settings.sectionsVisibility).forEach(([section, isVisible]) => {
      const sectionElement = document.getElementById(`${section}-section`);
      if (sectionElement) {
        sectionElement.style.display = isVisible ? '' : 'none';
      }
    });
  });

  // Setup auto-save handler
  document.addEventListener('autosave', () => {
    saveStructuredEditor();
  });

  // Setup backup handler
  document.addEventListener('createbackup', () => {
    const currentData = getJsonEditorData();
    if (currentData) {
      const backup = {
        timestamp: Date.now(),
        data: currentData
      };
      
      // Get existing backups
      let backups = [];
      try {
        const savedBackups = localStorage.getItem('editorBackups');
        if (savedBackups) {
          backups = JSON.parse(savedBackups);
        }
      } catch (e) {
        console.error('Error loading backups:', e);
      }

      // Add new backup
      backups.unshift(backup);

      // Keep only the maximum number of backups specified in settings
      const maxBackups = settingsManager.get('maxBackups') || 5;
      backups = backups.slice(0, maxBackups);

      // Save backups
      try {
        localStorage.setItem('editorBackups', JSON.stringify(backups));
      } catch (e) {
        console.error('Error saving backups:', e);
      }
    }
  });
}

// Create the main structure of the editor
function createEditorStructure() {
  const container = document.getElementById('structured-editor');
  if (!container) return;
  
  let html = `
    <div class="structured-editor">
      <div class="tab-navigation">
        <button class="tab-button active" data-tab="dimensions">Dimensions</button>
        <button class="tab-button" data-tab="replicanti">Replicanti</button>
        <button class="tab-button" data-tab="glyphs">Glyphs</button>
        <button class="tab-button" data-tab="celestials">Celestials</button>
        <button class="tab-button" data-tab="challenges">Challenges</button>
        <button class="tab-button" data-tab="achievements">Achievements</button>
        <button class="tab-button" data-tab="blackhole">Black Holes</button>
        <button class="tab-button" data-tab="automator">Automator</button>
        <button class="tab-button" data-tab="records">Records</button>
      </div>
      
      <div class="tab-content">
        <div id="dimensions-section" class="tab-pane active"></div>
        <div id="replicanti-section" class="tab-pane"></div>
        <div id="glyphs-section" class="tab-pane"></div>
        <div id="celestials-section" class="tab-pane"></div>
        <div id="challenges-section" class="tab-pane"></div>
        <div id="achievements-section" class="tab-pane"></div>
        <div id="blackhole-section" class="tab-pane"></div>
        <div id="automator-section" class="tab-pane"></div>
        <div id="records-section" class="tab-pane"></div>
      </div>
      
      <div class="editor-actions">
        <button id="structured-editor-save" class="primary-button">Save Changes</button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// Setup tab navigation
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const tabName = button.dataset.tab;
      document.getElementById(`${tabName}-section`).classList.add('active');
    });
  });
}

// Setup save button event listener
function setupSaveButton() {
  const saveButton = document.getElementById('structured-editor-save');
  if (saveButton) {
    saveButton.addEventListener('click', saveStructuredEditor);
  }
}

// Update all fields with current save data
export function updateStructuredEditorFields() {
  const saveData = getJsonEditorData();
  if (!saveData) return;
  
  updateDimensionFields(saveData);
  updateReplicantiFields(saveData);
  updateAchievementFields(saveData);
  updateRecordsFields(saveData);
  updateAutomatorFields(saveData);
  updateBlackHoleFields(saveData);
  updateChallengesFields(saveData);
  updateGlyphFields(saveData);
  updateCelestialFields(saveData);
}

// Save changes from structured editor to JSON
function saveStructuredEditor() {
  // Show success notification
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.textContent = 'Changes saved successfully!';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}