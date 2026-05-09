import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaExpand, FaTachometerAlt, FaArrowUp } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import JsonTextareaField from '../JsonTextareaField';
import { SaveType } from '../../services/SaveService';
import { parseNumericInput } from './fieldHelpers';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct as AntimatterDimensionsStructAndroid
} from '../../Struct';

const DilationSection: React.FC<SectionProps> = ({
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

  // Helper function to check if we're using PC format
  const isPCFormat = (): boolean => {
    return saveType === SaveType.PC;
  };

  // Helper functions to safely access data based on format
  const getPCData = () => isPCFormat() ? saveData as AntimatterDimensionsStruct : null;
  const getAndroidData = () => !isPCFormat() ? saveData as AntimatterDimensionsStructAndroid : null;

  return (
    <div className="section-pane active" id="dilation">
      <div className="section-content">
        <h3>Dilation</h3>
        
        {/* Subtabs */}
        <nav className="section-subtabs" aria-label="Dilation sections">
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
            aria-pressed={activeSubtab === 'general'}
          >
            <FaExpand className="subtab-icon" aria-hidden="true" /> General
          </button>
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'tachyons' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('tachyons')}
            aria-pressed={activeSubtab === 'tachyons'}
          >
            <FaTachometerAlt className="subtab-icon" aria-hidden="true" /> Tachyons
          </button>
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
            aria-pressed={activeSubtab === 'upgrades'}
          >
            <FaArrowUp className="subtab-icon" aria-hidden="true" /> Upgrades
          </button>
        </nav>
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation Status</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-active">Active</label>
                <select
                  id="dilation-active"
                  value={saveData.dilation?.active ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('dilation.active', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('dilation.active')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-baseTachyonGalaxies">Base Tachyon Galaxies</label>
                <input
                  type="number"
                  id="dilation-baseTachyonGalaxies"
                  value={saveData.dilation?.baseTachyonGalaxies || 0}
                  onChange={(e) => handleValueChange('dilation.baseTachyonGalaxies', parseNumericInput(e.target.value))}
                />
                {renderValidationIndicator('dilation.baseTachyonGalaxies')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Next Threshold"
                  value={isPCFormat() ? (saveData.dilation?.nextThreshold || '0') : (saveData.dilation?.nextThreshold || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.nextThreshold', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.nextThreshold')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-totalTachyonGalaxies">Total Tachyon Galaxies</label>
                <input
                  type="number"
                  id="dilation-totalTachyonGalaxies"
                  value={saveData.dilation?.totalTachyonGalaxies || 0}
                  onChange={(e) => handleValueChange('dilation.totalTachyonGalaxies', parseNumericInput(e.target.value))}
                />
                {renderValidationIndicator('dilation.totalTachyonGalaxies')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Last EP"
                  value={isPCFormat() ? (saveData.dilation?.lastEP || '0') : (saveData.dilation?.lastEP || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.lastEP', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.lastEP')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tachyons Subtab */}
        <div className={`subtab-content ${activeSubtab === 'tachyons' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Tachyon Particles</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <BigNumberInput
                  label="Current TP"
                  value={isPCFormat() ? (saveData.dilation?.tachyonParticles || '0') : (saveData.dilation?.tachyonParticles || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.tachyonParticles', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.tachyonParticles')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Dilated Time"
                  value={isPCFormat() ? (saveData.dilation?.dilatedTime || '0') : (saveData.dilation?.dilatedTime || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.dilatedTime', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.dilatedTime')}
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
                <JsonTextareaField
                  id="dilation-upgrades"
                  label="Upgrades"
                  value={saveData.dilation?.upgrades || []}
                  onChange={(value) => handleValueChange('dilation.upgrades', value)}
                  expectation="array"
                  rows={3}
                  fallbackValue={[]}
                />
                {renderValidationIndicator('dilation.upgrades')}
              </div>
              
              <div className="form-group">
                <JsonTextareaField
                  id="dilation-rebuyables"
                  label="Rebuyable Upgrades"
                  value={saveData.dilation?.rebuyables || {}}
                  onChange={(value) => handleValueChange('dilation.rebuyables', value)}
                  expectation="object"
                  rows={3}
                  fallbackValue={{}}
                />
                {renderValidationIndicator('dilation.rebuyables')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DilationSection; 