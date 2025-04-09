import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaArrowUp, FaTrophy } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct as AntimatterDimensionsStructAndroid
} from '../../Struct';

const InfinitySection: React.FC<SectionProps> = ({ 
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

  // Helper function to safely access PC-specific properties
  const isPCFormat = (): boolean => {
    return saveType === SaveType.PC;
  };

  // Cast saveData to specific type when needed
  const pcSaveData = isPCFormat() ? saveData as AntimatterDimensionsStruct : null;
  const androidSaveData = !isPCFormat() ? saveData as AntimatterDimensionsStructAndroid : null;

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
                <BigNumberInput
                  value={isPCFormat() ? 
                    (pcSaveData?.infinityPoints || '0') : 
                    (androidSaveData?.infinity?.points || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange(isPCFormat() ? 
                    'infinityPoints' : 'infinity.points', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator(isPCFormat() ? 'infinityPoints' : 'infinity.points')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinities">Infinities</label>
                <BigNumberInput
                  value={isPCFormat() ? 
                    (pcSaveData?.infinities || '0') : 
                    (androidSaveData?.antimatter?.infinitied || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange(isPCFormat() ? 
                    'infinities' : 'antimatter.infinitied', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator(isPCFormat() ? 'infinities' : 'antimatter.infinitied')}
              </div>
              
              {isPCFormat() && (
                <div className="form-group">
                  <label htmlFor="infinitiesBanked">Infinities Banked</label>
                  <BigNumberInput
                    value={pcSaveData?.infinitiesBanked || '0'}
                    onChange={(value) => handleValueChange('infinitiesBanked', value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('infinitiesBanked')}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="infinityPower">Infinity Power</label>
                <BigNumberInput
                  value={saveData.infinityPower || (saveType === SaveType.PC ? '0' : {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('infinityPower', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('infinityPower')}
              </div>
              
              {isPCFormat() && (
                <div className="form-group">
                  <label htmlFor="IPMultPurchases">IP Multiplier Purchases</label>
                  <input
                    type="number"
                    id="IPMultPurchases"
                    value={pcSaveData?.IPMultPurchases || androidSaveData?.infinity?.IPMultPurchases || 0}
                    onChange={(e) => handleValueChange(isPCFormat() ? 
                      'IPMultPurchases' : 'infinity.IPMultPurchases', parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(isPCFormat() ? 'IPMultPurchases' : 'infinity.IPMultPurchases')}
                </div>
              )}
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Break Infinity</h4>
            <div className="infinity-grid">
              {isPCFormat() ? (
                <div className="form-group">
                  <label htmlFor="break">Break Infinity</label>
                  <select
                    id="break"
                    value={pcSaveData?.break ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('break', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {renderValidationIndicator('break')}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="brake">Break Infinity</label>
                  <select
                    id="brake"
                    value={androidSaveData?.infinity?.break ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('infinity.break', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {renderValidationIndicator('infinity.break')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Upgrades</h4>
            <div className="infinity-grid">
              {isPCFormat() && (
                <>
                  <div className="form-group">
                    <label htmlFor="inf-upgradeBits">Upgrade Bits</label>
                    <input
                      type="number"
                      id="inf-upgradeBits"
                      value={isPCFormat() && pcSaveData?.infinity && 'upgradeBits' in pcSaveData.infinity ? 
                        pcSaveData.infinity.upgradeBits || 0 : 0}
                      onChange={(e) => handleValueChange('infinity.upgradeBits', parseInt(e.target.value))}
                    />
                    {renderValidationIndicator('infinity.upgradeBits')}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="inf-generatorUpgradeBits">Generator Upgrade Bits</label>
                    <input
                      type="number"
                      id="inf-generatorUpgradeBits"
                      value={pcSaveData?.infinityUpgrades?.length || 0}
                      onChange={(e) => handleValueChange('infinityUpgrades', parseInt(e.target.value))}
                    />
                    {renderValidationIndicator('infinityUpgrades')}
                  </div>
                </>
              )}
              
              {!isPCFormat() && (
                <div className="form-group">
                  <label htmlFor="inf-upgrades">Infinity Upgrades</label>
                  <textarea
                    id="inf-upgrades"
                    rows={3}
                    value={JSON.stringify(androidSaveData?.infinity?.upgrades || [])}
                    onChange={(e) => {
                      try {
                        const value = JSON.parse(e.target.value);
                        handleValueChange('infinity.upgrades', value);
                      } catch (error) {
                        console.error("Invalid JSON:", error);
                      }
                    }}
                  />
                  {renderValidationIndicator('infinity.upgrades')}
                </div>
              )}
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
                  value={isPCFormat() 
                    ? (pcSaveData?.break ? 1 : 0) 
                    : (androidSaveData?.infinity?.break ? 1 : 0)}
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
                  value={isPCFormat() 
                    ? (pcSaveData?.challenge?.infinity?.completedBits || 0)
                    : (androidSaveData?.infinity?.challenge?.unlocked?.length || 0)}
                  onChange={(e) => handleValueChange(isPCFormat() 
                    ? 'challenge.infinity.completedBits' 
                    : 'infinity.challenge.unlocked.length', parseInt(e.target.value))}
                />
                {renderValidationIndicator(isPCFormat() 
                  ? 'challenge.infinity.completedBits' 
                  : 'infinity.challenge.unlocked.length')}
              </div>
              
              <div className="form-group">
                <label htmlFor="ic-current">Current Challenge</label>
                <select
                  id="ic-current"
                  value={isPCFormat() 
                    ? (pcSaveData?.challenge?.infinity?.current || 0)
                    : (androidSaveData?.infinity?.challenge?.current || 0)}
                  onChange={(e) => handleValueChange(isPCFormat() 
                    ? 'challenge.infinity.current' 
                    : 'infinity.challenge.current', parseInt(e.target.value))}
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
                {renderValidationIndicator(isPCFormat() 
                  ? 'challenge.infinity.current' 
                  : 'infinity.challenge.current')}
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
                    value={isPCFormat() 
                      ? (pcSaveData?.challenge?.infinity?.bestTimes?.[i] || 0)
                      : (androidSaveData?.infinity?.challenge?.icr?.[`ic${i+1}`]?.comp || 0)}
                    onChange={(e) => handleValueChange(isPCFormat() 
                      ? `challenge.infinity.bestTimes.${i}` 
                      : `infinity.challenge.icr.ic${i+1}.comp`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(isPCFormat() 
                    ? `challenge.infinity.bestTimes.${i}` 
                    : `infinity.challenge.icr.ic${i+1}.comp`)}
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