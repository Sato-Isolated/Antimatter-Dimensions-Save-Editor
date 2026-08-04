import React, { useState } from 'react';
import { SectionProps } from './types';
import SectionShell, { SectionShellTab } from '../../../../shared/ui/SectionShell';
import { FaCircle, FaArrowUp, FaTrophy } from 'react-icons/fa';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import { getValueAtPath } from '../../../../domain/save/document/path';
import { collectionCatalog } from '../../../../domain/save/catalog/bitfields';
import { infinityRebuyableUpgradeDefinitions } from '../../../../domain/save/catalog/progression';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import CollectionEditor from '../../../../shared/ui/CollectionEditor';
import FieldDescription from '../../../../shared/ui/FieldDescription';

interface InfinitySaveView {
  infinityPoints?: unknown;
  infinities?: unknown;
  infinitiesBanked?: unknown;
  infinityPower?: unknown;
  IPMultPurchases?: number;
  ipMultUpgrades?: number;
  brake?: boolean;
  break?: boolean;
  infinityUpgrades?: unknown;
  infinityRebuyables?: unknown;
  infinityUpgradeBits?: number;
  infinity?: {
    upgradeBits?: number;
    upgrades?: unknown;
    break?: boolean;
  };
}

const infinityUpgradeCollection = collectionCatalog.find((entry) => entry.id === 'infinityUpgrades');

