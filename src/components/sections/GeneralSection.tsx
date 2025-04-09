import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaSuperscript, FaInfinity, FaHourglassHalf, FaSun } from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct as AntimatterDimensionsStructAndroid
} from '../../Struct';

const GeneralSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator,
  saveType
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('antimatter');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  // Helper for safely accessing PC-specific properties
  const getPCData = (): AntimatterDimensionsStruct | null => {
    return saveType === SaveType.PC ? saveData as AntimatterDimensionsStruct : null;
  };

  // Helper for safely accessing Android-specific properties
  const getAndroidData = (): AntimatterDimensionsStructAndroid | null => {
    return saveType === SaveType.Android ? saveData as AntimatterDimensionsStructAndroid : null;
  };

  // Check if a property exists in both PC and Android formats
  const hasProperty = (prop: string): boolean => {
    return prop in saveData;
  };

  // Helper for handling boolean values that may not exist in Android format
  const getBooleanValue = (prop: string, defaultValue = false): boolean => {
    if (prop in saveData) {
      return Boolean(saveData[prop as keyof typeof saveData]);
    }
    return defaultValue;
  };

  // Helper for numeric inputs that may be different types in Android
  const getNumericValue = (prop: string, defaultValue = 0): number => {
    if (prop in saveData) {
      const value = saveData[prop as keyof typeof saveData];
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value) {
        // For Android BankedInfinitiesClass, show approximate value
        return value.mantissa * Math.pow(10, value.exponent);
      }
    }
    return defaultValue;
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
                <BigNumberInput 
                  value={saveData.antimatter} 
                  onChange={(value) => handleValueChange('antimatter', value)} 
                  saveType={saveType}
                />
                {renderValidationIndicator('antimatter')}
              </div>
              
              <div className="form-group">
                <label htmlFor="matter">Matter</label>
                <BigNumberInput 
                  value={saveData.matter} 
                  onChange={(value) => handleValueChange('matter', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('matter')}
              </div>
              
              <div className="form-group">
                <label htmlFor="buyUntil10">Buy Until 10</label>
                <select
                  id="buyUntil10"
                  value={getBooleanValue('buyUntil10') ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('buyUntil10', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('buyUntil10')}
              </div>
              
              {saveType === SaveType.PC && (
                <div className="form-group">
                  <label htmlFor="break">Break Infinity</label>
                  <select
                    id="break"
                    value={getBooleanValue('break') ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('break', e.target.value === 'true')}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                  {renderValidationIndicator('break')}
                </div>
              )}
              
              {saveType === SaveType.Android && (
                <div className="form-group">
                  <label htmlFor="brake">Break Infinity</label>
                  <select
                    id="brake"
                    value={getBooleanValue('brake') ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('brake', e.target.value === 'true')}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                  {renderValidationIndicator('brake')}
                </div>
              )}
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
                <BigNumberInput 
                  value={saveData.sacrificed} 
                  onChange={(value) => handleValueChange('sacrificed', value)}
                  saveType={saveType}
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
                <BigNumberInput 
                  value={saveData.infinityPoints || (saveType === SaveType.PC ? '0' : {mantissa: 0, exponent: 0})} 
                  onChange={(value) => handleValueChange('infinityPoints', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('infinityPoints')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinities">Infinities</label>
                <BigNumberInput 
                  value={saveData.infinities || (saveType === SaveType.PC ? '0' : {mantissa: 0, exponent: 0})} 
                  onChange={(value) => handleValueChange('infinities', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('infinities')}
              </div>
              
              {saveType === SaveType.PC && (
                <div className="form-group">
                  <label htmlFor="infinitiesBanked">Banked Infinities</label>
                  <BigNumberInput 
                    value={getPCData()?.infinitiesBanked || '0'} 
                    onChange={(value) => handleValueChange('infinitiesBanked', value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('infinitiesBanked')}
                </div>
              )}
              
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
                <BigNumberInput 
                  value={saveData.infinityPower || (saveType === SaveType.PC ? '0' : {mantissa: 0, exponent: 0})} 
                  onChange={(value) => handleValueChange('infinityPower', value)}
                  saveType={saveType}
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
                <BigNumberInput 
                  value={saveData.eternityPoints} 
                  onChange={(value) => handleValueChange('eternityPoints', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('eternityPoints')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eternities">Eternities</label>
                <BigNumberInput 
                  value={saveData.eternities} 
                  onChange={(value) => handleValueChange('eternities', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('eternities')}
              </div>
              
              <div className="form-group">
                <label htmlFor="timeShards">Time Shards</label>
                <BigNumberInput 
                  value={saveData.timeShards} 
                  onChange={(value) => handleValueChange('timeShards', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('timeShards')}
              </div>
              
              <div className="form-group">
                <label htmlFor="totalTickGained">Total Ticks Gained</label>
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
                <label htmlFor="totalTickBought">Total Ticks Bought</label>
                <input 
                  type="number" 
                  id="totalTickBought" 
                  name="totalTickBought"
                  value={saveData.totalTickBought || 0}
                  onChange={(e) => handleValueChange('totalTickBought', parseInt(e.target.value))}
                />
                {renderValidationIndicator('totalTickBought')}
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
                {saveType === SaveType.PC ? (
                  <input 
                    type="number" 
                    id="realities" 
                    name="realities"
                    value={typeof saveData.realities === 'number' ? saveData.realities : 0}
                    onChange={(e) => handleValueChange('realities', parseInt(e.target.value))}
                  />
                ) : (
                  <BigNumberInput 
                    value={saveData.realities} 
                    onChange={(value) => handleValueChange('realities', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('realities')}
              </div>
              
              {saveType === SaveType.PC && (
                <div className="form-group">
                  <label htmlFor="reality.realityMachines">Reality Machines</label>
                  <input 
                    type="text" 
                    id="reality.realityMachines" 
                    name="reality.realityMachines"
                    value={saveData.reality?.realityMachines?.toString() || '0'}
                    onChange={(e) => handleValueChange('reality.realityMachines', e.target.value)}
                  />
                  {renderValidationIndicator('reality.realityMachines')}
                </div>
              )}
              
              {saveType === SaveType.Android && (
                <div className="form-group">
                  <label htmlFor="reality.realityMachines">Reality Machines</label>
                  <BigNumberInput 
                    value={saveData.reality?.realityMachines} 
                    onChange={(value) => handleValueChange('reality.realityMachines', value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('reality.realityMachines')}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="reality.imaginaryMachines">Imaginary Machines</label>
                <input 
                  type="number" 
                  id="reality.imaginaryMachines" 
                  name="reality.imaginaryMachines"
                  value={saveData.reality?.imaginaryMachines || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryMachines', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryMachines')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality.iMCap">IM Cap</label>
                <input 
                  type="number" 
                  id="reality.iMCap" 
                  name="reality.iMCap"
                  value={saveData.reality?.iMCap || 0}
                  onChange={(e) => handleValueChange('reality.iMCap', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.iMCap')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality.perkPoints">Perk Points</label>
                {saveType === SaveType.PC ? (
                  <input 
                    type="number" 
                    id="reality.perkPoints" 
                    name="reality.perkPoints"
                    value={typeof saveData.reality?.perkPoints === 'number' ? saveData.reality?.perkPoints : 0}
                    onChange={(e) => handleValueChange('reality.perkPoints', parseInt(e.target.value))}
                  />
                ) : (
                  <BigNumberInput 
                    value={saveData.reality?.perkPoints}
                    onChange={(value) => handleValueChange('reality.perkPoints', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('reality.perkPoints')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSection; 