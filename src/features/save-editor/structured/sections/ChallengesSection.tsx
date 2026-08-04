import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaTrophy, FaInfinity, FaHourglassHalf } from 'react-icons/fa';
import { SaveType } from '../../../../domain/save/model';
import { AntimatterDimensionsStruct } from '../../../../Struct';
import { resolveRegisteredFieldPath } from '../../../../domain/save/catalog/fields';
import {
  getChallengeDefinition,
  infinityChallengeBits,
  normalChallengeBits,
} from '../../../../domain/save/catalog/challenges';
import { eternityChallengeDefinitions } from '../../../../domain/save/catalog/progression';
import { SaveObject } from '../../../../domain/save/model';
import BigNumberInput from '../../../../shared/ui/BigNumberField';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import ChallengeBitfieldEditor from './ChallengeBitfieldEditor';

const formatBestTime = (value: unknown): number | '' => (
  typeof value === 'number' && Number.isFinite(value) && value < Number.MAX_VALUE ? value : ''
);

const parseBestTime = (value: string): number => {
  if (!value.trim()) return Number.MAX_VALUE;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : Number.NaN;
};

const ChallengesSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('normal');

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
  const saveRecord = saveData as unknown as SaveObject;
  const normalCompletedBitsPath = resolveRegisteredFieldPath(
    saveRecord,
    'normalChallengeCompletedBits',
    saveType,
  );
  const infinityCompletedBitsPath = resolveRegisteredFieldPath(
    saveRecord,
    'infinityChallengeCompletedBits',
    saveType,
  );
  const normalCurrentId = typeof saveData.challenge?.normal?.current === 'number' ? saveData.challenge.normal.current : 0;
  const infinityCurrentId = typeof saveData.challenge?.infinity?.current === 'number' ? saveData.challenge.infinity.current : 0;
  const eternityCurrentId = typeof saveData.challenge?.eternity?.current === 'number' ? saveData.challenge.eternity.current : 0;
  const normalCurrent = getChallengeDefinition(normalChallengeBits, normalCurrentId);
  const infinityCurrent = getChallengeDefinition(infinityChallengeBits, infinityCurrentId);
  const eternityCurrent = eternityChallengeDefinitions.find((definition) => definition.id === eternityCurrentId);

  return (
    <div className="section-pane active" id="challenges">
      <div className="section-content">
        <h3>Challenges</h3>
        
        {/* Subtabs */}
        <nav className="section-subtabs" aria-label="Challenge sections">
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'normal' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('normal')}
            aria-pressed={activeSubtab === 'normal'}
          >
            <FaTrophy className="subtab-icon" aria-hidden="true" /> Normal Challenges
          </button>
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'infinity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('infinity')}
            aria-pressed={activeSubtab === 'infinity'}
          >
            <FaInfinity className="subtab-icon" aria-hidden="true" /> Infinity Challenges
          </button>
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'eternity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('eternity')}
            aria-pressed={activeSubtab === 'eternity'}
          >
            <FaHourglassHalf className="subtab-icon" aria-hidden="true" /> Eternity Challenges
          </button>
          <button 
            type="button"
            className={`subtab-button ${activeSubtab === 'challenge-values' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('challenge-values')}
            aria-pressed={activeSubtab === 'challenge-values'}
          >
            <FaTrophy className="subtab-icon" aria-hidden="true" /> Challenge Values
          </button>
        </nav>
        
        {/* Normal Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'normal' ? 'active' : ''}`}>
          <h4>Normal Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="normal-current">Current Challenge</label>
            <select
              id="normal-current"
              value={normalCurrentId}
              onChange={(e) => handleValueChange('challenge.normal.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {normalChallengeBits.map((definition) => (
                <option key={definition.id} value={definition.id}>{definition.label} (C{definition.id})</option>
              ))}
            </select>
            <FieldDescription>
              {normalCurrent
                ? `${normalCurrent.label}: ${normalCurrent.description}${normalCurrent.reward ? ` Reward: ${normalCurrent.reward}.` : ''}`
                : '0 means that no Normal Challenge is currently running.'}
            </FieldDescription>
            {renderValidationIndicator('challenge.normal.current')}
          </div>
          
          <ChallengeBitfieldEditor
            id="normal-completedBits"
            title="Completed Challenges (bits)"
            description="Each completed Normal Challenge sets the bit matching its challenge ID in challenge.normal.completedBits; bit 0 is intentionally unused."
            path={normalCompletedBitsPath}
            value={saveData.challenge?.normal?.completedBits}
            definitions={normalChallengeBits}
            onChange={handleValueChange}
            renderValidationIndicator={renderValidationIndicator}
          />
          
          <h4>Best Times</h4>
          <FieldDescription>
            The game stores 11 values here for C2–C12; C1 has no best-time slot. An empty field represents the upstream Number.MAX_VALUE sentinel (no recorded completion).
          </FieldDescription>
          <div className="challenges-grid">
            {normalChallengeBits.slice(1).map((definition) => {
              const index = definition.id - 2;
              return (
              <div className="form-group" key={definition.id}>
                <label htmlFor={`normal-bestTimes-${index}`}>{definition.label} (C{definition.id})</label>
                <input
                  type="number"
                  id={`normal-bestTimes-${index}`}
                  min="0"
                  step="0.001"
                  placeholder="No record"
                  value={formatBestTime(saveData.challenge?.normal?.bestTimes?.[index])}
                  onChange={(e) => {
                    const bestTimes = [...(saveData.challenge?.normal?.bestTimes || [])];
                    bestTimes[index] = parseBestTime(e.target.value);
                    handleValueChange('challenge.normal.bestTimes', bestTimes);
                  }}
                />
                <FieldDescription>{definition.description} Best completion time, in seconds.</FieldDescription>
                {renderValidationIndicator(`challenge.normal.bestTimes[${index}]`)}
              </div>
              );
            })}
          </div>
        </div>
        
        {/* Infinity Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'infinity' ? 'active' : ''}`}>
          <h4>Infinity Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="infinity-current">Current Infinity Challenge</label>
            <select
              id="infinity-current"
              value={infinityCurrentId}
              onChange={(e) => handleValueChange('challenge.infinity.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {infinityChallengeBits.map((definition) => (
                <option key={definition.id} value={definition.id}>{definition.label} (IC{definition.id})</option>
              ))}
            </select>
            <FieldDescription>
              {infinityCurrent
                ? `${infinityCurrent.label}: ${infinityCurrent.description}${infinityCurrent.goal ? ` Goal: ${infinityCurrent.goal}.` : ''}${infinityCurrent.reward ? ` Reward: ${infinityCurrent.reward}.` : ''}`
                : '0 means that no Infinity Challenge is currently running.'}
            </FieldDescription>
            {renderValidationIndicator('challenge.infinity.current')}
          </div>
          
          <ChallengeBitfieldEditor
            id="infinity-completedBits"
            title="Completed Infinity Challenges (bits)"
            description="Each completed Infinity Challenge sets the bit matching its challenge ID in challenge.infinity.completedBits; bit 0 is intentionally unused."
            path={infinityCompletedBitsPath}
            value={saveData.challenge?.infinity?.completedBits}
            definitions={infinityChallengeBits}
            onChange={handleValueChange}
            renderValidationIndicator={renderValidationIndicator}
          />
          
          <h4>Best Times</h4>
          <FieldDescription>
            Infinity Challenge best times are stored in seconds. Empty means the game still has its Number.MAX_VALUE no-record sentinel.
          </FieldDescription>
          <div className="challenges-grid">
            {infinityChallengeBits.map((definition) => {
              const index = definition.id - 1;
              return (
              <div className="form-group" key={definition.id}>
                <label htmlFor={`infinity-bestTimes-${index}`}>{definition.label} (IC{definition.id})</label>
                <input
                  type="number"
                  id={`infinity-bestTimes-${index}`}
                  min="0"
                  step="0.001"
                  placeholder="No record"
                  value={formatBestTime(saveData.challenge?.infinity?.bestTimes?.[index])}
                  onChange={(e) => {
                    const bestTimes = [...(saveData.challenge?.infinity?.bestTimes || [])];
                    bestTimes[index] = parseBestTime(e.target.value);
                    handleValueChange('challenge.infinity.bestTimes', bestTimes);
                  }}
                />
                <FieldDescription>{definition.description} Best completion time, in seconds.</FieldDescription>
                {renderValidationIndicator(`challenge.infinity.bestTimes[${index}]`)}
              </div>
              );
            })}
          </div>
        </div>
        
        {/* Eternity Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'eternity' ? 'active' : ''}`}>
          <h4>Eternity Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="eternity-current">Current Eternity Challenge</label>
            <select
              id="eternity-current"
              value={eternityCurrentId}
              onChange={(e) => handleValueChange('challenge.eternity.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {eternityChallengeDefinitions.map((definition) => (
                <option key={definition.id} value={definition.id}>{definition.name}</option>
              ))}
            </select>
            <FieldDescription>
              {eternityCurrent
                ? `${eternityCurrent.description} Goal: ${eternityCurrent.goal} Antimatter. Reward: ${eternityCurrent.reward}${eternityCurrent.restriction ? ` Restriction: ${eternityCurrent.restriction}` : ''}`
                : '0 means that no Eternity Challenge is currently running.'}
            </FieldDescription>
            {renderValidationIndicator('challenge.eternity.current')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eternity-unlocked">Selected EC study ID</label>
            <input
              type="number"
              id="eternity-unlocked"
              value={saveData.challenge?.eternity?.unlocked || 0}
              onChange={(e) => handleValueChange('challenge.eternity.unlocked', parseInt(e.target.value))}
            />
            <FieldDescription>The legacy/current ID of the Eternity Challenge Time Study selected in this Eternity. Persistent EC unlocks are stored separately in reality.unlockedEC.</FieldDescription>
            {renderValidationIndicator('challenge.eternity.unlocked')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eternity-requirementBits">EC requirement history bits</label>
            <input
              type="number"
              id="eternity-requirementBits"
              value={saveData.challenge?.eternity?.requirementBits || 0}
              onChange={(e) => handleValueChange('challenge.eternity.requirementBits', parseInt(e.target.value))}
            />
            <FieldDescription>Historical cache of EC requirements previously met; it is not the persistent unlock mask. The current unlock mask is reality.unlockedEC.</FieldDescription>
            {renderValidationIndicator('challenge.eternity.requirementBits')}
          </div>

          <p className="challenge-bitfield__note">
            Eternity Challenges do not use a completedBits field upstream. Their completion counts are stored in
            eternityChalls.eterc1 through eternityChalls.eterc12 on PC/Web and
            challenge.eternity.completions[0..11] on Android; edit them in the Eternity section.
            Persistent unlock bits are edited in the Reality section, while this panel owns the selected study ID
            and historical requirement cache.
          </p>
          
          {isPCFormat() && (
            <>
              <div className="form-group">
                <label htmlFor="eterc8ids">EC8 IDs</label>
                <input
                  type="number"
                  id="eterc8ids"
                  value={pcSaveData?.eterc8ids || 0}
                  onChange={(e) => handleValueChange('eterc8ids', parseInt(e.target.value))}
                />
                <FieldDescription>Infinity Dimension purchases remaining during EC8. The upstream starting limit is 50 and each purchase consumes this value while EC8 is running.</FieldDescription>
                {renderValidationIndicator('eterc8ids')}
              </div>
              
              <div className="form-group">
                <label htmlFor="eterc8repl">EC8 Replicanti</label>
                <input
                  type="number"
                  id="eterc8repl"
                  value={pcSaveData?.eterc8repl || 0}
                  onChange={(e) => handleValueChange('eterc8repl', parseInt(e.target.value))}
                />
                <FieldDescription>Replicanti upgrades remaining during EC8. The upstream starting limit is 40 and each purchase consumes this value while EC8 is running.</FieldDescription>
                {renderValidationIndicator('eterc8repl')}
              </div>
            </>
          )}
        </div>
        
        {/* Challenge Values Subtab */}
        <div className={`subtab-content ${activeSubtab === 'challenge-values' ? 'active' : ''}`}>
          <h4>Challenge Values & Modifiers</h4>
          
          {isPCFormat() && (
            <div className="form-group">
              <label htmlFor="chall2Pow">Challenge 2 Power</label>
              <input
                type="number"
                id="chall2Pow"
                value={pcSaveData?.chall2Pow || 1}
                step="0.01"
                onChange={(e) => handleValueChange('chall2Pow', parseFloat(e.target.value))}
              />
              <FieldDescription>Normal Challenge 2 production power. Antimatter Dimension production is multiplied by this value while C2 is active; it recovers over time and resets when buying.</FieldDescription>
              {renderValidationIndicator('chall2Pow')}
            </div>
          )}
          
          <div className="form-group">
            {isPCFormat() ? (
              <>
                <label htmlFor="chall3Pow">Challenge 3 Power</label>
                <input
                  type="text"
                  id="chall3Pow"
                  value={pcSaveData?.chall3Pow?.toString() || '0.01'}
                  onChange={(e) => handleValueChange('chall3Pow', e.target.value)}
                />
              </>
            ) : (
              <BigNumberInput
                label="Challenge 3 Power"
                value={saveData.chall3Pow ?? {mantissa: 0.01, exponent: 0}}
                onChange={(value) => handleValueChange('chall3Pow', value)}
                description="Normal Challenge 3 power applied to the 1st Antimatter Dimension while C3 is active. The upstream initial value is 0.01 and it rises during the challenge."
                saveType={saveType}
              />
            )}
            {isPCFormat() && <FieldDescription>Normal Challenge 3 power applied to the 1st Antimatter Dimension while C3 is active. The upstream initial value is 0.01 and it rises during the challenge.</FieldDescription>}
            {renderValidationIndicator('chall3Pow')}
          </div>
          
          {isPCFormat() && (
            <>
              <div className="form-group">
                <label htmlFor="chall8TotalSacrifice">Challenge 8 Total Sacrifice</label>
                <input
                  type="text"
                  id="chall8TotalSacrifice"
                  value={pcSaveData?.chall8TotalSacrifice?.toString() || '0'}
                  onChange={(e) => handleValueChange('chall8TotalSacrifice', e.target.value)}
                />
                <FieldDescription>Normal Challenge 8 sacrifice accumulator. Sacrifice multiplies this value and it replaces the normal sacrifice calculation while C8 is active.</FieldDescription>
                {renderValidationIndicator('chall8TotalSacrifice')}
              </div>
              
              <div className="form-group">
                <label htmlFor="chall9TickspeedCostBumps">Challenge 9 Tickspeed Cost Bumps</label>
                <input
                  type="number"
                  id="chall9TickspeedCostBumps"
                  value={pcSaveData?.chall9TickspeedCostBumps || 0}
                  onChange={(e) => handleValueChange('chall9TickspeedCostBumps', parseInt(e.target.value))}
                />
                <FieldDescription>Additional Tickspeed cost-scaling steps recorded while Normal Challenge 9 is active; it resets with Tickspeed.</FieldDescription>
                {renderValidationIndicator('chall9TickspeedCostBumps')}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesSection; 
