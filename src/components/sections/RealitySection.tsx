import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaSun, FaArrowUp, FaRobot, FaSlidersH } from 'react-icons/fa';

const RealitySection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('general');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  return (
    <div className="section-pane active" id="reality">
      <div className="section-content">
        <h3>Reality</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
          >
            <FaSun className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
          >
            <FaArrowUp className="subtab-icon" /> Upgrades
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'automator' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('automator')}
          >
            <FaRobot className="subtab-icon" /> Automator
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'settings' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('settings')}
          >
            <FaSlidersH className="subtab-icon" /> Settings
          </button>
        </div>
        
        {/* General Reality Resources Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Resources</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="realities">Realities</label>
                <input
                  type="number"
                  id="realities"
                  value={saveData.realities || 0}
                  onChange={(e) => handleValueChange('realities', parseInt(e.target.value))}
                />
                {renderValidationIndicator('realities')}
              </div>

              <div className="form-group">
                <label htmlFor="partSimulatedReality">Partial Reality</label>
                <input
                  type="number"
                  id="partSimulatedReality"
                  value={saveData.partSimulatedReality || 0}
                  step="0.01"
                  onChange={(e) => handleValueChange('partSimulatedReality', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('partSimulatedReality')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-realityMachines">Reality Machines</label>
                <input
                  type="text"
                  id="reality-realityMachines"
                  value={saveData.reality?.realityMachines?.toString() || '0'}
                  onChange={(e) => handleValueChange('reality.realityMachines', e.target.value)}
                />
                {renderValidationIndicator('reality.realityMachines')}
              </div>

              <div className="form-group">
                <label htmlFor="reality-imaginaryMachines">Imaginary Machines</label>
                <input
                  type="number"
                  id="reality-imaginaryMachines"
                  value={saveData.reality?.imaginaryMachines || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryMachines', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryMachines')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-iMCap">Imaginary Machine Cap</label>
                <input
                  type="number"
                  id="reality-iMCap"
                  value={saveData.reality?.iMCap || 0}
                  onChange={(e) => handleValueChange('reality.iMCap', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.iMCap')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Reality Generation</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-seed">Seed</label>
                <input
                  type="number"
                  id="reality-seed"
                  value={saveData.reality?.seed || 0}
                  onChange={(e) => handleValueChange('reality.seed', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.seed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-secondGaussian">Second Gaussian</label>
                <input
                  type="number"
                  id="reality-secondGaussian"
                  step="0.01"
                  value={saveData.reality?.secondGaussian || 0}
                  onChange={(e) => handleValueChange('reality.secondGaussian', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('reality.secondGaussian')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-musicSeed">Music Seed</label>
                <input
                  type="number"
                  id="reality-musicSeed"
                  value={saveData.reality?.musicSeed || 0}
                  onChange={(e) => handleValueChange('reality.musicSeed', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.musicSeed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-musicSecondGaussian">Music Second Gaussian</label>
                <input
                  type="number"
                  id="reality-musicSecondGaussian"
                  step="0.01"
                  value={saveData.reality?.musicSecondGaussian || 0}
                  onChange={(e) => handleValueChange('reality.musicSecondGaussian', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('reality.musicSecondGaussian')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Eternity Continuity</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-partEternitied">Partial Eternitied</label>
                <input
                  type="text"
                  id="reality-partEternitied"
                  value={saveData.reality?.partEternitied?.toString() || '0'}
                  onChange={(e) => handleValueChange('reality.partEternitied', e.target.value)}
                />
                {renderValidationIndicator('reality.partEternitied')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Upgrades</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-upgradeBits">Upgrade Bits</label>
                <input
                  type="number"
                  id="reality-upgradeBits"
                  value={saveData.reality?.upgradeBits || 0}
                  onChange={(e) => handleValueChange('reality.upgradeBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.upgradeBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-upgReqs">Upgrade Requirements</label>
                <input
                  type="number"
                  id="reality-upgReqs"
                  value={saveData.reality?.upgReqs || 0}
                  onChange={(e) => handleValueChange('reality.upgReqs', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.upgReqs')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-rebuyables">Rebuyable Upgrades</label>
                <textarea
                  id="reality-rebuyables"
                  rows={3}
                  value={JSON.stringify(saveData.reality?.rebuyables || {})}
                  onChange={(e) => {
                    try {
                      handleValueChange('reality.rebuyables', JSON.parse(e.target.value));
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('reality.rebuyables')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Imaginary Upgrades</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-imaginaryUpgradeBits">Imaginary Upgrade Bits</label>
                <input
                  type="number"
                  id="reality-imaginaryUpgradeBits"
                  value={saveData.reality?.imaginaryUpgradeBits || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryUpgradeBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryUpgradeBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-imaginaryUpgReqs">Imaginary Upgrade Requirements</label>
                <input
                  type="number"
                  id="reality-imaginaryUpgReqs"
                  value={saveData.reality?.imaginaryUpgReqs || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryUpgReqs', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryUpgReqs')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-imaginaryRebuyables">Imaginary Rebuyables</label>
                <textarea
                  id="reality-imaginaryRebuyables"
                  rows={3}
                  value={JSON.stringify(saveData.reality?.imaginaryRebuyables || {})}
                  onChange={(e) => {
                    try {
                      handleValueChange('reality.imaginaryRebuyables', JSON.parse(e.target.value));
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('reality.imaginaryRebuyables')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Perks</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-perks">Perks</label>
                <textarea
                  id="reality-perks"
                  rows={3}
                  value={JSON.stringify(saveData.reality?.perks || [])}
                  onChange={(e) => {
                    try {
                      handleValueChange('reality.perks', JSON.parse(e.target.value));
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('reality.perks')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-perkPoints">Perk Points</label>
                <input
                  type="number"
                  id="reality-perkPoints"
                  value={saveData.reality?.perkPoints || 0}
                  onChange={(e) => handleValueChange('reality.perkPoints', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.perkPoints')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-respec">Respec</label>
                <select
                  id="reality-respec"
                  value={saveData.reality?.respec ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.respec', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.respec')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Automator Subtab */}
        <div className={`subtab-content ${activeSubtab === 'automator' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Automator Settings</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-autoEC">Auto EC</label>
                <select
                  id="reality-autoEC"
                  value={saveData.reality?.autoEC ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.autoEC', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.autoEC')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-lastAutoEC">Last Auto EC</label>
                <input
                  type="number"
                  id="reality-lastAutoEC"
                  value={saveData.reality?.lastAutoEC || 0}
                  onChange={(e) => handleValueChange('reality.lastAutoEC', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.lastAutoEC')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoAchieve">Auto Achievements</label>
                <select
                  id="reality-autoAchieve"
                  value={saveData.reality?.autoAchieve ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.autoAchieve', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.autoAchieve')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-gainedAutoAchievements">Gained Auto Achievements</label>
                <select
                  id="reality-gainedAutoAchievements"
                  value={saveData.reality?.gainedAutoAchievements ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.gainedAutoAchievements', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.gainedAutoAchievements')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-achTimer">Achievement Timer</label>
                <input
                  type="number"
                  id="reality-achTimer"
                  value={saveData.reality?.achTimer || 0}
                  onChange={(e) => handleValueChange('reality.achTimer', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.achTimer')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Automator Scripts</h4>
            <div className="form-group">
              <label htmlFor="reality-automator">Automator (Advanced)</label>
              <textarea
                id="reality-automator"
                rows={5}
                value={JSON.stringify(saveData.reality?.automator || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleValueChange('reality.automator', JSON.parse(e.target.value));
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.automator')}
            </div>
          </div>
        </div>
        
        {/* Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Glyph Settings</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-showGlyphSacrifice">Show Glyph Sacrifice</label>
                <select
                  id="reality-showGlyphSacrifice"
                  value={saveData.reality?.showGlyphSacrifice ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.showGlyphSacrifice', e.target.value === 'true')}
                >
                  <option value="true">Show</option>
                  <option value="false">Hide</option>
                </select>
                {renderValidationIndicator('reality.showGlyphSacrifice')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-showSidebarPanel">Show Sidebar Panel</label>
                <input
                  type="number"
                  id="reality-showSidebarPanel"
                  value={saveData.reality?.showSidebarPanel || 0}
                  onChange={(e) => handleValueChange('reality.showSidebarPanel', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.showSidebarPanel')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoSort">Auto Sort</label>
                <input
                  type="number"
                  id="reality-autoSort"
                  value={saveData.reality?.autoSort || 0}
                  onChange={(e) => handleValueChange('reality.autoSort', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.autoSort')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoCollapse">Auto Collapse</label>
                <select
                  id="reality-autoCollapse"
                  value={saveData.reality?.autoCollapse ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.autoCollapse', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.autoCollapse')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoAutoClean">Auto Auto Clean</label>
                <select
                  id="reality-autoAutoClean"
                  value={saveData.reality?.autoAutoClean ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.autoAutoClean', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.autoAutoClean')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-applyFilterToPurge">Apply Filter To Purge</label>
                <select
                  id="reality-applyFilterToPurge"
                  value={saveData.reality?.applyFilterToPurge ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.applyFilterToPurge', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.applyFilterToPurge')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-moveGlyphsOnProtection">Move Glyphs On Protection</label>
                <select
                  id="reality-moveGlyphsOnProtection"
                  value={saveData.reality?.moveGlyphsOnProtection ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.moveGlyphsOnProtection', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.moveGlyphsOnProtection')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealitySection; 