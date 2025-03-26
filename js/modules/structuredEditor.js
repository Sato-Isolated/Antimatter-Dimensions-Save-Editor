/**
 * structuredEditor.js
 * Handles the structured editor form with specific fields for different game aspects
 */

import { getJsonEditorData, setJsonEditorData } from './jsonEditor.js';

// Define mapping between form fields and save data properties
const fieldMappings = {
  // General
  'antimatter': 'antimatter',
  'infinities': 'infinities',
  'eternities': 'eternities',
  'realities': 'realities',

  // Infinity
  'infinityPoints': 'infinityPoints',

  // Eternity
  'eternityPoints': 'eternityPoints',

  // Reality
  'realityMachines': 'reality.realityMachines',
  'imaginaryMachines': 'reality.imaginaryMachines',
};

// Initialize structured editor
export function initStructuredEditor() {
  populateAntimatterDimensions();
  populateInfinityDimensions();
  populateTimeDimensions();
  
  // Set up event listeners for form fields
  setupFieldListeners();
  
  // Listen for JSON editor changes
  document.addEventListener('jsonEditorChanged', (event) => {
    updateStructuredEditorFields(event.detail);
  });
}

// Update all structured editor fields based on save data
export function updateStructuredEditorFields(saveData) {
  if (!saveData) return;
  
  // Update general fields
  Object.keys(fieldMappings).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const path = fieldMappings[fieldId].split('.');
    let value = saveData;
    
    // Navigate through the object path
    for (const key of path) {
      if (value === undefined || value === null) break;
      value = value[key];
    }
    
    if (value !== undefined && value !== null) {
      field.value = value;
    }
  });
  
  // Update dimension fields
  updateDimensionFields(saveData);
}

// Update dimension-specific fields
function updateDimensionFields(saveData) {
  if (!saveData || !saveData.dimensions) return;
  
  // Update antimatter dimensions
  if (saveData.dimensions.antimatter) {
    const adContainer = document.getElementById('antimatter-dimensions');
    if (adContainer) {
      saveData.dimensions.antimatter.forEach((dim, index) => {
        const amountField = document.getElementById(`ad-${index + 1}-amount`);
        const boughtField = document.getElementById(`ad-${index + 1}-bought`);
        
        if (amountField) amountField.value = dim.amount;
        if (boughtField) boughtField.value = dim.bought;
      });
    }
  }
  
  // Update infinity dimensions
  if (saveData.dimensions.infinity) {
    const idContainer = document.getElementById('infinity-dimensions');
    if (idContainer) {
      saveData.dimensions.infinity.forEach((dim, index) => {
        const amountField = document.getElementById(`id-${index + 1}-amount`);
        const boughtField = document.getElementById(`id-${index + 1}-bought`);
        const costField = document.getElementById(`id-${index + 1}-cost`);
        
        if (amountField) amountField.value = dim.amount;
        if (boughtField) boughtField.value = dim.bought;
        if (costField) costField.value = dim.cost;
      });
    }
  }
  
  // Update time dimensions
  if (saveData.dimensions.time) {
    const tdContainer = document.getElementById('time-dimensions');
    if (tdContainer) {
      saveData.dimensions.time.forEach((dim, index) => {
        const amountField = document.getElementById(`td-${index + 1}-amount`);
        const boughtField = document.getElementById(`td-${index + 1}-bought`);
        const costField = document.getElementById(`td-${index + 1}-cost`);
        
        if (amountField) amountField.value = dim.amount;
        if (boughtField) boughtField.value = dim.bought;
        if (costField) costField.value = dim.cost;
      });
    }
  }
}

