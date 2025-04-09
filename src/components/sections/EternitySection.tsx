import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaClock, FaTrophy } from 'react-icons/fa';

const EternitySection: React.FC<SectionProps> = ({
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
    <div className="section-pane active" id="eternity">
      <div className="section-content">
        <h3>Eternity</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
          >
            <FaCircle className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'timeStudies' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('timeStudies')}
          >
            <FaClock className="subtab-icon" /> Time Studies
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'challenges' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('challenges')}
          >
            <FaTrophy className="subtab-icon" /> Challenges
          </button>
        </div>
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Eternity Resources</h4>
            <div className="eternity-grid">
              <div className="form-group">
                <label htmlFor="eternityPoints">Eternity Points</label>
                <input
                  type="text"
                  id="eternityPoints"
                  value={saveData.eternityPoints?.toString() || '0'}
                  onChange={(e) => handleValueChange('eternityPoints', e.target.value)}
                />
                {renderValidationIndicator('eternityPoints')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eternities">Eternities</label>
                <input
                  type="text"
                  id="eternities"
                  value={saveData.eternities?.toString() || '0'}
                  onChange={(e) => handleValueChange('eternities', e.target.value)}
                />
                {renderValidationIndicator('eternities')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eternitied">Total Eternities</label>
                <input
                  type="text"
                  id="eternitied"
                  value={saveData.eternities?.toString() || '0'}
                  onChange={(e) => handleValueChange('eternities', e.target.value)}
                />
                {renderValidationIndicator('eternities')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Eternity Upgrades</h4>
            <div className="eternity-grid">
              <div className="form-group">
                <label htmlFor="eternity-upgrades">Upgrade Bits</label>
                <input
                  type="number"
                  id="eternity-upgrades"
                  value={saveData.eternityUpgrades?.length || 0}
                  onChange={(e) => handleValueChange('eternityUpgrades', parseInt(e.target.value))}
                />
                {renderValidationIndicator('eternityUpgrades')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Eternity Milestones</h4>
            <div className="eternity-grid">
              <div className="form-group">
                <label htmlFor="eternity-milestones">Milestone Bits</label>
                <input
                  type="number"
                  id="eternity-milestones"
                  value={saveData.epmultUpgrades || 0}
                  onChange={(e) => handleValueChange('epmultUpgrades', parseInt(e.target.value))}
                />
                {renderValidationIndicator('epmultUpgrades')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Studies Subtab */}
        <div className={`subtab-content ${activeSubtab === 'timeStudies' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Time Studies Management</h4>
            <div className="eternity-grid">
              <div className="form-group">
                <label htmlFor="eternity-timeTheorems">Time Theorems</label>
                <input
                  type="text"
                  id="eternity-timeTheorems"
                  value={saveData.timestudy?.theorem?.toString() || '0'}
                  onChange={(e) => handleValueChange('timestudy.theorem', e.target.value)}
                />
                {renderValidationIndicator('timestudy.theorem')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eternity-timeStudies">Time Studies</label>
                <input
                  type="text"
                  id="eternity-timeStudies"
                  value={saveData.timestudy?.studies || ''}
                  onChange={(e) => handleValueChange('timestudy.studies', e.target.value)}
                />
                {renderValidationIndicator('timestudy.studies')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eternity-rebuyables">Rebuyable Time Studies</label>
                <input
                  type="text"
                  id="eternity-rebuyables"
                  value={JSON.stringify(saveData.eternityChalls || {})}
                  onChange={(e) => {
                    try {
                      handleValueChange('eternityChalls', JSON.parse(e.target.value));
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'challenges' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Eternity Challenge Management</h4>
            <div className="eternity-grid">
              <div className="form-group">
                <label htmlFor="ec-current">Current Challenge</label>
                <select
                  id="ec-current"
                  value={saveData.challenge?.eternity?.current || 0}
                  onChange={(e) => handleValueChange('challenge.eternity.current', parseInt(e.target.value))}
                >
                  <option value="0">None</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={i+1}>EC{i+1}</option>
                  ))}
                </select>
                {renderValidationIndicator('challenge.eternity.current')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Challenge Completions</h4>
            <div className="eternity-grid">
              {Array.from({ length: 12 }, (_, i) => (
                <div className="form-group" key={`ec-${i+1}`}>
                  <label htmlFor={`ec-${i+1}-comp`}>EC{i+1} Completions</label>
                  <input
                    type="number"
                    id={`ec-${i+1}-comp`}
                    value={saveData.challenge?.eternity?.unlocked || 0}
                    onChange={(e) => handleValueChange(`challenge.eternity.unlocked.${i}`, parseInt(e.target.value))}
                    min="0"
                    max="5"
                  />
                  {renderValidationIndicator(`challenge.eternity.unlocked.${i}`)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default EternitySection; 