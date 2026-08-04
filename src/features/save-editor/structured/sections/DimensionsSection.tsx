import React, { useState } from 'react';
import { FaClock, FaCube, FaInfinity } from 'react-icons/fa';
import { dimensionFamilyDefinitions, dimensionFieldDescriptions, DimensionId } from '../../../../domain/save/catalog/progression';
import { SaveType } from '../../../../domain/save/model';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import SectionShell, { SectionShellTab } from '../../../../shared/ui/SectionShell';
import { parseNumericInput } from './fieldHelpers';
import { SectionProps } from './types';

interface DimensionEntry {
  amount?: unknown;
  bought?: number;
  costBumps?: number;
  cost?: unknown;
  baseAmount?: number;
  isUnlocked?: boolean;
}

interface DimensionsView {
  dimensions?: Partial<Record<DimensionId, DimensionEntry[]>>;
}

const tabIcons: Record<DimensionId, React.ReactNode> = {
  antimatter: <FaCube className="subtab-icon" aria-hidden="true" />,
  infinity: <FaInfinity className="subtab-icon" aria-hidden="true" />,
  time: <FaClock className="subtab-icon" aria-hidden="true" />,
};

const isBigNumberField = (field: string): boolean => field === 'amount' || field === 'cost';

const DimensionsSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<DimensionId>('antimatter');
  const dimensions = (saveData as unknown as DimensionsView).dimensions;

  const tabs: SectionShellTab[] = dimensionFamilyDefinitions.map((family) => ({
    id: family.id,
    title: family.name.replace(' Dimensions', ''),
    icon: tabIcons[family.id],
  }));

  const activeFamily = dimensionFamilyDefinitions.find((family) => family.id === activeSubtab) ?? dimensionFamilyDefinitions[0];

  return (
    <SectionShell
      id="dimensions"
      title="Dimensions"
      tabs={tabs}
      activeTab={activeSubtab}
      onTabChange={(tab) => setActiveSubtab(tab as DimensionId)}
    >
      <div className="section-shell-header">
        <p className="section-shell-description">
          The upstream player model has exactly three dimension families: Antimatter, Infinity, and Time. Each family has eight tiers; Eternity/Reality are prestige layers, not dimension arrays in this save format.
        </p>
      </div>

      <div className={`subtab-content active`}>
        <div className="dimensions-grid">
          {Array.from({ length: 8 }, (_, index) => {
            const tier = index + 1;
            const entry = dimensions?.[activeFamily.id]?.[index];
            return (
              <article className="dimension-group" key={`${activeFamily.id}-${tier}`}>
                <h4>{activeFamily.name.replace(' Dimensions', '')} Dimension {tier}</h4>
                <p className="field-description">{activeFamily.description}</p>

                {activeFamily.fields.map((field) => {
                  const path = `dimensions.${activeFamily.id}[${index}].${field}`;
                  const value = entry?.[field];
                  const inputId = `${activeFamily.id}-${tier}-${field}`;

                  if (isBigNumberField(field)) {
                    return (
                      <div className="form-group" key={field}>
                        <BigNumberInput
                          label={field === 'amount' ? 'Current amount' : 'Current purchase cost'}
                          value={value ?? (saveType === SaveType.PC ? '0' : { mantissa: 0, exponent: 0 })}
                          onChange={(nextValue) => handleValueChange(path, nextValue)}
                          description={dimensionFieldDescriptions[field]}
                          saveType={saveType}
                        />
                        {renderValidationIndicator(path)}
                      </div>
                    );
                  }

                  if (field === 'isUnlocked') {
                    return (
                      <div className="form-group" key={field}>
                        <label htmlFor={inputId}>Tier unlocked</label>
                        <select
                          id={inputId}
                          value={value ? 'true' : 'false'}
                          onChange={(event) => handleValueChange(path, event.target.value === 'true')}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        <FieldDescription>{dimensionFieldDescriptions[field]}</FieldDescription>
                        {renderValidationIndicator(path)}
                      </div>
                    );
                  }

                  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
                  return (
                    <div className="form-group" key={field}>
                      <label htmlFor={inputId}>{field === 'bought' ? 'Individual purchases' : 'Cost-step bumps'}</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        id={inputId}
                        value={numericValue}
                        onChange={(event) => handleValueChange(path, parseNumericInput(event.target.value))}
                      />
                      <FieldDescription>{dimensionFieldDescriptions[field]}</FieldDescription>
                      {renderValidationIndicator(path)}
                    </div>
                  );
                })}
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

export default DimensionsSection;
