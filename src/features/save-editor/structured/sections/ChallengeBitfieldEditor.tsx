import React from 'react';
import {
  challengeBitMask,
  ChallengeBitDefinition,
  clearKnownChallenges,
  completeKnownChallenges,
  isChallengeBitSet,
  setChallengeBit,
} from '../../../../domain/save/catalog/challenges';

interface ChallengeBitfieldEditorProps {
  id: string;
  title: string;
  description: string;
  path: string;
  value: unknown;
  definitions: readonly ChallengeBitDefinition[];
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}

const ChallengeBitfieldEditor: React.FC<ChallengeBitfieldEditorProps> = ({
  id,
  title,
  description,
  path,
  value,
  definitions,
  onChange,
  renderValidationIndicator,
}) => {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : '';
  const knownMask = challengeBitMask(definitions);
  const completedCount = definitions.filter((definition) => isChallengeBitSet(value, definition)).length;

  return (
    <div className="challenge-bitfield">
      <div className="challenge-bitfield__header">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <span className="challenge-bitfield__mask">
          Known mask: {knownMask} · 0x{knownMask.toString(16).toUpperCase()}
        </span>
      </div>

      <div className="form-group">
        <label htmlFor={id}>Raw completedBits value</label>
        <input
          type="number"
          id={id}
          min="0"
          step="1"
          value={numericValue}
          onChange={(event) => {
            const nextValue = event.target.value === ''
              ? Number.NaN
              : Number.parseInt(event.target.value, 10);
            onChange(path, nextValue);
          }}
        />
        {renderValidationIndicator(path)}
      </div>

      <div className="challenge-bitfield__actions" aria-label={`${title} actions`}>
        <button
          type="button"
          className="btn primary"
          onClick={() => onChange(path, completeKnownChallenges(value, definitions))}
        >
          Complete all known ({definitions.length})
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => onChange(path, clearKnownChallenges(value, definitions))}
        >
          Clear known
        </button>
      </div>

      <p className="challenge-bitfield__note">
        Upstream uses the challenge id as the bit index: bit 0 is unused, so Challenge 1 is value 2.
        The actions preserve bits that are not listed here.
      </p>
      <p className="challenge-bitfield__progress">
        {completedCount}/{definitions.length} known challenges marked complete. The numeric value is a sum of the checked bit values.
      </p>

      <div className="challenge-bit-grid" aria-label={`${title} bit controls`}>
        {definitions.map((definition) => (
          <label className="challenge-bit-option" key={definition.id}>
            <input
              type="checkbox"
              checked={isChallengeBitSet(value, definition)}
              onChange={(event) => onChange(
                path,
                setChallengeBit(value, definition, event.target.checked),
              )}
            />
              <span>
                <strong>{definition.label}</strong>
                <small>bit {definition.bitIndex} · value {2 ** definition.bitIndex}</small>
                <em>{definition.description}</em>
                {definition.reward ? <em>Reward: {definition.reward}</em> : null}
                {definition.goal ? <em>Goal: {definition.goal}</em> : null}
              </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChallengeBitfieldEditor;
