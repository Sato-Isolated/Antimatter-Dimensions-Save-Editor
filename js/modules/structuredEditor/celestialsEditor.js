/**
 * celestialsEditor.js
 * Handles the structured editor form for celestial entities
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Update celestial fields using data-path attributes
export function updateCelestialFields(saveData) {
  if (!saveData || !saveData.celestials) return;
  
  // Find all fields with data-path that start with "celestials."
  document.querySelectorAll('[data-path^="celestials."]').forEach(field => {
    const pathString = field.dataset.path;
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

// Populate Teresa section
export function populateTeresaSection() {
  const container = document.getElementById('teresa-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Teresa</h3>
      <div class="form-group">
        <label for="teresa-poured">Poured Amount</label>
        <input type="text" id="teresa-poured" data-path="celestials.teresa.pouredAmount">
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="teresa-unlocked" data-path="celestials.teresa.unlocked">
          Unlocked
        </label>
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="teresa-run-started" data-path="celestials.teresa.run.started">
          Run Started
        </label>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#teresa-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Populate Effarig section
export function populateEffarigSection() {
  const container = document.getElementById('effarig-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Effarig</h3>
      <div class="form-group">
        <label for="effarig-relics">Relic Shards</label>
        <input type="text" id="effarig-relics" data-path="celestials.effarig.relicShards">
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="effarig-unlocked" data-path="celestials.effarig.unlocked">
          Unlocked
        </label>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#effarig-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Populate Laitela section
export function populateLattelaSection() {
  const container = document.getElementById('laitela-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Laitela</h3>
      <div class="form-group">
        <label for="laitela-dark-matter">Dark Matter</label>
        <input type="text" id="laitela-dark-matter" data-path="celestials.laitela.darkMatter">
      </div>
      <div class="form-group">
        <label for="laitela-dark-energy">Dark Energy</label>
        <input type="text" id="laitela-dark-energy" data-path="celestials.laitela.darkEnergy">
      </div>
      <div class="form-group">
        <label for="laitela-singularities">Singularities</label>
        <input type="number" id="laitela-singularities" data-path="celestials.laitela.singularities">
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="laitela-unlocked" data-path="celestials.laitela.unlocked">
          Unlocked
        </label>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#laitela-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Populate all celestial sections
export function populateCelestialsSection() {
  populateTeresaSection();
  populateEffarigSection();
  populateLattelaSection();
}