/**
 * achievementsEditor.js
 * Handles the structured editor form for achievements
 */

import { getJsonEditorData, setJsonEditorData } from '../jsonEditor.js';

// Populate Achievements section
export function populateAchievementsSection() {
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
export function updateAchievementFields(saveData) {
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
export function unlockAllAchievements(secret) {
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