/**
 * challengesEditor.js
 * Handles the structured editor form for game challenges
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Populate Challenges section
export function populateChallengesSection() {
  const container = document.getElementById('challenges-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Challenges</h3>
      
      <div class="challenges-subsection">
        <h4>Normal Challenges</h4>
        <div class="form-group">
          <label for="challenge-normal-current">Current Normal Challenge</label>
          <select id="challenge-normal-current" data-path="challenge.normal.current">
            <option value="0">None</option>
            <option value="1">Challenge 1</option>
            <option value="2">Challenge 2</option>
            <option value="3">Challenge 3</option>
            <option value="4">Challenge 4</option>
            <option value="5">Challenge 5</option>
            <option value="6">Challenge 6</option>
            <option value="7">Challenge 7</option>
            <option value="8">Challenge 8</option>
            <option value="9">Challenge 9</option>
            <option value="10">Challenge 10</option>
            <option value="11">Challenge 11</option>
            <option value="12">Challenge 12</option>
          </select>
        </div>
        <div class="form-group">
          <label for="challenge-normal-completedBits">Completed Challenges Bits</label>
          <input type="number" id="challenge-normal-completedBits" data-path="challenge.normal.completedBits">
        </div>
        <div class="form-group challenge-times-container">
          <label>Best Times (seconds)</label>
          <div class="challenge-times-grid">
            <div class="challenge-time">
              <span>C1:</span>
              <input type="number" id="challenge-normal-bestTimes-0" data-path="challenge.normal.bestTimes.0" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C2:</span>
              <input type="number" id="challenge-normal-bestTimes-1" data-path="challenge.normal.bestTimes.1" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C3:</span>
              <input type="number" id="challenge-normal-bestTimes-2" data-path="challenge.normal.bestTimes.2" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C4:</span>
              <input type="number" id="challenge-normal-bestTimes-3" data-path="challenge.normal.bestTimes.3" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C5:</span>
              <input type="number" id="challenge-normal-bestTimes-4" data-path="challenge.normal.bestTimes.4" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C6:</span>
              <input type="number" id="challenge-normal-bestTimes-5" data-path="challenge.normal.bestTimes.5" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C7:</span>
              <input type="number" id="challenge-normal-bestTimes-6" data-path="challenge.normal.bestTimes.6" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C8:</span>
              <input type="number" id="challenge-normal-bestTimes-7" data-path="challenge.normal.bestTimes.7" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C9:</span>
              <input type="number" id="challenge-normal-bestTimes-8" data-path="challenge.normal.bestTimes.8" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C10:</span>
              <input type="number" id="challenge-normal-bestTimes-9" data-path="challenge.normal.bestTimes.9" step="0.001">
            </div>
            <div class="challenge-time">
              <span>C11:</span>
              <input type="number" id="challenge-normal-bestTimes-10" data-path="challenge.normal.bestTimes.10" step="0.001">
            </div>
          </div>
        </div>
      </div>
      
      <div class="challenges-subsection">
        <h4>Infinity Challenges</h4>
        <div class="form-group">
          <label for="challenge-infinity-current">Current Infinity Challenge</label>
          <select id="challenge-infinity-current" data-path="challenge.infinity.current">
            <option value="0">None</option>
            <option value="1">IC1</option>
            <option value="2">IC2</option>
            <option value="3">IC3</option>
            <option value="4">IC4</option>
            <option value="5">IC5</option>
            <option value="6">IC6</option>
            <option value="7">IC7</option>
            <option value="8">IC8</option>
          </select>
        </div>
        <div class="form-group">
          <label for="challenge-infinity-completedBits">Completed Infinity Challenges Bits</label>
          <input type="number" id="challenge-infinity-completedBits" data-path="challenge.infinity.completedBits">
        </div>
        <div class="form-group challenge-times-container">
          <label>Best Times (seconds)</label>
          <div class="challenge-times-grid">
            <div class="challenge-time">
              <span>IC1:</span>
              <input type="number" id="challenge-infinity-bestTimes-0" data-path="challenge.infinity.bestTimes.0" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC2:</span>
              <input type="number" id="challenge-infinity-bestTimes-1" data-path="challenge.infinity.bestTimes.1" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC3:</span>
              <input type="number" id="challenge-infinity-bestTimes-2" data-path="challenge.infinity.bestTimes.2" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC4:</span>
              <input type="number" id="challenge-infinity-bestTimes-3" data-path="challenge.infinity.bestTimes.3" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC5:</span>
              <input type="number" id="challenge-infinity-bestTimes-4" data-path="challenge.infinity.bestTimes.4" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC6:</span>
              <input type="number" id="challenge-infinity-bestTimes-5" data-path="challenge.infinity.bestTimes.5" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC7:</span>
              <input type="number" id="challenge-infinity-bestTimes-6" data-path="challenge.infinity.bestTimes.6" step="0.001">
            </div>
            <div class="challenge-time">
              <span>IC8:</span>
              <input type="number" id="challenge-infinity-bestTimes-7" data-path="challenge.infinity.bestTimes.7" step="0.001">
            </div>
          </div>
        </div>
      </div>
      
      <div class="challenges-subsection">
        <h4>Eternity Challenges</h4>
        <div class="form-group">
          <label for="challenge-eternity-current">Current Eternity Challenge</label>
          <select id="challenge-eternity-current" data-path="challenge.eternity.current">
            <option value="0">None</option>
            <option value="1">EC1</option>
            <option value="2">EC2</option>
            <option value="3">EC3</option>
            <option value="4">EC4</option>
            <option value="5">EC5</option>
            <option value="6">EC6</option>
            <option value="7">EC7</option>
            <option value="8">EC8</option>
            <option value="9">EC9</option>
            <option value="10">EC10</option>
            <option value="11">EC11</option>
            <option value="12">EC12</option>
          </select>
        </div>
        <div class="form-group">
          <label for="challenge-eternity-unlocked">Unlocked Eternity Challenges</label>
          <input type="number" id="challenge-eternity-unlocked" data-path="challenge.eternity.unlocked">
        </div>
        <div class="form-group">
          <label for="challenge-eternity-requirementBits">Requirement Bits</label>
          <input type="number" id="challenge-eternity-requirementBits" data-path="challenge.eternity.requirementBits">
        </div>
      </div>
      
      <div class="challenges-subsection">
        <h4>Challenge-related Values</h4>
        <div class="form-group">
          <label for="chall2Pow">Challenge 2 Power</label>
          <input type="number" id="chall2Pow" data-path="chall2Pow" step="0.01">
        </div>
        <div class="form-group">
          <label for="chall3Pow">Challenge 3 Power</label>
          <input type="text" id="chall3Pow" data-path="chall3Pow">
        </div>
        <div class="form-group">
          <label for="chall9TickspeedCostBumps">Challenge 9 Tickspeed Cost Bumps</label>
          <input type="number" id="chall9TickspeedCostBumps" data-path="chall9TickspeedCostBumps">
        </div>
        <div class="form-group">
          <label for="chall8TotalSacrifice">Challenge 8 Total Sacrifice</label>
          <input type="text" id="chall8TotalSacrifice" data-path="chall8TotalSacrifice">
        </div>
        <div class="form-group">
          <label for="ic2Count">IC2 Count</label>
          <input type="number" id="ic2Count" data-path="ic2Count">
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners for challenge fields
  document.querySelectorAll('#challenges-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update challenges fields from save data
export function updateChallengesFields(saveData) {
  if (!saveData || !saveData.challenge) return;
  
  // Find all fields with data-path that start with "challenge."
  document.querySelectorAll('[data-path^="challenge."]').forEach(field => {
    const pathString = field.dataset.path;
    if (!pathString) return;
    
    const path = pathString.split('.');
    let value = saveData;
    
    // Navigate through the object path
    for (const key of path) {
      if (value === undefined || value === null) break;
      
      // Handle array indexing notation like "bestTimes.0"
      if (key.match(/^\d+$/)) {
        const index = parseInt(key, 10);
        if (Array.isArray(value) && value.length > index) {
          value = value[index];
        } else {
          value = undefined;
          break;
        }
      } else {
        value = value[key];
      }
    }
    
    if (value !== undefined && value !== null) {
      if (field.type === 'checkbox') {
        field.checked = Boolean(value);
      } else if (field.tagName === 'SELECT') {
        field.value = value;
      } else {
        field.value = value;
      }
    }
  });
  
  // Update challenge-related fields
  ['chall2Pow', 'chall3Pow', 'chall9TickspeedCostBumps', 'chall8TotalSacrifice', 'ic2Count'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field && saveData[fieldId] !== undefined) {
      field.value = saveData[fieldId];
    }
  });
}