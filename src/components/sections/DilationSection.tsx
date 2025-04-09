import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaExpand, FaTachometerAlt, FaArrowUp } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import { SaveType } from '../../services/SaveService';
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
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
          >
            <FaExpand className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'tachyons' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('tachyons')}
          >
            <FaTachometerAlt className="subtab-icon" /> Tachyons
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
          >
            <FaArrowUp className="subtab-icon" /> Upgrades
          </button>
        </div>
        
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
                <label htmlFor="dilation-unlocked">Unlocked</label>
                <select
                  id="dilation-unlocked"
                  value={(saveData.dilation as any)?.unlocked ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('dilation.unlocked', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('dilation.unlocked')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-nextThreshold">Next Threshold</label>
                <BigNumberInput
                  value={isPCFormat() ? (saveData.dilation?.nextThreshold || '0') : (saveData.dilation?.nextThreshold || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.nextThreshold', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.nextThreshold')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-baseDilation">Base Dilation</label>
                <BigNumberInput
                  value={isPCFormat() ? ((saveData.dilation as any)?.baseDilation || '0') : ((saveData.dilation as any)?.baseDilation || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.baseDilation', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.baseDilation')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-totalTachyonParticles">Total TP</label>
                <BigNumberInput
                  value={isPCFormat() ? ((saveData.dilation as any)?.totalTachyonParticles || '0') : ((saveData.dilation as any)?.totalTachyonParticles || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.totalTachyonParticles', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.totalTachyonParticles')}
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
                <label htmlFor="dilation-tachyonParticles">Current TP</label>
                <BigNumberInput
                  value={isPCFormat() ? (saveData.dilation?.tachyonParticles || '0') : (saveData.dilation?.tachyonParticles || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('dilation.tachyonParticles', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.tachyonParticles')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-dilatedTime">Dilated Time</label>
                <BigNumberInput
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
                <label htmlFor="dilation-upgrades">Upgrades</label>
                <textarea
                  id="dilation-upgrades"
                  value={JSON.stringify(saveData.dilation?.upgrades || [])}
                  onChange={(e) => {
                    try {
                      const upgrades = JSON.parse(e.target.value);
                      if (Array.isArray(upgrades)) {
                        handleValueChange('dilation.upgrades', upgrades);
                      }
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                  rows={3}
                />
                {renderValidationIndicator('dilation.upgrades')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-rebuyables">Rebuyable Upgrades</label>
                <textarea
                  id="dilation-rebuyables"
                  value={JSON.stringify(saveData.dilation?.rebuyables || {})}
                  onChange={(e) => {
                    try {
                      const rebuyables = JSON.parse(e.target.value);
                      handleValueChange('dilation.rebuyables', rebuyables);
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                  rows={3}
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