import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCodeBranch, FaEye, FaLayerGroup, FaList, FaStar } from 'react-icons/fa';
import { getValueAtPath } from '../../../../domain/save/document/path';
import BitfieldEditor, { BitfieldOptions, UnknownBits } from '../../../../shared/ui/BitfieldEditor';
import CollectionEditor from '../../../../shared/ui/CollectionEditor';
import {
  BitfieldCatalogEntry,
  bitfieldCatalog,
  collectionCatalog,
  getGlyphBitfieldTargets,
  getKnownBitDefinitions,
  getUnknownSetBits,
  setAllKnownBits,
  setAllKnownSegmentBits,
  setBitfieldBit,
  setSegmentBit,
  clearAllKnownBits,
  clearAllKnownSegmentBits,
  GlyphMaskTarget,
} from '../../../../domain/save/catalog/bitfields';
import { getFieldDefinition, resolveFieldPath } from '../../../../domain/save/catalog/fields';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import { SectionProps } from './types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const formatHex = (value: unknown): string =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 ? `0x${value.toString(16).toUpperCase()}` : '—';

const inputNumber = (event: React.ChangeEvent<HTMLInputElement>): number =>
  event.target.value === '' ? Number.NaN : Number(event.target.value);

interface SegmentedMaskEditorProps {
  definition: BitfieldCatalogEntry;
  path: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}

