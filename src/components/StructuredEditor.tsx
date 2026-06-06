import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaAtom,
  FaCircleNotch,
  FaClone,
  FaCog,
  FaCube,
  FaExpand,
  FaGem,
  FaHistory,
  FaHourglassHalf,
  FaInfinity,
  FaRobot,
  FaStar,
  FaSun,
  FaTrophy,
} from 'react-icons/fa';
import { useSave, useSaveSelector } from '../contexts/SaveContext';
import { tokenizeDocumentPath } from '../core/document/path';
import { SaveValidationIssue } from '../core/save/types';
import {
  AutoBuyersSection,
  BlackHolesSection,
  CelestialsSection,
  ChallengesSection,
  DilationSection,
  DimensionsSection,
  EternitySection,
  GeneralSection,
  GlyphsSection,
  InfinitySection,
  RealitySection,
  RecordsSection,
  ReplicantiSection,
  SectionProps,
  SettingsSection,
} from './sections';

interface StructuredEditorProps {
  isActive: boolean;
}

interface StructuredSectionDefinition {
  id: string;
  group: 'Progression' | 'Systems' | 'History & options';
  title: string;
  description: string;
  Component: React.ComponentType<SectionProps>;
  issuePrefixes: string[];
  Icon: IconType;
}

const structuredSectionGroups: Array<StructuredSectionDefinition['group']> = [
  'Progression',
  'Systems',
  'History & options',
];

const structuredSections: StructuredSectionDefinition[] = [
  {
    id: 'general',
    group: 'Progression',
    title: 'General',
    description: 'Core progression, currencies, and top-level save values.',
    Component: GeneralSection,
    Icon: FaAtom,
    issuePrefixes: [
      'antimatter',
      'matter',
      'buyUntil10',
      'break',
      'brake',
      'dimensionBoosts',
      'galaxies',
      'sacrificed',
      'version',
      'partInfinityPoint',
      'partInfinitied',
      'totalTickGained',
      'totalTickBought',
    ],
  },
  {
    id: 'dimensions',
    group: 'Progression',
    title: 'Dimensions',
    description: 'Antimatter, Infinity, Time, Eternity, and Reality dimensions.',
    Component: DimensionsSection,
    Icon: FaCube,
    issuePrefixes: [
      'dimensions.antimatter',
      'dimensions.infinity',
      'dimensions.time',
      'eternityDimensions',
      'realityDimensions',
    ],
  },
  {
    id: 'replicanti',
    group: 'Progression',
    title: 'Replicanti',
    description: 'Replicanti settings, upgrades, and galaxy growth.',
    Component: ReplicantiSection,
    Icon: FaClone,
    issuePrefixes: ['replicanti'],
  },
  {
    id: 'infinity',
    group: 'Progression',
    title: 'Infinity',
    description: 'Infinity resources, upgrades, and related progression.',
    Component: InfinitySection,
    Icon: FaInfinity,
    issuePrefixes: [
      'infinity',
      'infinityPoints',
      'infinities',
      'infinitiesBanked',
      'infinityPower',
      'IPMultPurchases',
      'infMult',
      'autoIP',
      'bestInfinityTime',
      'thisInfinityTime',
    ],
  },
  {
    id: 'eternity',
    group: 'Progression',
    title: 'Eternity',
    description: 'Eternity currencies, studies, and related progression.',
    Component: EternitySection,
    Icon: FaHourglassHalf,
    issuePrefixes: [
      'eternity',
      'eternityPoints',
      'eternities',
      'timeShards',
      'timeDimension',
      'timestudy',
    ],
  },
  {
    id: 'dilation',
    group: 'Progression',
    title: 'Dilation',
    description: 'Time dilation resources, upgrades, and rebuyables.',
    Component: DilationSection,
    Icon: FaExpand,
    issuePrefixes: ['dilation', 'dilatedTime', 'tachyonParticles'],
  },
  {
    id: 'reality',
    group: 'Progression',
    title: 'Reality',
    description: 'Reality progression, machines, and automator state.',
    Component: RealitySection,
    Icon: FaSun,
    issuePrefixes: ['realities', 'partSimulatedReality', 'reality'],
  },
  {
    id: 'glyphs',
    group: 'Systems',
    title: 'Glyphs',
    description: 'Glyph inventory, filter state, and sacrifice progress.',
    Component: GlyphsSection,
    Icon: FaGem,
    issuePrefixes: ['glyphs', 'reality.glyphs', 'sac'],
  },
  {
    id: 'celestials',
    group: 'Systems',
    title: 'Celestials',
    description: 'Celestial progression, unlocks, and run-specific data.',
    Component: CelestialsSection,
    Icon: FaStar,
    issuePrefixes: ['celestials'],
  },
  {
    id: 'black-holes',
    group: 'Systems',
    title: 'Black Holes',
    description: 'Black hole upgrades, intervals, and state.',
    Component: BlackHolesSection,
    Icon: FaCircleNotch,
    issuePrefixes: ['blackHole', 'blackHolePause', 'reality.blackHoleBits'],
  },
  {
    id: 'challenges',
    group: 'Systems',
    title: 'Challenges',
    description: 'Normal, Infinity, Eternity, and Reality challenge state.',
    Component: ChallengesSection,
    Icon: FaTrophy,
    issuePrefixes: ['challenge', 'challenges'],
  },
  {
    id: 'autobuyers',
    group: 'Systems',
    title: 'Autobuyers',
    description: 'Automation toggles, intervals, and purchase settings.',
    Component: AutoBuyersSection,
    Icon: FaRobot,
    issuePrefixes: ['auto', 'autobuyer'],
  },
  {
    id: 'records',
    group: 'History & options',
    title: 'Records',
    description: 'Timers, best runs, and historical milestone records.',
    Component: RecordsSection,
    Icon: FaHistory,
    issuePrefixes: ['records', 'lastTen', 'best'],
  },
  {
    id: 'settings',
    group: 'History & options',
    title: 'Settings',
    description: 'Options, confirmations, UI preferences, and toggles.',
    Component: SettingsSection,
    Icon: FaCog,
    issuePrefixes: ['options'],
  },
];

