import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaCircle, FaPalette, FaHistory, FaDiceD20 } from 'react-icons/fa';

const GlyphsSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('settings');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  return (
    <div className="section-pane active" id="glyphs">
      <div className="section-content">
        <h3>Glyphs</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'settings' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('settings')}
          >
            <FaCircle className="subtab-icon" /> Settings
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'cosmetics' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('cosmetics')}
          >
            <FaPalette className="subtab-icon" /> Cosmetics
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'inventory' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('inventory')}
          >
            <FaDiceD20 className="subtab-icon" /> Inventory
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'sacrifice' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('sacrifice')}
          >
            <FaHistory className="subtab-icon" /> Sacrifice
          </button>
        </div>
        
        {/* Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Glyph Settings</h4>
            <div className="glyphs-settings-grid">
              <div className="form-group">
                <label htmlFor="protected-rows">Protected Glyph Rows</label>
                <input
                  type="number"
                  id="protected-rows"
                  value={saveData.reality?.glyphs?.protectedRows || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.protectedRows', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
                {renderValidationIndicator('reality.glyphs.protectedRows')}
              </div>
              
              <div className="form-group">
                <label htmlFor="created-reality-glyph">Created Reality Glyph</label>
                <select
                  id="created-reality-glyph"
                  value={saveData.reality?.glyphs?.createdRealityGlyph ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.glyphs.createdRealityGlyph', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {renderValidationIndicator('reality.glyphs.createdRealityGlyph')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Generation Factors</h4>
            <div className="glyphs-settings-grid">  
              <div className="form-group">
                <label htmlFor="glyph-seed">Glyph Seed</label>
                <input
                  type="number"
                  id="glyph-seed"
                  value={saveData.reality?.seed || 0}
                  onChange={(e) => handleValueChange('reality.seed', parseInt(e.target.value))}
                />
                {renderValidationIndicator('reality.seed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="second-gaussian">Second Gaussian</label>
                <input
                  type="number"
                  id="second-gaussian"
                  value={saveData.reality?.secondGaussian || 0}
                  onChange={(e) => handleValueChange('reality.secondGaussian', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.secondGaussian')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cosmetics Subtab */}
        <div className={`subtab-content ${activeSubtab === 'cosmetics' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Glyph Cosmetics</h4>
            <div className="glyph-cosmetics-grid">
              <div className="form-group">
                <label htmlFor="cosmetic-active">Enable Cosmetics</label>
                <select
                  id="cosmetic-active"
                  value={saveData.reality?.glyphs?.cosmetics?.active ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.glyphs.cosmetics.active', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.glyphs.cosmetics.active')}
              </div>
              
              <div className="form-group">
                <label htmlFor="glow-notification">Glow on Notification</label>
                <select
                  id="glow-notification"
                  value={saveData.reality?.glyphs?.cosmetics?.glowNotification ? 'true' : 'false'}
                  onChange={(e) => handleValueChange('reality.glyphs.cosmetics.glowNotification', e.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
                {renderValidationIndicator('reality.glyphs.cosmetics.glowNotification')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Custom Cosmetics</h4>
            <div className="form-group">
              <label htmlFor="unlocked-from-ng">Unlocked From New Game</label>
              <textarea
                id="unlocked-from-ng"
                rows={3}
                value={JSON.stringify(saveData.reality?.glyphs?.cosmetics?.unlockedFromNG || [])}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.cosmetics.unlockedFromNG', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.cosmetics.unlockedFromNG')}
            </div>
            
            <div className="form-group">
              <label htmlFor="symbol-map">Symbol Map</label>
              <textarea
                id="symbol-map"
                rows={3}
                value={JSON.stringify(saveData.reality?.glyphs?.cosmetics?.symbolMap || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.cosmetics.symbolMap', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.cosmetics.symbolMap')}
            </div>
            
            <div className="form-group">
              <label htmlFor="color-map">Color Map</label>
              <textarea
                id="color-map"
                rows={3}
                value={JSON.stringify(saveData.reality?.glyphs?.cosmetics?.colorMap || {})}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.cosmetics.colorMap', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.cosmetics.colorMap')}
            </div>
          </div>
        </div>
        
        {/* Inventory Subtab */}
        <div className={`subtab-content ${activeSubtab === 'inventory' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Glyph Inventory</h4>
            <div className="form-group">
              <label htmlFor="active-glyphs">Active Glyphs</label>
              <textarea
                id="active-glyphs"
                rows={5}
                value={JSON.stringify(saveData.reality?.glyphs?.active || [], null, 2)}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.active', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.active')}
            </div>
            
            <div className="form-group">
              <label htmlFor="inventory-glyphs">Inventory Glyphs</label>
              <textarea
                id="inventory-glyphs"
                rows={5}
                value={JSON.stringify(saveData.reality?.glyphs?.inventory || [], null, 2)}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.inventory', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.inventory')}
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Glyph Sets</h4>
            <div className="form-group">
              <label htmlFor="glyph-sets">Saved Sets</label>
              <textarea
                id="glyph-sets"
                rows={5}
                value={JSON.stringify(saveData.reality?.glyphs?.sets || [], null, 2)}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.sets', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.sets')}
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Undo History</h4>
            <div className="form-group">
              <label htmlFor="undo-glyphs">Undo Stack</label>
              <textarea
                id="undo-glyphs"
                rows={3}
                value={JSON.stringify(saveData.reality?.glyphs?.undo || [], null, 2)}
                onChange={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    handleValueChange('reality.glyphs.undo', value);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
              />
              {renderValidationIndicator('reality.glyphs.undo')}
            </div>
          </div>
        </div>
        
        {/* Sacrifice Subtab */}
        <div className={`subtab-content ${activeSubtab === 'sacrifice' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Glyph Sacrifice Values</h4>
            <div className="glyph-sacrifice-grid">
              <div className="form-group">
                <label htmlFor="power-sacrifice">Power Sacrifice</label>
                <input
                  type="number"
                  id="power-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.power || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.power', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.power')}
              </div>
              
              <div className="form-group">
                <label htmlFor="infinity-sacrifice">Infinity Sacrifice</label>
                <input
                  type="number"
                  id="infinity-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.infinity || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.infinity', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.infinity')}
              </div>
              
              <div className="form-group">
                <label htmlFor="time-sacrifice">Time Sacrifice</label>
                <input
                  type="number"
                  id="time-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.time || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.time', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.time')}
              </div>
              
              <div className="form-group">
                <label htmlFor="replication-sacrifice">Replication Sacrifice</label>
                <input
                  type="number"
                  id="replication-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.replication || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.replication', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.replication')}
              </div>
              
              <div className="form-group">
                <label htmlFor="dilation-sacrifice">Dilation Sacrifice</label>
                <input
                  type="number"
                  id="dilation-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.dilation || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.dilation', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.dilation')}
              </div>
              
              <div className="form-group">
                <label htmlFor="effarig-sacrifice">Effarig Sacrifice</label>
                <input
                  type="number"
                  id="effarig-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.effarig || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.effarig', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.effarig')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-sacrifice">Reality Sacrifice</label>
                <input
                  type="number"
                  id="reality-sacrifice"
                  value={saveData.reality?.glyphs?.sac?.reality || 0}
                  onChange={(e) => handleValueChange('reality.glyphs.sac.reality', parseFloat(e.target.value))}
                  step="0.01"
                />
                {renderValidationIndicator('reality.glyphs.sac.reality')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlyphsSection; 