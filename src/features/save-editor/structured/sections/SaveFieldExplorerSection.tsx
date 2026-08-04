import React, { useEffect, useMemo, useState } from 'react';
import { collectDiscoveredSaveFields, DiscoveredSaveField, getDiscoveredFieldKindLabel, isCompositeSaveField } from '../../../../domain/save/catalog/fieldExplorer';
import { SaveObject } from '../../../../domain/save/model';
import JsonTextareaField from '../../../../shared/ui/JsonValueField';
import { SectionProps } from './types';

type ExplorerFilter = 'all' | 'unmodeled' | 'registered' | 'number' | 'boolean' | 'string' | 'container' | 'null';

const PAGE_SIZE = 120;

const fieldIdForPath = (path: string): string => `discovered-field-${path
  .replace(/\./gu, '-dot-')
  .replace(/\[/gu, '-index-')
  .replace(/\]/gu, '-end-')
  .replace(/[^a-zA-Z0-9_-]+/gu, '-')}`;

const formatNumberDraft = (value: number): string => {
  if (Number.isNaN(value)) {
    return '';
  }

  if (value === Number.POSITIVE_INFINITY) {
    return 'Infinity';
  }

  if (value === Number.NEGATIVE_INFINITY) {
    return '-Infinity';
  }

  return String(value);
};

const parseNumberDraft = (draft: string): number | undefined => {
  const normalized = draft.trim();

  if (!normalized) {
    return Number.NaN;
  }

  if (normalized === 'Infinity' || normalized === '+Infinity') {
    return Number.POSITIVE_INFINITY;
  }

  if (normalized === '-Infinity') {
    return Number.NEGATIVE_INFINITY;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
};

interface LiteralValueEditorProps {
  field: DiscoveredSaveField;
  onChange: (path: string, value: unknown) => void;
}

const LiteralValueEditor: React.FC<LiteralValueEditorProps> = ({ field, onChange }) => {
  const fieldId = fieldIdForPath(field.path);

  if (field.kind === 'boolean') {
    return (
      <label className="save-field-toggle" htmlFor={fieldId}>
        <input
          type="checkbox"
          id={fieldId}
          aria-label={`${field.path}: ${field.label}`}
          checked={field.value === true}
          onChange={(event) => onChange(field.path, event.target.checked)}
        />
        <span>{field.value === true ? 'true' : 'false'}</span>
      </label>
    );
  }

  if (field.kind === 'number') {
    return <NumberValueEditor field={field} onChange={onChange} />;
  }

  if (field.kind === 'null') {
    return <JsonLiteralEditor field={field} onChange={onChange} />;
  }

  const stringValue = typeof field.value === 'string' ? field.value : '';
  const isLongText = stringValue.length > 96 || stringValue.includes('\n');

  if (isLongText) {
    return (
      <textarea
        id={fieldId}
        aria-label={`${field.path}: ${field.label}`}
        rows={4}
        value={stringValue}
        onChange={(event) => onChange(field.path, event.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      id={fieldId}
      aria-label={`${field.path}: ${field.label}`}
      value={stringValue}
      onChange={(event) => onChange(field.path, event.target.value)}
    />
  );
};

const NumberValueEditor: React.FC<LiteralValueEditorProps> = ({ field, onChange }) => {
  const fieldId = fieldIdForPath(field.path);
  const numericValue = typeof field.value === 'number' ? field.value : Number.NaN;
  const [draft, setDraft] = useState(() => formatNumberDraft(numericValue));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(formatNumberDraft(numericValue));
    setError(null);
  }, [numericValue]);

  return (
    <>
      <input
        type="text"
        inputMode="decimal"
        id={fieldId}
        aria-label={`${field.path}: ${field.label}`}
        value={draft}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);
          const parsed = parseNumberDraft(nextDraft);

          if (parsed === undefined) {
            setError('Enter a valid number or Infinity.');
            return;
          }

          setError(null);
          onChange(field.path, parsed);
        }}
      />
      {error ? <span className="field-error-message" role="alert">{error}</span> : null}
    </>
  );
};

const JsonLiteralEditor: React.FC<LiteralValueEditorProps> = ({ field, onChange }) => {
  const fieldId = fieldIdForPath(field.path);
  const serializedValue = JSON.stringify(field.value);
  const [draft, setDraft] = useState(serializedValue ?? 'null');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(serializedValue ?? 'null');
    setError(null);
  }, [serializedValue]);

  return (
    <>
      <textarea
        id={fieldId}
        aria-label={`${field.path}: ${field.label}`}
        rows={3}
        value={draft}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);

          try {
            const parsed = JSON.parse(nextDraft) as unknown;
            setError(null);
            onChange(field.path, parsed);
          } catch {
            setError('Enter valid JSON.');
          }
        }}
      />
      {error ? <span className="field-error-message" role="alert">{error}</span> : null}
    </>
  );
};

interface DiscoveredFieldCardProps {
  field: DiscoveredSaveField;
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}

