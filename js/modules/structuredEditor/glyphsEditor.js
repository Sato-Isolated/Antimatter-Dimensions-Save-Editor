/**
 * glyphsEditor.js
 * Handles the structured editor form for glyphs and reality settings
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';
import { handlePathFieldChange } from './replicantiEditor.js';

// Populate Glyphs section
export function populateGlyphsSection() {
  const container = document.getElementById('glyphs-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Glyphs & Reality</h3>
      <div class="form-group">
        <label for="glyph-level-cap">Glyph Level Cap</label>
        <input type="number" id="glyph-level-cap" data-path="reality.glyphs.level.cap" min="1">
      </div>
      <div class="glyph-sacrifice-container">
        <h4>Glyph Sacrifice Values</h4>
        <div class="glyph-sacrifice-grid">
          <div class="form-group">
            <label for="sac-power">Power Sacrifice</label>
            <input type="text" id="sac-power" data-path="reality.glyphs.sac.power">
          </div>
          <div class="form-group">
            <label for="sac-infinity">Infinity Sacrifice</label>
            <input type="text" id="sac-infinity" data-path="reality.glyphs.sac.infinity">
          </div>
          <div class="form-group">
            <label for="sac-time">Time Sacrifice</label>
            <input type="text" id="sac-time" data-path="reality.glyphs.sac.time">
          </div>
          <div class="form-group">
            <label for="sac-replication">Replication Sacrifice</label>
            <input type="text" id="sac-replication" data-path="reality.glyphs.sac.replication">
          </div>
          <div class="form-group">
            <label for="sac-dilation">Dilation Sacrifice</label>
            <input type="text" id="sac-dilation" data-path="reality.glyphs.sac.dilation">
          </div>
          <div class="form-group">
            <label for="sac-effarig">Effarig Sacrifice</label>
            <input type="text" id="sac-effarig" data-path="reality.glyphs.sac.effarig">
          </div>
          <div class="form-group">
            <label for="sac-reality">Reality Sacrifice</label>
            <input type="text" id="sac-reality" data-path="reality.glyphs.sac.reality">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="reality-glyph-cosmetic">Enable Glyph Cosmetics</label>
        <input type="checkbox" id="reality-glyph-cosmetic" data-path="reality.glyphs.cosmetics.active">
      </div>
      <div class="form-group">
        <label for="reality-protected-rows">Protected Glyph Rows</label>
        <input type="number" id="reality-protected-rows" data-path="reality.glyphs.protectedRows" min="0" max="10">
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  document.querySelectorAll('#glyphs-section [data-path]').forEach(field => {
    field.addEventListener('change', handlePathFieldChange);
  });
}

// Update glyph fields using data-path attributes
export function updateGlyphFields(saveData) {
  if (!saveData || !saveData.reality || !saveData.reality.glyphs) return;
  
  // Get the glyph data
  const glyphs = saveData.reality.glyphs;
  
  // Update sacrifice values
  if (glyphs.sac) {
    const sacFields = {
      'sac-power': glyphs.sac.power,
      'sac-infinity': glyphs.sac.infinity,
      'sac-time': glyphs.sac.time,
      'sac-replication': glyphs.sac.replication,
      'sac-dilation': glyphs.sac.dilation,
      'sac-effarig': glyphs.sac.effarig,
      'sac-reality': glyphs.sac.reality
    };
    
    Object.entries(sacFields).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
  }
  
  // Update other glyph settings
  if (glyphs.level && glyphs.level.cap) {
    const levelCapField = document.getElementById('glyph-level-cap');
    if (levelCapField) levelCapField.value = glyphs.level.cap;
  }
  
  if (glyphs.cosmetics) {
    const cosmeticField = document.getElementById('reality-glyph-cosmetic');
    if (cosmeticField) cosmeticField.checked = glyphs.cosmetics.active;
  }
  
  const protectedRowsField = document.getElementById('reality-protected-rows');
  if (protectedRowsField) protectedRowsField.value = glyphs.protectedRows || 0;
}