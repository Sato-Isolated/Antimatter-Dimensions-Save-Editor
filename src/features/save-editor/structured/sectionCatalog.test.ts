import { describe, expect, it } from 'vitest';
import {
  structuredSectionCatalog,
  structuredSectionGroups,
} from './sectionCatalog';
import { bitfieldCatalog, collectionCatalog } from '../../../domain/save/catalog/bitfields';

describe('structured section catalog', () => {
  it('keeps section ids, groups, and issue routing declarative and unique', () => {
    const ids = structuredSectionCatalog.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(structuredSectionCatalog).toHaveLength(17);
    expect(structuredSectionCatalog.every((section) => structuredSectionGroups.includes(section.group))).toBe(true);
    expect(structuredSectionCatalog.every((section) => section.issuePrefixes.length > 0)).toBe(true);
    expect(structuredSectionGroups.every((group) => structuredSectionCatalog.some((section) => section.group === group))).toBe(true);
  });

  it('keeps the all-values explorer as the final catch-all route', () => {
    const lastSection = structuredSectionCatalog.at(-1);

    expect(lastSection?.id).toBe('all-fields');
    expect(lastSection?.issuePrefixes).toEqual(['*']);
  });

  it('does not route dedicated catalog values back to the raw Systems section', () => {
    const systemsSection = structuredSectionCatalog.find((section) => section.id === 'bits-collections');
    const dedicatedPaths = [
      ...bitfieldCatalog.filter((entry) => entry.dedicatedSectionId).map((entry) => entry.path),
      ...collectionCatalog.filter((entry) => entry.dedicatedSectionId).map((entry) => entry.path),
    ];

    expect(systemsSection).toBeDefined();
    expect(dedicatedPaths.every((path) => !systemsSection?.issuePrefixes.includes(path))).toBe(true);
  });
});
