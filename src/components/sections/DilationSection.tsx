import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaArrowUp, FaGlobeAmericas } from 'react-icons/fa';

const DilationSection: React.FC<SectionProps> = ({
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
    <div className="section-pane active" id="dilation">
      <div className="section-content">
        <h3>Dilation</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
          >
            <FaCircle className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
          >
            <FaArrowUp className="subtab-icon" /> Upgrades
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'blackholes' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('blackholes')}
          >
            <FaGlobeAmericas className="subtab-icon" /> Black Holes
          </button>
        </div>
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation Status</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-active">Dilation Active</label>
                <select
                  id="dilation-active"
                  value={saveData.dilation?.active ? "true" : "false"}
                  onChange={(e) => handleValueChange('dilation.active', e.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('dilation.active')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-tachyonParticles">Tachyon Particles</label>
                <input
                  type="text"
                  id="dilation-tachyonParticles"
                  value={saveData.dilation?.tachyonParticles?.toString() || '0'}
                  onChange={(e) => handleValueChange('dilation.tachyonParticles', e.target.value)}
                />
                {renderValidationIndicator('dilation.tachyonParticles')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-dilatedTime">Dilated Time</label>
                <input
                  type="text"
                  id="dilation-dilatedTime"
                  value={saveData.dilation?.dilatedTime?.toString() || '0'}
                  onChange={(e) => handleValueChange('dilation.dilatedTime', e.target.value)}
                />
                {renderValidationIndicator('dilation.dilatedTime')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-nextThreshold">Next Threshold</label>
                <input
                  type="text"
                  id="dilation-nextThreshold"
                  value={saveData.dilation?.nextThreshold?.toString() || '0'}
                  onChange={(e) => handleValueChange('dilation.nextThreshold', e.target.value)}
                />
                {renderValidationIndicator('dilation.nextThreshold')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Tachyon Galaxies</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-baseTachyonGalaxies">Base Tachyon Galaxies</label>
                <input
                  type="number"
                  id="dilation-baseTachyonGalaxies"
                  value={saveData.dilation?.baseTachyonGalaxies || 0}
                  onChange={(e) => handleValueChange('dilation.baseTachyonGalaxies', parseInt(e.target.value))}
                />
                {renderValidationIndicator('dilation.baseTachyonGalaxies')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-totalTachyonGalaxies">Total Tachyon Galaxies</label>
                <input
                  type="number"
                  id="dilation-totalTachyonGalaxies"
                  value={saveData.dilation?.totalTachyonGalaxies || 0}
                  onChange={(e) => handleValueChange('dilation.totalTachyonGalaxies', parseInt(e.target.value))}
                />
                {renderValidationIndicator('dilation.totalTachyonGalaxies')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation Upgrades</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-rebuyables">Rebuyable Upgrades</label>
                <input
                  type="text"
                  id="dilation-rebuyables"
                  value={JSON.stringify(saveData.dilation?.rebuyables || {})}
                  onChange={(e) => {
                    try {
                      handleValueChange('dilation.rebuyables', JSON.parse(e.target.value));
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-upgrades">Upgrades</label>
                <input
                  type="text"
                  id="dilation-upgrades"
                  value={Array.isArray(saveData.dilation?.upgrades) 
                    ? saveData.dilation?.upgrades.join(', ') 
                    : saveData.dilation?.upgrades || ''}
                  onChange={(e) => {
                    const upgradesText = e.target.value.trim();
                    const upgrades = upgradesText ? upgradesText.split(',').map(id => parseInt(id.trim())) : [];
                    handleValueChange('dilation.upgrades', upgrades);
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Dilation Studies</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-studies">Time Studies</label>
                <input
                  type="text"
                  id="dilation-studies"
                  value={Array.isArray(saveData.dilation?.studies) 
                    ? saveData.dilation?.studies.join(', ') 
                    : saveData.dilation?.studies || ''}
                  onChange={(e) => {
                    const studiesText = e.target.value.trim();
                    const studies = studiesText ? studiesText.split(',').map(id => parseInt(id.trim())) : [];
                    handleValueChange('dilation.studies', studies);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Black Holes Subtab */}
        <div className={`subtab-content ${activeSubtab === 'blackholes' ? 'active' : ''}`}>
          {Array.from({ length: 2 }, (_, i) => (
            <div className="resource-group" key={`blackhole-${i}-group`}>
              <h4>Black Hole {i+1}</h4>
              <div className="dilation-grid">
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-unlocked`}>Unlocked</label>
                  <select
                    id={`blackhole-${i}-unlocked`}
                    value={saveData.blackHole?.[i]?.unlocked ? "true" : "false"}
                    onChange={(e) => handleValueChange(`blackHole.${i}.unlocked`, e.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {renderValidationIndicator(`blackHole.${i}.unlocked`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-active`}>Active</label>
                  <select
                    id={`blackhole-${i}-active`}
                    value={saveData.blackHole?.[i]?.active ? "true" : "false"}
                    onChange={(e) => handleValueChange(`blackHole.${i}.active`, e.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {renderValidationIndicator(`blackHole.${i}.active`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-charge`}>Charge</label>
                  <input
                    type="number"
                    id={`blackhole-${i}-charge`}
                    value={saveData.blackHole?.[i]?.phase || 0}
                    onChange={(e) => handleValueChange(`blackHole.${i}.phase`, parseFloat(e.target.value))}
                  />
                  {renderValidationIndicator(`blackHole.${i}.phase`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-powerUpgrade`}>Power Upgrade</label>
                  <input
                    type="number"
                    id={`blackhole-${i}-powerUpgrade`}
                    value={saveData.blackHole?.[i]?.powerUpgrades || 0}
                    onChange={(e) => handleValueChange(`blackHole.${i}.powerUpgrades`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`blackHole.${i}.powerUpgrades`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-interval`}>Interval Upgrade</label>
                  <input
                    type="number"
                    id={`blackhole-${i}-interval`}
                    value={saveData.blackHole?.[i]?.intervalUpgrades || 0}
                    onChange={(e) => handleValueChange(`blackHole.${i}.intervalUpgrades`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`blackHole.${i}.intervalUpgrades`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`blackhole-${i}-duration`}>Duration Upgrade</label>
                  <input
                    type="number"
                    id={`blackhole-${i}-duration`}
                    value={saveData.blackHole?.[i]?.durationUpgrades || 0}
                    onChange={(e) => handleValueChange(`blackHole.${i}.durationUpgrades`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`blackHole.${i}.durationUpgrades`)}
                </div>
             
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DilationSection; 