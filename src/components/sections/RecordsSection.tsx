import React, { useState } from 'react';
import { SectionProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch, faChartLine, faHistory, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { BankedInfinitiesClass } from '../../Struct';

/**
 * Records section component
 * Allows viewing and editing of game records
 */
const RecordsSection: React.FC<SectionProps> = ({ saveData, handleValueChange, renderValidationIndicator }) => {
  const [activeSubtab, setActiveSubtab] = useState('statistics');
  
  // Handle subtab changes
  const handleSubtabClick = (subtabId: string) => {
    setActiveSubtab(subtabId);
  };

  // Use typedSaveData to bypass type checking for properties that exist at runtime but aren't in type definitions
  const typedSaveData = saveData as any;

  return (
    <div className="section-content">
      <h2>Records</h2>
      
      {/* Subtabs */}
      <div className="section-subtabs">
        <button 
          className={`subtab-button ${activeSubtab === 'statistics' ? 'active' : ''}`}
          onClick={() => handleSubtabClick('statistics')}
        >
          <FontAwesomeIcon icon={faChartLine} className="subtab-icon" /> Statistics
        </button>
        <button 
          className={`subtab-button ${activeSubtab === 'current' ? 'active' : ''}`}
          onClick={() => handleSubtabClick('current')}
        >
          <FontAwesomeIcon icon={faStopwatch} className="subtab-icon" /> Current Game
        </button>
        <button 
          className={`subtab-button ${activeSubtab === 'best' ? 'active' : ''}`}
          onClick={() => handleSubtabClick('best')}
        >
          <FontAwesomeIcon icon={faTrophy} className="subtab-icon" /> Best Scores
        </button>
        <button 
          className={`subtab-button ${activeSubtab === 'recent' ? 'active' : ''}`}
          onClick={() => handleSubtabClick('recent')}
        >
          <FontAwesomeIcon icon={faHistory} className="subtab-icon" /> Recent Games
        </button>
      </div>
      
      {/* Statistics Subtab */}
      <div className={`subtab-content ${activeSubtab === 'statistics' ? 'active' : ''}`}>
        <div className="records-grid">
          <h3>Statistics</h3>
          
          <div className="form-group">
            <label htmlFor="records-total-antimatter">Total Antimatter Produced</label>
            <input
              type="text"
              id="records-total-antimatter"
              value={typedSaveData.records?.totalAntimatter || "0"}
              onChange={(e) => handleValueChange('records.totalAntimatter', e.target.value)}
            />
            {renderValidationIndicator('records.totalAntimatter')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-totalTimePlayed">Total Time Played (ms)</label>
            <input
              type="number"
              id="records-totalTimePlayed"
              value={typedSaveData.records?.totalTimePlayed || 0}
              onChange={(e) => handleValueChange('records.totalTimePlayed', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.totalTimePlayed')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-realTimePlayed">Real Time Played (ms)</label>
            <input
              type="number"
              id="records-realTimePlayed"
              value={typedSaveData.records?.realTimePlayed || 0}
              onChange={(e) => handleValueChange('records.realTimePlayed', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.realTimePlayed')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-gameCreatedTime">Game Created Time (ms)</label>
            <input
              type="number"
              id="records-gameCreatedTime"
              value={typedSaveData.records?.gameCreatedTime || Date.now()}
              onChange={(e) => handleValueChange('records.gameCreatedTime', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.gameCreatedTime')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-fullGameCompletions">Full Game Completions</label>
            <input
              type="number"
              id="records-fullGameCompletions"
              value={typedSaveData.records?.fullGameCompletions || 0}
              onChange={(e) => handleValueChange('records.fullGameCompletions', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.fullGameCompletions')}
          </div>
        </div>
      </div>
      
      {/* Current Run Subtab */}
      <div className={`subtab-content ${activeSubtab === 'current' ? 'active' : ''}`}>
        <div className="records-grid">
          <h3>Current Run</h3>
          <h4>This Infinity</h4>
          <div className="form-group">
            <label htmlFor="records-thisInfinity-time">Time (ms)</label>
            <input
              type="number"
              id="records-thisInfinity-time"
              value={typedSaveData.records?.thisInfinity?.time || 0}
              onChange={(e) => handleValueChange('records.thisInfinity.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.thisInfinity.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisInfinity-maxAM">Max Antimatter</label>
            <input
              type="text"
              id="records-thisInfinity-maxAM"
              value={typedSaveData.records?.thisInfinity?.maxAM || '0'}
              onChange={(e) => handleValueChange('records.thisInfinity.maxAM', e.target.value)}
            />
            {renderValidationIndicator('records.thisInfinity.maxAM')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisInfinity-bestIPmin">Best IP/min</label>
            <input
              type="text"
              id="records-thisInfinity-bestIPmin"
              value={typedSaveData.records?.thisInfinity?.bestIPmin || '0'}
              onChange={(e) => handleValueChange('records.thisInfinity.bestIPmin', e.target.value)}
            />
            {renderValidationIndicator('records.thisInfinity.bestIPmin')}
          </div>
          
          <h4>This Eternity</h4>
          <div className="form-group">
            <label htmlFor="records-thisEternity-time">Time (ms)</label>
            <input
              type="number"
              id="records-thisEternity-time"
              value={typedSaveData.records?.thisEternity?.time || 0}
              onChange={(e) => handleValueChange('records.thisEternity.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.thisEternity.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisEternity-maxAM">Max Antimatter</label>
            <input
              type="text"
              id="records-thisEternity-maxAM"
              value={typedSaveData.records?.thisEternity?.maxAM || '0'}
              onChange={(e) => handleValueChange('records.thisEternity.maxAM', e.target.value)}
            />
            {renderValidationIndicator('records.thisEternity.maxAM')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisEternity-maxIP">Max IP</label>
            <input
              type="text"
              id="records-thisEternity-maxIP"
              value={typedSaveData.records?.thisEternity?.maxIP || '0'}
              onChange={(e) => handleValueChange('records.thisEternity.maxIP', e.target.value)}
            />
            {renderValidationIndicator('records.thisEternity.maxIP')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisEternity-bestEPmin">Best EP/min</label>
            <input
              type="text"
              id="records-thisEternity-bestEPmin"
              value={typedSaveData.records?.thisEternity?.bestEPmin || '0'}
              onChange={(e) => handleValueChange('records.thisEternity.bestEPmin', e.target.value)}
            />
            {renderValidationIndicator('records.thisEternity.bestEPmin')}
          </div>
          
          <h4>This Reality</h4>
          <div className="form-group">
            <label htmlFor="records-thisReality-time">Time (ms)</label>
            <input
              type="number"
              id="records-thisReality-time"
              value={typedSaveData.records?.thisReality?.time || 0}
              onChange={(e) => handleValueChange('records.thisReality.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.thisReality.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisReality-maxAM">Max Antimatter</label>
            <input
              type="text"
              id="records-thisReality-maxAM"
              value={typedSaveData.records?.thisReality?.maxAM || '0'}
              onChange={(e) => handleValueChange('records.thisReality.maxAM', e.target.value)}
            />
            {renderValidationIndicator('records.thisReality.maxAM')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisReality-maxIP">Max IP</label>
            <input
              type="text"
              id="records-thisReality-maxIP"
              value={typedSaveData.records?.thisReality?.maxIP || '0'}
              onChange={(e) => handleValueChange('records.thisReality.maxIP', e.target.value)}
            />
            {renderValidationIndicator('records.thisReality.maxIP')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisReality-maxEP">Max EP</label>
            <input
              type="text"
              id="records-thisReality-maxEP"
              value={typedSaveData.records?.thisReality?.maxEP || '0'}
              onChange={(e) => handleValueChange('records.thisReality.maxEP', e.target.value)}
            />
            {renderValidationIndicator('records.thisReality.maxEP')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisReality-maxReplicanti">Max Replicanti</label>
            <input
              type="text"
              id="records-thisReality-maxReplicanti"
              value={typedSaveData.records?.thisReality?.maxReplicanti || '0'}
              onChange={(e) => handleValueChange('records.thisReality.maxReplicanti', e.target.value)}
            />
            {renderValidationIndicator('records.thisReality.maxReplicanti')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-thisReality-maxDT">Max Dilated Time</label>
            <input
              type="text"
              id="records-thisReality-maxDT"
              value={typedSaveData.records?.thisReality?.maxDT || '0'}
              onChange={(e) => handleValueChange('records.thisReality.maxDT', e.target.value)}
            />
            {renderValidationIndicator('records.thisReality.maxDT')}
          </div>
        </div>
      </div>
      
      {/* Best Runs Subtab */}
      <div className={`subtab-content ${activeSubtab === 'best' ? 'active' : ''}`}>
        <div className="records-grid">
          <h3>Best Runs</h3>
          <h4>Best Infinity</h4>
          <div className="form-group">
            <label htmlFor="records-bestInfinity-time">Time (ms)</label>
            <input
              type="number"
              id="records-bestInfinity-time"
              value={typedSaveData.records?.bestInfinity?.time || 0}
              onChange={(e) => handleValueChange('records.bestInfinity.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.bestInfinity.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestInfinity-bestIPminEternity">Best IP/min this Eternity</label>
            <input
              type="text"
              id="records-bestInfinity-bestIPminEternity"
              value={typedSaveData.records?.bestInfinity?.bestIPminEternity || '0'}
              onChange={(e) => handleValueChange('records.bestInfinity.bestIPminEternity', e.target.value)}
            />
            {renderValidationIndicator('records.bestInfinity.bestIPminEternity')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestInfinity-bestIPminReality">Best IP/min this Reality</label>
            <input
              type="text"
              id="records-bestInfinity-bestIPminReality"
              value={typedSaveData.records?.bestInfinity?.bestIPminReality || '0'}
              onChange={(e) => handleValueChange('records.bestInfinity.bestIPminReality', e.target.value)}
            />
            {renderValidationIndicator('records.bestInfinity.bestIPminReality')}
          </div>
          
          <h4>Best Eternity</h4>
          <div className="form-group">
            <label htmlFor="records-bestEternity-time">Time (ms)</label>
            <input
              type="number"
              id="records-bestEternity-time"
              value={typedSaveData.records?.bestEternity?.time || 0}
              onChange={(e) => handleValueChange('records.bestEternity.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.bestEternity.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestEternity-bestEPminReality">Best EP/min this Reality</label>
            <input
              type="text"
              id="records-bestEternity-bestEPminReality"
              value={typedSaveData.records?.bestEternity?.bestEPminReality || '0'}
              onChange={(e) => handleValueChange('records.bestEternity.bestEPminReality', e.target.value)}
            />
            {renderValidationIndicator('records.bestEternity.bestEPminReality')}
          </div>
          
          <h4>Best Reality</h4>
          <div className="form-group">
            <label htmlFor="records-bestReality-time">Time (ms)</label>
            <input
              type="number"
              id="records-bestReality-time"
              value={typedSaveData.records?.bestReality?.time || 0}
              onChange={(e) => handleValueChange('records.bestReality.time', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.bestReality.time')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestReality-RM">Reality Machines</label>
            <input
              type="text"
              id="records-bestReality-RM"
              value={typedSaveData.records?.bestReality?.RM || '0'}
              onChange={(e) => handleValueChange('records.bestReality.RM', e.target.value)}
            />
            {renderValidationIndicator('records.bestReality.RM')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestReality-RMmin">RM/min</label>
            <input
              type="text"
              id="records-bestReality-RMmin"
              value={typedSaveData.records?.bestReality?.RMmin || '0'}
              onChange={(e) => handleValueChange('records.bestReality.RMmin', e.target.value)}
            />
            {renderValidationIndicator('records.bestReality.RMmin')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestReality-glyphLevel">Glyph Level</label>
            <input
              type="number"
              id="records-bestReality-glyphLevel"
              value={typedSaveData.records?.bestReality?.glyphLevel || 0}
              onChange={(e) => handleValueChange('records.bestReality.glyphLevel', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.bestReality.glyphLevel')}
          </div>
          
          <div className="form-group">
            <label htmlFor="records-bestReality-glyphStrength">Glyph Strength</label>
            <input
              type="number"
              id="records-bestReality-glyphStrength"
              value={typedSaveData.records?.bestReality?.glyphStrength || 0}
              onChange={(e) => handleValueChange('records.bestReality.glyphStrength', parseInt(e.target.value))}
            />
            {renderValidationIndicator('records.bestReality.glyphStrength')}
          </div>
        </div>
      </div>
      
      {/* Recent Runs Subtab */}
      <div className={`subtab-content ${activeSubtab === 'recent' ? 'active' : ''}`}>
        <div className="records-grid">
          <h3>Recent Runs</h3>
          <div className="form-group">
            <button 
              className="btn btn-primary"
              onClick={() => {
                // Create a record for last 10 infinities
                const lastInfinities = Array(10).fill([0, "1"]);
                handleValueChange('records.lastTenInfinities', lastInfinities);
              }}
            >
              Clear Last 10 Infinities
            </button>
          </div>
          
          <div className="form-group">
            <button 
              className="btn btn-primary"
              onClick={() => {
                // Create a record for last 10 eternities
                const lastEternities = Array(10).fill([0, "1"]);
                handleValueChange('records.lastTenEternities', lastEternities);
              }}
            >
              Clear Last 10 Eternities
            </button>
          </div>
          
          <div className="form-group">
            <button 
              className="btn btn-primary"
              onClick={() => {
                // Create a record for last 10 realities
                const lastRealities = Array(10).fill([0, "1"]);
                handleValueChange('records.lastTenRealities', lastRealities);
              }}
            >
              Clear Last 10 Realities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsSection; 