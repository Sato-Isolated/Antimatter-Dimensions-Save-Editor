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
  'sacrificed': 'sacrificed',
  'totalTimePlayed': 'records.totalTimePlayed',
  'realTimePlayed': 'records.realTimePlayed',
  'totalAntimatter': 'records.totalAntimatter',
  'galaxies': 'galaxies',
  'dimensionBoosts': 'dimensionBoosts',
  'matter': 'matter',

  // Infinity
  'infinityPoints': 'infinityPoints',
  'infinitiesBanked': 'infinitiesBanked',
  'infinityPower': 'infinityPower',
  'IPMultPurchases': 'IPMultPurchases',

  // Eternity
  'eternityPoints': 'eternityPoints', 
  'timeShards': 'timeShards',
  'totalTickGained': 'totalTickGained',
  'totalTickBought': 'totalTickBought',
  'epmultUpgrades': 'epmultUpgrades',
  'timestudy.theorem': 'timestudy.theorem',
  'timestudy.amBought': 'timestudy.amBought',
  'timestudy.ipBought': 'timestudy.ipBought',
  'timestudy.epBought': 'timestudy.epBought',

  // Reality
  'realityMachines': 'reality.realityMachines',
  'imaginaryMachines': 'reality.imaginaryMachines',
  'perkPoints': 'reality.perkPoints',
  'relicShards': 'celestials.effarig.relicShards',
  
  // Dilation
  'tachyonParticles': 'dilation.tachyonParticles',
  'dilatedTime': 'dilation.dilatedTime',
  
  // Black Hole
  'blackHole1Power': 'blackHole[0].powerUpgrades',
  'blackHole1Interval': 'blackHole[0].intervalUpgrades',
  'blackHole1Duration': 'blackHole[0].durationUpgrades',
  'blackHole2Power': 'blackHole[1].powerUpgrades',
  'blackHole2Interval': 'blackHole[1].intervalUpgrades',
  'blackHole2Duration': 'blackHole[1].durationUpgrades',
  
  // Celestials
  'teresa.pouredAmount': 'celestials.teresa.pouredAmount',
  'darkMatter': 'celestials.laitela.darkMatter',
  'darkEnergy': 'celestials.laitela.darkEnergy',
  'singularities': 'celestials.laitela.singularities',
};

// Initialize structured editor
export function initStructuredEditor() {
  populateAntimatterDimensions();
  populateInfinityDimensions();
  populateTimeDimensions();
  populateReplicantiSection();
  populateGlyphsSection();
  populateAchievementsSection();
  
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
  
  // Update replicanti fields
  updateReplicantiFields(saveData);
  
  // Update achievement fields
  updateAchievementFields(saveData);
  
  // Update celestial fields
  updateCelestialFields(saveData);
  
  // Update glyph fields
  updateGlyphFields(saveData);
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

// Populate Replicanti section
function populateReplicantiSection() {
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

// Populate Glyphs section
function populateGlyphsSection() {
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

// Populate Achievements section
function populateAchievementsSection() {
  const container = document.getElementById('achievements-section');
  if (!container) return;
  
  let html = `
    <div class="section-content">
      <h3>Achievements</h3>
      <div class="achievements-grid">
        <div class="form-group">
          <label for="all-achievements">Unlock All Regular Achievements</label>
          <button id="all-achievements" class="btn btn-primary">Unlock All</button>
        </div>
        <div class="form-group">
          <label for="all-secret-achievements">Unlock All Secret Achievements</label>
          <button id="all-secret-achievements" class="btn btn-secondary">Unlock All</button>
        </div>
      </div>
      <div class="form-group">
        <label for="achievement-count">Achievement Count</label>
        <input type="text" id="achievement-count" readonly>
      </div>
      <div class="form-group">
        <label for="secret-count">Secret Achievements Count</label>
        <input type="text" id="secret-count" readonly>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners for achievement buttons
  document.getElementById('all-achievements')?.addEventListener('click', () => {
    unlockAllAchievements(false);
  });
  
  document.getElementById('all-secret-achievements')?.addEventListener('click', () => {
    unlockAllAchievements(true);
  });
}

// Update achievement UI fields
function updateAchievementFields(saveData) {
  if (!saveData) return;
  
  // Calculate and display achievement counts
  let achievementCount = 0;
  let secretAchievementCount = 0;
  
  if (saveData.achievementBits) {
    achievementCount = countBits(saveData.achievementBits);
  }
  
  if (saveData.secretAchievementBits) {
    secretAchievementCount = countBits(saveData.secretAchievementBits);
  }
  
  const achievementCountField = document.getElementById('achievement-count');
  const secretCountField = document.getElementById('secret-count');
  
  if (achievementCountField) achievementCountField.value = achievementCount;
  if (secretCountField) secretCountField.value = secretAchievementCount;
}

// Count set bits in an array of bitmasks
function countBits(bitArray) {
  if (!Array.isArray(bitArray)) return 0;
  
  return bitArray.reduce((count, mask) => {
    let bits = 0;
    let n = mask;
    while (n > 0) {
      bits += n & 1;
      n >>= 1;
    }
    return count + bits;
  }, 0);
}

// Unlock all achievements (regular or secret)
function unlockAllAchievements(secret) {
  const saveData = getJsonEditorData();
  if (!saveData) return;
  
  if (secret) {
    // Set all secret achievement bits to 255
    if (!saveData.secretAchievementBits) {
      saveData.secretAchievementBits = [255, 255, 255, 255];
    } else {
      saveData.secretAchievementBits = saveData.secretAchievementBits.map(() => 255);
    }
  } else {
    // Set all regular achievement bits to 255
    if (!saveData.achievementBits) {
      saveData.achievementBits = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];
    } else {
      saveData.achievementBits = saveData.achievementBits.map(() => 255);
    }
  }
  
  // Update the JSON editor
  setJsonEditorData(saveData);
  
  // Update achievement counts
  updateAchievementFields(saveData);
  
  // Dispatch event to notify other components
  const changeEvent = new CustomEvent('structuredEditorChanged', { detail: saveData });
  document.dispatchEvent(changeEvent);
}

// Update Replicanti fields
function updateReplicantiFields(saveData) {
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

// Handle changes to fields with data-path attributes
function handlePathFieldChange(event) {
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

// Update celestial fields using data-path attributes
function updateCelestialFields(saveData) {
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

// Update glyph fields using data-path attributes
function updateGlyphFields(saveData) {
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