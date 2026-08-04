import React, { useMemo, useState } from 'react';
import { FaGem, FaHourglassHalf, FaTrophy } from 'react-icons/fa';
import { getValueAtPath } from '../../../../domain/save/document/path';
import { BitDefinition, collectionCatalog } from '../../../../domain/save/catalog/bitfields';
import {
  eternityChallengeDefinitions,
  eternityMilestoneDefinitions,
  eternityUpgradeDefinitions,
} from '../../../../domain/save/catalog/progression';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import BitfieldEditor from '../../../../shared/ui/BitfieldEditor';
import CollectionEditor from '../../../../shared/ui/CollectionEditor';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import SectionShell, { SectionShellTab } from '../../../../shared/ui/SectionShell';
import { parseNumericInput } from './fieldHelpers';
import { SectionProps } from './types';

interface EternityChallengeState {
  current?: number;
  completions?: unknown[];
  unlocked?: number;
  requirementBits?: number;
}

interface EternityView {
  eternityPoints?: unknown;
  eternities?: unknown;
  timeShards?: unknown;
  tickspeed?: unknown;
  totalTickGained?: number;
  eternityUpgrades?: unknown;
  eternityUpgradeBits?: number;
  epmultUpgrades?: number;
  timestudy?: { studies?: unknown[]; theorem?: unknown };
  challenge?: { eternity?: EternityChallengeState };
  eternityChalls?: Record<string, unknown>;
}

const eternityUpgradeCollection = collectionCatalog.find((entry) => entry.id === 'eternityUpgrades');

const eternityUpgradeBits: BitDefinition[] = eternityUpgradeDefinitions.map((definition) => ({
  bit: definition.id,
  label: `${definition.id}. ${definition.name}`,
  description: definition.description,
}));

const log10Like = (value: unknown): number => {
  if (typeof value === 'number') {
    if (value <= 0 || Number.isNaN(value)) return Number.NEGATIVE_INFINITY;
    return value === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.log10(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const numeric = Number(trimmed);
    if (numeric > 0) return numeric === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.log10(numeric);
    const match = trimmed.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:e([+-]?\d+))?$/i);
    if (!match) return Number.NEGATIVE_INFINITY;
    const mantissa = Number(match[1]);
    const exponent = Number(match[2] ?? 0);
    return mantissa > 0 ? Math.log10(mantissa) + exponent : Number.NEGATIVE_INFINITY;
  }

  if (typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value) {
    const mantissa = (value as { mantissa: unknown }).mantissa;
    const exponent = (value as { exponent: unknown }).exponent;
    if (typeof mantissa === 'number' && typeof exponent === 'number' && mantissa > 0 && Number.isFinite(exponent)) {
      return Math.log10(mantissa) + exponent;
    }
  }

  return Number.NEGATIVE_INFINITY;
};

const reachesMilestone = (eternities: unknown, threshold: number): boolean => log10Like(eternities) >= Math.log10(threshold);

const EternityChallengeCompletions: React.FC<{
  saveType: SaveType;
  state: EternityChallengeState | undefined;
  rootCompletions: Record<string, unknown> | undefined;
  handleValueChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}> = ({ saveType, state, rootCompletions, handleValueChange, renderValidationIndicator }) => {
  const isPC = saveType === SaveType.PC;
  const getValue = (id: number): number => {
    const value = isPC ? rootCompletions?.[`eterc${id}`] : state?.completions?.[id - 1];
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  };

  const getPath = (id: number): string => isPC
    ? `eternityChalls.eterc${id}`
    : `challenge.eternity.completions[${id - 1}]`;

  return (
    <div className="eternity-grid">
      {eternityChallengeDefinitions.map((definition) => {
        const path = getPath(definition.id);
        return (
          <div className="form-group" key={definition.id}>
            <label htmlFor={`ec-completion-${definition.id}`}>{definition.name} — completions</label>
            <input
              type="number"
              min="0"
              step="1"
              id={`ec-completion-${definition.id}`}
              value={getValue(definition.id)}
              onChange={(event) => handleValueChange(path, parseNumericInput(event.target.value))}
            />
            <FieldDescription>
              Goal {definition.goal} Antimatter. {definition.description} Reward: {definition.reward}
              {definition.restriction ? ` Restriction: ${definition.restriction}` : ''}
            </FieldDescription>
            {renderValidationIndicator(path)}
          </div>
        );
      })}
    </div>
  );
};

