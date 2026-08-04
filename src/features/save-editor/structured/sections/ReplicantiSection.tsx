import React, { useState } from 'react';
import { FaCircle, FaDigitalTachograph, FaGlobe } from 'react-icons/fa';
import { SaveType } from '../../../../domain/save/model';
import { replicantiFieldDescriptions } from '../../../../domain/save/catalog/progression';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import { parseNumericInput } from './fieldHelpers';
import { SectionProps } from './types';

interface ReplicantiView {
  unl?: boolean;
  amount?: unknown;
  timer?: number;
  chance?: number;
  chanceUpgrades?: number;
  chanceCost?: unknown;
  interval?: number;
  intervalUpgrades?: number;
  intervalCost?: unknown;
  galaxies?: number;
  boughtGalaxyCap?: number;
  maxGalaxiesUpgrades?: number;
  galCost?: unknown;
  galaxybuyer?: boolean;
}

const formatPercent = (value: number): string => `${(value * 100).toFixed(2)}%`;

const ReplicantiSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('settings');
  const isPC = saveType === SaveType.PC;
  const replicanti = (saveData as unknown as { replicanti?: ReplicantiView }).replicanti;
  const chanceUpgrades = replicanti?.chanceUpgrades ?? 0;
  const intervalUpgrades = replicanti?.intervalUpgrades ?? 0;
  const androidEffectiveChance = Math.min(1, 0.01 + Math.max(0, chanceUpgrades) * 0.01);
  const androidBaseInterval = Math.max(50, 1000 * (0.9 ** Math.max(0, intervalUpgrades)));

  const tabs = [
    { id: 'settings', label: 'General', icon: <FaCircle className="subtab-icon" aria-hidden="true" /> },
    { id: 'upgrades', label: 'Upgrades', icon: <FaDigitalTachograph className="subtab-icon" aria-hidden="true" /> },
    { id: 'galaxies', label: 'Galaxies', icon: <FaGlobe className="subtab-icon" aria-hidden="true" /> },
  ];

  return (
    <div className="section-pane active" id="replicanti-section">
      <div className="section-content">
        <h3>Replicanti</h3>
        <p className="section-shell-description">
          Replicanti reproduce on a timer. PC/Web stores the live chance and interval; Android stores the number of purchases that produce those values.
        </p>

        <nav className="section-subtabs" aria-label="Replicanti sections">
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

        <div className={`subtab-content ${activeSubtab === 'settings' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Replicanti state</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-unl">Replicanti unlocked</label>
                <select
                  id="replicanti-unl"
                  value={replicanti?.unl ? 'true' : 'false'}
                  onChange={(event) => handleValueChange('replicanti.unl', event.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <FieldDescription>{replicantiFieldDescriptions.unlocked}</FieldDescription>
                {renderValidationIndicator('replicanti.unl')}
              </div>

              <div className="form-group">
                <BigNumberInput
                  label="Replicanti amount"
                  value={replicanti?.amount ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                  onChange={(value) => handleValueChange('replicanti.amount', value)}
                  description={replicantiFieldDescriptions.amount}
                  saveType={saveType}
                />
                {renderValidationIndicator('replicanti.amount')}
              </div>

              <div className="form-group">
                <label htmlFor="replicanti-timer">Replicanti timer (ms)</label>
                <input
                  type="number"
                  min="0"
                  id="replicanti-timer"
                  value={replicanti?.timer ?? 0}
                  onChange={(event) => handleValueChange('replicanti.timer', parseNumericInput(event.target.value))}
                />
                <FieldDescription>{replicantiFieldDescriptions.timer}</FieldDescription>
                {renderValidationIndicator('replicanti.timer')}
              </div>
            </div>
          </div>
        </div>

        <div className={`subtab-content ${activeSubtab === 'upgrades' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Replicanti Chance</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-chance">
                  {isPC ? 'Chance per Replicanti tick' : 'Chance upgrade purchases'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={isPC ? '1' : undefined}
                  step={isPC ? '0.01' : '1'}
                  id="replicanti-chance"
                  value={isPC ? (replicanti?.chance ?? 0.01) : chanceUpgrades}
                  onChange={(event) => handleValueChange(
                    isPC ? 'replicanti.chance' : 'replicanti.chanceUpgrades',
                    parseNumericInput(event.target.value),
                  )}
                />
                <FieldDescription>
                  {isPC ? replicantiFieldDescriptions.chancePc : replicantiFieldDescriptions.chanceAndroid}
                  {!isPC ? ` Current effective chance from this count: ${formatPercent(androidEffectiveChance)}.` : ''}
                </FieldDescription>
                {renderValidationIndicator(isPC ? 'replicanti.chance' : 'replicanti.chanceUpgrades')}
              </div>

              {isPC && (
                <div className="form-group">
                  <BigNumberInput
                    label="Next Chance upgrade cost (IP)"
                    value={replicanti?.chanceCost ?? '1e+150'}
                    onChange={(value) => handleValueChange('replicanti.chanceCost', value)}
                    description={replicantiFieldDescriptions.chanceCost}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('replicanti.chanceCost')}
                </div>
              )}
            </div>
          </div>

          <div className="resource-group">
            <h4>Replicanti Interval</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-interval">
                  {isPC ? 'Base replication interval (ms)' : 'Interval upgrade purchases'}
                </label>
                <input
                  type="number"
                  min="0"
                  id="replicanti-interval"
                  value={isPC ? (replicanti?.interval ?? 1000) : intervalUpgrades}
                  onChange={(event) => handleValueChange(
                    isPC ? 'replicanti.interval' : 'replicanti.intervalUpgrades',
                    parseNumericInput(event.target.value),
                  )}
                />
                <FieldDescription>
                  {isPC ? replicantiFieldDescriptions.intervalPc : replicantiFieldDescriptions.intervalAndroid}
                  {!isPC ? ` Base interval from this count: ${androidBaseInterval.toFixed(2)} ms before other game modifiers.` : ''}
                </FieldDescription>
                {renderValidationIndicator(isPC ? 'replicanti.interval' : 'replicanti.intervalUpgrades')}
              </div>

              {isPC && (
                <div className="form-group">
                  <BigNumberInput
                    label="Next Interval upgrade cost (IP)"
                    value={replicanti?.intervalCost ?? '1e+140'}
                    onChange={(value) => handleValueChange('replicanti.intervalCost', value)}
                    description={replicantiFieldDescriptions.intervalCost}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('replicanti.intervalCost')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`subtab-content ${activeSubtab === 'galaxies' ? 'active' : ''}`}>
          <div className="resource-group">
            <h4>Replicanti Galaxies</h4>
            <div className="replicanti-grid">
              <div className="form-group">
                <label htmlFor="replicanti-galaxies">Replicanti Galaxies earned</label>
                <input
                  type="number"
                  min="0"
                  id="replicanti-galaxies"
                  value={replicanti?.galaxies ?? 0}
                  onChange={(event) => handleValueChange('replicanti.galaxies', parseNumericInput(event.target.value))}
                />
                <FieldDescription>{replicantiFieldDescriptions.galaxies}</FieldDescription>
                {renderValidationIndicator('replicanti.galaxies')}
              </div>

              <div className="form-group">
                <label htmlFor="replicanti-gal-cap">
                  {isPC ? 'Max Galaxy upgrades bought' : 'Max Galaxy upgrade purchases'}
                </label>
                <input
                  type="number"
                  min="0"
                  id="replicanti-gal-cap"
                  value={isPC ? (replicanti?.boughtGalaxyCap ?? 0) : (replicanti?.maxGalaxiesUpgrades ?? 0)}
                  onChange={(event) => handleValueChange(
                    isPC ? 'replicanti.boughtGalaxyCap' : 'replicanti.maxGalaxiesUpgrades',
                    parseNumericInput(event.target.value),
                  )}
                />
                <FieldDescription>{isPC ? replicantiFieldDescriptions.galaxyCapPc : replicantiFieldDescriptions.galaxyCapAndroid}</FieldDescription>
                {renderValidationIndicator(isPC ? 'replicanti.boughtGalaxyCap' : 'replicanti.maxGalaxiesUpgrades')}
              </div>

              {isPC ? (
                <div className="form-group">
                  <BigNumberInput
                    label="Next Galaxy upgrade cost (IP)"
                    value={replicanti?.galCost ?? '1e+170'}
                    onChange={(value) => handleValueChange('replicanti.galCost', value)}
                    description={replicantiFieldDescriptions.galaxyCost}
                    saveType={saveType}
                  />
                  {renderValidationIndicator('replicanti.galCost')}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="replicanti-galaxybuyer">Replicanti Galaxy autobuyer</label>
                  <select
                    id="replicanti-galaxybuyer"
                    value={replicanti?.galaxybuyer ? 'true' : 'false'}
                    onChange={(event) => handleValueChange('replicanti.galaxybuyer', event.target.value === 'true')}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                  <FieldDescription>{replicantiFieldDescriptions.galaxyBuyer}</FieldDescription>
                  {renderValidationIndicator('replicanti.galaxybuyer')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplicantiSection;
