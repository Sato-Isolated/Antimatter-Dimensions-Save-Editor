// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SaveType } from '../../../../domain/save/model';
import BigNumberField from '../../../../shared/ui/BigNumberField';
import JsonValueField from '../../../../shared/ui/JsonValueField';
import AutoBuyersSection from './AutoBuyersSection';
import GeneralSection from './GeneralSection';
import BlackHolesSection from './BlackHolesSection';
import InfinitySection from './InfinitySection';
import EternitySection from './EternitySection';
import { SectionProps } from './types';

let root: Root;
let container: HTMLDivElement;
const change = vi.fn();
const props: SectionProps = {
  saveData: { version: 9.5, blackHole: [{ phase: -0.25 }, { phase: -1.5 }],
    auto: { galaxy: { buyMaxInterval: 5 } } } as unknown as SectionProps['saveData'],
  saveType: SaveType.PC, handleValueChange: change, renderValidationIndicator: () => null,
};
const fill = async (input: HTMLInputElement, value: string) => {
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  change.mockClear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe('numeric editor regressions', () => {
  it.each([
    ['version', GeneralSection, 'version', '12.1', 12.1],
    ['black-hole-1-activations', BlackHolesSection, 'blackHole[0].activations', '1e3', 1000],
    ['black-hole-2-activations', BlackHolesSection, 'blackHole[1].activations', '3.5', 3.5],
    ['IPMultPurchases', InfinitySection, 'IPMultPurchases', '1e3', 1000],
    ['galaxy-bulkAmount', AutoBuyersSection, 'auto.galaxy.buyMaxInterval', '2.5', 2.5],
  ] as const)('preserves numeric input for %s', async (id, Component, path, input, expected) => {
    await act(async () => root.render(<Component {...props} />));
    const control = document.getElementById(id);
    expect(control instanceof HTMLInputElement).toBe(true);
    await fill(control as HTMLInputElement, input);
    expect(change).toHaveBeenLastCalledWith(path, expected);
  });

  it('does not replace a cleared numeric input with zero', async () => {
    await act(async () => root.render(<InfinitySection {...props} />));
    await fill(document.getElementById('IPMultPurchases') as HTMLInputElement, '');
    expect(change).toHaveBeenLastCalledWith('IPMultPurchases', NaN);
  });

  it('reads and edits PC legacy resource paths without creating modern fields', async () => {
    const legacyProps = { ...props, saveData: { money: '10', resets: 4, version: 9.5 } as unknown as SectionProps['saveData'] };
    await act(async () => root.render(<GeneralSection {...legacyProps} />));
    const money = container.querySelector('input[type="text"]')! as HTMLInputElement;
    expect(money.value).toBe('10');
    const boosts = document.getElementById('dimensionBoosts') as HTMLInputElement;
    expect(boosts.value).toBe('4');
    await fill(boosts, '4.5');
    expect(change).toHaveBeenLastCalledWith('resets', 4.5);
    await fill(money, '20');
    await act(async () => { money.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
    expect(change).toHaveBeenLastCalledWith('money', '20');
  });

  it('preserves a PC decimal string when Number would lose precision', async () => {
    await act(async () => root.render(<BigNumberField value={10} onChange={change} saveType={SaveType.PC} label="Amount" />));
    const input = container.querySelector('input')!;
    await fill(input, '9007199254740993');
    await act(async () => { input.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
    expect(change).toHaveBeenLastCalledWith('9007199254740993');
  });

  it('preserves unknown mobile decimal metadata during an edit', async () => {
    const value = { mantissa: 1, exponent: 20, future: true };
    await act(async () => root.render(<BigNumberField value={value} onChange={change} saveType={SaveType.Apple} label="Amount" />));
    const input = container.querySelector('input')!;
    await fill(input, '2.5');
    await act(async () => { input.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
    expect(change).toHaveBeenLastCalledWith({ ...value, mantissa: 2.5 });
  });

  it('rejects rounded mobile input without replacing the original decimal', async () => {
    const value = { mantissa: 1, exponent: 20 };
    await act(async () => root.render(<BigNumberField value={value} onChange={change} saveType={SaveType.Android} label="Amount" />));
    const input = container.querySelector('input')!;
    await fill(input, '9007199254740993');
    await act(async () => { input.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
    expect(change).not.toHaveBeenCalled();
    expect(input.value).toBe('1');
  });

  it('shows invalid stored numbers without serializing them to null', async () => {
    await act(async () => root.render(<JsonValueField id="test-json" label="Value" value={[NaN]} onChange={change} />));
    const input = container.querySelector('textarea')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.value).toBe('');
    expect(container.textContent).toContain('cannot be represented');
    expect(change).not.toHaveBeenCalled();
  });

  it('edits study arrays without truncating or discarding future entries', async () => {
    await act(async () => root.render(<EternitySection {...props} />));
    const input = document.getElementById('timestudies-studies') as HTMLTextAreaElement;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, '[1e3,12.1,"future",{"id":42}]');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(change).toHaveBeenLastCalledWith('timestudy.studies', [1000, 12.1, 'future', { id: 42 }]);
  });
});