// Populate antimatter dimensions UI
function populateAntimatterDimensions() {
  const container = document.getElementById('antimatter-dimensions');
  if (!container) return;
  
  let html = '<div class="dimensions-grid">';
  for (let i = 1; i <= 8; i++) {
    html += `
      <div class="dimension-row">
        <div class="dimension-name">Dimension ${i}</div>
        <div class="dimension-fields">
          <div class="form-group">
            <label for="ad-${i}-amount">Amount</label>
            <input type="text" id="ad-${i}-amount" data-dimension="antimatter" data-index="${i-1}" data-property="amount">
          </div>
          <div class="form-group">
            <label for="ad-${i}-bought">Bought</label>
            <input type="number" id="ad-${i}-bought" data-dimension="antimatter" data-index="${i-1}" data-property="bought">
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  container.innerHTML = html;
}

// Populate infinity dimensions UI
function populateInfinityDimensions() {
  const container = document.getElementById('infinity-dimensions');
  if (!container) return;
  
  let html = '<div class="dimensions-grid">';
  for (let i = 1; i <= 8; i++) {
    html += `
      <div class="dimension-row">
        <div class="dimension-name">Infinity Dimension ${i}</div>
        <div class="dimension-fields">
          <div class="form-group">
            <label for="id-${i}-amount">Amount</label>
            <input type="text" id="id-${i}-amount" data-dimension="infinity" data-index="${i-1}" data-property="amount">
          </div>
          <div class="form-group">
            <label for="id-${i}-bought">Bought</label>
            <input type="number" id="id-${i}-bought" data-dimension="infinity" data-index="${i-1}" data-property="bought">
          </div>
          <div class="form-group">
            <label for="id-${i}-cost">Cost</label>
            <input type="text" id="id-${i}-cost" data-dimension="infinity" data-index="${i-1}" data-property="cost">
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  container.innerHTML = html;
}

// Populate time dimensions UI
function populateTimeDimensions() {
  const container = document.getElementById('time-dimensions');
  if (!container) return;
  
  let html = '<div class="dimensions-grid">';
  for (let i = 1; i <= 8; i++) {
    html += `
      <div class="dimension-row">
        <div class="dimension-name">Time Dimension ${i}</div>
        <div class="dimension-fields">
          <div class="form-group">
            <label for="td-${i}-amount">Amount</label>
            <input type="text" id="td-${i}-amount" data-dimension="time" data-index="${i-1}" data-property="amount">
          </div>
          <div class="form-group">
            <label for="td-${i}-bought">Bought</label>
            <input type="number" id="td-${i}-bought" data-dimension="time" data-index="${i-1}" data-property="bought">
          </div>
          <div class="form-group">
            <label for="td-${i}-cost">Cost</label>
            <input type="text" id="td-${i}-cost" data-dimension="time" data-index="${i-1}" data-property="cost">
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  container.innerHTML = html;
}

// Set up event listeners for all form fields
function setupFieldListeners() {
  // Listen for changes on general fields
  Object.keys(fieldMappings).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.addEventListener('change', handleFieldChange);
  });
  
  // Listen for changes on dimension fields
  document.querySelectorAll('[data-dimension]').forEach(field => {
    field.addEventListener('change', handleDimensionFieldChange);
  });
}

// Handle changes to general fields
function handleFieldChange(event) {
  const field = event.target;
  const fieldId = field.id;
  const mapping = fieldMappings[fieldId];
  
  if (!mapping) return;
  
  const saveData = getJsonEditorData();
  if (!saveData) return;
  
  const path = mapping.split('.');
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
  target[lastKey] = field.value;
  
  // Update the JSON editor
  setJsonEditorData(saveData);
  
  // Dispatch event to notify other components
  const changeEvent = new CustomEvent('structuredEditorChanged', { detail: saveData });
  document.dispatchEvent(changeEvent);
}

// Handle changes to dimension fields
function handleDimensionFieldChange(event) {
  const field = event.target;
  const dimension = field.dataset.dimension;
  const index = parseInt(field.dataset.index, 10);
  const property = field.dataset.property;
  
  if (dimension === undefined || index === undefined || property === undefined) return;
  
  const saveData = getJsonEditorData();
  if (!saveData || !saveData.dimensions || !saveData.dimensions[dimension]) return;
  
  // Update the dimension property
  saveData.dimensions[dimension][index][property] = field.value;
  
  // Update the JSON editor
  setJsonEditorData(saveData);
  
  // Dispatch event to notify other components
  const changeEvent = new CustomEvent('structuredEditorChanged', { detail: saveData });
  document.dispatchEvent(changeEvent);
}