const severityClassByIssue = (issues: SaveValidationIssue[]): string => {
  if (issues.some((issue) => issue.severity === 'error')) {
    return 'danger';
  }

  if (issues.length > 0) {
    return 'warning';
  }

  return 'success';
};

const arePathsRelated = (leftPath: string, rightPath: string): boolean => {
  if (!leftPath || !rightPath) {
    return leftPath === rightPath;
  }

  if (leftPath === rightPath) {
    return true;
  }

  const leftTokens = tokenizeDocumentPath(leftPath);
  const rightTokens = tokenizeDocumentPath(rightPath);
  const sharedLength = Math.min(leftTokens.length, rightTokens.length);

  if (sharedLength === 0) {
    return false;
  }

  for (let index = 0; index < sharedLength; index += 1) {
    if (leftTokens[index] !== rightTokens[index]) {
      return false;
    }
  }

  return true;
};

const matchesIssuePrefix = (issuePath: string | undefined, prefix: string): boolean => {
  if (!issuePath || !prefix) {
    return false;
  }

  return arePathsRelated(issuePath, prefix);
};

const sanitizePathForId = (path: string): string => {
  return path.replace(/[^a-zA-Z0-9_-]+/g, '-');
};

const FIELD_LABEL_ID_PREFIX = 'field-label-';
const LEGACY_VALIDATION_ID_PREFIX = 'legacy-validation-';

const updateDescribedBy = (control: HTMLElement, validationId: string | null): void => {
  const existing = (control.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !token.startsWith(LEGACY_VALIDATION_ID_PREFIX));

  if (validationId) {
    existing.push(validationId);
  }

  if (existing.length > 0) {
    control.setAttribute('aria-describedby', existing.join(' '));
    return;
  }

  control.removeAttribute('aria-describedby');
};

