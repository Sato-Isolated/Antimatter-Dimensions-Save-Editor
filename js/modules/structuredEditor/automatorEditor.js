/**
 * automatorEditor.js
 * Handles the structured editor form for automator settings
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Populate Automator section
export function populateAutomatorSection() {
  const container = document.getElementById('automator-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Automator Settings</h3>
      
      <div class="automator-subsection">
        <h4>General Automator Settings</h4>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-autobuyersOn" data-path="auto.autobuyersOn">
            Autobuyers Enabled
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-disableContinuum" data-path="auto.disableContinuum">
            Disable Continuum
          </label>
        </div>
      </div>
      
      <div class="automator-subsection">
        <h4>Reality Autobuyer</h4>
        <div class="form-group">
          <label for="auto-reality-mode">Reality Mode</label>
          <select id="auto-reality-mode" data-path="auto.reality.mode">
            <option value="0">Amount</option>
            <option value="1">X highest</option>
            <option value="2">Time</option>
          </select>
        </div>
        <div class="form-group">
          <label for="auto-reality-rm">Reality Machines</label>
          <input type="text" id="auto-reality-rm" data-path="auto.reality.rm">
        </div>
        <div class="form-group">
          <label for="auto-reality-glyph">Glyph Level</label>
          <input type="number" id="auto-reality-glyph" data-path="auto.reality.glyph">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-reality-isActive" data-path="auto.reality.isActive">
            Active
          </label>
        </div>
      </div>
      
      <div class="automator-subsection">
        <h4>Eternity Autobuyer</h4>
        <div class="form-group">
          <label for="auto-eternity-mode">Eternity Mode</label>
          <select id="auto-eternity-mode" data-path="auto.eternity.mode">
            <option value="0">Amount</option>
            <option value="1">X highest</option>
            <option value="2">Time</option>
          </select>
        </div>
        <div class="form-group">
          <label for="auto-eternity-amount">Eternity Points</label>
          <input type="text" id="auto-eternity-amount" data-path="auto.eternity.amount">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-eternity-isActive" data-path="auto.eternity.isActive">
            Active
          </label>
        </div>
      </div>
      
      <div class="automator-subsection">
        <h4>Infinity Autobuyer</h4>
        <div class="form-group">
          <label for="auto-bigCrunch-mode">Big Crunch Mode</label>
          <select id="auto-bigCrunch-mode" data-path="auto.bigCrunch.mode">
            <option value="0">Amount</option>
            <option value="1">X highest</option>
            <option value="2">Time</option>
          </select>
        </div>
        <div class="form-group">
          <label for="auto-bigCrunch-amount">Infinity Points</label>
          <input type="text" id="auto-bigCrunch-amount" data-path="auto.bigCrunch.amount">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-bigCrunch-isActive" data-path="auto.bigCrunch.isActive">
            Active
          </label>
        </div>
      </div>
      
      <div class="automator-subsection">
        <h4>Dimension Boost / Galaxy Autobuyers</h4>
        <div class="form-group">
          <label for="auto-dimBoost-maxDimBoosts">Max Dimension Boosts</label>
          <input type="number" id="auto-dimBoost-maxDimBoosts" data-path="auto.dimBoost.maxDimBoosts">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-dimBoost-isActive" data-path="auto.dimBoost.isActive">
            Dim Boost Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-galaxy-limitGalaxies" data-path="auto.galaxy.limitGalaxies">
            Limit Galaxies
          </label>
        </div>
        <div class="form-group">
          <label for="auto-galaxy-maxGalaxies">Max Galaxies</label>
          <input type="number" id="auto-galaxy-maxGalaxies" data-path="auto.galaxy.maxGalaxies">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-galaxy-isActive" data-path="auto.galaxy.isActive">
            Galaxy Active
          </label>
        </div>
      </div>
      
      <div class="automator-subsection">
        <h4>Other Autobuyers</h4>
        <div class="form-group">
          <label for="auto-sacrifice-multiplier">Sacrifice Multiplier</label>
          <input type="text" id="auto-sacrifice-multiplier" data-path="auto.sacrifice.multiplier">
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-sacrifice-isActive" data-path="auto.sacrifice.isActive">
            Sacrifice Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-replicantiGalaxies-isActive" data-path="auto.replicantiGalaxies.isActive">
            Replicanti Galaxies Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-timeTheorems-isActive" data-path="auto.timeTheorems.isActive">
            Time Theorems Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-darkMatterDims-isActive" data-path="auto.darkMatterDims.isActive">
            Dark Matter Dimensions Active
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="checkbox" id="auto-singularity-isActive" data-path="auto.singularity.isActive">
            Singularity Active
          </label>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners for automator section fields
  document.querySelectorAll('#automator-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update automator fields
export function updateAutomatorFields(saveData) {
  if (!saveData || !saveData.auto) return;
  
  // Find all fields with data-path that start with "auto."
  document.querySelectorAll('[data-path^="auto."]').forEach(field => {
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
      } else if (field.tagName === 'SELECT') {
        field.value = value;
      } else {
        field.value = value;
      }
    }
  });
}