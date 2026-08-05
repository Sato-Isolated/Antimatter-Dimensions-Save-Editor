import { describe, expect, it } from 'vitest';
import androidFixture from '../../../../tests/fixtures/save/android.json';
import newsaveFixture from '../../../../tests/fixtures/save/newsave.json';
import { SaveObject, SaveType } from '../model';
import {
  automatorCommandDefinitions,
  automatorConstantDefinitions,
  automatorLimits,
  getAutomatorConstants,
  getAutomatorScripts,
  validateAutomatorSave,
} from './automator';

const asSaveObject = (value: unknown): SaveObject => value as SaveObject;

describe('Automator catalog and save contracts', () => {
  it('documents the command surface and upstream storage limits', () => {
    expect(automatorCommandDefinitions).toHaveLength(17);
    expect(new Set(automatorCommandDefinitions.map((command) => command.id)).size)
      .toBe(automatorCommandDefinitions.length);
    expect(automatorLimits).toMatchObject({
      maxScriptCount: 20,
      maxScriptCharacters: 10_000,
      maxTotalScriptCharacters: 60_000,
      maxScriptNameCharacters: 15,
      maxConstantCount: 30,
      maxConstantNameCharacters: 20,
      maxConstantValueCharacters: 250,
    });
  });

  it('gives the fixture constants readable meanings without changing their keys', () => {
    expect(automatorConstantDefinitions).toHaveLength(11);
    expect(new Set(automatorConstantDefinitions.map((definition) => definition.name)).size)
      .toBe(automatorConstantDefinitions.length);
    expect(automatorConstantDefinitions.every((definition) => definition.valueKind === 'time-study-list')).toBe(true);
    expect(automatorConstantDefinitions.find((definition) => definition.name === 'TSFirstDil')?.label)
      .toBe('First Dilation preset');
  });

  it('reads the PC object and Android array representations without losing script identity', () => {
    const pcScripts = getAutomatorScripts(asSaveObject(newsaveFixture));
    const androidScripts = getAutomatorScripts(asSaveObject(androidFixture));

    expect(pcScripts.map((script) => script.id)).toEqual([1, 2, 7, 8, 9]);
    expect(androidScripts.map((script) => script.id)).toEqual([2, 7, 8, 9]);
    expect(pcScripts.every((script) => script.contentPath.endsWith('.content'))).toBe(true);
    expect(androidScripts.every((script) => script.path.includes('['))).toBe(true);
  });

  it('uses the persisted constant order while keeping dynamic names', () => {
    const pcConstants = getAutomatorConstants(asSaveObject(newsaveFixture));
    const androidConstants = getAutomatorConstants(asSaveObject(androidFixture));

    expect(pcConstants[0]?.name).toBe('TSEarlyGame');
    expect(androidConstants[0]?.name).toBe('TSEarlyGame');
    expect(pcConstants).toHaveLength(11);
    expect(pcConstants.every((constant) => constant.path.startsWith('reality.automator.constants.'))).toBe(true);
    expect(pcConstants.find((constant) => constant.name === 'TSFull')?.definition.label)
      .toBe('Full Time Study tree preset');

    const customConstants = getAutomatorConstants(asSaveObject({
      reality: { automator: { constants: { threshold: '1e100' }, constantSortOrder: ['threshold'] } },
    }));
    expect(customConstants[0]?.definition.label).toBe('Custom Automator constant');
    expect(customConstants[0]?.definition.valueKind).toBe('custom');
  });

  it('accepts the reference PC and Android fixtures', () => {
    expect(validateAutomatorSave(asSaveObject(newsaveFixture), SaveType.PC)
      .filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(validateAutomatorSave(asSaveObject(androidFixture), SaveType.Android)
      .filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('keeps an unrecognized zero mode importable without rewriting it', () => {
    const issues = validateAutomatorSave(asSaveObject({
      reality: { automator: { state: { mode: 0 } } },
    }), SaveType.PC);

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'automator-mode',
        path: 'reality.automator.state.mode',
        severity: 'warning',
      }),
    ]);
  });

  it('blocks malformed scripts, constants, references, and execution metadata', () => {
    const invalidSave = asSaveObject({
      reality: {
        automator: {
          scripts: {
            first: { id: 1, name: 'x'.repeat(16), content: 'x'.repeat(10_001) },
            duplicate: { id: 1, name: 'ok', content: '' },
          },
          constants: { threshold: 42 },
          constantSortOrder: ['missing', 'missing'],
          state: { mode: 9, topLevelScript: 2, editorScript: 1, stack: {} },
          type: 2,
          currentInfoPane: 9,
        },
      },
    });

    const codes = new Set(validateAutomatorSave(invalidSave).map((issue) => issue.code));
    expect(validateAutomatorSave(invalidSave)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'automator-mode', severity: 'error' })]),
    );
    expect([...codes]).toEqual(expect.arrayContaining([
      'automator-script-id-duplicate',
      'automator-script-name-length',
      'automator-script-content-length',
      'automator-constant-value',
      'automator-constant-order-missing',
      'automator-constant-order-duplicate',
      'automator-mode',
      'automator-script-reference',
      'automator-stack-shape',
      'automator-editor-type',
      'automator-info-pane',
    ]));
  });
});
