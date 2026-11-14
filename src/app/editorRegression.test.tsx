// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { SaveObject } from '../domain/save/model';
import { decodeSaveString, encodeSaveData } from '../domain/save/transport/codec';
import { parseEditorJson } from '../domain/save/transport/editorJsonCodec';

const save: SaveObject = {
  antimatter: '10', matter: '0', dimensionBoosts: 0, galaxies: 0, break: false,
  version: 14, lastUpdate: 1700000000000, records: { totalAntimatter: '10' },
  dimensions: { antimatter: [{ amount: '1' }] },
};
let root: Root;
let container: HTMLDivElement;

const namedControl = (name: string): HTMLInputElement | HTMLTextAreaElement => {
  const labelled = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[aria-label='${name}']`);
  if (labelled) return labelled;
  const label = [...document.querySelectorAll('label')].find((element) => element.textContent === name);
  const control = label && document.getElementById(label.htmlFor);
  if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) throw new Error(`Missing control: ${name}`);
  return control;
};
const click = async (name: string, role = 'button') => {
  const elements = role === 'button' ? document.querySelectorAll('button') : document.querySelectorAll(`[role='${role}']`);
  const control = [...elements].find((element) => (element.getAttribute('aria-label') ?? element.querySelector('.export-full')?.textContent ?? element.textContent?.trim()) === name);
  if (!(control instanceof HTMLElement)) throw new Error(`Missing ${role}: ${name}`);
  await act(async () => control.click());
};
const fill = async (control: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  await act(async () => {
    const prototype = control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(control, value);
    control.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
const key = async (control: HTMLElement, key: string, modifiers: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...modifiers });
  await act(async () => { control.dispatchEvent(event); });
  return event;
};
const open = async (data: SaveObject = save) => {
  await act(async () => root.render(<App />));
  await fill(namedControl('Encrypted save'), encodeSaveData(data)!);
  await click('Open editor');
};
const openJson = async () => {
  await click('JSON', 'tab');
  await vi.waitFor(async () => {
    await act(async () => {});
    expect(Boolean(document.querySelector('[aria-label="Full save document JSON"]'))).toBe(true);
  });
};
const exportDocument = async (): Promise<SaveObject> => {
  await click('Export save');
  const output = document.getElementById('encrypted-output') as HTMLTextAreaElement;
  expect(Boolean(output)).toBe(true);
  return decodeSaveString(output.value).data!;
};

beforeAll(async () => { await import('../features/save-editor/json/JsonEditor'); });

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('save editor interaction regressions', () => {
  it('reports malformed recent records without changing the save or crashing', async () => {
    await open({ ...save, records: { recentInfinities: [42] } });
    const records = document.querySelector<HTMLButtonElement>('.section-navigation button[aria-label^="Records"]')!;
    await act(async () => records.click());
    await click('Recent Games');
    await click('Clear Recent Infinities');
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('Your save was not changed');
    expect((await exportDocument()).records).toEqual({ recentInfinities: [42] });
  });
  it('applies the latest draft before the delayed parser runs', async () => {
    await open(); await openJson(); vi.useFakeTimers();
    const editor = namedControl('Full save document JSON');
    await fill(editor, JSON.stringify({ ...save, antimatter: '99' }));
    await key(editor, 's', { ctrlKey: true });
    expect(parseEditorJson<SaveObject>(editor.value).antimatter).toBe('99');
    expect((await exportDocument()).antimatter).toBe('99');
  });

  it('formats current text and refuses to apply invalid text during the parse delay', async () => {
    await open(); await openJson(); vi.useFakeTimers();
    const editor = namedControl('Full save document JSON');
    await fill(editor, JSON.stringify({ ...save, antimatter: '88' }));
    await key(editor, 'f', { ctrlKey: true, shiftKey: true });
    expect(parseEditorJson<SaveObject>(editor.value).antimatter).toBe('88');
    expect(editor.value.includes('\n')).toBe(true);
    await fill(editor, '{ invalid');
    await key(editor, 's', { ctrlKey: true });
    expect(editor.value).toBe('{ invalid');
    expect(document.querySelector('[aria-label="Full save document JSON"]')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('protects an unapplied draft when importing or exporting, including after switching modes', async () => {
    await open(); await openJson();
    await fill(namedControl('Full save document JSON'), JSON.stringify({ ...save, antimatter: '42' }));
    await click('Structured', 'tab');
    await click('Import another save');
    expect(document.querySelector('[role="dialog"] h2')?.textContent).toBe('Discard changes?');
    await click('Cancel');
    await click('Export save');
    expect(Boolean(document.getElementById('encrypted-output'))).toBe(false);
    expect(parseEditorJson<SaveObject>(namedControl('Full save document JSON').value).antimatter).toBe('42');
    await click('Reset');
    expect(document.querySelector('.editor-validation-alert')).toBe(null);
    await click('Import another save');
    expect(Boolean(document.querySelector('[role="dialog"]'))).toBe(false);
    expect(document.querySelector('h1')?.textContent).toBe('Import a save');
  });

  it('leaves Tab and Shift+Tab to native focus navigation without editing the draft', async () => {
    await open(); await openJson();
    const editor = namedControl('Full save document JSON');
    const before = editor.value;
    expect((await key(editor, 'Tab')).defaultPrevented).toBe(false);
    expect((await key(editor, 'Tab', { shiftKey: true })).defaultPrevented).toBe(false);
    expect(editor.value === before).toBe(true);
  });

  it.each([10, Infinity])('displays and exports numeric PC large-number edits from %s', async (value) => {
    await open({ ...save, antimatter: value });
    const input = namedControl('Antimatter');
    expect(input.value).toBe(String(value));
    await fill(input, '20'); await key(input, 'Enter');
    expect((await exportDocument()).antimatter).toBe(20);
  });

  it('exports Infinity as a number and preserves huge numeric text without overflow', async () => {
    await open();
    const input = namedControl('Antimatter');
    await fill(input, 'Infinity'); await key(input, 'Enter');
    expect((await exportDocument()).antimatter).toBe(Infinity);
    await click('Close');
    await fill(input, '1e1500'); await key(input, 'Enter');
    expect((await exportDocument()).antimatter).toBe('1e1500');
  });
});
