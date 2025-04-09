import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaSun, FaArrowUp, FaRobot, FaSlidersH } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct as AntimatterDimensionsStructAndroid
} from '../../Struct';

const RealitySection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('general');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };
  
  // Helper for safely accessing PC-specific properties
  const isPCFormat = (): boolean => {
    return saveType === SaveType.PC;
  };

  // Cast saveData to specific type when needed
  const pcSaveData = isPCFormat() ? saveData as AntimatterDimensionsStruct : null;
  const androidSaveData = !isPCFormat() ? saveData as AntimatterDimensionsStructAndroid : null;
  // Use typedSaveData to bypass type checking for properties that exist at runtime but aren't in the type definitions
  const typedSaveData = saveData as any;

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
                {isPCFormat() ? (
                  <input
                    type="number"
                    id="realities"
                    value={saveData.realities || 0}
                    onChange={(e) => handleValueChange('realities', parseInt(e.target.value))}
                  />
                ) : (
                  <BigNumberInput 
                    value={androidSaveData?.realities || {mantissa: 0, exponent: 0}} 
                    onChange={(value) => handleValueChange('realities', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('realities')}
              </div>

              <div className="form-group">
                <label htmlFor="partSimulatedReality">Partial Reality</label>
                <input
                  type="number"
                  id="partSimulatedReality"
                  value={typedSaveData.partSimulatedReality || 0}
                  step="0.01"
                  onChange={(e) => handleValueChange('partSimulatedReality', parseFloat(e.target.value))}
                />
                {renderValidationIndicator('partSimulatedReality')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-realityMachines">Reality Machines</label>
                <BigNumberInput
                  value={saveData.reality?.realityMachines || (isPCFormat() ? '0' : {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('reality.realityMachines', value)}
                  saveType={saveType}
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
                <BigNumberInput
                  value={saveData.reality?.partEternitied || (isPCFormat() ? '0' : {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('reality.partEternitied', value)}
                  saveType={saveType}
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
                  value={typedSaveData.reality?.reqLockBits || 0}
                  onChange={(e) => handleValueChange('reality.reqLockBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.reqLockBits')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Black Hole Upgrades</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-blackHoleBits">Black Hole Upgrades</label>
                <input
                  type="number"
                  id="reality-blackHoleBits"
                  value={typedSaveData.reality?.blackHoleBits || 0}
                  onChange={(e) => handleValueChange('reality.blackHoleBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.blackHoleBits')}
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
                <label htmlFor="reality-autoActive">Automator Active</label>
                <select
                  id="reality-autoActive"
                  value={typedSaveData.reality?.automator?.active ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.automator.active', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.automator.active')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoMode">Automator Mode</label>
                <select
                  id="reality-autoMode"
                  value={typedSaveData.reality?.automator?.mode || 0}
                  onChange={(e) => handleValueChange('reality.automator.mode', parseInt(e.target.value))}
                >
                  <option value="0">Start Manually</option>
                  <option value="1">Start on Reality</option>
                  <option value="2">Always Running</option>
                </select>
                {renderValidationIndicator('reality.automator.mode')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-autoTime">Time between ticks (ms)</label>
                <input
                  type="number"
                  id="reality-autoTime"
                  value={typedSaveData.reality?.automator?.time || 1000}
                  onChange={(e) => handleValueChange('reality.automator.time', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.automator.time')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Automator Commands</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-autoUnlocks">Unlocked Commands</label>
                <input
                  type="number"
                  id="reality-autoUnlocks"
                  value={typedSaveData.reality?.automator?.unlocks || 0}
                  onChange={(e) => handleValueChange('reality.automator.unlocks', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.automator.unlocks')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Settings</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-perks">Perk Points</label>
                <input
                  type="number"
                  id="reality-perks"
                  value={typedSaveData.reality?.pp || 0}
                  onChange={(e) => handleValueChange('reality.pp', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.pp')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-perkUnlocks">Perk Unlocks</label>
                <input
                  type="number"
                  id="reality-perkUnlocks"
                  value={typedSaveData.reality?.perkUnlocks || 0}
                  onChange={(e) => handleValueChange('reality.perkUnlocks', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.perkUnlocks')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealitySection; 