const EternitySection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('general');
  const data = saveData as unknown as EternityView;
  const saveRecord = saveData as unknown as SaveObject;
  const challengeState = data.challenge?.eternity;
  const isPC = saveType === SaveType.PC;

  const tabs: SectionShellTab[] = [
    { id: 'general', title: 'General', icon: <FaHourglassHalf className="subtab-icon" /> },
    { id: 'studies', title: 'Time Studies', icon: <FaGem className="subtab-icon" /> },
    { id: 'challenges', title: 'Challenges', icon: <FaTrophy className="subtab-icon" /> },
  ];

  const milestoneStatus = useMemo(() => eternityMilestoneDefinitions.map((milestone) => ({
    ...milestone,
    reached: reachesMilestone(data.eternities, milestone.eternities),
  })), [data.eternities]);

  return (
    <SectionShell
      id="eternity"
      title="Eternity"
      tabs={tabs}
      activeTab={activeSubtab}
      onTabChange={setActiveSubtab}
    >
      <div className={`subtab-content ${activeSubtab === 'general' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Eternity resources</h4>
          <div className="eternity-grid">
            <div className="form-group">
              <BigNumberInput
                label="Eternity Points (EP)"
                value={data.eternityPoints ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                onChange={(value) => handleValueChange('eternityPoints', value)}
                description="Prestige currency gained when Eternity ends. Unspent EP powers Eternity upgrade 1 and buys Eternity upgrades."
                saveType={saveType}
              />
              {renderValidationIndicator('eternityPoints')}
            </div>

            <div className="form-group">
              <BigNumberInput
                label="Eternities"
                value={data.eternities ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                onChange={(value) => handleValueChange('eternities', value)}
                description="Total Eternity count. Eternity Milestones are derived from this value and are not saved as a bitfield."
                saveType={saveType}
              />
              {renderValidationIndicator('eternities')}
            </div>

            <div className="form-group">
              <BigNumberInput
                label="Time Shards"
                value={data.timeShards ?? (isPC ? '0' : { mantissa: 0, exponent: 0 })}
                onChange={(value) => handleValueChange('timeShards', value)}
                description="Eternity resource produced by Time Dimensions. It powers Time Dimension production and EC9 rewards."
                saveType={saveType}
              />
              {renderValidationIndicator('timeShards')}
            </div>

            <div className="form-group">
              <BigNumberInput
                label="Tickspeed"
                value={data.tickspeed ?? (isPC ? '1e+3000' : { mantissa: 1, exponent: 3000 })}
                onChange={(value) => handleValueChange('tickspeed', value)}
                description="Current global Tickspeed value. Lower values are faster; this is not a duration in milliseconds."
                saveType={saveType}
              />
              {renderValidationIndicator('tickspeed')}
            </div>

            <div className="form-group">
              <label htmlFor="totalTickGained">Total Ticks gained</label>
              <input
                type="number"
                min="0"
                id="totalTickGained"
                value={data.totalTickGained ?? 0}
                onChange={(event) => handleValueChange('totalTickGained', parseNumericInput(event.target.value))}
              />
              <FieldDescription>Total Ticks accumulated for Time Dimension progression and related formulas.</FieldDescription>
              {renderValidationIndicator('totalTickGained')}
            </div>
          </div>
        </div>

        <div className="resource-group">
          <h4>Eternity upgrades</h4>
          {isPC && eternityUpgradeCollection ? (
            <CollectionEditor
              definition={eternityUpgradeCollection}
              value={getValueAtPath(saveRecord, eternityUpgradeCollection.path)}
              onChange={handleValueChange}
              renderValidationIndicator={renderValidationIndicator}
            />
          ) : (
            <BitfieldEditor
              path="eternityUpgradeBits"
              label="Bought Eternity upgrades (Android bitfield)"
              description="Android stores the six one-time Eternity upgrade IDs as bits; the upgrade effects are named below."
              value={data.eternityUpgradeBits ?? 0}
              knownBits={eternityUpgradeBits}
              onChange={handleValueChange}
              renderValidationIndicator={renderValidationIndicator}
            />
          )}
        </div>

        <div className="resource-group">
          <h4>Eternity Point multiplier</h4>
          <div className="eternity-grid">
            <div className="form-group">
              <label htmlFor="epmult-upgrades">EP multiplier purchases</label>
              <input
                type="number"
                min="0"
                step="1"
                id="epmult-upgrades"
                value={data.epmultUpgrades ?? 0}
                onChange={(event) => handleValueChange('epmultUpgrades', parseNumericInput(event.target.value))}
              />
              <FieldDescription>Each purchase multiplies Eternity Point gain by 5; this counter is not an Eternity Milestone bitfield.</FieldDescription>
              {renderValidationIndicator('epmultUpgrades')}
            </div>
          </div>
        </div>

        <div className="resource-group">
          <h4>Eternity Milestones — derived from Eternities</h4>
          <p className="field-description">Milestones are reached automatically at the thresholds below. The game does not store a separate editable milestone mask.</p>
          <div className="milestone-list">
            {milestoneStatus.map((milestone) => (
              <article className={`milestone-item ${milestone.reached ? 'is-reached' : ''}`} key={milestone.eternities}>
                <strong>{milestone.reached ? '✓' : '○'} {milestone.eternities} Eternit{milestone.eternities === 1 ? 'y' : 'ies'} — {milestone.name}</strong>
                <span>{milestone.reward}</span>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={`subtab-content ${activeSubtab === 'studies' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Time Studies</h4>
          <div className="eternity-grid">
            <div className="form-group">
              <label htmlFor="timestudies-studies">Purchased Time Studies (comma separated)</label>
              <input
                type="text"
                id="timestudies-studies"
                value={Array.isArray(data.timestudy?.studies) ? data.timestudy.studies.join(',') : ''}
                onChange={(event) => {
                  const studies = event.target.value.split(',')
                    .map((entry) => Number.parseInt(entry.trim(), 10))
                    .filter((entry) => Number.isInteger(entry));
                  handleValueChange('timestudy.studies', studies);
                }}
              />
              <FieldDescription>Numeric Time Study IDs purchased in the current save. The selected studies define the Eternity build and challenge path.</FieldDescription>
              {renderValidationIndicator('timestudy.studies')}
            </div>

            <div className="form-group">
              <label htmlFor="timestudies-theorem">Time Theorems (TT)</label>
              <input
                type="number"
                min="0"
                id="timestudies-theorem"
                value={typeof data.timestudy?.theorem === 'number' || typeof data.timestudy?.theorem === 'string'
                  ? data.timestudy.theorem
                  : 0}
                onChange={(event) => handleValueChange('timestudy.theorem', parseNumericInput(event.target.value))}
              />
              <FieldDescription>Unspent Time Theorems available for Time Studies. Eternity upgrade 5 also uses this value as a multiplier.</FieldDescription>
              {renderValidationIndicator('timestudy.theorem')}
            </div>
          </div>
        </div>
      </div>

      <div className={`subtab-content ${activeSubtab === 'challenges' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Eternity Challenge selection</h4>
          <FieldDescription>
            The current EC and selected EC study ID are edited once in Systems → Challenges. Persistent unlock
            bits and the historical requirement cache are kept beside them there; completion counts remain here
            because they are part of the Eternity progression record.
          </FieldDescription>
        </div>

        <div className="resource-group">
          <h4>Eternity Challenge completions</h4>
          <p className="field-description">
            A completion increases the reward of that EC. PC/Web uses named `eterc1`…`eterc12` properties; Android uses a 12-slot array.
          </p>
          <EternityChallengeCompletions
            saveType={saveType}
            state={challengeState}
            rootCompletions={data.eternityChalls}
            handleValueChange={handleValueChange}
            renderValidationIndicator={renderValidationIndicator}
          />
        </div>
      </div>
    </SectionShell>
  );
};

export default EternitySection;
