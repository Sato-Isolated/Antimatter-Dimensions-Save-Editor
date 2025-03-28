/**
 * recordsEditor.js
 * Handles the structured editor form for game records and statistics
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Populate Records section
export function populateRecordsSection() {
  const container = document.getElementById('records-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Game Records & Statistics</h3>
      
      <div class="records-subsection">
        <h4>General Statistics</h4>
        <div class="form-group">
          <label for="records-gameCreatedTime">Game Created Time</label>
          <input type="number" id="records-gameCreatedTime" data-path="records.gameCreatedTime">
        </div>
        <div class="form-group">
          <label for="totalTimePlayed">Total Time Played</label>
          <input type="text" id="totalTimePlayed" data-path="records.totalTimePlayed">
        </div>
        <div class="form-group">
          <label for="realTimePlayed">Real Time Played</label>
          <input type="text" id="realTimePlayed" data-path="records.realTimePlayed">
        </div>
        <div class="form-group">
          <label for="totalAntimatter">Total Antimatter</label>
          <input type="text" id="totalAntimatter" data-path="records.totalAntimatter">
        </div>
        <div class="form-group">
          <label for="records-fullGameCompletions">Full Game Completions</label>
          <input type="number" id="records-fullGameCompletions" data-path="records.fullGameCompletions">
        </div>
      </div>
      
      <div class="records-subsection">
        <h4>Infinity Records</h4>
        <div class="form-group">
          <label for="records-thisInfinity-time">Current Infinity Time</label>
          <input type="number" id="records-thisInfinity-time" data-path="records.thisInfinity.time">
        </div>
        <div class="form-group">
          <label for="records-thisInfinity-realTime">Current Infinity Real Time</label>
          <input type="number" id="records-thisInfinity-realTime" data-path="records.thisInfinity.realTime">
        </div>
        <div class="form-group">
          <label for="records-thisInfinity-maxAM">Max Antimatter This Infinity</label>
          <input type="text" id="records-thisInfinity-maxAM" data-path="records.thisInfinity.maxAM">
        </div>
        <div class="form-group">
          <label for="records-bestInfinity-time">Best Infinity Time</label>
          <input type="number" id="records-bestInfinity-time" data-path="records.bestInfinity.time">
        </div>
      </div>
      
      <div class="records-subsection">
        <h4>Eternity Records</h4>
        <div class="form-group">
          <label for="records-thisEternity-time">Current Eternity Time</label>
          <input type="number" id="records-thisEternity-time" data-path="records.thisEternity.time">
        </div>
        <div class="form-group">
          <label for="records-thisEternity-maxAM">Max Antimatter This Eternity</label>
          <input type="text" id="records-thisEternity-maxAM" data-path="records.thisEternity.maxAM">
        </div>
        <div class="form-group">
          <label for="records-thisEternity-maxIP">Max IP This Eternity</label>
          <input type="text" id="records-thisEternity-maxIP" data-path="records.thisEternity.maxIP">
        </div>
        <div class="form-group">
          <label for="records-bestEternity-time">Best Eternity Time</label>
          <input type="number" id="records-bestEternity-time" data-path="records.bestEternity.time">
        </div>
      </div>
      
      <div class="records-subsection">
        <h4>Reality Records</h4>
        <div class="form-group">
          <label for="records-thisReality-time">Current Reality Time</label>
          <input type="number" id="records-thisReality-time" data-path="records.thisReality.time">
        </div>
        <div class="form-group">
          <label for="records-thisReality-maxAM">Max Antimatter This Reality</label>
          <input type="text" id="records-thisReality-maxAM" data-path="records.thisReality.maxAM">
        </div>
        <div class="form-group">
          <label for="records-thisReality-maxIP">Max IP This Reality</label>
          <input type="text" id="records-thisReality-maxIP" data-path="records.thisReality.maxIP">
        </div>
        <div class="form-group">
          <label for="records-thisReality-maxEP">Max EP This Reality</label>
          <input type="text" id="records-thisReality-maxEP" data-path="records.thisReality.maxEP">
        </div>
        <div class="form-group">
          <label for="records-bestReality-time">Best Reality Time</label>
          <input type="number" id="records-bestReality-time" data-path="records.bestReality.time">
        </div>
        <div class="form-group">
          <label for="records-bestReality-RM">Best Reality RM</label>
          <input type="text" id="records-bestReality-RM" data-path="records.bestReality.RM">
        </div>
        <div class="form-group">
          <label for="records-bestReality-glyphLevel">Best Reality Glyph Level</label>
          <input type="number" id="records-bestReality-glyphLevel" data-path="records.bestReality.glyphLevel">
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#records-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update records fields
export function updateRecordsFields(saveData) {
  if (!saveData || !saveData.records) return;
  
  // Find all fields with data-path that start with "records."
  document.querySelectorAll('[data-path^="records."]').forEach(field => {
    const pathString = field.dataset.path;
    if (!pathString) return;
    
    const path = pathString.split('.');
    let value = saveData;
    
    // Navigate through the object path
    for (const key of path) {
      if (value === undefined || value === null) break;
      value = value[key];
    }
    
    if (value !== undefined && value !== null) {
      if (field.type === 'checkbox') {
        field.checked = value;
      } else {
        field.value = value;
      }
    }
  });
}