const StructuredEditor: React.FC<StructuredEditorProps> = ({ isActive }) => {
  const panelId = useId();
  const { isLoaded, modifiedSaveData, saveType, updateSaveData } = useSave();
  const document = useSaveSelector((state) => state.document);
  const panelRef = useRef<HTMLElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>(structuredSections[0].id);

  useEffect(() => {
    if (!structuredSections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(structuredSections[0].id);
    }
  }, [activeSectionId]);

  const validationIssues = useMemo(() => document?.validation.issues ?? [], [document]);

  const sectionIssues = useMemo(() => {
    return structuredSections.reduce<Record<string, SaveValidationIssue[]>>((accumulator, section) => {
      accumulator[section.id] = validationIssues.filter((issue) => {
        return section.issuePrefixes.some((prefix) => matchesIssuePrefix(issue.path, prefix));
      });

      return accumulator;
    }, {});
  }, [validationIssues]);

  const groupedSections = useMemo(() => {
    return structuredSectionGroups.map((group) => ({
      group,
      sections: structuredSections.filter((section) => section.group === group),
    }));
  }, []);

  const renderValidationIndicator = useMemo(() => {
    return (path: string): React.ReactNode => {
      const matchingIssues = validationIssues.filter((issue) => {
        if (!issue.path) {
          return false;
        }

        return arePathsRelated(issue.path, path);
      });

      if (matchingIssues.length === 0) {
        return null;
      }

      const severityClass = severityClassByIssue(matchingIssues);
      const title = matchingIssues.map((issue) => issue.message).join('\n');
      const label = matchingIssues.some((issue) => issue.severity === 'error')
        ? `${matchingIssues.length} validation error${matchingIssues.length === 1 ? '' : 's'}`
        : `${matchingIssues.length} validation warning${matchingIssues.length === 1 ? '' : 's'}`;
      const validationId = `${LEGACY_VALIDATION_ID_PREFIX}${sanitizePathForId(path)}`;

      return (
        <span
          id={validationId}
          className={`validation-indicator status-chip ${severityClass}`}
          title={title}
          aria-label={label}
          data-validation-id={validationId}
          data-validation-path={path}
        >
          {matchingIssues.length}
        </span>
      );
    };
  }, [validationIssues]);

  useEffect(() => {
    const panelElement = panelRef.current;
    if (!panelElement) {
      return;
    }

    const formGroups = panelElement.querySelectorAll<HTMLElement>('.form-group');

    formGroups.forEach((group, index) => {
      const label = group.querySelector<HTMLLabelElement>('label');
      const controls = Array.from(group.querySelectorAll<HTMLElement>('input, select, textarea'));
      const validationIndicator = group.querySelector<HTMLElement>('[data-validation-id]');

      if (label) {
        if (!label.id) {
          label.id = `${FIELD_LABEL_ID_PREFIX}${activeSectionId}-${index}`;
        }
      }

      const compositeGroups = Array.from(group.querySelectorAll<HTMLElement>('.big-number-input[role="group"]'));

      compositeGroups.forEach((compositeGroup) => {
        if (label && !compositeGroup.getAttribute('aria-labelledby')) {
          compositeGroup.setAttribute('aria-labelledby', label.id);
        }
      });

      controls.forEach((control) => {
        const validationId = validationIndicator?.getAttribute('data-validation-id') ?? null;
        const isInsideCompositeGroup = Boolean(control.closest('.big-number-input[role="group"]'));

        if (label?.htmlFor && controls.length === 1 && !control.id) {
          control.id = label.htmlFor;
        }

        if (label && !isInsideCompositeGroup && !control.getAttribute('aria-labelledby') && !control.getAttribute('aria-label')) {
          control.setAttribute('aria-labelledby', label.id);
        }

        updateDescribedBy(control, validationId);

        if (validationId) {
          control.setAttribute('aria-invalid', 'true');
          return;
        }

        control.removeAttribute('aria-invalid');
      });
    });
  }, [activeSectionId, modifiedSaveData, validationIssues]);

  const activeSection = structuredSections.find((section) => section.id === activeSectionId) ?? structuredSections[0];
  const activeSectionIssueCount = sectionIssues[activeSection.id]?.length ?? 0;
  const ActiveSectionComponent = activeSection.Component;

  if (!isActive) {
    return null;
  }

  if (!isLoaded || !document || !modifiedSaveData) {
    return (
      <div className="editor-empty-state" role="status" aria-live="polite">
        <h3>Structured editor unavailable</h3>
        <p>Import and decode a PC or Android save to browse the historical editor sections.</p>
      </div>
    );
  }

  return (
    <div className="structured-editor" aria-label="Structured save editor">
      <div className="editor-sections">
        <nav className="section-nav" aria-label="Structured editor sections">
          <div className="section-nav-header">
            <h3>Sections</h3>
            <p>Choose a save area to edit against the current document store.</p>
          </div>

          {groupedSections.map(({ group, sections }) => (
            <section key={group} className="section-nav-group" aria-label={group}>
              <p className="section-nav-group-title">{group}</p>
              <div className="section-nav-list">
                {sections.map((section) => {
                  const isSelected = section.id === activeSection.id;
                  const issues = sectionIssues[section.id] ?? [];
                  const severityClass = issues.length > 0 ? severityClassByIssue(issues) : 'neutral';
                  const SectionIcon = section.Icon;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      id={`${panelId}-${section.id}-tab`}
                      className={`section-button ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveSectionId(section.id)}
                      aria-pressed={isSelected}
                      aria-label={issues.length > 0
                        ? `${section.title}, ${issues.length} issue${issues.length === 1 ? '' : 's'}`
                        : `${section.title}, no issues`}
                    >
                      <span className="section-button-label">
                        <SectionIcon className="section-button-icon" aria-hidden="true" />
                        <span>{section.title}</span>
                      </span>
                      {issues.length > 0 && (
                        <span className={`status-chip ${severityClass}`} aria-hidden="true">
                          {issues.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className="section-content">
          <section
            ref={panelRef}
            id={`${panelId}-${activeSection.id}-panel`}
            className="section-pane active"
            role="region"
            aria-labelledby={`${panelId}-${activeSection.id}-tab`}
          >
            <header className="structured-editor-toolbar">
              <div>
                <h2>{activeSection.title}</h2>
                <p>{activeSection.description}</p>
              </div>
              <div className="structured-editor-status" aria-label="Section validation status">
                <span className="status-chip neutral">Format: {saveType.toUpperCase()}</span>
                <span className={`status-chip ${activeSectionIssueCount > 0 ? severityClassByIssue(sectionIssues[activeSection.id] ?? []) : 'success'}`}>
                  {activeSectionIssueCount > 0
                    ? `${activeSectionIssueCount} issue${activeSectionIssueCount === 1 ? '' : 's'}`
                    : 'No issues'}
                </span>
              </div>
            </header>

            <ActiveSectionComponent
              saveData={modifiedSaveData}
              handleValueChange={updateSaveData}
              renderValidationIndicator={renderValidationIndicator}
              saveType={saveType}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default StructuredEditor;
