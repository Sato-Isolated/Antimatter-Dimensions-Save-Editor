import React, { useState } from 'react';
import { SectionProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRocket } from '@fortawesome/free-solid-svg-icons';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct
} from '../../Struct';

const BlackHolesSection: React.FC<SectionProps> = ({
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

  // Cast saveData to specific type when needed - using 'as any' to bypass type checks for blackHole property
  const pcSaveData = isPCFormat() ? saveData as AntimatterDimensionsStruct : null;
  const androidSaveData = !isPCFormat() ? saveData as AndroidStruct : null;
  const typedSaveData = saveData as any;

  return (
    <div className="section-pane active" id="black-holes">
      <div className="section-content">
        <h3>Black Holes</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'general' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('general')}
          >
            <FontAwesomeIcon icon={faGear} className="subtab-icon" /> General
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'upgrades' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('upgrades')}
          >
            <FontAwesomeIcon icon={faRocket} className="subtab-icon" /> Upgrades
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'blackhole2' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('blackhole2')}
          >
            <FontAwesomeIcon icon={faGear} className="subtab-icon" /> Black Hole 2
          </button>
        </div>
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <h4>Black Hole 1</h4>
          <div className="black-holes-grid">
            <div className="form-group">
              <label htmlFor="black-hole-1-unlocked">Unlocked</label>
              <select
                id="black-hole-1-unlocked"
                value={typedSaveData.blackHole?.[0]?.unlocked ? 'true' : 'false'}
                onChange={(e) => handleValueChange('blackHole[0].unlocked', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('blackHole[0].unlocked')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-1-active">Active</label>
              <select
                id="black-hole-1-active"
                value={typedSaveData.blackHole?.[0]?.active ? 'true' : 'false'}
                onChange={(e) => handleValueChange('blackHole[0].active', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('blackHole[0].active')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-1-phase">Phase</label>
              <input
                type="number"
                id="black-hole-1-phase"
                value={typedSaveData.blackHole?.[0]?.phase || 0}
                step="0.01"
                onChange={(e) => handleValueChange('blackHole[0].phase', parseFloat(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].phase')}
            </div>
            
            <div className="form-group">
              <label htmlFor="black-hole-1-activations">Activations</label>
              <input
                type="number"
                id="black-hole-1-activations"
                value={typedSaveData.blackHole?.[0]?.activations || 0}
                onChange={(e) => handleValueChange('blackHole[0].activations', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].activations')}
            </div>
            
            <div className="form-group">
              <label htmlFor="black-hole-1-id">ID</label>
              <input
                type="number"
                id="black-hole-1-id"
                value={typedSaveData.blackHole?.[0]?.id || 0}
                onChange={(e) => handleValueChange('blackHole[0].id', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].id')}
            </div>
          </div>
          
          <h4>Global Settings</h4>
          <div className="black-holes-grid">
            <div className="form-group">
              <label htmlFor="blackHolePause">Black Hole Pause</label>
              <select
                id="blackHolePause"
                value={typedSaveData.blackHolePause ? 'true' : 'false'}
                onChange={(e) => handleValueChange('blackHolePause', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('blackHolePause')}
            </div>
            
            <div className="form-group">
              <label htmlFor="blackHoleAutoPauseMode">Auto Pause Mode</label>
              <select
                id="blackHoleAutoPauseMode"
                value={typedSaveData.blackHoleAutoPauseMode || 0}
                onChange={(e) => handleValueChange('blackHoleAutoPauseMode', parseInt(e.target.value))}
              >
                <option value="0">Off</option>
                <option value="1">Mode 1</option>
                <option value="2">Mode 2</option>
              </select>
              {renderValidationIndicator('blackHoleAutoPauseMode')}
            </div>
            
            <div className="form-group">
              <label htmlFor="blackHolePauseTime">Pause Time</label>
              <input
                type="number"
                id="blackHolePauseTime"
                value={typedSaveData.blackHolePauseTime || 0}
                onChange={(e) => handleValueChange('blackHolePauseTime', parseFloat(e.target.value))}
              />
              {renderValidationIndicator('blackHolePauseTime')}
            </div>
            
            <div className="form-group">
              <label htmlFor="blackHoleNegative">Black Hole Negative</label>
              <input
                type="number"
                id="blackHoleNegative"
                value={typedSaveData.blackHoleNegative || 0}
                onChange={(e) => handleValueChange('blackHoleNegative', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHoleNegative')}
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <h4>Black Hole 1</h4>
          <div className="black-holes-grid">
            <div className="form-group">
              <label htmlFor="black-hole-1-power-upgrade">Power Upgrade</label>
              <input
                type="number"
                id="black-hole-1-power-upgrade"
                value={typedSaveData.blackHole?.[0]?.powerUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[0].powerUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].powerUpgrades')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-1-interval-upgrade">Interval Upgrade</label>
              <input
                type="number"
                id="black-hole-1-interval-upgrade"
                value={typedSaveData.blackHole?.[0]?.intervalUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[0].intervalUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].intervalUpgrades')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-1-duration-upgrade">Duration Upgrade</label>
              <input
                type="number"
                id="black-hole-1-duration-upgrade"
                value={typedSaveData.blackHole?.[0]?.durationUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[0].durationUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[0].durationUpgrades')}
            </div>
            
            <h4>Black Hole 2</h4>
            <div className="form-group">
              <label htmlFor="black-hole-2-power-upgrade">Power Upgrade</label>
              <input
                type="number"
                id="black-hole-2-power-upgrade"
                value={typedSaveData.blackHole?.[1]?.powerUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[1].powerUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].powerUpgrades')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-2-interval-upgrade">Interval Upgrade</label>
              <input
                type="number"
                id="black-hole-2-interval-upgrade"
                value={typedSaveData.blackHole?.[1]?.intervalUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[1].intervalUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].intervalUpgrades')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-2-duration-upgrade">Duration Upgrade</label>
              <input
                type="number"
                id="black-hole-2-duration-upgrade"
                value={typedSaveData.blackHole?.[1]?.durationUpgrades || 0}
                onChange={(e) => handleValueChange('blackHole[1].durationUpgrades', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].durationUpgrades')}
            </div>
          </div>
        </div>
        
        {/* Black Hole 2 Subtab */}
        <div className={`subtab-content ${activeSubtab === 'blackhole2' ? 'active' : ''}`}>
          <h4>Black Hole 2</h4>
          <div className="black-holes-grid">
            <div className="form-group">
              <label htmlFor="black-hole-2-unlocked">Unlocked</label>
              <select
                id="black-hole-2-unlocked"
                value={typedSaveData.blackHole?.[1]?.unlocked ? 'true' : 'false'}
                onChange={(e) => handleValueChange('blackHole[1].unlocked', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('blackHole[1].unlocked')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-2-active">Active</label>
              <select
                id="black-hole-2-active"
                value={typedSaveData.blackHole?.[1]?.active ? 'true' : 'false'}
                onChange={(e) => handleValueChange('blackHole[1].active', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('blackHole[1].active')}
            </div>

            <div className="form-group">
              <label htmlFor="black-hole-2-phase">Phase</label>
              <input
                type="number"
                id="black-hole-2-phase"
                value={typedSaveData.blackHole?.[1]?.phase || 0}
                step="0.01"
                onChange={(e) => handleValueChange('blackHole[1].phase', parseFloat(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].phase')}
            </div>
            
            <div className="form-group">
              <label htmlFor="black-hole-2-activations">Activations</label>
              <input
                type="number"
                id="black-hole-2-activations"
                value={typedSaveData.blackHole?.[1]?.activations || 0}
                onChange={(e) => handleValueChange('blackHole[1].activations', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].activations')}
            </div>
            
            <div className="form-group">
              <label htmlFor="black-hole-2-id">ID</label>
              <input
                type="number"
                id="black-hole-2-id"
                value={typedSaveData.blackHole?.[1]?.id || 1}
                onChange={(e) => handleValueChange('blackHole[1].id', parseInt(e.target.value))}
              />
              {renderValidationIndicator('blackHole[1].id')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackHolesSection; 