import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaDesktop, FaBolt, FaCheck, FaVideo } from 'react-icons/fa';

const SettingsSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator 
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('interface');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  // Use typedSaveData to bypass type checking for properties that exist at runtime but aren't in type definitions
  const typedSaveData = saveData as any;

  return (
    <div className="section-pane active" id="settings-section">
      <div className="section-content">
        <h3>Game Settings</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'interface' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('interface')}
          >
            <FaDesktop className="subtab-icon" /> Interface
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'performance' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('performance')}
          >
            <FaBolt className="subtab-icon" /> Performance
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'confirmations' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('confirmations')}
          >
            <FaCheck className="subtab-icon" /> Confirmations
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'animations' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('animations')}
          >
            <FaVideo className="subtab-icon" /> Animations
          </button>
        </div>
        
        {/* Interface Subtab */}
        <div className={`subtab-content ${activeSubtab === 'interface' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Interface Settings</h4>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="settings-theme">Game Theme</label>
                <select
                  id="settings-theme"
                  value={typedSaveData.options?.themeClassic || "Normal"}
                  onChange={(e) => handleValueChange('options.themeClassic', e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Dark">Dark</option>
                  <option value="Metro">Metro</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="S4">S4</option>
                  <option value="S5">S5</option>
                  <option value="S6">S6</option>
                </select>
                {renderValidationIndicator('options.themeClassic')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-notation">Notation</label>
                <select
                  id="settings-notation"
                  value={typedSaveData.options?.notation || "Scientific"}
                  onChange={(e) => handleValueChange('options.notation', e.target.value)}
                >
                  <option value="Scientific">Scientific</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Letters">Letters</option>
                  <option value="Standard">Standard</option>
                  <option value="Emoji">Emoji</option>
                  <option value="Mixed scientific">Mixed Scientific</option>
                  <option value="Mixed engineering">Mixed Engineering</option>
                  <option value="Logarithm">Logarithm</option>
                  <option value="Brackets">Brackets</option>
                  <option value="Infinity">Infinity</option>
                </select>
                {renderValidationIndicator('options.notation')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-newsHidden">Hide News</label>
                <select
                  id="settings-newsHidden"
                  value={typedSaveData.options?.news?.enabled === false ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.news.enabled', e.target.value === 'true' ? false : true)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.news.enabled')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-hideProductionTab">Hide Production Tab</label>
                <select
                  id="settings-hideProductionTab"
                  value={typedSaveData.options?.hiddenTabBits ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.hiddenTabBits', e.target.value === 'true' ? 1 : 0)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.hiddenTabBits')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Subtab */}
        <div className={`subtab-content ${activeSubtab === 'performance' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Performance Settings</h4>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="settings-updateRate">Update Rate (ms)</label>
                <input
                  type="number"
                  id="settings-updateRate"
                  value={typedSaveData.options?.updateRate || 50}
                  onChange={(e) => handleValueChange('options.updateRate', parseInt(e.target.value))}
                />
                {renderValidationIndicator('options.updateRate')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-offlineProgress">Offline Progress</label>
                <select
                  id="settings-offlineProgress"
                  value={typedSaveData.options?.offlineProgress ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.offlineProgress', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.offlineProgress')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-autosaveInterval">Autosave Interval (s)</label>
                <input
                  type="number"
                  id="settings-autosaveInterval"
                  value={typedSaveData.options?.autosaveInterval || 30}
                  onChange={(e) => handleValueChange('options.autosaveInterval', parseInt(e.target.value))}
                />
                {renderValidationIndicator('options.autosaveInterval')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Confirmations Subtab */}
        <div className={`subtab-content ${activeSubtab === 'confirmations' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Confirmation Dialogs</h4>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="settings-confirmations-sacrifice">Dimension Sacrifice</label>
                <select
                  id="settings-confirmations-sacrifice"
                  value={typedSaveData.options?.confirmations?.sacrifice ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.confirmations.sacrifice', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.confirmations.sacrifice')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-confirmations-challenges">Challenges</label>
                <select
                  id="settings-confirmations-challenges"
                  value={typedSaveData.options?.confirmations?.challenges ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.confirmations.challenges', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.confirmations.challenges')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-confirmations-eternity">Eternity</label>
                <select
                  id="settings-confirmations-eternity"
                  value={typedSaveData.options?.confirmations?.eternity ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.confirmations.eternity', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.confirmations.eternity')}
              </div>
              
              <div className="form-group">
                <label htmlFor="settings-confirmations-reality">Reality</label>
                <select
                  id="settings-confirmations-reality"
                  value={typedSaveData.options?.confirmations?.reality ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.confirmations.reality', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.confirmations.reality')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-confirmations-dilation">Dilation</label>
                <select
                  id="settings-confirmations-dilation"
                  value={typedSaveData.options?.confirmations?.dilation ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.confirmations.dilation', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.confirmations.dilation')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Animations Subtab */}
        <div className={`subtab-content ${activeSubtab === 'animations' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Animation Settings</h4>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="settings-animations-bigCrunch">Big Crunch</label>
                <select
                  id="settings-animations-bigCrunch"
                  value={typedSaveData.options?.animations?.bigCrunch ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.animations.bigCrunch', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.animations.bigCrunch')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-animations-eternity">Eternity</label>
                <select
                  id="settings-animations-eternity"
                  value={typedSaveData.options?.animations?.eternity ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.animations.eternity', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.animations.eternity')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-animations-reality">Reality</label>
                <select
                  id="settings-animations-reality"
                  value={typedSaveData.options?.animations?.reality ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('options.animations.reality', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('options.animations.reality')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection; 