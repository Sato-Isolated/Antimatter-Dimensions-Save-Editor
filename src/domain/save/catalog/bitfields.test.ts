import { describe, expect, it } from 'vitest';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import pcFixture from '../../../../tests/fixtures/save/pc.json';
import { getValueAtPath } from '../document/path';
import type { SaveObject } from '../model';
import {
  BITFIELD_MAX,
  NEWS_BITS_PER_SEGMENT,
  addAllKnownCollectionEntries,
  bitfieldCatalog,
  collectionCatalog,
  clearAllKnownBits,
  getBitfieldValue,
  getDuplicateCollectionEntries,
  getKnownBitDefinitions,
  getGlyphEffectDefinitions,
  getUnknownCollectionEntries,
  getUnknownSetBits,
  hasCollectionEntry,
  removeAllKnownCollectionEntries,
  setAllKnownBits,
  setAllKnownSegmentBits,
  setBitfieldBit,
  setCollectionEntry,
  setSegmentBit,
  validateBitfieldCollections,
} from './bitfields';

const findBitfield = (id: string) => {
  const definition = bitfieldCatalog.find((entry) => entry.id === id);
  if (!definition) throw new Error(`Missing bitfield catalog entry ${id}`);
  return definition;
};

const findCollection = (id: string) => {
  const definition = collectionCatalog.find((entry) => entry.id === id);
  if (!definition) throw new Error(`Missing collection catalog entry ${id}`);
  return definition;
};

describe('upstream bitfield operations', () => {
  it('reads and toggles individual positive bits without accepting invalid masks', () => {
    expect(getBitfieldValue(5, 0)).toBe(true);
    expect(getBitfieldValue(5, 2)).toBe(true);
    expect(getBitfieldValue(5, 1)).toBe(false);
    expect(setBitfieldBit(4, 0, true)).toBe(5);
    expect(setBitfieldBit(5, 0, false)).toBe(4);
    expect(setBitfieldBit(Number.NaN, 0, true)).toBe(Number.NaN);
    expect(setBitfieldBit(-1, 0, true)).toBe(-1);
    expect(setBitfieldBit(BITFIELD_MAX, 31, true)).toBe(BITFIELD_MAX);
  });

  it('sets and clears known bits while preserving an unknown high bit', () => {
    const known = [{ bit: 0, label: 'known 0', description: '' }, { bit: 4, label: 'known 4', description: '' }];
    const unknownBit = 1 << 30;
    const completed = setAllKnownBits(unknownBit, known);

    expect(completed).toBe(unknownBit | 1 | 16);
    expect(getUnknownSetBits(completed, known)).toEqual([30]);
    expect(clearAllKnownBits(completed, known)).toBe(unknownBit);
  });

  it('edits one segment without rewriting other segments or unknown bits', () => {
    const unknownBit = 1 << 30;
    const original = [unknownBit, 8];
    const changed = setSegmentBit(original, 0, 0, true);
    const filled = setAllKnownSegmentBits(changed, 1, [{ bit: 1, label: 'known', description: '' }]);

    expect(changed).toEqual([unknownBit | 1, 8]);
    expect(filled).toEqual([unknownBit | 1, 10]);
  });

  it('preserves unknown collection entries when changing known entries', () => {
    const definition = findCollection('infinityUpgrades');
    const original = ['futureUpgrade', 'timeMult', 'timeMult'];

    expect(definition.entries.find((entry) => entry.value === 'timeMult')).toMatchObject({
      label: 'Time played multiplier',
    });
    expect(definition.entries.find((entry) => entry.value === 'postGalaxy')).toMatchObject({
      label: 'Post-Break Galaxy strength',
    });
    expect(hasCollectionEntry(original, 'timeMult')).toBe(true);
    expect(addAllKnownCollectionEntries(original, definition.entries)).toContain('futureUpgrade');
    expect(removeAllKnownCollectionEntries(original, definition.entries)).toEqual(['futureUpgrade']);
    expect(setCollectionEntry(original, 'timeMult', false)).toEqual(['futureUpgrade']);
    expect(getUnknownCollectionEntries(original, definition)).toEqual(['futureUpgrade']);
    expect(getDuplicateCollectionEntries(original)).toEqual(['timeMult']);
  });
});

describe('upstream catalog and validation', () => {
  it('covers the two PC fixture generations and their Set-backed paths', () => {
    const saves = [pcFixture, newsaveFixture] as unknown as SaveObject[];
    for (const definition of bitfieldCatalog) {
      expect(saves.some((save) => getValueAtPath(save, definition.path) !== undefined), definition.path).toBe(true);
    }
    for (const definition of collectionCatalog) {
      expect(saves.some((save) => getValueAtPath(save, definition.path) !== undefined), definition.path).toBe(true);
    }

    expect(findBitfield('achievementBits').segmentCount).toBe(18);
    expect(getKnownBitDefinitions(findBitfield('achievementBits'), 17)).toHaveLength(8);
    expect(getKnownBitDefinitions(findBitfield('secretAchievementBits'), 3)).toHaveLength(8);
  });

  it('keeps the 31-bit news convention and contextual glyph definitions', () => {
    const news = findBitfield('newsSeen');
    expect(news.width).toBe(NEWS_BITS_PER_SEGMENT);
    expect(getKnownBitDefinitions(news, 0, 'a')).toHaveLength(30);
    expect(getKnownBitDefinitions(news, 0, 'future')).toEqual([]);
    expect(getGlyphEffectDefinitions('time')).not.toEqual(getGlyphEffectDefinitions('power'));
    expect(getGlyphEffectDefinitions('time').some((entry) => entry.label === 'Time Dimension power')).toBe(true);
  });

  it('blocks malformed masks and collection entries but only warns for duplicates', () => {
    const invalidMasks = [
      { achievementBits: [Number.NaN] },
      { challenge: { normal: { completedBits: -1 } } },
      { challenge: { infinity: { completedBits: 1.5 } } },
      { news: { seen: { a: [BITFIELD_MAX + 1] } } },
      { news: { seen: { a: 'not-an-array' } } },
    ];

    for (const save of invalidMasks) {
      expect(validateBitfieldCollections(save as SaveObject).some((issue) => issue.severity === 'error')).toBe(true);
    }

    const invalidCollection = validateBitfieldCollections({
      infinityUpgrades: ['timeMult', 42],
    } as SaveObject);
    expect(invalidCollection).toContainEqual(expect.objectContaining({ code: 'invalid-collection-entry', severity: 'error' }));

    const duplicateCollection = validateBitfieldCollections({
      infinityUpgrades: ['timeMult', 'timeMult', 'futureUpgrade'],
    } as SaveObject);
    expect(duplicateCollection).toContainEqual(expect.objectContaining({ code: 'duplicate-collection-entry', severity: 'warning' }));
    expect(duplicateCollection.some((issue) => issue.severity === 'error')).toBe(false);
  });
});
