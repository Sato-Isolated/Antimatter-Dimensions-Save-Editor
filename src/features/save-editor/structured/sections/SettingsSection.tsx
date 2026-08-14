import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaDesktop, FaBolt, FaCheck, FaVideo } from 'react-icons/fa';
import { hasPath, getValueAtPath } from '../../../../domain/save/document/path';
import { bitfieldCatalog, getKnownBitDefinitions } from '../../../../domain/save/catalog/bitfields';
import { resolveRegisteredFieldPath } from '../../../../domain/save/catalog/fields';
import { SaveObject, isMobileSaveType } from '../../../../domain/save/model';
import BitfieldEditor from '../../../../shared/ui/BitfieldEditor';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import { parseNumericInput } from './fieldHelpers';

interface SettingsSaveView {
  options?: {
    themeClassic?: string;
    notation?: string;
    news?: { enabled?: boolean };
    hiddenTabBits?: number;
    updateRate?: number;
    offlineProgress?: boolean | string;
    autosaveInterval?: number;
    confirmations?: {
      sacrifice?: boolean;
      challenges?: boolean;
      eternity?: boolean;
      resetReality?: boolean;
      reality?: boolean;
      realityReset?: boolean;
      dilation?: boolean;
    };
    animations?: {
      bigCrunch?: boolean;
      eternity?: boolean;
      reality?: boolean;
    };
  };
}

const SettingsSection: React.FC<SectionProps> = ({ 
  saveData, 
  handleValueChange, 
  renderValidationIndicator,
  saveType,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('interface');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  const typedSaveData = saveData as unknown as SettingsSaveView;
  const saveRecord = saveData as unknown as SaveObject;
  const realityConfirmationPath = hasPath(saveRecord, 'options.confirmations.resetReality')
    ? 'options.confirmations.resetReality'
    : hasPath(saveRecord, 'options.confirmations.realityReset')
      ? 'options.confirmations.realityReset'
      : 'options.confirmations.reality';
  const hiddenTabDefinition = bitfieldCatalog.find((entry) => entry.id === 'hiddenTabBits');
  const hiddenTabPath = resolveRegisteredFieldPath(saveRecord, 'hiddenTabBits', saveType);
  const hiddenTabValue = getValueAtPath(saveRecord, hiddenTabPath);
  const offlineProgressValue = typedSaveData.options?.offlineProgress;
  const offlineProgressSelection = offlineProgressValue === 'SHOWN'
    ? 'shown'
    : offlineProgressValue === true ? 'enabled' : 'disabled';
  const autosaveSeconds = typeof typedSaveData.options?.autosaveInterval === 'number'
    ? typedSaveData.options.autosaveInterval / 1000
    : 30;

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
                <FieldDescription>Upstream stores the selected classic theme name in options.themeClassic. The editor does not migrate theme names between game versions.</FieldDescription>
                {renderValidationIndicator('options.themeClassic')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-notation">Notation</label>
                <select
                  id="settings-notation"
                  value={typedSaveData.options?.notation || "Mixed scientific"}
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
                <FieldDescription>Notation controls how the game formats large values; the upstream default is Mixed scientific.</FieldDescription>
                {renderValidationIndicator('options.notation')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-newsEnabled">News ticker</label>
                <select
                  id="settings-newsEnabled"
                  value={typedSaveData.options?.news?.enabled === false ? 'disabled' : 'enabled'}
                  onChange={(e) => handleValueChange('options.news.enabled', e.target.value === 'enabled')}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
                <FieldDescription>Enabled means the news ticker can display. This is the stored news.enabled flag, not an inverted “hide” setting.</FieldDescription>
                {renderValidationIndicator('options.news.enabled')}
              </div>
            </div>
            {hiddenTabDefinition ? (
              <BitfieldEditor
                path={hiddenTabPath}
                label="Hidden top-level tabs"
                description="Each checked item hides one game tab. This is a bitfield, not a boolean: keeping the other bits is essential when changing one tab."
                value={hiddenTabValue}
                knownBits={getKnownBitDefinitions(hiddenTabDefinition)}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
            ) : null}
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
                  min="33"
                  max="200"
                  step="1"
                  value={typedSaveData.options?.updateRate ?? 33}
                  onChange={(e) => handleValueChange('options.updateRate', parseNumericInput(e.target.value))}
                />
                <FieldDescription>Game loop interval in milliseconds. Upstream currently accepts 33–200 ms; 33 ms is the default.</FieldDescription>
                {renderValidationIndicator('options.updateRate')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-offlineProgress">Offline Progress</label>
                  <select
                    id="settings-offlineProgress"
                  value={offlineProgressSelection}
                  onChange={(e) => handleValueChange(
                    'options.offlineProgress',
                    e.target.value === 'shown' ? 'SHOWN' : e.target.value === 'enabled',
                  )}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                  {isMobileSaveType(saveType) && <option value="shown">Shown (mobile)</option>}
                </select>
                <FieldDescription>PC/Web saves use a boolean. Mobile saves may use SHOWN, which keeps offline progress enabled while exposing the away-progress view.</FieldDescription>
                {renderValidationIndicator('options.offlineProgress')}
              </div>

              <div className="form-group">
                <label htmlFor="settings-autosaveInterval">Autosave Interval (s)</label>
                <input
                  type="number"
                  id="settings-autosaveInterval"
                  min="1"
                  step="1"
                  value={autosaveSeconds}
                  onChange={(e) => handleValueChange('options.autosaveInterval', parseNumericInput(e.target.value) * 1000)}
                />
                <FieldDescription>The UI displays seconds, but upstream stores this option in milliseconds (30,000 ms for the default).</FieldDescription>
                {renderValidationIndicator('options.autosaveInterval')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Confirmations Subtab */}
        <div className={`subtab-content ${activeSubtab === 'confirmations' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Confirmation Dialogs</h4>
            <FieldDescription>Yes keeps the game confirmation dialog for that action. No performs the action immediately. The Reality key is versioned between resetReality, realityReset, and the legacy reality name; the editor writes the key already present in the save.</FieldDescription>
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
                  value={(typedSaveData.options?.confirmations?.resetReality ?? typedSaveData.options?.confirmations?.realityReset ?? typedSaveData.options?.confirmations?.reality) ? 'true' : 'false'}
                  onChange={(e) => handleValueChange(realityConfirmationPath, e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator(realityConfirmationPath)}
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
            <FieldDescription>These flags control whether the corresponding reset animation is shown. They do not change game progression.</FieldDescription>
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
