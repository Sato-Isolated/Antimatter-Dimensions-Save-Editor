import React, { useEffect, useId, useRef, useState } from 'react';
import { parseEditorJson, stringifyEditorJson } from '../../domain/save/transport/editorJsonCodec';
import IssueMessage from './IssueMessage';

type JsonValueExpectation = 'value' | 'array' | 'object';
type JsonFieldValue = unknown;

interface JsonValueFieldProps {
  id: string;
  label: string;
  description?: string;
  value: JsonFieldValue;
  onChange: (value: JsonFieldValue) => void;
  rows?: number;
  placeholder?: string;
  expectation?: JsonValueExpectation;
  stringifySpace?: number;
  fallbackValue?: JsonFieldValue;
  ariaLabel?: string;
}

const stringifyValue = (value: JsonFieldValue, fallbackValue: JsonFieldValue, stringifySpace?: number): string => {
  return stringifyEditorJson(value ?? fallbackValue, stringifySpace);
};

const getExpectationMessage = (expectation: JsonValueExpectation): string => {
  switch (expectation) {
    case 'array':
      return 'Value must be a JSON array.';
    case 'object':
      return 'Value must be a JSON object.';
    default:
      return 'Enter valid JSON.';
  }
};

const isExpectedShape = (value: unknown, expectation: JsonValueExpectation): boolean => {
  if (expectation === 'array') {
    return Array.isArray(value);
  }

  if (expectation === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  return true;
};

const JsonValueField: React.FC<JsonValueFieldProps> = ({
  id,
  label,
  description,
  value,
  onChange,
  rows = 3,
  placeholder,
  expectation = 'value',
  stringifySpace,
  fallbackValue = expectation === 'array' ? [] : {},
  ariaLabel,
}) => {
  const errorId = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const serializedValue = stringifyValue(value, fallbackValue, stringifySpace);
  const lastSyncedValueRef = useRef(serializedValue);
  const [draft, setDraft] = useState(serializedValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serializedValue !== lastSyncedValueRef.current) {
      lastSyncedValueRef.current = serializedValue;
      setDraft(serializedValue);
      setError(null);
    }
  }, [serializedValue]);

  return (
    <div className="json-textarea-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={draft}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
        aria-describedby={[descriptionId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);

          try {
            const parsed = parseEditorJson(nextDraft);

            if (!isExpectedShape(parsed, expectation)) {
              setError(getExpectationMessage(expectation));
              return;
            }

            setError(null);
            lastSyncedValueRef.current = stringifyValue(parsed, fallbackValue, stringifySpace);
            onChange(parsed as JsonFieldValue);
          } catch {
            setError('Enter valid JSON.');
          }
        }}
      />
      {description ? <p id={descriptionId} className="field-description">{description}</p> : null}
      {error ? <IssueMessage id={errorId} message={error} /> : null}
    </div>
  );
};

export default JsonValueField;
