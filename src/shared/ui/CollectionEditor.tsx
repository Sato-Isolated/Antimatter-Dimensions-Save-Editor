import React, { useEffect, useState } from 'react';
import {
  addAllKnownCollectionEntries,
  CollectionCatalogEntry,
  getDuplicateCollectionEntries,
  getUnknownCollectionEntries,
  removeAllKnownCollectionEntries,
  setCollectionEntry,
} from '../../domain/save/catalog/bitfields';
import { parseEditorJson, stringifyEditorJson } from '../../domain/save/transport/editorJsonCodec';

interface CollectionEditorProps {
  definition: CollectionCatalogEntry;
  path?: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}

const asCollection = (value: unknown): Array<string | number> => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string | number => typeof entry === 'string' || typeof entry === 'number');
  }

  if (value instanceof Set) {
    return [...value].filter((entry): entry is string | number => typeof entry === 'string' || typeof entry === 'number');
  }

  return [];
};

const CollectionEditor: React.FC<CollectionEditorProps> = ({
  definition,
  path,
  value,
  onChange,
  renderValidationIndicator,
}) => {
  const targetPath = path ?? definition.path;
  const entries = asCollection(value);
  const serializedEntries = stringifyEditorJson(entries, 2);
  const [rawDraft, setRawDraft] = useState(serializedEntries);
  const unknownEntries = getUnknownCollectionEntries(entries, definition);
  const duplicateEntries = getDuplicateCollectionEntries(entries);

  useEffect(() => {
    setRawDraft(serializedEntries);
  }, [serializedEntries]);

  const updateRaw = (): void => {
    try {
      const parsed: unknown = parseEditorJson(rawDraft);
      if (Array.isArray(parsed)) onChange(targetPath, parsed);
    } catch {
      // Keep the draft visible while the validation layer reports malformed JSON.
    }
  };

  return (
    <article className="collection-card">
      <div className="bitfield-card__header">
        <div>
          <h4>{definition.label}</h4>
          <p>{definition.description}</p>
        </div>
        <code className="bitfield-card__path">{targetPath}</code>
      </div>

      <div className="collection-card__actions">
        <button type="button" className="button secondary" onClick={() => onChange(targetPath, addAllKnownCollectionEntries(entries, definition.entries))}>
          Add known
        </button>
        <button type="button" className="button secondary" onClick={() => onChange(targetPath, removeAllKnownCollectionEntries(entries, definition.entries))}>
          Remove known
        </button>
      </div>

      <div className="collection-options">
        {definition.entries.map((entry) => (
          <label className="collection-option" key={`${typeof entry.value}-${String(entry.value)}`}>
            <input
              type="checkbox"
              checked={entries.some((valueEntry) => valueEntry === entry.value)}
              onChange={(event) => onChange(targetPath, setCollectionEntry(entries, entry.value, event.target.checked))}
            />
            <span>
              <strong>{entry.label}</strong>
              <small>{String(entry.value)}</small>
              <em>{entry.description}</em>
            </span>
          </label>
        ))}
      </div>

      <div className="collection-card__unknown">
        <strong>Unknown entries preserved</strong>
        {unknownEntries.length > 0 ? (
          <code>{unknownEntries.map((entry) => String(entry)).join(', ')}</code>
        ) : (
          <span>No unknown entries detected.</span>
        )}
      </div>
      {duplicateEntries.length > 0 && <p className="bitfield-card__note">Duplicates are warnings and remain untouched: {duplicateEntries.join(', ')}.</p>}

      <label className="collection-card__raw">
        JSON array
        <textarea value={rawDraft} onChange={(event) => setRawDraft(event.target.value)} onBlur={updateRaw} rows={4} />
      </label>
      {renderValidationIndicator(targetPath)}
    </article>
  );
};

export default CollectionEditor;
