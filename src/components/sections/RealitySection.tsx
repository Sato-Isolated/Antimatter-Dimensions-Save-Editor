import React, { useState } from 'react';
import { SectionProps } from './types';
import SectionShell, { SectionShellTab } from './SectionShell';
import { FaSun, FaArrowUp, FaRobot, FaSlidersH } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import JsonTextareaField from '../JsonTextareaField';
import { SaveType } from '../../services/SaveService';
import { parseNumericInput } from './fieldHelpers';
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

  const tabs: SectionShellTab[] = [
    { id: 'general', title: 'General', icon: <FaSun className="subtab-icon" /> },
    { id: 'upgrades', title: 'Upgrades', icon: <FaArrowUp className="subtab-icon" /> },
    { id: 'automator', title: 'Automator', icon: <FaRobot className="subtab-icon" /> },
    { id: 'settings', title: 'Settings', icon: <FaSlidersH className="subtab-icon" /> },
  ];

  return (
    <SectionShell
      id="reality"
      title="Reality"
      tabs={tabs}
      activeTab={activeSubtab}
      onTabChange={handleSubtabClick}
    >
        
        {/* General Reality Resources Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Resources</h4>
            <div className="reality-grid">
              <div className="form-group">
                {isPCFormat() ? (
                  <>
                    <label htmlFor="realities">Realities</label>
                    <input
                      type="number"
                      id="realities"
                      value={saveData.realities || 0}
                      onChange={(e) => handleValueChange('realities', parseNumericInput(e.target.value))}
                    />
                  </>
                ) : (
                  <BigNumberInput 
                    label="Realities"
                    value={typedSaveData.realities || {mantissa: 0, exponent: 0}} 
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
                  value={isPCFormat() ? (typedSaveData.partSimulatedReality || 0) : (typedSaveData.reality?.partSimulated || 0)}
                  step="0.01"
                  onChange={(e) => handleValueChange(isPCFormat() ? 'partSimulatedReality' : 'reality.partSimulated', parseFloat(e.target.value) || 0)}
                />
                {renderValidationIndicator(isPCFormat() ? 'partSimulatedReality' : 'reality.partSimulated')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Reality Machines"
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
                  onChange={(e) => handleValueChange('reality.imaginaryMachines', parseNumericInput(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryMachines')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-iMCap">Imaginary Machine Cap</label>
                <input
                  type="number"
                  id="reality-iMCap"
                  value={saveData.reality?.iMCap || 0}
                  onChange={(e) => handleValueChange('reality.iMCap', parseNumericInput(e.target.value))}
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
                <BigNumberInput
                  label="Partial Eternitied"
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
                  value={isPCFormat() ? (typedSaveData.reality?.upgReqs || 0) : (typedSaveData.reality?.upgradeRequirementBits || 0)}
                  onChange={(e) => handleValueChange(isPCFormat() ? 'reality.upgReqs' : 'reality.upgradeRequirementBits', parseInt(e.target.value, 10) || 0)}
                />
                {renderValidationIndicator(isPCFormat() ? 'reality.upgReqs' : 'reality.upgradeRequirementBits')}
              </div>
            </div>
          </div>
          
          {isPCFormat() && (
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
          )}
        </div>
        
        {/* Automator Subtab */}
        <div className={`subtab-content ${activeSubtab === 'automator' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Automator Settings</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-autoMode">Automator Mode</label>
                <select
                  id="reality-autoMode"
                  value={typedSaveData.reality?.automator?.state?.mode || 0}
                  onChange={(e) => handleValueChange('reality.automator.state.mode', parseInt(e.target.value, 10) || 0)}
                >
                  <option value="0">Manual</option>
                  <option value="1">Start on Reality</option>
                  <option value="2">Always Running</option>
                </select>
                {renderValidationIndicator('reality.automator.state.mode')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-topLevelScript">Top-level Script</label>
                <input
                  type="number"
                  id="reality-topLevelScript"
                  value={typedSaveData.reality?.automator?.state?.topLevelScript || 0}
                  onChange={(e) => handleValueChange('reality.automator.state.topLevelScript', parseInt(e.target.value, 10) || 0)}
                />
                {renderValidationIndicator('reality.automator.state.topLevelScript')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-editorScript">Editor Script</label>
                <input
                  type="number"
                  id="reality-editorScript"
                  value={typedSaveData.reality?.automator?.state?.editorScript || 0}
                  onChange={(e) => handleValueChange('reality.automator.state.editorScript', parseInt(e.target.value, 10) || 0)}
                />
                {renderValidationIndicator('reality.automator.state.editorScript')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Automator Commands</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-forceRestart">Force Restart</label>
                <select
                  id="reality-forceRestart"
                  value={typedSaveData.reality?.automator?.state?.forceRestart ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.automator.state.forceRestart', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.automator.state.forceRestart')}
              </div>

              <div className="form-group">
                <label htmlFor="reality-followExecution">Follow Execution</label>
                <select
                  id="reality-followExecution"
                  value={typedSaveData.reality?.automator?.state?.followExecution ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.automator.state.followExecution', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.automator.state.followExecution')}
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
                {isPCFormat() ? (
                  <input
                    type="number"
                    id="reality-perks"
                    value={typedSaveData.reality?.perkPoints || 0}
                    onChange={(e) => handleValueChange('reality.perkPoints', parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <BigNumberInput
                    label="Perk Points"
                    value={typedSaveData.reality?.perkPoints || { mantissa: 0, exponent: 0 }}
                    onChange={(value) => handleValueChange('reality.perkPoints', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('reality.perkPoints')}
              </div>
              
              <div className="form-group">
                <JsonTextareaField
                  id="reality-perkUnlocks"
                  label="Perks"
                  value={typedSaveData.reality?.perks || []}
                  onChange={(value) => handleValueChange('reality.perks', value)}
                  expectation="array"
                  rows={4}
                  fallbackValue={[]}
                />
                {renderValidationIndicator('reality.perks')}
              </div>
            </div>
          </div>
        </div>
    </SectionShell>
  );
};

export default RealitySection; 