import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaGlobe, FaDigitalTachograph } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';

const ReplicantiSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator,
  saveType 
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('settings');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  // Use typedSaveData to bypass type checking for properties that exist at runtime but aren't in type definitions
  const typedSaveData = saveData as any;

  return (
    <div className="section-pane active" id="replicanti-section">
      <div className="section-content">
        <h3>Replicanti</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'settings' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('settings')}
          >
            <FaCircle className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
          >
            <FaDigitalTachograph className="subtab-icon" /> Upgrades
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'galaxies' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('galaxies')}
          >
            <FaGlobe className="subtab-icon" /> Galaxies
          </button>
        </div>
        
        {/* General Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Basic Settings</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-unl">Unlocked</label>
                <select
                  id="replicanti-unl"
                  value={typedSaveData.replicanti?.unl ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('replicanti.unl', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('replicanti.unl')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-amount">Amount</label>
                <BigNumberInput
                  value={typedSaveData.replicanti?.amount || '0'}
                  onChange={(value) => handleValueChange('replicanti.amount', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('replicanti.amount')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-timer">Timer (ms)</label>
                <input
                  type="number"
                  id="replicanti-timer"
                  min="0"
                  value={typedSaveData.replicanti?.timer || 0}
                  onChange={(e) => handleValueChange('replicanti.timer', parseInt(e.target.value))}
                />
                {renderValidationIndicator('replicanti.timer')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Chance Upgrades</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-chance">Replication Chance</label>
                <input
                  type="number"
                  id="replicanti-chance"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={typedSaveData.replicanti?.chance || 0.01}
                  onChange={(e) => handleValueChange('replicanti.chance', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('replicanti.chance')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-chanceCost">Chance Upgrade Cost</label>
                <BigNumberInput
                  value={typedSaveData.replicanti?.chanceCost || '1e+150'}
                  onChange={(value) => handleValueChange('replicanti.chanceCost', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('replicanti.chanceCost')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Interval Upgrades</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-interval">Replication Interval (ms)</label>
                <input
                  type="number"
                  id="replicanti-interval"
                  min="1"
                  value={typedSaveData.replicanti?.interval || 1000}
                  onChange={(e) => handleValueChange('replicanti.interval', parseInt(e.target.value))}
                />
                {renderValidationIndicator('replicanti.interval')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-intervalCost">Interval Upgrade Cost</label>
                <BigNumberInput
                  value={typedSaveData.replicanti?.intervalCost || '1e+140'}
                  onChange={(value) => handleValueChange('replicanti.intervalCost', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('replicanti.intervalCost')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Galaxies Subtab */}
        <div className={`subtab-content ${activeSubtab === 'galaxies' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Replicanti Galaxies</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-galaxies">Current Galaxies</label>
                <input
                  type="number"
                  id="replicanti-galaxies"
                  min="0"
                  value={typedSaveData.replicanti?.galaxies || 0}
                  onChange={(e) => handleValueChange('replicanti.galaxies', parseInt(e.target.value))}
                />
                {renderValidationIndicator('replicanti.galaxies')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-gal-cap">Galaxy Cap</label>
                <input
                  type="number"
                  id="replicanti-gal-cap"
                  min="0"
                  value={typedSaveData.replicanti?.boughtGalaxyCap || 0}
                  onChange={(e) => handleValueChange('replicanti.boughtGalaxyCap', parseInt(e.target.value))}
                />
                {renderValidationIndicator('replicanti.boughtGalaxyCap')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replicanti-galCost">Galaxy Cost</label>
                <BigNumberInput
                  value={typedSaveData.replicanti?.galCost || '1e+170'}
                  onChange={(value) => handleValueChange('replicanti.galCost', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('replicanti.galCost')}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ReplicantiSection; 