import React, { useState } from 'react';
import { SectionProps } from './types';
import SectionShell, { SectionShellTab } from '../../../../shared/ui/SectionShell';
import { FaSun, FaArrowUp, FaSlidersH } from 'react-icons/fa';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import JsonTextareaField from '../../../../shared/ui/JsonValueField';
import { getValueAtPath } from '../../../../domain/save/document/path';
import { resolveRegisteredFieldPath } from '../../../../domain/save/catalog/fields';
import { bitfieldCatalog, getKnownBitDefinitions } from '../../../../domain/save/catalog/bitfields';
import {
  realityPerkById,
  realityUpgradeBitDefinitions,
  realityUpgradeDefinitions,
} from '../../../../domain/save/catalog/reality';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import BitfieldEditor from '../../../../shared/ui/BitfieldEditor';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import { parseNumericInput } from './fieldHelpers';

interface RealitySaveView {
  realities?: unknown;
  partSimulatedReality?: number;
  reality?: {
    partSimulated?: number;
    upgReqs?: number;
    upgradeRequirementBits?: number;
    rebuyables?: Record<string, unknown> | unknown[];
    perkPoints?: unknown;
    perks?: unknown[];
  };
}

const getBitfieldDefinition = (id: string) => bitfieldCatalog.find((entry) => entry.id === id);

const realityUpgradeBitOptions = realityUpgradeBitDefinitions.map((definition) => ({
  bit: definition.bitIndex,
  label: `R${definition.id} · ${definition.name}`,
  description: definition.description,
}));

const realityRebuyableDefinitions = realityUpgradeDefinitions.filter((definition) => definition.storage === 'rebuyable');
const unlockedEcDefinition = getBitfieldDefinition('unlockedEC');

const realityPerkSummary = (value: unknown): Array<{ id: number; label: string; description: string }> => {
  const values = value instanceof Set ? [...value] : value;
  if (!Array.isArray(values)) return [];

  return values
    .filter((id): id is number => typeof id === 'number' && Number.isInteger(id))
    .map((id) => {
      const definition = realityPerkById.get(id);
      return {
        id,
        label: definition?.label ?? 'Unknown upstream perk',
        description: definition?.description ?? 'This future or platform-specific perk ID is preserved as-is.',
      };
    });
};

