import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaGem, FaScroll, FaRobot, FaUsers, FaBalanceScale, FaDragon, FaFire, FaSun } from 'react-icons/fa';
import { SaveType } from '../../services/SaveService';
import { 
  AntimatterDimensionsStruct,
  AndroidStruct as AntimatterDimensionsStructAndroid,
  BankedInfinitiesClass
} from '../../Struct';
import BigNumberInput from '../BigNumberInput';

// Helper function to safely convert BankedInfinitiesClass to string
const formatBigNumber = (value: string | BankedInfinitiesClass | number | undefined): string => {
  if (!value) return '0';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object' && 'mantissa' in value && 'exponent' in value) {
    return `${value.mantissa}e${value.exponent}`;
  }
  return '0';
};

const CelestialsSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('teresa');
  
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

  return (
    <div className="section-pane active" id="celestials">
      <div className="section-content">
        <h3>Celestials</h3>
        
        {/* Celestial Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'teresa' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('teresa')}
          >
            <FaGem className="subtab-icon" /> Teresa
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'effarig' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('effarig')}
          >
            <FaScroll className="subtab-icon" /> Effarig
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'enslaved' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('enslaved')}
          >
            <FaRobot className="subtab-icon" /> The Nameless Ones
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'v' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('v')}
          >
            <FaUsers className="subtab-icon" /> V
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'ra' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('ra')}
          >
            <FaSun className="subtab-icon" /> Ra
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'laitela' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('laitela')}
          >
            <FaBalanceScale className="subtab-icon" /> Lai'tela
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'pelle' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('pelle')}
          >
            <FaDragon className="subtab-icon" /> Pelle
          </button>
        </div>
        
        {/* Teresa Subtab */}
        <div className={`subtab-content ${activeSubtab === 'teresa' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Teresa Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="teresa-run">Currently in Teresa Run</label>
                <select
                  id="teresa-run"
                  value={saveData.celestials?.teresa?.run ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.teresa.run', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.teresa.run')}
              </div>
              
              <div className="form-group">
                <label htmlFor="teresa-poured">Poured Amount</label>
                <input
                  type="number"
                  id="teresa-poured"
                  value={saveData.celestials?.teresa?.pouredAmount || 0}
                  onChange={(e) => handleValueChange('celestials.teresa.pouredAmount', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.teresa.pouredAmount')}
              </div>
              
              <div className="form-group">
                <label htmlFor="teresa-unlocks">Unlock Bits</label>
                <input
                  type="number"
                  id="teresa-unlocks"
                  value={saveData.celestials?.teresa?.unlockBits || 0}
                  onChange={(e) => handleValueChange('celestials.teresa.unlockBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.teresa.unlockBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="teresa-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="teresa-quotes"
                  value={saveData.celestials?.teresa?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.teresa.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.teresa.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="teresa-best-am">Best Run Antimatter</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="teresa-best-am"
                    value={String(pcSaveData?.celestials?.teresa?.bestRunAM || '0')}
                    onChange={(e) => handleValueChange('celestials.teresa.bestRunAM', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.teresa?.bestRunAM as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.teresa.bestRunAM', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.teresa.bestRunAM')}
              </div>
              
              <div className="form-group">
                <label htmlFor="teresa-last-machines">Last Repeated Machines</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="teresa-last-machines"
                    value={String(pcSaveData?.celestials?.teresa?.lastRepeatedMachines || '0')}
                    onChange={(e) => handleValueChange('celestials.teresa.lastRepeatedMachines', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.teresa?.lastRepeatedMachines as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.teresa.lastRepeatedMachines', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.teresa.lastRepeatedMachines')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Effarig Subtab */}
        <div className={`subtab-content ${activeSubtab === 'effarig' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Effarig Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="effarig-run">Currently in Effarig Run</label>
                <select
                  id="effarig-run"
                  value={saveData.celestials?.effarig?.run ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.effarig.run', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.effarig.run')}
              </div>
              
              <div className="form-group">
                <label htmlFor="effarig-relics">Relic Shards</label>
                {isPCFormat() ? (
                  <input
                    type="number"
                    id="effarig-relics"
                    value={Number(pcSaveData?.celestials?.effarig?.relicShards || 0)}
                    onChange={(e) => handleValueChange('celestials.effarig.relicShards', parseInt(e.target.value))}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.effarig?.relicShards as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.effarig.relicShards', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.effarig.relicShards')}
              </div>
              
              <div className="form-group">
                <label htmlFor="effarig-unlocks">Unlock Bits</label>
                <input
                  type="number"
                  id="effarig-unlocks"
                  value={saveData.celestials?.effarig?.unlockBits || 0}
                  onChange={(e) => handleValueChange('celestials.effarig.unlockBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.effarig.unlockBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="effarig-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="effarig-quotes"
                  value={saveData.celestials?.effarig?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.effarig.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.effarig.quoteBits')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enslaved Subtab */}
        <div className={`subtab-content ${activeSubtab === 'enslaved' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>The Nameless Ones Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="enslaved-run">Currently in Nameless Run</label>
                <select
                  id="enslaved-run"
                  value={saveData.celestials?.enslaved?.run ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.enslaved.run', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.enslaved.run')}
              </div>
              
              <div className="form-group">
                <label htmlFor="enslaved-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="enslaved-quotes"
                  value={saveData.celestials?.enslaved?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.enslaved.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.enslaved.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="enslaved-stored">Stored Reality Machines</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="enslaved-stored"
                    value={String(pcSaveData?.celestials?.enslaved?.stored || '0')}
                    onChange={(e) => handleValueChange('celestials.enslaved.stored', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.enslaved?.stored as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.enslaved.stored', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.enslaved.stored')}
              </div>
              
              <div className="form-group">
                <label htmlFor="enslaved-tesseracts">Tesseracts</label>
                <input
                  type="number"
                  id="enslaved-tesseracts"
                  value={saveData.celestials?.enslaved?.tesseracts || 0}
                  onChange={(e) => handleValueChange('celestials.enslaved.tesseracts', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.enslaved.tesseracts')}
              </div>
              
              <div className="form-group">
                <label htmlFor="enslaved-progbits">Progress Bits</label>
                <input
                  type="number"
                  id="enslaved-progbits"
                  value={saveData.celestials?.enslaved?.progressBits || 0}
                  onChange={(e) => handleValueChange('celestials.enslaved.progressBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.enslaved.progressBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="enslaved-autoRelease">Auto Release</label>
                <select
                  id="enslaved-autoRelease"
                  value={saveData.celestials?.enslaved?.isAutoReleasing ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.enslaved.isAutoReleasing', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.enslaved.isAutoReleasing')}
              </div>
            </div>
          </div>
        </div>
        
        {/* V Subtab */}
        <div className={`subtab-content ${activeSubtab === 'v' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>V Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="v-run">Currently in V Run</label>
                <select
                  id="v-run"
                  value={saveData.celestials?.v?.run ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.v.run', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.v.run')}
              </div>
              
              <div className="form-group">
                <label htmlFor="v-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="v-quotes"
                  value={saveData.celestials?.v?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.v.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.v.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="v-unlockBits">Unlock Bits</label>
                <input
                  type="number"
                  id="v-unlockBits"
                  value={saveData.celestials?.v?.unlockBits || 0}
                  onChange={(e) => handleValueChange('celestials.v.unlockBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.v.unlockBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="v-goalCompletion">Goal Completion</label>
                <input
                  type="number"
                  id="v-goalCompletion"
                  value={(saveData.celestials?.v as any)?.goalCompletion || 0}
                  onChange={(e) => handleValueChange('celestials.v.goalCompletion', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.v.goalCompletion')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Ra Subtab */}
        <div className={`subtab-content ${activeSubtab === 'ra' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Ra Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="ra-unlocks">Unlock Bits</label>
                <input
                  type="number"
                  id="ra-unlocks"
                  value={saveData.celestials?.ra?.unlockBits || 0}
                  onChange={(e) => handleValueChange('celestials.ra.unlockBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.ra.unlockBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="ra-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="ra-quotes"
                  value={saveData.celestials?.ra?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.ra.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.ra.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="ra-petsCont">Pet Container</label>
                <textarea
                  id="ra-petsCont"
                  rows={3}
                  value={JSON.stringify(saveData.celestials?.ra?.pets || {})}
                  onChange={(e) => {
                    try {
                      const value = JSON.parse(e.target.value);
                      handleValueChange('celestials.ra.pets', value);
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('celestials.ra.pets')}
              </div>
              
              <div className="form-group">
                <label htmlFor="ra-alchemy">Alchemy Resources</label>
                <textarea
                  id="ra-alchemy"
                  rows={3}
                  value={JSON.stringify(saveData.celestials?.ra?.alchemy || {})}
                  onChange={(e) => {
                    try {
                      const value = JSON.parse(e.target.value);
                      handleValueChange('celestials.ra.alchemy', value);
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('celestials.ra.alchemy')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Laitela Subtab */}
        <div className={`subtab-content ${activeSubtab === 'laitela' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Lai'tela Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="laitela-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="laitela-quotes"
                  value={saveData.celestials?.laitela?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.laitela.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.laitela.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="laitela-entropy">Entropy</label>
                <input
                  type="number"
                  id="laitela-entropy"
                  value={saveData.celestials?.laitela?.entropy || 0}
                  onChange={(e) => handleValueChange('celestials.laitela.entropy', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.laitela.entropy')}
              </div>
              
              <div className="form-group">
                <label htmlFor="laitela-darkMatter">Dark Matter</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="laitela-darkMatter"
                    value={formatBigNumber(pcSaveData?.celestials?.laitela?.darkMatter)}
                    onChange={(e) => handleValueChange('celestials.laitela.darkMatter', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.laitela?.darkMatter as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.laitela.darkMatter', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.laitela.darkMatter')}
              </div>
              
              <div className="form-group">
                <label htmlFor="laitela-darkEnergy">Dark Energy</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="laitela-darkEnergy"
                    value={formatBigNumber(pcSaveData?.celestials?.laitela?.darkEnergy)}
                    onChange={(e) => handleValueChange('celestials.laitela.darkEnergy', e.target.value)}
                  />
                ) : (
                  <BigNumberInput
                    value={(androidSaveData?.celestials?.laitela?.darkEnergy as any) || {mantissa: 0, exponent: 0}}
                    onChange={(value) => handleValueChange('celestials.laitela.darkEnergy', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('celestials.laitela.darkEnergy')}
              </div>
              
              <div className="form-group">
                <label htmlFor="laitela-singularities">Singularities</label>
                <input
                  type="number"
                  id="laitela-singularities"
                  value={saveData.celestials?.laitela?.singularities || 0}
                  onChange={(e) => handleValueChange('celestials.laitela.singularities', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.laitela.singularities')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Pelle Subtab */}
        <div className={`subtab-content ${activeSubtab === 'pelle' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Pelle Settings</h4>
            <div className="celestials-grid">
              <div className="form-group">
                <label htmlFor="pelle-doomed">Doomed</label>
                <select
                  id="pelle-doomed"
                  value={saveData.celestials?.pelle?.doomed ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('celestials.pelle.doomed', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {renderValidationIndicator('celestials.pelle.doomed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="pelle-quotes">Quote Bits</label>
                <input
                  type="number"
                  id="pelle-quotes"
                  value={saveData.celestials?.pelle?.quoteBits || 0}
                  onChange={(e) => handleValueChange('celestials.pelle.quoteBits', parseInt(e.target.value))}
                />
                {renderValidationIndicator('celestials.pelle.quoteBits')}
              </div>
              
              <div className="form-group">
                <label htmlFor="pelle-remnants">Remnants</label>
                {isPCFormat() ? (
                  <input
                    type="text"
                    id="pelle-remnants"
                    value="0"
                    onChange={(e) => handleValueChange('celestials.pelle.remnants', e.target.value)}
                  />
                ) : (
                  <div className="android-number-inputs">
                    <input
                      type="number"
                      className="mantissa-input"
                      value={(androidSaveData?.celestials?.pelle?.remnants as any)?.mantissa ?? 0}
                      onChange={(e) => {
                        const newValue = { 
                          mantissa: parseFloat(e.target.value) || 0,
                          exponent: (androidSaveData?.celestials?.pelle?.remnants as any)?.exponent ?? 0
                        };
                        handleValueChange('celestials.pelle.remnants', newValue);
                      }}
                      step="0.01"
                    />
                    <span className="multiply-symbol">×10</span>
                    <input
                      type="number"
                      className="exponent-input"
                      value={(androidSaveData?.celestials?.pelle?.remnants as any)?.exponent ?? 0}
                      onChange={(e) => {
                        const newValue = {
                          mantissa: (androidSaveData?.celestials?.pelle?.remnants as any)?.mantissa ?? 0,
                          exponent: parseInt(e.target.value) || 0
                        };
                        handleValueChange('celestials.pelle.remnants', newValue);
                      }}
                    />
                  </div>
                )}
                {renderValidationIndicator('celestials.pelle.remnants')}
              </div>
              
              <div className="form-group">
                <label htmlFor="pelle-rifts">Rifts</label>
                <textarea
                  id="pelle-rifts"
                  rows={3}
                  value={JSON.stringify(saveData.celestials?.pelle?.rifts || {})}
                  onChange={(e) => {
                    try {
                      const value = JSON.parse(e.target.value);
                      handleValueChange('celestials.pelle.rifts', value);
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('celestials.pelle.rifts')}
              </div>
              
              <div className="form-group">
                <label htmlFor="pelle-upgrades">Upgrades</label>
                <textarea
                  id="pelle-upgrades"
                  rows={3}
                  value={JSON.stringify(saveData.celestials?.pelle?.upgrades || [])}
                  onChange={(e) => {
                    try {
                      const value = JSON.parse(e.target.value);
                      handleValueChange('celestials.pelle.upgrades', value);
                    } catch (error) {
                      console.error("Invalid JSON:", error);
                    }
                  }}
                />
                {renderValidationIndicator('celestials.pelle.upgrades')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelestialsSection; 