const DiscoveredFieldCard: React.FC<DiscoveredFieldCardProps> = ({
  field,
  onChange,
  renderValidationIndicator,
}) => {
  const fieldId = fieldIdForPath(field.path);
  const composite = isCompositeSaveField(field);

  return (
    <div className="form-group save-field-card" data-field-path={field.path}>
      <div className="save-field-card__meta">
        <code>{field.path}</code>
        <span className={`save-field-card__badge ${field.registered ? 'registered' : 'discovered'}`}>
          {field.registered ? 'Defined' : 'Discovered'} · {getDiscoveredFieldKindLabel(field.kind)}
        </span>
        <span className="save-field-card__domain">{field.group}</span>
      </div>

      {composite ? (
        <JsonTextareaField
          id={fieldId}
          label={field.label}
          ariaLabel={`${field.path}: ${field.label}`}
          value={field.value as Record<string, unknown> | unknown[]}
          onChange={(value) => onChange(field.path, value)}
          expectation={field.kind === 'array' ? 'array' : 'object'}
          rows={4}
          stringifySpace={2}
          fallbackValue={field.kind === 'array' ? [] : {}}
        />
      ) : (
        <div className="save-field-card__control">
          <label htmlFor={fieldId}>{field.label}</label>
          <LiteralValueEditor field={field} onChange={onChange} />
        </div>
      )}

      <span className="save-field-card__description">
        {field.description}
      </span>
      {renderValidationIndicator(field.path)}
    </div>
  );
};

const filterOptions: Array<{ value: ExplorerFilter; label: string }> = [
  { value: 'unmodeled', label: 'Discovered only' },
  { value: 'all', label: 'All values' },
  { value: 'registered', label: 'Defined only' },
  { value: 'number', label: 'Numbers' },
  { value: 'boolean', label: 'Booleans' },
  { value: 'string', label: 'Strings' },
  { value: 'container', label: 'Objects and arrays' },
  { value: 'null', label: 'Null values' },
];

const matchesFilter = (field: DiscoveredSaveField, filter: ExplorerFilter): boolean => {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'unmodeled') {
    return !field.registered;
  }

  if (filter === 'registered') {
    return field.registered;
  }

  if (filter === 'container') {
    return isCompositeSaveField(field);
  }

  return field.kind === filter;
};

const SaveFieldExplorerSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const data = saveData as unknown as SaveObject;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ExplorerFilter>('unmodeled');
  const [group, setGroup] = useState('all');
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  const fields = useMemo(
    () => collectDiscoveredSaveFields(data, saveType),
    [data, saveType],
  );

  const groups = useMemo(() => {
    return [...new Set(fields.map((field) => field.group))].sort((left, right) => left.localeCompare(right));
  }, [fields]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      if (!matchesFilter(field, filter) || (group !== 'all' && field.group !== group)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableValue = typeof field.value === 'string' || typeof field.value === 'number'
        || typeof field.value === 'boolean'
        ? String(field.value)
        : '';

      return `${field.path} ${field.label} ${field.group} ${searchableValue}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [fields, filter, group, normalizedQuery]);

  const unmodeledCount = fields.filter((field) => !field.registered).length;
  const visibleFields = filteredFields.slice(0, visibleLimit);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [filter, group, normalizedQuery]);

  return (
    <div className="section-pane active" id="all-fields">
      <div className="section-content">
        <h3>All save values</h3>
        <p className="section-shell-description">
          Every value found in the loaded document is available here. Dedicated controls remain in the other sections;
          this explorer covers the fields that do not yet have a specialized definition.
        </p>

        <div className="save-field-explorer__toolbar" role="search" aria-label="Search all save values">
          <div className="save-field-explorer__search">
            <label htmlFor="save-field-search">Find a path or value</label>
            <input
              type="search"
              id="save-field-search"
              value={query}
              placeholder="e.g. automator, milestoneGlow, recentRealities"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="save-field-explorer__select">
            <label htmlFor="save-field-filter">Show</label>
            <select
              id="save-field-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value as ExplorerFilter)}
            >
              {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>

          <div className="save-field-explorer__select">
            <label htmlFor="save-field-group">Domain</label>
            <select id="save-field-group" value={group} onChange={(event) => setGroup(event.target.value)}>
              <option value="all">All domains</option>
              {groups.map((groupName) => <option key={groupName} value={groupName}>{groupName}</option>)}
            </select>
          </div>
        </div>

        <div className="save-field-explorer__summary" role="status" aria-live="polite">
          <strong>{fields.length}</strong> values detected · <strong>{unmodeledCount}</strong> discovered without a
          dedicated definition · showing <strong>{visibleFields.length}</strong> of <strong>{filteredFields.length}</strong>
        </div>

        {visibleFields.length > 0 ? (
          <div className="save-field-explorer__grid">
            {visibleFields.map((field) => (
              <DiscoveredFieldCard
                key={field.path}
                field={field}
                onChange={handleValueChange}
                renderValidationIndicator={renderValidationIndicator}
              />
            ))}
          </div>
        ) : (
          <div className="editor-empty-state" role="status">
            <h4>No matching values</h4>
            <p>Try another path, domain, or field type.</p>
          </div>
        )}

        {visibleFields.length < filteredFields.length ? (
          <button
            type="button"
            className="btn secondary save-field-explorer__load-more"
            onClick={() => setVisibleLimit((current) => current + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, filteredFields.length - visibleFields.length)} more
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SaveFieldExplorerSection;
