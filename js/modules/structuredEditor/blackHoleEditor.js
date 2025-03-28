/**
 * blackHoleEditor.js
 * Handles the structured editor form for black holes settings
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Populate Black Hole section
export function populateBlackHoleSection() {
  const container = document.getElementById('blackhole-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Black Holes</h3>
      
      <div class="blackhole-subsection">
        <h4>General Black Hole Settings</h4>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="blackHolePause" data-path="blackHolePause">
            Black Hole Paused
          </label>
        </div>
        <div class="form-group">
          <label for="blackHoleAutoPauseMode">Auto Pause Mode</label>
          <select id="blackHoleAutoPauseMode" data-path="blackHoleAutoPauseMode">
            <option value="0">None</option>
            <option value="1">Pause at Big Crunch</option>
            <option value="2">Pause at Eternity</option>
            <option value="3">Pause at Reality</option>
          </select>
        </div>
        <div class="form-group">
          <label for="blackHolePauseTime">Black Hole Pause Time</label>
          <input type="number" id="blackHolePauseTime" data-path="blackHolePauseTime">
        </div>
        <div class="form-group">
          <label for="blackHoleNegative">Black Hole Negative</label>
          <input type="number" id="blackHoleNegative" data-path="blackHoleNegative">
        </div>
      </div>
      
      <div class="blackhole-subsection">
        <h4>First Black Hole</h4>
        <div class="form-group">
          <label for="blackHole1Power">Power Upgrades</label>
          <input type="number" id="blackHole1Power" data-path="blackHole[0].powerUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole1Interval">Interval Upgrades</label>
          <input type="number" id="blackHole1Interval" data-path="blackHole[0].intervalUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole1Duration">Duration Upgrades</label>
          <input type="number" id="blackHole1Duration" data-path="blackHole[0].durationUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole1Phase">Phase</label>
          <input type="number" id="blackHole1Phase" data-path="blackHole[0].phase" step="0.001">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="blackHole1Active" data-path="blackHole[0].active">
            Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="blackHole1Unlocked" data-path="blackHole[0].unlocked">
            Unlocked
          </label>
        </div>
        <div class="form-group">
          <label for="blackHole1Activations">Activations</label>
          <input type="number" id="blackHole1Activations" data-path="blackHole[0].activations">
        </div>
      </div>
      
      <div class="blackhole-subsection">
        <h4>Second Black Hole</h4>
        <div class="form-group">
          <label for="blackHole2Power">Power Upgrades</label>
          <input type="number" id="blackHole2Power" data-path="blackHole[1].powerUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole2Interval">Interval Upgrades</label>
          <input type="number" id="blackHole2Interval" data-path="blackHole[1].intervalUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole2Duration">Duration Upgrades</label>
          <input type="number" id="blackHole2Duration" data-path="blackHole[1].durationUpgrades">
        </div>
        <div class="form-group">
          <label for="blackHole2Phase">Phase</label>
          <input type="number" id="blackHole2Phase" data-path="blackHole[1].phase" step="0.001">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="blackHole2Active" data-path="blackHole[1].active">
            Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="blackHole2Unlocked" data-path="blackHole[1].unlocked">
            Unlocked
          </label>
        </div>
        <div class="form-group">
          <label for="blackHole2Activations">Activations</label>
          <input type="number" id="blackHole2Activations" data-path="blackHole[1].activations">
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners for blackhole fields
  document.querySelectorAll('#blackhole-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update black hole fields
export function updateBlackHoleFields(saveData) {
  if (!saveData) return;
  
  // Update general black hole settings
  ['blackHolePause', 'blackHoleAutoPauseMode', 'blackHolePauseTime', 'blackHoleNegative'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field || !saveData[fieldId]) return;
    
    if (field.type === 'checkbox') {
      field.checked = Boolean(saveData[fieldId]);
    } else {
      field.value = saveData[fieldId];
    }
  });
  
  // Update black hole array fields
  if (saveData.blackHole && Array.isArray(saveData.blackHole)) {
    // First black hole
    if (saveData.blackHole[0]) {
      document.querySelectorAll('[data-path^="blackHole[0]"]').forEach(field => {
        const pathParts = field.dataset.path.split('.');
        const propName = pathParts[1] || pathParts[0].split(']')[1].substring(1);
        const value = saveData.blackHole[0][propName];
        
        if (value !== undefined) {
          if (field.type === 'checkbox') {
            field.checked = Boolean(value);
          } else {
            field.value = value;
          }
        }
      });
    }
    
    // Second black hole
    if (saveData.blackHole[1]) {
      document.querySelectorAll('[data-path^="blackHole[1]"]').forEach(field => {
        const pathParts = field.dataset.path.split('.');
        const propName = pathParts[1] || pathParts[0].split(']')[1].substring(1);
        const value = saveData.blackHole[1][propName];
        
        if (value !== undefined) {
          if (field.type === 'checkbox') {
            field.checked = Boolean(value);
          } else {
            field.value = value;
          }
        }
      });
    }
  }
}