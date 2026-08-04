import React, { useEffect, useId, useState } from 'react';
import { SaveType } from '../../domain/save/model';

interface BigNumberFieldProps {
  value: unknown;
  onChange: (value: unknown) => void;
  saveType: SaveType;
  label?: string;
  className?: string;
  disabled?: boolean;
  describedBy?: string;
  description?: string;
  invalid?: boolean;
}

type AndroidBigNumber = {
  mantissa: number;
  exponent: number;
};

const joinDescribedBy = (...values: Array<string | undefined>): string | undefined => {
  const tokens = values
    .flatMap((value) => (value ?? '').split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);

  return tokens.length > 0 ? tokens.join(' ') : undefined;
};

const isAndroidBigNumber = (value: unknown): value is AndroidBigNumber => {
  return typeof value === 'object'
    && value !== null
    && 'mantissa' in value
    && 'exponent' in value;
};

const formatPcDraft = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (isAndroidBigNumber(value)) {
    return `${value.mantissa}e${value.exponent}`;
  }

  return '';
};

const formatMantissaDraft = (value: unknown): string => {
  if (!isAndroidBigNumber(value)) {
    return '0';
  }

  return String(value.mantissa);
};

const formatExponentDraft = (value: unknown): string => {
  if (!isAndroidBigNumber(value)) {
    return '0';
  }

  return String(value.exponent);
};

/**
 * Component for handling big numbers in both PC and Android save formats
 * PC format: string like "1e+1500"
 * Android format: {mantissa: number, exponent: number} object
 */
const BigNumberField: React.FC<BigNumberFieldProps> = ({ 
  value, 
  onChange, 
  saveType, 
  label,
  className = '',
  disabled = false,
  describedBy,
  description,
  invalid = false,
}) => {
  const baseId = useId();
  const inputId = `${baseId}-value`;
  const groupLabelId = `${baseId}-group-label`;
  const mantissaId = `${baseId}-mantissa`;
  const exponentId = `${baseId}-exponent`;
  const mantissaLabelId = `${baseId}-mantissa-label`;
  const exponentLabelId = `${baseId}-exponent-label`;
  const descriptionId = description ? `${baseId}-description` : undefined;
  const combinedDescribedBy = joinDescribedBy(describedBy, descriptionId);
  const [pcDraft, setPcDraft] = useState<string>(() => formatPcDraft(value));
  const [mantissaDraft, setMantissaDraft] = useState<string>(() => formatMantissaDraft(value));
  const [exponentDraft, setExponentDraft] = useState<string>(() => formatExponentDraft(value));

  useEffect(() => {
    setPcDraft(formatPcDraft(value));
  }, [value, saveType]);

  useEffect(() => {
    setMantissaDraft(formatMantissaDraft(value));
    setExponentDraft(formatExponentDraft(value));
  }, [value, saveType]);

  const restorePcDraft = () => {
    setPcDraft(formatPcDraft(value));
  };

  const restoreAndroidDrafts = () => {
    setMantissaDraft(formatMantissaDraft(value));
    setExponentDraft(formatExponentDraft(value));
  };

  const commitPcDraft = () => {
    const nextValue = pcDraft.trim();

    if (!nextValue) {
      restorePcDraft();
      return;
    }

    onChange(nextValue);
  };

  const commitAndroidDraft = () => {
    const nextMantissa = mantissaDraft.trim();
    const nextExponent = exponentDraft.trim();

    if (!nextMantissa || !nextExponent) {
      restoreAndroidDrafts();
      return;
    }

    const parsedMantissa = Number.parseFloat(nextMantissa);
    const parsedExponent = Number.parseInt(nextExponent, 10);

    if (Number.isNaN(parsedMantissa) || Number.isNaN(parsedExponent)) {
      restoreAndroidDrafts();
      return;
    }

    onChange({
      mantissa: parsedMantissa,
      exponent: parsedExponent,
    });
  };

  // Handle PC format (string)
  if (saveType === SaveType.PC) {
    return (
      <div className={`big-number-input pc-format ${className}`}>
        {label && <label id={groupLabelId} className="input-label" htmlFor={inputId}>{label}</label>}
        <input
          id={inputId}
          type="text"
          value={pcDraft}
          onChange={(e) => setPcDraft(e.target.value)}
          onBlur={commitPcDraft}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitPcDraft();
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              restorePcDraft();
            }
          }}
          className="input-field"
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="decimal"
          aria-describedby={combinedDescribedBy}
          aria-labelledby={label ? groupLabelId : undefined}
          aria-invalid={invalid}
        />
        {description ? <p id={descriptionId} className="field-description">{description}</p> : null}
      </div>
    );
  }
  
  // Handle Android format (object with mantissa and exponent)
  return (
    <div
      className={`big-number-input android-format ${className}`}
      role="group"
      aria-labelledby={label ? groupLabelId : undefined}
      aria-describedby={combinedDescribedBy}
    >
      {label && <p id={groupLabelId} className="input-label big-number-group-label">{label}</p>}
      <div className="android-number-inputs">
        <div className="android-number-field">
          <label id={mantissaLabelId} className="big-number-part-label" htmlFor={mantissaId}>Mantissa</label>
          <input
            id={mantissaId}
            type="number"
            className="mantissa-input"
            value={mantissaDraft}
            onChange={(e) => setMantissaDraft(e.target.value)}
            onBlur={commitAndroidDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitAndroidDraft();
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                restoreAndroidDrafts();
              }
            }}
            step="0.01"
            disabled={disabled}
            inputMode="decimal"
            aria-describedby={combinedDescribedBy}
            aria-labelledby={joinDescribedBy(label ? groupLabelId : undefined, mantissaLabelId)}
            aria-invalid={invalid}
          />
        </div>
        <span className="multiply-symbol" aria-hidden="true">x10</span>
        <div className="android-number-field">
          <label id={exponentLabelId} className="big-number-part-label" htmlFor={exponentId}>Exponent</label>
          <input
            id={exponentId}
            type="number"
            className="exponent-input"
            value={exponentDraft}
            onChange={(e) => setExponentDraft(e.target.value)}
            onBlur={commitAndroidDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitAndroidDraft();
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                restoreAndroidDrafts();
              }
            }}
            disabled={disabled}
            inputMode="decimal"
            aria-describedby={combinedDescribedBy}
            aria-labelledby={joinDescribedBy(label ? groupLabelId : undefined, exponentLabelId)}
            aria-invalid={invalid}
          />
        </div>
      </div>
      {description ? <p id={descriptionId} className="field-description">{description}</p> : null}
    </div>
  );
};

export default BigNumberField;
