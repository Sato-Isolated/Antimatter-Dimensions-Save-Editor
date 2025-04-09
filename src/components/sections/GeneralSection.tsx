import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaSuperscript, FaInfinity, FaHourglassHalf, FaSun } from 'react-icons/fa';

const GeneralSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator 
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('antimatter');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  return (
    <div className="section-pane active" id="general">
      <div className="section-content">
        <h3>Main Resources</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'antimatter' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('antimatter')}
          >
            <FaSuperscript className="subtab-icon" /> Antimatter
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'infinity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('infinity')}
          >
            <FaInfinity className="subtab-icon" /> Infinity
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'eternity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('eternity')}
          >
            <FaHourglassHalf className="subtab-icon" /> Eternity
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'reality' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('reality')}
          >
            <FaSun className="subtab-icon" /> Reality
          </button>
        </div>
        
        {/* Antimatter Subtab */}
        <div className={`subtab-content ${activeSubtab === 'antimatter' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Antimatter</h4>
            <div className="general-grid">
              <div className="form-group">
                <label htmlFor="antimatter">Antimatter</label>
                <input 
                  type="text" 
                  id="antimatter" 
                  name="antimatter"
                  value={saveData.antimatter?.toString() || '0'}
                  onChange={(e) => handleValueChange('antimatter', e.target.value)} 
                />
                {renderValidationIndicator('antimatter')}
              </div>
              
              <div className="form-group">
                <label htmlFor="matter">Matter</label>
                <input 
                  type="text" 
                  id="matter" 
                  name="matter"
                  value={saveData.matter?.toString() || '0'}
                  onChange={(e) => handleValueChange('matter', e.target.value)}
                />
                {renderValidationIndicator('matter')}
              </div>
              
              <div className="form-group">
                <label htmlFor="buyUntil10">Buy Until 10</label>
                <select
                  id="buyUntil10"
                  value={saveData.buyUntil10 ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('buyUntil10', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('buyUntil10')}
              </div>
              
              <div className="form-group">
                <label htmlFor="break">Break Infinity</label>
                <select
                  id="break"
                  value={saveData.break ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('break', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('break')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Dimensions & Galaxies</h4>
            <div className="general-grid">
              <div className="form-group">
                <label htmlFor="dimensionBoosts">Dimension Boosts</label>
                <input 
                  type="number" 
                  id="dimensionBoosts" 
                  name="dimensionBoosts"
                  value={saveData.dimensionBoosts || 0}
                  onChange={(e) => handleValueChange('dimensionBoosts', parseInt(e.target.value))}
                />
                {renderValidationIndicator('dimensionBoosts')}
              </div>
              
              <div className="form-group">
                <label htmlFor="galaxies">Antimatter Galaxies</label>
                <input 
                  type="number" 
                  id="galaxies" 
                  name="galaxies"
                  value={saveData.galaxies || 0}
                  onChange={(e) => handleValueChange('galaxies', parseInt(e.target.value))}
                />
                {renderValidationIndicator('galaxies')}
              </div>
              
              <div className="form-group">
                <label htmlFor="sacrificed">Dimensional Sacrifice</label>
                <input 
                  type="text" 
                  id="sacrificed" 
                  name="sacrificed"
                  value={saveData.sacrificed?.toString() || '0'}
                  onChange={(e) => handleValueChange('sacrificed', e.target.value)}
                />
                {renderValidationIndicator('sacrificed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="version">Game Version</label>
                <input 
                  type="number" 
                  id="version" 
                  name="version"
                  value={saveData.version || 0}
                  onChange={(e) => handleValueChange('version', parseInt(e.target.value))}
                />
                {renderValidationIndicator('version')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Infinity Subtab */}
        <div className={`subtab-content ${activeSubtab === 'infinity' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity</h4>
            <div className="general-grid">
              <div className="form-group">
                <label htmlFor="infinityPoints">Infinity Points</label>
                <input 
                  type="text" 
                  id="infinityPoints" 
                  name="infinityPoints"
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
                  name="infinities"
                  value={saveData.infinities?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinities', e.target.value)}
                />
                {renderValidationIndicator('infinities')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinitiesBanked">Banked Infinities</label>
                <input 
                  type="text" 
                  id="infinitiesBanked" 
                  name="infinitiesBanked"
                  value={saveData.infinitiesBanked?.toString() || '0'}
                  onChange={(e) => handleValueChange('infinitiesBanked', e.target.value)}
                />
                {renderValidationIndicator('infinitiesBanked')}
              </div>
              
              <div className="form-group">
                <label htmlFor="partInfinityPoint">Partial IP</label>
                <input 
                  type="number" 
                  id="partInfinityPoint" 
                  name="partInfinityPoint"
                  value={saveData.partInfinityPoint || 0}
                  step="0.01"
                  onChange={(e) => handleValueChange('partInfinityPoint', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('partInfinityPoint')}
              </div>
              
              <div className="form-group">
                <label htmlFor="partInfinitied">Partial Infinitied</label>
                <input 
                  type="number" 
                  id="partInfinitied" 
                  name="partInfinitied"
                  value={saveData.partInfinitied || 0}
                  step="0.01"
                  onChange={(e) => handleValueChange('partInfinitied', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('partInfinitied')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinityPower">Infinity Power</label>
                <input 
                  type="text" 
                  id="infinityPower" 
                  name="infinityPower"
                  value={saveData.infinityPower?.toString() || '1'}
                  onChange={(e) => handleValueChange('infinityPower', e.target.value)}
                />
                {renderValidationIndicator('infinityPower')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Eternity Subtab */}
        <div className={`subtab-content ${activeSubtab === 'eternity' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Eternity</h4>
            <div className="general-grid">
              <div className="form-group">
                <label htmlFor="eternityPoints">Eternity Points</label>
                <input 
                  type="text" 
                  id="eternityPoints" 
                  name="eternityPoints"
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
                  name="eternities"
                  value={saveData.eternities?.toString() || '0'}
                  onChange={(e) => handleValueChange('eternities', e.target.value)}
                />
                {renderValidationIndicator('eternities')}
              </div>
              
              <div className="form-group">
                <label htmlFor="timeShards">Time Shards</label>
                <input 
                  type="text" 
                  id="timeShards" 
                  name="timeShards"
                  value={saveData.timeShards?.toString() || '0'}
                  onChange={(e) => handleValueChange('timeShards', e.target.value)}
                />
                {renderValidationIndicator('timeShards')}
              </div>
              
              <div className="form-group">
                <label htmlFor="totalTickGained">Total Tickspeed Upgrades</label>
                <input 
                  type="number" 
                  id="totalTickGained" 
                  name="totalTickGained"
                  value={saveData.totalTickGained || 0}
                  onChange={(e) => handleValueChange('totalTickGained', parseInt(e.target.value))}
                />
                {renderValidationIndicator('totalTickGained')}
              </div>
              
              <div className="form-group">
                <label htmlFor="isGameEnd">Game Completed</label>
                <select
                  id="isGameEnd"
                  value={saveData.isGameEnd ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('isGameEnd', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('isGameEnd')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reality Subtab */}
        <div className={`subtab-content ${activeSubtab === 'reality' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality</h4>
            <div className="general-grid">
              <div className="form-group">
                <label htmlFor="realities">Realities</label>
                <input 
                  type="number" 
                  id="realities" 
                  name="realities"
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
                  name="partSimulatedReality"
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
                  name="reality-realityMachines"
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
                  name="reality-imaginaryMachines"
                  value={saveData.reality?.imaginaryMachines || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryMachines', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryMachines')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSection; 