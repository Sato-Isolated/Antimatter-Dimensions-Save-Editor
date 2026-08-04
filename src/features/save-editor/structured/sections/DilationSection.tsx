import React, { useState } from 'react';
import { FaArrowUp, FaExpand, FaTachometerAlt } from 'react-icons/fa';
import { getValueAtPath } from '../../../../domain/save/document/path';
import { BitDefinition, collectionCatalog } from '../../../../domain/save/catalog/bitfields';
import {
  dilationRebuyableUpgradeDefinitions,
  dilationUpgradeDefinitions,
} from '../../../../domain/save/catalog/progression';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import BitfieldEditor from '../../../../shared/ui/BitfieldEditor';
import CollectionEditor from '../../../../shared/ui/CollectionEditor';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import { parseNumericInput } from './fieldHelpers';
import { SectionProps } from './types';

interface DilationView {
  active?: boolean;
  baseTachyonGalaxies?: number;
  nextThreshold?: unknown;
  totalTachyonGalaxies?: number;
  lastEP?: unknown;
  tachyonParticles?: unknown;
  dilatedTime?: unknown;
  upgrades?: unknown;
  upgradeBits?: number;
  rebuyables?: Record<string, number> | number[];
}

const dilationCollectionDefinition = collectionCatalog.find((entry) => entry.id === 'dilationUpgrades');

// Android stores the one-time upgrade IDs as a bitfield. The bit positions use
// the same upstream IDs, just as the Android Reality upgrade bitfield does.
const dilationAndroidBits: BitDefinition[] = dilationUpgradeDefinitions
  .filter((definition) => definition.storage === 'collection')
  .map((definition) => ({
    bit: definition.id,
    label: `${definition.id}. ${definition.name}`,
    description: definition.description,
  }));

const DilationSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('general');
  const isPC = saveType === SaveType.PC;
  const saveRecord = saveData as unknown as SaveObject;
  const dilation = (saveData as unknown as { dilation?: DilationView }).dilation;

  const getRebuyableValue = (id: number, androidIndex: number): number => {
    const rebuyables = dilation?.rebuyables;
    if (Array.isArray(rebuyables)) return rebuyables[androidIndex] ?? 0;
    if (rebuyables && typeof rebuyables === 'object') return rebuyables[String(id)] ?? 0;
    return 0;
  };

  const setRebuyableValue = (id: number, androidIndex: number, value: number): void => {
    if (isPC) {
      handleValueChange(`dilation.rebuyables.${id}`, value);
      return;
    }

    handleValueChange(`dilation.rebuyables[${androidIndex}]`, value);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaExpand className="subtab-icon" aria-hidden="true" /> },
    { id: 'tachyons', label: 'Tachyons', icon: <FaTachometerAlt className="subtab-icon" aria-hidden="true" /> },
    { id: 'upgrades', label: 'Upgrades', icon: <FaArrowUp className="subtab-icon" aria-hidden="true" /> },
  ];

  return (
    <div className="section-pane active" id="dilation">
      <div className="section-content">
        <h3>Dilation</h3>
        <p className="section-shell-description">
          Time Dilation stores Tachyon Particles, Dilated Time, Tachyon Galaxies, and the upgrade purchases that modify them.
        </p>

        <nav className="section-subtabs" aria-label="Dilation sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`subtab-button ${activeSubtab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSubtab(tab.id)}
              aria-pressed={activeSubtab === tab.id}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation status</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <label htmlFor="dilation-active">Dilation active</label>
                <select
                  id="dilation-active"
                  value={dilation?.active ? 'true' : 'false'}
                  onChange={(event) => handleValueChange('dilation.active', event.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <FieldDescription>Whether the current Eternity is running in Time Dilation. This is a state flag, not the Dilation unlock.</FieldDescription>
                {renderValidationIndicator('dilation.active')}
              </div>

              <div className="form-group">
                <label htmlFor="dilation-baseTachyonGalaxies">Base Tachyon Galaxies</label>
                <input
                  type="number"
                  min="0"
                  id="dilation-baseTachyonGalaxies"
                  value={dilation?.baseTachyonGalaxies ?? 0}
                  onChange={(event) => handleValueChange('dilation.baseTachyonGalaxies', parseNumericInput(event.target.value))}
                />
                <FieldDescription>Galaxies calculated from Dilated Time before the Double Tachyon Galaxies and other galaxy multipliers.</FieldDescription>
                {renderValidationIndicator('dilation.baseTachyonGalaxies')}
              </div>

              <div className="form-group">
                <BigNumberInput
                  label="Next Tachyon Galaxy threshold"
                  value={dilation?.nextThreshold ?? (isPC ? '1000' : { mantissa: 1, exponent: 3 })}
                  onChange={(value) => handleValueChange('dilation.nextThreshold', value)}
                  description="Dilated Time required for the next base Tachyon Galaxy; the game starts at 1e3 and raises this threshold as galaxies are gained."
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.nextThreshold')}
              </div>

              <div className="form-group">
                <label htmlFor="dilation-totalTachyonGalaxies">Total Tachyon Galaxies</label>
                <input
                  type="number"
                  min="0"
                  id="dilation-totalTachyonGalaxies"
                  value={dilation?.totalTachyonGalaxies ?? 0}
                  onChange={(event) => handleValueChange('dilation.totalTachyonGalaxies', parseNumericInput(event.target.value))}
                />
                <FieldDescription>Current Tachyon Galaxies after upgrade effects. This is the value used by the game, not only the base count.</FieldDescription>
                {renderValidationIndicator('dilation.totalTachyonGalaxies')}
              </div>

              <div className="form-group">
                <BigNumberInput
                  label="EP recorded when Dilation unlocked"
                  value={dilation?.lastEP ?? (isPC ? '-1' : { mantissa: -1, exponent: 0 })}
                  onChange={(value) => handleValueChange('dilation.lastEP', value)}
                  description="Eternity Points captured when Dilation awarded Tachyon Particles; -1 is the upstream initial sentinel."
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.lastEP')}
              </div>
            </div>
          </div>
        </div>

        <div className={`subtab-content ${activeSubtab === 'tachyons' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation resources</h4>
            <div className="dilation-grid">
              <div className="form-group">
                <BigNumberInput
                  label="Tachyon Particles (TP)"
                  value={dilation?.tachyonParticles ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                  onChange={(value) => handleValueChange('dilation.tachyonParticles', value)}
                  description="Prestige resource awarded from Antimatter when Dilation is unlocked or completed. Dilation upgrades multiply its gain."
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.tachyonParticles')}
              </div>

              <div className="form-group">
                <BigNumberInput
                  label="Dilated Time (DT)"
                  value={dilation?.dilatedTime ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                  onChange={(value) => handleValueChange('dilation.dilatedTime', value)}
                  description="Dilation currency. It buys Dilation upgrades and drives Tachyon Galaxy thresholds; upgrade 2 resets it when bought."
                  saveType={saveType}
                />
                {renderValidationIndicator('dilation.dilatedTime')}
              </div>
            </div>
          </div>
        </div>

        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Dilation upgrades</h4>
            <p className="field-description">
              IDs 1–3 and 11–13 are rebuyable counters. IDs 4–10 and 14–15 are one-time upgrades; unknown IDs/bits remain untouched.
            </p>
            <div className="dilation-grid">
              {dilationRebuyableUpgradeDefinitions.map((definition) => (
                <div className="form-group" key={definition.id}>
                  <label htmlFor={`dilation-rebuyable-${definition.id}`}>
                    {definition.id}. {definition.name} — purchases
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    id={`dilation-rebuyable-${definition.id}`}
                    value={getRebuyableValue(definition.id, definition.androidRebuyableIndex ?? definition.id - 1)}
                    onChange={(event) => setRebuyableValue(
                      definition.id,
                      definition.androidRebuyableIndex ?? definition.id - 1,
                      parseNumericInput(event.target.value),
                    )}
                  />
                  <FieldDescription>{definition.description}</FieldDescription>
                  {renderValidationIndicator(isPC
                    ? `dilation.rebuyables.${definition.id}`
                    : `dilation.rebuyables[${definition.androidRebuyableIndex ?? definition.id - 1}]`)}
                </div>
              ))}
            </div>
          </div>

          {isPC && dilationCollectionDefinition ? (
            <CollectionEditor
              definition={dilationCollectionDefinition}
              value={getValueAtPath(saveRecord, dilationCollectionDefinition.path)}
              onChange={handleValueChange}
              renderValidationIndicator={renderValidationIndicator}
            />
          ) : null}

          {!isPC ? (
            <BitfieldEditor
              path="dilation.upgradeBits"
              label="One-time Dilation upgrades (Android bitfield)"
              description="Android stores the one-time Dilation upgrade IDs as bits; the checkbox labels use the upstream upgrade IDs and effects."
              value={dilation?.upgradeBits ?? 0}
              knownBits={dilationAndroidBits}
              onChange={handleValueChange}
              renderValidationIndicator={renderValidationIndicator}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DilationSection;
