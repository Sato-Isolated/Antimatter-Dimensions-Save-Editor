import React, { useState } from 'react';
import { SectionProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGem, faSnowflake, faEye, faSun, faGlobeAsia, faSkull } from '@fortawesome/free-solid-svg-icons';

const CelestialsSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('teresa');
  
  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  return (
    <div className="section-pane active" id="celestials">
      <div className="section-content">
        <h3>Celestials</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'teresa' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('teresa')}
          >
            <FontAwesomeIcon icon={faStar} className="subtab-icon" /> Teresa
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'effarig' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('effarig')}
          >
            <FontAwesomeIcon icon={faGem} className="subtab-icon" /> Effarig
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'enslaved' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('enslaved')}
          >
            <FontAwesomeIcon icon={faSnowflake} className="subtab-icon" /> Enslaved
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'v' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('v')}
          >
            <FontAwesomeIcon icon={faEye} className="subtab-icon" /> V
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'ra' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('ra')}
          >
            <FontAwesomeIcon icon={faSun} className="subtab-icon" /> Ra
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'laitela' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('laitela')}
          >
            <FontAwesomeIcon icon={faGlobeAsia} className="subtab-icon" /> Laitela
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'pelle' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('pelle')}
          >
            <FontAwesomeIcon icon={faSkull} className="subtab-icon" /> Pelle
          </button>
        </div>
        
        {/* Teresa Subtab */}
        <div className={`subtab-content ${activeSubtab === 'teresa' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Teresa</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-teresa-unlocked">Unlocked</label>
              <select
                id="celestials-teresa-unlocked"
                value={saveData.celestials?.teresa?.unlockBits ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.teresa.unlockBits', e.target.value === 'true' ? 1 : 0)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.teresa.unlockBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-teresa-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-teresa-quoteBits"
                value={saveData.celestials?.teresa?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.teresa.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.teresa.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-teresa-perkShop">Perk Shop</label>
              <input
                type="text"
                id="celestials-teresa-perkShop"
                value={JSON.stringify(saveData.celestials?.teresa?.perkShop || [])}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.teresa.perkShop', value);
                  } catch (error) {
                    console.error("Invalid JSON for Teresa perk shop:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.teresa.perkShop')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-teresa-bestRunAM">Best Run AM</label>
              <input
                type="text"
                id="celestials-teresa-bestRunAM"
                value={saveData.celestials?.teresa?.bestRunAM || ''}
                onChange={(e) => handleValueChange('celestials.teresa.bestRunAM', e.target.value)}
              />
              {renderValidationIndicator('celestials.teresa.bestRunAM')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-teresa-run">Current Run</label>
              <input
                type="text"
                id="celestials-teresa-run"
                value={JSON.stringify(saveData.celestials?.teresa?.run || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.teresa.run', value);
                  } catch (error) {
                    console.error("Invalid JSON for Teresa run:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.teresa.run')}
            </div>
          </div>
        </div>
        
        {/* Effarig Subtab */}
        <div className={`subtab-content ${activeSubtab === 'effarig' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Effarig</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-effarig-unlocked">Unlocked</label>
              <select
                id="celestials-effarig-unlocked"
                value={saveData.celestials?.effarig?.unlockBits ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.effarig.unlockBits', e.target.value === 'true' ? 1 : 0)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.effarig.unlockBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-effarig-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-effarig-quoteBits"
                value={saveData.celestials?.effarig?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.effarig.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.effarig.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-effarig-relicShards">Relic Shards</label>
              <input
                type="text"
                id="celestials-effarig-relicShards"
                value={saveData.celestials?.effarig?.relicShards || ''}
                onChange={(e) => handleValueChange('celestials.effarig.relicShards', e.target.value)}
              />
              {renderValidationIndicator('celestials.effarig.relicShards')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-effarig-run">Run Status</label>
              <select
                id="celestials-effarig-run"
                value={saveData.celestials?.effarig?.run ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.effarig.run', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.effarig.run')}
            </div>
          </div>
        </div>
        
        {/* Enslaved Subtab */}
        <div className={`subtab-content ${activeSubtab === 'enslaved' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Enslaved</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-enslaved-unlocked">Unlocked</label>
              <select
                id="celestials-enslaved-unlocked"
                value={saveData.celestials?.enslaved?.unlocks?.length > 0 ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.enslaved.unlocks', e.target.value === 'true' ? [1] : [])}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.enslaved.unlocks')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-enslaved-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-enslaved-quoteBits"
                value={saveData.celestials?.enslaved?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.enslaved.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.enslaved.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-enslaved-stored">Stored RM</label>
              <input
                type="text"
                id="celestials-enslaved-stored"
                value={saveData.celestials?.enslaved?.stored || ''}
                onChange={(e) => handleValueChange('celestials.enslaved.stored', e.target.value)}
              />
              {renderValidationIndicator('celestials.enslaved.stored')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-enslaved-tesseracts">Tesseracts</label>
              <input
                type="number"
                id="celestials-enslaved-tesseracts"
                value={saveData.celestials?.enslaved?.tesseracts || 0}
                onChange={(e) => handleValueChange('celestials.enslaved.tesseracts', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.enslaved.tesseracts')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-enslaved-upgrades">Unlocks</label>
              <input
                type="text"
                id="celestials-enslaved-unlocks"
                value={JSON.stringify(saveData.celestials?.enslaved?.unlocks || [])}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.enslaved.unlocks', value);
                  } catch (error) {
                    console.error("Invalid JSON for Enslaved unlocks:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.enslaved.unlocks')}
            </div>
          </div>
        </div>
        
        {/* V Subtab */}
        <div className={`subtab-content ${activeSubtab === 'v' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>V</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-v-unlocked">Unlocked</label>
              <select
                id="celestials-v-unlocked"
                value={saveData.celestials?.v?.unlockBits ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.v.unlockBits', e.target.value === 'true' ? 1 : 0)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.v.unlockBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-v-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-v-quoteBits"
                value={saveData.celestials?.v?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.v.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.v.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-v-runUnlocks">WR Unlocks</label>
              <input
                type="text"
                id="celestials-v-runUnlocks"
                value={JSON.stringify(saveData.celestials?.v?.runUnlocks || [])}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.v.runUnlocks', value);
                  } catch (error) {
                    console.error("Invalid JSON for V run unlocks:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.v.runUnlocks')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-v-goalCompletion">Goals</label>
              <input
                type="number"
                id="celestials-v-unlockBits"
                value={saveData.celestials?.v?.unlockBits || 0}
                onChange={(e) => handleValueChange('celestials.v.unlockBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.v.unlockBits')}
            </div>
          </div>
        </div>
        
        {/* Ra Subtab */}
        <div className={`subtab-content ${activeSubtab === 'ra' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Ra</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-ra-unlocked">Unlocked</label>
              <select
                id="celestials-ra-unlocked"
                value={saveData.celestials?.ra?.unlockBits ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.ra.unlockBits', e.target.value === 'true' ? 1 : 0)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.ra.unlockBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-ra-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-ra-quoteBits"
                value={saveData.celestials?.ra?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.ra.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.ra.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-ra-pets">Pets</label>
              <input
                type="text"
                id="celestials-ra-pets"
                value={JSON.stringify(saveData.celestials?.ra?.pets || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.ra.pets', value);
                  } catch (error) {
                    console.error("Invalid JSON for Ra pets:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.ra.pets')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-ra-alchemy">Alchemy Resources</label>
              <input
                type="text"
                id="celestials-ra-alchemy"
                value={JSON.stringify(saveData.celestials?.ra?.alchemy || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.ra.alchemy', value);
                  } catch (error) {
                    console.error("Invalid JSON for Ra alchemy:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.ra.alchemy')}
            </div>
          </div>
        </div>
        
        {/* Laitela Subtab */}
        <div className={`subtab-content ${activeSubtab === 'laitela' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Laitela</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-laitela-unlocked">Unlocked</label>
              <select
                id="celestials-laitela-unlocked"
                value={saveData.celestials?.laitela?.entropy > 0 ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.laitela.entropy', e.target.value === 'true' ? 1 : 0)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.laitela.entropy')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-laitela-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-laitela-quoteBits"
                value={saveData.celestials?.laitela?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.laitela.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.laitela.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-laitela-darkMatter">Dark Matter</label>
              <input
                type="text"
                id="celestials-laitela-darkMatter"
                value={saveData.celestials?.laitela?.darkMatter || ''}
                onChange={(e) => handleValueChange('celestials.laitela.darkMatter', e.target.value)}
              />
              {renderValidationIndicator('celestials.laitela.darkMatter')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-laitela-singularities">Singularities</label>
              <input
                type="number"
                id="celestials-laitela-singularities"
                value={saveData.celestials?.laitela?.singularities || 0}
                onChange={(e) => handleValueChange('celestials.laitela.singularities', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.laitela.singularities')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-laitela-darkEnergy">Dark Energy</label>
              <input
                type="text"
                id="celestials-laitela-darkEnergy"
                value={saveData.celestials?.laitela?.darkEnergy || ''}
                onChange={(e) => handleValueChange('celestials.laitela.darkEnergy', e.target.value)}
              />
              {renderValidationIndicator('celestials.laitela.darkEnergy')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-laitela-upgrades">Upgrades</label>
              <input
                type="text"
                id="celestials-laitela-upgrades"
                value={JSON.stringify(saveData.celestials?.laitela?.upgrades || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.laitela.upgrades', value);
                  } catch (error) {
                    console.error("Invalid JSON for Laitela upgrades:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.laitela.upgrades')}
            </div>
          </div>
        </div>
        
        {/* Pelle Subtab */}
        <div className={`subtab-content ${activeSubtab === 'pelle' ? 'active' : ''}`}>
          <div className="celestials-grid">
            <h4>Pelle</h4>
            
            <div className="form-group">
              <label htmlFor="celestials-pelle-unlocked">Unlocked</label>
              <select
                id="celestials-pelle-unlocked"
                value={saveData.celestials?.pelle?.doomed ? 'true' : 'false'}
                onChange={(e) => handleValueChange('celestials.pelle.doomed', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {renderValidationIndicator('celestials.pelle.doomed')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-pelle-quoteBits">Quote Bits</label>
              <input
                type="number"
                id="celestials-pelle-quoteBits"
                value={saveData.celestials?.pelle?.quoteBits || 0}
                onChange={(e) => handleValueChange('celestials.pelle.quoteBits', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.pelle.quoteBits')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-pelle-remnants">Remnants</label>
              <input
                type="number"
                id="celestials-pelle-remnants"
                value={saveData.celestials?.pelle?.remnants || 0}
                onChange={(e) => handleValueChange('celestials.pelle.remnants', parseInt(e.target.value))}
              />
              {renderValidationIndicator('celestials.pelle.remnants')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-pelle-galaxyGenerator">Galaxy Generator</label>
              <input
                type="text"
                id="celestials-pelle-galaxyGenerator"
                value={JSON.stringify(saveData.celestials?.pelle?.galaxyGenerator || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.pelle.galaxyGenerator', value);
                  } catch (error) {
                    console.error("Invalid JSON for Pelle galaxy generator:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.pelle.galaxyGenerator')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-pelle-rifts">Rifts</label>
              <input
                type="text"
                id="celestials-pelle-rifts"
                value={JSON.stringify(saveData.celestials?.pelle?.rifts || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.pelle.rifts', value);
                  } catch (error) {
                    console.error("Invalid JSON for Pelle rifts:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.pelle.rifts')}
            </div>

            <div className="form-group">
              <label htmlFor="celestials-pelle-upgrades">Upgrades</label>
              <input
                type="text"
                id="celestials-pelle-upgrades"
                value={JSON.stringify(saveData.celestials?.pelle?.upgrades || [])}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('celestials.pelle.upgrades', value);
                  } catch (error) {
                    console.error("Invalid JSON for Pelle upgrades:", error);
                  }
                }}
              />
              {renderValidationIndicator('celestials.pelle.upgrades')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelestialsSection; 