const InfinitySection: React.FC<SectionProps> = ({ 
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

  // Helper function to safely access PC-specific properties
  const isPCFormat = (): boolean => {
    return saveType === SaveType.PC;
  };

  const typedSaveData = saveData as unknown as InfinitySaveView;
  const saveRecord = saveData as unknown as SaveObject;
  const ic2CountPath = isPCFormat() ? 'ic2Count' : 'challenge.infinity.ic2Count';
  const ic4TierPath = 'challenge.infinity.ic4Tier';
  const ic2Count = getValueAtPath(saveRecord, ic2CountPath);
  const ic4Tier = getValueAtPath(saveRecord, ic4TierPath);
  const infinityRebuyables = Array.isArray(typedSaveData.infinityRebuyables)
    ? typedSaveData.infinityRebuyables
    : [];

  const tabs: SectionShellTab[] = [
    { id: 'general', title: 'General', icon: <FaCircle className="subtab-icon" /> },
    { id: 'upgrades', title: 'Upgrades', icon: <FaArrowUp className="subtab-icon" /> },
    { id: 'challenges', title: 'Challenges', icon: <FaTrophy className="subtab-icon" /> },
  ];

  return (
    <SectionShell
      id="infinity"
      title="Infinity"
      tabs={tabs}
      activeTab={activeSubtab}
      onTabChange={handleSubtabClick}
    >
        
        {/* General Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity Resources</h4>
            <div className="infinity-grid">
              <div className="form-group">
                <BigNumberInput
                  label="Infinity Points"
                  value={isPCFormat() ?
                    (typedSaveData.infinityPoints || '0') :
                    (typedSaveData.infinityPoints || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('infinityPoints', value)}
                  description="Prestige currency earned at Infinity and spent on Infinity and Break Infinity upgrades."
                  saveType={saveType}
                />
                {renderValidationIndicator('infinityPoints')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Infinities"
                  value={isPCFormat() ?
                    (typedSaveData.infinities || '0') :
                    (typedSaveData.infinities || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('infinities', value)}
                  description="Total Infinity resets. This also powers several Infinity upgrades and challenge effects."
                  saveType={saveType}
                />
                {renderValidationIndicator('infinities')}
              </div>
              
              {isPCFormat() && (
                <div className="form-group">
                  <BigNumberInput
                    label="Infinities Banked"
                    value={typedSaveData.infinitiesBanked || '0'}
                    onChange={(value) => handleValueChange('infinitiesBanked', value)}
                    description="Infinities kept for later use instead of being spent in the current prestige flow."
                    saveType={saveType}
                  />
                  {renderValidationIndicator('infinitiesBanked')}
                </div>
              )}
              
              <div className="form-group">
                <BigNumberInput
                  label="Infinity Power"
                  value={isPCFormat() ?
                    (typedSaveData.infinityPower || '0') :
                    (typedSaveData.infinityPower || {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('infinityPower', value)}
                  description="Production resource generated by Infinity Dimensions and used by Eternity Challenges."
                  saveType={saveType}
                />
                {renderValidationIndicator('infinityPower')}
              </div>
              
              <div className="form-group">
                <label htmlFor="IPMultPurchases">{isPCFormat() ? 'IP multiplier purchases' : 'IP multiplier upgrades'}</label>
                <input
                  type="number"
                  id="IPMultPurchases"
                  min="0"
                  step="1"
                  value={isPCFormat() ? (typedSaveData.IPMultPurchases || 0) : (typedSaveData.ipMultUpgrades || 0)}
                  onChange={(e) => handleValueChange(isPCFormat() ? 'IPMultPurchases' : 'ipMultUpgrades', parseInt(e.target.value, 10) || 0)}
                />
                <FieldDescription>Each purchase doubles Infinity Points. The counter is separate from the one-time `ipMult` upgrade entry.</FieldDescription>
                {renderValidationIndicator(isPCFormat() ? 'IPMultPurchases' : 'ipMultUpgrades')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Break Infinity</h4>
            <div className="infinity-grid">
              {isPCFormat() ? (
                <div className="form-group">
                  <label htmlFor="break">Break Infinity</label>
                  <select
                    id="break"
                    value={typedSaveData.break ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('break', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {renderValidationIndicator('break')}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="brake">Break Infinity</label>
                  <select
                    id="brake"
                    value={typedSaveData.brake ? 'true' : 'false'}
                    onChange={(e) => handleValueChange('brake', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {renderValidationIndicator('brake')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Infinity and Break Infinity upgrades</h4>
            <FieldDescription>
              PC/Web stores one-time purchases as named IDs in `infinityUpgrades`. The legacy `infinity.upgradeBits` field is kept only in All values; it is not the current Set.
            </FieldDescription>
            {isPCFormat() && infinityUpgradeCollection ? (
              <CollectionEditor
                definition={infinityUpgradeCollection}
                value={getValueAtPath(saveRecord, infinityUpgradeCollection.path)}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
            ) : (
              <div className="form-group">
                <label htmlFor="inf-upgradeBits">Android Infinity upgrade mask (fixture)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  id="inf-upgradeBits"
                  value={typedSaveData.infinityUpgradeBits || 0}
                  onChange={(e) => handleValueChange('infinityUpgradeBits', parseInt(e.target.value, 10) || 0)}
                />
                <FieldDescription>Fixture-derived Android field. Its bit-to-upgrade mapping is not present in the pinned PC/Web source, so the raw mask is preserved rather than given guessed labels.</FieldDescription>
                {renderValidationIndicator('infinityUpgradeBits')}
              </div>
            )}
          </div>
          
          <div className="resource-group">
            <h4>Break Infinity rebuyables</h4>
            <FieldDescription>
              PC/Web stores these three purchase counts in `infinityRebuyables[0..2]`; they are counters, not Set entries. The maximums and game effects come from the upstream Break Infinity definitions.
            </FieldDescription>
            <div className="infinity-grid">
              {isPCFormat() ? infinityRebuyableUpgradeDefinitions.map((definition) => {
                const path = `infinityRebuyables[${definition.index}]`;
                const value = infinityRebuyables[definition.index];
                return (
                  <div className="form-group" key={definition.index}>
                    <label htmlFor={`infinity-rebuyable-${definition.index}`}>{definition.name}</label>
                    <input
                      type="number"
                      min="0"
                      max={definition.maximum}
                      step="1"
                      id={`infinity-rebuyable-${definition.index}`}
                      value={typeof value === 'number' ? value : 0}
                      onChange={(event) => handleValueChange(path, parseInt(event.target.value, 10) || 0)}
                    />
                    <FieldDescription>{definition.description} Maximum: {definition.maximum} purchases.</FieldDescription>
                    {renderValidationIndicator(path)}
                  </div>
                );
              }) : (
                <FieldDescription>Android does not expose the PC/Web `infinityRebuyables` array in the current fixture schema.</FieldDescription>
              )}
            </div>
          </div>
        </div>
        
        {/* Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'challenges' ? 'active' : ''}`}>
          <div className="resource-group">
            <FieldDescription>
              Completion bits, current challenge, and best times are edited once in Systems → Challenges. This
              panel keeps only runtime counters whose meaning is specific to the Infinity Challenge simulation.
            </FieldDescription>
            <div className="infinity-grid">
              <div className="form-group">
                <label htmlFor="ic2-count">IC2 sacrifice timer (ms)</label>
                <input
                  type="number"
                  id="ic2-count"
                  min="0"
                  step="1"
                  value={typeof ic2Count === 'number' ? ic2Count : 0}
                  onChange={(e) => handleValueChange(ic2CountPath, parseInt(e.target.value, 10) || 0)}
                />
                <FieldDescription>During IC2, the game accumulates elapsed milliseconds here; at 400 ms it triggers Dimensional Sacrifice and wraps the counter.</FieldDescription>
                {renderValidationIndicator(ic2CountPath)}
              </div>
              {!isPCFormat() && (
                <div className="form-group">
                  <label htmlFor="ic4-tier">IC4 stored tier</label>
                  <input
                    type="number"
                    id="ic4-tier"
                    min="0"
                    step="1"
                    value={typeof ic4Tier === 'number' ? ic4Tier : 0}
                    onChange={(e) => handleValueChange(ic4TierPath, parseInt(e.target.value, 10) || 0)}
                  />
                  <FieldDescription>Android fixture field for the current IC4 dimension tier. It is not the completion bitfield.</FieldDescription>
                  {renderValidationIndicator(ic4TierPath)}
                </div>
              )}
            </div>
          </div>
        </div>
        
    </SectionShell>
  );
};

export default InfinitySection;
