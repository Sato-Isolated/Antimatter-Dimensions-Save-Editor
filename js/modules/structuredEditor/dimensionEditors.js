/**
 * dimensionEditors.js
 * Handles the structured editor forms for antimatter, infinity, and time dimensions
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';

// Initialize all dimension editors
export function populateDimensionsSection() {
  // Populate all dimension types
  populateAntimatterDimensions();
  populateInfinityDimensions();
  populateTimeDimensions();
  
  // Add event listeners for dimension field changes
  document.querySelectorAll('[data-dimension]').forEach(field => {
    field.addEventListener('change', handleDimensionFieldChange);
  });
}

// Populate antimatter dimensions UI
export function populateAntimatterDimensions() {
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
export function populateInfinityDimensions() {
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
export function populateTimeDimensions() {
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

// Update dimension-specific fields
export function updateDimensionFields(saveData) {
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

// Handle changes to dimension fields
export function handleDimensionFieldChange(event) {
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