import React, { useState } from 'react';
import { SectionProps } from './types';
import { FaTrophy, FaInfinity, FaHourglassHalf } from 'react-icons/fa';

const ChallengesSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('normal');

  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  return (
    <div className="section-pane active" id="challenges">
      <div className="section-content">
        <h3>Challenges</h3>
        
        {/* Subtabs */}
        <div className="section-subtabs">
          <button 
            className={`subtab-button ${activeSubtab === 'normal' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('normal')}
          >
            <FaTrophy className="subtab-icon" /> Normal Challenges
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'infinity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('infinity')}
          >
            <FaInfinity className="subtab-icon" /> Infinity Challenges
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'eternity' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('eternity')}
          >
            <FaHourglassHalf className="subtab-icon" /> Eternity Challenges
          </button>
          <button 
            className={`subtab-button ${activeSubtab === 'challenge-values' ? 'active' : ''}`}
            onClick={() => handleSubtabClick('challenge-values')}
          >
            <FaTrophy className="subtab-icon" /> Challenge Values
          </button>
        </div>
        
        {/* Normal Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'normal' ? 'active' : ''}`}>
          <h4>Normal Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="normal-current">Current Challenge</label>
            <select
              id="normal-current"
              value={saveData.challenge?.normal?.current || 0}
              onChange={(e) => handleValueChange('challenge.normal.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>Challenge {i+1}</option>
              ))}
            </select>
            {renderValidationIndicator('challenge.normal.current')}
          </div>
          
          <div className="form-group">
            <label htmlFor="normal-completedBits">Completed Challenges (Bits)</label>
            <input
              type="number"
              id="normal-completedBits"
              value={saveData.challenge?.normal?.completedBits || 0}
              onChange={(e) => handleValueChange('challenge.normal.completedBits', parseInt(e.target.value))}
            />
            {renderValidationIndicator('challenge.normal.completedBits')}
          </div>
          
          <h4>Best Times</h4>
          <div className="challenges-grid">
            {Array.from({ length: 12 }, (_, i) => (
              <div className="form-group" key={i}>
                <label htmlFor={`normal-bestTimes-${i}`}>Challenge {i+1}</label>
                <input
                  type="number"
                  id={`normal-bestTimes-${i}`}
                  value={saveData.challenge?.normal?.bestTimes?.[i] || 0}
                  onChange={(e) => {
                    const bestTimes = [...(saveData.challenge?.normal?.bestTimes || [])];
                    bestTimes[i] = parseInt(e.target.value);
                    handleValueChange('challenge.normal.bestTimes', bestTimes);
                  }}
                />
                {renderValidationIndicator(`challenge.normal.bestTimes[${i}]`)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Infinity Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'infinity' ? 'active' : ''}`}>
          <h4>Infinity Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="infinity-current">Current Infinity Challenge</label>
            <select
              id="infinity-current"
              value={saveData.challenge?.infinity?.current || 0}
              onChange={(e) => handleValueChange('challenge.infinity.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i+1} value={i+1}>Infinity Challenge {i+1}</option>
              ))}
            </select>
            {renderValidationIndicator('challenge.infinity.current')}
          </div>
          
          <div className="form-group">
            <label htmlFor="infinity-completedBits">Completed Infinity Challenges (Bits)</label>
            <input
              type="number"
              id="infinity-completedBits"
              value={saveData.challenge?.infinity?.completedBits || 0}
              onChange={(e) => handleValueChange('challenge.infinity.completedBits', parseInt(e.target.value))}
            />
            {renderValidationIndicator('challenge.infinity.completedBits')}
          </div>
          
          <div className="form-group">
            <label htmlFor="ic2Count">IC2 Count</label>
            <input
              type="number"
              id="ic2Count"
              value={saveData.ic2Count || 0}
              onChange={(e) => handleValueChange('ic2Count', parseInt(e.target.value))}
            />
            {renderValidationIndicator('ic2Count')}
          </div>
          
          <h4>Best Times</h4>
          <div className="challenges-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="form-group" key={i}>
                <label htmlFor={`infinity-bestTimes-${i}`}>IC {i+1}</label>
                <input
                  type="number"
                  id={`infinity-bestTimes-${i}`}
                  value={saveData.challenge?.infinity?.bestTimes?.[i] || 0}
                  onChange={(e) => {
                    const bestTimes = [...(saveData.challenge?.infinity?.bestTimes || [])];
                    bestTimes[i] = parseInt(e.target.value);
                    handleValueChange('challenge.infinity.bestTimes', bestTimes);
                  }}
                />
                {renderValidationIndicator(`challenge.infinity.bestTimes[${i}]`)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Eternity Challenges Subtab */}
        <div className={`subtab-content ${activeSubtab === 'eternity' ? 'active' : ''}`}>
          <h4>Eternity Challenges</h4>
          
          <div className="form-group">
            <label htmlFor="eternity-current">Current Eternity Challenge</label>
            <select
              id="eternity-current"
              value={saveData.challenge?.eternity?.current || 0}
              onChange={(e) => handleValueChange('challenge.eternity.current', parseInt(e.target.value))}
            >
              <option value="0">None</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>Eternity Challenge {i+1}</option>
              ))}
            </select>
            {renderValidationIndicator('challenge.eternity.current')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eternity-unlocked">Unlocked Eternity Challenges (Bits)</label>
            <input
              type="number"
              id="eternity-unlocked"
              value={saveData.challenge?.eternity?.unlocked || 0}
              onChange={(e) => handleValueChange('challenge.eternity.unlocked', parseInt(e.target.value))}
            />
            {renderValidationIndicator('challenge.eternity.unlocked')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eternity-requirementBits">Requirement Bits</label>
            <input
              type="number"
              id="eternity-requirementBits"
              value={saveData.challenge?.eternity?.requirementBits || 0}
              onChange={(e) => handleValueChange('challenge.eternity.requirementBits', parseInt(e.target.value))}
            />
            {renderValidationIndicator('challenge.eternity.requirementBits')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eterc8ids">EC8 IDs</label>
            <input
              type="number"
              id="eterc8ids"
              value={saveData.eterc8ids || 0}
              onChange={(e) => handleValueChange('eterc8ids', parseInt(e.target.value))}
            />
            {renderValidationIndicator('eterc8ids')}
          </div>
          
          <div className="form-group">
            <label htmlFor="eterc8repl">EC8 Replicanti</label>
            <input
              type="number"
              id="eterc8repl"
              value={saveData.eterc8repl || 0}
              onChange={(e) => handleValueChange('eterc8repl', parseInt(e.target.value))}
            />
            {renderValidationIndicator('eterc8repl')}
          </div>
        </div>
        
        {/* Challenge Values Subtab */}
        <div className={`subtab-content ${activeSubtab === 'challenge-values' ? 'active' : ''}`}>
          <h4>Challenge Values & Modifiers</h4>
          
          <div className="form-group">
            <label htmlFor="chall2Pow">Challenge 2 Power</label>
            <input
              type="number"
              id="chall2Pow"
              value={saveData.chall2Pow || 1}
              step="0.01"
              onChange={(e) => handleValueChange('chall2Pow', parseFloat(e.target.value))}
            />
            {renderValidationIndicator('chall2Pow')}
          </div>
          
          <div className="form-group">
            <label htmlFor="chall3Pow">Challenge 3 Power</label>
            <input
              type="text"
              id="chall3Pow"
              value={saveData.chall3Pow?.toString() || '0.01'}
              onChange={(e) => handleValueChange('chall3Pow', e.target.value)}
            />
            {renderValidationIndicator('chall3Pow')}
          </div>
          
          <div className="form-group">
            <label htmlFor="chall8TotalSacrifice">Challenge 8 Total Sacrifice</label>
            <input
              type="text"
              id="chall8TotalSacrifice"
              value={saveData.chall8TotalSacrifice?.toString() || '0'}
              onChange={(e) => handleValueChange('chall8TotalSacrifice', e.target.value)}
            />
            {renderValidationIndicator('chall8TotalSacrifice')}
          </div>
          
          <div className="form-group">
            <label htmlFor="chall9TickspeedCostBumps">Challenge 9 Tickspeed Cost Bumps</label>
            <input
              type="number"
              id="chall9TickspeedCostBumps"
              value={saveData.chall9TickspeedCostBumps || 0}
              onChange={(e) => handleValueChange('chall9TickspeedCostBumps', parseInt(e.target.value))}
            />
            {renderValidationIndicator('chall9TickspeedCostBumps')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesSection; 