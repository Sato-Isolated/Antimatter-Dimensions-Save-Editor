import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaGlobe, FaArrowCircleRight, FaCube, FaChartLine } from 'react-icons/fa';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  PCStruct,
  AndroidStruct
} from '../../Struct';
import BigNumberInput from '../BigNumberInput';

const AutoBuyersSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator,
  saveType 
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('global');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };
  
  // Helper for safely accessing PC-specific properties
  const isPCFormat = (): boolean => {
    return saveType === SaveType.PC;
  };

  // Cast saveData to specific type when needed
  const pcSaveData = isPCFormat() ? saveData as PCStruct : null;
  const androidSaveData = !isPCFormat() ? saveData as AndroidStruct : null;

  return (
    <div className="section-pane active" id="autobuyers-section">
      <div className="section-content">
        <h3>Auto Buyers</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'global' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('global')}
          >
            <FaGlobe className="subtab-icon" /> Global
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'basic' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('basic')}
          >
            <FaArrowCircleRight className="subtab-icon" /> Basic
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'dimensions' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('dimensions')}
          >
            <FaCube className="subtab-icon" /> Dimensions
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'advanced' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('advanced')}
          >
            <FaChartLine className="subtab-icon" /> Advanced
          </button>
        </div>
        
        {/* Global Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'global' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Global Settings</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="auto-autobuyersOn">Enable All Autobuyers</label>
                <select
                  id="auto-autobuyersOn"
                  value={isPCFormat() ? 
                    (pcSaveData?.auto?.autobuyersOn ?? false ? 'true' : 'false') : 
                    (androidSaveData?.auto?.achievements ?? false ? 'true' : 'false')}
                  onChange={(e) => handleValueChange(isPCFormat() ? 
                    'auto.autobuyersOn' : 'auto.achievements', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator(isPCFormat() ? 'auto.autobuyersOn' : 'auto.achievements')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-disableContinuum">Disable Continuum</label>
                <select
                  id="auto-disableContinuum"
                  value={saveData.auto?.disableContinuum ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.disableContinuum', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('auto.disableContinuum')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Basic Autobuyers Subtab */}
        <div className={`subtab-content ${activeSubtab === 'basic' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Autobuyer</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="auto-infinity-isActive">Status</label>
                <select
                  id="auto-infinity-isActive"
                  value={saveData.auto?.bigCrunch?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.bigCrunch.isActive', e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {renderValidationIndicator('auto.bigCrunch.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-infinity-amount">Infinity Amount</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="auto-infinity-amount"
                    value={saveData.auto?.bigCrunch?.amount?.toString() || '0'}
                    onChange={(e) => handleValueChange('auto.bigCrunch.amount', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={androidSaveData?.auto?.bigCrunch?.amount || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('auto.bigCrunch.amount', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('auto.bigCrunch.amount')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-infinity-mode">Infinity Mode</label>
                <select
                  id="auto-infinity-mode"
                  value={saveData.auto?.bigCrunch?.mode || 0}
                  onChange={(e) => handleValueChange('auto.bigCrunch.mode', parseInt(e.target.value))}
                >
                  <option value="0">Amount</option>
                  <option value="1">Time</option>
                  <option value="2">X times last</option>
                </select>
                {renderValidationIndicator('auto.bigCrunch.mode')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Dimension Boost Autobuyer</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="dimboost-isActive">Status</label>
                <select
                  id="dimboost-isActive"
                  value={saveData.auto?.dimBoost?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.dimBoost.isActive', e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {renderValidationIndicator('auto.dimBoost.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dimboost-amount">Max Dimension Boosts</label>
                <input
                  type="number"
                  id="dimboost-amount"
                  value={saveData.auto?.dimBoost?.maxDimBoosts || 0}
                  onChange={(e) => handleValueChange('auto.dimBoost.maxDimBoosts', parseInt(e.target.value))}
                />
                {renderValidationIndicator('auto.dimBoost.maxDimBoosts')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dimboost-limit">Dimension Boost Limit</label>
                <input
                  type="number"
                  id="dimboost-limit"
                  value={saveData.auto?.dimBoost?.limitDimBoosts ? 1 : 0}
                  onChange={(e) => handleValueChange('auto.dimBoost.limitDimBoosts', Boolean(parseInt(e.target.value)))}
                />
                {renderValidationIndicator('auto.dimBoost.limitDimBoosts')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Galaxy Autobuyer</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="galaxy-isActive">Status</label>
                <select
                  id="galaxy-isActive"
                  value={saveData.auto?.galaxy?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.galaxy.isActive', e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {renderValidationIndicator('auto.galaxy.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="galaxy-limit">Galaxy Limit</label>
                <input
                  type="number"
                  id="galaxy-limit"
                  value={saveData.auto?.galaxy?.maxGalaxies || 0}
                  onChange={(e) => handleValueChange('auto.galaxy.maxGalaxies', parseInt(e.target.value))}
                />
                {renderValidationIndicator('auto.galaxy.maxGalaxies')}
              </div>
              
              <div className="form-group">
                <label htmlFor="galaxy-bulkAmount">Galaxy Bulk Amount</label>
                <input
                  type="number"
                  id="galaxy-bulkAmount"
                  value={saveData.auto?.galaxy?.buyMaxInterval ? 1 : 0}
                  onChange={(e) => handleValueChange('auto.galaxy.buyMaxInterval', Boolean(parseInt(e.target.value)))}
                />
                {renderValidationIndicator('auto.galaxy.buyMaxInterval')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Dimensions Autobuyers Subtab */}
        <div className={`subtab-content ${activeSubtab === 'dimensions' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dimension Autobuyers</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="antimatterDims">Antimatter Dimensions</label>
                <select
                  id="antimatterDims"
                  value={isPCFormat() ? 
                    (pcSaveData?.auto?.antimatterDims?.isActive ?? false ? 'true' : 'false') : 
                    (androidSaveData?.auto?.dimensions?.[0]?.isActive ?? false ? 'true' : 'false')}
                  onChange={(e) => handleValueChange(isPCFormat() ? 
                    'auto.antimatterDims.isActive' : 'auto.dimensions.0.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator(isPCFormat() ? 'auto.antimatterDims.isActive' : 'auto.dimensions.0.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="tickspeed">Tickspeed</label>
                <select
                  id="tickspeed"
                  value={saveData.auto?.tickspeed?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.tickspeed.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('auto.tickspeed.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="sacrifice">Dimension Sacrifice</label>
                <select
                  id="sacrifice"
                  value={saveData.auto?.sacrifice?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.sacrifice.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('auto.sacrifice.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinityDims">Infinity Dimensions</label>
                <select
                  id="infinityDims"
                  value={isPCFormat() ? 
                    (pcSaveData?.auto?.infinityDims?.isActive ?? false ? 'true' : 'false') : 
                    (androidSaveData?.auto?.infinityDims?.[0]?.isActive ?? false ? 'true' : 'false')}
                  onChange={(e) => handleValueChange(isPCFormat() ? 
                    'auto.infinityDims.isActive' : 'auto.infinityDims.0.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator(isPCFormat() ? 'auto.infinityDims.isActive' : 'auto.infinityDims.0.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="timeDims">Time Dimensions</label>
                <select
                  id="timeDims"
                  value={isPCFormat() ? 
                    (pcSaveData?.auto?.timeDims?.isActive ?? false ? 'true' : 'false') : 
                    (androidSaveData?.auto?.timeDims?.[0]?.isActive ?? false ? 'true' : 'false')}
                  onChange={(e) => handleValueChange(isPCFormat() ? 
                    'auto.timeDims.isActive' : 'auto.timeDims.0.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator(isPCFormat() ? 'auto.timeDims.isActive' : 'auto.timeDims.0.isActive')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Autobuyers Subtab */}
        <div className={`subtab-content ${activeSubtab === 'advanced' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Eternity Autobuyer</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="eternity">Status</label>
                <select
                  id="eternity"
                  value={saveData.auto?.eternity?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.eternity.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('auto.eternity.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-eternity-amount">Eternity Amount</label>
                <input
                  type="text"
                  id="auto-eternity-amount"
                  value={saveData.auto?.eternity?.amount?.toString() || '0'}
                  onChange={(e) => handleValueChange('auto.eternity.amount', e.target.value)}
                />
                {renderValidationIndicator('auto.eternity.amount')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-eternity-mode">Eternity Mode</label>
                <select
                  id="auto-eternity-mode"
                  value={saveData.auto?.eternity?.mode || 0}
                  onChange={(e) => handleValueChange('auto.eternity.mode', parseInt(e.target.value))}
                >
                  <option value="0">Amount</option>
                  <option value="1">Time</option>
                  <option value="2">X times last</option>
                </select>
                {renderValidationIndicator('auto.eternity.mode')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Reality Autobuyer</h4>
            <div className="autobuyers-grid">
              <div className="form-group">
                <label htmlFor="reality">Status</label>
                <select
                  id="reality"
                  value={saveData.auto?.reality?.isActive ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('auto.reality.isActive', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('auto.reality.isActive')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-reality-rm">Reality Machines</label>
                <input
                  type="text"
                  id="auto-reality-rm"
                  value={saveData.auto?.reality?.rm?.toString() || '0'}
                  onChange={(e) => handleValueChange('auto.reality.rm', e.target.value)}
                />
                {renderValidationIndicator('auto.reality.rm')}
              </div>
              
              <div className="form-group">
                <label htmlFor="auto-reality-mode">Reality Mode</label>
                <select
                  id="auto-reality-mode"
                  value={saveData.auto?.reality?.mode || 0}
                  onChange={(e) => handleValueChange('auto.reality.mode', parseInt(e.target.value))}
                >
                  <option value="0">Amount</option>
                  <option value="1">Time</option>
                  <option value="2">X times last</option>
                </select>
                {renderValidationIndicator('auto.reality.mode')}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AutoBuyersSection; 