const RealitySection: React.FC<SectionProps> = ({
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

  const typedSaveData = saveData as unknown as RealitySaveView;
  const saveRecord = saveData as unknown as SaveObject;
  const realityUpgradeBitsPath = resolveRegisteredFieldPath(saveRecord, 'realityUpgradeBits', saveType);
  const realityUpgradeRequirementsPath = resolveRegisteredFieldPath(saveRecord, 'realityUpgradeRequirements', saveType);
  const realityUpgradeLocksPath = resolveRegisteredFieldPath(saveRecord, 'realityUpgradeLocks', saveType);
  const realityUpgradeBitsDefinition = getBitfieldDefinition('realityUpgradeBits');
  const realityUpgradeRequirementsDefinition = getBitfieldDefinition('realityUpgradeRequirements');
  const realityUpgradeLocksDefinition = getBitfieldDefinition('realityUpgradeLocks');
  const perkSummary = realityPerkSummary(typedSaveData.reality?.perks);

  const tabs: SectionShellTab[] = [
    { id: 'general', title: 'General', icon: <FaSun className="subtab-icon" /> },
    { id: 'upgrades', title: 'Upgrades', icon: <FaArrowUp className="subtab-icon" /> },
    { id: 'settings', title: 'Settings', icon: <FaSlidersH className="subtab-icon" /> },
  ];

  return (
    <SectionShell
      id="reality"
      title="Reality"
      tabs={tabs}
      activeTab={activeSubtab}
      onTabChange={handleSubtabClick}
    >
        
        {/* General Reality Resources Subtab */}
        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Resources</h4>
            <FieldDescription>These values come from the upstream Reality model. Partial Reality is the fractional simulated-Reality counter; it is not an extra whole Reality.</FieldDescription>
            <div className="reality-grid">
              <div className="form-group">
                {isPCFormat() ? (
                  <>
                    <label htmlFor="realities">Realities</label>
                    <input
                      type="number"
                      id="realities"
                      value={typeof saveData.realities === 'number' ? saveData.realities : 0}
                      onChange={(e) => handleValueChange('realities', parseNumericInput(e.target.value))}
                    />
                  </>
                ) : (
                  <BigNumberInput
                    label="Realities"
                    value={typedSaveData.realities || {mantissa: 0, exponent: 0}} 
                    onChange={(value) => handleValueChange('realities', value)}
                    saveType={saveType}
                  />
                )}
                {renderValidationIndicator('realities')}
              </div>

              <div className="form-group">
                <label htmlFor="partSimulatedReality">Partial Reality</label>
                <input
                  type="number"
                  id="partSimulatedReality"
                  value={isPCFormat() ? (typedSaveData.partSimulatedReality || 0) : (typedSaveData.reality?.partSimulated || 0)}
                  step="0.01"
                  onChange={(e) => handleValueChange(isPCFormat() ? 'partSimulatedReality' : 'reality.partSimulated', parseNumericInput(e.target.value))}
                />
                <FieldDescription>Fractional simulated-Reality progress, normally between 0 and 1.</FieldDescription>
                {renderValidationIndicator(isPCFormat() ? 'partSimulatedReality' : 'reality.partSimulated')}
              </div>
              
              <div className="form-group">
                <BigNumberInput
                  label="Reality Machines"
                  value={saveData.reality?.realityMachines || (isPCFormat() ? '0' : {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('reality.realityMachines', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('reality.realityMachines')}
              </div>

              <div className="form-group">
                <label htmlFor="reality-imaginaryMachines">Imaginary Machines</label>
                <input
                  type="number"
                  id="reality-imaginaryMachines"
                  value={saveData.reality?.imaginaryMachines || 0}
                  onChange={(e) => handleValueChange('reality.imaginaryMachines', parseNumericInput(e.target.value))}
                />
                {renderValidationIndicator('reality.imaginaryMachines')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-iMCap">Imaginary Machine Cap</label>
                <input
                  type="number"
                  id="reality-iMCap"
                  value={saveData.reality?.iMCap || 0}
                  onChange={(e) => handleValueChange('reality.iMCap', parseNumericInput(e.target.value))}
                />
                {renderValidationIndicator('reality.iMCap')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Reality Generation</h4>
            <FieldDescription>Seeds and Gaussian values drive the deterministic Reality/Glyph random streams. They are not currencies or upgrade levels.</FieldDescription>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-seed">Seed</label>
                <input
                  type="number"
                  id="reality-seed"
                  value={saveData.reality?.seed || 0}
                  onChange={(e) => handleValueChange('reality.seed', parseInt(e.target.value))}
                />
                <FieldDescription>Primary Reality random seed.</FieldDescription>
                {renderValidationIndicator('reality.seed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-secondGaussian">Second Gaussian</label>
                <input
                  type="number"
                  id="reality-secondGaussian"
                  step="0.01"
                  value={saveData.reality?.secondGaussian || 0}
                  onChange={(e) => handleValueChange('reality.secondGaussian', parseNumericInput(e.target.value))}
                />
                <FieldDescription>Second value of the Reality Gaussian random stream.</FieldDescription>
                {renderValidationIndicator('reality.secondGaussian')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-musicSeed">Music Seed</label>
                <input
                  type="number"
                  id="reality-musicSeed"
                  value={saveData.reality?.musicSeed || 0}
                  onChange={(e) => handleValueChange('reality.musicSeed', parseInt(e.target.value))}
                />
                <FieldDescription>Separate seed for the music/randomness stream.</FieldDescription>
                {renderValidationIndicator('reality.musicSeed')}
              </div>
              
              <div className="form-group">
                <label htmlFor="reality-musicSecondGaussian">Music Second Gaussian</label>
                <input
                  type="number"
                  id="reality-musicSecondGaussian"
                  step="0.01"
                  value={saveData.reality?.musicSecondGaussian || 0}
                  onChange={(e) => handleValueChange('reality.musicSecondGaussian', parseNumericInput(e.target.value))}
                />
                <FieldDescription>Second value of the music Gaussian random stream.</FieldDescription>
                {renderValidationIndicator('reality.musicSecondGaussian')}
              </div>
            </div>
          </div>
          
          <div className="resource-group">
            <h4>Eternity Continuity</h4>
            <FieldDescription>Part Eternitied is the carried fractional Eternity value used when starting a Reality.</FieldDescription>
            <div className="reality-grid">
              <div className="form-group">
                <BigNumberInput
                  label="Partial Eternitied"
                  value={saveData.reality?.partEternitied || (isPCFormat() ? '0' : {mantissa: 0, exponent: 0})}
                  onChange={(value) => handleValueChange('reality.partEternitied', value)}
                  saveType={saveType}
                />
                {renderValidationIndicator('reality.partEternitied')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upgrades Subtab */}
        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Upgrade State</h4>
            <FieldDescription>
              Reality upgrades 1–5 are repeatable purchase counters. Upgrades 6–25 are one-time upgrades stored as bits; the same bit can be represented as bought, requirement-satisfied, or mechanic-locked state.
            </FieldDescription>
            <div className="bits-collections-grid">
              <BitfieldEditor
                path={realityUpgradeBitsPath}
                label="Bought one-time upgrades"
                description={realityUpgradeBitsDefinition?.description ?? 'Persisted bits for purchased one-time Reality upgrades.'}
                value={getValueAtPath(saveRecord, realityUpgradeBitsPath)}
                knownBits={realityUpgradeBitOptions}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
              <BitfieldEditor
                path={realityUpgradeRequirementsPath}
                label="Requirements satisfied"
                description={realityUpgradeRequirementsDefinition?.description ?? 'Persisted bits for Reality upgrade requirements already satisfied.'}
                value={getValueAtPath(saveRecord, realityUpgradeRequirementsPath)}
                knownBits={realityUpgradeBitOptions}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
              <BitfieldEditor
                path={realityUpgradeLocksPath}
                label="Reality mechanic locks"
                description={realityUpgradeLocksDefinition?.description ?? 'Persisted manual mechanic-lock bits for Reality upgrades.'}
                value={getValueAtPath(saveRecord, realityUpgradeLocksPath)}
                knownBits={realityUpgradeBitOptions}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
            </div>
          </div>

          <div className="resource-group">
            <h4>Repeatable Reality upgrades</h4>
            <FieldDescription>
              These five counters are purchase levels, not completion bits. PC stores them under reality.rebuyables.1–5; mobile stores the same values in the zero-based reality.rebuyables array.
            </FieldDescription>
            <div className="reality-grid">
              {realityRebuyableDefinitions.map((definition) => {
                const path = saveType === SaveType.PC
                  ? `reality.rebuyables.${definition.id}`
                  : `reality.rebuyables[${definition.id - 1}]`;
                const value = getValueAtPath(saveRecord, path);
                return (
                  <div className="form-group" key={definition.id}>
                    <label htmlFor={`reality-rebuyable-${definition.id}`}>R{definition.id} · {definition.name}</label>
                    <input
                      type="number"
                      id={`reality-rebuyable-${definition.id}`}
                      min="0"
                      step="1"
                      value={typeof value === 'number' ? value : 0}
                      onChange={(event) => handleValueChange(path, parseNumericInput(event.target.value))}
                    />
                    <FieldDescription>{definition.description}</FieldDescription>
                    {renderValidationIndicator(path)}
                  </div>
                );
              })}
            </div>
          </div>

          {unlockedEcDefinition ? (
            <div className="resource-group">
              <h4>Persistent Eternity Challenge unlocks</h4>
              <BitfieldEditor
                path={unlockedEcDefinition.path}
                label="Eternity Challenge availability"
                description="The game stores persistent EC availability in reality.unlockedEC: EC 1 is bit 1 through EC 12 at bit 12. This is separate from the selected EC study ID, the historical requirement cache, and completion counts."
                value={getValueAtPath(saveRecord, unlockedEcDefinition.path)}
                knownBits={getKnownBitDefinitions(unlockedEcDefinition)}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
            </div>
          ) : null}

          <div className="resource-group">
            <h4>Black Hole relationship</h4>
            <FieldDescription>
              Black Hole state is edited in the separate Black Holes section. Reality upgrade R20, Parity of Singularity, unlocks the second Black Hole; it is not a Reality bitfield of its own.
            </FieldDescription>
          </div>
        </div>
        
        {/* Settings Subtab */}
        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Reality Settings</h4>
            <div className="reality-grid">
              <div className="form-group">
                <label htmlFor="reality-perks">Perk Points</label>
                {isPCFormat() ? (
                  <input
                    type="number"
                    id="reality-perks"
                    value={typeof typedSaveData.reality?.perkPoints === 'number' ? typedSaveData.reality.perkPoints : 0}
                    onChange={(e) => handleValueChange('reality.perkPoints', parseNumericInput(e.target.value))}
                  />
                ) : (
                  <BigNumberInput
                    label="Perk Points"
                    value={typedSaveData.reality?.perkPoints || { mantissa: 0, exponent: 0 }}
                    onChange={(value) => handleValueChange('reality.perkPoints', value)}
                    saveType={saveType}
                  />
                )}
                <FieldDescription>Reality perk currency. Mobile saves may store it as a mantissa/exponent object; PC stores a number.</FieldDescription>
                {renderValidationIndicator('reality.perkPoints')}
              </div>
              
              <div className="form-group">
                <JsonTextareaField
                  id="reality-perkUnlocks"
                  label="Perks"
                  description="Array of numeric Reality perk IDs. The game serializes this Set as an array at the transport boundary."
                  value={typedSaveData.reality?.perks || []}
                  onChange={(value) => handleValueChange('reality.perks', value)}
                  expectation="array"
                  rows={4}
                  fallbackValue={[]}
                />
                {renderValidationIndicator('reality.perks')}
                <div className="reality-perk-summary">
                  <strong>Decoded perk IDs</strong>
                  {perkSummary.length > 0 ? perkSummary.map((perk) => (
                    <span key={perk.id} title={perk.description}>
                      {perk.label} <code>#{perk.id}</code>
                    </span>
                  )) : <FieldDescription>No numeric perk IDs are present.</FieldDescription>}
                </div>
              </div>
            </div>
          </div>
        </div>
    </SectionShell>
  );
};

export default RealitySection; 
