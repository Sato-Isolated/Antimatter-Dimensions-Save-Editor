import React, { useMemo } from 'react';
import {
  BitDefinition,
  getBitfieldValue,
  getUnknownSetBits,
  setAllKnownBits,
  setBitfieldBit,
  clearAllKnownBits,
} from '../../domain/save/catalog/bitfields';

interface BitfieldEditorProps {
  path: string;
  label: string;
  description: string;
  value: unknown;
  knownBits: BitDefinition[];
  rawOnly?: boolean;
  readOnly?: boolean;
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}

const formatHex = (value: unknown): string => (
  typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? `0x${value.toString(16).toUpperCase()}`
    : '—'
);

const parseRawInteger = (event: React.ChangeEvent<HTMLInputElement>): number => (
  event.target.value === '' ? Number.NaN : Number(event.target.value)
);

export const BitfieldOptions: React.FC<{
  value: unknown;
  knownBits: BitDefinition[];
  onToggle: (bitIndex: number, enabled: boolean) => void;
  disabled?: boolean;
}> = ({ value, knownBits, onToggle, disabled = false }) => (
  <div className="bitfield-options">
    {knownBits.map((definition) => (
      <label className="bitfield-option" key={`${definition.segment ?? 0}-${definition.bit}`}>
        <input
          type="checkbox"
          disabled={disabled}
          checked={getBitfieldValue(value, definition.bit)}
          onChange={(event) => onToggle(definition.bit, event.target.checked)}
        />
        <span>
          <strong>{definition.label}</strong>
          <small>bit {definition.bit}</small>
          <em>{definition.description}</em>
        </span>
      </label>
    ))}
  </div>
);

export const UnknownBits: React.FC<{ bits: number[] }> = ({ bits }) => (
  <p className={`bitfield-card__unknown ${bits.length > 0 ? 'detected' : ''}`}>
    {bits.length > 0 ? `Unknown active bits preserved: ${bits.join(', ')}` : 'No unknown active bits detected.'}
  </p>
);

const BitfieldEditor: React.FC<BitfieldEditorProps> = ({
  path,
  label,
  description,
  value,
  knownBits,
  rawOnly = false,
  readOnly = false,
  onChange,
  renderValidationIndicator,
}) => {
  const unknownBits = useMemo(() => getUnknownSetBits(value, knownBits), [knownBits, value]);
  const validValue = typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0;

  return (
    <article className="bitfield-card">
      <div className="bitfield-card__header">
        <div>
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
        <code className="bitfield-card__path">{path}</code>
      </div>

      <div className="bitfield-card__raw">
        <label>
          Raw decimal
          <input
            type="number"
            min="0"
            max="2147483647"
            step="1"
            readOnly={readOnly}
            value={typeof value === 'number' ? value : String(value ?? '')}
            onChange={readOnly ? undefined : (event) => onChange(path, parseRawInteger(event))}
          />
        </label>
        <div>
          <span>Hexadecimal</span>
          <code>{formatHex(value)}</code>
        </div>
      </div>
      {renderValidationIndicator(path)}

      {readOnly ? (
        <p className="bitfield-card__note">Diagnostic projection only: edit the containing structured value in its dedicated section.</p>
      ) : rawOnly ? (
        <p className="bitfield-card__note">Historical/raw field: no current upstream bit meaning is assigned.</p>
      ) : (
        <>
          <div className="bitfield-card__actions">
            <button type="button" className="button secondary" onClick={() => onChange(path, setAllKnownBits(validValue, knownBits))}>
              Complete known
            </button>
            <button type="button" className="button secondary" onClick={() => onChange(path, clearAllKnownBits(validValue, knownBits))}>
              Clear known
            </button>
          </div>
          <BitfieldOptions
            value={value}
            knownBits={knownBits}
            onToggle={(bitIndex, enabled) => onChange(path, setBitfieldBit(validValue, bitIndex, enabled))}
            disabled={readOnly}
          />
        </>
      )}

      <UnknownBits bits={unknownBits} />
    </article>
  );
};

export default BitfieldEditor;
