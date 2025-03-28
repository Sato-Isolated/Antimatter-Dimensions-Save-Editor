/**
 * replicantiEditor.js
 * Handles the structured editor form for replicanti settings
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';

// Populate Replicanti section
export function populateReplicantiSection() {
  const container = document.getElementById('replicanti-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Replicanti</h3>
      <div class="form-group">
        <label for="replicanti-amount">Replicanti Amount</label>
        <input type="text" id="replicanti-amount" data-path="replicanti.amount">
      </div>
      <div class="form-group">
        <label for="replicanti-chance">Replication Chance</label>
        <input type="number" id="replicanti-chance" data-path="replicanti.chance" min="0.01" max="1" step="0.01">
      </div>
      <div class="form-group">
        <label for="replicanti-interval">Replication Interval (ms)</label>
        <input type="number" id="replicanti-interval" data-path="replicanti.interval" min="1">
      </div>
      <div class="form-group">
        <label for="replicanti-galaxies">Replicanti Galaxies</label>
        <input type="number" id="replicanti-galaxies" data-path="replicanti.galaxies" min="0">
      </div>
      <div class="form-group">
        <label for="replicanti-gal-cap">Galaxy Cap</label>
        <input type="number" id="replicanti-gal-cap" data-path="replicanti.boughtGalaxyCap" min="0">
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="replicanti-unlocked" data-path="replicanti.unl">
          Unlocked
        </label>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#replicanti-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update Replicanti fields
export function updateReplicantiFields(saveData) {
  if (!saveData || !saveData.replicanti) return;
  
  const replicanti = saveData.replicanti;
  const fields = {
    'replicanti-amount': replicanti.amount,
    'replicanti-chance': replicanti.chance,
    'replicanti-interval': replicanti.interval,
    'replicanti-galaxies': replicanti.galaxies,
    'replicanti-gal-cap': replicanti.boughtGalaxyCap,
    'replicanti-unlocked': replicanti.unl,
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (!field) return;
    
    if (field.type === 'checkbox') {
      field.checked = value;
    } else {
      field.value = value;
    }
  });
}

// Handle changes to fields with data-path attributes
export function handlePathFieldChange(event) {
  const field = event.target;
  const pathString = field.dataset.path;
  
  if (!pathString) return;
  
  const saveData = getJsonEditorData();
  if (!saveData) return;
  
  const path = pathString.split('.');
  let target = saveData;
  
  // Navigate to the parent object
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    
    // Create the object path if it doesn't exist
    if (!target[key]) {
      target[key] = {};
    }
    
    target = target[key];
  }
  
  // Set the value on the target object
  const lastKey = path[path.length - 1];
  
  // Handle different input types
  if (field.type === 'checkbox') {
    target[lastKey] = field.checked;
  } else {
    target[lastKey] = field.value;
  }
  
  // Update the JSON editor
  setJsonEditorData(saveData);
  
  // Dispatch event to notify other components
  const changeEvent = new CustomEvent('structuredEditorChanged', { detail: saveData });
  document.dispatchEvent(changeEvent);
}