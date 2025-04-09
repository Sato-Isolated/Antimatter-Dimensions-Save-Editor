import React, { useState } from 'react';
import { SectionProps } from './types';
import { 
  FaCube, 
  FaInfinity, 
  FaClock, 
  FaHourglassHalf, 
  FaSun 
} from 'react-icons/fa';
import BigNumberInput from '../BigNumberInput';
import { SaveType } from '../../services/SaveService';

const DimensionsSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator,
  saveType
}) => {
  // State to track active subtab
  const [activeSubtab, setActiveSubtab] = useState<string>('antimatter');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  // Helper function to safely check if we're using PC structure
  const isPC = () => saveType === SaveType.PC;

  return (
    <div className="section-pane active" id="dimensions">
      <div className="section-content">
        <h3>Dimensions</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'antimatter' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('antimatter')}
          >
            <FaCube className="subtab-icon" /> Antimatter
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'infinity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('infinity')}
          >
            <FaInfinity className="subtab-icon" /> Infinity
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'time' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('time')}
          >
            <FaClock className="subtab-icon" /> Time
          </button>
          {isPC() && (
            <>
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
            </>
          )}
        </div>
        
        {/* Antimatter Dimensions Subtab */}
        <div className={`subtab-content ${activeSubtab === 'antimatter' ? 'active' : ''}`}>
          <div className="dimensions-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="dimension-group" key={`antimatter-${i+1}`}>
                <h4>Antimatter Dimension {i+1}</h4>
                <div className="form-group">
                  <label htmlFor={`antimatter-${i+1}-amount`}>Amount</label>
                  <BigNumberInput
                    value={isPC() ? (saveData.dimensions?.antimatter?.[i]?.amount?.toString() || '0') : (saveData.dimensions?.antimatter?.[i]?.amount || {mantissa: 0, exponent: 0})}
                    onChange={(value) => handleValueChange(`dimensions.antimatter[${i}].amount`, value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator(`dimensions.antimatter[${i}].amount`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`antimatter-${i+1}-bought`}>Bought</label>
                  <input
                    type="number"
                    id={`antimatter-${i+1}-bought`}
                    value={saveData.dimensions?.antimatter?.[i]?.bought || 0}
                    onChange={(e) => handleValueChange(`dimensions.antimatter[${i}].bought`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`dimensions.antimatter[${i}].bought`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`antimatter-${i+1}-costBumps`}>Cost Bumps</label>
                  <input
                    type="number"
                    id={`antimatter-${i+1}-costBumps`}
                    value={saveData.dimensions?.antimatter?.[i]?.costBumps || 0}
                    onChange={(e) => handleValueChange(`dimensions.antimatter[${i}].costBumps`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`dimensions.antimatter[${i}].costBumps`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Infinity Dimensions Subtab */}
        <div className={`subtab-content ${activeSubtab === 'infinity' ? 'active' : ''}`}>
          <div className="dimensions-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="dimension-group" key={`infinity-${i+1}`}>
                <h4>Infinity Dimension {i+1}</h4>
                <div className="form-group">
                  <label htmlFor={`infinity-${i+1}-amount`}>Amount</label>
                  <BigNumberInput
                    value={isPC() ? (saveData.dimensions?.infinity?.[i]?.amount?.toString() || '0') : (saveData.dimensions?.infinity?.[i]?.amount || {mantissa: 0, exponent: 0})}
                    onChange={(value) => handleValueChange(`dimensions.infinity[${i}].amount`, value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator(`dimensions.infinity[${i}].amount`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`infinity-${i+1}-bought`}>Bought</label>
                  <input
                    type="number"
                    id={`infinity-${i+1}-bought`}
                    value={saveData.dimensions?.infinity?.[i]?.bought || 0}
                    onChange={(e) => handleValueChange(`dimensions.infinity[${i}].bought`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`dimensions.infinity[${i}].bought`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`infinity-${i+1}-cost`}>Cost</label>
                  <BigNumberInput
                    value={isPC() ? (saveData.dimensions?.infinity?.[i]?.cost?.toString() || '0') : (saveData.dimensions?.infinity?.[i]?.cost || {mantissa: 0, exponent: 0})}
                    onChange={(value) => handleValueChange(`dimensions.infinity[${i}].cost`, value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator(`dimensions.infinity[${i}].cost`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`infinity-${i+1}-baseAmount`}>Base Amount</label>
                  <input
                    type="number"
                    id={`infinity-${i+1}-baseAmount`}
                    value={saveData.dimensions?.infinity?.[i]?.baseAmount || 0}
                    onChange={(e) => handleValueChange(`dimensions.infinity[${i}].baseAmount`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`dimensions.infinity[${i}].baseAmount`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`infinity-${i+1}-isUnlocked`}>Unlocked</label>
                  <select
                    id={`infinity-${i+1}-isUnlocked`}
                    value={saveData.dimensions?.infinity?.[i]?.isUnlocked ? 'true' : 'false'}
                    onChange={(e) => handleValueChange(`dimensions.infinity[${i}].isUnlocked`, e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {renderValidationIndicator(`dimensions.infinity[${i}].isUnlocked`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Dimensions Subtab */}
        <div className={`subtab-content ${activeSubtab === 'time' ? 'active' : ''}`}>
          <div className="dimensions-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="dimension-group" key={`time-${i+1}`}>
                <h4>Time Dimension {i+1}</h4>
                <div className="form-group">
                  <label htmlFor={`time-${i+1}-amount`}>Amount</label>
                  <BigNumberInput
                    value={isPC() ? (saveData.dimensions?.time?.[i]?.amount?.toString() || '0') : (saveData.dimensions?.time?.[i]?.amount || {mantissa: 0, exponent: 0})}
                    onChange={(value) => handleValueChange(`dimensions.time[${i}].amount`, value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator(`dimensions.time[${i}].amount`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`time-${i+1}-bought`}>Bought</label>
                  <input
                    type="number"
                    id={`time-${i+1}-bought`}
                    value={saveData.dimensions?.time?.[i]?.bought || 0}
                    onChange={(e) => handleValueChange(`dimensions.time[${i}].bought`, parseInt(e.target.value))}
                  />
                  {renderValidationIndicator(`dimensions.time[${i}].bought`)}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`time-${i+1}-cost`}>Cost</label>
                  <BigNumberInput
                    value={isPC() ? (saveData.dimensions?.time?.[i]?.cost?.toString() || '0') : (saveData.dimensions?.time?.[i]?.cost || {mantissa: 0, exponent: 0})}
                    onChange={(value) => handleValueChange(`dimensions.time[${i}].cost`, value)}
                    saveType={saveType}
                  />
                  {renderValidationIndicator(`dimensions.time[${i}].cost`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Eternity Dimensions Subtab - Only shown for PC format */}
        {isPC() && (
          <div className={`subtab-content ${activeSubtab === 'eternity' ? 'active' : ''}`}>
            <div className="dimensions-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <div className="dimension-group" key={`eternity-${i+1}`}>
                  <h4>Eternity Dimension {i+1}</h4>
                  <div className="form-group">
                    <label htmlFor={`eternity-${i+1}-amount`}>Amount</label>
                    <BigNumberInput
                      // Type assertion to handle PC-specific structure
                      value={(saveData as any).eternityDimensions?.[i]?.amount?.toString() || '0'}
                      onChange={(value) => handleValueChange(`eternityDimensions[${i}].amount`, value)}
                      saveType={saveType}
                    />
                    {renderValidationIndicator(`eternityDimensions[${i}].amount`)}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`eternity-${i+1}-bought`}>Bought</label>
                    <input
                      type="number"
                      id={`eternity-${i+1}-bought`}
                      value={(saveData as any).eternityDimensions?.[i]?.bought || 0}
                      onChange={(e) => handleValueChange(`eternityDimensions[${i}].bought`, parseInt(e.target.value))}
                    />
                    {renderValidationIndicator(`eternityDimensions[${i}].bought`)}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`eternity-${i+1}-baseAmount`}>Base Amount</label>
                    <input
                      type="number"
                      id={`eternity-${i+1}-baseAmount`}
                      value={(saveData as any).eternityDimensions?.[i]?.baseAmount || 0}
                      onChange={(e) => handleValueChange(`eternityDimensions[${i}].baseAmount`, parseInt(e.target.value))}
                    />
                    {renderValidationIndicator(`eternityDimensions[${i}].baseAmount`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Reality Dimensions Subtab - Only shown for PC format */}
        {isPC() && (
          <div className={`subtab-content ${activeSubtab === 'reality' ? 'active' : ''}`}>
            <div className="dimensions-grid">
              {Array.from({ length: 4 }, (_, i) => (
                <div className="dimension-group" key={`reality-${i+1}`}>
                  <h4>Reality Dimension {i+1}</h4>
                  <div className="form-group">
                    <label htmlFor={`reality-${i+1}-amount`}>Amount</label>
                    <BigNumberInput
                      // Type assertion to handle PC-specific structure
                      value={(saveData as any).realityDimensions?.[i]?.amount?.toString() || '0'}
                      onChange={(value) => handleValueChange(`realityDimensions[${i}].amount`, value)}
                      saveType={saveType}
                    />
                    {renderValidationIndicator(`realityDimensions[${i}].amount`)}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`reality-${i+1}-bought`}>Bought</label>
                    <input
                      type="number"
                      id={`reality-${i+1}-bought`}
                      value={(saveData as any).realityDimensions?.[i]?.bought || 0}
                      onChange={(e) => handleValueChange(`realityDimensions[${i}].bought`, parseInt(e.target.value))}
                    />
                    {renderValidationIndicator(`realityDimensions[${i}].bought`)}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`reality-${i+1}-isUnlocked`}>Unlocked</label>
                    <select
                      id={`reality-${i+1}-isUnlocked`}
                      value={(saveData as any).realityDimensions?.[i]?.isUnlocked ? 'true' : 'false'}
                      onChange={(e) => handleValueChange(`realityDimensions[${i}].isUnlocked`, e.target.value === 'true')}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    {renderValidationIndicator(`realityDimensions[${i}].isUnlocked`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DimensionsSection; 