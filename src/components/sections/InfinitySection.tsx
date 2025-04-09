import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaArrowUp, FaTrophy } from 'react-icons/fa';

const InfinitySection: React.FC<SectionProps> = ({ 
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
    <div className="section-pane active" id="infinity">
      <div className="section-content">
        <h3>Infinity</h3>
        
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
            className={`subtab-button ${activeSubtab === 'challenges' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('challenges')}
          >
            <FaTrophy className="subtab-icon" /> Challenges
          </button>
        </div>
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Resources</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="infinityPoints">Infinity Points</label>
                <input
                  type="text"
                  id="infinityPoints"
                  value={saveData.infinityPoints?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinityPoints', e.target.value)}
                />
                {renderValidationIndicator('infinityPoints')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinities">Infinities</label>
                <input
                  type="text"
                  id="infinities"
                  value={saveData.infinities?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinities', e.target.value)}
                />
                {renderValidationIndicator('infinities')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinitiesBanked">Infinities Banked</label>
                <input
                  type="text"
                  id="infinitiesBanked"
                  value={saveData.infinitiesBanked?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinitiesBanked', e.target.value)}
                />
                {renderValidationIndicator('infinitiesBanked')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinityPower">Infinity Power</label>
                <input
                  type="text"
                  id="infinityPower"
                  value={saveData.infinityPower?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinityPower', e.target.value)}
                />
                {renderValidationIndicator('infinityPower')}
              </div>
              
              <div className="form-group">
                <label htmlFor="IPMultPurchases">IP Multiplier Purchases</label>
                <input
                  type="number"
                  id="IPMultPurchases"
                  value={saveData.IPMultPurchases || 0}
                  onChange={(e) => handleValueChange('IPMultPurchases', parseInt(e.target.value))}
                />
                {renderValidationIndicator('IPMultPurchases')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Break Infinity</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="break">Break Infinity</label>
                <select
                  id="break"
                  value={saveData.break ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('break', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('break')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Upgrades</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="inf-upgradeBits">Upgrade Bits</label>
                <input
                  type="number"
                  id="inf-upgradeBits"
                  value={saveData.infinity?.upgradeBits || 0}
                  onChange={(e) => handleValueChange('infinity.upgradeBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('infinity.upgradeBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="inf-generatorUpgradeBits">Generator Upgrade Bits</label>
                <input
                  type="number"
                  id="inf-generatorUpgradeBits"
                  value={saveData.infinityUpgrades?.length || 0}
                  onChange={(e) => handleValueChange('infinityUpgrades', parseInt(e.target.value))}
                />
                {renderValidationIndicator('infinityUpgrades')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Post-Break Upgrades</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="postBreak">Post-Break Upgrades</label>
                <input
                  type="number"
                  id="postBreak"
                  value={saveData.break ? 1 : 0}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'challenges' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Challenge Status</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="ic-completed">Completed Challenges</label>
                <input
                  type="number"
                  id="ic-completed"
                  value={saveData.challenge?.infinity?.completedBits || 0}
                  onChange={(e) => handleValueChange('challenge.infinity.completedBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('challenge.infinity.completedBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="ic-current">Current Challenge</label>
                <select
                  id="ic-current"
                  value={saveData.challenge?.infinity?.current || 0}
                  onChange={(e) => handleValueChange('challenge.infinity.current', parseInt(e.target.value))}
                >
                  <option value="0">None</option>
                  <option value="1">IC1</option>
                  <option value="2">IC2</option>
                  <option value="3">IC3</option>
                  <option value="4">IC4</option>
                  <option value="5">IC5</option>
                  <option value="6">IC6</option>
                  <option value="7">IC7</option>
                  <option value="8">IC8</option>
                </select>
                {renderValidationIndicator('challenge.infinity.current')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Challenge Records</h4>
            <div className="infinity-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <div className="form-group" key={`ic-${i+1}`}>
                  <label htmlFor={`ic-${i+1}-record`}>IC{i+1} Best</label>
                  <input
                    type="number"
                    id={`ic-${i+1}-record`}
                    value={saveData.challenge?.infinity?.bestTimes?.[i] || 0}
                    onChange={(e) => handleValueChange(`challenge.infinity.bestTimes.${i}`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`challenge.infinity.bestTimes.${i}`)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InfinitySection; 