const SegmentedMaskEditor: React.FC<SegmentedMaskEditorProps> = ({ definition, path, value, onChange, renderValidationIndicator }) => {
  const isNewsMap = definition.shape === 'map';
  const segmentValues = Array.isArray(value) ? value : [];
  const mapValue = useMemo(() => (isRecord(value) ? value : {}), [value]);
  const categories = useMemo(() => {
    const existing = Object.keys(mapValue);
    return [...new Set(['a', 'ai', 'l', 'p', 'r', ...existing])];
  }, [mapValue]);
  const [category, setCategory] = useState(categories[0] ?? 'a');
  const [segment, setSegment] = useState(0);

  useEffect(() => {
    if (!categories.includes(category)) setCategory(categories[0] ?? 'a');
  }, [categories, category]);

  const count = isNewsMap
    ? Math.max(1, Array.isArray(mapValue[category]) ? mapValue[category].length : 1)
    : Math.max(definition.segmentCount ?? 1, segmentValues.length, 1);
  const selectedSegment = Math.min(segment, count - 1);
  const selectedValue = isNewsMap
    ? (Array.isArray(mapValue[category]) ? mapValue[category][selectedSegment] : undefined)
    : segmentValues[selectedSegment];
  const knownBits = getKnownBitDefinitions(definition, selectedSegment, isNewsMap ? category : undefined);
  const validValue = typeof selectedValue === 'number' && Number.isInteger(selectedValue) && selectedValue >= 0 ? selectedValue : 0;

  const updateSelected = (nextValue: number): void => {
    if (isNewsMap) {
      const nextMap: UnknownRecord = { ...mapValue };
      const nextSegments = Array.isArray(nextMap[category]) ? [...nextMap[category] as unknown[]] : [];
      nextSegments[selectedSegment] = nextValue;
      nextMap[category] = nextSegments;
      onChange(path, nextMap);
      return;
    }
    const nextSegments = Array.isArray(value) ? [...value] : [];
    nextSegments[selectedSegment] = nextValue;
    onChange(path, nextSegments);
  };

  const updateKnown = (activate: boolean): void => {
    if (isNewsMap) {
      updateSelected(activate ? setAllKnownBits(validValue, knownBits) : clearAllKnownBits(validValue, knownBits));
      return;
    }
    const nextSegments = activate
      ? setAllKnownSegmentBits(segmentValues.filter((entry): entry is number => typeof entry === 'number'), selectedSegment, knownBits)
      : clearAllKnownSegmentBits(segmentValues.filter((entry): entry is number => typeof entry === 'number'), selectedSegment, knownBits);
    onChange(path, nextSegments);
  };

  const updateBit = (bitIndex: number, enabled: boolean): void => {
    if (isNewsMap) {
      updateSelected(setBitfieldBit(validValue, bitIndex, enabled));
      return;
    }
    const source = segmentValues.every((entry) => typeof entry === 'number') ? segmentValues as number[] : [];
    onChange(path, setSegmentBit(source, selectedSegment, bitIndex, enabled));
  };

  const unknownBits = getUnknownSetBits(selectedValue, knownBits);

  return (
    <article className="bitfield-card">
      <div className="bitfield-card__header">
        <div>
          <h4>{definition.label}</h4>
          <p>{definition.description}</p>
        </div>
        <code className="bitfield-card__path">{path}</code>
      </div>

      <div className="bitfield-card__selectors">
        {isNewsMap && (
          <label>
            Category
            <select value={category} onChange={(event) => { setCategory(event.target.value); setSegment(0); }}>
              {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
            </select>
          </label>
        )}
        <label>
          Segment
          <select value={selectedSegment} onChange={(event) => setSegment(Number(event.target.value))}>
            {Array.from({ length: count }, (_, index) => <option key={index} value={index}>{index}</option>)}
          </select>
        </label>
      </div>

      <div className="bitfield-card__raw">
        <label>
          Raw decimal
          <input
            type="number"
            min="0"
            max="2147483647"
            step="1"
            value={typeof selectedValue === 'number' ? selectedValue : String(selectedValue ?? '')}
            onChange={(event) => updateSelected(inputNumber(event))}
          />
        </label>
        <div>
          <span>Hexadecimal</span>
          <code>{formatHex(selectedValue)}</code>
        </div>
      </div>
      {renderValidationIndicator(isNewsMap ? `${path}.${category}[${selectedSegment}]` : `${path}[${selectedSegment}]`)}
      <div className="bitfield-card__actions">
        <button type="button" className="button secondary" onClick={() => updateKnown(true)}>Complete known</button>
        <button type="button" className="button secondary" onClick={() => updateKnown(false)}>Clear known</button>
      </div>
      <BitfieldOptions value={selectedValue} knownBits={knownBits} onToggle={updateBit} />
      <UnknownBits bits={unknownBits} />
    </article>
  );
};

const GlyphMaskEditor: React.FC<{
  target: GlyphMaskTarget;
  onChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
}> = ({ target, onChange, renderValidationIndicator }) => (
  <BitfieldEditor
    path={target.path}
    label={`${target.label} (${target.glyphType})`}
    description={target.kind === 'effects' ? 'Upstream glyph effect mask; bits depend on the glyph type.' : 'Upstream specifiedMask for the glyph filter type.'}
    value={target.value}
    knownBits={target.knownBits}
    readOnly
    onChange={onChange}
    renderValidationIndicator={renderValidationIndicator}
  />
);

const sectionGroups = [
  { id: 'progression', label: 'Progression', icon: FaStar },
  { id: 'celestials', label: 'Celestials', icon: FaLayerGroup },
  { id: 'glyphs', label: 'Glyphs', icon: FaCodeBranch },
  { id: 'interface', label: 'Interface / news', icon: FaEye },
  { id: 'collections', label: 'Collections', icon: FaList },
] as const;

const BitsCollectionsSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeGroup, setActiveGroup] = useState<(typeof sectionGroups)[number]['id']>('progression');
  const saveRecord = saveData as unknown as SaveObject;
  const isPC = saveType === SaveType.PC;
  const resolveCatalogPath = useCallback(
    (entryId: string, declaredPath: string): string => {
      const field = getFieldDefinition(entryId);
      return field ? resolveFieldPath(saveRecord, field, saveType) : declaredPath;
    },
    [saveRecord, saveType],
  );
  const glyphTargets = useMemo(() => getGlyphBitfieldTargets(saveRecord), [saveRecord]);
  const bitfieldsByGroup = useMemo(
    () => bitfieldCatalog
      .filter((entry) => entry.section === activeGroup && !entry.dedicatedSectionId)
      .map((definition) => ({ definition, path: resolveCatalogPath(definition.id, definition.path) }))
      .filter(({ path }) => isPC || getValueAtPath(saveRecord, path) !== undefined),
    [activeGroup, isPC, resolveCatalogPath, saveRecord],
  );
  const collections = useMemo(
    () => collectionCatalog
      .filter((entry) => !entry.dedicatedSectionId)
      .map((definition) => ({ definition, path: resolveCatalogPath(definition.id, definition.path) }))
      .filter(({ path }) => isPC || getValueAtPath(saveRecord, path) !== undefined),
    [isPC, resolveCatalogPath, saveRecord],
  );

  return (
    <div className="section-pane active" id="bits-collections">
      <div className="section-content">
        <div className="section-shell-header">
          <h3>Bits &amp; collections</h3>
          <p className="section-shell-description">
            Snapshot upstream {"5409e320"} conventions. Raw values remain available, future bits and entries stay intact,
            and the editor never runs the game migrations.
          </p>
        </div>

        <nav className="section-subtabs" aria-label="Bits and collection groups">
          {sectionGroups.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className={activeGroup === id ? 'active' : ''} aria-pressed={activeGroup === id} onClick={() => setActiveGroup(id)}>
              <Icon className="subtab-icon" aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>

        <p className="field-description">
          Progression-owned masks and collections are edited in their dedicated sections (Infinity, Eternity,
          Dilation, Reality, Challenges, or Celestials). This catalog is the PC/Web superset; mobile saves show
          the subset of bitfields and collections they actually store, and unknown values remain available
          through All values and the JSON editor.
        </p>

        {activeGroup === 'collections' ? (
          collections.length > 0 ? (
            <div className="bits-collections-grid">
              {collections.map(({ definition, path }) => (
                <CollectionEditor
                  key={definition.id}
                  definition={definition}
                  path={path}
                  value={getValueAtPath(saveRecord, path)}
                  onChange={handleValueChange}
                  renderValidationIndicator={renderValidationIndicator}
                />
              ))}
            </div>
          ) : (
            <p className="editor-empty-state">This save has no values from this upstream group. Anything the mobile model stores under a different name remains available in All values and the JSON editor.</p>
          )
        ) : activeGroup === 'glyphs' ? (
          isPC ? (
            <div className="bits-collections-grid">
              {glyphTargets.length > 0 ? glyphTargets.map((target) => (
                <GlyphMaskEditor key={target.path} target={target} onChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} />
              )) : <p className="editor-empty-state">No active or inventory glyph mask is present in this save. Future glyph fields remain available in All values.</p>}
            </div>
          ) : (
            <p className="editor-empty-state">Mobile glyph effect masks use a wider bit layout than this 31-bit catalog, so they stay editable in All values and the JSON editor.</p>
          )
        ) : bitfieldsByGroup.length > 0 ? (
          <div className="bits-collections-grid">
            {bitfieldsByGroup.map(({ definition, path }) => {
              const value = getValueAtPath(saveRecord, path);
              if (definition.shape === 'number') {
                return <BitfieldEditor key={definition.id} path={path} label={definition.label} description={definition.description} value={value} knownBits={getKnownBitDefinitions(definition)} rawOnly={definition.rawOnly} onChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} />;
              }
              return <SegmentedMaskEditor key={definition.id} definition={definition} path={path} value={value} onChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} />;
            })}
          </div>
        ) : (
          <p className="editor-empty-state">This save has no values from this upstream group. Anything the mobile model stores under a different name remains available in All values and the JSON editor.</p>
        )}
      </div>
    </div>
  );
};

export default BitsCollectionsSection;
